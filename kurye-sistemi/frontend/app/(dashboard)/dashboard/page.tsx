'use client';

import Link from 'next/link';
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
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { quickAccessCards } from '@/config/menu.config';
import { UserRole, RoleDescriptions, User } from '@/types/user';

// Örnek kullanıcı verisi (gerçekte API'den gelecek)
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
  stats: Array<{ label: string; value: string; change?: string; icon: any }>;
  alerts?: Array<{ type: 'warning' | 'success' | 'info'; message: string }>;
}> = {
  [UserRole.SUPER_ADMIN]: {
    title: 'Sistem Yöneticisi Dashboard',
    description: 'Tüm sistem genelindeki durumu görüntüleyin',
    stats: [
      { label: 'Toplam Kullanıcı', value: '1,234', change: '+12%', icon: Users },
      { label: 'Aktif Teslimat', value: '567', change: '+5%', icon: Bike },
      { label: 'Günlük Ciro', value: '₺45,678', change: '+8%', icon: Wallet },
      { label: 'Sistem Sağlığı', value: '99.9%', change: 'Stabil', icon: CheckCircle2 },
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
      { label: 'Aktif Kullanıcı', value: '456', change: '+8%', icon: Users },
      { label: 'Bugünkü Teslimat', value: '234', icon: Bike },
      { label: 'Aylık Gelir', value: '₺234,567', change: '+15%', icon: Wallet },
      { label: 'Bekleyen Ödeme', value: '12', icon: Clock },
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
      { label: 'Toplam Bayi', value: '23', icon: Users },
      { label: 'Restoran Sayısı', value: '145', change: '+3', icon: Users },
      { label: 'Aktif Kurye', value: '89', icon: Bike },
      { label: 'Bugünkü Teslimat', value: '456', icon: Route },
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
      { label: 'Aktif Kurye', value: '8', icon: Bike },
      { label: 'Bugünkü Sipariş', value: '45', icon: LayoutDashboard },
      { label: 'Ort. Teslimat Süresi', value: '32 dk', icon: Clock },
      { label: 'Müşteri Puanı', value: '4.8', change: '+0.2', icon: TrendingUp },
    ],
    alerts: [
      { type: 'info', message: '2 kurye vardiya başladı' },
    ],
  },
  [UserRole.ACCOUNTANT]: {
    title: 'Muhasebe Dashboard',
    description: 'Finansal işlemleri ve raporları yönetin',
    stats: [
      { label: 'Bekleyen Fatura', value: '34', icon: AlertCircle },
      { label: 'Bu Ay Tahsilat', value: '₺123,456', icon: Wallet },
      { label: 'Gecikmiş Ödeme', value: '₺45,678', icon: Clock },
      { label: 'Mutabakat Bekleyen', value: '12', icon: CheckCircle2 },
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
      { label: 'Aylık Hedef', value: '15', icon: Target },
      { label: 'Tamamlanan', value: '12', change: '%80', icon: CheckCircle2 },
      { label: 'Potansiyel', value: '8', icon: Users },
      { label: 'Bu Hafta Ziyaret', value: '23', icon: LayoutDashboard },
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
      { label: 'Aktif Teslimat', value: '234', icon: Route },
      { label: 'Gecikme', value: '12', icon: AlertCircle },
      { label: 'Çözülen Sorun', value: '45', icon: CheckCircle2 },
      { label: 'Bekleyen Destek', value: '8', icon: Bell },
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
      { label: 'Restoran Sayım', value: '12', icon: Users },
      { label: 'Aktif Kurye', value: '34', icon: Bike },
      { label: 'Bugünkü Gelir', value: '₺12,345', icon: Wallet },
      { label: 'Komisyon', value: '₺1,234', icon: TrendingUp },
    ],
    alerts: [
      { type: 'info', message: 'Komisyon ödemesi 3 gün içinde yapılacak' },
    ],
  },
  [UserRole.RESTAURANT]: {
    title: 'Restoran Dashboard',
    description: 'Siparişlerinizi ve teslimatları takip edin',
    stats: [
      { label: 'Aktif Sipariş', value: '5', icon: LayoutDashboard },
      { label: 'Bugünkü Satış', value: '₺3,456', icon: Wallet },
      { label: 'Ort. Puan', value: '4.7', icon: TrendingUp },
      { label: 'Toplam Teslimat', value: '156', icon: Bike },
    ],
    alerts: [
      { type: 'info', message: '2 yeni sipariş geldi' },
    ],
  },
  [UserRole.COURIER]: {
    title: 'Kurye Dashboard',
    description: 'Görevlerinizi ve kazancınızı takip edin',
    stats: [
      { label: 'Aktif Teslimat', value: '2', icon: Route },
      { label: 'Bugünkü Kazanç', value: '₺456', icon: Wallet },
      { label: 'Tamamlanan', value: '23', icon: CheckCircle2 },
      { label: 'Puanım', value: '4.9', icon: TrendingUp },
    ],
    alerts: [
      { type: 'info', message: 'Yeni teslimat görevi atandı' },
    ],
  },
};

export default function DashboardPage() {
  const user = MOCK_USER; // Gerçekte bu API'den gelecek
  const content = DASHBOARD_CONTENT[user.role];
  const quickCards = quickAccessCards[user.role] || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
        <p className="text-gray-500 mt-1">{content.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary">{RoleDescriptions[user.role]}</Badge>
          {user.regionName && <Badge variant="outline">📍 {user.regionName}</Badge>}
          {user.dealerName && <Badge variant="outline">🏢 {user.dealerName}</Badge>}
        </div>
      </div>

      {/* Hızlı Erişim Kartları */}
      {quickCards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", card.color)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-medium text-gray-900">{card.title}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {content.stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  {stat.change && (
                    <span className={cn(
                      "text-sm mb-1",
                      stat.change.startsWith('+') ? "text-green-600" : 
                      stat.change.startsWith('-') ? "text-red-600" : "text-gray-500"
                    )}>
                      {stat.change}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Uyarılar */}
      {content.alerts && content.alerts.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Bildirimler</h2>
          {content.alerts.map((alert, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg flex items-start gap-3",
                alert.type === 'warning' && "bg-yellow-50 border border-yellow-200",
                alert.type === 'success' && "bg-green-50 border border-green-200",
                alert.type === 'info' && "bg-blue-50 border border-blue-200"
              )}
            >
              <AlertCircle className={cn(
                "w-5 h-5 flex-shrink-0 mt-0.5",
                alert.type === 'warning' && "text-yellow-600",
                alert.type === 'success' && "text-green-600",
                alert.type === 'info' && "text-blue-600"
              )} />
              <p className={cn(
                "text-sm",
                alert.type === 'warning' && "text-yellow-800",
                alert.type === 'success' && "text-green-800",
                alert.type === 'info' && "text-blue-800"
              )}>{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Son Aktiviteler */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '10:30', action: 'Yeni kullanıcı eklendi', user: 'Admin' },
              { time: '10:15', action: 'Teslimat tamamlandı #1234', user: 'Kurye Ahmet' },
              { time: '09:45', action: 'Fatura oluşturuldu', user: 'Muhasebe' },
              { time: '09:30', action: 'Restoran ziyareti kaydedildi', user: 'Saha Satış' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0">
                <span className="text-sm text-gray-400 w-12">{activity.time}</span>
                <span className="flex-1 text-sm">{activity.action}</span>
                <Badge variant="secondary" className="text-xs">{activity.user}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
