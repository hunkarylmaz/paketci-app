// Paketçi Extension - Getir Detector

const GetirDetector = {
  platform: 'getir',
  
  isMatch() {
    return window.location.hostname.includes('getir.com');
  },

  detectOrders() {
    const orders = [];
    const selectors = CONSTANTS.SELECTORS.getir;
    
    const containers = document.querySelectorAll(selectors.orderContainer);
    
    containers.forEach(container => {
      try {
        const order = this.parseOrder(container, selectors);
        if (order) orders.push(order);
      } catch (error) {
        console.error('[Paketçi] Getir parse error:', error);
      }
    });
    
    return orders;
  },

  parseOrder(container, selectors) {
    const orderIdEl = container.querySelector(selectors.orderId);
    const customerNameEl = container.querySelector(selectors.customerName);
    const phoneEl = container.querySelector(selectors.customerPhone);
    const addressEl = container.querySelector(selectors.address);
    const totalEl = container.querySelector(selectors.total);
    
    if (!orderIdEl) return null;
    
    const itemEls = container.querySelectorAll(selectors.items);
    const items = Array.from(itemEls).map(el => ({
      name: el.textContent?.trim() || '',
      quantity: 1,
      price: 0
    }));
    
    let total = 0;
    if (totalEl) {
      const totalText = totalEl.textContent?.replace(/[^0-9.,]/g, '').replace(',', '.');
      total = parseFloat(totalText) || 0;
    }
    
    return {
      platform: this.platform,
      platformOrderId: orderIdEl.textContent?.trim() || '',
      customer: {
        name: customerNameEl?.textContent?.trim() || 'Müşteri',
        phone: phoneEl?.textContent?.trim() || '',
        note: ''
      },
      address: {
        full: addressEl?.textContent?.trim() || '',
        city: '',
        district: ''
      },
      items: items,
      payment: {
        method: 'online',
        total: total,
        deliveryFee: 0,
        discount: 0
      },
      timing: {
        orderTime: new Date().toISOString(),
        prepTime: 15
      },
      sourceUrl: window.location.href
    };
  },

  observe(callback) {
    const observer = new MutationObserver((mutations) => {
      let hasNewOrders = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const selectors = CONSTANTS.SELECTORS.getir;
              if (node.matches?.(selectors.orderContainer) || 
                  node.querySelector?.(selectors.orderContainer)) {
                hasNewOrders = true;
              }
            }
          });
        }
      });
      
      if (hasNewOrders) callback();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    return observer;
  }
};

window.GetirDetector = GetirDetector;
