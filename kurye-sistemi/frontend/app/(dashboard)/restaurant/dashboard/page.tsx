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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  print: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 14h12v8H6z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  mapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// Sample products
const sampleProducts = [
  { id: 1, name: 'Adana Dürüm', price: 120, category: 'Dürümler' },
  { id: 2, name: 'Tavuk Dürüm', price: 90, category: 'Dürümler' },
  { id: 3, name: 'Ciğer Dürüm', price: 110, category: 'Dürümler' },
  { id: 4, name: 'Ayran', price: 15, category: 'İçecekler' },
  { id: 5, name: 'Coca Cola', price: 25, category: 'İçecekler' },
  { id: 6, name: 'Salata', price: 30, category: 'Yan Ürünler' },
  { id: 7, name: 'Pide', price: 150, category: 'Pideler' },
  { id: 8, name: 'Lahmacun', price: 60, category: 'Pideler' },
];

// Sample favorites
const sampleFavorites = [
  { id: 1, name: 'Adana Dürüm + Ayran', price: 135, items: ['Adana Dürüm', 'Ayran'] },
  { id: 2, name: 'Tavuk Menü', price: 115, items: ['Tavuk Dürüm', 'Ayran', 'Salata'] },
];

export default function RestaurantDashboard() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(null);
  
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Nakit');
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [printerSize, setPrinterSize] = useState('80mm');
  
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const stored = localStorage.getItem('restaurant_orders');
    if (stored) setOrders(JSON.parse(stored));
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const addToCart = (product: any, qty = quantity) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + qty }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
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
      alert('Sepet boş');
      return;
    }

    const order = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      customerName,
      customerPhone,
      address: address + (addressDetail ? ' - ' + addressDetail : ''),
      orderNote,
      paymentMethod,
      items: [...cart],
      total: cartTotal,
      status: 'pending',
      createdAt: new Date().toLocaleString('tr-TR'),
      printerSize,
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

  const filteredProducts = sampleProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors lg:hidden"
            >
              <Icons.menu />
            </button>
            <span className="font-bold text-lg">Paketçiniz</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowNewOrderModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              <Icons.plus />
              <span className="hidden sm:inline">Yeni Sipariş</span>
            </button>
            <button 
              onClick={() => router.push('/')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icons.logout />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white shadow-xl z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <nav className="p-4">
          <div className="space-y-2">
            {[
              { id: 'orders', label: 'Siparişler', icon: '📦' },
              { id: 'products', label: 'Ürünler', icon: '🍔' },
              { id: 'reports', label: 'Raporlar', icon: '📊' },
              { id: 'settings', label: 'Ayarlar', icon: '⚙️' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                    : 'hover:bg-blue-50 text-gray-700'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-6">
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Siparişler</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input 
                    type="text" 
                    placeholder="Ara..."
                    className="flex-1 sm:w-48 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Orders List */}
              <div className="grid gap-3">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                    Henüz sipariş bulunmuyor
                  </div>
                ) : (
                  orders.map(order => (
                    <div 
                      key={order.id} 
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div 
                        className="p-4 cursor-pointer"
                        onClick={() => setShowOrderDetail(showOrderDetail === order.id ? null : order.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-blue-700">#{order.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {order.status === 'pending' ? 'Bekliyor' : 'Yolda'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{order.customerName}</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-semibold text-gray-800">{order.total.toFixed(2)} TL</span>
                            <span className="text-gray-500">{order.createdAt.split(' ')[1]}</span>
                            <button className="text-blue-600 hover:text-blue-800">
                              <Icons.eye />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Order Detail */}
                      <AnimatePresence>
                        {showOrderDetail === order.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t bg-gray-50"
                          >
                            <div className="p-4 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">Telefon</p>
                                  <p className="font-medium">{order.customerPhone}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">Ödeme</p>
                                  <p className="font-medium">{order.paymentMethod}</p>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-xs text-gray-500 uppercase flex items-center gap-1">
                                  <Icons.mapPin /> Adres
                                </p>
                                <p className="font-medium mt-1">{order.address}</p>
                              </div>

                              {order.orderNote && (
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">Sipariş Notu</p>
                                  <p className="text-sm text-gray-700 bg-white p-2 rounded border">{order.orderNote}</p>
                                </div>
                              )}

                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-2">Ürünler</p>
                                <div className="space-y-1">
                                  {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded border">
                                      <span>{item.quantity}x {item.name}</span>
                                      <span className="font-medium">{(item.price * item.quantity).toFixed(2)} TL</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Ürünler</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {sampleProducts.map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-lg font-bold text-blue-700 mt-2">{product.price} TL</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Raporlar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                  <p className="text-blue-100">Bugünkü Sipariş</p>
                  <p className="text-3xl font-bold mt-1">{orders.filter(o => o.createdAt?.includes(new Date().toLocaleDateString('tr-TR'))).length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
                  <p className="text-green-100">Toplam Ciro</p>
                  <p className="text-3xl font-bold mt-1">{orders.reduce((sum, o) => sum + o.total, 0).toFixed(0)} TL</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                  <p className="text-purple-100">Ortalama Tutar</p>
                  <p className="text-3xl font-bold mt-1">
                    {orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(0) : 0} TL
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Ayarlar</h2>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-600">Ayarlar sayfası yapım aşamasında...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* New Order Modal - POS Style */}
      <AnimatePresence>
        {showNewOrderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowNewOrderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
                <h2 className="text-lg font-bold">Yeni Sipariş</h2>
                <button 
                  onClick={() => setShowNewOrderModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Icons.close />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-auto">
                <div className="p-4 sm:p-6 space-y-4">
                  
                  {/* Customer Info Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Müşteri adı"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="05XX XXX XX XX"
                        />
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors">
                          <Icons.search />
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Yöntemi</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Nakit">Nakit</option>
                        <option value="Kredi Kartı">Kredi Kartı</option>
                        <option value="Online Ödeme">Online Ödeme</option>
                      </select>
                    </div>
                  </div>

                  {/* Address Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Sokak, Mahalle, Bina No"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adres Detayı</label>
                      <input
                        type="text"
                        value={addressDetail}
                        onChange={(e) => setAddressDetail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Daire, Kat, Kapı No"
                      />
                    </div>
                  </div>

                  {/* Note & Amount Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sipariş Notu</label>
                      <input
                        type="text"
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Özel istekler..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Tutarı</label>
                      <input
                        type="number"
                        value={cartTotal.toFixed(2)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>

                  <hr />

                  {/* Quantity & Search */}
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Miktar</label>
                      <div className="flex gap-1">
                        {[1,2,3,4,5,6,7,8,9].map(num => (
                          <button
                            key={num}
                            onClick={() => setQuantity(num)}
                            className={`w-8 h-8 rounded-lg font-semibold text-sm transition-colors ${
                              quantity === num 
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowFavorites(!showFavorites)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        showFavorites 
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icons.star /> Favoriler
                    </button>

                    <div className="flex-1 w-full sm:w-auto">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Ara</label>
                      <div className="relative">
                        <Icons.search />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ürün adı..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {showFavorites ? (
                      sampleFavorites.map(fav => (
                        <button
                          key={fav.id}
                          onClick={() => addToCart({ id: fav.id + 100, name: fav.name, price: fav.price })}
                          className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors text-left"
                        >
                          <p className="font-medium text-sm text-gray-800">{fav.name}</p>
                          <p className="text-xs text-gray-500">{fav.price} TL</p>
                        </button>
                      ))
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <button
                          key={product.id}
                          onClick={() => addToCart(product)}
                          className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
                        >
                          <p className="font-medium text-sm text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                          <p className="text-sm font-bold text-blue-600 mt-1">{product.price} TL</p>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        Ürün bulunamadı
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t bg-gray-50 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Cart */}
                  <div className="flex-1 bg-white rounded-lg border p-3">
                    <h3 className="font-semibold text-gray-800 mb-2">Sepet ({cart.length})</h3>
                    {cart.length === 0 ? (
                      <p className="text-gray-500 text-sm">Sepet boş</p>
                    ) : (
                      <div className="space-y-2 max-h-32 overflow-auto">
                        {cart.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="flex-1">{item.quantity}x {item.name}</span>
                            <span className="font-medium">{(item.price * item.quantity).toFixed(2)} TL</span>
                            <div className="flex items-center gap-1 ml-2">
                              <button 
                                onClick={() => updateCartQuantity(item.id, -1)}
                                className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200"
                              >-</button>
                              <button 
                                onClick={() => updateCartQuantity(item.id, 1)}
                                className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200"
                              >+</button>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="w-6 h-6 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              >
                                <Icons.trash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    {/* Printer Size */}
                    <div className="flex bg-white rounded-lg border p-1">
                      {['57mm', '80mm'].map(size => (
                        <button
                          key={size}
                          onClick={() => setPrinterSize(size)}
                          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                            printerSize === size 
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => setShowNewOrderModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    >
                      Kapat
                    </button>
                    
                    <button 
                      onClick={() => alert('Yazdırma fonksiyonu')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium flex items-center gap-2"
                    >
                      <Icons.print /> Yazdır
                    </button>
                    
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold">
                      Toplam: {cartTotal.toFixed(2)} TL
                    </div>
                    
                    <button 
                      onClick={handleCreateOrder}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-bold"
                    >
                      Sipariş Oluştur
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
