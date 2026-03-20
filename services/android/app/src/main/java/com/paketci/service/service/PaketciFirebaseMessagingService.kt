package com.paketci.service.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.paketci.service.MainActivity
import com.paketci.service.R
import timber.log.Timber

class PaketciFirebaseMessagingService : FirebaseMessagingService() {

    companion object {
        const val CHANNEL_ID_ORDERS = "paketci_orders"
        const val CHANNEL_ID_GENERAL = "paketci_general"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Timber.d("New FCM token: $token")
        
        // Token'ı backend'e gönder
        sendTokenToServer(token)
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        Timber.d("FCM message received from: ${message.from}")

        val data = message.data
        val notification = message.notification

        when (data["type"]) {
            "NEW_ORDER" -> showOrderNotification(data, notification)
            "ORDER_CANCELLED" -> showOrderNotification(data, notification)
            "ORDER_ASSIGNED" -> showOrderNotification(data, notification, highPriority = true)
            "COURIER_NEARBY" -> showGeneralNotification(data, notification)
            "EMERGENCY_ALERT" -> showEmergencyNotification(data)
            else -> showGeneralNotification(data, notification)
        }
    }

    private fun showOrderNotification(
        data: Map<String, String>,
        notification: RemoteMessage.Notification?,
        highPriority: Boolean = false
    ) {
        val title = notification?.title ?: data["title"] ?: "Paketçi"
        val body = notification?.body ?: data["body"] ?: "Yeni bildirim"
        val orderId = data["orderId"]

        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra("orderId", orderId)
            putExtra("notificationType", data["type"])
        }

        val pendingIntent = PendingIntent.getActivity(
            this,
            orderId?.hashCode() ?: 0,
            intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )

        val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

        val notificationBuilder = NotificationCompat.Builder(this, CHANNEL_ID_ORDERS)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setSound(soundUri)
            .setContentIntent(pendingIntent)
            .setPriority(if (highPriority) NotificationCompat.PRIORITY_HIGH else NotificationCompat.PRIORITY_DEFAULT)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)

        // Yüksek öncelikli bildirimler için ses ve titreşim
        if (highPriority) {
            notificationBuilder
                .setVibrate(longArrayOf(0, 500, 200, 500))
                .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM))
        }

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(System.currentTimeMillis().toInt(), notificationBuilder.build())
    }

    private fun showGeneralNotification(
        data: Map<String, String>,
        notification: RemoteMessage.Notification?
    ) {
        val title = notification?.title ?: data["title"] ?: "Paketçi"
        val body = notification?.body ?: data["body"] ?: "Yeni bildirim"

        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE
        )

        val notificationBuilder = NotificationCompat.Builder(this, CHANNEL_ID_GENERAL)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(System.currentTimeMillis().toInt(), notificationBuilder.build())
    }

    private fun showEmergencyNotification(data: Map<String, String>) {
        val title = "🚨 ACİL DURUM"
        val body = data["message"] ?: "Acil durum bildirimi"

        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE
        )

        val notificationBuilder = NotificationCompat.Builder(this, CHANNEL_ID_ORDERS)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVibrate(longArrayOf(0, 1000, 500, 1000, 500, 1000))
            .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM))
            .setContentIntent(pendingIntent)

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(9999, notificationBuilder.build())
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(NotificationManager::class.java)

            // Sipariş kanalı
            val orderChannel = NotificationChannel(
                CHANNEL_ID_ORDERS,
                "Sipariş Bildirimleri",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Yeni sipariş ve sipariş durumu bildirimleri"
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 200, 500)
            }

            // Genel kanal
            val generalChannel = NotificationChannel(
                CHANNEL_ID_GENERAL,
                "Genel Bildirimler",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Genel sistem bildirimleri"
            }

            notificationManager.createNotificationChannels(listOf(orderChannel, generalChannel))
        }
    }

    private fun sendTokenToServer(token: String) {
        // FCM token'ı backend'e gönder
        // Implementation...
        Timber.d("Sending FCM token to server: $token")
    }
}
