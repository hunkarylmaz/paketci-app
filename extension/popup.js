// Paketçi Extension - Popup Script
// Handles popup UI interactions

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const loginView = document.getElementById('loginView');
  const mainView = document.getElementById('mainView');
  const connectionStatus = document.getElementById('connectionStatus');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  
  // Master toggle
  const masterToggle = document.getElementById('masterToggle');
  const masterStatusText = document.getElementById('masterStatusText');
  
  // Mode buttons
  const modeAuto = document.getElementById('modeAuto');
  const modeManual = document.getElementById('modeManual');
  
  // Current settings
  let currentSettings = {
    masterEnabled: true,
    autoSync: true,
    platforms: {
      getir: true,
      yemeksepeti: true,
      trendyol: false,
      migros: false
    }
  };
  
  // Initialize
  await init();
  
  async function init() {
    const apiKey = await Storage.getApiKey();
    
    if (apiKey) {
      showMainView();
      await loadSettings();
    } else {
      showLoginView();
    }
  }
  
  function showLoginView() {
    loginView.classList.remove('hidden');
    mainView.classList.add('hidden');
    connectionStatus.classList.add('hidden');
  }
  
  function showMainView() {
    loginView.classList.add('hidden');
    mainView.classList.remove('hidden');
    connectionStatus.classList.remove('hidden');
  }
  
  // Login
  loginBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      alert('Lütfen API Key giriniz');
      return;
    }
    
    loginBtn.textContent = 'Doğrulanıyor...';
    loginBtn.disabled = true;
    
    try {
      const result = await API.validateApiKey(apiKey);
      
      if (result.valid) {
        await Storage.setApiKey(apiKey);
        await Storage.setRestaurantInfo(result.data.restaurantId, result.data.restaurantName);
        showMainView();
        await loadSettings();
      } else {
        alert('Geçersiz API Key: ' + (result.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      alert('Bağlantı hatası, tekrar deneyin');
    } finally {
      loginBtn.textContent = 'Giriş Yap';
      loginBtn.disabled = false;
    }
  });
  
  // Logout
  logoutBtn.addEventListener('click', async () => {
    await Storage.clear();
    showLoginView();
    apiKeyInput.value = '';
  });
  
  // Master toggle
  masterToggle.addEventListener('click', async () => {
    const newState = !masterToggle.classList.contains('active');
    masterToggle.classList.toggle('active', newState);
    
    // Update all platform toggles
    document.querySelectorAll('[data-type="platform"]').forEach(toggle => {
      toggle.classList.toggle('active', newState);
      const platform = toggle.dataset.platform;
      currentSettings.platforms[platform] = newState;
    });
    
    currentSettings.masterEnabled = newState;
    updateMasterStatusText();
    await saveSettings();
  });
  
  // Platform toggles
  document.querySelectorAll('[data-type="platform"]').forEach(toggle => {
    toggle.addEventListener('click', async () => {
      const platform = toggle.dataset.platform;
      const newState = !toggle.classList.contains('active');
      
      toggle.classList.toggle('active', newState);
      currentSettings.platforms[platform] = newState;
      
      // Update master toggle based on individual states
      const allActive = Object.values(currentSettings.platforms).every(v => v);
      const anyActive = Object.values(currentSettings.platforms).some(v => v);
      
      masterToggle.classList.toggle('active', allActive);
      currentSettings.masterEnabled = allActive;
      updateMasterStatusText();
      
      // Update platform item visual state
      const platformItem = document.querySelector(`.platform-item[data-platform="${platform}"]`);
      const statusDot = platformItem?.querySelector('.status-dot');
      
      if (newState) {
        platformItem?.classList.remove('disabled');
        statusDot?.classList.add('online');
        statusDot?.classList.remove('offline');
      } else {
        platformItem?.classList.add('disabled');
        statusDot?.classList.remove('online');
        statusDot?.classList.add('offline');
      }
      
      await saveSettings();
    });
  });
  
  // Mode selection
  modeAuto.addEventListener('click', async () => {
    setMode('auto');
  });
  
  modeManual.addEventListener('click', async () => {
    setMode('manual');
  });
  
  function setMode(mode) {
    currentSettings.autoSync = mode === 'auto';
    
    modeAuto.classList.toggle('active', mode === 'auto');
    modeManual.classList.toggle('active', mode === 'manual');
    
    updateMasterStatusText();
    saveSettings();
  }
  
  function updateMasterStatusText() {
    if (!currentSettings.masterEnabled) {
      masterStatusText.textContent = 'Tüm platformlar kapalı';
    } else if (currentSettings.autoSync) {
      masterStatusText.textContent = 'Otomatik yansıtma aktif';
    } else {
      masterStatusText.textContent = 'Manuel mod (buton ile)';
    }
  }
  
  // Load settings
  async function loadSettings() {
    const settings = await Storage.getSettings();
    currentSettings = { ...currentSettings, ...settings };
    
    // Update UI
    masterToggle.classList.toggle('active', currentSettings.masterEnabled);
    
    // Update platform toggles
    Object.entries(currentSettings.platforms).forEach(([platform, enabled]) => {
      const toggle = document.querySelector(`[data-platform="${platform}"][data-type="platform"]`);
      const platformItem = document.querySelector(`.platform-item[data-platform="${platform}"]`);
      const statusDot = platformItem?.querySelector('.status-dot');
      
      if (toggle) {
        toggle.classList.toggle('active', enabled);
      }
      
      if (platformItem) {
        platformItem.classList.toggle('disabled', !enabled);
      }
      
      if (statusDot) {
        statusDot.classList.toggle('online', enabled);
        statusDot.classList.toggle('offline', !enabled);
      }
    });
    
    // Update mode
    setMode(currentSettings.autoSync ? 'auto' : 'manual');
  }
  
  // Save settings
  async function saveSettings() {
    await Storage.updateSettings(currentSettings);
  }
});
