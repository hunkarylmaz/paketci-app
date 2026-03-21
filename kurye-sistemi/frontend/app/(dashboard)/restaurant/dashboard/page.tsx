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
  minus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  print: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 14h12v8H6z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
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
  eye: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  wifi: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 16 0 016.95 0M12 20h.01" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  warning: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  link: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  package: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  truck: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="5.5" cy="18.5" r="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18.5" cy="18.5" r="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  arrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="12 5 19 12 12 19" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// ==================== COLORS ====================
const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  sidebar: '#1E40AF',
  accent: '#FCD34D',
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
  yellow: '#F59E0B',
  orange: '#F97316',
};

// ==================== SAMPLE DATA ====================
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

const categories = ['Tümü', 'Dürümler', 'Pideler', 'Yan Ürünler', 'İçecekler', 'Tatlılar'];

const platformIntegrations = [
  { id: 'yemeksepeti', name: 'Yemeksepeti', icon: '🍽️', status: 'connected', color: '#DC2626', orders: 45, revenue: 5670 },
  { id: 'migrosyemek', name: 'Migros Yemek', icon: '🥘', status: 'disconnected', color: '#F97316', orders: 0, revenue: 0 },
  { id: 'trendyolyemek', name: 'Trendyol Yemek', icon: '🛵', status: 'connected', color: '#F97316', orders: 32, revenue: 3840 },
  { id: 'getiryemek', name: 'Getir Yemek', icon: '📱', status: 'pending', color: '#7C3AED', orders: 0, revenue: 0 },
];

