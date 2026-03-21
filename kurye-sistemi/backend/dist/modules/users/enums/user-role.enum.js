"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleColors = exports.RoleDescriptions = exports.RolePermissions = exports.RoleLevel = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["COMPANY_ADMIN"] = "company_admin";
    UserRole["REGIONAL_MANAGER"] = "regional_manager";
    UserRole["MANAGER"] = "manager";
    UserRole["ACCOUNTANT"] = "accountant";
    UserRole["FIELD_SALES"] = "field_sales";
    UserRole["OPERATIONS_SUPPORT"] = "operations_support";
    UserRole["DEALER"] = "dealer";
    UserRole["RESTAURANT"] = "restaurant";
    UserRole["COURIER"] = "courier";
})(UserRole || (exports.UserRole = UserRole = {}));
var RoleLevel;
(function (RoleLevel) {
    RoleLevel[RoleLevel["SUPER_ADMIN"] = 100] = "SUPER_ADMIN";
    RoleLevel[RoleLevel["COMPANY_ADMIN"] = 90] = "COMPANY_ADMIN";
    RoleLevel[RoleLevel["REGIONAL_MANAGER"] = 80] = "REGIONAL_MANAGER";
    RoleLevel[RoleLevel["MANAGER"] = 70] = "MANAGER";
    RoleLevel[RoleLevel["ACCOUNTANT"] = 60] = "ACCOUNTANT";
    RoleLevel[RoleLevel["FIELD_SALES"] = 60] = "FIELD_SALES";
    RoleLevel[RoleLevel["OPERATIONS_SUPPORT"] = 60] = "OPERATIONS_SUPPORT";
    RoleLevel[RoleLevel["DEALER"] = 50] = "DEALER";
    RoleLevel[RoleLevel["RESTAURANT"] = 40] = "RESTAURANT";
    RoleLevel[RoleLevel["COURIER"] = 10] = "COURIER";
})(RoleLevel || (exports.RoleLevel = RoleLevel = {}));
exports.RolePermissions = {
    [UserRole.SUPER_ADMIN]: ['*'],
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
        'dealers.manage',
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
exports.RoleDescriptions = {
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
exports.RoleColors = {
    [UserRole.SUPER_ADMIN]: '#DC2626',
    [UserRole.COMPANY_ADMIN]: '#7C3AED',
    [UserRole.REGIONAL_MANAGER]: '#2563EB',
    [UserRole.MANAGER]: '#059669',
    [UserRole.ACCOUNTANT]: '#D97706',
    [UserRole.FIELD_SALES]: '#0891B2',
    [UserRole.OPERATIONS_SUPPORT]: '#7C3AED',
    [UserRole.DEALER]: '#BE185D',
    [UserRole.RESTAURANT]: '#4338CA',
    [UserRole.COURIER]: '#0891B2',
};
//# sourceMappingURL=user-role.enum.js.map