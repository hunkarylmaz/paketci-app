'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, History, LogOut, Plus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockOrders = [
  { id: 'SIP-001', customer: 'Ahmet Yılmaz', phone: '0555 123 45 67', address: 'Atatürk Cad. No:15', distance: '2.10 km', time: '13:30', amount: 185, courier: 'YUSUF GÖK' },
];

const menuItems = [
  { id: 'current', label: 'Güncel Siparişler', icon: ShoppingBag },
  { id: 'history', label: 'Geçmiş Siparişler', icon: History },
];

export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('history');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user] = useState({name: 'Tatlı Köşe', dealerName: 'Osmaniye Paketçiniz'});

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg' 
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${activeTab === item.id ? 'bg-white/20' : 'bg-white/10'}`}>
                <item.icon className="w-5 h-5" />
              </div>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center"><LogOut className="w-5 h-5" /></div>
            Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>Menü</button>
              <div className="hidden md:block">
                <h2 className="text-lg font-bold text-gray-900">{user.dealerName}</h2>
                <p className="text-xs text-gray-500">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                <div>
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-blue-600 ml-2">{user.dealerName}</span>
                </div>
              </div>
              <Button size="sm" className="bg-blue-600"><Plus className="w-4 h-4 mr-1" /> Yeni</Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl">
                  <CheckCircle className="w-4 h-4" />
                  <span>Tamamlanan</span>
                  <Badge className="bg-white/20">4</Badge>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-xs font-semibold text-gray-600">
                    <th className="px-4 py-3">SİPARİŞ</th>
                    <th className="px-4 py-3">MÜŞTERİ</th>
                    <th className="px-4 py-3">ADRES</th>
                    <th className="px-4 py-3">ÖDEME</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="px-4 py-4 font-bold text-blue-600">{order.id}</td>
                      <td className="px-4 py-4">{order.customer}</td>
                      <td className="px-4 py-4 text-gray-600">{order.address}</td>
                      <td className="px-4 py-4 font-bold">{order.amount}₺</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
