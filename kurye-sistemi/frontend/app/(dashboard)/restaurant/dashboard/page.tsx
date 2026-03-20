'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store, Clock, Star, MapPin, Bike, Package, TrendingUp,
  Plus, Phone, Settings, Bell, DollarSign, CheckCircle,
  Clock3, Navigation, CheckCircle2, UserCheck, ChevronRight,
  ChefHat, Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Mock data
const hourlySales = [
  { hour: '08:00', sales: 450 },
  { hour: '09:00', sales: 890 },
  { hour: '10:00', sales: 1200 },
  { hour: '11:00', sales: 1800 },
  { hour: '12:00', sales: 3200 },
  { hour: '13:00', sales: 4100 },
  { hour: '14:00', sales: 2900 },
  { hour: '15:00', sales: 1800 },
  { hour: '16:00', sales: 1500 },
  { hour: '17:00', sales: 2200 },
  { hour: '18:00', sales: 3500 },
  { hour: '19:00', sales: 4200 },
  { hour: '20:00', sales: 3800 },
  { hour: '21:00', sales: 2900 },
  { hour: '22:00', sales: 1800 },
  { hour: '23:00', sales: 900 },
];

const orderStatuses = [
  { label: 'Yeni', count: 1, color: 'bg-blue-500', icon: Package },
  { label: 'Hazırlanıyor', count: 2, color: 'bg-amber-500', icon: ChefHat },
  { label: 'Hazır', count: 0, color: 'bg-green-500', icon: CheckCircle },
  { label: 'Yolda', count: 3, color: 'bg-purple-500', icon: Navigation },
  { label: 'Teslim Edildi', count: 45, color: 'bg-gray-500', icon: CheckCircle2 },
];

const onlineCouriers = [
  { id: 1, name: 'Ahmet Y.', status: 'available', avatar: 'AY' },
  { id: 2, name: 'Mehmet D.', status: 'busy', avatar: 'MD' },
  { id: 3, name: 'Ali K.', status: 'break', avatar: 'AK' },
  { id: 4, name: 'Can Y.', status: 'available', avatar: 'CY' },
];

const recentOrders = [
  { id: '#1001', customer: 'Mehmet K.', items: '2x Burger, 1x Cola', total: 189, status: 'new', time: '2 dk' },
  { id: '#1002', customer: 'Ayşe S.', items: '1x Pizza, 2x Ayran', total: 245, status: 'preparing', time: '8 dk' },
  { id: '#1003', customer: 'Can B.', items: '3x Dürüm, 1x Kola', total: 156, status: 'delivering', time: '15 dk' },
  { id: '#1004', customer: 'Zeynep A.', items: '1x Menü, 1x Tatlı', total: 210, status: 'ready', time: '22 dk' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function RestaurantDashboardPage() {
  const [isOpen, setIsOpen] = useState(true);
  const totalSales = hourlySales.reduce((acc, curr) => acc + curr.sales, 0);

  return (
    <motion.div 
      className="container mx-auto p-4 md:p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Burger King - Taksim</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <MapPin className="w-4 h-4" />
              Taksim Meydanı No:1, Beyoğlu/İstanbul
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border">
            <span className="text-sm font-medium text-gray-700">Restoran</span>
            <Switch checked={isOpen} onCheckedChange={setIsOpen} />
            <Badge className={isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
              {isOpen ? 'Açık' : 'Kapalı'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-lg">4.8</span>
            <span className="text-sm text-gray-500">(234 değerlendirme)</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Aktif Sipariş</p>
                  <p className="text-3xl font-bold">6</p>
                </div>
                <Package className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Günlük Satış</p>
                  <p className="text-3xl font-bold">₺{totalSales.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Ort. Puan</p>
                  <p className="text-3xl font-bold">4.8</p>
                </div>
                <Star className="w-8 h-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Bugün Teslimat</p>
                  <p className="text-3xl font-bold">45</p>
                </div>
                <Bike className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Order Status Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {orderStatuses.map((status) => (
            <Card key={status.label} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 ${status.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <status.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold">{status.count}</p>
                <p className="text-xs text-gray-500">{status.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* New Order Button */}
          <motion.div variants={itemVariants}>
            <Button className="w-full h-16 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg">
              <Plus className="w-6 h-6 mr-2" />
              Yeni Sipariş Oluştur
            </Button>
          </motion.div>

          {/* Sales Chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Saatlik Satışlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlySales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="hour" stroke="#6b7280" fontSize={10} tickMargin={5} />
                      <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(v) => `₺${v}`} />
                      <Tooltip formatter={(value: number) => `₺${value.toLocaleString()}`} />
                      <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Orders */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Son Siparişler</CardTitle>
                <Button variant="outline" size="sm">Tümünü Gör</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          order.status === 'new' ? 'bg-blue-100' :
                          order.status === 'preparing' ? 'bg-amber-100' :
                          order.status === 'delivering' ? 'bg-purple-100' :
                          'bg-green-100'
                        }`}>
                          <Package className={`w-5 h-5 ${
                            order.status === 'new' ? 'text-blue-600' :
                            order.status === 'preparing' ? 'text-amber-600' :
                            order.status === 'delivering' ? 'text-purple-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.customer}</p>
                          <p className="text-xs text-gray-400">{order.items}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₺{order.total}</p>
                        <p className="text-xs text-gray-500">{order.time}</p>
                        <Badge className={`mt-1 ${
                          order.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'delivering' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.status === 'new' ? 'Yeni' :
                           order.status === 'preparing' ? 'Hazırlanıyor' :
                           order.status === 'delivering' ? 'Yolda' : 'Hazır'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Working Hours */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Çalışma Saatleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hafta İçi</span>
                    <span className="font-medium">10:00 - 23:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hafta Sonu</span>
                    <span className="font-medium">11:00 - 00:00</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Settings className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Online Couriers */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bike className="w-5 h-5" />
                  Kuryeler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onlineCouriers.map((courier) => (
                    <div key={courier.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                          {courier.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{courier.name}</p>
                          <Badge className={
                            courier.status === 'available' ? 'bg-green-100 text-green-700' :
                            courier.status === 'busy' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }>
                            {courier.status === 'available' ? 'Müsait' :
                             courier.status === 'busy' ? 'Dolu' : 'Mola'}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Kurye Çağır
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Flame className="w-4 h-4 mr-2 text-orange-500" />
                  Kampanya Oluştur
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2 text-blue-500" />
                  Duyuru Gönder
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2 text-gray-500" />
                  Ayarlar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2 text-green-500" />
                  Destek
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
