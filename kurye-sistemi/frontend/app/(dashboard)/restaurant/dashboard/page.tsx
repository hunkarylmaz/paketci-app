'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const Icons = {
  menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
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
  mapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shoppingCart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="21" r="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  fileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  barChart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dollar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  print: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 14h12v8H6z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  list: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// Colors - BLUE THEME instead of purple
const colors = {
  primary: '#2563eb',       // blue-600
  primaryDark: '#1d4ed8',   // blue-700
  primaryLight: '#3b82f6',  // blue-500
  accent: '#60a5fa',        // blue-400 (instead of yellow)
  accentBg: '#dbeafe',      // blue-100
  sidebar: '#1e40af',       // blue-800 (was purple #5c3cbb)
  sidebarHover: '#1e3a8a',  // blue-900
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  red: '#ef4444',
  redLight: '#fef2f2',
  green: '#22c55e',
  yellow: '#f59e0b',
};

// Sample products
const sampleProducts = [
  { id: 1, name: 'Adana Dürüm', price: 120, category: 'Dürümler' },
  { id: 2, name: 'Tavuk Dürüm', price: 90, category: 'Dürümler' },
  { id: 3, name: 'Ciğer Dürüm', price: 110, category: 'Dürümler' },
  { id: 4, name: 'Kuzu Şiş Dürüm', price: 140, category: 'Dürümler' },
  { id: 5, name: 'Ayran', price: 15, category: 'İçecekler' },
  { id: 6, name: 'Coca Cola', price: 25, category: 'İçecekler' },
  { id: 7, name: 'Fanta', price: 25, category: 'İçecekler' },
  { id: 8, name: 'Salata', price: 30, category: 'Yan Ürünler' },
  { id: 9, name: 'Pide', price: 150, category: 'Pideler' },
  { id: 10, name: 'Lahmacun', price: 60, category: 'Pideler' },
  { id: 11, name: 'Künefe', price: 80, category: 'Tatlılar' },
  { id: 12, name: 'Sütlaç', price: 50, category: 'Tatlılar' },
];

// Categories
const categories = ['Tümü', 'Dürümler', 'Pideler', 'Yan Ürünler', 'İçecekler', 'Tatlılar'];

