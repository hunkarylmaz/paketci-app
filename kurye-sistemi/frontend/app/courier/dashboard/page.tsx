'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ==================== ICONS ====================
const Icons = {
  menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  restaurant: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M4 21V10l8-6 8 6v11" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  courier: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  map: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  report: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
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
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  sound: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  credit: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  fullscreen: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  location: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  coffee: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6" y1="1" x2="6" y2="4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="10" y1="1" x2="10" y2="4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="14" y1="1" x2="14" y2="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  user: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  sync: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="1 20 1 14 7 14" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.51 9a10 10 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A10 10 0 0 0 20.49 15" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// ==================== COLORS ====================
const colors = {
  primary: '#6B46C1',
  primaryDark: '#5c3cbb',
  primaryLight: '#7C3AED',
  sidebarBg: '#4c1d95',
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
export default function CourierDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Hünkar Yılmaz', company: 'Paketçiniz Bodrum' });
  const [orders, setOrders] = useState<any[]>([]);
  const [couriers, setCouriers] = useState<any[]>([
    { id: 1, name: 'Furkan Nam', status: 'active', location: { lat: 37.0344, lng: 27.4305 } }
  ]);
  const [credits, setCredits] = useState(678);
  const [orderFilter, setOrderFilter] = useState('all');
  const [courierFilter, setCourierFilter] = useState('active');

  useEffect(() => {
    const stored = localStorage.getItem('courier_user');
    if (!stored) {
      router.push('/courier/login');
      return;
    }
    setUser(JSON.parse(stored));

    // Sync with restaurant orders
    const restaurantOrders = localStorage.getItem('restaurant_orders');
    if (restaurantOrders) {
      const parsed = JSON.parse(restaurantOrders);
      setOrders(parsed);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('courier_user');
    router.push('/courier/login');
  };

  const syncWithRestaurant = () => {
    const restaurantOrders = localStorage.getItem('restaurant_orders');
    if (restaurantOrders) {
      const parsed = JSON.parse(restaurantOrders);
      setOrders(parsed);
      alert(`${parsed.length} sipariş senkronize edildi!`);
    }
  };

  const stats = {
    delivered: orders.filter(o => o.status === 'delivered').length,
    processing: orders.filter(o => o.status === 'onway').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    pending: orders.filter(o => o.status === 'pending').length
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.gray50 }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 70 : 70,
        background: colors.sidebarBg,
        color: colors.white,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ 
            background: 'transparent', 
            border: 'none', 
            color: colors.white, 
            cursor: 'pointer' 
          }}>
            <Icons.menu />
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: 'dashboard', icon: <Icons.dashboard /> },
            { id: 'map', icon: <Icons.map /> },
            { id: 'restaurant', icon: <Icons.restaurant /> },
            { id: 'courier', icon: <Icons.courier /> },
            { id: 'report', icon: <Icons.report /> },
            { id: 'settings', icon: <Icons.settings /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                border: 'none',
                background: activeTab === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: colors.white,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 70, minHeight: '100vh' }}>
        {/* Header */}
        <header style={{
          background: colors.white,
          padding: '12px 24px',
          borderBottom: `1px solid ${colors.gray200}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.primary, margin: 0 }}>Paketçiniz</h1>
              <p style={{ margin: 0, fontSize: 13, color: colors.gray500 }}>{user.company}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: 8,
              background: colors.gray100,
              padding: '8px 16px',
              borderRadius: 8
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                background: colors.primary,
                borderRadius: 6,
                color: colors.white
              }}>
                <Icons.check />
                <div>
                  <div style={{ fontSize: 10, opacity: 0.8 }}>TESLİM EDİLEN</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.delivered}</div>
                </div>
              </div>

              {['İŞLETME', 'YOLDA', 'İPTAL'].map((label, idx) => {
                const values = [stats.pending, stats.processing, stats.cancelled];
                return (
                  <div key={label} style={{ textAlign: 'center', padding: '0 12px' }}>
                    <div style={{ fontSize: 10, color: colors.gray500 }}>{label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: values[idx] > 0 ? colors.primary : colors.gray400 }}>
                      {values[idx]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Credits */}
            <div
              onClick={syncWithRestaurant}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: colors.primary,
                borderRadius: 8,
                color: colors.white,
                cursor: 'pointer'
              }}
            >
              <Icons.credit />
              <div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>Kontör</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{credits}</div>
              </div>
            </div>

            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: colors.gray500 }}>{user.company}</div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  background: colors.gray100,
                  border: 'none',
                  borderRadius: 6,
                  color: colors.gray700,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Icons.logout />
                Çıkış
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {/* Map Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            {/* Couriers Map */}
            <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, overflow: 'hidden' }}>
              <div style={{
                padding: '16px 20px',
                background: colors.primary,
                color: colors.white,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Kuryeler ({couriers.length})</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, color: colors.white, fontSize: 12 }}>
                    <Icons.coffee /> Mola Talepleri
                  </button>
                </div>
              </div>

              <div style={{ padding: 16 }}>
                {/* Courier Filters */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {[
                    { key: 'active', label: 'Aktif', count: 1 },
                    { key: 'onway', label: 'Yolda', count: 0 },
                    { key: 'passive', label: 'Pasif', count: 6 }
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setCourierFilter(f.key)}
                      style={{
                        padding: '8px 16px',
                        background: courierFilter === f.key ? colors.primary : colors.gray100,
                        border: 'none',
                        borderRadius: 6,
                        color: courierFilter === f.key ? colors.white : colors.gray700,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {f.label} ({f.count})
                      {f.key === 'active' && <span style={{ width: 8, height: 8, background: colors.green, borderRadius: '50%' }} />}
                    </button>
                  ))}
                </div>

                {/* Courier List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {couriers.map((courier) => (
                    <div key={courier.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      background: colors.gray50,
                      borderRadius: 8
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Icons.location />
                        <div>
                          <div style={{ fontWeight: 600 }}>{courier.name}</div>
                          <div style={{ fontSize: 12, color: colors.gray500 }}>Vardiyada</div>
                        </div>
                      </div>
                      <span style={{
                        width: 10,
                        height: 10,
                        background: courier.status === 'active' ? colors.green : colors.gray400,
                        borderRadius: '50%'
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div style={{
              background: colors.gray100,
              borderRadius: 12,
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.gray500
            }}>
              <div style={{ textAlign: 'center' }}>
                <Icons.map />
                <p>Harita Görünümü</p>
                <p style={{ fontSize: 12 }}>Kurye konumları canlı takip</p>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, overflow: 'hidden' }}>
            {/* Orders Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${colors.gray200}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setOrderFilter('pending')}
                  style={{
                    padding: '10px 20px',
                    background: orderFilter === 'pending' ? colors.primary : colors.gray100,
                    border: 'none',
                    borderRadius: 8,
                    color: orderFilter === 'pending' ? colors.white : colors.gray700,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Bekleyen Siparişler
                  <span style={{
                    marginLeft: 8,
                    padding: '2px 8px',
                    background: orderFilter === 'pending' ? 'rgba(255,255,255,0.3)' : colors.gray200,
                    borderRadius: 12,
                    fontSize: 12
                  }}>
                    {stats.pending}
                  </span>
                </button>
                
                <button
                  onClick={() => setOrderFilter('onway')}
                  style={{
                    padding: '10px 20px',
                    background: orderFilter === 'onway' ? colors.primary : colors.white,
                    border: `1px solid ${colors.gray200}`,
                    borderRadius: 8,
                    color: orderFilter === 'onway' ? colors.white : colors.gray700,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Yoldaki Siparişler
                  <span style={{
                    marginLeft: 8,
                    padding: '2px 8px',
                    background: orderFilter === 'onway' ? 'rgba(255,255,255,0.3)' : colors.gray200,
                    borderRadius: 12,
                    fontSize: 12
                  }}>
                    {stats.processing}
                  </span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ padding: '8px 12px', background: colors.gray100, border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                  <Icons.search /> Sipariş Ara
                </button>
                <button style={{ padding: '8px 12px', background: colors.gray100, border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                  Ödeme Değişiklikleri
                </button>
                <button style={{ padding: '8px 12px', background: colors.gray100, border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                  İptal Talepleri
                </button>
                <button style={{ padding: '8px 12px', background: colors.gray100, border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                  <Icons.filter /> Filtreler
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.gray50 }}>
                  {['Sipariş', 'Müşteri', 'Restoran', 'Adres', 'Mesafe', 'Saat', 'Durum', 'Ödeme', 'Kurye'].map((header) => (
                    <th key={header} style={{
                      padding: '14px 16px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 700,
                      color: colors.gray500,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      borderBottom: `1px solid ${colors.gray200}`
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '60px 20px', textAlign: 'center', color: colors.gray500 }}>
                      Bu kategoride sipariş bulunmamaktadır
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order: any) => {
                    const statusColors: any = {
                      pending: { bg: '#FEF3C7', color: '#D97706', text: 'Bekliyor' },
                      onway: { bg: '#DBEAFE', color: '#2563EB', text: 'Yolda' },
                      delivered: { bg: '#D1FAE5', color: '#059669', text: 'Teslim' },
                      cancelled: { bg: '#FEE2E2', color: '#DC2626', text: 'İptal' }
                    };
                    const status = statusColors[order.status] || statusColors.pending;
                    return (
                      <tr key={order.id} style={{ borderTop: `1px solid ${colors.gray100}` }}>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontWeight: 700, color: colors.primary }}>#{order.id}</span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>ASMA DÖNER</td>
                        <td style={{ padding: '14px 16px', color: colors.gray600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {order.address}
                        </td>
                        <td style={{ padding: '14px 16px' }}>{order.distance || '2.5 km'}</td>
                        <td style={{ padding: '14px 16px' }}>{order.time || '14:30'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                            background: status.bg,
                            color: status.color
                          }}>
                            {status.text}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 700 }}>{order.total?.toFixed(2)} TL</td>
                        <td style={{ padding: '14px 16px' }}>{order.courier || 'Atanmadı'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Sync Info */}
          <div style={{
            marginTop: 24,
            padding: 16,
            background: '#DBEAFE',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icons.sync />
              <div>
                <div style={{ fontWeight: 600, color: colors.primary }}>Restoran Paneli ile Senkronizasyon</div>
                <div style={{ fontSize: 13, color: colors.gray600 }}>
                  Siparişler otomatik senkronize ediliyor. Kontör butonuna tıklayarak manuel senkronizasyon yapabilirsiniz.
                </div>
              </div>
            </div>
            <a
              href="http://partner.paketciniz.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 20px',
                background: colors.primary,
                color: colors.white,
                borderRadius: 6,
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Restoran Paneline Git
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
