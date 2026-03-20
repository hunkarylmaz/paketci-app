'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Target,
  MapPin,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  ClipboardList,
  FileText,
  Map as MapIcon,
  Calendar,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Phone,
  Building2,
  Search,
  Filter,
  Download,
  Navigation,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

// Animasyon varyantları
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Renk paleti
const COLORS = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  chart: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
};

// Mock veriler
const statsData = [
  {
    label: 'Aylık Hedef',
    value: '15',
    subValue: '/ 20 Restoran',
    change: '+3',
    changeLabel: 'bu ay',
    icon: Target,
    color: '#3b82f6',
    progress: 75,
  },
  {
    label: 'Tamamlanan Ziyaret',
    value: '42',
    subValue: 'Bu ay',
    change: '+12%',
    changeLabel: 'geçen aya göre',
    icon: MapPin,
    color: '#10b981',
    progress: null,
  },
  {
    label: 'Potansiyel Müşteri',
    value: '28',
    subValue: 'Aktif takipte',
    change: '+5',
    changeLabel: 'yeni bu hafta',
    icon: Users,
    color: '#f59e0b',
    progress: null,
  },
  {
    label: 'Dönüşüm Oranı',
    value: '%68',
    subValue: 'Hedef: %75',
    change: '+5%',
    changeLabel: 'geçen aya göre',
    icon: TrendingUp,
    color: '#8b5cf6',
    progress: 68,
  },
];

// Lead funnel verileri
const funnelData = [
  { stage: 'Yeni', count: 45, color: '#3b82f6' },
  { stage: 'İletişime Geçildi', count: 32, color: '#60a5fa' },
  { stage: 'Ziyaret Edildi', count: 24, color: '#8b5cf6' },
  { stage: 'Görüşme Devam Ediyor', count: 18, color: '#f59e0b' },
  { stage: 'Dönüştü', count: 12, color: '#10b981' },
];

// Günlük ziyaret performans verileri
const visitPerformanceData = [
  { day: '1', visits: 2, target: 3 },
  { day: '2', visits: 3, target: 3 },
  { day: '3', visits: 1, target: 3 },
  { day: '4', visits: 4, target: 3 },
  { day: '5', visits: 3, target: 3 },
  { day: '6', visits: 2, target: 2 },
  { day: '7', visits: 1, target: 2 },
  { day: '8', visits: 3, target: 3 },
  { day: '9', visits: 4, target: 3 },
  { day: '10', visits: 2, target: 3 },
  { day: '11', visits: 3, target: 3 },
  { day: '12', visits: 5, target: 3 },
  { day: '13', visits: 2, target: 2 },
  { day: '14', visits: 2, target: 2 },
  { day: '15', visits: 3, target: 3 },
  { day: '16', visits: 4, target: 3 },
  { day: '17', visits: 2, target: 3 },
  { day: '18', visits: 3, target: 3 },
  { day: '19', visits: 4, target: 3 },
  { day: '20', visits: 2, target: 2 },
  { day: '21', visits: 1, target: 2 },
];

// Lead listesi
const leadsData = [
  {
    id: 1,
    name: 'Burger King - İstiklal',
    type: 'Restoran',
    status: 'negotiating',
    lastContact: '2026-03-20',
    nextAction: 'Teklif sunumu',
    priority: 'high',
    value: 15000,
  },
  {
    id: 2,
    name: 'Köfteci Yusuf',
    type: 'Restoran',
    status: 'visited',
    lastContact: '2026-03-19',
    nextAction: 'İkinci görüşme',
    priority: 'medium',
    value: 8000,
  },
  {
    id: 3,
    name: 'Pizza Hut - Kadıköy',
    type: 'Zincir',
    status: 'contacted',
    lastContact: '2026-03-18',
    nextAction: 'Ziyaret planla',
    priority: 'high',
    value: 25000,
  },
  {
    id: 4,
    name: 'Dönerci Ahmet',
    type: 'Restoran',
    status: 'new',
    lastContact: '-',
    nextAction: 'İlk arama',
    priority: 'low',
    value: 5000,
  },
  {
    id: 5,
    name: 'Sushi Co.',
    type: 'Restoran',
    status: 'converted',
    lastContact: '2026-03-15',
    nextAction: 'Sözleşme imza',
    priority: 'high',
    value: 12000,
  },
  {
    id: 6,
    name: 'Kebapçı Mehmet',
    type: 'Restoran',
    status: 'visited',
    lastContact: '2026-03-17',
    nextAction: 'Fiyatlandırma',
    priority: 'medium',
    value: 6000,
  },
];

