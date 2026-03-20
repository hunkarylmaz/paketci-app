'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle2,
  HeadphonesIcon,
  MapPin,
  AlertTriangle,
  AlertCircle,
  Info,
  Bike,
  Coffee,
  Power,
  UserPlus,
  Ticket,
  Map,
  Bell,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Filter,
  RefreshCw,
  Search,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Navigation,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Animasyon varyantları
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Örnek veriler
const statsData = [
  {
    label: 'Aktif Teslimat',
    value: '156',
    change: '+12%',
    trend: 'up',
    icon: Package,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Gecikmeli (>30dk)',
    value: '23',
    change: '-5%',
    trend: 'down',
    icon: Clock,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    label: 'Çözülen Sorunlar',
    value: '89',
    change: '+18%',
    trend: 'up',
    icon: CheckCircle2,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Bekleyen Ticket',
    value: '14',
    change: '+2',
    trend: 'up',
    icon: HeadphonesIcon,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
];

const courierStatusData = [
  { status: 'active', label: 'Aktif', count: 89, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  { status: 'break', label: 'Mola', count: 12, color: 'bg-amber-500', textColor: 'text-amber-600' },
  { status: 'offline', label: 'Çevrimdışı', count: 45, color: 'bg-slate-400', textColor: 'text-slate-600' },
];

const activeIssues = [
  {
    id: 1,
    title: 'Sipariş #1234 - Teslimat adresi bulunamadı',
    priority: 'critical',
    priorityLabel: 'Kritik',
    time: '5 dk önce',
    assigned: 'Ahmet Y.',
    type: 'delivery',
  },
  {
    id: 2,
    title: 'Kurye #45 - Araç arızası bildirdi',
    priority: 'high',
    priorityLabel: 'Yüksek',
    time: '12 dk önce',
    assigned: 'Operasyon Ekibi',
    type: 'courier',
  },
  {
    id: 3,
    title: 'Restoran #23 - Sipariş hazırlama gecikmesi',
    priority: 'medium',
    priorityLabel: 'Orta',
    time: '28 dk önce',
    assigned: 'Saha Sorumlusu',
    type: 'restaurant',
  },
  {
    id: 4,
    title: 'Müşteri şikayeti - Soğuk yemek',
    priority: 'low',
    priorityLabel: 'Düşük',
    time: '45 dk önce',
    assigned: 'Destek Ekibi',
    type: 'complaint',
  },
  {
    id: 5,
    title: 'Sipariş #1241 - Kurye yanıt vermiyor',
    priority: 'high',
    priorityLabel: 'Yüksek',
    time: '15 dk önce',
    assigned: 'Operasyon Ekibi',
    type: 'delivery',
  },
];

const supportTickets = [
  {
    id: 'TKT-2024-001',
    subject: 'Fatura ödeme sorunu',
    status: 'open',
    statusLabel: 'Açık',
    priority: 'high',
    assignedTo: 'Mehmet K.',
    created: '2026-03-20 14:30',
    customer: 'Burger King - Kadıköy',
  },
  {
    id: 'TKT-2024-002',
    subject: 'Kurye uygulaması giriş hatası',
    status: 'in_progress',
    statusLabel: 'İşlemde',
    priority: 'critical',
    assignedTo: 'Teknik Destek',
    created: '2026-03-20 16:45',
    customer: 'Kurye #78',
  },
  {
    id: 'TKT-2024-003',
    subject: 'Ödeme hesaplaması hatalı',
    status: 'pending',
    statusLabel: 'Beklemede',
    priority: 'medium',
    assignedTo: 'Muhasebe',
    created: '2026-03-19 09:15',
    customer: 'Pizza Hut - Beşiktaş',
  },
  {
    id: 'TKT-2024-004',
    subject: 'Menü güncelleme talebi',
    status: 'resolved',
    statusLabel: 'Çözüldü',
    priority: 'low',
    assignedTo: 'İçerik Ekibi',
    created: '2026-03-18 11:20',
    customer: 'Dönerci Ali Usta',
  },
  {
    id: 'TKT-2024-005',
    subject: 'Teslimat raporu eksik',
    status: 'open',
    statusLabel: 'Açık',
    priority: 'medium',
    assignedTo: 'Veri Ekibi',
    created: '2026-03-20 08:00',
    customer: 'Şirket Yöneticisi',
  },
];

const alerts = [
  {
    id: 1,
    type: 'new_order',
    title: 'Yeni Sipariş',
    message: 'Bölge 3\'ten 15 yeni sipariş alındı',
    time: '2 dk önce',
    icon: Package,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    type: 'delay',
    title: 'Teslimat Gecikmesi',
    message: 'Sipariş #1234 35 dakikadır yolda',
    time: '5 dk önce',
    icon: Clock,
    color: 'bg-amber-500',
  },
  {
    id: 3,
    type: 'complaint',
    title: 'Müşteri Şikayeti',
    message: 'Sipariş #1229 için olumsuz değerlendirme',
    time: '12 dk önce',
    icon: AlertTriangle,
    color: 'bg-rose-500',
  },
  {
    id: 4,
    type: 'new_order',
    title: 'Yoğunluk Uyarısı',
    message: 'Kadıköy bölgesinde kurye sayısı yetersiz',
    time: '18 dk önce',
    icon: Navigation,
    color: 'bg-purple-500',
  },
];

const priorityConfig: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  low: { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
};

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  open: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Açık' },
  in_progress: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'İşlemde' },
  pending: { color: 'text-slate-600', bg: 'bg-slate-50', label: 'Beklemede' },
  resolved: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Çözüldü' },
};

