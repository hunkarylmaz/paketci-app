'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Building2, Users, Bike, Store, TrendingUp, DollarSign,
  Activity, MapPin, Route, ArrowUpRight, ArrowDownRight,
  Calendar, Download, Filter, MoreHorizontal, Bell,
  CheckCircle2, Clock, AlertCircle, Star, Phone, Mail,
  Plus, Search, Edit, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Mock data
const commissionData = [
  { month: 'Ocak', komisyon: 8500, siparis: 340, kuryeOdemesi: 12000 },
  { month: 'Şubat', komisyon: 9200, siparis: 368, kuryeOdemesi: 13200 },
  { month: 'Mart', komisyon: 7800, siparis: 312, kuryeOdemesi: 11800 },
  { month: 'Nisan', komisyon: 10500, siparis: 420, kuryeOdemesi: 15600 },
  { month: 'Mayıs', komisyon: 11200, siparis: 448, kuryeOdemesi: 16800 },
  { month: 'Haziran', komisyon: 12400, siparis: 496, kuryeOdemesi: 18500 },
];

const myRestaurants = [
  { id: 1, name: 'Burger King - Taksim', address: 'Taksim Meydanı No:1', orders: 456, revenue: 24500, rating: 4.8, status: 'active', phone: '0212 123 4567', commission: 2450 },
  { id: 2, name: 'McDonald\'s - Şişli', address: 'Şişli Merkez Mah.', orders: 389, revenue: 21200, rating: 4.6, status: 'active', phone: '0212 987 6543', commission: 2120 },
  { id: 3, name: 'KFC - Kadıköy', address: 'Caferağa Mah. Moda Cad.', orders: 334, revenue: 18900, rating: 4.7, status: 'active', phone: '0216 456 7890', commission: 1890 },
  { id: 4, name: 'Pizza Hut - Beşiktaş', address: 'Beşiktaş Meydanı', orders: 298, revenue: 16500, rating: 4.5, status: 'warning', phone: '0212 111 2233', commission: 1650 },
  { id: 5, name: 'Dominos - Ataşehir', address: 'Ataşehir Bulvarı', orders: 267, revenue: 14800, rating: 4.9, status: 'active', phone: '0216 333 4444', commission: 1480 },
];

const myCouriers = [
  { id: 1, name: 'Ahmet Yılmaz', phone: '0555 123 4567', status: 'active', orders: 45, rating: 4.9, earnings: 2340, zone: 'Taksim' },
  { id: 2, name: 'Mehmet Demir', phone: '0555 987 6543', status: 'active', orders: 38, rating: 4.8, earnings: 1980, zone: 'Şişli' },
  { id: 3, name: 'Ali Kaya', phone: '0555 456 7890', status: 'break', orders: 52, rating: 4.7, earnings: 2890, zone: 'Kadıköy' },
  { id: 4, name: 'Can Yıldız', phone: '0555 111 2222', status: 'active', orders: 41, rating: 4.9, earnings: 2150, zone: 'Beşiktaş' },
  { id: 5, name: 'Burak Şahin', phone: '0555 333 4444', status: 'offline', orders: 35, rating: 4.6, earnings: 1820, zone: 'Ataşehir' },
  { id: 6, name: 'Emre Öztürk', phone: '0555 555 6666', status: 'active', orders: 48, rating: 4.8, earnings: 2450, zone: 'Taksim' },
];

