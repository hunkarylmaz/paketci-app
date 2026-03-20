import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

// Rol bazlı yetkilendirme
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// İzin bazlı yetkilendirme
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

// Minimum yetki seviyesi
export const MIN_LEVEL_KEY = 'minLevel';
export const MinLevel = (level: number) => SetMetadata(MIN_LEVEL_KEY, level);

// Rol kombinasyonları (pratik kullanım için)
export const AdminRoles = Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
);

export const ManagementRoles = Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.REGIONAL_MANAGER,
  UserRole.MANAGER,
);

export const FinanceRoles = Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.ACCOUNTANT,
);

export const SalesRoles = Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.FIELD_SALES,
  UserRole.REGIONAL_MANAGER,
);

export const OperationsRoles = Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.OPERATIONS_SUPPORT,
  UserRole.REGIONAL_MANAGER,
  UserRole.MANAGER,
);

export const DealerRoles = Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.DEALER,
);

// Tüm admin rolleri (CRUD işlemleri için)
export const AllAdminRoles = Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.REGIONAL_MANAGER,
  UserRole.MANAGER,
  UserRole.DEALER,
);
