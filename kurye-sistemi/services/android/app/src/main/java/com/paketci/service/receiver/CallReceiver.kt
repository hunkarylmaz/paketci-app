package com.paketci.service.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.TelephonyManager
import timber.log.Timber

class CallReceiver : BroadcastReceiver() {

    companion object {
        private var lastState = TelephonyManager.CALL_STATE_IDLE
        private var lastNumber: String? = null
        private var callStartTime: Long = 0
    }

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != TelephonyManager.ACTION_PHONE_STATE_CHANGED) {
            return
        }

        val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE)
        val phoneNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER)

        when (state) {
            TelephonyManager.EXTRA_STATE_RINGING -> {
                // Gelen arama
                phoneNumber?.let { number ->
                    lastNumber = number
                    callStartTime = System.currentTimeMillis()
                    handleIncomingCall(context, number)
                }
            }
            TelephonyManager.EXTRA_STATE_OFFHOOK -> {
                // Arama cevaplandı
                Timber.d("Call answered: $lastNumber")
            }
            TelephonyManager.EXTRA_STATE_IDLE -> {
                // Arama sonlandı
                if (lastNumber != null) {
                    handleCallEnded(context, lastNumber!!)
                    lastNumber = null
                }
            }
        }
    }

    private fun handleIncomingCall(context: Context, phoneNumber: String) {
        Timber.d("Incoming call from: $phoneNumber")

        // Backend'e bildirim gönder
        val serviceIntent = Intent(context, PaketciService::class.java).apply {
            action = "CALLER_ID"
            putExtra("phone_number", phoneNumber)
            putExtra("timestamp", System.currentTimeMillis())
        }
        context.startForegroundService(serviceIntent)

        // Ekranda popup göster (Activity başlat)
        val popupIntent = Intent(context, CallerIDPopupActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("phone_number", phoneNumber)
        }
        context.startActivity(popupIntent)
    }

    private fun handleCallEnded(context: Context, phoneNumber: String) {
        val duration = System.currentTimeMillis() - callStartTime
        Timber.d("Call ended: $phoneNumber, Duration: ${duration}ms")

        // Çağrı süresini backend'e gönder
        // Implementation...
    }
}
