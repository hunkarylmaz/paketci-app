package com.paketci.service.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.BatteryManager
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import androidx.lifecycle.LifecycleService
import androidx.lifecycle.lifecycleScope
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.paketci.service.MainActivity
import com.paketci.service.R
import kotlinx.coroutines.launch
import org.java_websocket.client.WebSocketClient
import org.java_websocket.handshake.ServerHandshake
import org.json.JSONObject
import timber.log.Timber
import java.net.URI
import java.util.concurrent.TimeUnit

class PaketciService : LifecycleService() {

    companion object {
        const val CHANNEL_ID = "PaketciServiceChannel"
        const val NOTIFICATION_ID = 1
        const val LOCATION_INTERVAL = 5000L // 5 saniye
        const val WEBSOCKET_URL = "wss://api.paketci.app/ws"
    }

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    private lateinit var wakeLock: PowerManager.WakeLock
    private var webSocketClient: WebSocketClient? = null
    private var isRunning = false

    // Ayarlar (SharedPreferences'dan gelecek)
    private var apiKey: String = ""
    private var courierId: String = ""
    private var restaurantId: String = ""

    override fun onCreate() {
        super.onCreate()
        Timber.d("PaketciService created")
        
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        acquireWakeLock()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId)
        
        if (isRunning) {
            Timber.d("Service already running")
            return START_STICKY
        }

        // Ayarları yükle
        loadSettings()

        // Foreground service başlat
        startForeground(NOTIFICATION_ID, createNotification())
        
        // Servisleri başlat
        startLocationTracking()
        connectWebSocket()
        
        isRunning = true
        Timber.d("PaketciService started")

        return START_STICKY
    }

    override fun onBind(intent: Intent): IBinder? {
        super.onBind(intent)
        return null
    }

    override fun onDestroy() {
        super.onDestroy()
        isRunning = false
        stopLocationTracking()
        disconnectWebSocket()
        wakeLock.release()
        Timber.d("PaketciService destroyed")
    }

    private fun loadSettings() {
        val prefs = getSharedPreferences("paketci_prefs", Context.MODE_PRIVATE)
        apiKey = prefs.getString("api_key", "") ?: ""
        courierId = prefs.getString("courier_id", "") ?: ""
        restaurantId = prefs.getString("restaurant_id", "") ?: ""
    }

    private fun acquireWakeLock() {
        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "Paketci::LocationWakeLock"
        )
        wakeLock.acquire(TimeUnit.HOURS.toMillis(1))
    }

    // ============================================
    // NOTIFICATION
    // ============================================

    private fun createNotification(): Notification {
        createNotificationChannel()

        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Paketçi Kurye")
            .setContentText("Konum takibi aktif")
            .setSmallIcon(R.drawable.ic_notification)
            .setOngoing(true)
            .setContentIntent(pendingIntent)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Paketçi Kurye Servisi",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Kurye konum takip servisi"
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }

    // ============================================
    // LOCATION TRACKING
    // ============================================

    private fun startLocationTracking() {
        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            LOCATION_INTERVAL
        ).apply {
            setMinUpdateIntervalMillis(3000)
            setWaitForAccurateLocation(true)
        }.build()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                result.lastLocation?.let { location ->
                    lifecycleScope.launch {
                        sendLocationUpdate(location)
                    }
                }
            }
        }

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                mainLooper
            )
            Timber.d("Location tracking started")
        } catch (e: SecurityException) {
            Timber.e(e, "Location permission not granted")
        }
    }

    private fun stopLocationTracking() {
        fusedLocationClient.removeLocationUpdates(locationCallback)
        Timber.d("Location tracking stopped")
    }

    private fun sendLocationUpdate(location: android.location.Location) {
        val batteryLevel = getBatteryLevel()
        
        val payload = JSONObject().apply {
            put("type", "location:update")
            put("courierId", courierId)
            put("latitude", location.latitude)
            put("longitude", location.longitude)
            put("accuracy", location.accuracy)
            put("altitude", location.altitude)
            put("speed", location.speed * 3.6f) // m/s to km/h
            put("heading", location.bearing)
            put("batteryLevel", batteryLevel)
            put("timestamp", System.currentTimeMillis())
        }

        webSocketClient?.send(payload.toString())
        Timber.d("Location sent: ${location.latitude}, ${location.longitude}")
    }

    private fun getBatteryLevel(): Int {
        val batteryManager = getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        return batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
    }

    // ============================================
    // WEBSOCKET
    // ============================================

    private fun connectWebSocket() {
        val uri = URI("$WEBSOCKET_URL?token=$apiKey")
        
        webSocketClient = object : WebSocketClient(uri) {
            override fun onOpen(handshakedata: ServerHandshake?) {
                Timber.d("WebSocket connected")
                
                // Bağlantı bilgilerini gönder
                val connectMsg = JSONObject().apply {
                    put("type", "courier:connect")
                    put("courierId", courierId)
                    put("restaurantId", restaurantId)
                }
                send(connectMsg.toString())
            }

            override fun onMessage(message: String?) {
                message?.let { handleWebSocketMessage(it) }
            }

            override fun onClose(code: Int, reason: String?, remote: Boolean) {
                Timber.d("WebSocket closed: $reason")
                // Yeniden bağlan
                reconnectWebSocket()
            }

            override fun onError(ex: Exception?) {
                Timber.e(ex, "WebSocket error")
            }
        }

        webSocketClient?.connect()
    }

    private fun disconnectWebSocket() {
        webSocketClient?.close()
        webSocketClient = null
    }

    private fun reconnectWebSocket() {
        lifecycleScope.launch {
            kotlinx.coroutines.delay(5000)
            if (isRunning) {
                connectWebSocket()
            }
        }
    }

    private fun handleWebSocketMessage(message: String) {
        try {
            val json = JSONObject(message)
            val type = json.getString("type")

            when (type) {
                "order:assigned" -> {
                    val orderId = json.getString("orderId")
                    showOrderNotification("Yeni Sipariş", "Sipariş #$orderId atandı")
                }
                "order:cancelled" -> {
                    val orderId = json.getString("orderId")
                    showOrderNotification("Sipariş İptal", "Sipariş #$orderId iptal edildi")
                }
                "emergency:alert" -> {
                    // Acil durum bildirimi
                }
                "break:approved" -> {
                    showOrderNotification("Mola Onaylandı", "Mola talebiniz onaylandı")
                }
                else -> {
                    Timber.d("Unknown message type: $type")
                }
            }
        } catch (e: Exception) {
            Timber.e(e, "Error handling WebSocket message")
        }
    }

    private fun showOrderNotification(title: String, body: String) {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(R.drawable.ic_notification)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}
