package com.paketci.service

import android.app.Activity
import android.app.KeyguardManager
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import android.widget.TextView
import timber.log.Timber

/**
 * Gelen arama popup ekranı
 * Ekran kapalıyken bile gösterilir
 */
class CallerIDPopupActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Ekran kapalıyken göster
        showWhenLocked()
        
        setContentView(R.layout.activity_caller_id_popup)
        
        val phoneNumber = intent.getStringExtra("phone_number") ?: "Bilinmeyen Numara"
        
        Timber.d("Caller ID popup showing for: $phoneNumber")
        
        // UI elemanlarını doldur
        findViewById<TextView>(R.id.tvPhoneNumber).text = phoneNumber
        findViewById<TextView>(R.id.tvCallerInfo).text = "Müşteri bilgisi yükleniyor..."
        
        // Backend'ten müşteri bilgilerini çek
        fetchCustomerInfo(phoneNumber)
        
        // Kapat butonu
        findViewById<android.widget.Button>(R.id.btnClose).setOnClickListener {
            finish()
        }
    }
    
    private fun showWhenLocked() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            keyguardManager.requestDismissKeyguard(this, null)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }
    }
    
    private fun fetchCustomerInfo(phoneNumber: String) {
        // Backend API'den müşteri bilgilerini çek
        // TODO: API çağrısı implement edilecek
        
        // Mock veri
        val mockCustomer = CustomerInfo(
            name = "Ahmet Yılmaz",
            address = "Kadıköy, İstanbul",
            orderCount = 15,
            lastOrder = "2 gün önce"
        )
        
        updateUI(mockCustomer)
    }
    
    private fun updateUI(customer: CustomerInfo) {
        findViewById<TextView>(R.id.tvCallerInfo).text = """
            ${customer.name}
            ${customer.address}
            Sipariş: ${customer.orderCount} | Son: ${customer.lastOrder}
        """.trimIndent()
    }
    
    data class CustomerInfo(
        val name: String,
        val address: String,
        val orderCount: Int,
        val lastOrder: String
    )
}
