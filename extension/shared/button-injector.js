// Paketçi Extension - Button Injector
// Injects "Kurye Çağır" button into platform order cards

const ButtonInjector = {
  // Track already injected buttons
  injectedButtons: new Set(),

  // Platform data
  PLATFORM_DATA: {
    getir: { 
      emoji: '🛵', 
      color: '#5D3EBC',
      name: 'Getir'
    },
    yemeksepeti: { 
      emoji: '🍕', 
      color: '#E31837',
      name: 'Yemeksepeti'
    },
    trendyol: { 
      emoji: '🍔', 
      color: '#F27A1A',
      name: 'Trendyol'
    },
    migros: { 
      emoji: '🥘', 
      color: '#FFC72C',
      name: 'Migros'
    }
  },

  // Create button element
  createButton(orderData, onClick) {
    const platform = orderData.platform || '';
    const data = this.PLATFORM_DATA[platform] || this.PLATFORM_DATA.getir;
    
    const button = document.createElement('button');
    button.className = 'paketci-call-courier-btn';
    button.innerHTML = `
      <span class="paketci-logo" style="font-size: 16px; margin-right: 6px;">${data.emoji}</span>
      <span class="paketci-text">Paketçi'den Kurye Çağır</span>
    `;
    
    // Styling
    button.style.cssText = `
      background: ${data.color};
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: 10px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    `;
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-1px)';
      button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
      button.style.filter = 'brightness(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
      button.style.filter = 'brightness(1)';
    });
    });
    
    // Click handler
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Loading state
      button.disabled = true;
      button.innerHTML = `<span class="paketci-logo">⏳</span><span class="paketci-text">Gönderiliyor...</span>`;
      
      try {
        const result = await onClick(orderData);
        
        if (result.success) {
          button.innerHTML = `<span class="paketci-logo" style="font-size: 16px;">${data.emoji}</span><span class="paketci-text">Kurye Yolda!</span>`;
          button.style.background = '#10B981';
          
          // Reset after 3 seconds
          setTimeout(() => {
            button.innerHTML = `<span class="paketci-logo" style="font-size: 16px;">${data.emoji}</span><span class="paketci-text">Paketçi'de</span>`;
          }, 3000);
        } else {
          button.innerHTML = `<span class="paketci-logo">⚠</span><span class="paketci-text">${result.message || 'Hata'}</span>`;
          button.style.background = '#EF4444';
          
          setTimeout(() => {
            button.disabled = false;
            button.innerHTML = `<span class="paketci-logo" style="font-size: 16px;">${data.emoji}</span><span class="paketci-text">Kurye Çağır</span>`;
            button.style.background = data.color;
          }, 3000);
        }
      } catch (error) {
        button.innerHTML = `<span class="paketci-logo">⚠</span><span class="paketci-text">Hata</span>`;
        button.style.background = '#EF4444';
        
        setTimeout(() => {
          button.disabled = false;
          button.innerHTML = `<span class="paketci-logo" style="font-size: 16px;">${data.emoji}</span><span class="paketci-text">Kurye Çağır</span>`;
          button.style.background = data.color;
        }, 3000);
      }
    });
    
    return button;
  },

  // Inject button to order element
  inject(orderElement, orderData, onSendOrder) {
    const orderId = orderData.platformOrderId;
    
    // Check if already injected
    if (this.injectedButtons.has(orderId)) {
      return;
    }
    
    // Find injection point (platform-specific)
    let target = this.findInjectionPoint(orderElement);
    if (!target) {
      target = orderElement;
    }
    
    // Create and inject button
    const button = this.createButton(orderData, onSendOrder);
    target.appendChild(button);
    
    this.injectedButtons.add(orderId);
    
    // Mark element
    orderElement.dataset.paketciInjected = 'true';
  },

  // Find best injection point for button
  findInjectionPoint(orderElement) {
    // Try common selectors
    const selectors = [
      '.order-actions',
      '.order-footer',
      '.order-header',
      '.order-buttons',
      '[data-testid="order-actions"]',
      '.action-buttons'
    ];
    
    for (const selector of selectors) {
      const el = orderElement.querySelector(selector);
      if (el) return el;
    }
    
    // Fallback: first child or self
    return orderElement.firstElementChild || orderElement;
  },

  // Remove all injected buttons
  clear() {
    document.querySelectorAll('.paketci-call-courier-btn').forEach(btn => btn.remove());
    this.injectedButtons.clear();
  }
};

window.ButtonInjector = ButtonInjector;
