'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, History, TrendingUp, 
  DollarSign, CreditCard, Utensils, Users, LogOut,
  Plus, Search, Filter, ChevronRight, Phone,
  Clock, CheckCircle, X, Bike, BarChart3,
  Calendar, Settings, FileText, Eye, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockOrders = [
  { id: 'SIP-001', customer: 'Ahmet Yılmaz', phone: '0555 123 45 67', address: 'Atatürk Cad. No:15', distance: '2.10 km', time: '13:30', status: 'delivered', payment: 'Online', amount: 185, courier: 'YUSUF GÖK' },
  { id: 'SIP-002', customer: 'Ayşe Kaya', phone: '0555 234 56 78', address: 'Cumhuriyet Mah. 23', distance: '0.54 km', time: '13:18', status: 'delivered', payment: 'Nakit', amount: 220, courier: 'DENİZ ENMEK' },
  { id: 'SIP-003', customer: 'Mehmet Demir', phone: '0555 345 67 89', address: 'İstiklal Sok. 8', distance: '2.69 km', time: '12:52', status: 'delivered', payment: 'Online', amount: 450, courier: 'ÖZCAN ÇAKAR' },
];

const menuItems = [
  { id: 'current', label: 'Güncel Siparişler', icon: ShoppingBag },
  { id: 'history', label: 'Geçmiş Siparişler', icon: History },
  { id: 'performance', label: 'Teslimat Performansı', icon: TrendingUp },
  { id: 'company', label: 'Firma Hakediş', icon: DollarSign },
  { id: 'courier', label: 'Kurye Hakediş', icon: Bike },
  { id: 'pos', label: 'Pos Yönetimi', icon: CreditCard },
  { id: 'menu', label: 'Menüler & Ürünler', icon: Utensils },
  { id: 'customers', label: 'Müşteriler', icon: Users },
];

export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('current');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('restaurant_user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      // Default demo user
      setUser({
        name: 'Tatlı Köşe',
        dealerName: 'Osmaniye Paketçiniz'
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('restaurant_user');
    router.push('/');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'current': return <CurrentOrdersView />;
      case 'history': return <HistoryOrdersView />;
      case 'performance': return <PerformanceView />;
      case 'company': return <CompanyEarningsView />;
      default: return <CurrentOrdersView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'} lg:flex lg:static flex-col w-72 bg-gradient-to-b from-blue-600 to-blue-800 text-white`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between lg:justify-start gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Paketçiniz</h1>
              <p className="text-xs text-white/70">Restoran Paneli</p>
            </div>
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                activeTab === item.id ? 'bg-white/20' : 'bg-white/10'
              }`}>
                <item.icon className="w-5 h-5" />
              </div>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10 transition-all">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center"><LogOut className="w-5 h-5" /></div>
            Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-gray-700"></span>
                  <span className="w-full h-0.5 bg-gray-700"></span>
                  <span className="w-4 h-0.5 bg-gray-700"></span>
                </div>
              </button>
              
              <div className="hidden md:flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{user?.dealerName || 'Osmaniye Paketçiniz'}</h2>
                  <p className="text-xs text-gray-500">{user?.name || 'Tatlı Köşe'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">{user?.name || 'TATLI KÖŞE'}</span>
                  <span className="text-xs text-blue-600">{user?.dealerName || 'Osmaniye Paketçiniz'}</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-blue-200 hover:bg-blue-50">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Aramalar</span>
              </Button>
              
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30">
                <Plus className="w-4 h-4 mr-1" /> Yeni Sipariş
              </Button>
              
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"
003e
                <LogOut className="w-4 h-4 mr-1" /> Çıkış
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function CurrentOrdersView() {
  const [activeFilter, setActiveFilter] = useState('pending');
  
  const filters = [
    { id: 'pending', label: 'Bekleyen Siparişler', count: 0 },
    { id: 'onway', label: 'Yoldaki Siparişler', count: 0 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {filter.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-100'}`}>
              {filter.count}
            </span>
          </button>
        ))}
        
        <div className="flex-1" />
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="border-gray-200 hover:border-blue-400 hover:text-blue-600"><Search className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" className="border-gray-200 hover:border-blue-400 hover:text-blue-600"><FileText className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" className="border-gray-200 hover:border-blue-400 hover:text-blue-600"><Settings className="w-4 h-4" /></Button>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-blue-500" />
          </div>
          <p className="text-gray-500 text-lg">Bu kategoride sipariş bulunmamaktadır</p>
          <Button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Yeni Sipariş Oluştur
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function HistoryOrdersView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Tamamlanan</span>
              <Badge className="bg-white/20 text-white border-0">4</Badge>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer">
              <X className="w-4 h-4 text-red-500" />
              <span className="text-gray-600">İptal Edilen</span>
              <Badge className="bg-gray-100">0</Badge>
            </div>
            <div className="flex-1" />
            <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50"><Filter className="w-4 h-4 mr-1" /> Filtrele</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"><option>BAŞLANGIÇ (11:00)</option></select>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <input type="text" value="21.03.2026 11:00" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <input type="text" value="22.03.2026 04:00" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
            </div>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500"><option>Tüm Durumlar</option></select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-600 uppercase">
                <th className="px-4 py-3">SİPARİŞ</th>
                <th className="px-4 py-3">MÜŞTERİ</th>
                <th className="px-4 py-3">ADRES</th>
                <th className="px-4 py-3">MESAFE</th>
                <th className="px-4 py-3">SAAT</th>
                <th className="px-4 py-3">DURUM</th>
                <th className="px-4 py-3">ÖDEME</th>
                <th className="px-4 py-3">KURYE</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-4 text-sm font-bold text-blue-600">{order.id}</td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{order.address}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.distance}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">21.03.2026 {order.time}</td>
                  <td className="px-4 py-4">
                    <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-0">Teslim Edildi</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.amount}₺</p>
                      <p className="text-xs text-gray-500">{order.payment}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-blue-600">{order.courier}</td>
                  <td className="px-4 py-4">
                    <Button variant="ghost" size="icon" className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

