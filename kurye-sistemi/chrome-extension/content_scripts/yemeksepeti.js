// Yemeksepeti Content Script
(function() {
  'use strict';

  let lastOrderId = null;
  let observer = null;

  // Initialize
  function init() {
    console.log('Paketçiniz: Yemeksepeti content script loaded');
    
    // Start observing DOM changes
    observeOrders();
    
    // Check for orders immediately
    checkForOrders();
  }

  // Observe DOM for new orders
  function observeOrders() {
    const targetNode = document.body;
    
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          checkForOrders();
        }
      }
    });
    
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
  }

  // Check for orders in the page
  function checkForOrders() {
    // Yemeksepeti order selectors
    const orderSelectors = [
      '[data-testid="order-card"]',
      '.order-card',
      '[class*="OrderCard"]',
      '[class*="order-card"]',
      '.ys-order-item'
    ];
    
    let orderElements = [];
    
    for (const selector of orderSelectors) {
      orderElements = document.querySelectorAll(selector);
      if (orderElements.length > 0) break;
    }
    
    orderElements.forEach(orderEl => {
      const orderData = extractOrderData(orderEl);
      
      if (orderData && orderData.platformOrderId !== lastOrderId) {
        lastOrderId = orderData.platformOrderId;
        
        // Send to background
        chrome.runtime.sendMessage({
          type: 'ORDER_DETECTED',
          data: orderData
        });
      }
    });
  }

  // Extract order data from element
  function extractOrderData(element) {
    try {
      const orderId = findText(element, [
        '[data-testid="order-id"]',
        '.order-id',
        '[class*="order-id"]',
        '.order-number'
      ]);
      
      const customerName = findText(element, [
        '[data-testid="customer-name"]',
        '.customer-name',
        '[class*="customerName"]',
        '[class*="customer-name"]'
      ]);
      
      const customerPhone = findText(element, [
        '[data-testid="customer-phone"]',
        '.customer-phone',
        '[class*="phone"]'
      ]);
      
      const address = findText(element, [
        '[data-testid="delivery-address"]',
        '.delivery-address',
        '[class*="address"]'
      ]);
      
      const totalAmount = findNumber(element, [
        '[data-testid="order-total"]',
        '.order-total',
        '[class*="total"]',
        '[class*="price"]'
      ]);
      
      const paymentMethod = findText(element, [
        '[data-testid="payment-method"]',
        '.payment-method',
        '[class*="payment"]'
      ]);
      
      const notes = findText(element, [
        '[data-testid="order-notes"]',
        '.order-notes',
        '[class*="notes"]'
      ]);
      
      const items = extractItems(element);

      if (!orderId || !customerName) return null;

      return {
        platform: 'yemeksepeti',
        platformOrderId: orderId,
        customerName: customerName,
        customerPhone: customerPhone || '',
        deliveryAddress: address || '',
        totalAmount: totalAmount || 0,
        paymentMethod: paymentMethod || '',
        notes: notes || '',
        items: items,
        detectedAt: new Date().toISOString(),
        url: window.location.href
      };
    } catch (error) {
      console.error('Paketçiniz: Error extracting order data', error);
      return null;
    }
  }

  // Extract items from order
  function extractItems(element) {
    const items = [];
    const itemSelectors = [
      '[data-testid="order-item"]',
      '.order-item',
      '[class*="orderItem"]',
      '[class*="item"]'
    ];
    
    let itemElements = [];
    for (const selector of itemSelectors) {
      itemElements = element.querySelectorAll(selector);
      if (itemElements.length > 0) break;
    }
    
    itemElements.forEach(itemEl => {
      const name = findText(itemEl, [
        '[data-testid="item-name"]',
        '.item-name',
        '[class*="name"]'
      ]);
      
      const quantity = findNumber(itemEl, [
        '[data-testid="item-quantity"]',
        '.item-quantity',
        '[class*="quantity"]'
      ]) || 1;
      
      const price = findNumber(itemEl, [
        '[data-testid="item-price"]',
        '.item-price',
        '[class*="price"]'
      ]) || 0;
      
      if (name) {
        items.push({
          name: name,
          quantity: quantity,
          price: price,
          options: []
        });
      }
    });
    
    return items;
  }

  // Helper: Find text by selectors
  function findText(element, selectors) {
    for (const selector of selectors) {
      const el = element.querySelector(selector);
      if (el) {
        return el.textContent.trim();
      }
    }
    return '';
  }

  // Helper: Find number by selectors
  function findNumber(element, selectors) {
    const text = findText(element, selectors);
    if (!text) return 0;
    
    // Extract number from text (e.g., "150,00 TL" -> 150.00)
    const match = text.match(/[\d.,]+/);
    if (match) {
      return parseFloat(match[0].replace('.', '').replace(',', '.'));
    }
    return 0;
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_CURRENT_ORDER') {
      checkForOrders();
      const orderData = extractOrderData(document.querySelector('[data-testid="order-detail"]') || document.body);
      sendResponse({ order: orderData });
    } else if (request.type === 'SYNC_CURRENT_ORDER') {
      checkForOrders();
      chrome.runtime.sendMessage({
        type: 'SYNC_ORDER',
        data: request.order
      });
      sendResponse({ success: true });
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
