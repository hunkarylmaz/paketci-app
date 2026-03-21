'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, History, TrendingUp, 
  DollarSign, CreditCard, Utensils, Users, LogOut,
  Plus, Search, Filter, ChevronRight, Phone, MapPin,
  Clock, CheckCircle, X, Bike, Wallet, BarChart3,
  Calendar, Bell, User, Settings, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Mock Data
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
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('restaurant_user');
    if (stored) setUser(JSON.parse(stored));
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
      <aside className={`${isMobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'} lg:flex lg:static lg:inset-auto flex-col w-72 bg-[#6B4EE6] text-white`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between lg:justify-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
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
                  ? 'bg-[#FFD93D] text-gray-900 shadow-lg' 
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activeTab === item.id ? 'bg-gray-900/10' : 'bg-white/10'
              }`}>
                <item.icon className="w-4 h-4" />
              </div>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><LogOut className="w-4 h-4" /></div>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-gray-700"></span>
                  <span className="w-full h-0.5 bg-gray-700"></span>
                  <span className="w-4 h-0.5 bg-gray-700"></span>
                </div>
              </button>
              
              <div className="hidden md:block">
                <h2 className="text-xl font-bold text-gray-900">Osmaniye Paketçiniz</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg"
003e
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">TATLI KÖŞE</span>
                <span className="text-xs text-gray-400">Osmaniye Paketçiniz</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Aramalar</span>
                  <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow"></div>
                  </div>
                </Button>
                
                <Button size="sm" className="bg-[#6B4EE6] hover:bg-[#5a41d1]">
                  <Plus className="w-4 h-4 mr-1" /> Yeni Sipariş
                </Button>
                
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"
003e
                  <LogOut className="w-4 h-4 mr-1" /> Çıkış
                </Button>
              </div>
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

// Current Orders View
function CurrentOrdersView() {
  const [activeFilter, setActiveFilter] = useState('pending');
  
  const filters = [
    { id: 'pending', label: 'Bekleyen Siparişler', count: 0 },
    { id: 'onway', label: 'Yoldaki Siparişler', count: 0 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter.id
                ? 'bg-[#6B4EE6] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#6B4EE6] hover:text-[#6B4EE6]'
            }`}
          >
            {filter.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-100'
            }`}>{filter.count}</span>
          </button>
        ))}
        
        <div className="flex-1" />
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon"><Search className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon"><FileText className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon"><Settings className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Empty State */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Bu kategoride sipariş bulunmamaktadır</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// History Orders View
function HistoryOrdersView() {
  const [dateRange, setDateRange] = useState({ start: '21.03.2026', end: '22.03.2026' });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#6B4EE6] text-white rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Tamamlanan</span>
              <Badge className="bg-white/20 text-white">4</Badge>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
              <X className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">İptal Edilen</span>
              <Badge className="bg-gray-100">0</Badge>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filtrele</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm"><option>BAŞLANGIÇ (11:00)</option></select>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input type="text" value="21.03.2026 11:00" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input type="text" value="22.03.2026 04:00" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
            </div>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm"><option>Tüm Durumlar</option></select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase">
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
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{order.address}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{order.distance}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">21.03.2026 {order.time}</td>
                  <td className="px-4 py-4">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Teslim Edildi</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.amount}₺</p>
                      <p className="text-xs text-gray-500">{order.payment}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.courier}</td>
                  <td className="px-4 py-4">
                    <Button variant="ghost" size="icon" className="w-8 h-8 bg-[#FFD93D] hover:bg-[#f5c800]">
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

// Performance View
function PerformanceView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Tarih Aralığı Seç</span>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <input type="text" value="21.03.2026 04:00" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
              <span className="text-gray-400">-</span>
              <input type="text" value="22.03.2026 05:00" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
              <Button className="bg-[#6B4EE6] hover:bg-[#5a41d1]"><Filter className="w-4 h-4 mr-1" /> Uygula</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Badge className="bg-[#6B4EE6] text-white hover:bg-[#6B4EE6]">Finansal Özet</Badge>
            <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-[#6B4EE6] rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Ciro</p>
                <p className="text-2xl font-bold">₺4.105,00</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sipariş Adedi</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-[#FFD93D] rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ortalama Tutar</p>
                <p className="text-2xl font-bold">₺1.026,25</p>
              </div>
            </div>

            <Button variant="outline" className="w-full border-[#6B4EE6] text-[#6B4EE6] hover:bg-[#6B4EE6] hover:text-white">
              Detaylı Rapor <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Badge className="bg-[#6B4EE6] text-white hover:bg-[#6B4EE6]">Teslimat Analizi</Badge>
            <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-[#6B4EE6] rounded-xl text-white text-center">
              <p className="text-sm opacity-80 mb-2"><TrendingUp className="w-4 h-4 inline mr-1" /> Ortalama Hız</p>
              <p className="text-5xl font-bold">37<span className="text-2xl ml-1">dk</span></p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Dağılım</span>
                <Badge className="bg-yellow-100 text-yellow-700">% 0 gecikme</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Hızlı (&lt;15dk)</span>
                  </div>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Normal (15-30dk)</span>
                  </div>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Yavaş (30dk+)</span>
                  </div>
                  <span>0</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-gray-500">Başarılı</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <Clock className="w-5 h-5 text-red-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-gray-500">Geciken</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// Company Earnings View
function CompanyEarningsView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Restoran</h3>
              <p className="text-sm text-gray-500">Tutar: <span className="text-red-600 font-semibold">300.00 ₺</span> (TL) Kurye Firmasına Borçlu</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="text" value="21.03.2026 04:00" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
              <span className="text-gray-400">-</span>
              <input type="text" value="22.03.2026 04:00" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" readOnly />
              <Button className="bg-[#6B4EE6] hover:bg-[#5a41d1]"><Filter className="w-4 h-4 mr-1" /> Uygula</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          <button className="px-4 py-3 text-sm font-medium text-[#6B4EE6] border-b-2 border-[#6B4EE6]">Paket Özeti</button>
          <button className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">Paket İşlemleri</button>
          <button className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">Ödeme İşlemleri</button>
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
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className={`text-lg font-bold ${item.color || ''}`}>{item.value}</p>
              {item.label === 'KM - ÜCRET' && <p className="text-sm text-gray-500">₺0,00</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// Import Eye icon
import { Eye } from 'lucide-react';
