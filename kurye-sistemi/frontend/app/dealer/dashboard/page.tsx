'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ==================== ICONS ====================
const Icons = {
  menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  restaurant: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M4 21V10l8-6 8 6v11" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  map: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="8" y1="2" x2="8" y2="18" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="6" x2="16" y2="22" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  sync: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="1 20 1 14 7 14" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  warning: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// ==================== COLORS ====================
const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  sidebarBg: '#1E40AF',
  white: '#FFFFFF',
  yellow: '#FCD34D',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  green: '#10B981',
  red: '#EF4444',
  orange: '#F97316'
};

// ==================== MAIN COMPONENT ====================
export default function DealerDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('restaurants');
  const [user, setUser] = useState({ name: 'PAKETCINIZ', company: 'Paketçiniz Bayi' });
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'ready' | 'syncing' | 'success' | 'error'>('ready');

  // New restaurant form
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('dealer_user');
    if (!stored) {
      router.push('/dealer/login');
      return;
    }
    setUser(JSON.parse(stored));

    // Load restaurants from localStorage
    const storedRestaurants = localStorage.getItem('dealer_restaurants');
    if (storedRestaurants) {
      setRestaurants(JSON.parse(storedRestaurants));
    } else {
      // Default ASMA DÖNER restaurant
      const defaultRestaurants = [
        {
          id: 'RST-001',
          name: 'ASMA DÖNER BODRUM',
          phone: '0532 123 45 67',
          address: 'Bodrum, Muğla',
          status: 'active',
          orders: 156,
          revenue: 45230,
          lastSync: new Date().toISOString(),
          email: 'asma@paketci.com',
          synced: true
        }
      ];
      setRestaurants(defaultRestaurants);
      localStorage.setItem('dealer_restaurants', JSON.stringify(defaultRestaurants));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dealer_user');
    router.push('/dealer/login');
  };

  const handleAddRestaurant = () => {
    if (!newRestaurant.name || !newRestaurant.phone || !newRestaurant.address) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }

    const restaurant = {
      id: `RST-${String(restaurants.length + 1).padStart(3, '0')}`,
      name: newRestaurant.name,
      phone: newRestaurant.phone,
      address: newRestaurant.address,
      status: 'active',
      orders: 0,
      revenue: 0,
      lastSync: null,
      email: newRestaurant.email || '',
      synced: false
    };

    const updated = [...restaurants, restaurant];
    setRestaurants(updated);
    localStorage.setItem('dealer_restaurants', JSON.stringify(updated));
    setShowAddModal(false);
    setNewRestaurant({ name: '', phone: '', address: '', email: '', password: '' });
  };

  const handleSync = async () => {
    setSyncStatus('syncing');
    
    // Simulate sync with restaurant panel
    setTimeout(() => {
      const updated = restaurants.map(r => ({
        ...r,
        lastSync: new Date().toISOString(),
        synced: true
      }));
      setRestaurants(updated);
      localStorage.setItem('dealer_restaurants', JSON.stringify(updated));
      
      // Sync with restaurant panel orders
      const restaurantOrders = localStorage.getItem('restaurant_orders');
      if (restaurantOrders) {
        const orders = JSON.parse(restaurantOrders);
        const asmaOrders = orders.filter((o: any) => o.restaurantId === 'RST-001' || !o.restaurantId);
        
        // Update ASMA DÖNER stats
        const updatedWithStats = updated.map((r: any) => {
          if (r.id === 'RST-001') {
            return {
              ...r,
              orders: asmaOrders.length,
              revenue: asmaOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
            };
          }
          return r;
        });
        setRestaurants(updatedWithStats);
        localStorage.setItem('dealer_restaurants', JSON.stringify(updatedWithStats));
      }
      
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('ready'), 2000);
    }, 1500);
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phone.includes(searchQuery)
  );

  const totalOrders = restaurants.reduce((sum, r) => sum + (r.orders || 0), 0);
  const totalRevenue = restaurants.reduce((sum, r) => sum + (r.revenue || 0), 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.gray50 }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 260 : 70,
        background: colors.sidebarBg,
        color: colors.white,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        {/* Logo Area */}
        <div style={{ padding: 20, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ 
              background: 'transparent', 
              border: 'none', 
              color: colors.white, 
              cursor: 'pointer',
              padding: 0 
            }}>
              <Icons.menu />
            </button>
            {sidebarOpen && <span style={{ fontSize: 20, fontWeight: 700 }}>Paketçiniz</span>}
          </div>
          {sidebarOpen && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Bayi Paneli</div>}
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {[
            { id: 'restaurants', label: 'Restoranlar', icon: <Icons.restaurant /> },
            { id: 'reports', label: 'Raporlar', icon: <Icons.chart /> },
            { id: 'settings', label: 'Ayarlar', icon: <Icons.settings /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                marginBottom: 4,
                borderRadius: 8,
                border: 'none',
                background: activeTab === item.id ? colors.yellow : 'transparent',
                color: activeTab === item.id ? colors.sidebarBg : colors.white,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: colors.white,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            <Icons.logout />
            {sidebarOpen && <span>Çıkış</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? 260 : 70,
        transition: 'margin-left 0.3s',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <header style={{
          background: colors.white,
          padding: '16px 24px',
          borderBottom: `1px solid ${colors.gray200}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: colors.gray800, margin: 0 }}>
              {activeTab === 'restaurants' && 'Restoran Yönetimi'}
              {activeTab === 'reports' && 'Raporlar'}
              {activeTab === 'settings' && 'Ayarlar'}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: colors.gray500 }}>{user.company}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={handleSync}
              disabled={syncStatus === 'syncing'}
              style={{
                padding: '10px 20px',
                background: syncStatus === 'success' ? colors.green : syncStatus === 'error' ? colors.red : colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: syncStatus === 'syncing' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: syncStatus === 'syncing' ? 0.7 : 1
              }}
            >
              {syncStatus === 'syncing' && '🔄 Senkronize ediliyor...'}
              {syncStatus === 'success' && '✅ Senkronize edildi'}
              {syncStatus === 'ready' && (<>
                <Icons.sync />
                <span>Senkronize Et</span>
              </>)}
            </button>

            <div style={{
              padding: '8px 16px',
              background: colors.gray100,
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              color: colors.gray700
            }}>
              {user.name}
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {/* RESTAURANTS TAB */}
          {activeTab === 'restaurants' && (
            <div>
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
                <div style={{ background: colors.white, padding: 20, borderRadius: 12, border: `1px solid ${colors.gray200}` }}>
                  <p style={{ fontSize: 13, color: colors.gray500, margin: 0 }}>Toplam Restoran</p>
                  <p style={{ fontSize: 32, fontWeight: 700, color: colors.gray800, margin: '8px 0 0' }}>{restaurants.length}</p>
                </div>
                <div style={{ background: colors.white, padding: 20, borderRadius: 12, border: `1px solid ${colors.gray200}` }}>
                  <p style={{ fontSize: 13, color: colors.gray500, margin: 0 }}>Aktif Restoran</p>
                  <p style={{ fontSize: 32, fontWeight: 700, color: colors.green, margin: '8px 0 0' }}>{restaurants.filter(r => r.status === 'active').length}</p>
                </div>
                <div style={{ background: colors.white, padding: 20, borderRadius: 12, border: `1px solid ${colors.gray200}` }}>
                  <p style={{ fontSize: 13, color: colors.gray500, margin: 0 }}>Toplam Sipariş</p>
                  <p style={{ fontSize: 32, fontWeight: 700, color: colors.primary, margin: '8px 0 0' }}>{totalOrders}</p>
                </div>
                <div style={{ background: colors.white, padding: 20, borderRadius: 12, border: `1px solid ${colors.gray200}` }}>
                  <p style={{ fontSize: 13, color: colors.gray500, margin: 0 }}>Toplam Ciro</p>
                  <p style={{ fontSize: 32, fontWeight: 700, color: colors.orange, margin: '8px 0 0' }}>{totalRevenue.toLocaleString()} TL</p>
                </div>
              </div>

              {/* Search and Add */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16 }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: colors.gray400 }}>
                    <Icons.search />
                  </div>
                  <input
                    type="text"
                    placeholder="Restoran ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      border: `1px solid ${colors.gray300}`,
                      borderRadius: 8,
                      fontSize: 14
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    padding: '10px 20px',
                    background: colors.primary,
                    color: colors.white,
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <Icons.plus />
                  Yeni Restoran
                </button>
              </div>

              {/* Restaurants Table */}
              <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: colors.gray50 }}>
                      {['Restoran', 'İletişim', 'Durum', 'Sipariş', 'Ciro', 'Son Senkronizasyon', 'İşlem'].map((header) => (
                        <th key={header} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `1px solid ${colors.gray200}` }}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRestaurants.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '60px 20px', textAlign: 'center', color: colors.gray500 }}>
                          Restoran bulunamadı
                        </td>
                      </tr>
                    ) : (
                      filteredRestaurants.map((restaurant) => (
                        <tr key={restaurant.id} style={{ borderTop: `1px solid ${colors.gray100}` }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 8,
                                background: restaurant.id === 'RST-001' ? colors.primary : colors.gray200,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: colors.white,
                                fontWeight: 700,
                                fontSize: 14
                              }}>
                                {restaurant.name.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: colors.gray800, fontSize: 14 }}>{restaurant.name}</div>
                                <div style={{ fontSize: 12, color: colors.gray500 }}>{restaurant.id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: colors.gray600 }}>
                              <Icons.phone />
                              {restaurant.phone}
                            </div>
                            <div style={{ fontSize: 12, color: colors.gray500, marginTop: 4 }}>{restaurant.address}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: 12,
                              fontSize: 12,
                              fontWeight: 600,
                              background: restaurant.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                              color: restaurant.status === 'active' ? '#059669' : '#DC2626'
                            }}>
                              {restaurant.status === 'active' ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 600, color: colors.gray800 }}>
                            {restaurant.orders || 0}
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: colors.gray800 }}>
                            {(restaurant.revenue || 0).toLocaleString()} TL
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {restaurant.synced ? (
                                <>
                                  <span style={{ color: colors.green }}><Icons.check /></span>
                                  <span style={{ fontSize: 13, color: colors.gray600 }}>
                                    {restaurant.lastSync ? new Date(restaurant.lastSync).toLocaleString('tr-TR') : 'Senkronize'}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span style={{ color: colors.orange }}><Icons.warning /></span>
                                  <span style={{ fontSize: 13, color: colors.gray500 }}>Bekliyor</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <a
                                href="http://partner.paketciniz.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '6px 12px',
                                  background: colors.primary,
                                  color: colors.white,
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-block'
                                }}
                              >
                                Panele Git
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
                <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, padding: 24, borderRadius: 12, color: colors.white }}>
                  <p style={{ opacity: 0.9, fontSize: 13 }}>Toplam Restoran</p>
                  <p style={{ fontSize: 36, fontWeight: 700, marginTop: 8 }}>{restaurants.length}</p>
                </div>
                <div style={{ background: `linear-gradient(135deg, ${colors.green}, #059669)`, padding: 24, borderRadius: 12, color: colors.white }}>
                  <p style={{ opacity: 0.9, fontSize: 13 }}>Toplam Ciro</p>
                  <p style={{ fontSize: 36, fontWeight: 700, marginTop: 8 }}>{totalRevenue.toLocaleString()} TL</p>
                </div>
                <div style={{ background: `linear-gradient(135deg, ${colors.orange}, #EA580C)`, padding: 24, borderRadius: 12, color: colors.white }}>
                  <p style={{ opacity: 0.9, fontSize: 13 }}>Toplam Sipariş</p>
                  <p style={{ fontSize: 36, fontWeight: 700, marginTop: 8 }}>{totalOrders}</p>
                </div>
              </div>

              <div style={{ background: colors.white, padding: 24, borderRadius: 12, border: `1px solid ${colors.gray200}` }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Restoran Bazlı Rapor</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: colors.gray50 }}>
                      {['Restoran', 'Sipariş Sayısı', 'Ciro', 'Ortalama Tutar'].map((header) => (
                        <th key={header} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: colors.gray500, borderBottom: `1px solid ${colors.gray200}` }}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map((restaurant) => (
                      <tr key={restaurant.id} style={{ borderTop: `1px solid ${colors.gray100}` }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{restaurant.name}</td>
                        <td style={{ padding: '12px 16px' }}>{restaurant.orders || 0}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>{(restaurant.revenue || 0).toLocaleString()} TL</td>
                        <td style={{ padding: '12px 16px' }}>
                          {restaurant.orders > 0 ? Math.round((restaurant.revenue || 0) / restaurant.orders) : 0} TL
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ background: colors.white, padding: 24, borderRadius: 12, border: `1px solid ${colors.gray200}`, marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Bayi Bilgileri</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: colors.gray600, marginBottom: 6 }}>Bayi Adı</label>
                    <input type="text" defaultValue={user.name} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 8 }} />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: colors.gray600, marginBottom: 6 }}>Şirket</label>
                    <input type="text" defaultValue={user.company} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 8 }} />
                  </div>
                  
                  <button style={{ padding: '12px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                    Kaydet
                  </button>
                </div>
              </div>

              <div style={{ background: colors.white, padding: 24, borderRadius: 12, border: `1px solid ${colors.gray200}` }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Senkronizasyon Ayarları</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${colors.gray100}` }}>
                    <span>Otomatik senkronizasyon</span>
                    <div style={{ width: 44, height: 24, background: colors.primary, borderRadius: 12, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, background: colors.white, borderRadius: '50%' }} />
                    </div>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                    <span>Senkronizasyon aralığı</span>
                    <select style={{ padding: '8px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6 }}>
                      <option>Her 5 dakika</option>
                      <option>Her 15 dakika</option>
                      <option>Her 30 dakika</option>
                      <option>Her saat</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Restaurant Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200
        }}>
          <div style={{
            background: colors.white,
            borderRadius: 12,
            width: '90%',
            maxWidth: 500,
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.gray200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Yeni Restoran Ekle</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.gray500 }}>
                <Icons.close />
              </button>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: colors.gray600, marginBottom: 6 }}>Restoran Adı *</label>
                  <input
                    type="text"
                    value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                    placeholder="örn: ASMA DÖNER İSTANBUL"
                    style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 8 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: colors.gray600, marginBottom: 6 }}>Telefon *</label>
                  <input
                    type="text"
                    value={newRestaurant.phone}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, phone: e.target.value })}
                    placeholder="örn: 0532 123 45 67"
                    style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 8 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: colors.gray600, marginBottom: 6 }}>Adres *</label>
                  <input
                    type="text"
                    value={newRestaurant.address}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                    placeholder="örn: Bodrum, Muğla"
                    style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 8 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: colors.gray600, marginBottom: 6 }}>E-posta</label>
                  <input
                    type="email"
                    value={newRestaurant.email}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, email: e.target.value })}
                    placeholder="örn: restoran@email.com"
                    style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 8 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: colors.gray600, marginBottom: 6 }}>Şifre</label>
                  <input
                    type="password"
                    value={newRestaurant.password}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, password: e.target.value })}
                    placeholder="Restoran giriş şifresi"
                    style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 8 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '12px', background: colors.gray100, color: colors.gray700, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
                >
                  İptal
                </button>
                <button
                  onClick={handleAddRestaurant}
                  style={{ flex: 1, padding: '12px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}