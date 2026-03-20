// Paketçi Extension - Platform Detectors
// Yemeksepeti order detector

const YemeksepetiDetector = {
  platform: 'yemeksepeti',
  
  // Check if current page is Yemeksepeti
  isMatch() {
    return window.location.hostname.includes('yemeksepeti.com');
  },

  // Detect orders on the page
  detectOrders() {
    const orders = [];
    const selectors = CONSTANTS.SELECTORS.yemeksepeti;
    
    // Find order containers
    const containers = document.querySelectorAll(selectors.orderContainer);
    
    containers.forEach(container => {
      try {
        const order = this.parseOrder(container, selectors);
        if (order) orders.push(order);
      } catch (error) {
        console.error('[Paketçi] Parse error:', error);
      }
    });
    
    return orders;
  },

  // Parse single order from DOM
  parseOrder(container, selectors) {
    const orderIdEl = container.querySelector(selectors.orderId);
    const customerNameEl = container.querySelector(selectors.customerName);
    const phoneEl = container.querySelector(selectors.customerPhone);
    const addressEl = container.querySelector(selectors.address);
    const totalEl = container.querySelector(selectors.total);
    
    if (!orderIdEl) return null;
    
    // Extract items
    const itemEls = container.querySelectorAll(selectors.items);
    const items = Array.from(itemEls).map(el => ({
      name: el.textContent?.trim() || '',
      quantity: 1,
      price: 0
    }));
    
    // Parse total
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

  // Setup MutationObserver for dynamic content
  observe(callback) {
    const observer = new MutationObserver((mutations) => {
      let hasNewOrders = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const selectors = CONSTANTS.SELECTORS.yemeksepeti;
              if (node.matches?.(selectors.orderContainer) || 
                  node.querySelector?.(selectors.orderContainer)) {
                hasNewOrders = true;
              }
            }
          });
        }
      });
      
      if (hasNewOrders) {
        callback();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return observer;
  }
};

// Expose
window.YemeksepetiDetector = YemeksepetiDetector;
