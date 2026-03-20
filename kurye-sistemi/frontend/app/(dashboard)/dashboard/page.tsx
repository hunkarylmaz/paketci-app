'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Bell,
  TrendingUp,
  Users,
  Bike,
  Wallet,
  Target,
  Route,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Zap,
  Thermometer,
  MoreHorizontal,
  Filter,
  Download,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { quickAccessCards } from '@/config/menu.config';
import { UserRole, RoleDescriptions, User } from '@/types/user';

// Yeni profesyonel bileşenler
import ProfessionalMap from '@/components/dashboard/professional-map';
import { 
  DashboardStats, 
  RevenueChart, 
  OrderStatusChart, 
  HourlyActivityChart,
  ZonePerformanceChart,
  CourierPerformanceChart,
  RevenueByCategoryChart
} from '@/components/dashboard/analytics-charts';

// Örnek kullanıcı verisi
const MOCK_USER: User = {
  id: '1',
  email: 'admin@paketci.com',
  firstName: 'Ahmet',
  lastName: 'Yılmaz',
  role: UserRole.COMPANY_ADMIN,
  status: 'active',
  companyName: 'Paketim Dağıtım',
  regionName: 'İstanbul',
  lastLoginAt: '2026-03-21T10:00:00Z',
  createdAt: '2026-01-01T00:00:00Z',
};