// ==================== MAIN COMPONENT ====================
export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [activeOrderTab, setActiveOrderTab] = useState('pending');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Nakit');
  const [cart, setCart] = useState<any[]>([]);
  const [printerSize, setPrinterSize] = useState('80mm');
  const [user, setUser] = useState({ name: 'ASMA DÖNER BODRUM', dealerName: 'Paketçiniz Bodrum' });
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedTime, setSelectedTime] = useState('15');

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
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => setCart(cart.filter(item => item.id !== id));
  
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
      alert('Lütfen zorunlu alanları doldurun (Ad Soyad, Telefon, Adres)');
      return;
    }
    if (cart.length === 0) {
      alert('Sepete en az bir ürün ekleyin');
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
      distance: (Math.random() * 3 + 0.5).toFixed(1) + ' km',
      courier: 'Atanmadı'
    };

    const updated = [order, ...orders];
    setOrders(updated);
    localStorage.setItem('restaurant_orders', JSON.stringify(updated));
    
    // Reset form
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

  const filteredOrders = orders.filter((order: any) => {
    if (activeOrderTab === 'pending') return order.status === 'pending';
    if (activeOrderTab === 'onway') return order.status === 'onway';
    if (activeOrderTab === 'history') return ['delivered', 'cancelled'].includes(order.status);
    return true;
  });

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((o: any) => o.id === orderId ? { ...o, status: newStatus, statusChangedAt: new Date().toLocaleString('tr-TR') } : o);
    setOrders(updated);
    localStorage.setItem('restaurant_orders', JSON.stringify(updated));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus, statusChangedAt: new Date().toLocaleString('tr-TR') });
    }
  };

  const deleteOrder = (orderId: string) => {
    if (confirm('Siparişi silmek istediğinize emin misiniz?')) {
      const updated = orders.filter((o: any) => o.id !== orderId);
      setOrders(updated);
      localStorage.setItem('restaurant_orders', JSON.stringify(updated));
      setShowOrderDetail(false);
    }
  };

  const pendingCount = orders.filter((o: any) => o.status === 'pending').length;
  const onwayCount = orders.filter((o: any) => o.status === 'onway').length;
  const historyCount = orders.filter((o: any) => ['delivered', 'cancelled'].includes(o.status)).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const todayOrders = orders.filter((o: any) => o.createdAt?.includes(new Date().toLocaleDateString('tr-TR')));

  // ==================== RENDER ====================
  return (
    <div style={{ minHeight: '100vh', background: colors.gray50, display: 'flex', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{ width: 72, background: colors.sidebar, minHeight: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, paddingBottom: 20, gap: 8 }}>
        {[
          { id: 'orders', icon: Icons.cart },
          { id: 'integrations', icon: Icons.wifi },
          { id: 'reports', icon: Icons.doc },
          { id: 'stats', icon: Icons.chart },
          { id: 'calendar', icon: Icons.calendar },
          { id: 'finance', icon: Icons.dollar },
          { id: 'settings', icon: Icons.settings },
        ].map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeTab === item.id ? colors.accent : 'transparent', color: activeTab === item.id ? colors.gray800 : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            <item.icon />
          </button>
        ))}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: 72 }}>
        {/* HEADER */}
        <header style={{ height: 64, background: colors.white, borderBottom: `1px solid ${colors.gray200}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${colors.gray200}`, background: colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: colors.gray600 }}>
              <Icons.menu />
            </button>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.primary, lineHeight: 1.2 }}>Paketçiniz</div>
              <div style={{ fontSize: 13, color: colors.gray500, lineHeight: 1.2 }}>Bodrum</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: colors.primary, borderRadius: 20, marginLeft: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.white, letterSpacing: 0.5 }}>{user.name}</span>
            </div>
            <div style={{ fontSize: 12, color: colors.gray500 }}>{user.dealerName}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', background: colors.gray100, border: `1px solid ${colors.gray200}`, borderRadius: 8, color: colors.gray600, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
              <Icons.phone />
              <span>Aramalar</span>
              <div style={{ width: 44, height: 24, background: colors.gray300, borderRadius: 12, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, background: colors.white, borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
            </button>
            <button onClick={() => setShowNewOrderModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: colors.primary, border: 'none', borderRadius: 8, color: colors.white, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              <Icons.plus />
              <span>Yeni Sipariş</span>
            </button>
            <button onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: colors.gray100, color: colors.gray600, cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icons.logout />
              <span>Çıkış</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={{ padding: 24 }}>
          {/* ===== ORDERS TAB ===== */}
          {activeTab === 'orders' && (
            <div>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveOrderTab('pending')} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: activeOrderTab === 'pending' ? colors.primary : colors.white, color: activeOrderTab === 'pending' ? colors.white : colors.gray600, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: activeOrderTab === 'pending' ? '0 2px 4px rgba(37,99,235,0.3)' : `0 1px 3px ${colors.gray200}` }}>
                  Bekleyen
                  <span style={{ background: activeOrderTab === 'pending' ? 'rgba(255,255,255,0.3)' : colors.gray200, color: activeOrderTab === 'pending' ? colors.white : colors.gray600, padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{pendingCount}</span>
                </button>
                <button onClick={() => setActiveOrderTab('onway')} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${colors.gray200}`, background: activeOrderTab === 'onway' ? colors.primary : colors.white, color: activeOrderTab === 'onway' ? colors.white : colors.gray600, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Yolda
                  <span style={{ background: activeOrderTab === 'onway' ? 'rgba(255,255,255,0.3)' : colors.gray200, color: activeOrderTab === 'onway' ? colors.white : colors.gray600, padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{onwayCount}</span>
                </button>
                <button onClick={() => setActiveOrderTab('history')} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${colors.gray200}`, background: activeOrderTab === 'history' ? colors.primary : colors.white, color: activeOrderTab === 'history' ? colors.white : colors.gray600, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Geçmiş
                  <span style={{ background: activeOrderTab === 'history' ? 'rgba(255,255,255,0.3)' : colors.gray200, color: activeOrderTab === 'history' ? colors.white : colors.gray600, padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{historyCount}</span>
                </button>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <button style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${colors.gray200}`, background: colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: colors.gray600 }}><Icons.search /></button>
                  <button style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${colors.gray200}`, background: colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: colors.gray600 }}><Icons.list /></button>
                </div>
              </div>

              {/* Orders Table */}
              <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: colors.gray50 }}>
                      {['SİPARİŞ', 'MÜŞTERİ', 'ADRES', 'MESAFE', 'SAAT', 'DURUM', 'ÖDEME', 'İŞLEM'].map((header) => (
                        <th key={header} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `1px solid ${colors.gray200}` }}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan={8} style={{ padding: '60px 20px', textAlign: 'center', color: colors.gray500, fontSize: 14 }}>Bu kategoride sipariş bulunmamaktadır</td></tr>
                    ) : (
                      filteredOrders.map((order: any) => {
                        const statusColors: any = {
                          pending: { bg: '#FEF3C7', color: colors.yellow, text: 'Bekliyor' },
                          onway: { bg: '#DBEAFE', color: colors.primary, text: 'Yolda' },
                          delivered: { bg: '#D1FAE5', color: colors.green, text: 'Teslim' },
                          cancelled: { bg: '#FEE2E2', color: colors.red, text: 'İptal' },
                          waiting: { bg: '#E0E7FF', color: '#4F46E5', text: 'Beklemede' }
                        };
                        const status = statusColors[order.status] || statusColors.pending;
                        return (
                          <tr key={order.id} style={{ borderTop: `1px solid ${colors.gray200}`, cursor: 'pointer' }} onClick={() => { setSelectedOrder(order); setShowOrderDetail(true); }}>
                            <td style={{ padding: '12px 16px' }}><span style={{ fontWeight: 700, color: colors.primary, fontSize: 13 }}>#{order.id}</span></td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: 600, color: colors.gray800, fontSize: 13 }}>{order.customerName}</div>
                              <div style={{ fontSize: 11, color: colors.gray500 }}>{order.customerPhone}</div>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 12, color: colors.gray600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.address}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, color: colors.gray600 }}>{order.distance}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, color: colors.gray600 }}>{order.time}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: status.bg, color: status.color }}>{status.text}</span>
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: colors.gray800, fontSize: 13 }}>{order.total.toFixed(2)} TL</td>
                            <td style={{ padding: '12px 16px' }}>
                              <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setShowOrderDetail(true); }} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: colors.primary, color: colors.white, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Detay</button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== INTEGRATIONS TAB ===== */}
          {activeTab === 'integrations' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.gray800, marginBottom: 8 }}>Platform Entegrasyonları</h2>
              <p style={{ color: colors.gray500, marginBottom: 24 }}>Yemeksepeti, Migros Yemek, Trendyol Yemek ve Getir Yemek siparişlerini otomatik senkronize edin. API bilgilerinizi girerek bağlantı kurun.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
                {platformIntegrations.map(platform => (
                  <div key={platform.id} style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: platform.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{platform.icon}</div>
                        <div>
                          <h3 style={{ fontWeight: 700, color: colors.gray800 }}>{platform.name}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: platform.status === 'connected' ? colors.green : platform.status === 'pending' ? colors.yellow : colors.gray400 }}></span>
                            <span style={{ fontSize: 12, color: colors.gray500 }}>{platform.status === 'connected' ? 'Bağlı' : platform.status === 'pending' ? 'Beklemede' : 'Bağlı Değil'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* API Settings Form */}
                    <div style={{ marginBottom: 16, padding: 16, background: colors.gray50, borderRadius: 8 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: colors.gray700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>API Bağlantı Ayarları</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div>
                          <label style={{ fontSize: 12, color: colors.gray600, marginBottom: 4, display: 'block' }}>API Key / Restaurant ID</label>
                          <input type="text" placeholder="API Key girin..." style={{ width: '100%', padding: '8px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, color: colors.gray600, marginBottom: 4, display: 'block' }}>API Secret / Şifre</label>
                          <input type="password" placeholder="Secret key girin..." style={{ width: '100%', padding: '8px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                          <button style={{ flex: 1, padding: '10px', borderRadius: 6, border: 'none', background: platform.status === 'connected' ? colors.red : colors.primary, color: colors.white, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                            {platform.status === 'connected' ? 'Bağlantıyı Kes' : 'Bağlan'}
                          </button>
                          <button style={{ padding: '10px 16px', borderRadius: 6, border: `1px solid ${colors.gray300}`, background: colors.white, color: colors.gray600, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Test Et</button>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 16, borderTop: `1px solid ${colors.gray100}` }}>
                      <div><p style={{ fontSize: 12, color: colors.gray500 }}>Sipariş</p><p style={{ fontSize: 18, fontWeight: 700 }}>{platform.orders}</p></div>
                      <div><p style={{ fontSize: 12, color: colors.gray500 }}>Ciro</p><p style={{ fontSize: 18, fontWeight: 700 }}>{platform.revenue.toLocaleString()} TL</p></div>
                    </div>
                    
                    {platform.status === 'connected' && (
                      <div style={{ marginTop: 12, padding: 10, background: '#D1FAE5', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#065F46' }}>
                        <Icons.check /> Otomatik senkronizasyon aktif
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Integration Settings */}
              <div style={{ marginTop: 24, padding: 24, background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}` }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.gray800, marginBottom: 16 }}>Senkronizasyon Ayarları</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: colors.gray50, borderRadius: 8, cursor: 'pointer' }}>
                    <span style={{ fontSize: 14 }}>Otomatik sipariş çekme</span>
                    <div style={{ width: 44, height: 24, background: colors.primary, borderRadius: 12, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, background: colors.white, borderRadius: '50%' }} />
                    </div>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: colors.gray50, borderRadius: 8, cursor: 'pointer' }}>
                    <span style={{ fontSize: 14 }}>Sipariş iptal bildirimi</span>
                    <div style={{ width: 44, height: 24, background: colors.primary, borderRadius: 12, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, background: colors.white, borderRadius: '50%' }} />
                    </div>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: colors.gray50, borderRadius: 8, cursor: 'pointer' }}>
                    <span style={{ fontSize: 14 }}>Stok senkronizasyonu</span>
                    <div style={{ width: 44, height: 24, background: colors.gray300, borderRadius: 12, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, background: colors.white, borderRadius: '50%' }} />
                    </div>
                  </label>
                </div>
                
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, color: colors.gray600, marginBottom: 4, display: 'block' }}>Senkronizasyon Aralığı</label>
                    <select style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 14 }}>
                      <option>Her 1 dakika</option>
                      <option>Her 5 dakika</option>
                      <option>Her 15 dakika</option>
                      <option>Her 30 dakika</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, color: colors.gray600, marginBottom: 4, display: 'block' }}>Webhook URL</label>
                    <input type="text" readOnly value="https://api.paketciniz.com/webhook/orders" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 14, background: colors.gray50 }} />
                  </div>
                </div>
              </div>

              {/* Chrome Extension Banner */}
              <div style={{ marginTop: 24, padding: 24, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, borderRadius: 12, color: colors.white, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>Chrome Eklentisi</h3>
                  <p style={{ marginTop: 4, opacity: 0.9 }}>Platform panelinden siparişleri tek tıkla içe aktarın</p>
                </div>
                <button style={{ padding: '12px 24px', background: colors.white, color: colors.primary, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Eklentiyi İndir</button>
              </div>
            </div>
          )}

          {/* ===== REPORTS TAB ===== */}
          {activeTab === 'reports' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.gray800, marginBottom: 24 }}>Raporlar</h2>
              
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                <div style={{ padding: 20, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, borderRadius: 12, color: colors.white }}>
                  <p style={{ opacity: 0.9, fontSize: 13 }}>Toplam Sipariş</p>
                  <p style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>{orders.length}</p>
                  <p style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>+12% bu hafta</p>
                </div>
                <div style={{ padding: 20, background: `linear-gradient(135deg, ${colors.green}, #059669)`, borderRadius: 12, color: colors.white }}>
                  <p style={{ opacity: 0.9, fontSize: 13 }}>Toplam Ciro</p>
                  <p style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>{totalRevenue.toLocaleString()} TL</p>
                  <p style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>+8% bu hafta</p>
                </div>
                <div style={{ padding: 20, background: `linear-gradient(135deg, #7C3AED, #6D28D9)`, borderRadius: 12, color: colors.white }}>
                  <p style={{ opacity: 0.9, fontSize: 13 }}>Ortalama Tutar</p>
                  <p style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0} TL</p>
                </div>
                <div style={{ padding: 20, background: `linear-gradient(135deg, ${colors.orange}, #EA580C)`, borderRadius: 12, color: colors.white }}>
                  <p style={{ opacity: 0.9, fontSize: 13 }}>Bugünkü Sipariş</p>
                  <p style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>{todayOrders.length}</p>
                </div>
              </div>

              {/* Daily Summary */}
              <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.gray800, marginBottom: 16 }}>Günlük Özet</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    { label: 'Bugünkü Siparişler', value: todayOrders.length },
                    { label: 'Bugünkü Ciro', value: `${todayOrders.reduce((sum, o: any) => sum + o.total, 0).toFixed(2)} TL` },
                    { label: 'Ortalama Hazırlama Süresi', value: '12 dk' },
                    { label: 'Müşteri Memnuniyeti', value: '%98', color: colors.green },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: colors.gray50, borderRadius: 8 }}>
                      <span style={{ color: colors.gray600 }}>{item.label}</span>
                      <span style={{ fontWeight: 700, color: item.color || colors.gray800 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== STATS TAB ===== */}
          {activeTab === 'stats' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.gray800, marginBottom: 24 }}>İstatistikler</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Top Products */}
                <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.gray800, marginBottom: 16 }}>En Çok Satan Ürünler</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {sampleProducts.slice(0, 5).map((product, idx) => (
                      <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: colors.gray50, borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ width: 28, height: 28, background: colors.primary, color: colors.white, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{idx + 1}</span>
                          <span>{product.name}</span>
                        </div>
                        <span style={{ fontWeight: 700 }}>{Math.floor(Math.random() * 50 + 10)} adet</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Peak Hours */}
                <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.gray800, marginBottom: 16 }}>Yoğun Saatler</h3>
                  <div style={{ display: 'flex', gap: 8, height: 150, alignItems: 'flex-end' }}>
                    {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map((hour, idx) => {
                      const height = idx === 2 || idx === 3 || idx === 8 || idx === 9 ? 100 : idx === 1 || idx === 4 || idx === 7 || idx === 10 ? 70 : 40;
                      return (
                        <div key={hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: '100%', height, background: colors.primary, borderRadius: 4, opacity: height / 100 }}></div>
                          <span style={{ fontSize: 10, color: colors.gray500 }}>{hour}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== CALENDAR TAB ===== */}
          {activeTab === 'calendar' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.gray800, marginBottom: 24 }}>Takvim</h2>
              <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 16 }}>
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                    <div key={day} style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: colors.gray500, padding: '10px' }}>{day}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                    <button key={date} style={{ aspectRatio: '1', borderRadius: 8, border: 'none', background: date === new Date().getDate() ? colors.primary : colors.white, color: date === new Date().getDate() ? colors.white : colors.gray700, fontWeight: 500, cursor: 'pointer' }}>
                      {date}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== FINANCE TAB ===== */}
          {activeTab === 'finance' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.gray800, marginBottom: 24 }}>Finans</h2>
              
              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
                <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 20 }}>
                  <p style={{ fontSize: 13, color: colors.gray500 }}>Bekleyen Ödemeler</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: colors.gray800, marginTop: 4 }}>3,240 TL</p>
                </div>
                <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 20 }}>
                  <p style={{ fontSize: 13, color: colors.gray500 }}>Bu Ayki Kazanç</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: colors.green, marginTop: 4 }}>45,680 TL</p>
                </div>
                <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 20 }}>
                  <p style={{ fontSize: 13, color: colors.gray500 }}>Komisyon Giderleri</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: colors.red, marginTop: 4 }}>8,450 TL</p>
                </div>
              </div>

              {/* Transaction Table */}
              <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: colors.gray50 }}>
                    <tr>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: colors.gray500 }}>TARİH</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: colors.gray500 }}>AÇIKLAMA</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: colors.gray500 }}>TUTAR</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: colors.gray500 }}>DURUM</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderTop: `1px solid ${colors.gray200}` }}>
                      <td style={{ padding: '14px 16px', fontSize: 14 }}>22.03.2026</td>
                      <td style={{ padding: '14px 16px', fontSize: 14 }}>Yemeksepeti ödemesi</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: colors.green }}>+12,450 TL</td>
                      <td style={{ padding: '14px 16px' }}><span style={{ padding: '4px 10px', background: '#D1FAE5', color: '#065F46', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>Tamamlandı</span></td>
                    </tr>
                    <tr style={{ borderTop: `1px solid ${colors.gray200}` }}>
                      <td style={{ padding: '14px 16px', fontSize: 14 }}>21.03.2026</td>
                      <td style={{ padding: '14px 16px', fontSize: 14 }}>Getir Yemek komisyonu</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: colors.red }}>-850 TL</td>
                      <td style={{ padding: '14px 16px' }}><span style={{ padding: '4px 10px', background: '#FEE2E2', color: '#991B1B', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>Kesinti</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== SETTINGS TAB ===== */}
          {activeTab === 'settings' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.gray800, marginBottom: 24 }}>Ayarlar</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.gray800, marginBottom: 16 }}>Restoran Bilgileri</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div><label style={{ fontSize: 13, color: colors.gray500 }}>Restoran Adı</label><input type="text" defaultValue="ASMA DÖNER BODRUM" style={{ width: '100%', marginTop: 4, padding: 10, border: `1px solid ${colors.gray300}`, borderRadius: 8 }} /></div>
                    <div><label style={{ fontSize: 13, color: colors.gray500 }}>Telefon</label><input type="text" defaultValue="+90 252 123 45 67" style={{ width: '100%', marginTop: 4, padding: 10, border: `1px solid ${colors.gray300}`, borderRadius: 8 }} /></div>
                    <div><label style={{ fontSize: 13, color: colors.gray500 }}>Adres</label><input type="text" defaultValue="Bodrum, Muğla" style={{ width: '100%', marginTop: 4, padding: 10, border: `1px solid ${colors.gray300}`, borderRadius: 8 }} /></div>
                    <button style={{ marginTop: 8, padding: 12, background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Kaydet</button>
                  </div>
                </div>

                <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.gray800, marginBottom: 16 }}>Çalışma Saatleri</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day) => (
                      <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: colors.gray50, borderRadius: 8 }}>
                        <span>{day}</span>
                        <span style={{ fontSize: 13, color: colors.gray500 }}>10:00 - 22:00</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.gray800, marginBottom: 16 }}>Bildirim Ayarları</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {['Yeni sipariş bildirimi', 'Sipariş iptal bildirimi', 'Kurye atama bildirimi', 'Günlük rapor'].map((item) => (
                      <label key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                        <span>{item}</span>
                        <div style={{ width: 44, height: 24, background: colors.primary, borderRadius: 12, position: 'relative' }}>
                          <div style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, background: colors.white, borderRadius: '50%' }} />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* NEW ORDER MODAL - Mobile Responsive */}
      {showNewOrderModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setShowNewOrderModal(false)}>
          <div style={{ width: '100%', maxWidth: '100vw', height: '100%', background: colors.white, display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${colors.gray200}`, flexShrink: 0 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.gray800, margin: 0 }}>Sipariş Bilgileri</h2>
              <button onClick={() => setShowNewOrderModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.gray400, padding: 4 }}><Icons.close /></button>
            </div>

            {/* Modal Body - Scrollable */}
            <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
              {/* Customer Info - Stacked on mobile */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: colors.gray700, marginBottom: 4 }}>Ad Soyad</label>
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: colors.gray700, marginBottom: 4 }}>Telefon</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} style={{ flex: 1, padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 14, outline: 'none' }} />
                      <button style={{ padding: '10px 12px', background: colors.primary, border: 'none', borderRadius: 6, color: colors.white, fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>Ara</button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: colors.gray700, marginBottom: 4 }}>Ödeme Yöntemi</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}>
                    <option>Nakit</option>
                    <option>Kredi Kartı</option>
                    <option>Online Ödeme</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: colors.gray700, marginBottom: 4 }}>Adres</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adres giriniz..." style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: colors.gray700, marginBottom: 4 }}>Adres Detayı</label>
                  <input type="text" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: colors.gray700, marginBottom: 4 }}>Sipariş Notu</label>
                    <input type="text" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ width: 100 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: colors.gray700, marginBottom: 4 }}>Tutar</label>
                    <input type="text" value={cartTotal.toFixed(2)} readOnly style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 14, background: colors.gray50, fontWeight: 700, textAlign: 'right', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>

              <hr style={{ margin: '16px 0', border: 'none', borderTop: `1px solid ${colors.gray200}` }} />

              {/* Categories - Horizontal scroll on mobile */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 14px', borderRadius: 16, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer', background: activeCategory === cat ? colors.primary : colors.gray100, color: activeCategory === cat ? colors.white : colors.gray600, whiteSpace: 'nowrap' }}>{cat}</button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ürün ara..." style={{ width: '100%', padding: '10px 12px 10px 36px', border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
                <span style={{ position: 'absolute', left: 10, top: 10, color: colors.gray400 }}><Icons.search /></span>
              </div>

              {/* Products Grid - 2 columns on mobile */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
                {filteredProducts.map(product => (
                  <button key={product.id} onClick={() => addToCart(product)} style={{ padding: 12, border: `1px solid ${colors.gray200}`, borderRadius: 10, textAlign: 'left', background: colors.white, cursor: 'pointer' }}>
                    <p style={{ fontWeight: 600, color: colors.gray800, margin: 0, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
                    <p style={{ fontSize: 11, color: colors.gray500, margin: '2px 0' }}>{product.category}</p>
                    <p style={{ fontWeight: 700, color: colors.primary, margin: 0, fontSize: 14 }}>{product.price} TL</p>
                  </button>
                ))}
              </div>

              {filteredProducts.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: colors.gray400 }}>Ürün bulunamadı</div>}
            </div>

            {/* Modal Footer - Stacked on mobile */}
            <div style={{ padding: 12, borderTop: `1px solid ${colors.gray200}`, background: colors.gray50, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
              {/* Cart Items */}
              {cart.length > 0 && (
                <div style={{ background: colors.white, borderRadius: 8, border: `1px solid ${colors.gray200}`, padding: 10, maxHeight: 120, overflow: 'auto' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: '0 0 8px' }}>Sepet ({cart.length})</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {cart.map((item) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: `1px solid ${colors.gray100}` }}>
                        <span style={{ flex: 1 }}>{item.quantity}x {item.name}</span>
                        <span style={{ fontWeight: 600, marginRight: 8 }}>{(item.price * item.quantity).toFixed(2)} TL</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <button onClick={() => updateCartQuantity(item.id, -1)} style={{ width: 24, height: 24, border: 'none', background: colors.gray200, borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>-</button>
                          <button onClick={() => updateCartQuantity(item.id, 1)} style={{ width: 24, height: 24, border: 'none', background: colors.gray200, borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>+</button>
                          <button onClick={() => removeFromCart(item.id)} style={{ width: 24, height: 24, border: 'none', background: colors.red, color: colors.white, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.trash /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Printer selection + Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setPrinterSize('57mm')} style={{ flex: 1, padding: '10px', borderRadius: 6, border: 'none', background: printerSize === '57mm' ? colors.gray600 : colors.white, color: printerSize === '57mm' ? colors.white : colors.gray700, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>57mm</button>
                  <button onClick={() => setPrinterSize('80mm')} style={{ flex: 1, padding: '10px', borderRadius: 6, border: 'none', background: printerSize === '80mm' ? colors.primary : colors.white, color: printerSize === '80mm' ? colors.white : colors.gray700, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>80mm</button>
                </div>
                
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setShowNewOrderModal(false)} style={{ flex: 1, padding: '12px', borderRadius: 6, border: 'none', background: colors.gray400, color: colors.white, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Kapat</button>
                  <button style={{ flex: 1, padding: '12px', borderRadius: 6, border: 'none', background: colors.gray500, color: colors.white, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Icons.print /><span>Yazdır</span></button>
                </div>
                
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ padding: '12px 16px', borderRadius: 6, background: colors.primary, color: colors.white, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>Toplam: {cartTotal.toFixed(2)} ₺</div>
                  <button onClick={handleCreateOrder} style={{ flex: 1, padding: '12px', borderRadius: 6, border: 'none', background: cart.length > 0 ? colors.green : colors.gray400, color: colors.white, fontSize: 14, fontWeight: 600, cursor: cart.length > 0 ? 'pointer' : 'not-allowed' }}>Sipariş Oluştur</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ORDER DETAIL MODAL */}
      {showOrderDetail && selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setShowOrderDetail(false)}>
          <div style={{ width: '100%', maxWidth: 480, height: '100%', background: colors.white, display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${colors.gray200}`, flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.gray800, margin: 0 }}>Sipariş #{selectedOrder.id}</h2>
                <p style={{ fontSize: 12, color: colors.gray500, margin: '4px 0 0' }}>{selectedOrder.createdAt}</p>
              </div>
              <button onClick={() => setShowOrderDetail(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.gray400, padding: 4 }}><Icons.close /></button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
              {/* Status Card */}
              <div style={{ padding: 16, background: colors.gray50, borderRadius: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: colors.gray500, textTransform: 'uppercase' }}>Durum</span>
                  {selectedOrder.status === 'pending' && <span style={{ padding: '4px 12px', background: '#FEF3C7', color: colors.yellow, borderRadius: 12, fontSize: 12, fontWeight: 700 }}>Bekliyor</span>}
                  {selectedOrder.status === 'onway' && <span style={{ padding: '4px 12px', background: '#DBEAFE', color: colors.primary, borderRadius: 12, fontSize: 12, fontWeight: 700 }}>Yolda</span>}
                  {selectedOrder.status === 'delivered' && <span style={{ padding: '4px 12px', background: '#D1FAE5', color: colors.green, borderRadius: 12, fontSize: 12, fontWeight: 700 }}>Teslim Edildi</span>}
                  {selectedOrder.status === 'cancelled' && <span style={{ padding: '4px 12px', background: '#FEE2E2', color: colors.red, borderRadius: 12, fontSize: 12, fontWeight: 700 }}>İptal</span>}
                  {selectedOrder.status === 'waiting' && <span style={{ padding: '4px 12px', background: '#E0E7FF', color: '#4F46E5', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>Beklemede</span>}
                </div>
                
                {/* Quick Actions */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedOrder.status === 'pending' && (
                    <>
                      <button onClick={() => updateOrderStatus(selectedOrder.id, 'onway')} style={{ flex: 1, padding: '10px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Yola Çıkar</button>
                      <button onClick={() => updateOrderStatus(selectedOrder.id, 'waiting')} style={{ flex: 1, padding: '10px', background: '#4F46E5', color: colors.white, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Beklemeye Al</button>
                      <button onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')} style={{ flex: 1, padding: '10px', background: colors.red, color: colors.white, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>İptal Et</button>
                    </>
                  )}
                  {selectedOrder.status === 'onway' && (
                    <>
                      <button onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')} style={{ flex: 1, padding: '10px', background: colors.green, color: colors.white, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Teslim Edildi</button>
                      <button onClick={() => updateOrderStatus(selectedOrder.id, 'pending')} style={{ flex: 1, padding: '10px', background: colors.gray400, color: colors.white, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Geri Al</button>
                    </>
                  )}
                  {selectedOrder.status === 'waiting' && (
                    <>
                      <button onClick={() => updateOrderStatus(selectedOrder.id, 'pending')} style={{ flex: 1, padding: '10px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Aktif Et</button>
                      <button onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')} style={{ flex: 1, padding: '10px', background: colors.red, color: colors.white, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>İptal Et</button>
                    </>
                  )}
                  {(selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled') && (
                    <button onClick={() => updateOrderStatus(selectedOrder.id, 'pending')} style={{ flex: 1, padding: '10px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Tekrar Aç</button>
                  )}
                </div>
              </div>

              {/* Wait Time Selector */}
              {selectedOrder.status === 'waiting' && (
                <div style={{ padding: 16, background: '#E0E7FF', borderRadius: 12, marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5', marginBottom: 10 }}>Bekleme Süresi Seç</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['5', '10', '15', '20', '30', '45'].map((min) => (
                      <button key={min} onClick={() => setSelectedTime(min)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: selectedTime === min ? '#4F46E5' : colors.white, color: selectedTime === min ? colors.white : '#4F46E5', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{min} dk</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Info Card */}
              <div style={{ padding: 16, background: colors.white, border: `1px solid ${colors.gray200}`, borderRadius: 12, marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.gray800, marginBottom: 12 }}>Müşteri Bilgileri</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icons.users />
                    <span style={{ fontSize: 14 }}>{selectedOrder.customerName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icons.phone />
                    <span style={{ fontSize: 14 }}>{selectedOrder.customerPhone}</span>
                    <button style={{ marginLeft: 'auto', padding: '6px 12px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Ara</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ marginTop: 2 }}>📍</span>
                    <span style={{ fontSize: 14, color: colors.gray600 }}>{selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              {/* Order Items Card */}
              <div style={{ padding: 16, background: colors.white, border: `1px solid ${colors.gray200}`, borderRadius: 12, marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.gray800, marginBottom: 12 }}>Sipariş İçeriği</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < (selectedOrder.items?.length - 1) ? `1px solid ${colors.gray100}` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 24, height: 24, background: colors.gray100, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{item.quantity}</span>
                        <span style={{ fontSize: 14 }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{(item.price * item.quantity).toFixed(2)} TL</span>
                    </div>
                  ))}
                  {!selectedOrder.items?.length && <p style={{ color: colors.gray400, fontSize: 13 }}>Ürün bilgisi yok</p>}
                </div>
                
                <hr style={{ margin: '16px 0', border: 'none', borderTop: `1px solid ${colors.gray200}` }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: colors.gray600 }}>Ödeme Yöntemi</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{selectedOrder.paymentMethod}</span>
                </div>
                {selectedOrder.orderNote && (
                  <div style={{ marginTop: 10, padding: 10, background: colors.gray50, borderRadius: 8 }}>
                    <span style={{ fontSize: 12, color: colors.gray500 }}>Not: {selectedOrder.orderNote}</span>
                  </div>
                )}
              </div>

              {/* Courier Assignment */}
              {['pending', 'onway'].includes(selectedOrder.status) && (
                <div style={{ padding: 16, background: colors.gray50, borderRadius: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.gray800, marginBottom: 12 }}>Kurye Atama</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select style={{ flex: 1, padding: '10px', border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 13 }}>
                      <option>Kurye Seç...</option>
                      <option>Ahmet K.</option>
                      <option>Mehmet Y.</option>
                      <option>Ali R.</option>
                    </select>
                    <button style={{ padding: '10px 16px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Ata</button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: 16, borderTop: `1px solid ${colors.gray200}`, background: colors.gray50, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>Toplam</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>{selectedOrder.total.toFixed(2)} TL</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, padding: '12px', background: colors.white, color: colors.gray700, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Icons.print /> Yazdır</button>
                <button onClick={() => deleteOrder(selectedOrder.id)} style={{ flex: 1, padding: '12px', background: colors.red, color: colors.white, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Siparişi Sil</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
