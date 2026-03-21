'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, Utensils, Settings, LogOut,
  TrendingUp, Clock, CheckCircle, DollarSign, Bell, User,
  ChevronRight, Star, Package, ArrowUpRight, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock Data
const mockStats = {
  todayOrders: 24,
  activeOrders: 3,
  completedOrders: 21,
  todayRevenue: 3850,
  rating: 4.8,
};

const mockOrders = [
  { id: 'SIP-001', customer: 'Ahmet Y.', items: '2x Lahmacun, 1x Ayran', total: 185, status: 'preparing', time: '10:30' },
  { id: 'SIP-002', customer: 'Ayşe K.', items: '1x Adana Dürüm', total: 220, status: 'ready', time: '10:25' },
  { id: 'SIP-003', customer: 'Mehmet D.', items: '3x Pide', total: 450, status: 'delivering', time: '10:15' },
];

export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('restaurant_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('restaurant_user');
    router.push('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Siparişler', icon: ShoppingBag, badge: 3 },
    { id: 'menu', label: 'Menü', icon: Utensils },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'orders': return <OrdersView />;
      case 'menu': return <MenuView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Paketçiniz</h1>
              <p className="text-xs text-gray-500">Restoran Paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-gray-700 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-full h-0.5 bg-gray-700 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-gray-700 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-gray-200 p-4 bg-white"
          >
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id 
                      ? 'bg-orange-50 text-orange-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                  )}
                </button>
              ))}
              <div className="pt-2 border-t border-gray-200 mt-2">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                  <LogOut className="w-5 h-5" />
                  Çıkış Yap
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 min-h-screen sticky top-0">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl leading-tight">Paketçiniz</h1>
                <p className="text-xs text-gray-500">Restoran Paneli</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-200' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'R'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user?.name || 'Lezzet Restoran'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.phone || '0555 123 4567'}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {navItems.find(n => n.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="w-4 h-4" />
                Bugün
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'R'}
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Dashboard View
function DashboardView() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-xs lg:text-sm mb-1">Bugünkü Sipariş</p>
                <p className="text-2xl lg:text-3xl font-bold">{mockStats.todayOrders}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-orange-100 text-xs lg:text-sm mb-1">Aktif Sipariş</p>
                <p className="text-2xl lg:text-3xl font-bold">{mockStats.activeOrders}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-100 text-xs lg:text-sm mb-1">Günlük Kazanç</p>
                <p className="text-2xl lg:text-3xl font-bold">₺{mockStats.todayRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-yellow-100 text-xs lg:text-sm mb-1">Değerlendirme</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl lg:text-3xl font-bold">{mockStats.rating}</p>
                  <Star className="w-5 h-5 fill-white" />
                </div>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Son Siparişler</h3>
          <Button variant="ghost" size="sm" className="text-orange-600">
            Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {mockOrders.map((order) => (
            <Card key={order.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{order.id}</span>
                      <Badge className={`
                        ${order.status === 'preparing' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : ''}
                        ${order.status === 'ready' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                        ${order.status === 'delivering' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}
                      `}>
                        {order.status === 'preparing' ? 'Hazırlanıyor' : order.status === 'ready' ? 'Hazır' : 'Yolda'}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm truncate">{order.customer}</p>
                    <p className="text-xs text-gray-500 truncate">{order.items}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-lg">₺{order.total}</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Orders View
function OrdersView() {
  const [filter, setFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'active', label: 'Aktif' },
    { id: 'completed', label: 'Tamamlanan' },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((f) => (
          <Button
            key={f.id}
            variant={filter === f.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.id)}
            className={filter === f.id ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {mockOrders.map((order) => (
          <Card key={order.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{order.id}</span>
                    <Badge variant={order.status === 'ready' ? 'default' : 'secondary'}>
                      {order.status === 'ready' ? 'Hazır' : 'Hazırlanıyor'}
                    </Badge>
                  </div>
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-sm text-gray-500">{order.items}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₺{order.total}</p>
                  <Button size="sm" variant="outline" className="mt-2">Detay</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// Menu View
function MenuView() {
  const categories = [
    { name: 'Ana Yemekler', items: 12, icon: '🍖' },
    { name: 'Pide & Lahmacun', items: 8, icon: '🥙' },
    { name: 'İçecekler', items: 6, icon: '🥤' },
    { name: 'Tatlılar', items: 4, icon: '🍰' },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Menü Kategorileri</h3>
        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
          + Yeni Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Card key={cat.name} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-all group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <h4 className="font-semibold group-hover:text-orange-600 transition-colors">{cat.name}</h4>
                  <p className="text-sm text-gray-500">{cat.items} ürün</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// Settings View
function SettingsView() {
  const settings = [
    { name: 'İşletme Bilgileri', desc: 'Restoran adı, adres, telefon', icon: User },
    { name: 'Çalışma Saatleri', desc: 'Açılış-kapanış saatleri', icon: Clock },
    { name: 'Teslimat Ayarları', desc: 'Minimum sipariş, teslimat süresi', icon: Package },
    { name: 'Bildirimler', desc: 'SMS, e-posta bildirimleri', icon: Bell },
    { name: 'Ödeme Ayarları', desc: 'IBAN, komisyon oranları', icon: DollarSign },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <h3 className="text-lg font-bold">Ayarlar</h3>
      
      <div className="space-y-3">
        {settings.map((setting) => (
          <Card key={setting.name} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-all group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <setting.icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold">{setting.name}</h4>
                  <p className="text-sm text-gray-500">{setting.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