export default function RestaurantDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(null);
  const [activeOrderTab, setActiveOrderTab] = useState('pending');
  
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Nakit');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [printerSize, setPrinterSize] = useState('80mm');
  const [user, setUser] = useState({ name: 'ASMA DÖNER BODRUM', dealerName: 'Paketçiniz Bodrum' });
  
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('restaurant_user');
    if (stored) setUser(JSON.parse(stored));
    
    const storedOrders = localStorage.getItem('restaurant_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  const filteredProducts = sampleProducts.filter(p => {
    const matchesCategory = activeCategory === 'Tümü' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCreateOrder = () => {
    if (!customerName || !customerPhone || !address) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }
    if (cart.length === 0) {
      alert('Sepete ürün ekleyin');
      return;
    }

    const order = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      customerName,
      customerPhone,
      address: address + (addressDetail ? ' - ' + addressDetail : ''),
      addressDetail,
      orderNote,
      paymentMethod,
      items: [...cart],
      total: cartTotal,
      status: 'pending',
      createdAt: new Date().toLocaleString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      distance: '1.2 km',
      courier: 'Atanmadı'
    };

    const updated = [order, ...orders];
    setOrders(updated);
    localStorage.setItem('restaurant_orders', JSON.stringify(updated));
    
    // Reset
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
    setAddressDetail('');
    setOrderNote('');
    setCart([]);
    setShowNewOrderModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('restaurant_user');
    router.push('/');
  };

  const filteredOrders = orders.filter(order => {
    if (activeOrderTab === 'pending') return order.status === 'pending';
    if (activeOrderTab === 'onway') return order.status === 'onway';
    return true;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const onwayCount = orders.filter(o => o.status === 'onway').length;

  return (
    <div style={{ minHeight: '100vh', background: colors.gray50, display: 'flex' }}>
      {/* Sidebar */}
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
          { id: 'orders', icon: Icons.shoppingCart, active: activeTab === 'orders' },
          { id: 'reports', icon: Icons.fileText, active: activeTab === 'reports' },
          { id: 'stats', icon: Icons.barChart, active: activeTab === 'stats' },
          { id: 'calendar', icon: Icons.calendar, active: activeTab === 'calendar' },
          { id: 'finance', icon: Icons.dollar, active: activeTab === 'finance' },
        ].map((item, idx) => (
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
              color: item.active ? colors.sidebar : 'rgba(255,255,255,0.7)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <item.icon />
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 72 }}>
        {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
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
              }}
            >
              <Icons.menu />
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>Paketçiniz</span>
                <span style={{ fontSize: 14, color: colors.gray500 }}>Bodrum</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              background: colors.gray100,
              borderRadius: 20,
              marginLeft: 16
            }}>
              <Icons.mapPin />
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.gray700 }}>{user.name}</span>
              <span style={{ fontSize: 12, color: colors.gray500 }}>{user.dealerName}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Calls Toggle */}
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
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
                width: 40,
                height: 40,
                borderRadius: 8,
                border: 'none',
                background: colors.redLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: colors.red
              }}
            >
              <Icons.logout />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: 24 }}>
          {activeTab === 'orders' && (
            <div>
              {/* Order Tabs */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <button
                  onClick={() => setActiveOrderTab('pending')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: activeOrderTab === 'pending' ? colors.primary : colors.white,
                    border: `1px solid ${activeOrderTab === 'pending' ? colors.primary : colors.gray300}`,
                    borderRadius: 8,
                    color: activeOrderTab === 'pending' ? colors.white : colors.gray600,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500
                  }}
                >
                  <span>Bekleyen Siparişler</span>
                  <span style={{
                    background: activeOrderTab === 'pending' ? 'rgba(255,255,255,0.3)' : colors.gray200,
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    {pendingCount}
                  </span>
                </button>

                <button
                  onClick={() => setActiveOrderTab('onway')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: activeOrderTab === 'onway' ? colors.primary : colors.white,
                    border: `1px solid ${activeOrderTab === 'onway' ? colors.primary : colors.gray300}`,
                    borderRadius: 8,
                    color: activeOrderTab === 'onway' ? colors.white : colors.gray600,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500
                  }}
                >
                  <span>Yoldaki Siparişler</span>
                  <span style={{
                    background: activeOrderTab === 'onway' ? 'rgba(255,255,255,0.3)' : colors.gray200,
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    {onwayCount}
                  </span>
                </button>

                <div style={{ flex: 1 }} />

                <button style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  border: `1px solid ${colors.gray300}`,
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
                  border: `1px solid ${colors.gray300}`,
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
                  border: `1px solid ${colors.gray300}`,
                  background: colors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: colors.gray600
                }}>
                  <Icons.settings />
                </button>
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
                      {['SİPARİŞ', 'MÜŞTERİ', 'ADRES', 'MESAFE', 'SAAT', 'DURUM', 'ÖDEME', 'KURYE'].map(header => (
                        <th key={header} style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: 12,
                          fontWeight: 600,
                          color: colors.gray500,
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
                        <td colSpan={8} style={{
                          padding: '60px 20px',
                          textAlign: 'center',
                          color: colors.gray400
                        }}>
                          Bu kategoride sipariş bulunmamaktadır
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                          <td style={{ padding: '16px', fontWeight: 600, color: colors.primary }}>{order.id}</td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ fontWeight: 500, color: colors.gray800 }}>{order.customerName}</div>
                            <div style={{ fontSize: 13, color: colors.gray500 }}>{order.customerPhone}</div>
                          </td>
                          <td style={{ padding: '16px', color: colors.gray600, maxWidth: 200 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {order.address}
                            </div>
                          </td>
                          <td style={{ padding: '16px', color: colors.gray600 }}>{order.distance}</td>
                          <td style={{ padding: '16px', color: colors.gray600 }}>{order.time}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 600,
                              background: order.status === 'pending' ? '#fef3c7' : '#dbeafe',
                              color: order.status === 'pending' ? '#92400e' : '#1e40af'
                            }}>
                              {order.status === 'pending' ? 'Bekliyor' : 'Yolda'}
                            </span>
                          </td>
                          <td style={{ padding: '16px', fontWeight: 600, color: colors.gray800 }}>
                            {order.total.toFixed(2)} TL
                          </td>
                          <td style={{ padding: '16px', color: colors.gray600 }}>{order.courier}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab !== 'orders' && (
            <div style={{
              padding: 60,
              textAlign: 'center',
              color: colors.gray500,
              background: colors.white,
              borderRadius: 12
            }}>
              Bu sayfa yapım aşamasında
            </div>
          )}
        </div>
      </main>

      {/* New Order Modal */}
      <AnimatePresence>
        {showNewOrderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'flex-end'
            }}
            onClick={() => setShowNewOrderModal(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width: '100%',
                maxWidth: 900,
                height: '100vh',
                background: colors.white,
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: `1px solid ${colors.gray200}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.gray800, margin: 0 }}>
                  Sipariş Bilgileri
                </h2>
                <button 
                  onClick={() => setShowNewOrderModal(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: colors.gray500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icons.close />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
                {/* Customer Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, color: colors.gray600, marginBottom: 6, display: 'block' }}>Ad Soyad</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: colors.gray600, marginBottom: 6, display: 'block' }}>Telefon</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          border: `1px solid ${colors.gray300}`,
                          borderRadius: 8,
                          fontSize: 14,
                          outline: 'none'
                        }}
                      />
                      <button style={{
                        padding: '10px 16px',
                        background: colors.primary,
                        border: 'none',
                        borderRadius: 8,
                        color: colors.white,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        Ara <Icons.search />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: colors.gray600, marginBottom: 6, display: 'block' }}>Ödeme Yöntemi</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none',
                        background: colors.white
                      }}
                    >
                      <option value="Nakit">Nakit</option>
                      <option value="Kredi Kartı">Kredi Kartı</option>
                      <option value="Online Ödeme">Online Ödeme</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: colors.gray600, marginBottom: 6, display: 'block' }}>Ödeme Tutarı</label>
                    <input
                      type="number"
                      value={cartTotal.toFixed(2)}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                        background: colors.gray50
                      }}
                    />
                  </div>
                </div>

                {/* Address */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, color: colors.gray600, marginBottom: 6, display: 'block' }}>Adres</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Adres giriniz..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: colors.gray600, marginBottom: 6, display: 'block' }}>Adres Detayı</label>
                    <input
                      type="text"
                      value={addressDetail}
                      onChange={(e) => setAddressDetail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Note */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div>
                    <label style={{ fontSize: 13, color: colors.gray600, marginBottom: 6, display: 'block' }}>Sipariş Notu</label>
                    <input
                      type="text"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: colors.gray600, marginBottom: 6, display: 'block' }}>&nbsp;</label>
                    <div style={{ padding: '10px 12px', color: colors.gray400 }}>
                      Müşteri adresi haritada görüntülenecek
                    </div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: `1px solid ${colors.gray200}`, marginBottom: 24 }} />

                {/* Categories */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 20,
                        border: 'none',
                        background: activeCategory === cat ? colors.primary : colors.gray100,
                        color: activeCategory === cat ? colors.white : colors.gray600,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <Icons.search />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ürün ara..."
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: `1px solid ${colors.gray300}`,
                      borderRadius: 8,
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Products Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: 12
                }}>
                  {filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      style={{
                        padding: 16,
                        background: colors.white,
                        border: `1px solid ${colors.gray200}`,
                        borderRadius: 12,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = colors.gray200;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 600, color: colors.gray800, marginBottom: 4 }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: 12, color: colors.gray500, marginBottom: 8 }}>
                        {product.category}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: colors.primary }}>
                        {product.price} TL
                      </div>
                    </button>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 40, color: colors.gray400 }}>
                    Ürün bulunamadı
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: 16,
                borderTop: `1px solid ${colors.gray200}`,
                background: colors.gray50,
                display: 'flex',
                gap: 12,
                alignItems: 'center'
              }}>
                {/* Printer Size */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {['57mm', '80mm'].map(size => (
                    <button
                      key={size}
                      onClick={() => setPrinterSize(size)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: `1px solid ${printerSize === size ? colors.primary : colors.gray300}`,
                        background: printerSize === size ? colors.primary : colors.white,
                        color: printerSize === size ? colors.white : colors.gray600,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 500
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setShowNewOrderModal(false)}
                  style={{
                    padding: '10px 20px',
                    border: `1px solid ${colors.gray300}`,
                    background: colors.white,
                    borderRadius: 8,
                    color: colors.gray600,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500
                  }}
                >
                  Kapat
                </button>

                <button 
                  onClick={() => alert('Yazdırılıyor...')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: colors.gray600,
                    borderRadius: 8,
                    color: colors.white,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Icons.print /> Yazdır
                </button>

                {/* Cart Summary */}
                <div style={{
                  padding: '10px 20px',
                  background: colors.primary,
                  borderRadius: 8,
                  color: colors.white,
                  fontWeight: 600
                }}>
                  Toplam: {cartTotal.toFixed(2)} TL
                </div>

                <button 
                  onClick={handleCreateOrder}
                  style={{
                    padding: '10px 24px',
                    border: 'none',
                    background: colors.gray400,
                    borderRadius: 8,
                    color: colors.white,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    marginLeft: 'auto'
                  }}
                >
                  Sipariş Oluştur
                </button>
              </div>

              {/* Cart Sidebar inside Modal */}
              {cart.length > 0 && (
                <div style={{
                  position: 'absolute',
                  right: 24,
                  top: 80,
                  width: 280,
                  background: colors.white,
                  border: `1px solid ${colors.gray200}`,
                  borderRadius: 12,
                  padding: 16,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.gray800, marginBottom: 12 }}>
                    Sepet ({cart.length})
                  </h3>
                  <div style={{ maxHeight: 300, overflow: 'auto' }}>
                    {cart.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: `1px solid ${colors.gray100}`
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: colors.gray500 }}>{item.price} TL</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button 
                            onClick={() => updateCartQuantity(item.id, -1)}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 4,
                              border: `1px solid ${colors.gray300}`,
                              background: colors.white,
                              cursor: 'pointer'
                            }}
                          >-</button>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, 1)}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 4,
                              border: `1px solid ${colors.gray300}`,
                              background: colors.white,
                              cursor: 'pointer'
                            }}
                          >+</button>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 4,
                              border: 'none',
                              background: colors.redLight,
                              color: colors.red,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Icons.trash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
