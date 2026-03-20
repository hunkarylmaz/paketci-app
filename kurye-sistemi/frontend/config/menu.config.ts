import { 
  LayoutDashboard, Users, Bike, Store, MapPin, Building2,
  Wallet, Receipt, TrendingUp, ClipboardList, Headphones, 
  BarChart3, Settings, Bell, Route, UserCheck, FileText,
  PieChart, Landmark, Briefcase, Target, PhoneCall, Clock,
  DollarSign, Package, AlertCircle, CheckCircle, Map,
  Calendar, CreditCard, FileSignature, Flag, Home
} from 'lucide-react';
import { UserRole } from '@/types/user';

export interface MenuItem {
  label: string;
  href: string;
  icon: any;
  roles: UserRole[];
  badge?: string;
  children?: MenuItem[];
}

// ==================== TÜM MENÜ YAPISI ====================
export const menuItems: MenuItem[] = [
  // === HERKESE AÇIK ===
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: Object.values(UserRole),
  },
  {
    label: 'Profilim',
    href: '/profile',
    icon: UserCheck,
    roles: Object.values(UserRole),
  },

  // === YÖNETİM ===
  {
    label: 'Kullanıcı Yönetimi',
    href: '/admin/users',
    icon: Users,
    roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.MANAGER],
    children: [
      { label: 'Tüm Kullanıcılar', href: '/admin/users', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER] },
      { label: 'Bölge Sorumluları', href: '/admin/users/regional-managers', icon: MapPin, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
      { label: 'Bayiler', href: '/admin/users/dealers', icon: Building2, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER] },
      { label: 'Yöneticiler', href: '/admin/users/managers', icon: UserCheck, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
      { label: 'Vardiya Planı', href: '/admin/shifts', icon: Calendar, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
    ],
  },

  // === BÖLGE YÖNETİMİ ===
  {
    label: 'Bölge Yönetimi',
    href: '/regional',
    icon: MapPin,
    roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER],
    children: [
      { label: 'Bölge Dashboard', href: '/regional/dashboard', icon: BarChart3, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER] },
      { label: 'Bölgeler', href: '/regional/regions', icon: Map, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
      { label: 'Territory', href: '/regional/territories', icon: Flag, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER] },
      { label: 'Bayi Yönetimi', href: '/regional/dealers', icon: Building2, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER] },
      { label: 'Restoranlar', href: '/regional/restaurants', icon: Store, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER] },
      { label: 'Kuryeler', href: '/regional/couriers', icon: Bike, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER] },
      { label: 'Alt Çalışanlar', href: '/regional/subordinates', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.MANAGER] },
      { label: 'Bölge Raporu', href: '/regional/reports', icon: FileText, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER] },
    ],
  },

  // === BAYİ PANELİ ===
  {
    label: 'Bayi Paneli',
    href: '/dealer',
    icon: Building2,
    roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.DEALER],
    children: [
      { label: 'Dashboard', href: '/dealer/dashboard', icon: PieChart, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.DEALER] },
      { label: 'Restoranlarım', href: '/dealer/restaurants', icon: Store, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.DEALER] },
      { label: 'Kuryelerim', href: '/dealer/couriers', icon: Bike, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.DEALER] },
      { label: 'Teslimatlar', href: '/dealer/deliveries', icon: Route, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.DEALER] },
      { label: 'Komisyon Raporu', href: '/dealer/commission', icon: TrendingUp, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.DEALER] },
      { label: 'Sözleşmeler', href: '/dealer/contracts', icon: FileSignature, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.DEALER] },
    ],
  },

  // === SAHA SATIŞ ===
  {
    label: 'Saha Satış',
    href: '/field-sales',
    icon: Briefcase,
    roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES, UserRole.REGIONAL_MANAGER],
    children: [
      { label: 'Dashboard', href: '/field-sales/dashboard', icon: Target, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES, UserRole.REGIONAL_MANAGER] },
      { label: 'Potansiyel Müşteriler', href: '/field-sales/leads', icon: Store, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES] },
      { label: 'Ziyaretler', href: '/field-sales/visits', icon: MapPin, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES] },
      { label: 'Sözleşmeler', href: '/field-sales/contracts', icon: FileSignature, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES] },
      { label: 'Teklifler', href: '/field-sales/proposals', icon: TrendingUp, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES] },
      { label: 'Harita', href: '/field-sales/map', icon: Map, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES] },
      { label: 'Satış Raporu', href: '/field-sales/reports', icon: BarChart3, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES, UserRole.REGIONAL_MANAGER] },
    ],
  },

  // === MUHASEBE ===
  {
    label: 'Muhasebe',
    href: '/accounting',
    icon: Landmark,
    roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT],
    children: [
      { label: 'Dashboard', href: '/accounting/dashboard', icon: PieChart, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT] },
      { label: 'Faturalar', href: '/accounting/invoices', icon: Receipt, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT] },
      { label: 'Ödemeler', href: '/accounting/payments', icon: CreditCard, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT] },
      { label: 'Restoran Borçları', href: '/accounting/restaurant-debts', icon: FileText, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT] },
      { label: 'Kurye Ödemeleri', href: '/accounting/courier-payments', icon: Bike, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT] },
      { label: 'Bayi Komisyonları', href: '/accounting/dealer-commissions', icon: Building2, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT] },
      { label: 'Krediler', href: '/accounting/credits', icon: TrendingUp, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT] },
      { label: 'Finansal Raporlar', href: '/accounting/reports', icon: BarChart3, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT] },
      { label: 'Mutabakatlar', href: '/accounting/reconciliations', icon: CheckCircle, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT] },
    ],
  },

  // === OPERASYON DESTEK ===
  {
    label: 'Operasyon',
    href: '/operations',
    icon: Headphones,
    roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.OPERATIONS_SUPPORT, UserRole.REGIONAL_MANAGER],
    children: [
      { label: 'Dashboard', href: '/operations/dashboard', icon: PieChart, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.OPERATIONS_SUPPORT] },
      { label: 'Canlı Takip', href: '/operations/live', icon: Route, badge: 'LIVE', roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.OPERATIONS_SUPPORT, UserRole.REGIONAL_MANAGER] },
      { label: 'Aktif Teslimatlar', href: '/operations/deliveries', icon: Bike, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.OPERATIONS_SUPPORT, UserRole.REGIONAL_MANAGER] },
      { label: 'Sorunlar', href: '/operations/issues', icon: AlertCircle, badge: 'YENİ', roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.OPERATIONS_SUPPORT] },
      { label: 'Destek Talepleri', href: '/operations/support', icon: PhoneCall, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.OPERATIONS_SUPPORT] },
      { label: 'Kurye Destek', href: '/operations/courier-support', icon: UserCheck, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.OPERATIONS_SUPPORT] },
      { label: 'Vardiya Takibi', href: '/operations/shifts', icon: Calendar, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.OPERATIONS_SUPPORT, UserRole.REGIONAL_MANAGER] },
    ],
  },

  // === RESTORAN ===
  {
    label: 'Restoran',
    href: '/restaurant',
    icon: Store,
    roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.RESTAURANT, UserRole.MANAGER],
    children: [
      { label: 'Dashboard', href: '/restaurant/dashboard', icon: PieChart, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.RESTAURANT, UserRole.MANAGER] },
      { label: 'Siparişler', href: '/restaurant/orders', icon: ClipboardList, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.RESTAURANT, UserRole.MANAGER] },
      { label: 'Yeni Sipariş', href: '/restaurant/orders/new', icon: Package, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.RESTAURANT, UserRole.MANAGER] },
      { label: 'Teslimatlar', href: '/restaurant/deliveries', icon: Bike, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.RESTAURANT, UserRole.MANAGER] },
      { label: 'Kuryeler', href: '/restaurant/couriers', icon: UserCheck, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.RESTAURANT, UserRole.MANAGER] },
      { label: 'Faturalar', href: '/restaurant/invoices', icon: Receipt, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.RESTAURANT, UserRole.MANAGER] },
      { label: 'Raporlar', href: '/restaurant/reports', icon: BarChart3, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.RESTAURANT, UserRole.MANAGER] },
      { label: 'Ayarlar', href: '/restaurant/settings', icon: Settings, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.RESTAURANT, UserRole.MANAGER] },
    ],
  },

  // === KURYE ===
  {
    label: 'Kurye',
    href: '/courier',
    icon: Bike,
    roles: [UserRole.COURIER],
    children: [
      { label: 'Dashboard', href: '/courier/dashboard', icon: Home, roles: [UserRole.COURIER] },
      { label: 'Aktif Teslimat', href: '/courier/active', icon: Route, badge: 'LIVE', roles: [UserRole.COURIER] },
      { label: 'Yeni Siparişler', href: '/courier/available', icon: Package, roles: [UserRole.COURIER] },
      { label: 'Geçmiş', href: '/courier/history', icon: ClipboardList, roles: [UserRole.COURIER] },
      { label: 'Kazançlarım', href: '/courier/earnings', icon: Wallet, roles: [UserRole.COURIER] },
      { label: 'Vardiya', href: '/courier/shift', icon: Clock, roles: [UserRole.COURIER] },
      { label: 'Harita', href: '/courier/map', icon: Map, roles: [UserRole.COURIER] },
    ],
  },

  // === GENEL AYARLAR (Sadece Admin) ===
  {
    label: 'Sistem Ayarları',
    href: '/admin/settings',
    icon: Settings,
    roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN],
  },
];

