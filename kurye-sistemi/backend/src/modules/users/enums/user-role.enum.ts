// Yetki seviyeleri (yüksekten düşüğe):
// 1. SUPER_ADMIN - Sistem yöneticisi (tüm yetkiler)
// 2. COMPANY_ADMIN - Şirket yöneticisi
// 3. REGIONAL_MANAGER - Bölge sorumlusu (birden fazla bayi/restoran)
// 4. MANAGER - Restoran/kurye yöneticisi
// 5. ACCOUNTANT - Muhasebe (raporlar, faturalar, ödemeler)
// 6. FIELD_SALES - Saha satış (restoran ekleme, ziyaretler)
// 7. OPERATIONS_SUPPORT - Operasyon destek (teslimat takibi, sorun çözme)
// 8. DEALER - Bayi (kendi altındaki restoranları yönetir)
// 9. RESTAURANT - Restoran kullanıcısı
// 10. COURIER - Kurye

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  COMPANY_ADMIN = 'company_admin',
  REGIONAL_MANAGER = 'regional_manager',
  MANAGER = 'manager',
  ACCOUNTANT = 'accountant',
  FIELD_SALES = 'field_sales',
  OPERATIONS_SUPPORT = 'operations_support',
  DEALER = 'dealer',
  RESTAURANT = 'restaurant',
  COURIER = 'courier',
}

// Rol seviyeleri (yetki kontrolü için)
export enum RoleLevel {
  SUPER_ADMIN = 100,
  COMPANY_ADMIN = 90,
  REGIONAL_MANAGER = 80,
  MANAGER = 70,
  ACCOUNTANT = 60,
  FIELD_SALES = 60,
  OPERATIONS_SUPPORT = 60,
  DEALER = 50,
  RESTAURANT = 40,
  COURIER = 10,
}

// Rol bazlı yetki kontrolü
export const RolePermissions = {
  [UserRole.SUPER_ADMIN]: ['*'], // Tüm yetkiler
  [UserRole.COMPANY_ADMIN]: [
    'users.manage',
    'companies.manage',
    'regions.manage',
    'reports.view',
    'settings.manage',
    'finance.view',
    'deliveries.view',
    'restaurants.manage',
    'couriers.manage',
  ],
  [UserRole.REGIONAL_MANAGER]: [
    'region.view',
    'region.deliveries',
    'region.restaurants',
    'region.couriers',
    'region.reports',
    'region.analytics',
    'dealers.manage', // Kendi bölgesindeki bayiler
    'support.escalate',
  ],
  [UserRole.MANAGER]: [
    'restaurant.view',
    'restaurant.deliveries',
    'couriers.assign',
    'deliveries.create',
    'shifts.manage',
    'reports.view',
  ],
  [UserRole.ACCOUNTANT]: [
    'finance.view',
    'finance.reports',
    'invoices.view',
    'invoices.create',
    'payments.view',
    'payments.process',
    'credits.view',
    'settlements.view',
    'reports.financial',
    'excel.export',
    'restaurant.billing',
  ],
  [UserRole.FIELD_SALES]: [
    'restaurants.create',
    'restaurants.visit',
    'restaurants.update',
    'contracts.manage',
    'proposals.create',
    'leads.manage',
    'map.view',
    'analytics.sales',
    'commission.view',
  ],
  [UserRole.OPERATIONS_SUPPORT]: [
    'deliveries.monitor',
    'deliveries.track',
    'issues.resolve',
    'couriers.support',
    'restaurants.support',
    'live.chat',
    'notifications.send',
    'shifts.monitor',
    'map.live',
    'emergency.handle',
  ],
  [UserRole.DEALER]: [
    'dealer.restaurants',
    'dealer.couriers',
    'dealer.deliveries',
    'dealer.reports',
    'dealer.commission',
    'restaurants.manage.own',
    'couriers.manage.own',
    'deliveries.view.own',
    'finance.view.own',
  ],
  [UserRole.RESTAURANT]: [
    'restaurant.own',
    'orders.create',
    'orders.view',
    'deliveries.view',
    'couriers.view',
    'reports.own',
    'settings.own',
  ],
  [UserRole.COURIER]: [
    'deliveries.own',
    'profile.view',
    'earnings.view',
    'shifts.own',
    'location.update',
    'balance.view',
  ],
};

// Rol açıklamaları
export const RoleDescriptions = {
  [UserRole.SUPER_ADMIN]: 'Sistem Yöneticisi - Tüm yetkilere sahip',
  [UserRole.COMPANY_ADMIN]: 'Şirket Yöneticisi - Şirket geneli yönetim',
  [UserRole.REGIONAL_MANAGER]: 'Bölge Sorumlusu - Bölgedeki tüm operasyonlar',
  [UserRole.MANAGER]: 'Yönetici - Restoran ve kurye yönetimi',
  [UserRole.ACCOUNTANT]: 'Muhasebe - Finansal işlemler ve raporlar',
  [UserRole.FIELD_SALES]: 'Saha Satış - Restoran kazanım ve ziyaretler',
  [UserRole.OPERATIONS_SUPPORT]: 'Operasyon Destek - Teslimat takibi ve sorun çözme',
  [UserRole.DEALER]: 'Bayi - Alt restoranları yönetir',
  [UserRole.RESTAURANT]: 'Restoran - Restoran paneli kullanıcısı',
  [UserRole.COURIER]: 'Kurye - Mobil uygulama kullanıcısı',
};

// Rol renkleri (UI için)
export const RoleColors = {
  [UserRole.SUPER_ADMIN]: '#DC2626', // Kırmızı
  [UserRole.COMPANY_ADMIN]: '#7C3AED', // Mor
  [UserRole.REGIONAL_MANAGER]: '#2563EB', // Mavi
  [UserRole.MANAGER]: '#059669', // Yeşil
  [UserRole.ACCOUNTANT]: '#D97706', // Turuncu
  [UserRole.FIELD_SALES]: '#0891B2', // Cam göbeği
  [UserRole.OPERATIONS_SUPPORT]: '#7C3AED', // Mor (benzer)
  [UserRole.DEALER]: '#BE185D', // Pembe
  [UserRole.RESTAURANT]: '#4338CA', // İndigo
  [UserRole.COURIER]: '#0891B2', // Cam göbeği
};