// Son ziyaretler
const recentVisitsData = [
  {
    id: 1,
    restaurant: 'Burger King - İstiklal',
    date: '2026-03-20',
    time: '14:30',
    duration: '45 dk',
    type: 'Yüz yüze',
    outcome: 'Olumlu',
    notes: 'Teklif bekleniyor',
  },
  {
    id: 2,
    restaurant: 'Köfteci Yusuf',
    date: '2026-03-19',
    time: '11:00',
    duration: '30 dk',
    type: 'Yüz yüze',
    outcome: 'Beklemede',
    notes: 'Karar verecekler',
  },
  {
    id: 3,
    restaurant: 'Pizza Hut - Kadıköy',
    date: '2026-03-18',
    time: '16:00',
    duration: '60 dk',
    type: 'Telefon',
    outcome: 'Olumlu',
    notes: 'Ziyaret planlandı',
  },
  {
    id: 4,
    restaurant: 'Kebapçı Mehmet',
    date: '2026-03-17',
    time: '13:30',
    duration: '25 dk',
    type: 'Yüz yüze',
    outcome: 'Beklemede',
    notes: 'Fiyat istedi',
  },
  {
    id: 5,
    restaurant: 'Sushi Co.',
    date: '2026-03-15',
    time: '10:00',
    duration: '90 dk',
    type: 'Yüz yüze',
    outcome: 'Başarılı',
    notes: 'Anlaşma sağlandı',
  },
];

// Durum badge helper
const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; variant: string; color: string }> = {
    new: { label: 'Yeni', variant: 'default', color: '#3b82f6' },
    contacted: { label: 'İletişime Geçildi', variant: 'secondary', color: '#60a5fa' },
    visited: { label: 'Ziyaret Edildi', variant: 'outline', color: '#8b5cf6' },
    negotiating: { label: 'Görüşme Devam Ediyor', variant: 'warning', color: '#f59e0b' },
    converted: { label: 'Dönüştü', variant: 'success', color: '#10b981' },
  };

  const config = statusMap[status] || statusMap.new;

  return (
    <Badge
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
        borderColor: config.color,
      }}
      variant="outline"
      className="font-medium"
    >
      {config.label}
    </Badge>
  );
};

// Öncelik badge helper
const getPriorityBadge = (priority: string) => {
  const priorityMap: Record<string, { label: string; color: string }> = {
    high: { label: 'Yüksek', color: '#ef4444' },
    medium: { label: 'Orta', color: '#f59e0b' },
    low: { label: 'Düşük', color: '#6b7280' },
  };

  const config = priorityMap[priority] || priorityMap.low;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      <span className="text-sm text-gray-600">{config.label}</span>
    </div>
  );
};

// Sonuç badge helper
const getOutcomeBadge = (outcome: string) => {
  const outcomeMap: Record<string, { label: string; color: string; icon: any }> = {
    'Başarılı': { label: 'Başarılı', color: '#10b981', icon: CheckCircle2 },
    'Olumlu': { label: 'Olumlu', color: '#3b82f6', icon: TrendingUp },
    'Beklemede': { label: 'Beklemede', color: '#f59e0b', icon: Clock },
    'Olumsuz': { label: 'Olumsuz', color: '#ef4444', icon: TrendingDown },
  };

  const config = outcomeMap[outcome] || outcomeMap['Beklemede'];
  const Icon = config.icon;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium"
      style={{ backgroundColor: `${config.color}15`, color: config.color }}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
};

