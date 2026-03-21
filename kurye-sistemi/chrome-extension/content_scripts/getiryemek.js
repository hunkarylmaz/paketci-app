// Getir Yemek Content Script
(function() {
  'use strict';

  let lastOrderId = null;

  function init() {
    console.log('Paketçiniz: Getir Yemek content script loaded');
    observeOrders();
    checkForOrders();
  }

  function observeOrders() {
    const observer = new MutationObserver(() => {
      checkForOrders();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function checkForOrders() {
    const orderSelectors = [
      '[data-testid="order-item"]',
      '.order-item',
      '[class*="OrderItem"]',
      '.order-card'
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
        
        chrome.runtime.sendMessage({
          type: 'ORDER_DETECTED',
          data: orderData
        });
      }
    });
  }

  function extractOrderData(element) {
    try {
      const orderId = findText(element, [
        '.order-id',
        '[data-testid="order-id"]',
        '.order-number'
      ]);
      
      const customerName = findText(element, [
        '.client-name',
        '.customer-name',
        '[class*="client"]',
        '[class*="customer"]'
      ]);
      
      const customerPhone = findText(element, [
        '.phone-number',
        '.client-phone',
        '[class*="phone"]'
      ]);
      
      const address = findText(element, [
        '.address',
        '.delivery-address',
        '[class*="address"]'
      ]);
      
      const totalAmount = findNumber(element, [
        '.total-price',
        '.order-total',
        '[class*="total"]',
        '[class*="price"]'
      ]);
      
      const paymentMethod = findText(element, [
        '.payment-method',
        '.payment-type',
        '[class*="payment"]'
      ]);
      
      const notes = findText(element, [
        '.client-note',
        '.order-notes',
        '[class*="note"]'
      ]);
      
      const items = extractItems(element);

      if (!orderId || !customerName) return null;

      return {
        platform: 'getiryemek',
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
      console.error('Paketçiniz: Error extracting Getir order', error);
      return null;
    }
  }

  function extractItems(element) {
    const items = [];
    const itemSelectors = [
      '.product-item',
      '.order-product',
      '[data-testid="product"]',
      '[class*="product"]'
    ];
    
    let itemElements = [];
    for (const selector of itemSelectors) {
      itemElements = element.querySelectorAll(selector);
      if (itemElements.length > 0) break;
    }
    
    itemElements.forEach(itemEl => {
      const name = findText(itemEl, [
        '.product-name',
        '.name',
        '[class*="name"]'
      ]);
      
      const quantity = findNumber(itemEl, [
        '.count',
        '.quantity',
        '[class*="count"]'
      ]) || 1;
      
      const price = findNumber(itemEl, [
        '.price',
        '.unit-price'
      ]) || 0;
      
      const options = [];
      const extras = itemEl.querySelectorAll('.extra, [class*="extra"]');
      extras.forEach(extra => {
        options.push(extra.textContent.trim());
      });
      
      if (name) {
        items.push({ name, quantity, price, options });
      }
    });
    
    return items;
  }

  function findText(element, selectors) {
    for (const selector of selectors) {
      const el = element.querySelector(selector);
      if (el) return el.textContent.trim();
    }
    return '';
  }

  function findNumber(element, selectors) {
    const text = findText(element, selectors);
    if (!text) return 0;
    const match = text.match(/[\d.,]+/);
    if (match) {
      return parseFloat(match[0].replace('.', '').replace(',', '.'));
    }
    return 0;
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_CURRENT_ORDER') {
      checkForOrders();
      sendResponse({ order: null });
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