// Rol bazlı dashboard içerikleri
const DASHBOARD_CONTENT: Record<UserRole, {
  title: string;
  description: string;
  stats: Array<{ label: string; value: string; change?: string; icon: any; color: string }>;
  alerts?: Array<{ type: 'warning' | 'success' | 'info'; message: string }>;
}> = {
  [UserRole.SUPER_ADMIN]: {
    title: 'Sistem Yöneticisi Dashboard',
    description: 'Tüm sistem genelindeki durumu görüntüleyin',
    stats: [
      { label: 'Toplam Kullanıcı', value: '1,234', change: '+12%', icon: Users, color: '#8b5cf6' },
      { label: 'Aktif Teslimat', value: '567', change: '+5%', icon: Bike, color: '#10b981' },
      { label: 'Günlük Ciro', value: '₺45,678', change: '+8%', icon: Wallet, color: '#3b82f6' },
      { label: 'Sistem Sağlığı', value: '99.9%', change: 'Stabil', icon: CheckCircle2, color: '#06b6d4' },
    ],
    alerts: [
      { type: 'warning', message: '3 sistem güncellemesi bekliyor' },
      { type: 'info', message: 'Yeni 45 restoran kaydı yapıldı' },
    ],
  },
  [UserRole.COMPANY_ADMIN]: {
    title: 'Şirket Yöneticisi Dashboard',
    description: 'Şirket genelindeki performansı takip edin',
    stats: [
      { label: 'Aktif Kullanıcı', value: '456', change: '+8%', icon: Users, color: '#8b5cf6' },
      { label: 'Bugünkü Teslimat', value: '234', icon: Package, color: '#10b981' },
      { label: 'Aylık Gelir', value: '₺234,567', change: '+15%', icon: Wallet, color: '#3b82f6' },
      { label: 'Ort. Teslimat', value: '26 dk', change: '-2 dk', icon: Clock, color: '#f59e0b' },
    ],
    alerts: [
      { type: 'warning', message: '5 fatura ödemesi gecikti' },
      { type: 'success', message: 'Bu ay hedefin %85\'ini tamamladınız' },
    ],
  },
  [UserRole.REGIONAL_MANAGER]: {
    title: 'Bölge Sorumlusu Dashboard',
    description: 'Bölgenizdeki tüm operasyonları yönetin',
    stats: [
      { label: 'Toplam Bayi', value: '23', icon: Users, color: '#8b5cf6' },
      { label: 'Restoran Sayısı', value: '145', change: '+3', icon: Users, color: '#ec4899' },
      { label: 'Aktif Kurye', value: '89', icon: Bike, color: '#10b981' },
      { label: 'Bugünkü Teslimat', value: '456', icon: Route, color: '#3b82f6' },
    ],
    alerts: [
      { type: 'info', message: '3 bayi ziyareti planlandı' },
      { type: 'warning', message: 'Bölge 2\'de gecikme raporu var' },
    ],
  },
  [UserRole.MANAGER]: {
    title: 'Restoran Yönetici Dashboard',
    description: 'Restoranınızın günlük operasyonlarını takip edin',
    stats: [
      { label: 'Aktif Kurye', value: '8', icon: Bike, color: '#10b981' },
      { label: 'Bugünkü Sipariş', value: '45', icon: Package, color: '#3b82f6' },
      { label: 'Ort. Teslimat Süresi', value: '32 dk', icon: Clock, color: '#f59e0b' },
      { label: 'Müşteri Puanı', value: '4.8', change: '+0.2', icon: TrendingUp, color: '#8b5cf6' },
    ],
    alerts: [
      { type: 'info', message: '2 kurye vardiya başladı' },
    ],
  },
  [UserRole.ACCOUNTANT]: {
    title: 'Muhasebe Dashboard',
    description: 'Finansal işlemleri ve raporları yönetin',
    stats: [
      { label: 'Bekleyen Fatura', value: '34', icon: AlertCircle, color: '#ef4444' },
      { label: 'Bu Ay Tahsilat', value: '₺123,456', icon: Wallet, color: '#10b981' },
      { label: 'Gecikmiş Ödeme', value: '₺45,678', icon: Clock, color: '#f59e0b' },
      { label: 'Mutabakat Bekleyen', value: '12', icon: CheckCircle2, color: '#3b82f6' },
    ],
    alerts: [
      { type: 'warning', message: '5 restoranın ödemesi gecikti' },
      { type: 'info', message: 'Yeni fatura dönemi başladı' },
    ],
  },
  [UserRole.FIELD_SALES]: {
    title: 'Saha Satış Dashboard',
    description: 'Hedeflerinizi ve performansınızı takip edin',
    stats: [
      { label: 'Aylık Hedef', value: '15', icon: Target, color: '#3b82f6' },
      { label: 'Tamamlanan', value: '12', change: '%80', icon: CheckCircle2, color: '#10b981' },
      { label: 'Potansiyel', value: '8', icon: Users, color: '#f59e0b' },
      { label: 'Bu Hafta Ziyaret', value: '23', icon: MapPin, color: '#8b5cf6' },
    ],
    alerts: [
      { type: 'success', message: 'Tebrikler! Aylık hedefinize çok yakınsınız' },
      { type: 'info', message: '3 yeni potansiyel restoran atandı' },
    ],
  },
  [UserRole.OPERATIONS_SUPPORT]: {
    title: 'Operasyon Destek Dashboard',
    description: 'Canlı teslimat durumunu ve sorunları izleyin',
    stats: [
      { label: 'Aktif Teslimat', value: '234', icon: Route, color: '#3b82f6' },
      { label: 'Gecikme', value: '12', icon: AlertCircle, color: '#ef4444' },
      { label: 'Çözülen Sorun', value: '45', icon: CheckCircle2, color: '#10b981' },
      { label: 'Bekleyen Destek', value: '8', icon: Bell, color: '#f59e0b' },
    ],
    alerts: [
      { type: 'warning', message: '3 yüksek öncelikli sorun bekliyor' },
      { type: 'info', message: '12 kurye aktif olarak çalışıyor' },
    ],
  },
  [UserRole.DEALER]: {
    title: 'Bayi Dashboard',
    description: 'Restoranlarınız ve performansınızı görüntüleyin',
    stats: [
      { label: 'Restoran Sayım', value: '12', icon: Users, color: '#8b5cf6' },
      { label: 'Aktif Kurye', value: '34', icon: Bike, color: '#10b981' },
      { label: 'Bugünkü Gelir', value: '₺12,345', icon: Wallet, color: '#3b82f6' },
      { label: 'Komisyon', value: '₺1,234', icon: TrendingUp, color: '#f59e0b' },
    ],
    alerts: [
      { type: 'info', message: 'Komisyon ödemesi 3 gün içinde yapılacak' },
    ],
  },
  [UserRole.RESTAURANT]: {
    title: 'Restoran Dashboard',
    description: 'Siparişlerinizi ve teslimatları takip edin',
    stats: [
      { label: 'Aktif Sipariş', value: '5', icon: Package, color: '#3b82f6' },
      { label: 'Bugünkü Satış', value: '₺3,456', icon: Wallet, color: '#10b981' },
      { label: 'Ort. Puan', value: '4.7', icon: TrendingUp, color: '#f59e0b' },
      { label: 'Toplam Teslimat', value: '156', icon: Bike, color: '#8b5cf6' },
    ],
    alerts: [
      { type: 'info', message: '2 yeni sipariş geldi' },
    ],
  },
  [UserRole.COURIER]: {
    title: 'Kurye Dashboard',
    description: 'Görevlerinizi ve kazancınızı takip edin',
    stats: [
      { label: 'Aktif Teslimat', value: '2', icon: Route, color: '#3b82f6' },
      { label: 'Bugünkü Kazanç', value: '₺456', icon: Wallet, color: '#10b981' },
      { label: 'Tamamlanan', value: '23', icon: CheckCircle2, color: '#8b5cf6' },
      { label: 'Puanım', value: '4.9', icon: TrendingUp, color: '#f59e0b' },
    ],
    alerts: [
      { type: 'info', message: 'Yeni teslimat görevi atandı' },
    ],
  },
};

