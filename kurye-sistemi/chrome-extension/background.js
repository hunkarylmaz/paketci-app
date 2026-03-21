// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Paketçiniz Extension installed');
  
  // Initialize storage
  chrome.storage.local.set({
    settings: {
      apiUrl: 'https://api.paketci.app',
      apiKey: '',
      restaurantId: '',
      autoSync: false,
      notificationEnabled: true,
      platforms: {
        yemeksepeti: { enabled: true, autoSync: false },
        migrosyemek: { enabled: true, autoSync: false },
        trendyolyemek: { enabled: true, autoSync: false },
        getiryemek: { enabled: true, autoSync: false }
      }
    },
    orders: [],
    lastSync: null
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ORDER_DETECTED') {
    handleOrderDetected(request.data, sender);
  } else if (request.type === 'SYNC_ORDER') {
    syncOrderToBackend(request.data);
  } else if (request.type === 'GET_SETTINGS') {
    chrome.storage.local.get('settings', (result) => {
      sendResponse(result.settings);
    });
    return true;
  } else if (request.type === 'SAVE_SETTINGS') {
    chrome.storage.local.set({ settings: request.data }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Handle detected order
async function handleOrderDetected(orderData, sender) {
  const { settings } = await chrome.storage.local.get('settings');
  
  if (!settings) return;
  
  const platform = orderData.platform;
  const platformSettings = settings.platforms?.[platform];
  
  if (!platformSettings?.enabled) return;
  
  // Show notification
  if (settings.notificationEnabled) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: `Yeni Sipariş - ${getPlatformName(platform)}`,
      message: `${orderData.customerName} - ${orderData.totalAmount} TL`,
      buttons: [
        { title: 'Senkronize Et' },
        { title: 'Görüntüle' }
      ]
    });
  }
  
  // Auto sync if enabled
  if (platformSettings.autoSync && settings.apiKey) {
    await syncOrderToBackend(orderData);
  } else {
    // Store order for manual sync
    const { orders } = await chrome.storage.local.get('orders');
    orders.push({
      ...orderData,
      id: generateOrderId(),
      detectedAt: new Date().toISOString(),
      synced: false
    });
    await chrome.storage.local.set({ orders });
  }
}

// Sync order to backend
async function syncOrderToBackend(orderData) {
  try {
    const { settings } = await chrome.storage.local.get('settings');
    
    if (!settings.apiKey || !settings.restaurantId) {
      console.error('API key or restaurant ID not configured');
      return { success: false, error: 'API key not configured' };
    }
    
    const response = await fetch(`${settings.apiUrl}/integrations/extension/order?restaurantId=${settings.restaurantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Extension-Key': settings.apiKey
      },
      body: JSON.stringify({
        restaurantId: settings.restaurantId,
        order: orderData,
        platform: orderData.platform
      })
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      // Mark order as synced
      const { orders } = await chrome.storage.local.get('orders');
      const updatedOrders = orders.map(o => 
        o.platformOrderId === orderData.platformOrderId 
          ? { ...o, synced: true, syncedAt: new Date().toISOString() }
          : o
      );
      await chrome.storage.local.set({ orders: updatedOrders });
      
      // Show success notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Sipariş Senkronize Edildi',
        message: `${orderData.customerName} - ${orderData.totalAmount} TL`
      });
      
      return { success: true };
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Sync error:', error);
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Senkronizasyon Hatası',
      message: error.message
    });
    
    return { success: false, error: error.message };
  }
}

// Handle notification clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    // Sync button
    chrome.storage.local.get('orders', (result) => {
      const unsyncedOrder = result.orders.find(o => !o.synced);
      if (unsyncedOrder) {
        syncOrderToBackend(unsyncedOrder);
      }
    });
  } else if (buttonIndex === 1) {
    // View button - open popup
    chrome.action.openPopup();
  }
});

// Helper functions
function getPlatformName(platform) {
  const names = {
    yemeksepeti: 'Yemeksepeti',
    migrosyemek: 'Migros Yemek',
    trendyolyemek: 'Trendyol Yemek',
    getiryemek: 'Getir Yemek'
  };
  return names[platform] || platform;
}

function generateOrderId() {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Periodic sync check
chrome.alarms.create('syncCheck', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncCheck') {
    checkUnsyncedOrders();
  }
});

async function checkUnsyncedOrders() {
  const { orders, settings } = await chrome.storage.local.get(['orders', 'settings']);
  
  const unsyncedOrders = orders.filter(o => !o.synced);
  
  if (unsyncedOrders.length > 0 && settings?.autoSync) {
    for (const order of unsyncedOrders.slice(0, 5)) {
      await syncOrderToBackend(order);
    }
  }
}
