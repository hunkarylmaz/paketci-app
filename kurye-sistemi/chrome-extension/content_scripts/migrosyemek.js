// Migros Yemek Content Script
(function() {
  'use strict';

  let lastOrderId = null;

  function init() {
    console.log('Paketçiniz: Migros Yemek content script loaded');
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
      '[class*="order-item"]'
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
        '.order-number',
        '[data-testid="order-number"]',
        '[class*="orderNumber"]'
      ]);
      
      const customerName = findText(element, [
        '.customer-name',
        '[data-testid="customer-name"]',
        '.client-name'
      ]);
      
      const customerPhone = findText(element, [
        '.customer-phone',
        '.phone-number',
        '[class*="phone"]'
      ]);
      
      const address = findText(element, [
        '.delivery-address',
        '.address-text',
        '[class*="address"]'
      ]);
      
      const totalAmount = findNumber(element, [
        '.total-amount',
        '.order-total',
        '[class*="total"]'
      ]);
      
      const paymentMethod = findText(element, [
        '.payment-type',
        '.payment-method',
        '[class*="payment"]'
      ]);
      
      const items = extractItems(element);

      if (!orderId || !customerName) return null;

      return {
        platform: 'migrosyemek',
        platformOrderId: orderId,
        customerName: customerName,
        customerPhone: customerPhone || '',
        deliveryAddress: address || '',
        totalAmount: totalAmount || 0,
        paymentMethod: paymentMethod || '',
        notes: '',
        items: items,
        detectedAt: new Date().toISOString(),
        url: window.location.href
      };
    } catch (error) {
      console.error('Paketçiniz: Error extracting Migros order', error);
      return null;
    }
  }

  function extractItems(element) {
    const items = [];
    const itemSelectors = [
      '.product-item',
      '[data-testid="product-item"]',
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
        '.item-name',
        '[class*="name"]'
      ]);
      
      const quantity = findNumber(itemEl, [
        '.quantity',
        '.item-quantity'
      ]) || 1;
      
      const price = findNumber(itemEl, [
        '.price',
        '.unit-price'
      ]) || 0;
      
      if (name) {
        items.push({ name, quantity, price, options: [] });
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
