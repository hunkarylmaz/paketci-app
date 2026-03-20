'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Users, Bike, Store, TrendingUp, DollarSign,
  Activity, MapPin, Briefcase, Target, ArrowUpRight, ArrowDownRight,
  Calendar, Download, Filter, MoreHorizontal, Bell,
  CheckCircle2, Clock, AlertCircle, Zap, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Link from 'next/link';

// Mock data
const revenueData = [
  { month: 'Ocak', gelir: 45000, gider: 32000, kar: 13000 },
  { month: 'Şubat', gelir: 52000, gider: 35000, kar: 17000 },
  { month: 'Mart', gelir: 48000, gider: 31000, kar: 17000 },
  { month: 'Nisan', gelir: 61000, gider: 38000, kar: 23000 },
  { month: 'Mayıs', gelir: 58000, gider: 36000, kar: 22000 },
  { month: 'Haziran', gelir: 72000, gider: 42000, kar: 30000 },
];

const zonePerformance = [
  { name: 'İstanbul Avrupa', orders: 1245, revenue: 89000, couriers: 45, growth: 12 },
  { name: 'İstanbul Anadolu', orders: 980, revenue: 67000, couriers: 38, growth: 8 },
  { name: 'Ankara', orders: 756, revenue: 45000, couriers: 28, growth: 15 },
  { name: 'İzmir', orders: 634, revenue: 38000, couriers: 22, growth: -3 },
  { name: 'Antalya', orders: 423, revenue: 28000, couriers: 15, growth: 22 },
];

const recentActivities = [
  { id: 1, type: 'user', action: 'Yeni bayi kaydı', detail: 'Aydınlar Dağıtım', time: '5 dk önce', user: 'Sistem' },
  { id: 2, type: 'order', action: 'Toplu sipariş ataması', detail: '45 sipariş atandı', time: '12 dk önce', user: 'Operasyon' },
  { id: 3, type: 'payment', action: 'Komisyon ödemesi', detail: '₺45,230 ödendi', time: '1 saat önce', user: 'Muhasebe' },
  { id: 4, type: 'alert', action: 'Sistem uyarısı', detail: 'İstanbul Anadolu bölgesinde yoğunluk', time: '2 saat önce', user: 'Sistem' },
  { id: 5, type: 'user', action: 'Yeni kurye kaydı', detail: '12 kurye eklendi', time: '3 saat önce', user: 'İK' },
];

const topRestaurants = [
  { name: 'Burger King - Taksim', orders: 456, revenue: 24500, rating: 4.8, growth: 15 },
  { name: 'McDonald\'s - Şişli', orders: 389, revenue: 21200, rating: 4.6, growth: 8 },
  { name: 'KFC - Kadıköy', orders: 334, revenue: 18900, rating: 4.7, growth: 12 },
  { name: 'Pizza Hut - Beşiktaş', orders: 298, revenue: 16500, rating: 4.5, growth: -2 },
  { name: 'Dominos - Ataşehir', orders: 267, revenue: 14800, rating: 4.9, growth: 25 },
];