export default function OperationsDashboardPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalCouriers = courierStatusData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Başlık ve Hızlı İşlemler */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operasyon Merkezi</h1>
          <p className="text-slate-500 mt-1">Gerçek zamanlı operasyon yönetimi ve izleme</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25">
            <UserPlus className="w-4 h-4 mr-2" />
            Kurye Ata
          </Button>
          <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
            <Ticket className="w-4 h-4 mr-2" />
            Ticket Oluştur
          </Button>
          <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
            <Map className="w-4 h-4 mr-2" />
            Canlı Harita
          </Button>
        </div>
      </motion.div>

      {/* İstatistik Kartları */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group"
          >
            <Card className="relative overflow-hidden border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.iconColor}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Ana İçerik Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sol Kolon - Canlı Harita ve Kurye Durumu */}
        <div className="xl:col-span-2 space-y-6">
          {/* Canlı Harita Placeholder */}
          <motion.div variants={itemVariants}>
            <Card className="border-slate-200 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Canlı Teslimat Haritası</CardTitle>
                      <CardDescription>Aktif teslimatların gerçek zamanlı konumları</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-rose-500 text-white animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full mr-2" />
                    CANLI
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-80 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  {/* Harita Placeholder Arka Plan */}
                  <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 800 400">
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
                      </pattern>
                      <rect width="800" height="400" fill="url(#grid)" />
                      {/* Örnek Yollar */}
                      <path d="M 100 200 Q 200 150 300 200 T 500 200 T 700 150" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5"/>
                      <path d="M 50 100 Q 150 200 250 150 T 450 250" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5"/>
                      <path d="M 200 300 Q 350 250 500 300 T 750 280" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5"/>
                      {/* Örnek Bölgeler */}
                      <circle cx="150" cy="150" r="30" fill="#e2e8f0" opacity="0.5"/>
                      <circle cx="400" cy="200" r="40" fill="#e2e8f0" opacity="0.5"/>
                      <circle cx="650" cy="180" r="25" fill="#e2e8f0" opacity="0.5"/>
                    </svg>
                  </div>
                  
                  {/* Aktif Kurye İşaretçileri */}
                  <div className="absolute top-1/4 left-1/4">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"
                    />
                  </div>
                  <div className="absolute top-1/3 left-1/2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"
                    />
                  </div>
                  <div className="absolute top-1/2 left-2/3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-lg"
                    />
                  </div>
                  <div className="absolute bottom-1/3 left-1/3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                      className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"
                    />
                  </div>
                  
                  {/* Placeholder Metin */}
                  <div className="relative z-10 text-center">
                    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
                      <Map className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 font-medium">Harita Entegrasyonu</p>
                      <p className="text-sm text-slate-400 mt-1">Google Maps / Mapbox</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                      <span className="text-sm text-slate-600">Yolda (89)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full" />
                      <span className="text-sm text-slate-600">Teslimatta (12)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm text-slate-600">Restoranda (55)</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-500">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Yenile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Aktif Sorunlar ve Support Ticket'ler */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="issues" className="w-full">
              <Card className="border-slate-200">
                <CardHeader className="pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <TabsList className="bg-slate-100">
                      <TabsTrigger value="issues" className="data-[state=active]:bg-white">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Aktif Sorunlar
                      </TabsTrigger>
                      <TabsTrigger value="tickets" className="data-[state=active]:bg-white">
                        <Ticket className="w-4 h-4 mr-2" />
                        Destek Ticketleri
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                
                <TabsContent value="issues" className="m-0">
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {activeIssues.map((issue) => {
                        const priority = priorityConfig[issue.priority];
                        return (
                          <motion.div
                            key={issue.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg ${priority.bg} ${priority.color}`}>
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {issue.title}
                                  </p>
                                  <Badge variant="outline" className={`${priority.bg} ${priority.color} ${priority.border} shrink-0`}>
                                    {issue.priorityLabel}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {issue.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <UserPlus className="w-3.5 h-3.5" />
                                    {issue.assigned}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    <div className="p-4 border-t border-slate-200">
                      <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-700">
                        Tüm Sorunları Görüntüle
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </TabsContent>

                <TabsContent value="tickets" className="m-0">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Ticket ID</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Konu</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Durum</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Atanan</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Oluşturulma</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {supportTickets.map((ticket) => {
                            const status = statusConfig[ticket.status];
                            return (
                              <motion.tr
                                key={ticket.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                              >
                                <td className="py-3 px-4">
                                  <span className="font-mono text-sm text-slate-600">{ticket.id}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {ticket.subject}
                                  </p>
                                  <p className="text-xs text-slate-500">{ticket.customer}</p>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge className={`${status.bg} ${status.color} border-0`}>
                                    {status.label}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                      {ticket.assignedTo.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-sm text-slate-600">{ticket.assignedTo}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-slate-500">
                                  {ticket.created}
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 border-t border-slate-200">
                      <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-700">
                        Tüm Ticketleri Görüntüle
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </TabsContent>
              </Card>
            </Tabs>
          </motion.div>
        </div>

        {/* Sağ Kolon - Kurye Durumu ve Bildirimler */}
        <div className="space-y-6">
          {/* Kurye Durumu Özeti */}
          <motion.div variants={itemVariants}>
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                      <Bike className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Kurye Durumu</CardTitle>
                      <CardDescription>Toplam: {totalCouriers} kurye</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Durum Çubukları */}
                <div className="space-y-4">
                  {courierStatusData.map((status) => (
                    <div key={status.status}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${status.color}`} />
                          <span className="text-sm font-medium text-slate-700">{status.label}</span>
                        </div>
                        <span className={`text-sm font-bold ${status.textColor}`}>{status.count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(status.count / totalCouriers) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full ${status.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Durum Kartları */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-emerald-50 rounded-xl">
                    <Bike className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <p className="text-xl font-bold text-emerald-600">89</p>
                    <p className="text-xs text-emerald-600/70">Aktif</p>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-xl">
                    <Coffee className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                    <p className="text-xl font-bold text-amber-600">12</p>
                    <p className="text-xs text-amber-600/70">Mola</p>
                  </div>
                  <div className="text-center p-3 bg-slate-100 rounded-xl">
                    <Power className="w-6 h-6 text-slate-600 mx-auto mb-1" />
                    <p className="text-xl font-bold text-slate-600">45</p>
                    <p className="text-xs text-slate-500">Çevrimdışı</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Detaylı Rapor
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bildirimler / Uyarılar Paneli */}
          <motion.div variants={itemVariants}>
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Bildirimler</CardTitle>
                      <CardDescription>Son 24 saat</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-rose-100 text-rose-600 border-0">{alerts.length} Yeni</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-lg ${alert.color} bg-opacity-10 shrink-0`}>
                          <alert.icon className={`w-4 h-4 ${alert.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-slate-900 text-sm">{alert.title}</p>
                            <span className="text-xs text-slate-400 shrink-0">{alert.time}</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{alert.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-200">
                  <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-700">
                    Tüm Bildirimler
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hızlı İstatistikler */}
          <motion.div variants={itemVariants}>
            <Card className="border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Bugünün Özeti</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Toplam Sipariş</span>
                    <span className="font-bold text-xl">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Tamamlanan</span>
                    <span className="font-bold text-emerald-400">298</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">İptal</span>
                    <span className="font-bold text-rose-400">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Ort. Teslimat</span>
                    <span className="font-bold">24 dk</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Başarı Oranı</span>
                    <span className="font-bold text-emerald-400">94.2%</span>
                  </div>
                  <Progress value={94.2} className="mt-2 h-2 bg-slate-700" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
