document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.local.get(['restaurantId', 'apiKey'], function(result) {
    if (result.restaurantId) {
      document.getElementById('restaurant-id').value = result.restaurantId;
    }
    if (result.apiKey) {
      document.getElementById('api-key').value = result.apiKey;
    }
  });

  // Save settings
  document.getElementById('save-settings').addEventListener('click', function() {
    const restaurantId = document.getElementById('restaurant-id').value;
    const apiKey = document.getElementById('api-key').value;
    
    chrome.storage.local.set({
      restaurantId: restaurantId,
      apiKey: apiKey
    }, function() {
      alert('Ayarlar kaydedildi!');
    });
  });

  // Sync Yemeksepeti orders
  document.getElementById('sync-yemeksepeti').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'extractOrders'}, function(response) {
        if (response && response.orders) {
          console.log('Extracted orders:', response.orders);
          alert(`${response.orders.length} sipariş bulundu!`);
        }
      });
    });
  });
});