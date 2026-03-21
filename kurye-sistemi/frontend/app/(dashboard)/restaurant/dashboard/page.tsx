'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, FileText, BarChart3, Calendar, DollarSign, LogOut, 
  Plus, Phone, Search, Filter, FileIcon, Settings, X, Menu, ChevronDown, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockOrders = [
  { id: 'SIP-001', customer: 'Ahmet Yılmaz', phone: '0555 123 45 67', address: 'Atatürk Cad. No:15', distance: '2.10 km', time: '13:30', status: 'delivered', payment: 'Online', amount: 185, courier: 'YUSUF GÖK' },
  { id: 'SIP-002', customer: 'Ayşe Kaya', phone: '0555 234 56 78', address: 'Cumhuriyet Mah. 23', distance: '0.54 km', time: '13:18', status: 'delivered', payment: 'Nakit', amount: 220, courier: 'DENİZ ENMEK' },
  { id: 'SIP-003', customer: 'Mehmet Demir', phone: '0555 345 67 89', address: 'İstiklal Sok. 8', distance: '2.69 km', time: '12:52', status: 'delivered', payment: 'Online', amount: 450, courier: 'ÖZCAN ÇAKAR' },
];

const menuItems = [
  { id: 'orders', icon: ShoppingBag, label: '', active: true },
  { id: 'reports', icon: FileText, label: '' },
  { id: 'stats', icon: BarChart3, label: '' },
  { id: 'calendar', icon: Calendar, label: '' },
  { id: 'finance', icon: DollarSign, label: '' },
];

export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('restaurant_user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser({ name: 'ASMA DÖNER', dealerName: 'Paketçiniz Bodrum' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('restaurant_user');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Purple Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'} lg:flex lg:static flex-col w-20 bg-gradient-to-b from-purple-600 to-purple-700 text-white items-center py-6`}>
        <div className="mb-8">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-6 h-6 text-purple-700" />
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                item.active 
                  ? 'bg-yellow-400 text-purple-700 shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40"
003e
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xl font-bold text-purple-600">Paketçiniz</span>
                <span className="text-gray-400">Bodrum</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-gray-800">{user?.name || 'ASMA DÖNER'}</span>
                <span className="text-xs text-gray-500">{user?.dealerName || 'Paketçiniz Bodrum'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex items-center gap-2 border-gray-300"
              >
                <Phone className="w-4 h-4" />
                <span>Aramalar</span>
                <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow"></div>
                </div>
              </Button>

              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Yeni Sipariş</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'pending'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-400'
                }`}
              >
                <span>Bekleyen Siparişler</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'pending' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  0
                </span>
              </button>

              <button
                onClick={() => setActiveTab('onway')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'onway'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-400'
                }`}
              >
                <span>Yoldaki Siparişler</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'onway' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  0
                </span>
              </button>

              <div className="flex-1" />

              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="border-gray-300">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-gray-300">
                  <FileIcon className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-gray-300">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Orders Table */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr className="text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sipariş</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Müşteri</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Adres</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mesafe</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Saat</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ödeme</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kurye</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activeTab === 'pending' ? (
                        <tr>
                          <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                            Bu kategoride sipariş bulunmamaktadır
                          </td>
                        </tr>
                      ) : (
                        mockOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm font-semibold text-purple-600">{order.id}</td>
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
                              <Badge className="bg-green-100 text-green-700 border-0">Teslim Edildi</Badge>
                            </td>
                            <td className="px-4 py-4">
                              <div>
                                <p className="text-sm font-bold text-gray-900">{order.amount}₺</p>
                                <p className="text-xs text-gray-500">{order.payment}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm font-semibold text-purple-600">{order.courier}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
