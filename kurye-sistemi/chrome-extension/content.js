// Content script for extracting orders from food delivery platforms
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'extractOrders') {
    const orders = extractOrdersFromPage();
    sendResponse({orders: orders});
  }
  return true;
});

function extractOrdersFromPage() {
  const orders = [];
  const hostname = window.location.hostname;
  
  if (hostname.includes('yemeksepeti')) {
    // Yemeksepeti order extraction logic
    const orderElements = document.querySelectorAll('[data-testid="order-card"], .order-card, .order-item');
    orderElements.forEach(el => {
      orders.push({
        platform: 'Yemeksepeti',
        id: el.querySelector('.order-id')?.textContent || 'Unknown',
        customer: el.querySelector('.customer-name')?.textContent || 'Unknown',
        total: el.querySelector('.order-total')?.textContent || '0',
        status: el.querySelector('.order-status')?.textContent || 'Unknown'
      });
    });
  } else if (hostname.includes('migrosyemek')) {
    // Migros Yemek extraction
    const orderElements = document.querySelectorAll('.order-row, .order-card');
    orderElements.forEach(el => {
      orders.push({
        platform: 'Migros Yemek',
        id: el.querySelector('.order-id')?.textContent || 'Unknown',
        customer: el.querySelector('.customer-name')?.textContent || 'Unknown',
        total: el.querySelector('.order-total')?.textContent || '0',
        status: el.querySelector('.order-status')?.textContent || 'Unknown'
      });
    });
  } else if (hostname.includes('trendyolyemek')) {
    // Trendyol Yemek extraction
    const orderElements = document.querySelectorAll('.order-item, [data-testid="order"]');
    orderElements.forEach(el => {
      orders.push({
        platform: 'Trendyol Yemek',
        id: el.querySelector('.order-id')?.textContent || 'Unknown',
        customer: el.querySelector('.customer-name')?.textContent || 'Unknown',
        total: el.querySelector('.order-total')?.textContent || '0',
        status: el.querySelector('.order-status')?.textContent || 'Unknown'
      });
    });
  } else if (hostname.includes('getiryemek')) {
    // Getir Yemek extraction
    const orderElements = document.querySelectorAll('.order-card, .order-row');
    orderElements.forEach(el => {
      orders.push({
        platform: 'Getir Yemek',
        id: el.querySelector('.order-id')?.textContent || 'Unknown',
        customer: el.querySelector('.customer-name')?.textContent || 'Unknown',
        total: el.querySelector('.order-total')?.textContent || '0',
        status: el.querySelector('.order-status')?.textContent || 'Unknown'
      });
    });
  }
  
  return orders;
}

// Auto-extract on page load
setTimeout(() => {
  const orders = extractOrdersFromPage();
  if (orders.length > 0) {
    chrome.runtime.sendMessage({
      action: 'ordersFound',
      orders: orders,
      url: window.location.href
    });
  }
}, 2000);