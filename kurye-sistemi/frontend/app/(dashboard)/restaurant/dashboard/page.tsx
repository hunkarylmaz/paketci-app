'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const Icons = {
  menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  phone: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mapPin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shoppingCart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" strokeLinecap="round" strokeLinejoin="round"/><circle cx="20" cy="21" r="1" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  fileText: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  barChart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  dollar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  print: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 14h12v8H6z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  list: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06-.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trendUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 6l-9.5 9.5-5-5L1 18" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 6h6v6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trendDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 18l-9.5-9.5-5 5L1 6" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 18h6v-6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  package: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  truck: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" strokeLinecap="round" strokeLinejoin="round"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18.5" cy="18.5" r="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  wifi: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 16 0 016.95 0M12 20h.01" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  link: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  alert: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

// Sample data
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

// Platform integrations data
const platformIntegrations = [
  { id: 'yemeksepeti', name: 'Yemeksepeti', icon: '🍽️', status: 'connected', color: 'bg-red-500', orders: 45, revenue: 5670 },
  { id: 'migrosyemek', name: 'Migros Yemek', icon: '🥘', status: 'disconnected', color: 'bg-orange-500', orders: 0, revenue: 0 },
  { id: 'trendyolyemek', name: 'Trendyol Yemek', icon: '🛵', status: 'connected', color: 'bg-orange-600', orders: 32, revenue: 3840 },
  { id: 'getiryemek', name: 'Getir Yemek', icon: '📱', status: 'pending', color: 'bg-purple-500', orders: 0, revenue: 0 },
];

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
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
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

  const filteredOrders = orders.filter(order => {
    if (activeOrderTab === 'pending') return order.status === 'pending';
    if (activeOrderTab === 'onway') return order.status === 'onway';
    return true;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const onwayCount = orders.filter(o => o.status === 'onway').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const todayOrders = orders.filter(o => o.createdAt?.includes(new Date().toLocaleDateString('tr-TR')));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-16 lg:w-18 bg-blue-800 min-h-screen fixed left-0 top-0 bottom-0 z-50 flex flex-col items-center py-20 gap-2">
        {[
          { id: 'orders', icon: Icons.shoppingCart, label: 'Siparişler' },
          { id: 'integrations', icon: Icons.wifi, label: 'Entegrasyonlar' },
          { id: 'reports', icon: Icons.fileText, label: 'Raporlar' },
          { id: 'stats', icon: Icons.barChart, label: 'İstatistik' },
          { id: 'calendar', icon: Icons.calendar, label: 'Takvim' },
          { id: 'finance', icon: Icons.dollar, label: 'Finans' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeTab === item.id ? 'bg-blue-400 text-blue-900' : 'text-white/70 hover:text-white hover:bg-blue-700'
            }`}
          >
            <item.icon />
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-16 min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg lg:text-xl font-bold text-blue-600 truncate">Paketçiniz</span>
              <span className="text-sm text-gray-500 hidden sm:inline">Bodrum</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs">
              <Icons.mapPin />
              <span className="font-medium text-gray-700">{user.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
              <Icons.phone />
              <span>Aramalar</span>
            </button>
            <button onClick={() => setShowNewOrderModal(true)} className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <Icons.plus />
              <span className="hidden sm:inline">Yeni Sipariş</span>
              <span className="sm:hidden">Yeni</span>
            </button>
            <button onClick={handleLogout} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
              <Icons.logout />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Siparişler</h2>
              </div>

              {/* Order Tabs */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveOrderTab('pending')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeOrderTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>
                  Bekleyen <span className={`px-2 py-0.5 rounded-full text-xs ${activeOrderTab === 'pending' ? 'bg-white/30' : 'bg-gray-200'}`}>{pendingCount}</span>
                </button>
                <button onClick={() => setActiveOrderTab('onway')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeOrderTab === 'onway' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>
                  Yoldaki <span className={`px-2 py-0.5 rounded-full text-xs ${activeOrderTab === 'onway' ? 'bg-white/30' : 'bg-gray-200'}`}>{onwayCount}</span>
                </button>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                        <th className="px-4 py-3 text-left font-semibold">Sipariş</th>
                        <th className="px-4 py-3 text-left font-semibold">Müşteri</th>
                        <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Adres</th>
                        <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Saat</th>
                        <th className="px-4 py-3 text-left font-semibold">Durum</th>
                        <th className="px-4 py-3 text-left font-semibold">Ödeme</th>
                        <th className="px-4 py-3 text-left font-semibold"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">Bu kategoride sipariş bulunmamaktadır</td></tr>
                      ) : (
                        filteredOrders.map(order => (
                          <tr key={order.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3"><span className="font-bold text-blue-600">#{order.id}</span></td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-800">{order.customerName}</div>
                              <div className="text-xs text-gray-500">{order.customerPhone}</div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell"><div className="text-sm text-gray-600 max-w-xs truncate">{order.address}</div></td>
                            <td className="px-4 py-3 hidden sm:table-cell text-sm text-gray-500">{order.time}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{order.status === 'pending' ? 'Bekliyor' : 'Yolda'}</span></td>
                            <td className="px-4 py-3 font-semibold">{order.total.toFixed(2)} TL</td>
                            <td className="px-4 py-3">
                              <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:text-blue-800"><Icons.eye /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Platform Entegrasyonları</h2>
              <p className="text-gray-600">Yemeksepeti, Migros Yemek, Trendyol Yemek ve Getir Yemek siparişlerini otomatik senkronize edin.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platformIntegrations.map(platform => (
                  <div key={platform.id} className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-2xl`}>{platform.icon}</div>
                        <div>
                          <h3 className="font-bold text-gray-800">{platform.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${platform.status === 'connected' ? 'bg-green-500' : platform.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
                            <span className="text-xs text-gray-500 capitalize">{platform.status === 'connected' ? 'Bağlı' : platform.status === 'pending' ? 'Beklemede' : 'Bağlı Değil'}</span>
                          </div>
                        </div>
                      </div>
                      <button className={`px-4 py-2 rounded-lg text-sm font-medium ${platform.status === 'connected' ? 'bg-red-50 text-red-600' : 'bg-blue-600 text-white'}`}>
                        {platform.status === 'connected' ? 'Bağlantıyı Kes' : 'Bağlan'}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Sipariş</p>
                        <p className="text-lg font-bold">{platform.orders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ciro</p>
                        <p className="text-lg font-bold">{platform.revenue.toLocaleString()} TL</p>
                      </div>
                    </div>

                    {platform.status === 'connected' && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2 text-sm text-green-700">
                        <Icons.check />
                        <span>Otomatik senkronizasyon aktif</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chrome Extension */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">Chrome Eklentisi</h3>
                    <p className="text-blue-100 mt-1">Platform panelinden siparişleri tek tıkla içe aktarın</p>
                  </div>
                  <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Eklentiyi İndir
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Raporlar</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                  <p className="text-blue-100 text-sm">Toplam Sipariş</p>
                  <p className="text-3xl font-bold mt-1">{orders.length}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-100"><Icons.trendUp /><span>+12% bu hafta</span></div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                  <p className="text-green-100 text-sm">Toplam Ciro</p>
                  <p className="text-3xl font-bold mt-1">{totalRevenue.toLocaleString()} TL</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-green-100"><Icons.trendUp /><span>+8% bu hafta</span></div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                  <p className="text-purple-100 text-sm">Ortalama Tutar</p>
                  <p className="text-3xl font-bold mt-1">{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0} TL</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
                  <p className="text-orange-100 text-sm">Bugünkü Sipariş</p>
                  <p className="text-3xl font-bold mt-1">{todayOrders.length}</p>
                </div>
              </div>

              {/* Daily Report */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-800 mb-4">Günlük Özet</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Bugünkü Siparişler</span>
                    <span className="font-bold">{todayOrders.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Bugünkü Ciro</span>
                    <span className="font-bold">{todayOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)} TL</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Ortalama Hazırlama Süresi</span>
                    <span className="font-bold">12 dk</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Müşteri Memnuniyeti</span>
                    <span className="font-bold text-green-600">%98</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">İstatistikler</h2>
              
              {/* Top Products */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-800 mb-4">En Çok Satan Ürünler</h3>
                <div className="space-y-3">
                  {sampleProducts.slice(0, 5).map((product, idx) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                        <span>{product.name}</span>
                      </div>
                      <span className="font-bold">{Math.floor(Math.random() * 50 + 10)} adet</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peak Hours */}
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-800 mb-4">Yoğun Saatler</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map((hour, idx) => {
                    const intensity = idx === 2 || idx === 3 || idx === 8 || idx === 9 ? 'bg-blue-600' : idx === 1 || idx === 4 || idx === 7 || idx === 10 ? 'bg-blue-400' : 'bg-blue-200';
                    return (
                      <div key={hour} className="text-center">
                        <div className={`${intensity} h-20 rounded-lg mb-1`}></div>
                        <span className="text-xs text-gray-500">{hour}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Takvim</h2>
              <div className="bg-white rounded-xl border p-6">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                    <button key={date} className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      date === new Date().getDate() ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'
                    }`}>
                      {date}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FINANCE TAB */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Finans</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border p-5">
                  <p className="text-gray-500 text-sm">Bekleyen Ödemeler</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">3,240 TL</p>
                </div>
                <div className="bg-white rounded-xl border p-5">
                  <p className="text-gray-500 text-sm">Bu Ayki Kazanç</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">45,680 TL</p>
                </div>
                <div className="bg-white rounded-xl border p-5">
                  <p className="text-gray-500 text-sm">Komisyon Giderleri</p>
                  <p className="text-2xl font-bold text-red-500 mt-1">8,450 TL</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tarih</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Açıklama</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tutar</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">22.03.2026</td>
                      <td className="px-4 py-3 text-sm">Yemeksepeti ödemesi</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">+12,450 TL</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Tamamlandı</span></td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">21.03.2026</td>
                      <td className="px-4 py-3 text-sm">Getir Yemek komisyonu</td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-500">-850 TL</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Kesinti</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* New Order Modal */}
      <AnimatePresence>
        {showNewOrderModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setShowNewOrderModal(false)}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="bg-white w-full max-w-4xl h-full flex flex-col" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">Sipariş Bilgileri</h2>
                <button onClick={() => setShowNewOrderModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><Icons.close /></button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-auto p-4">
                {/* Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Ad Soyad *</label>
                    <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Telefon *</label>
                    <div className="flex gap-2">
                      <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      <button className="px-3 py-2 bg-blue-600 text-white rounded-lg"><Icons.search /></button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Ödeme Yöntemi</label>
                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none">
                      <option>Nakit</option>
                      <option>Kredi Kartı</option>
                      <option>Online Ödeme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Toplam</label>
                    <input type="text" value={cartTotal.toFixed(2) + ' TL'} readOnly className="w-full px-3 py-2 border bg-gray-50 rounded-lg" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Adres *</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Sokak, Mahalle" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Adres Detayı</label>
                    <input type="text" value={addressDetail} onChange={e => setAddressDetail(e.target.value)} placeholder="Bina No, Daire" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">Sipariş Notu</label>
                  <input type="text" value={orderNote} onChange={e => setOrderNote(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <hr className="my-4" />

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{cat}</button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Ürün ara..." className="w-full px-4 py-2 pl-10 border rounded-lg" />
                  <span className="absolute left-3 top-2.5 text-gray-400"><Icons.search /></span>
                </div>

                {/* Products */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredProducts.map(product => (
                    <button key={product.id} onClick={() => addToCart(product)} className="p-4 border rounded-xl text-left hover:border-blue-500 hover:shadow-md transition-all bg-white">
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                      <p className="text-blue-600 font-bold mt-1">{product.price} TL</p>
                    </button>
                  ))}
                </div>

                {filteredProducts.length === 0 && <div className="text-center py-8 text-gray-400">Ürün bulunamadı</div>}
              </div>

              {/* Footer */}
              <div className="border-t p-4 bg-gray-50">
                <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
                  {/* Cart */}
                  <div className="flex-1 bg-white rounded-lg border p-3 max-h-32 overflow-auto">
                    <p className="text-sm font-semibold mb-2">Sepet ({cart.length})</p>
                    {cart.length === 0 ? <p className="text-gray-400 text-sm">Sepet boş</p> : (
                      <div className="space-y-2">
                        {cart.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{(item.price * item.quantity).toFixed(2)} TL</span>
                              <button onClick={() => updateCartQuantity(item.id, -1)} className="w-6 h-6 bg-gray-100 rounded">-</button>
                              <button onClick={() => updateCartQuantity(item.id, 1)} className="w-6 h-6 bg-gray-100 rounded">+</button>
                              <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 bg-red-50 text-red-500 rounded"><Icons.trash /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex bg-white rounded-lg border p-1">
                      {['57mm', '80mm'].map(size => (
                        <button key={size} onClick={() => setPrinterSize(size)} className={`px-3 py-2 rounded text-sm font-medium ${printerSize === size ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>{size}</button>
                      ))}
                    </div>
                    <button onClick={() => setShowNewOrderModal(false)} className="px-4 py-2 bg-white border rounded-lg text-gray-600">Kapat</button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2"><Icons.print /> Yazdır</button>
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Toplam: {cartTotal.toFixed(2)} TL</div>
                    <button onClick={handleCreateOrder} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold">Sipariş Oluştur</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Sipariş #{selectedOrder.id}</h3>
                    <p className="text-gray-500">{selectedOrder.createdAt}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg"><Icons.close /></button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Müşteri Bilgileri</h4>
                    <p><span className="text-gray-500">Ad:</span> {selectedOrder.customerName}</p>
                    <p><span className="text-gray-500">Telefon:</span> {selectedOrder.customerPhone}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Teslimat Adresi</h4>
                    <p>{selectedOrder.address}</p>
                  </div>

                  {selectedOrder.orderNote && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-700 mb-2">Sipariş Notu</h4>
                      <p>{selectedOrder.orderNote}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Sipariş Detayı</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between py-2 border-b">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-medium">{(item.price * item.quantity).toFixed(2)} TL</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-gray-600">Ödeme Yöntemi</span>
                    <span className="font-medium">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Toplam</span>
                    <span className="text-blue-600">{selectedOrder.total.toFixed(2)} TL</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold"><Icons.print /> Yazdır</button>
                  <button className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold">Kurye Ata</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
