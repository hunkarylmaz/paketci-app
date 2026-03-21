'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Icons - Exact same as original
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
  search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  print: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 14h12v8H6z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Sidebar icons
  cart: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="21" r="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  doc: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chart: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  calendar: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dollar: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  settings: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  list: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  cancel: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// Exact colors from original - CHANGED TO BLUE
const colors = {
  // Original was #6B46C1 (purple), now BLUE
  primary: '#2563EB',        // Blue-600
  primaryDark: '#1D4ED8',    // Blue-700
  primaryLight: '#3B82F6',   // Blue-500
  sidebar: '#1E40AF',        // Blue-800 (sidebar background)
  accent: '#FCD34D',         // Yellow-300 (active icon bg)
  
  // Other colors same as original
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  red: '#EF4444',
  green: '#10B981',
};

export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [activeOrderTab, setActiveOrderTab] = useState('pending');
  
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Nakit');
  const [printerSize, setPrinterSize] = useState('80mm');
  const [user, setUser] = useState({ name: 'ASMA DÖNER BODRUM', dealerName: 'Paketçiniz Bodrum' });
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('restaurant_user');
    if (stored) setUser(JSON.parse(stored));
    const storedOrders = localStorage.getItem('restaurant_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('restaurant_user');
    router.push('/');
  };

  const pendingCount = orders.filter((o: any) => o.status === 'pending').length;
  const onwayCount = orders.filter((o: any) => o.status === 'onway').length;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.gray50,
      display: 'flex',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* SIDEBAR - Exact clone */}
      <aside style={{
        width: 72,
        background: colors.sidebar,
        minHeight: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 20,
        gap: 8
      }}>
        {[
          { id: 'orders', icon: Icons.cart, active: true },
          { id: 'reports', icon: Icons.doc, active: false },
          { id: 'stats', icon: Icons.chart, active: false },
          { id: 'calendar', icon: Icons.calendar, active: false },
          { id: 'finance', icon: Icons.dollar, active: false },
          { id: 'settings', icon: Icons.settings, active: false },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: item.active ? colors.accent : 'transparent',
              color: item.active ? colors.gray800 : 'rgba(255,255,255,0.7)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <item.icon />
          </button>
        ))}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: 72 }}>
        {/* HEADER - Exact clone */}
        <header style={{
          height: 64,
          background: colors.white,
          borderBottom: `1px solid ${colors.gray200}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          {/* Left side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Hamburger */}
            <button style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: `1px solid ${colors.gray200}`,
              background: colors.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: colors.gray600
            }}>
              <Icons.menu />
            </button>

            {/* Title */}
            <div>
              <div style={{ 
                fontSize: 20, 
                fontWeight: 700, 
                color: colors.primary,
                lineHeight: 1.2
              }}>
                Paketçiniz
              </div>
              <div style={{ 
                fontSize: 13, 
                color: colors.gray500,
                lineHeight: 1.2
              }}>
                Bodrum
              </div>
            </div>

            {/* Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: colors.primary,
              borderRadius: 20,
              marginLeft: 8
            }}>
              <span style={{ 
                fontSize: 12, 
                fontWeight: 700, 
                color: colors.white,
                letterSpacing: 0.5
              }}>
                {user.name}
              </span>
            </div>

            <div style={{
              fontSize: 12,
              color: colors.gray500
            }}>
              {user.dealerName}
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Calls Toggle */}
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 16px',
              background: colors.gray100,
              border: `1px solid ${colors.gray200}`,
              borderRadius: 8,
              color: colors.gray600,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500
            }}>
              <Icons.phone />
              <span>Aramalar</span>
              {/* Toggle switch */}
              <div style={{
                width: 44,
                height: 24,
                background: colors.gray300,
                borderRadius: 12,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  width: 20,
                  height: 20,
                  background: colors.white,
                  borderRadius: '50%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </div>
            </button>

            {/* New Order Button */}
            <button 
              onClick={() => setShowNewOrderModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: colors.primary,
                border: 'none',
                borderRadius: 8,
                color: colors.white,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              <Icons.plus />
              <span>Yeni Sipariş</span>
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: colors.gray100,
                color: colors.gray600,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Icons.logout />
              <span>Çıkış</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={{ padding: 24 }}>
          {/* Tab Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: 12, 
            marginBottom: 20,
            alignItems: 'center'
          }}>
            <button 
              onClick={() => setActiveOrderTab('pending')}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: activeOrderTab === 'pending' ? colors.primary : colors.white,
                color: activeOrderTab === 'pending' ? colors.white : colors.gray600,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: activeOrderTab === 'pending' ? '0 2px 4px rgba(37,99,235,0.3)' : `0 1px 3px ${colors.gray200}`
              }}
            >
              Bekleyen Siparişler
              <span style={{
                background: activeOrderTab === 'pending' ? 'rgba(255,255,255,0.3)' : colors.gray200,
                color: activeOrderTab === 'pending' ? colors.white : colors.gray600,
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 700
              }}>
                {pendingCount}
              </span>
            </button>

            <button 
              onClick={() => setActiveOrderTab('onway')}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: `1px solid ${colors.gray200}`,
                background: activeOrderTab === 'onway' ? colors.primary : colors.white,
                color: activeOrderTab === 'onway' ? colors.white : colors.gray600,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              Yoldaki Siparişler
              <span style={{
                background: activeOrderTab === 'onway' ? 'rgba(255,255,255,0.3)' : colors.gray200,
                color: activeOrderTab === 'onway' ? colors.white : colors.gray600,
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 700
              }}>
                {onwayCount}
              </span>
            </button>

            {/* Right side action buttons */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: `1px solid ${colors.gray200}`,
                background: colors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: colors.gray600
              }}>
                <Icons.search />
              </button>
              <button style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: `1px solid ${colors.gray200}`,
                background: colors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: colors.gray600
              }}>
                <Icons.list />
              </button>
              <button style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: `1px solid ${colors.gray200}`,
                background: colors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: colors.gray600
              }}>
                <Icons.cancel />
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div style={{
            background: colors.white,
            borderRadius: 12,
            border: `1px solid ${colors.gray200}`,
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.gray50 }}>
                  {['SİPARİŞ', 'MÜŞTERİ', 'ADRES', 'MESAFE', 'SAAT', 'DURUM', 'ÖDEME', 'KURYE'].map((header) => (
                    <th key={header} style={{
                      padding: '14px 16px',
                      textAlign: 'left',
                      fontSize: 12,
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
                <tr>
                  <td colSpan={8} style={{
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: colors.gray500,
                    fontSize: 14
                  }}>
                    Bu kategoride sipariş bulunmamaktadır
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* NEW ORDER MODAL - Exact Clone */}
      {showNewOrderModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setShowNewOrderModal(false)}>
          <div style={{
            width: '100%',
            maxWidth: 900,
            height: '100%',
            background: colors.white,
            display: 'flex',
            flexDirection: 'column'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: `1px solid ${colors.gray200}`
            }}>
              <h2 style={{
                fontSize: 18,
                fontWeight: 700,
                color: colors.gray800,
                margin: 0
              }}>
                Sipariş Bilgileri
              </h2>
              <button 
                onClick={() => setShowNewOrderModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.gray400,
                  padding: 4
                }}
              >
                <Icons.close />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: 24
            }}>
              {/* Form Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto 140px',
                gap: 16,
                marginBottom: 16
              }}>
                {/* Ad Soyad */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors.gray700,
                    marginBottom: 6
                  }}>
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${colors.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors.gray700,
                    marginBottom: 6
                  }}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${colors.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Ara Button */}
                <div style={{ paddingTop: 24 }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 16px',
                    background: colors.primary,
                    border: 'none',
                    borderRadius: 6,
                    color: colors.white,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}>
                    <span>Ara</span>
                    <Icons.search />
                  </button>
                </div>

                {/* Ödeme Yöntemi */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors.gray700,
                    marginBottom: 6
                  }}>
                    Ödeme Yöntemi
                  </label>
                  <input
                    type="text"
                    value={paymentMethod}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${colors.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      background: colors.white,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Adres Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginBottom: 16
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors.gray700,
                    marginBottom: 6
                  }}>
                    Adres
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Adres giriniz..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${colors.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors.gray700,
                    marginBottom: 6
                  }}>
                    Adres Detayı
                  </label>
                  <input
                    type="text"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${colors.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Not and Tutar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginBottom: 24
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors.gray700,
                    marginBottom: 6
                  }}>
                    Sipariş Notu
                  </label>
                  <input
                    type="text"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${colors.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: colors.gray700,
                    marginBottom: 6
                  }}>
                    Ödeme Tutarı
                  </label>
                  <input
                    type="text"
                    value="0.00"
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${colors.gray300}`,
                      borderRadius: 6,
                      fontSize: 14,
                      background: colors.white,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: `1px solid ${colors.gray200}`,
              background: colors.gray50,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              {/* Printer sizes */}
              <button 
                onClick={() => setPrinterSize('57mm')}
                style={{
                  padding: '10px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: printerSize === '57mm' ? colors.gray600 : colors.white,
                  color: printerSize === '57mm' ? colors.white : colors.gray700,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                57mm
              </button>
              <button 
                onClick={() => setPrinterSize('80mm')}
                style={{
                  padding: '10px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: printerSize === '80mm' ? colors.primary : colors.white,
                  color: printerSize === '80mm' ? colors.white : colors.gray700,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                80mm
              </button>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                <button 
                  onClick={() => setShowNewOrderModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 6,
                    border: 'none',
                    background: colors.gray500,
                    color: colors.white,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Kapat
                </button>

                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 20px',
                  borderRadius: 6,
                  border: 'none',
                  background: colors.gray500,
                  color: colors.white,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>
                  <Icons.print />
                  <span>Yazdır</span>
                </button>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 20px',
                  borderRadius: 6,
                  background: colors.primary,
                  color: colors.white,
                  fontSize: 14,
                  fontWeight: 700
                }}>
                  <span>Toplam:</span>
                  <span>0.00 ₺</span>
                </div>

                <button style={{
                  padding: '10px 24px',
                  borderRadius: 6,
                  border: 'none',
                  background: colors.gray400,
                  color: colors.white,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Sipariş Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
