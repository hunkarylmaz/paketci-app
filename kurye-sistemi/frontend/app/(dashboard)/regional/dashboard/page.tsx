'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin, Users, Bike, Store, TrendingUp, DollarSign,
  Activity, Building2, ArrowUpRight, ArrowDownRight,
  Calendar, Download, Bell, Search, Star, Phone, Mail,
  CheckCircle2, Clock, AlertCircle, FileText, BarChart3,
  PieChart, TrendingDown, MoreHorizontal, Filter,
  ChevronRight, UserCircle, Award, Target, MapPinned,
  Briefcase, Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

// Mock data for the regional manager dashboard
const dealerPerformanceData = [
  { name: 'Aydınlar Dağıtım', revenue: 245000, orders: 1250, couriers: 45, growth: 15 },
  { name: 'Hızlı Servis', revenue: 198000, orders: 980, couriers: 38, growth: 8 },
  { name: 'Mega Lojistik', revenue: 167000, orders: 845, couriers: 32, growth: 12 },
  { name: 'Express Dağıtım', revenue: 134000, orders: 678, couriers: 28, growth: -3 },
  { name: 'Star Kurye', revenue: 112000, orders: 567, couriers: 24, growth: 22 },
  { name: 'İstanbul Lojistik', revenue: 98000, orders: 498, couriers: 21, growth: 18 },
];

const restaurantGrowthData = [
  { month: 'Ocak', newRestaurants: 12, totalRestaurants: 245 },
  { month: 'Şubat', newRestaurants: 18, totalRestaurants: 263 },
  { month: 'Mart', newRestaurants: 15, totalRestaurants: 278 },
  { month: 'Nisan', newRestaurants: 22, totalRestaurants: 300 },
  { month: 'Mayıs', newRestaurants: 19, totalRestaurants: 319 },
  { month: 'Haziran', newRestaurants: 25, totalRestaurants: 344 },
];

const courierZoneDistribution = [
  { name: 'Beşiktaş', value: 45, color: '#3b82f6' },
  { name: 'Şişli', value: 38, color: '#10b981' },
  { name: 'Taksim', value: 32, color: '#f59e0b' },
  { name: 'Kadıköy', value: 28, color: '#ef4444' },
  { name: 'Ataşehir', value: 22, color: '#8b5cf6' },
  { name: 'Diğer', value: 15, color: '#6b7280' },
];

const subordinates = [
  { 
    id: 1, 
    name: 'Ahmet Yılmaz', 
    role: 'Bölge Sorumlusu', 
    zone: 'Beşiktaş-Şişli',
    performance: 94, 
    dealers: 8, 
    restaurants: 85, 
    couriers: 42,
    avatar: 'AY',
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Mehmet Demir', 
    role: 'Operasyon Müdürü', 
    zone: 'Taksim-Beyoğlu',
    performance: 89, 
    dealers: 6, 
    restaurants: 72, 
    couriers: 35,
    avatar: 'MD',
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Ayşe Kaya', 
    role: 'Bölge Sorumlusu', 
    zone: 'Kadıköy-Ataşehir',
    performance: 92, 
    dealers: 7, 
    restaurants: 78, 
    couriers: 38,
    avatar: 'AK',
    status: 'active'
  },
  { 
    id: 4, 
    name: 'Can Yıldız', 
    role: 'Satış Temsilcisi', 
    zone: 'Avrupa Yakası',
    performance: 78, 
    dealers: 5, 
    restaurants: 52, 
    couriers: 25,
    avatar: 'CY',
    status: 'warning'
  },
  { 
    id: 5, 
    name: 'Zeynep Şahin', 
    role: 'Operasyon Müdürü', 
    zone: 'Anadolu Yakası',
    performance: 96, 
    dealers: 9, 
    restaurants: 95, 
    couriers: 48,
    avatar: 'ZŞ',
    status: 'active'
  },
];