export default function FieldSalesDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredLeads = leadsData.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      className="container mx-auto p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saha Satış Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Hedeflerinizi takip edin, potansiyel müşterileri yönetin ve performansınızı analiz edin
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Mart 2026
          </Button>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Hızlı Aksiyonlar */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Yeni Lead Ekle
        </Button>
        <Button variant="outline" className="gap-2">
          <MapPin className="w-4 h-4" />
          Ziyaret Kaydet
        </Button>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Teklif Oluştur
        </Button>
        <Button variant="outline" className="gap-2">
          <Navigation className="w-4 h-4" />
          Rota Planla
        </Button>
      </motion.div>

      {/* İstatistik Kartları */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change?.startsWith('+');

          return (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <span className="text-sm text-gray-400">{stat.subValue}</span>
                      </div>
                      {stat.progress !== null && (
                        <div className="mt-3">
                          <Progress value={stat.progress} className="h-2" />
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        {isPositive ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-400">{stat.changeLabel}</span>
                      </div>
                    </div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Grafikler Satırı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Funnel Chart */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Lead Dönüşüm Hunisi
                  </CardTitle>
                  <CardDescription>Müşteri kazanım süreci</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={funnelData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="stage"
                      type="category"
                      width={120}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value: number) => [`${value} Lead`, 'Sayı']}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t">
                {funnelData.map((stage, index) => {
                  const prevCount = index > 0 ? funnelData[index - 1].count : stage.count;
                  const conversionRate = index > 0 ? Math.round((stage.count / prevCount) * 100) : 100;

                  return (
                    <div key={stage.stage} className="text-center">
                      <p className="text-lg font-bold" style={{ color: stage.color }}>
                        {stage.count}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{stage.stage}</p>
                      {index > 0 && (
                        <p className="text-xs text-gray-400 mt-1">%{conversionRate}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visit Performance Chart */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Günlük Ziyaret Performansı
                  </CardTitle>
                  <CardDescription>Bu ayki günlük ziyaretler</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-gray-600">Gerçekleşen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                    <span className="text-gray-600">Hedef</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                      interval={2}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value: number, name: string) => [
                        `${value} Ziyaret`,
                        name === 'visits' ? 'Gerçekleşen' : 'Hedef',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorVisits)"
                    />
                    <Area
                      type="monotone"
                      dataKey="target"
                      stroke="#d1d5db"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="none"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Toplam Ziyaret</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {visitPerformanceData.reduce((acc, curr) => acc + curr.visits, 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ortalama/Gün</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(visitPerformanceData.reduce((acc, curr) => acc + curr.visits, 0) / visitPerformanceData.length).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hedef Başarımı</p>
                  <p className="text-2xl font-bold text-emerald-600">%112</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Lead Listesi ve Bölge Haritası */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Listesi */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Potansiyel Müşteriler
                  </CardTitle>
                  <CardDescription>Aktif leadleriniz ve durumları</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-48"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Müşteri</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Durum</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Öncelik</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Son İletişim</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Beklenen Değer</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, index) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{lead.name}</p>
                              <p className="text-sm text-gray-500">{lead.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(lead.status)}</td>
                        <td className="py-3 px-4">{getPriorityBadge(lead.priority)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {lead.lastContact === '-' ? '-' : new Date(lead.lastContact).toLocaleDateString('tr-TR')}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">
                            ₺{lead.value.toLocaleString('tr-TR')}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            Detay
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredLeads.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Sonuç bulunamadı</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Bölge Haritası Placeholder */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <MapIcon className="w-5 h-5 text-orange-500" />
                    Bölge Haritası
                  </CardTitle>
                  <CardDescription>Saha çalışma alanınız</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-[280px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl overflow-hidden">
                {/* Harita Placeholder İçeriği */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-10 h-10 text-blue-500" />
                    </div>
                    <p className="text-gray-600 font-medium">İstanbul - Avrupa Yakası</p>
                    <p className="text-sm text-gray-400 mt-1">45 potansiyel müşteri</p>
                  </div>
                </div>

                {/* Dekoratif noktalar */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />

                {/* Mini istatistikler */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-blue-600">12</p>
                      <p className="text-xs text-gray-500">Bugün</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-emerald-600">28</p>
                      <p className="text-xs text-gray-500">Bu Hafta</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-purple-600">85</p>
                      <p className="text-xs text-gray-500">Bu Ay</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Aktif Bölgeler</span>
                  <span className="font-medium text-gray-900">3 İlçe</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Planlanan Ziyaret</span>
                  <span className="font-medium text-gray-900">5 Yarın</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Son Konum Güncellemesi</span>
                  <span className="font-medium text-emerald-600">5 dk önce</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Son Ziyaretler Tablosu */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-cyan-500" />
                  Son Ziyaretler
                </CardTitle>
                <CardDescription>Son gerçekleşen saha ziyaretleri</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Tümünü Gör
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Restoran</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tarih & Saat</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Süre</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tip</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sonuç</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Notlar</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVisitsData.map((visit, index) => (
                    <motion.tr
                      key={visit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-orange-600" />
                          </div>
                          <p className="font-medium text-gray-900">{visit.restaurant}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">
                            {new Date(visit.date).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="text-xs text-gray-500">{visit.time}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {visit.duration}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-medium">
                          {visit.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{getOutcomeBadge(visit.outcome)}</td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600 truncate max-w-[200px]">{visit.notes}</p>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
