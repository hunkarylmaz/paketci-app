// Paketçi Extension - Background Service Worker
// Handles API communication and cross-tab messaging

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sender).then(sendResponse);
  return true; // Async response
});

// Handle incoming messages
async function handleMessage(request, sender) {
  switch (request.action) {
    case 'SEND_ORDER':
      return await sendOrderToApi(request.data);
    
    case 'VALIDATE_API_KEY':
      return await validateApiKey(request.apiKey);
    
    case 'GET_SETTINGS':
      return await getSettings();
    
    case 'UPDATE_SETTINGS':
      return await updateSettings(request.settings);
    
    case 'TEST_CONNECTION':
      return await testConnection();
    
    case 'SHOW_NOTIFICATION':
      showNotification(request.title, request.message);
      return { success: true };
    
    default:
      return { success: false, error: 'Unknown action' };
  }
}

// Send order to Paketçi API
async function sendOrderToApi(orderData) {
  try {
    const { paketci_api_key } = await chrome.storage.local.get('paketci_api_key');
    
    if (!paketci_api_key) {
      return { success: false, error: 'API key not found' };
    }
    
    const response = await fetch('https://api.paketci.app/v1/extension/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${paketci_api_key}`
      },
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || 'API_ERROR',
        message: data.message 
      };
    }
    
    // Show success notification
    showNotification(
      'Sipariş Gönderildi',
      `${orderData.platform} siparişi Paketçi'ye aktarıldı`
    );
    
    return { success: true, data };
    
  } catch (error) {
    console.error('[Paketçi Background] Send order error:', error);
    return { success: false, error: 'NETWORK_ERROR' };
  }
}

// Validate API key
async function validateApiKey(apiKey) {
  try {
    const response = await fetch('https://api.paketci.app/v1/extension/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Save valid credentials
      await chrome.storage.local.set({
        'paketci_api_key': apiKey,
        'paketci_restaurant_id': data.data.restaurantId,
        'paketci_restaurant_name': data.data.restaurantName
      });
      
      return { valid: true, data: data.data };
    } else {
      return { valid: false, error: data.message };
    }
    
  } catch (error) {
    return { valid: false, error: 'Bağlantı hatası' };
  }
}

// Get settings from storage
async function getSettings() {
  const { paketci_settings } = await chrome.storage.local.get('paketci_settings');
  return { 
    success: true, 
    settings: paketci_settings || {
      autoSync: true,
      soundNotification: true,
      desktopNotification: true,
      platforms: {
        yemeksepeti: true,
        getir: true,
        trendyol: true,
        migros: true
      }
    }
  };
}

// Update settings
async function updateSettings(settings) {
  await chrome.storage.local.set({ 'paketci_settings': settings });
  return { success: true };
}

// Test API connection
async function testConnection() {
  try {
    const { paketci_api_key } = await chrome.storage.local.get('paketci_api_key');
    
    if (!paketci_api_key) {
      return { connected: false, error: 'API key bulunamadı' };
    }
    
    const response = await fetch('https://api.paketci.app/v1/extension/health', {
      headers: {
        'Authorization': `Bearer ${paketci_api_key}`
      }
    });
    
    return { connected: response.ok };
    
  } catch (error) {
    return { connected: false, error: 'Bağlantı hatası' };
  }
}

// Show notification
function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'assets/icon48.png',
    title,
    message
  });
}

// On install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.local.set({
      'paketci_settings': {
        autoSync: false, // Default to manual for safety
        soundNotification: true,
        desktopNotification: true,
        confirmBeforeSend: false,
        platforms: {
          yemeksepeti: true,
          getir: true,
          trendyol: true,
          migros: true
        }
      }
    });
    
    // Show welcome notification
    showNotification(
      'Paketçi Eklentisi Yüklendi',
      'API Key\'nizi girerek başlayın'
    );
  }
});

// On tab update - check if we should inject content script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const supportedDomains = [
      'yemeksepeti.com',
      'getir.com',
      'trendyol.com',
      'migros.com.tr'
    ];
    
    const isSupported = supportedDomains.some(domain => 
      tab.url?.includes(domain)
    );
    
    if (isSupported) {
      // Content script will auto-inject via manifest
      console.log('[Paketçi] Desteklenen platform algılandı:', tab.url);
    }
  }
});
