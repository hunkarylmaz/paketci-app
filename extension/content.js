// Paketçi Extension - Main Content Script
// Runs on platform pages and handles order detection + button injection

(function() {
  'use strict';
  
  console.log('[Paketçi] Extension aktif');
  
  // Detect current platform
  const detector = detectPlatform();
  if (!detector) {
    console.log('[Paketçi] Desteklenmeyen platform');
    return;
  }
  
  console.log('[Paketçi] Platform:', detector.platform);
  
  let settings = null;
  let observer = null;
  let scanInterval = null;
  
  // Initialize
  async function init() {
    // Load settings
    settings = await loadSettings();
    
    // Check if this platform is enabled
    if (!isPlatformEnabled(detector.platform)) {
      console.log('[Paketçi] Platform devre dışı:', detector.platform);
      return;
    }
    
    // Initial scan
    await scanAndProcess();
    
    // Setup observer for dynamic content
    observer = detector.observe(() => {
      debounce(scanAndProcess, 500);
    });
    
    // Periodic scan (every 5 seconds)
    scanInterval = setInterval(scanAndProcess, 5000);
    
    // Listen for settings changes from popup
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.paketci_settings) {
        settings = changes.paketci_settings.newValue;
        console.log('[Paketçi] Ayarlar güncellendi');
      }
    });
  }
  
  // Load settings from storage
  async function loadSettings() {
    const stored = await Storage.getSettings();
    return {
      masterEnabled: true,
      autoSync: true,
      platforms: {
        yemeksepeti: true,
        getir: true,
        trendyol: true,
        migros: true
      },
      ...stored
    };
  }
  
  // Check if platform is enabled
  function isPlatformEnabled(platform) {
    if (!settings) return false;
    if (!settings.masterEnabled) return false;
    return settings.platforms?.[platform] !== false;
  }
  
  // Debounce helper
  let debounceTimer = null;
  function debounce(fn, ms) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, ms);
  }
  
  // Scan orders and process
  async function scanAndProcess() {
    // Double-check platform is still enabled
    if (!isPlatformEnabled(detector.platform)) {
      return;
    }
    
    const orders = detector.detectOrders();
    
    for (const order of orders) {
      await processOrder(order);
    }
  }
  
  // Process single order
  async function processOrder(order) {
    const apiKey = await Storage.getApiKey();
    
    // Not logged in
    if (!apiKey) {
      console.log('[Paketçi] Giriş yapılmamış');
      return;
    }
    
    // Find order element in DOM
    const orderElement = findOrderElement(order.platformOrderId);
    if (!orderElement) return;
    
    // Already processed (has our badge or button)
    if (orderElement.dataset.paketciProcessed) {
      return;
    }
    
    // Check if already sent (API cache)
    const cacheKey = `${order.platform}_${order.platformOrderId}`;
    const isCached = await Storage.isOrderCached(cacheKey);
    
    if (isCached) {
      markAsSent(orderElement, 'Paketçi\'de');
      return;
    }
    
    // AUTO MODE: Send immediately
    if (settings.autoSync) {
      console.log('[Paketçi] Otomatik gönderiliyor:', order.platformOrderId);
      
      const result = await API.sendOrder(order);
      
      if (result.success) {
        markAsSent(orderElement, 'Kurye Atandı');
        showNotification(
          '✅ Sipariş Gönderildi',
          `${detector.platform}: ${order.customer.name} - ₺${order.payment?.total}`
        );
      } else if (result.error === 'ORDER_ALREADY_SENT') {
        markAsSent(orderElement, 'Paketçi\'de');
      } else {
        console.error('[Paketçi] Gönderim hatası:', result.message);
      }
    } 
    // MANUAL MODE: Inject button
    else {
      console.log('[Paketçi] Buton enjekte ediliyor:', order.platformOrderId);
      
      ButtonInjector.inject(orderElement, order, async (orderData) => {
        const result = await API.sendOrder(orderData);
        
        if (result.success) {
          markAsSent(orderElement, 'Kurye Yolda!');
          showNotification(
            '✅ Kurye Çağrıldı',
            `${orderData.customer.name} - Sipariş Paketçi'ye gönderildi`
          );
        }
        
        return result;
      });
    }
    
    // Mark as processed
    orderElement.dataset.paketciProcessed = 'true';
  }
  
  // Find order element in DOM
  function findOrderElement(orderId) {
    const selectors = [
      CONSTANTS.SELECTORS[detector.platform]?.orderContainer,
      '[data-order-id]',
      '.order-card',
      '.order-item'
    ].filter(Boolean);
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        // Check data attribute
        if (el.dataset.orderId === orderId) {
          return el;
        }
        // Check text content
        if (el.textContent.includes(orderId)) {
          return el;
        }
      }
    }
    
    return null;
  }
  
  // Mark order as sent in UI
  function markAsSent(element, statusText) {
    // Avoid duplicate badges
    if (element.querySelector('.paketci-status-badge')) {
      return;
    }
    
    const platform = detector?.platform || '';
    const platformData = PLATFORM_LOGOS[platform] || PLATFORM_LOGOS.getir;
    
    const badge = document.createElement('div');
    badge.className = 'paketci-status-badge';
    badge.innerHTML = `
      <span style="display: inline-flex; align-items: center; gap: 6px;">
        <span style="font-size: 14px;">${platformData.emoji}</span>
        <span>${platformData.name}: ${statusText}</span>
      </span>
    `;
    badge.style.cssText = `
      background: ${platformData.color};
      color: white;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      margin-top: 8px;
      display: inline-flex;
      align-items: center;
    `;
    
    // Try to find a good insertion point
    const target = element.querySelector('.order-actions, .order-footer, .order-header') || element;
    target.appendChild(badge);
  }
  
  // Platform logos (SVG URLs for notifications)