const topRestaurants = [
  { id: 1, name: 'Burger King - Taksim', orders: 1456, revenue: 78500, rating: 4.8, growth: 15, dealer: 'Aydınlar Dağıtım' },
  { id: 2, name: 'McDonald\'s - Şişli', orders: 1289, revenue: 71200, rating: 4.6, growth: 8, dealer: 'Aydınlar Dağıtım' },
  { id: 3, name: 'KFC - Beşiktaş', orders: 1134, revenue: 62900, rating: 4.7, growth: 12, dealer: 'Hızlı Servis' },
  { id: 4, name: 'Pizza Hut - Kadıköy', orders: 998, revenue: 56500, rating: 4.5, growth: -2, dealer: 'Mega Lojistik' },
  { id: 5, name: 'Dominos - Ataşehir', orders: 967, revenue: 54800, rating: 4.9, growth: 25, dealer: 'Mega Lojistik' },
  { id: 6, name: 'Starbucks - Taksim', orders: 856, revenue: 48900, rating: 4.8, growth: 18, dealer: 'Aydınlar Dağıtım' },
];

const recentReports = [
  { id: 1, title: 'Aylık Performans Raporu', date: 'Haziran 2024', type: 'performance', status: 'ready' },
  { id: 2, title: 'Bayi Komisyon Özeti', date: 'Haziran 2024', type: 'finance', status: 'ready' },
  { id: 3, title: 'Kurye Verimlilik Analizi', date: 'Q2 2024', type: 'operations', status: 'generating' },
  { id: 4, title: 'Restoran Büyüme Raporu', date: 'Haziran 2024', type: 'growth', status: 'ready' },
];