const recentOrders = [
  { id: '#ORD-2024-001', restaurant: 'Burger King - Taksim', customer: 'Mehmet K.', courier: 'Ahmet Y.', amount: 189.50, status: 'delivered', time: '5 dk önce' },
  { id: '#ORD-2024-002', restaurant: 'McDonald\'s - Şişli', customer: 'Ayşe S.', courier: 'Mehmet D.', amount: 245.00, status: 'in_progress', time: '12 dk önce' },
  { id: '#ORD-2024-003', restaurant: 'KFC - Kadıköy', customer: 'Can B.', courier: 'Ali K.', amount: 156.00, status: 'preparing', time: '18 dk önce' },
  { id: '#ORD-2024-004', restaurant: 'Pizza Hut - Beşiktaş', customer: 'Zeynep A.', courier: 'Can Y.', amount: 210.50, status: 'delivered', time: '32 dk önce' },
  { id: '#ORD-2024-005', restaurant: 'Dominos - Ataşehir', customer: 'Burak K.', courier: 'Burak Ş.', amount: 178.00, status: 'in_progress', time: '45 dk önce' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DealerDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  const filteredRestaurants = myRestaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = myRestaurants.reduce((sum, r) => sum + r.revenue, 0);
  const totalCommission = myRestaurants.reduce((sum, r) => sum + r.commission, 0);
  const activeOrders = recentOrders.filter(o => o.status !== 'delivered').length;
  const activeCouriers = myCouriers.filter(c => c.status === 'active').length;

  return (
    <motion.div 
      className="container mx-auto p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Aydınlar Dağıtım</h1>
              <p className="text-gray-500">Bayi Kontrol Paneli</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-pink-100 text-pink-700">
              <Building2 className="w-3 h-3 mr-1" />
              Bayi
            </Badge>
            <Badge variant="outline">
              <MapPin className="w-3 h-3 mr-1" />
              İstanbul Avrupa
            </Badge>
            <Badge variant="outline" className="text-green-600">Aktif</Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Bu Ay
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="w-4 h-4" />
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Rapor İndir
          </Button>
        </div>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Gelir"
          value={`₺${totalRevenue.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          color="#3b82f6"
        />
        
        <StatCard
          title="Komisyon Kazancı"
          value={`₺${totalCommission.toLocaleString()}`}
          change="+8.3%"
          changeType="positive"
          icon={TrendingUp}
          color="#10b981"
        />
        
        <StatCard
          title="Restoranlarım"
          value={myRestaurants.length.toString()}
          change="+1"
          changeType="positive"
          icon={Store}
          color="#f59e0b"
        />
        
        <StatCard
          title="Kuryelerim"
          value={`${activeCouriers}/${myCouriers.length}`}
          change="2 mola"
          changeType="neutral"
          icon={Bike}
          color="#8b5cf6"
        />
      </div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="restaurants">Restoranlarım</TabsTrigger>
            <TabsTrigger value="couriers">Kuryelerim</TabsTrigger>
            <TabsTrigger value="orders">Siparişler</TabsTrigger>
            <TabsTrigger value="finance">Finans</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Commission Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Komisyon Geliri</CardTitle>
                  <CardDescription>Aylık komisyon kazancınız</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={commissionData}>
                        <defs>
                          <linearGradient id="colorKomisyon" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `₺${v}`} />
                        <Tooltip formatter={(value: number) => `₺${value.toLocaleString()}`} />
                        <Area 
                          type="monotone" 
                          dataKey="komisyon" 
                          name="Komisyon Kazancı" 
                          stroke="#10b981" 
                          fill="url(#colorKomisyon)" 
                          strokeWidth={2} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Plus className="w-4 h-4" />
                    Yeni Restoran Ekle
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Plus className="w-4 h-4" />
                    Yeni Kurye Ekle
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Route className="w-4 h-4" /
>
                    Rota Planla
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Download className="w-4 h-4" /
>
                    Aylık Rapor İndir
                  </Button>
                </CardContent>
              </Card>
            </div
>

            {/* Restaurant Summary */}
            <Card
>
              <CardHeader
>
                <div className="flex items-center justify-between"
>
                  <div
>
                    <CardTitle>Restoran Özeti</CardTitle
>
                    <CardDescription>Restoranlarınızın performansı</CardDescription>
                  </div
>
                  <Button variant="outline" size="sm" onClick={() => setSelectedTab('restaurants')}
>Tümünü Gör</Button
>
                </div
>
              </CardHeader
>
              <CardContent
>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4"
>
                  {myRestaurants.slice(0, 3).map((restaurant) => (
                    <Card key={restaurant.id} className="bg-gray-50"
>
                      <CardContent className="p-4"
>
                        <div className="flex items-start justify-between mb-3"
>
                          <h3 className="font-semibold text-gray-900"
>{restaurant.name}</h3
>
                          <Badge className={restaurant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
>
                            {restaurant.status === 'active' ? 'Aktif' : 'Uyarı'}
                          </Badge
>
                        </div
>
                        <div className="space-y-2 text-sm"
>
                          <div className="flex items-center gap-2 text-gray-600"
>
                            <MapPin className="w-4 h-4" /
>
                            {restaurant.address}
                          </div
>
                          <div className="flex items-center gap-2 text-gray-600"
>
                            <Phone className="w-4 h-4" /
>
                            {restaurant.phone}
                          </div
>
                          <div className="flex items-center gap-2"
>
                            <Star className="w-4 h-4 text-amber-500" /
>
                            <span className="font-medium"
>{restaurant.rating}</span
>
                            <span className="text-gray-400"
>({restaurant.orders} sipariş)</span
>
                          </div
>
                        </div
>
                        <div className="mt-4 pt-4 border-t flex items-center justify-between"
>
                          <div
>
                            <p className="text-xs text-gray-500"
>Gelir</p
>
                            <p className="font-semibold"
>₺{restaurant.revenue.toLocaleString()}</p
>
                          </div
>
                          <div className="text-right"
>
                            <p className="text-xs text-gray-500"
>Komisyon</p
>
                            <p className="font-semibold text-green-600"
>₺{restaurant.commission.toLocaleString()}</p
>
                          </div
>
                        </div
>
                      </CardContent
>
                    </Card
>
                  ))}
                </div
>
              </CardContent
>
            </Card
>

            {/* Recent Orders */}
            <Card
>
              <CardHeader
>
                <div className="flex items-center justify-between"
>
                  <div
>
                    <CardTitle>Son Siparişler</CardTitle
>
                    <CardDescription>Restoranlarınızdan gelen son siparişler</CardDescription>
                  </div
>
                  <Button variant="outline" size="sm" onClick={() => setSelectedTab('orders')}
>Tümünü Gör</Button
>
                </div
>
              </CardHeader
>
              <CardContent
>
                <div className="overflow-x-auto"
>
                  <table className="w-full"
>
                    <thead className="bg-gray-50 border-b"
>
                      <tr
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Sipariş No</th
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Restoran</th
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Kurye</th
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Durum</th
>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Tutar</th
>
                      </tr
>
                    </thead
>
                    <tbody className="divide-y"
>
                      {recentOrders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50"
>
                          <td className="px-4 py-3 text-sm font-medium"
>{order.id}</td
>
                          <td className="px-4 py-3 text-sm"
>{order.restaurant}</td
>
                          <td className="px-4 py-3 text-sm"
>{order.courier}</td
>
                          <td className="px-4 py-3"
>
                            <Badge className={
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }"
>
                              {order.status === 'delivered' ? 'Tamamlandı' :
                               order.status === 'in_progress' ? 'Yolda' : 'Hazırlanıyor'}
                            </Badge
>
                          </td
>
                          <td className="px-4 py-3 text-sm font-medium text-right"
>₺{order.amount.toFixed(2)}</td
>
                        </tr
>
                      ))}
                    </tbody
>
                  </table
>
                </div
>
              </CardContent
>
            </Card
>
          </TabsContent
>

          {/* Restaurants Tab */}
          <TabsContent value="restaurants" className="space-y-6"
>
            <div className="flex items-center justify-between"
>
              <div className="relative w-96"
>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /
>
                <Input
                  placeholder="Restoran ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                /
>
              </div
>
              <Button className="gap-2"
>
                <Plus className="w-4 h-4" /
>
                Yeni Restoran
              </Button
>
            </div
>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
>
              {filteredRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className="hover:shadow-lg transition-shadow"
>
                  <CardContent className="p-6"
>
                    <div className="flex items-start justify-between mb-4"
>
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center"
>
                        <Store className="w-6 h-6 text-indigo-600" /
>
                      </div
>
                      <div className="flex gap-1"
>
                        <Button variant="ghost" size="icon" className="h-8 w-8"
>
                          <Edit className="w-4 h-4" /
>
                        </Button
>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"
>
                          <Trash2 className="w-4 h-4" /
>
                        </Button
>
                      </div
>
                    </div
>
                    
                    <h3 className="font-semibold text-lg text-gray-900"
>{restaurant.name}</h3
>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"
>
                      <MapPin className="w-4 h-4" /
>
                      {restaurant.address}
                    </p
>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t"
>
                      <div
>
                        <p className="text-xs text-gray-500"
>Sipariş</p
>
                        <p className="text-lg font-semibold"
>{restaurant.orders}</p
>
                      </div
>
                      <div
>
                        <p className="text-xs text-gray-500"
>Puan</p
>
                        <div className="flex items-center gap-1"
>
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" /
>
                          <span className="font-semibold"
>{restaurant.rating}</span
>
                        </div
>
                      </div
>
                    </div
>
                    
                    <div className="mt-4 pt-4 border-t flex items-center justify-between"
>
                      <div
>
                        <p className="text-xs text-gray-500"
>Toplam Gelir</p
>
                        <p className="font-semibold"
>₺{restaurant.revenue.toLocaleString()}</p
>
                      </div
>
                      <Badge className={restaurant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
>
                        {restaurant.status === 'active' ? 'Aktif' : 'Bakımda'}
                      </Badge
>
                    </div
>
                  </CardContent
>
                </Card
>
              ))}
            </div
>
          </TabsContent
>

          {/* Couriers Tab */}
          <TabsContent value="couriers"
>
            <Card
>
              <CardHeader
>
                <div className="flex items-center justify-between"
>
                  <CardTitle>Kurye Yönetimi</CardTitle
>
                  <Button className="gap-2"
>
                    <Plus className="w-4 h-4" /
>
                    Kurye Ekle
                  </Button
>
                </div
>
              </CardHeader
>
              <CardContent
>
                <div className="overflow-x-auto"
>
                  <table className="w-full"
>
                    <thead className="bg-gray-50 border-b"
>
                      <tr
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Kurye</th
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Durum</th
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Bölge</th
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Sipariş</th
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Puan</th
>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Kazanç</th
>
                      </tr
>
                    </thead
>
                    <tbody className="divide-y"
>
                      {myCouriers.map((courier) => (
                        <tr key={courier.id} className="hover:bg-gray-50"
>
                          <td className="px-4 py-3"
>
                            <div className="flex items-center gap-3"
>
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
>
                                <span className="font-medium text-gray-600"
>{courier.name.split(' ').map(n => n[0]).join('')}</span
>
                              </div
>
                              <div
>
                                <p className="font-medium"
>{courier.name}</p
>
                                <p className="text-xs text-gray-500"
>{courier.phone}</p
>
                              </div
>
                            </div
>
                          </td
>
                          <td className="px-4 py-3"
>
                            <Badge className={
                              courier.status === 'active' ? 'bg-green-100 text-green-700' :
                              courier.status === 'break' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }"
>
                              {courier.status === 'active' ? 'Aktif' :
                               courier.status === 'break' ? 'Mola' : 'Çevrimdışı'}
                            </Badge
>
                          </td
>
                          <td className="px-4 py-3 text-sm"
>{courier.zone}</td
>
                          <td className="px-4 py-3 text-sm"
>{courier.orders}</td
>
                          <td className="px-4 py-3"
>
                            <div className="flex items-center gap-1"
>
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /
>
                              <span
>{courier.rating}</span
>
                            </div
>
                          </td
>
                          <td className="px-4 py-3 text-sm font-medium text-right"
>₺{courier.earnings.toLocaleString()}</td
>
                        </tr
>
                      ))}
                    </tbody
>
                  </table
>
                </div
>
              </CardContent
>
            </Card
>
          </TabsContent
>

          {/* Orders Tab */}
          <TabsContent value="orders"
>
            <Card
>
              <CardHeader
>
                <CardTitle>Tüm Siparişler</CardTitle
>
              </CardHeader
>
              <CardContent
>
                <div className="overflow-x-auto"
>
                  <table className="w-full"
>
                    <thead className="bg-gray-50 border-b"
>
                      <tr
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Sipariş</th
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Restoran</th
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Müşteri</th
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Kurye</th
>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Durum</th
>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Tutar</th
>
                      </tr
>
                    </thead
>
                    <tbody className="divide-y"
>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50"
>
                          <td className="px-4 py-3 text-sm font-medium"
>{order.id}</td
>
                          <td className="px-4 py-3 text-sm"
>{order.restaurant}</td
>
                          <td className="px-4 py-3 text-sm"
>{order.customer}</td
>
                          <td className="px-4 py-3 text-sm"
>{order.courier}</td
>
                          <td className="px-4 py-3"
>
                            <Badge className={
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }"
>
                              {order.status === 'delivered' ? 'Tamamlandı' :
                               order.status === 'in_progress' ? 'Yolda' : 'Hazırlanıyor'}
                            </Badge
>
                          </td
>
                          <td className="px-4 py-3 text-sm font-medium text-right"
>₺{order.amount.toFixed(2)}</td
>
                        </tr
>
                      ))}
                    </tbody
>
                  </table
>
                </div
>
              </CardContent
>
            </Card
>
          </TabsContent
>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-6"
>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"
>
              <Card
>
                <CardContent className="p-6"
>
                  <p className="text-sm text-gray-500"
>Aylık Komisyon</p
>
                  <p className="text-3xl font-bold mt-2"
>₺12,400</p
>
                  <p className="text-xs text-green-600 mt-1"
>+15% geçen aya göre</p
>
                </CardContent
>
              </Card
>
              <Card
>
                <CardContent className="p-6"
>
                  <p className="text-sm text-gray-500">Kurye Ödemeleri</p
>
                  <p className="text-3xl font-bold mt-2"
>₺18,500</p
>
                  <p className="text-xs text-amber-600 mt-1"
>Ödeme tarihi: 30 Haziran</p
>
                </CardContent
>
              </Card
>
              <Card
>
                <CardContent className="p-6"
>
                  <p className="text-sm text-gray-500"
>Net Kar</p
>
                  <p className="text-3xl font-bold mt-2"
>₺4,890</p
>
                  <p className="text-xs text-green-600 mt-1"
>+12% geçen aya göre</p
>
                </CardContent
>
              </Card
>
            </div
>

            <Card
>
              <CardHeader
>
                <CardTitle>Komisyon Detayı</CardTitle
>
              </CardHeader
>
              <CardContent
>
                <div className="h-[300px]"
>
                  <ResponsiveContainer width="100%" height="100%"
>
                    <BarChart data={commissionData}
>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" /
>
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} /
>
                      <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `₺${v}`} /
>
                      <Tooltip formatter={(value: number) => `₺${value.toLocaleString()}`} /
>
                      <Legend /
>
                      <Bar dataKey="komisyon" name="Komisyon" fill="#10b981" radius={[4, 4, 0, 0]} /
>
                      <Bar dataKey="kuryeOdemesi" name="Kurye Ödemesi" fill="#3b82f6" radius={[4, 4, 0, 0]} /
>
                    </BarChart
>
                  </ResponsiveContainer
>
                </div
>
              </CardContent
>
            </Card
>
          </TabsContent
>
        </Tabs
>
      </motion.div
>
    </motion.div
>
  );
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string; 
  change: string; 
  changeType: 'positive' | 'negative' | 'neutral';
  icon: any;
  color: string;
}) {
  return (
    <motion.div variants={itemVariants}
>
      <Card className="hover:shadow-lg transition-shadow"
>
        <CardContent className="p-6"
>
          <div className="flex items-start justify-between"
>
            <div
>
              <p className="text-sm font-medium text-gray-500"
>{title}</p
>
              <p className="text-2xl font-bold text-gray-900 mt-2"
>{value}</p
>
              <div className="flex items-center gap-1 mt-1"
>
                {changeType === 'positive' && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                {changeType === 'negative' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                <span className={`text-sm font-medium ${
                  changeType === 'positive' ? 'text-emerald-600' : 
                  changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                }`}
>
                  {change}
                </span
>
              </div
>
            </div
>
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            
>
              <Icon className="w-6 h-6" style={{ color }} />
            </div
>
          </div
>
        </CardContent
>
      </Card
>
    </motion.div
>
  );
}