function PerformanceView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Tarih Aralığı Seç</span>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <input type="text" value="21.03.2026 04:00" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
              <span className="text-gray-400">-</span>
              <input type="text" value="22.03.2026 05:00" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"><Filter className="w-4 h-4 mr-1" /> Uygula</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">Finansal Özet</Badge>
            <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Ciro</p>
                <p className="text-3xl font-bold text-gray-900">₺4.105,00</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sipariş Adedi</p>
                <p className="text-3xl font-bold text-gray-900">4</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl border border-amber-200">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ortalama Tutar</p>
                <p className="text-3xl font-bold text-gray-900">₺1.026,25</p>
              </div>
            </div>

            <Button variant="outline" className="w-full h-12 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-semibold rounded-xl">
              Detaylı Rapor <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">Teslimat Analizi</Badge>
            <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white text-center shadow-xl shadow-blue-500/30">
              <p className="text-sm opacity-90 mb-3"><TrendingUp className="w-5 h-5 inline mr-2" /> Ortalama Hız</p>
              <p className="text-6xl font-bold">37<span className="text-3xl ml-2 font-normal">dk</span></p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Dağılım</span>
                <Badge className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-0">% 0 gecikme</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Hızlı (&lt;15dk)</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">Normal (15-30dk)</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Yavaş (30dk+)</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl text-center border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">4</p>
                <p className="text-sm text-gray-600">Başarılı</p>
              </div>
              <div className="p-5 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl text-center border border-red-200">
                <Clock className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Geciken</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function CompanyEarningsView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900">Restoran</h3>
              <p className="text-sm text-gray-500">Tutar: <span className="text-red-600 font-bold">300.00 ₺</span> (TL) Kurye Firmasına Borçlu</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="text" value="21.03.2026 04:00" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
              <span className="text-gray-400">-</span>
              <input type="text" value="22.03.2026 04:00" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"><Filter className="w-4 h-4 mr-1" /> Uygula</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          <button className="px-4 py-3 text-sm font-bold text-blue-600 border-b-2 border-blue-600">Paket Özeti</button>
          <button className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg">Paket İşlemleri</button>
          <button className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg">Ödeme İşlemleri</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'PAKET SAYISI', value: '-' },
          { label: 'KM - ÜCRET', value: '6.91 km' },
          { label: 'PAKET TAŞIMA', value: '₺300,00' },
          { label: 'TOPLAM TAŞIMA', value: '₺300,00' },
          { label: 'NAKİT', value: '₺0,00', color: 'text-green-600' },
          { label: 'KREDİ KARTI', value: '₺0,00', color: 'text-green-600' },
        ].map((item, i) => (
          <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-400 mb-1 font-medium">{item.label}</p>
              <p className={`text-lg font-bold ${item.color || 'text-gray-900'}`}>{item.value}</p>
              {item.label === 'KM - ÜCRET' && <p className="text-sm text-gray-500 font-medium">₺0,00</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
