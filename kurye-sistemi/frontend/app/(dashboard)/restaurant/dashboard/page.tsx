'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, Menu, Settings, LogOut, 
  TrendingUp, Clock, CheckCircle, DollarSign, Bell,
  ChevronRight, Star, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  { id: 'SIP-240321-001', customer: 'Ahmet Yılmaz', items: '2x Lahmacun, 1x Ayran', total: 185, status: 'preparing', time: '10:30' },
  { id: 'SIP-240321-002', customer: 'Ayşe Kaya', items: '1x Adana Dürüm, 1x Kola', total: 220, status: 'ready', time: '10:25' },
  { id: 'SIP-240321-003', customer: 'Mehmet Demir', items: '3x Pide, 2x Salata', total: 450, status: 'delivering', time: '10:15' },
];

export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);

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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Siparişler', icon: ShoppingBag },
    { id: 'menu', label: 'Menü', icon: Menu },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Paketçiniz</h1>
              <p className="text-xs text-gray-500">Restoran Paneli</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-orange-50 text-orange-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.id === 'orders' && (
                  <Badge className="ml-auto bg-red-500">3</Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="font-semibold">{user?.name?.charAt(0) || 'R'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.name || 'Restoran'}</p>
              <p className="text-xs text-gray-500">{user?.phone || ''}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">Paketçiniz</span>
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'menu' && <MenuView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}

// Dashboard View
function DashboardView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-500">Bugünün özeti</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Clock className="w-3 h-3" />
          {new Date().toLocaleDateString('tr-TR')}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bugünkü Sipariş</p>
                <p className="text-2xl font-bold">{mockStats.todayOrders}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Aktif Sipariş</p>
                <p className="text-2xl font-bold text-orange-600">{mockStats.activeOrders}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Kazanç</p>
                <p className="text-2xl font-bold text-green-600">₺{mockStats.todayRevenue}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Değerlendirme</p>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <p className="text-2xl font-bold">{mockStats.rating}</p>
                </div>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Son Siparişler</CardTitle>
          <Button variant="ghost" size="sm">Tümünü Gör <ChevronRight className="w-4 h-4" /></Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.id}</span>
                    <Badge variant={
                      order.status === 'preparing' ? 'secondary' :
                      order.status === 'ready' ? 'default' : 'outline'
                    }>
                      {order.status === 'preparing' ? 'Hazırlanıyor' :
                       order.status === 'ready' ? 'Hazır' : 'Yolda'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{order.customer} • {order.items}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₺{order.total}</p>
                  <p className="text-xs text-gray-500">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Orders View
function OrdersView() {
  const [filter, setFilter] = useState('all');
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Siparişler</h2>
      
      <div className="flex gap-2">
        {['all', 'active', 'completed'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Tümü' : f === 'active' ? 'Aktif' : 'Tamamlanan'}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {mockOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{order.id}</span>
                    <Badge>{order.status === 'preparing' ? 'Hazırlanıyor' : 'Hazır'}</Badge>
                  </div>
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-sm text-gray-600">{order.items}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₺{order.total}</p>
                  <Button size="sm" className="mt-2">Detay</Button>
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
    { name: 'Ana Yemekler', items: 12 },
    { name: 'Pide & Lahmacun', items: 8 },
    { name: 'İçecekler', items: 6 },
    { name: 'Tatlılar', items: 4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menü Yönetimi</h2>
        <Button>+ Yeni Ürün</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Card key={cat.name} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{cat.name}</h3>
                <p className="text-gray-500">{cat.items} ürün</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// Settings View
function SettingsView() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Ayarlar</h2>
      
      <div className="space-y-4">
        {['İşletme Bilgileri', 'Çalışma Saatleri', 'Teslimat Ayarları', 'Bildirimler', 'Ödeme Ayarları'].map((setting) => (
          <Card key={setting} className="cursor-pointer hover:bg-gray-50">
            <CardContent className="p-4 flex justify-between items-center">
              <span>{setting}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
