// Kullanıcı rolleri
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

// Rol seviyeleri
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

// Rol açıklamaları
export const RoleDescriptions: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Sistem Yöneticisi',
  [UserRole.COMPANY_ADMIN]: 'Şirket Yöneticisi',
  [UserRole.REGIONAL_MANAGER]: 'Bölge Sorumlusu',
  [UserRole.MANAGER]: 'Yönetici',
  [UserRole.ACCOUNTANT]: 'Muhasebe',
  [UserRole.FIELD_SALES]: 'Saha Satış',
  [UserRole.OPERATIONS_SUPPORT]: 'Operasyon Destek',
  [UserRole.DEALER]: 'Bayi',
  [UserRole.RESTAURANT]: 'Restoran',
  [UserRole.COURIER]: 'Kurye',
};

// Rol renkleri
export const RoleColors: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'bg-red-100 text-red-800 border-red-200',
  [UserRole.COMPANY_ADMIN]: 'bg-purple-100 text-purple-800 border-purple-200',
  [UserRole.REGIONAL_MANAGER]: 'bg-blue-100 text-blue-800 border-blue-200',
  [UserRole.MANAGER]: 'bg-green-100 text-green-800 border-green-200',
  [UserRole.ACCOUNTANT]: 'bg-orange-100 text-orange-800 border-orange-200',
  [UserRole.FIELD_SALES]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  [UserRole.OPERATIONS_SUPPORT]: 'bg-violet-100 text-violet-800 border-violet-200',
  [UserRole.DEALER]: 'bg-pink-100 text-pink-800 border-pink-200',
  [UserRole.RESTAURANT]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [UserRole.COURIER]: 'bg-teal-100 text-teal-800 border-teal-200',
};

// Kullanıcı tipi
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  companyId?: string;
  companyName?: string;
  // Yeni yetki alanları
  regionId?: string;
  regionName?: string;
  dealerId?: string;
  dealerName?: string;
  territoryId?: string;
  territoryName?: string;
  department?: string;
  assignedRestaurantIds?: string[];
  assignedDealerIds?: string[];
  monthlyTarget?: number;
  monthlyVisitsTarget?: number;
  lastLoginAt?: string;
  createdAt: string;
}
