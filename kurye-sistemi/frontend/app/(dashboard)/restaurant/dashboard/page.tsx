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
  const [user, setUser] = useState({name: 'Tatlı Köşe', dealerName: 'Osmaniye Paketçiniz'});

  useEffect(() => {
    const stored = localStorage.getItem('restaurant_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('restaurant_user');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'} lg:flex lg:static flex-col w-72 bg-gradient-to-b from-blue-600 to-blue-800 text-white`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Paketçiniz</h1>
              <p className="text-xs text-white/70">Restoran Paneli</p>
            </div>
            <button className="lg:hidden ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg' 
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
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
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
                  <span className="w-full h-0.5 bg-gray-700" />
                  <span className="w-full h-0.5 bg-gray-700" />
                  <span className="w-4 h-0.5 bg-gray-700" />
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
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">{user?.name || 'TATLI KÖŞE'}</span>
                  <span className="text-xs text-blue-600">{user?.dealerName || 'Osmaniye Paketçiniz'}</span>
                </div>
              </div>
              
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-1" /> Yeni Sipariş
              </Button>
              
              <Button variant="outline" size="sm" className="text-red-600 border-red-200"
003e
                <LogOut className="w-4 h-4 mr-1" /> Çıkış
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <HistoryOrdersView />
        </main>
      </div>
    </div>
  );
}

function HistoryOrdersView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Tamamlanan</span>
              <Badge className="bg-white/20 text-white">4</Badge>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border rounded-xl">
              <X className="w-4 h-4 text-red-500" />
              <span className="text-gray-600">İptal Edilen</span>
              <Badge className="bg-gray-100">0</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-xs font-semibold text-gray-600">
                <th className="px-4 py-3">SİPARİŞ</th>
                <th className="px-4 py-3">MÜŞTERİ</th>
                <th className="px-4 py-3">ADRES</th>
                <th className="px-4 py-3">MESAFE</th>
                <th className="px-4 py-3">SAAT</th>
                <th className="px-4 py-3">DURUM</th>
                <th className="px-4 py-3">ÖDEME</th>
                <th className="px-4 py-3">KURYE</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50/50">
                  <td className="px-4 py-4 text-sm font-bold text-blue-600">{order.id}</td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{order.address}</td>
                  <td className="px-4 py-4 text-sm">{order.distance}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{order.time}</td>
                  <td className="px-4 py-4">
                    <Badge className="bg-green-100 text-green-700">Teslim Edildi</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold">{order.amount}₺</p>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-blue-600">{order.courier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
