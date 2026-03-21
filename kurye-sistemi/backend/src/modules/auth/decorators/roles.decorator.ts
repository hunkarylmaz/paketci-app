import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

// Rol bazlı yetkilendirme
export const Roles = (...roles: UserRole[]): CustomDecorator<string> => SetMetadata(ROLES_KEY, roles);

// İzin bazlı yetkilendirme
export const Permissions = (...permissions: string[]): CustomDecorator<string> => SetMetadata(PERMISSIONS_KEY, permissions);

// Minimum yetki seviyesi
export const MIN_LEVEL_KEY = 'minLevel';
export const MinLevel = (level: number): CustomDecorator<string> => SetMetadata(MIN_LEVEL_KEY, level);

// Rol kombinasyonları (pratik kullanım için) - Factory functions
export const AdminRoles = (): CustomDecorator<string> => Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
);

export const ManagementRoles = (): CustomDecorator<string> => Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.REGIONAL_MANAGER,
  UserRole.MANAGER,
);

export const FinanceRoles = (): CustomDecorator<string> => Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.ACCOUNTANT,
);

export const SalesRoles = (): CustomDecorator<string> => Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.FIELD_SALES,
  UserRole.REGIONAL_MANAGER,
);

export const OperationsRoles = (): CustomDecorator<string> => Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.OPERATIONS_SUPPORT,
  UserRole.REGIONAL_MANAGER,
  UserRole.MANAGER,
);

export const DealerRoles = (): CustomDecorator<string> => Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.DEALER,
);

// Tüm admin rolleri (CRUD işlemleri için)
export const AllAdminRoles = (): CustomDecorator<string> => Roles(
  UserRole.SUPER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.REGIONAL_MANAGER,
  UserRole.MANAGER,
  UserRole.DEALER,
);