const weeklyStats = [
  { day: 'Pzt', deliveries: 1450, target: 1500 },
  { day: 'Sal', deliveries: 1380, target: 1500 },
  { day: 'Çar', deliveries: 1520, target: 1500 },
  { day: 'Per', deliveries: 1680, target: 1600 },
  { day: 'Cum', deliveries: 1890, target: 1800 },
  { day: 'Cmt', deliveries: 2100, target: 2000 },
  { day: 'Paz', deliveries: 1750, target: 1800 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function RegionalDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubordinates = subordinates.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totalDealers = dealerPerformanceData.length;
  const totalRestaurants = 344;
  const totalCouriers = 180;
  const dailyDeliveries = 11770;

  return (
    <motion.div 
      className="container mx-auto p-4 lg:p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <MapPinned className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">İstanbul Avrupa</h1>
            <p className="text-gray-500 mt-1">Bölge Müdürü Kontrol Paneli</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                <Crown className="w-3 h-3 mr-1" />
                Bölge Müdürü
              </Badge>
              <Badge variant="outline" className="border-gray-300">
                <MapPin className="w-3 h-3 mr-1" />
                İstanbul Avrupa Yakası
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                <Award className="w-3 h-3 mr-1" />
                %94 Performans
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Haziran 2024
          </Button>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Download className="w-4 h-4" />
            Rapor İndir
          </Button>
        </div>
      </motion.div>

      {/* Manager Info Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                  BK
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Burak Korkmaz</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    burak.korkmaz@paketim.com
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    0555 123 4567
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center px-4 border-r border-indigo-200">
                  <p className="text-2xl font-bold text-indigo-700">3</p>
                  <p className="text-xs text-gray-600">Yıl Deneyim</p>
                </div>
                <div className="text-center px-4 border-r border-indigo-200">
                  <p className="text-2xl font-bold text-indigo-700">28</p>
                  <p className="text-xs text-gray-600">Bayi</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-2xl font-bold text-indigo-700">#1</p>
                  <p className="text-xs text-gray-600">Bölge Sıralaması</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Bayi"
          value={totalDealers.toString()}
          change="+3 bu ay"
          changeType="positive"
          icon={Building2}
          color="#3b82f6"
          subtitle="6 aktif bölgede"
        />
        <StatCard
          title="Aktif Restoran"
          value={totalRestaurants.toString()}
          change="+25"
          changeType="positive"
          icon={Store}
          color="#10b981"
          subtitle="+7 bu hafta"
        />
        <StatCard
          title="Toplam Kurye"
          value={totalCouriers.toString()}
          change="+12"
          changeType="positive"
          icon={Bike}
          color="#f59e0b"
          subtitle="156 aktif, 24 mola"
        />
        <StatCard
          title="Günlük Teslimat"
          value={dailyDeliveries.toLocaleString()}
          change="+8.4%"
          changeType="positive"
          icon={Activity}
          color="#8b5cf6"
          subtitle="Hedef: 12,000"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dealer Performance Chart */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Bayi Performansı
                </CardTitle>
                <CardDescription>Gelire göre sıralanmış top bayiler</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                Tümü <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dealerPerformanceData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" stroke="#6b7280" fontSize={11} tickFormatter={(v) => `₺${v/1000}k`} />
                    <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={11} width={100} />
                    <Tooltip 
                      formatter={(value: number) => `₺${value.toLocaleString()}`}
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="revenue" name="Gelir" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Restaurant Growth Chart */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Restoran Büyümesi
                </CardTitle>
                <CardDescription>Aylık yeni restoran kayıtları</CardDescription>
              </div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                +111 YTD
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={restaurantGrowthData}>
                    <defs>
                      <linearGradient id="colorNewRest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="newRestaurants" 
                      name="Yeni Restoran" 
                      stroke="#10b981" 
                      fill="url(#colorNewRest)" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalRestaurants" 
                      name="Toplam Restoran" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courier Distribution by Zone */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5 text-amber-600" />
                Kurye Dağılımı
              </CardTitle>
              <CardDescription>Bölgelere göre kurye dağılımı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={courierZoneDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {courierZoneDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `${value} kurye`}
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {courierZoneDistribution.slice(0, 4).map((zone) => (
                  <div key={zone.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                    <span className="text-gray-600">{zone.name}</span>
                    <span className="font-medium ml-auto">{zone.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Delivery Stats */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Haftalık Teslimat Performansı
                </CardTitle>
                <CardDescription>Günlük teslimat ve hedef karşılaştırması</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="deliveries" name="Gerçekleşen" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="Hedef" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section: Subordinates & Top Restaurants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subordinates List */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Ekip Yönetimi
                </CardTitle>
                <CardDescription>Doğrudan raporladığınız personel</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-40 h-9"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredSubordinates.map((person) => (
                  <div key={person.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                      {person.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{person.name}</p>
                        <Badge variant={person.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                          {person.status === 'active' ? 'Aktif' : 'Uyarı'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{person.role} • {person.zone}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold">%{person.performance}</span>
                      </div>
                      <Progress value={person.performance} className="w-20 h-1.5 mt-1" />
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {person.dealers}
                      </span>
                      <span className="flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        {person.restaurants}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bike className="w-3 h-3" />
                        {person.couriers}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">Tüm Ekibi Gör</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Restaurants */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  En İyi Restoranlar
                </CardTitle>
                <CardDescription>Satış hacmine göre top restoranlar</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                Tümü <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topRestaurants.slice(0, 5).map((restaurant, index) => (
                  <div key={restaurant.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{restaurant.name}</p>
                      <p className="text-xs text-gray-500">{restaurant.dealer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₺{restaurant.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{restaurant.rating}</span>
                        <span className={`${restaurant.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({restaurant.growth > 0 ? '+' : ''}{restaurant.growth}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">Tüm Restoranları Gör</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Regional Reports Quick Access */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Bölgesel Raporlara Hızlı Erişim
            </CardTitle>
            <CardDescription>En son hazırlanan ve oluşturulan raporlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      report.type === 'performance' ? 'bg-blue-100 text-blue-600' :
                      report.type === 'finance' ? 'bg-green-100 text-green-600' :
                      report.type === 'operations' ? 'bg-amber-100 text-amber-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <Badge variant={report.status === 'ready' ? 'default' : 'secondary'} className="text-[10px]">
                      {report.status === 'ready' ? 'Hazır' : 'Oluşturuluyor'}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {report.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{report.date}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 h-8">
                      Görüntüle
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Performans Raporu
              </Button>
              <Button variant="outline" className="gap-2">
                <DollarSign className="w-4 h-4" />
                Finansal Özet
              </Button>
              <Button variant="outline" className="gap-2">
                <Bike className="w-4 h-4" />
                Kurye Analizi
              </Button>
              <Button variant="outline" className="gap-2">
                <Store className="w-4 h-4" />
                Restoran Raporu
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color,
  subtitle 
}: { 
  title: string; 
  value: string; 
  change: string; 
  changeType: 'positive' | 'negative' | 'neutral';
  icon: any;
  color: string;
  subtitle: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              <div className="flex items-center gap-1 mt-1">
                {changeType === 'positive' && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                {changeType === 'negative' && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                <span className={`text-xs font-medium ${
                  changeType === 'positive' ? 'text-emerald-600' : 
                  changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {change}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            </div>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