const systemHealth = [
  { service: 'API Gateway', status: 'healthy', uptime: '99.99%', lastCheck: '1 dk önce' },
  { service: 'Veritabanı', status: 'healthy', uptime: '99.95%', lastCheck: '1 dk önce' },
  { service: 'Redis Cache', status: 'healthy', uptime: '99.98%', lastCheck: '1 dk önce' },
  { service: 'Queue Worker', status: 'warning', uptime: '98.50%', lastCheck: '5 dk önce' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
    <motion.div 
      className="container mx-auto p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between"
>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Kontrol Paneli</h1>
          <p className="text-gray-500 mt-1">Şirket genelindeki tüm operasyonları yönetin</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-purple-100 text-purple-700">
              <Shield className="w-3 h-3 mr-1" />
              Company Admin
            </Badge>
            <Badge variant="outline">Paketim Dağıtım A.Ş.</Badge>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
>
        <StatCard
          title="Toplam Gelir"
          value="₺376,000"
          change="+15.3%"
          changeType="positive"
          icon={DollarSign}
          color="#3b82f6"
          subtitle="Bu ay"
        />
        <StatCard
          title="Aktif Kullanıcı"
          value="1,245"
          change="+42"
          changeType="positive"
          icon={Users}
          color="#10b981"
          subtitle="12 yeni bugün"
        />
        <StatCard
          title="Toplam Sipariş"
          value="4,068"
          change="+8.7%"
          changeType="positive"
          icon={Activity}
          color="#f59e0b"
          subtitle="234 aktif"
        />
        <StatCard
          title="Aktif Kurye"
          value="148"
          change="-3"
          changeType="neutral"
          icon={Bike}
          color="#8b5cf6"
          subtitle="12 mola"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"
>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Restoran</p>
                  <p className="text-2xl font-bold mt-1">342</p>
                  <p className="text-xs text-green-600 mt-1">+5 bu hafta</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Store className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Bayi</p>
                  <p className="text-2xl font-bold mt-1">28</p>
                  <p className="text-xs text-green-600 mt-1">+2 bu ay</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Bölge</p>
                  <p className="text-2xl font-bold mt-1">5</p>
                  <p className="text-xs text-gray-500 mt-1">12 ilçe</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <motion.div variants={itemVariants}
>
        <Tabs defaultValue="overview" className="space-y-6"
>
          <TabsList className="bg-gray-100 p-1"
>
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="finance">Finans</TabsTrigger>
            <TabsTrigger value="operations">Operasyon</TabsTrigger>
            <TabsTrigger value="system">Sistem</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6"
>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"
>
              {/* Revenue Chart */}
              <Card className="lg:col-span-2"
>
                <CardHeader>
                  <CardTitle>Gelir & Gider Analizi</CardTitle>
                  <CardDescription>Aylık finansal performans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]"
>
                    <ResponsiveContainer width="100%" height="100%"
>
                      <AreaChart data={revenueData}
>
                        <defs>
                          <linearGradient id="colorGelir" x1="0" y1="0" x2="0" y2="1"
>
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/
                          </linearGradient
>
                          <linearGradient id="colorKar" x1="0" y1="0" x2="0" y2="1"
>
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/
                          </linearGradient
>
                        </defs
>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" /
>
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} /
>
                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `₺${v/1000}k`} /
>
                        <Tooltip 
                          formatter={(value: number) => `₺${value.toLocaleString()}`}
                          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        /
>
                        <Legend /
>
                        <Area type="monotone" dataKey="gelir" name="Gelir" stroke="#3b82f6" fillOpacity={1} fill="url(#colorGelir)" strokeWidth={2} /
>
                        <Area type="monotone" dataKey="kar" name="Net Kar" stroke="#10b981" fillOpacity={1} fill="url(#colorKar)" strokeWidth={2} /
>
                      </AreaChart
>
                    </ResponsiveContainer
>
                  </div
>
                </CardContent
>
              </Card
>

              {/* Top Restaurants */}
              <Card
>
                <CardHeader
>
                  <CardTitle>En İyi Restoranlar</CardTitle>
                  <CardDescription>Satış hacmine göre</CardDescription>
                </CardHeader
>
                <CardContent
>
                  <div className="space-y-4"
>
                    {topRestaurants.map((restaurant, index) => (
                      <div key={index} className="flex items-center gap-3"
>
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-semibold text-gray-600"
>
                          {index + 1}
                        </div
>
                        <div className="flex-1 min-w-0"
>
                          <p className="font-medium text-gray-900 truncate"
>{restaurant.name}</p
>
                          <p className="text-xs text-gray-500"
>{restaurant.orders} sipariş</p
>
                        </div
>
                        <div className="text-right"
>
                          <p className="font-semibold text-gray-900"
>₺{restaurant.revenue.toLocaleString()}</p
>
                          <p className={`text-xs ${restaurant.growth > 0 ? 'text-green-600' : 'text-red-600'}`}
>
                            {restaurant.growth > 0 ? '+' : ''}{restaurant.growth}%
                          </p
>
                        </div
>
                      </div
>
                    ))}
                  </div
>
                  <Button variant="outline" className="w-full mt-4"
>Tümünü Gör</Button
>
                </CardContent
>
              </Card
>
            </div
>

            {/* Zone Performance */}
            <Card
>
              <CardHeader
>
                <CardTitle>Bölge Performansı</CardTitle>
                <CardDescription>Bölgelere göre dağılım</CardDescription>
              </CardHeader
>
              <CardContent
>
                <div className="h-[300px]"
>
                  <ResponsiveContainer width="100%" height="100%"
>
                    <BarChart data={zonePerformance}
>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" /
>
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={11} /
>
                      <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} /
>
                      <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} /
>
                      <Tooltip 
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      /
>
                      <Legend /
