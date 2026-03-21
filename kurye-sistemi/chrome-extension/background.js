// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Paketçiniz extension installed');
  
  // Initialize storage
  chrome.storage.local.set({
    orders: [],
    lastSync: null,
    autoSync: true
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ordersFound') {
    // Store found orders
    chrome.storage.local.get(['orders'], (result) => {
      const existingOrders = result.orders || [];
      const newOrders = request.orders.filter(newOrder => 
        !existingOrders.some(existing => existing.id === newOrder.id)
      );
      
      const updatedOrders = [...existingOrders, ...newOrders];
      chrome.storage.local.set({ 
        orders: updatedOrders,
        lastSync: new Date().toISOString()
      });
      
      // Show notification if new orders found
      if (newOrders.length > 0) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Yeni Siparişler Bulundu!',
          message: `${newOrders.length} yeni sipariş ${request.platform || 'platform'} üzerinden bulundu.`
        });
      }
    });
  }
  return true;
});

// Context menu for quick actions
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'importOrders',
    title: 'Siparişleri Paketçiniz\'e Aktar',
    contexts: ['page'],
    documentUrlPatterns: [
      '*://*.yemeksepeti.com/*',
      '*://*.migrosyemek.com/*',
      '*://*.trendyolyemek.com/*',
      '*://*.getiryemek.com/*'
    ]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'importOrders') {
    chrome.tabs.sendMessage(tab.id, {action: 'extractOrders'}, (response) => {
      if (response && response.orders) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Siparişler Aktarıldı',
          message: `${response.orders.length} sipariş başarıyla aktarıldı.`
        });
      }
    });
  }
});