// ==================== ROL BAZLI MENÜ FİLTRELEME ====================
export function getMenuForRole(userRole: UserRole, isSuperAdmin = false): MenuItem[] {
  if (isSuperAdmin || userRole === UserRole.SUPER_ADMIN) {
    return menuItems;
  }

  return menuItems
    .filter(item => item.roles.includes(userRole))
    .map(item => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => child.roles.includes(userRole)),
        };
      }
      return item;
    });
}

// ==================== HIZLI ERİŞİM KARTLARI ====================
export const quickAccessCards: Record<UserRole, Array<{ title: string; href: string; icon: any; color: string; badge?: string }>> = {
  [UserRole.SUPER_ADMIN]: [
    { title: 'Kullanıcılar', href: '/admin/users', icon: Users, color: 'bg-red-500' },
    { title: 'Canlı Takip', href: '/operations/live', icon: Route, color: 'bg-green-500', badge: 'LIVE' },
    { title: 'Finansal Rapor', href: '/accounting/reports', icon: TrendingUp, color: 'bg-blue-500' },
    { title: 'Sistem Ayarları', href: '/admin/settings', icon: Settings, color: 'bg-gray-700' },
  ],
  [UserRole.COMPANY_ADMIN]: [
    { title: 'Kullanıcılar', href: '/admin/users', icon: Users, color: 'bg-purple-500' },
    { title: 'Bölgeler', href: '/regional/dashboard', icon: MapPin, color: 'bg-blue-500' },
    { title: 'Muhasebe', href: '/accounting/dashboard', icon: Landmark, color: 'bg-orange-500' },
    { title: 'Operasyon', href: '/operations/live', icon: Headphones, color: 'bg-violet-500', badge: 'LIVE' },
  ],
  [UserRole.REGIONAL_MANAGER]: [
    { title: 'Bölge Dashboard', href: '/regional/dashboard', icon: BarChart3, color: 'bg-blue-500' },
    { title: 'Bayilerim', href: '/regional/dealers', icon: Building2, color: 'bg-pink-500' },
    { title: 'Restoranlar', href: '/regional/restaurants', icon: Store, color: 'bg-indigo-500' },
    { title: 'Canlı Takip', href: '/operations/live', icon: Route, color: 'bg-green-500', badge: 'LIVE' },
  ],
  [UserRole.MANAGER]: [
    { title: 'Restoran', href: '/restaurant/dashboard', icon: Store, color: 'bg-green-500' },
    { title: 'Yeni Sipariş', href: '/restaurant/orders/new', icon: Package, color: 'bg-blue-500' },
    { title: 'Kuryeler', href: '/restaurant/couriers', icon: Bike, color: 'bg-teal-500' },
    { title: 'Teslimatlar', href: '/restaurant/deliveries', icon: Route, color: 'bg-purple-500' },
  ],
  [UserRole.ACCOUNTANT]: [
    { title: 'Faturalar', href: '/accounting/invoices', icon: Receipt, color: 'bg-orange-500' },
    { title: 'Ödemeler', href: '/accounting/payments', icon: CreditCard, color: 'bg-green-500' },
    { title: 'Borçlar', href: '/accounting/restaurant-debts', icon: FileText, color: 'bg-red-500' },
    { title: 'Raporlar', href: '/accounting/reports', icon: BarChart3, color: 'bg-blue-500' },
  ],
  [UserRole.FIELD_SALES]: [
    { title: 'Hedeflerim', href: '/field-sales/dashboard', icon: Target, color: 'bg-cyan-500' },
    { title: 'Potansiyeller', href: '/field-sales/leads', icon: Store, color: 'bg-blue-500' },
    { title: 'Ziyaretler', href: '/field-sales/visits', icon: MapPin, color: 'bg-green-500' },
    { title: 'Harita', href: '/field-sales/map', icon: Map, color: 'bg-purple-500' },
  ],
  [UserRole.OPERATIONS_SUPPORT]: [
    { title: 'Canlı Takip', href: '/operations/live', icon: Route, color: 'bg-red-500', badge: 'LIVE' },
    { title: 'Sorunlar', href: '/operations/issues', icon: AlertCircle, color: 'bg-orange-500' },
    { title: 'Teslimatlar', href: '/operations/deliveries', icon: Bike, color: 'bg-blue-500' },
    { title: 'Destek', href: '/operations/support', icon: PhoneCall, color: 'bg-green-500' },
  ],
  [UserRole.DEALER]: [
    { title: 'Restoranlarım', href: '/dealer/restaurants', icon: Store, color: 'bg-pink-500' },
    { title: 'Kuryelerim', href: '/dealer/couriers', icon: Bike, color: 'bg-teal-500' },
    { title: 'Teslimatlar', href: '/dealer/deliveries', icon: Route, color: 'bg-blue-500' },
    { title: 'Komisyon', href: '/dealer/commission', icon: TrendingUp, color: 'bg-green-500' },
  ],
  [UserRole.RESTAURANT]: [
    { title: 'Yeni Sipariş', href: '/restaurant/orders/new', icon: Package, color: 'bg-green-500' },
    { title: 'Siparişlerim', href: '/restaurant/orders', icon: Store, color: 'bg-blue-500' },
    { title: 'Teslimatlar', href: '/restaurant/deliveries', icon: Bike, color: 'bg-teal-500' },
    { title: 'Faturalar', href: '/restaurant/invoices', icon: Receipt, color: 'bg-orange-500' },
  ],
  [UserRole.COURIER]: [
    { title: 'Aktif', href: '/courier/active', icon: Route, color: 'bg-green-500' },
    { title: 'Yeni İş', href: '/courier/available', icon: Package, color: 'bg-blue-500' },
    { title: 'Kazanç', href: '/courier/earnings', icon: Wallet, color: 'bg-amber-500' },
    { title: 'Geçmiş', href: '/courier/history', icon: ClipboardList, color: 'bg-gray-500' },
  ],
};