>
                      <Bar yAxisId="left" dataKey="orders" name="Sipariş" fill="#3b82f6" radius={[4, 4, 0, 0]} /
>
                      <Bar yAxisId="right" dataKey="couriers" name="Kurye" fill="#10b981" radius={[4, 4, 0, 0]} /
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

            {/* Recent Activities */}
            <Card
>
              <CardHeader
>
                <div className="flex items-center justify-between"
>
                  <div
>
                    <CardTitle>Son Aktiviteler</CardTitle>
                    <CardDescription>Sistemdeki son işlemler</CardDescription>
                  </div
>
                  <Button variant="outline" size="sm"
>Tümünü Gör</Button
>
                </div
>
              </CardHeader
>
              <CardContent
>
                <div className="space-y-4"
>
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === 'user' ? 'bg-blue-100' :
                        activity.type === 'order' ? 'bg-green-100' :
                        activity.type === 'payment' ? 'bg-amber-100' : 'bg-red-100'
                      }`}
>
                        {activity.type === 'user' && <Users className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'order' && <Activity className="w-5 h-5 text-green-600" />}
                        {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-amber-600" />}
                        {activity.type === 'alert' && <AlertCircle className="w-5 h-5 text-red-600" />}
                      </div
>
                      <div className="flex-1"
>
                        <p className="font-medium text-gray-900"
>{activity.action}</p
>
                        <p className="text-sm text-gray-500"
>{activity.detail}</p
>
                      </div
>
                      <div className="text-right"
>
                        <p className="text-xs text-gray-500"
>{activity.time}</p
>
                        <p className="text-xs text-gray-400"
>{activity.user}</p
>
                      </div
>
                    </div
>
                  ))}
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
>Bekleyen Fatura</p
>
                  <p className="text-3xl font-bold mt-2"
>₺45,230</p
>
                  <p className="text-xs text-amber-600 mt-1"
>12 restoran</p
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
>Kurye Ödemeleri</p
>
                  <p className="text-3xl font-bold mt-2"
>₺128,450</p
>
                  <p className="text-xs text-green-600 mt-1"
>Haftalık ödeme hazır</p
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
>Bayi Komisyonları</p
>
                  <p className="text-3xl font-bold mt-2"
>₺34,890</p
>
                  <p className="text-xs text-blue-600 mt-1"
>28 bayi</p
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
                <CardTitle>Detaylı Finansal Rapor</CardTitle
>
              </CardHeader
>
              <CardContent
>
                <p className="text-gray-500"
>Finansal rapor detayları burada görüntülenecek...</p
>
              </CardContent
>
            </Card
>
          </TabsContent
>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6"
>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4"
>
              {[
                { label: 'Aktif Teslimat', value: '234', icon: Activity, color: 'blue' },
                { label: 'Bekleyen Atama', value: '12', icon: Clock, color: 'amber' },
                { label: 'Gecikme', value: '8', icon: AlertCircle, color: 'red' },
                { label: 'Tamamlandı', value: '189', icon: CheckCircle2, color: 'green' },
              ].map((stat, i) => (
                <Card key={i}
>
                  <CardContent className="p-6"
>
                    <div className="flex items-center gap-3"
>
                      <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`
>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                      </div
>
                      <div
>
                        <p className="text-sm text-gray-500"
>{stat.label}</p
>
                        <p className="text-2xl font-bold"
>{stat.value}</p
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
          </TabsContent
>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6"
>
            <Card
>
              <CardHeader
>
                <CardTitle>Sistem Sağlığı</CardTitle
>
                <CardDescription>Servis durumları ve uptime</CardDescription>
              </CardHeader
>
              <CardContent
>
                <div className="space-y-4"
>
                  {systemHealth.map((service, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
>
                      <div className="flex items-center gap-3"
>
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === 'healthy' ? 'bg-green-500' : 'bg-amber-500'
                        }`}
 />
                        <div
>
                          <p className="font-medium"
>{service.service}</p
>
                          <p className="text-xs text-gray-500"
>Son kontrol: {service.lastCheck}</p
>
                        </div
>
                      </div
>
                      <div className="text-right"
>
                        <p className="font-semibold"
>{service.uptime}</p
>
                        <p className="text-xs text-gray-500"
>Uptime</p
>
                      </div
>
                    </div
>
                  ))}
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
              <p className="text-xs text-gray-400 mt-1"
>{subtitle}</p
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
