// Paketçi Extension - Storage Manager
// Chrome storage wrapper with async support

const Storage = {
  // Get item from storage
  async get(key) {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key];
    } catch (error) {
      console.error('[Paketçi] Storage get error:', error);
      return null;
    }
  },

  // Set item in storage
  async set(key, value) {
    try {
      await chrome.storage.local.set({ [key]: value });
      return true;
    } catch (error) {
      console.error('[Paketçi] Storage set error:', error);
      return false;
    }
  },

  // Remove item from storage
  async remove(key) {
    try {
      await chrome.storage.local.remove(key);
      return true;
    } catch (error) {
      console.error('[Paketçi] Storage remove error:', error);
      return false;
    }
  },

  // Clear all storage
  async clear() {
    try {
      await chrome.storage.local.clear();
      return true;
    } catch (error) {
      console.error('[Paketçi] Storage clear error:', error);
      return false;
    }
  },

  // Get API key
  async getApiKey() {
    return await this.get(CONSTANTS.STORAGE_KEYS.API_KEY);
  },

  // Set API key
  async setApiKey(apiKey) {
    return await this.set(CONSTANTS.STORAGE_KEYS.API_KEY, apiKey);
  },

  // Get restaurant info
  async getRestaurantInfo() {
    const [id, name] = await Promise.all([
      this.get(CONSTANTS.STORAGE_KEYS.RESTAURANT_ID),
      this.get(CONSTANTS.STORAGE_KEYS.RESTAURANT_NAME)
    ]);
    return { id, name };
  },

  // Set restaurant info
  async setRestaurantInfo(id, name) {
    await Promise.all([
      this.set(CONSTANTS.STORAGE_KEYS.RESTAURANT_ID, id),
      this.set(CONSTANTS.STORAGE_KEYS.RESTAURANT_NAME, name)
    ]);
  },

  // Get settings
  async getSettings() {
    const settings = await this.get(CONSTANTS.STORAGE_KEYS.SETTINGS);
    return settings || CONSTANTS.DEFAULT_SETTINGS;
  },

  // Update settings
  async updateSettings(newSettings) {
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };
    return await this.set(CONSTANTS.STORAGE_KEYS.SETTINGS, updated);
  },

  // Check if order was already sent (cache)
  async isOrderCached(platformOrderId) {
    const cache = await this.get(CONSTANTS.STORAGE_KEYS.ORDER_CACHE) || {};
    return !!cache[platformOrderId];
  },

  // Add order to cache
  async cacheOrder(platformOrderId, paketciOrderId) {
    const cache = await this.get(CONSTANTS.STORAGE_KEYS.ORDER_CACHE) || {};
    cache[platformOrderId] = {
      paketciOrderId,
      timestamp: Date.now()
    };
    // Keep only last 100 orders
    const entries = Object.entries(cache);
    if (entries.length > 100) {
      const sorted = entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      const trimmed = sorted.slice(0, 100);
      const newCache = Object.fromEntries(trimmed);
      await this.set(CONSTANTS.STORAGE_KEYS.ORDER_CACHE, newCache);
    } else {
      await this.set(CONSTANTS.STORAGE_KEYS.ORDER_CACHE, cache);
    }
  },

  // Clear order cache
  async clearOrderCache() {
    await this.set(CONSTANTS.STORAGE_KEYS.ORDER_CACHE, {});
  }
};

// Expose to window
window.Storage = Storage;