// Animasyon varyantları
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export default function DashboardPage() {
  const user = MOCK_USER;
  const content = DASHBOARD_CONTENT[user.role];
  const quickCards = quickAccessCards[user.role] || [];
  const [activeTab, setActiveTab] = useState('overview');

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
          <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
          <p className="text-gray-500 mt-1">{content.description}</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="secondary" className="px-3 py-1">
              {RoleDescriptions[user.role]}
            </Badge>
            {user.regionName && (
              <Badge variant="outline" className="px-3 py-1">
                <MapPin className="w-3 h-3 mr-1" />
                {user.regionName}
              </Badge>
            )}
            {user.dealerName && (
              <Badge variant="outline" className="px-3 py-1">
                {user.dealerName}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Bu Hafta
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analizler
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapPin className="w-4 h-4" />
              Canlı Harita
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Hızlı Erişim */}
            {quickCards.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickCards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.title}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={card.href}>
                        <Card className="hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
                          <CardContent className="p-5">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                              style={{ backgroundColor: card.color }}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {card.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Hızlı erişim</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.stats.map((stat, index) => {
                const Icon = stat.icon;
                const isPositive = stat.change?.startsWith('+') || stat.change?.includes('dk');
                const isNegative = stat.change?.startsWith('-') && !stat.change?.includes('dk');
                
                return (
                  <motion.div key={stat.label} variants={itemVariants}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            {stat.change && (
                              <div className="flex items-center gap-1 mt-2">
                                {isPositive ? (
                                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                ) : isNegative ? (
                                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                                ) : null}
                                <span className={`text-sm font-medium ${
                                  isPositive ? 'text-emerald-600' : 
                                  isNegative ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                  {stat.change}
                                </span>
                              </div>
                            )}
                          </div>
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${stat.color}20` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: stat.color }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Canlı Harita Önizleme */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        Canlı Operasyon Haritası
                      </CardTitle>
                      <CardDescription>Gerçek zamanlı kurye ve sipariş takibi</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('map')}>
                      Tam Ekran
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  <ProfessionalMap height="400px" />
                </CardContent>
              </Card>
            </motion.div>

            {/* Uyarılar ve Son Aktiviteler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Uyarılar */}
              {content.alerts && content.alerts.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Bildirimler
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {content.alerts.map((alert, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            "p-4 rounded-xl flex items-start gap-3",
                            alert.type === 'warning' && "bg-amber-50 border border-amber-200",
                            alert.type === 'success' && "bg-emerald-50 border border-emerald-200",
                            alert.type === 'info' && "bg-blue-50 border border-blue-200"
                          )}
                        >
                          <AlertCircle className={cn(
                            "w-5 h-5 flex-shrink-0 mt-0.5",
                            alert.type === 'warning' && "text-amber-600",
                            alert.type === 'success' && "text-emerald-600",
                            alert.type === 'info' && "text-blue-600"
                          )} />
                          <p className={cn(
                            "text-sm",
                            alert.type === 'warning' && "text-amber-800",
                            alert.type === 'success' && "text-emerald-800",
                            alert.type === 'info' && "text-blue-800"
                          )}>{alert.message}</p>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Son Aktiviteler */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Son Aktiviteler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { time: '10:30', action: 'Yeni kullanıcı eklendi', user: 'Admin', icon: Users, color: '#8b5cf6' },
                        { time: '10:15', action: 'Teslimat tamamlandı #1234', user: 'Kurye Ahmet', icon: CheckCircle2, color: '#10b981' },
                        { time: '09:45', action: 'Fatura oluşturuldu', user: 'Muhasebe', icon: Wallet, color: '#3b82f6' },
                        { time: '09:30', action: 'Restoran ziyareti kaydedildi', user: 'Saha Satış', icon: MapPin, color: '#f59e0b' },
                      ].map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <motion.div 
                            key={index} 
                            className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${activity.color}20` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: activity.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {activity.action}
                              </p>
                              <p className="text-xs text-gray-500">{activity.user}</p>
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <motion.div variants={itemVariants}>
              <DashboardStats />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <RevenueChart />
              </motion.div>
              <motion.div variants={itemVariants}>
                <OrderStatusChart />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <HourlyActivityChart />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ZonePerformanceChart />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <CourierPerformanceChart />
              </motion.div>
              <motion.div variants={itemVariants}>
                <RevenueByCategoryChart />
              </motion.div>
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map">
            <motion.div variants={itemVariants}>
              <ProfessionalMap height="700px" showHeatmap={true} showRoutes={true} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

// Helper
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
