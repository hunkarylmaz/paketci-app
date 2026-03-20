package com.paketci.service

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.paketci.service.service.BluetoothPrinterService
import com.paketci.service.service.PaketciService
import timber.log.Timber

/**
 * Ana Activity - Servis kontrolü ve Bluetooth yazıcı yönetimi
 */
class MainActivity : AppCompatActivity() {

    private lateinit var bluetoothAdapter: BluetoothAdapter
    private lateinit var printerService: BluetoothPrinterService
    private var isServiceRunning = false
    
    private val discoveredDevices = mutableListOf<BluetoothDevice>()
    private lateinit var deviceListAdapter: ArrayAdapter<String>
    
    companion object {
        private const val PERMISSION_REQUEST_CODE = 1001
        private val REQUIRED_PERMISSIONS = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            arrayOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.BLUETOOTH_SCAN,
                Manifest.permission.BLUETOOTH_CONNECT,
                Manifest.permission.READ_PHONE_STATE,
                Manifest.permission.READ_CALL_LOG
            )
        } else {
            arrayOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.BLUETOOTH,
                Manifest.permission.BLUETOOTH_ADMIN,
                Manifest.permission.READ_PHONE_STATE,
                Manifest.permission.READ_CALL_LOG
            )
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Bluetooth adapter
        val bluetoothManager = getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        bluetoothAdapter = bluetoothManager.adapter
        
        // Printer service
        printerService = BluetoothPrinterService()
        
        // UI setup
        setupUI()
        
        // İzinleri kontrol et
        checkPermissions()
    }
    
    private fun setupUI() {
        // Servis durumu
        val tvServiceStatus = findViewById<TextView>(R.id.tvServiceStatus)
        val btnToggleService = findViewById<Button>(R.id.btnToggleService)
        
        btnToggleService.setOnClickListener {
            if (isServiceRunning) {
                stopPaketciService()
            } else {
                startPaketciService()
            }
        }
        
        // Yazıcı bağlantısı
        val btnScanPrinters = findViewById<Button>(R.id.btnScanPrinters)
        val lvDevices = findViewById<ListView>(R.id.lvDevices)
        val btnPrintTest = findViewById<Button>(R.id.btnPrintTest)
        
        deviceListAdapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, mutableListOf())
        lvDevices.adapter = deviceListAdapter
        
        btnScanPrinters.setOnClickListener {
            scanBluetoothDevices()
        }
        
        lvDevices.setOnItemClickListener { _, _, position, _ ->
            val device = discoveredDevices[position]
            connectToPrinter(device)
        }
        
        btnPrintTest.setOnClickListener {
            printTestReceipt()
        }
        
        // Caller ID durumu
        val tvCallerIdStatus = findViewById<TextView>(R.id.tvCallerIdStatus)
        updateCallerIdStatus()
    }
    
    private fun checkPermissions() {
        val missingPermissions = REQUIRED_PERMISSIONS.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        
        if (missingPermissions.isNotEmpty()) {
            ActivityCompat.requestPermissions(
                this,
                missingPermissions.toTypedArray(),
                PERMISSION_REQUEST_CODE
            )
        }
    }
    
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.all { it == PackageManager.PERMISSION_GRANTED }) {
                Toast.makeText(this, "İzinler verildi", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Bazı izinler reddedildi", Toast.LENGTH_LONG).show()
            }
        }
    }
    
    private fun startPaketciService() {
        val serviceIntent = Intent(this, PaketciService::class.java)
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
        
        isServiceRunning = true
        updateServiceStatus()
        Toast.makeText(this, "Paketçi Servisi başlatıldı", Toast.LENGTH_SHORT).show()
    }
    
    private fun stopPaketciService() {
        val serviceIntent = Intent(this, PaketciService::class.java)
        stopService(serviceIntent)
        
        isServiceRunning = false
        updateServiceStatus()
        Toast.makeText(this, "Paketçi Servisi durduruldu", Toast.LENGTH_SHORT).show()
    }
    
    private fun updateServiceStatus() {
        val tvServiceStatus = findViewById<TextView>(R.id.tvServiceStatus)
        val btnToggleService = findViewById<Button>(R.id.btnToggleService)
        
        if (isServiceRunning) {
            tvServiceStatus.text = "Servis: Çalışıyor 🟢"
            btnToggleService.text = "Servisi Durdur"
        } else {
            tvServiceStatus.text = "Servis: Durdu 🔴"
            btnToggleService.text = "Servisi Başlat"
        }
    }
    
    private fun updateCallerIdStatus() {
        val tvCallerIdStatus = findViewById<TextView>(R.id.tvCallerIdStatus)
        tvCallerIdStatus.text = "Caller ID: Hazır 📞"
    }
    
    private fun scanBluetoothDevices() {
        discoveredDevices.clear()
        deviceListAdapter.clear()
        
        // Eşleşmiş cihazlar
        val pairedDevices: Set<BluetoothDevice>? = bluetoothAdapter.bondedDevices
        pairedDevices?.forEach { device ->
            if (device.bluetoothClass?.majorDeviceClass == android.bluetooth.BluetoothClass.Device.Major.IMAGING) {
                discoveredDevices.add(device)
                deviceListAdapter.add("${device.name}\n${device.address} (Eşleşmiş)")
            }
        }
        
        // Yeni tarama
        if (bluetoothAdapter.isDiscovering) {
            bluetoothAdapter.cancelDiscovery()
        }
        
        val filter = IntentFilter(BluetoothDevice.ACTION_FOUND).apply {
            addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED)
        }
        registerReceiver(discoveryReceiver, filter)
        
        bluetoothAdapter.startDiscovery()
        Toast.makeText(this, "Yazıcılar aranıyor...", Toast.LENGTH_SHORT).show()
    }
    
    private val discoveryReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            when (intent.action) {
                BluetoothDevice.ACTION_FOUND -> {
                    val device: BluetoothDevice? = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                    device?.let {
                        if (!discoveredDevices.contains(it)) {
                            discoveredDevices.add(it)
                            deviceListAdapter.add("${it.name ?: "Bilinmeyen"}\n${it.address}")
                        }
                    }
                }
                BluetoothAdapter.ACTION_DISCOVERY_FINISHED -> {
                    Toast.makeText(context, "Tarama tamamlandı", Toast.LENGTH_SHORT).show()
                    unregisterReceiver(this)
                }
            }
        }
    }
    
    private fun connectToPrinter(device: BluetoothDevice) {
        Toast.makeText(this, "${device.name} bağlanıyor...", Toast.LENGTH_SHORT).show()
        
        val connected = printerService.connect(device.address)
        
        if (connected) {
            Toast.makeText(this, "✅ Yazıcı bağlandı", Toast.LENGTH_SHORT).show()
            findViewById<TextView>(R.id.tvPrinterStatus).text = "Yazıcı: ${device.name} 🖨️"
        } else {
            Toast.makeText(this, "❌ Bağlantı başarısız", Toast.LENGTH_SHORT).show()
        }
    }
    
    private fun printTestReceipt() {
        if (!printerService.isConnected()) {
            Toast.makeText(this, "Önce yazıcıya bağlanın", Toast.LENGTH_SHORT).show()
            return
        }
        
        val testReceipt = BluetoothPrinterService.ReceiptData(
            restaurantName = "TEST RESTORAN",
            receiptNumber = "Fiş #00001",
            date = java.text.SimpleDateFormat("dd.MM.yyyy HH:mm", java.util.Locale.getDefault())
                .format(java.util.Date()),
            items = listOf(
                BluetoothPrinterService.OrderItem("Adana Kebap", 2, "150.00", "300.00"),
                BluetoothPrinterService.OrderItem("Ayran", 2, "15.00", "30.00")
            ),
            total = "330.00",
            paymentMethod = "Nakit",
            customerName = "Test Müşteri",
            customerPhone = "05551234567"
        )
        
        val success = printerService.printReceipt(testReceipt)
        
        if (success) {
            Toast.makeText(this, "✅ Fiş yazdırıldı", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "❌ Yazdırma hatası", Toast.LENGTH_SHORT).show()
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        try {
            unregisterReceiver(discoveryReceiver)
        } catch (e: Exception) {
            // Receiver zaten kaydedilmemiş olabilir
        }
        printerService.disconnect()
    }
}
