// Paketçi Extension - Constants
// Platform selectors and configurations

const CONSTANTS = {
  // API Configuration
  API_BASE_URL: 'https://api.paketci.app/v1',
  // API_BASE_URL: 'http://localhost:4000', // Development
  
  // Platform definitions
  PLATFORMS: {
    YEMEKSEPETI: {
      id: 'yemeksepeti',
      name: 'Yemeksepeti',
      icon: '🍕',
      domains: ['yemeksepeti.com'],
      color: '#E31837'
    },
    GETIR: {
      id: 'getir',
      name: 'Getir Yemek',
      icon: '🛵',
      domains: ['getir.com'],
      color: '#5D3EBC'
    },
    TRENDYOL: {
      id: 'trendyol',
      name: 'Trendyol Yemek',
      icon: '🍔',
      domains: ['trendyol.com'],
      color: '#F27A1A'
    },
    MIGROS: {
      id: 'migros',
      name: 'Migros Yemek',
      icon: '🥘',
      domains: ['migros.com.tr'],
      color: '#FFC72C'
    }
  },

  // DOM Selectors for each platform
  SELECTORS: {
    yemeksepeti: {
      orderContainer: '[data-testid="order-card"], .order-card, .order-item',
      orderId: '.order-id, [data-testid="order-number"]',
      customerName: '.customer-name, .customer-info .name',
      customerPhone: '.customer-phone, .phone-number',
      address: '.delivery-address, .address-text',
      items: '.order-item-name, .product-name',
      total: '.order-total, .total-amount',
      paymentMethod: '.payment-type, .payment-method'
    },
    getir: {
      orderContainer: '.order-card, [data-testid="order"]',
      orderId: '.order-number, .order-id',
      customerName: '.customer-name',
      customerPhone: '.customer-phone',
      address: '.address',
      items: '.item-name',
      total: '.total-price',
      paymentMethod: '.payment-method'
    },
    trendyol: {
      orderContainer: '.order-row, .order-item',
      orderId: '.order-number',
      customerName: '.customer-name',
      customerPhone: '.phone',
      address: '.address',
      items: '.product-name',
      total: '.total-amount',
      paymentMethod: '.payment-type'
    },
    migros: {
      orderContainer: '.order-card',
      orderId: '.order-id',
      customerName: '.customer',
      customerPhone: '.phone',
      address: '.address',
      items: '.item',
      total: '.total',
      paymentMethod: '.payment'
    }
  },

  // Storage keys
  STORAGE_KEYS: {
    API_KEY: 'paketci_api_key',
    RESTAURANT_ID: 'paketci_restaurant_id',
    RESTAURANT_NAME: 'paketci_restaurant_name',
    SETTINGS: 'paketci_settings',
    ORDER_CACHE: 'paketci_order_cache',
    LAST_SYNC: 'paketci_last_sync'
  },

  // Default settings
  DEFAULT_SETTINGS: {
    autoSync: true,
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
};

// Expose to window for content scripts
window.CONSTANTS = CONSTANTS;
