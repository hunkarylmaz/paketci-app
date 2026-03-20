"use client";

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Calendar, Download, Filter,
  DollarSign, Package, Users, Bike, Clock, MapPin,
  ChevronDown, ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Color Palette
const COLORS = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  gray: '#6b7280',
  chart: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'],
};

// Mock Data Generators
const generateDailyData = () => [
  { date: 'Pzt', orders: 245, revenue: 12450, couriers: 12, avgTime: 28 },
  { date: 'Sal', orders: 289, revenue: 15230, couriers: 14, avgTime: 26 },
  { date: 'Çar', orders: 312, revenue: 16890, couriers: 15, avgTime: 25 },
  { date: 'Per', orders: 298, revenue: 15980, couriers: 14, avgTime: 27 },
  { date: 'Cum', orders: 356, revenue: 19240, couriers: 18, avgTime: 24 },
  { date: 'Cmt', orders: 412, revenue: 23450, couriers: 20, avgTime: 23 },
  { date: 'Paz', orders: 389, revenue: 21890, couriers: 19, avgTime: 24 },
];

const generateHourlyData = () => [
  { hour: '08:00', orders: 15, activeCouriers: 5 },
  { hour: '09:00', orders: 28, activeCouriers: 8 },
  { hour: '10:00', orders: 42, activeCouriers: 12 },
  { hour: '11:00', orders: 58, activeCouriers: 15 },
  { hour: '12:00', orders: 85, activeCouriers: 20 },
  { hour: '13:00', orders: 92, activeCouriers: 22 },
  { hour: '14:00', orders: 68, activeCouriers: 18 },
  { hour: '15:00', orders: 45, activeCouriers: 14 },
  { hour: '16:00', orders: 52, activeCouriers: 16 },
  { hour: '17:00', orders: 78, activeCouriers: 21 },
  { hour: '18:00', orders: 95, activeCouriers: 24 },
  { hour: '19:00', orders: 88, activeCouriers: 23 },
  { hour: '20:00', orders: 72, activeCouriers: 20 },
  { hour: '21:00', orders: 48, activeCouriers: 15 },
  { hour: '22:00', orders: 25, activeCouriers: 10 },
];

const generateZoneData = () => [
  { name: 'Taksim', orders: 456, revenue: 24500, couriers: 8, satisfaction: 4.8 },
  { name: 'Şişli', orders: 312, revenue: 18900, couriers: 6, satisfaction: 4.6 },
  { name: 'Kadıköy', orders: 398, revenue: 22100, couriers: 7, satisfaction: 4.7 },
  { name: 'Beşiktaş', orders: 267, revenue: 15600, couriers: 5, satisfaction: 4.5 },
  { name: 'Üsküdar', orders: 189, revenue: 11200, couriers: 4, satisfaction: 4.4 },
];

const generateCourierPerformance = () => [
  { name: 'Ahmet Y.', deliveries: 45, rating: 4.9, earnings: 2340, speed: 28 },
  { name: 'Mehmet D.', deliveries: 38, rating: 4.8, earnings: 1980, speed: 30 },
  { name: 'Ali K.', deliveries: 52, rating: 4.7, earnings: 2890, speed: 26 },
  { name: 'Can Y.', deliveries: 41, rating: 4.9, earnings: 2150, speed: 27 },
  { name: 'Burak S.', deliveries: 35, rating: 4.6, earnings: 1820, speed: 32 },
];

const generateOrderStatusData = () => [
  { name: 'Tamamlandı', value: 68, color: COLORS.success },
  { name: 'Yolda', value: 18, color: COLORS.primary },
  { name: 'Hazırlanıyor', value: 8, color: COLORS.warning },
  { name: 'İptal', value: 4, color: COLORS.danger },
  { name: 'Bekliyor', value: 2, color: COLORS.gray },
];

const generateRevenueByCategory = () => [
  { name: 'Fast Food', value: 35, amount: 45200 },
  { name: 'Restoran', value: 25, amount: 32100 },
  { name: 'Kafe', value: 20, amount: 25800 },
  { name: 'Market', value: 15, amount: 18900 },
  { name: 'Diğer', value: 5, amount: 6400 },
];