const PLATFORM_LOGOS = {
  getir: { 
    emoji: '🛵', 
    color: '#5D3EBC',
    name: 'Getir'
  },
  yemeksepeti: { 
    emoji: '🍕', 
    color: '#E31837',
    name: 'Yemeksepeti'
  },
  trendyol: { 
    emoji: '🍔', 
    color: '#F27A1A',
    name: 'Trendyol'
  },
  migros: { 
    emoji: '🥘', 
    color: '#FFC72C',
    name: 'Migros'
  }
};

// Show notification
  function showNotification(title, message) {
    const platform = detector?.platform || '';
    const platformData = PLATFORM_LOGOS[platform] || PLATFORM_LOGOS.getir;
    
    // In-page notification
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-left: 4px solid ${platformData.color};
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 999999;
      max-width: 320px;
      font-family: system-ui, -apple-system, sans-serif;
      animation: slideIn 0.3s ease;
    `;
    notif.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <span style="font-size: 24px;">${platformData.emoji}</span>
        <div style="font-weight: 600; color: #059669;">${title}</div>
      </div>
      <div style="font-size: 13px; color: #374151; padding-left: 34px;">${message}</div>
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notif);
    
    // Auto remove
    setTimeout(() => {
      notif.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => notif.remove(), 300);
    }, 4000);
    
    // Also try Chrome notification
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        action: 'SHOW_NOTIFICATION',
        title,
        message
      }).catch(() => {});
    }
  }
  
  // Detect platform
  function detectPlatform() {
    if (typeof YemeksepetiDetector !== 'undefined' && YemeksepetiDetector.isMatch()) {
      return YemeksepetiDetector;
    }
    if (typeof GetirDetector !== 'undefined' && GetirDetector.isMatch()) {
      return GetirDetector;
    }
    if (typeof TrendyolDetector !== 'undefined' && TrendyolDetector.isMatch()) {
      return TrendyolDetector;
    }
    if (typeof MigrosDetector !== 'undefined' && MigrosDetector.isMatch()) {
      return MigrosDetector;
    }
    return null;
  }
  
  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (observer) observer.disconnect();
    if (scanInterval) clearInterval(scanInterval);
  });
})();
