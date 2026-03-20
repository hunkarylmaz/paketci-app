// Paketçi Extension - API Client
// Communication with Paketçi Backend

const API = {
  baseUrl: CONSTANTS.API_BASE_URL,

  // Get headers with authentication
  async getHeaders() {
    const apiKey = await Storage.getApiKey();
    return {
      'Content-Type': 'application/json',
      'Authorization': apiKey ? `Bearer ${apiKey}` : '',
      'X-Extension-Version': chrome.runtime.getManifest().version,
      'X-Extension-Id': chrome.runtime.id
    };
  },

  // Validate API Key
  async validateApiKey(apiKey) {
    try {
      const response = await fetch(`${this.baseUrl}/extension/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        return { valid: false, error: error.message };
      }
      
      const data = await response.json();
      return { valid: true, data };
    } catch (error) {
      console.error('[Paketçi] API validation error:', error);
      return { valid: false, error: 'Bağlantı hatası' };
    }
  },

  // Send order to Paketçi
  async sendOrder(orderData) {
    try {
      // Check if already sent
      const cacheKey = `${orderData.platform}_${orderData.platformOrderId}`;
      const isCached = await Storage.isOrderCached(cacheKey);
      
      if (isCached) {
        return { 
          success: false, 
          error: 'ORDER_ALREADY_SENT',
          message: 'Bu sipariş zaten gönderilmiş'
        };
      }

      const headers = await this.getHeaders();
      
      const response = await fetch(`${this.baseUrl}/extension/order`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || 'UNKNOWN_ERROR',
          message: data.message || 'Bir hata oluştu'
        };
      }

      // Cache the order
      await Storage.cacheOrder(cacheKey, data.data?.paketciOrderId);

      return { success: true, data: data.data };
    } catch (error) {
      console.error('[Paketçi] Send order error:', error);
      return { 
        success: false, 
        error: 'NETWORK_ERROR',
        message: 'Bağlantı hatası, tekrar deneyin'
      };
    }
  },

  // Get order status
  async getOrderStatus(paketciOrderId) {
    try {
      const headers = await this.getHeaders();
      
      const response = await fetch(`${this.baseUrl}/extension/order/${paketciOrderId}/status`, {
        headers
      });

      if (!response.ok) {
        return { success: false };
      }

      const data = await response.json();
      return { success: true, data: data.data };
    } catch (error) {
      console.error('[Paketçi] Get status error:', error);
      return { success: false };
    }
  },

  // Get restaurant settings
  async getSettings() {
    try {
      const headers = await this.getHeaders();
      
      const response = await fetch(`${this.baseUrl}/extension/settings`, {
        headers
      });

      if (!response.ok) {
        return { success: false };
      }

      const data = await response.json();
      return { success: true, data: data.data };
    } catch (error) {
      console.error('[Paketçi] Get settings error:', error);
      return { success: false };
    }
  },

  // Test connection
  async testConnection() {
    try {
      const headers = await this.getHeaders();
      
      const response = await fetch(`${this.baseUrl}/extension/health`, {
        headers
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
};

// Expose to window
window.API = API;
