package com.paketci.service.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.paketci.service.service.PaketciService
import timber.log.Timber

/**
 * Cihaz açılışında servisi otomatik başlatır
 */
class BootReceiver : BroadcastReceiver() {
    
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            Timber.d("Boot completed, starting PaketciService")
            
            val serviceIntent = Intent(context, PaketciService::class.java)
            
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }
        }
    }
}