// Custom Tooltip Components
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold text-gray-900">
              {entry.name.includes('₺') || entry.dataKey === 'revenue' 
                ? `₺${entry.value.toLocaleString()}` 
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: any;
  color: string;
}

function StatCard({ title, value, change, changeType, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {changeType === 'positive' ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            ) : changeType === 'negative' ? (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            ) : null}
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-emerald-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {change}
            </span>
          </div>
        </div>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}

// Revenue Chart Component
export function RevenueChart() {
  const data = useMemo(() => generateDailyData(), []);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Gelir Analizi</CardTitle>
          <CardDescription>Günlük gelir ve sipariş trendleri</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Bu Hafta
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                name="Gelir (₺)"
                stroke={COLORS.primary} 
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
              <Bar 
                yAxisId="right"
                dataKey="orders" 
                name="Sipariş"
                fill={COLORS.secondary}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Order Status Chart Component
export function OrderStatusChart() {
  const data = useMemo(() => generateOrderStatusData(), []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Sipariş Durumları</CardTitle>
        <CardDescription>Güncel sipariş dağılımı</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600">{item.name}</span>
              <span className="text-sm font-semibold ml-auto">%{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Hourly Activity Chart
export function HourlyActivityChart() {
  const data = useMemo(() => generateHourlyData(), []);

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Saatlik Aktivite</CardTitle>
        <CardDescription>Bugünkü sipariş ve kurye aktivitesi</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="couriersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="orders" 
                name="Sipariş"
                stroke={COLORS.primary} 
                fill="url(#ordersGradient)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="activeCouriers" 
                name="Aktif Kurye"
                stroke={COLORS.success} 
                fill="url(#couriersGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Zone Performance Chart
export function ZonePerformanceChart() {
  const data = useMemo(() => generateZoneData(), []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Bölge Performansı</CardTitle>
        <CardDescription>Bölgelere göre dağılım</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} 
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="Sipariş" fill={COLORS.primary} radius={[0, 4, 4, 0]} maxBarSize={20} />
              <Bar dataKey="couriers" name="Kurye" fill={COLORS.success} radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Courier Performance Chart
export function CourierPerformanceChart() {
  const data = useMemo(() => generateCourierPerformance(), []);

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Kurye Performansı</CardTitle>
            <CardDescription>En iyi performans gösteren kuryeler</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Tümünü Gör
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }} />
              <PolarRadiusAxis angle={30} domain={[0, 60]} tick={false} axisLine={false} />
              <Radar
                name="Teslimat"
                dataKey="deliveries"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.3}
              />
              <Radar
                name="Puan (x10)"
                dataKey="rating"
                stroke={COLORS.warning}
                fill={COLORS.warning}
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Revenue by Category Chart
export function RevenueByCategoryChart() {
  const data = useMemo(() => generateRevenueByCategory(), []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Kategori Bazlı Gelir</CardTitle>
        <CardDescription>Sektörlere göre dağılım</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: %${value}`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any, props: any) => [
                  `₺${props.payload.amount.toLocaleString()}`,
                  'Gelir'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Stats
export function DashboardStats() {
  const stats = [
    { title: 'Toplam Gelir', value: '₺128,450', change: '+12.5%', changeType: 'positive' as const, icon: DollarSign, color: COLORS.primary },
    { title: 'Toplam Sipariş', value: '2,341', change: '+8.2%', changeType: 'positive' as const, icon: Package, color: COLORS.secondary },
    { title: 'Aktif Kurye', value: '48', change: '+3', changeType: 'positive' as const, icon: Bike, color: COLORS.success },
    { title: 'Ort. Teslimat Süresi', value: '26 dk', change: '-2 dk', changeType: 'positive' as const, icon: Clock, color: COLORS.warning },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

// Complete Analytics Dashboard
export function AnalyticsDashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analiz Dashboard</h1>
          <p className="text-gray-500">İşletmenizin performans metrikleri</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtrele
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <DashboardStats />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <OrderStatusChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HourlyActivityChart />
        <ZonePerformanceChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CourierPerformanceChart />
        <RevenueByCategoryChart />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
