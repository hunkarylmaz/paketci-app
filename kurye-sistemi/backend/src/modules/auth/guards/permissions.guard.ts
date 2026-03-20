import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, PERMISSIONS_KEY, MIN_LEVEL_KEY } from '../decorators/roles.decorator';
import { UserRole, RoleLevel, RolePermissions } from '../../users/enums/user-role.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const minLevel = this.reflector.getAllAndOverride<number>(MIN_LEVEL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions && !minLevel) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Kullanıcı bilgisi bulunamadı');
    }

    // Rol kontrolü
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(user.role);
      if (!hasRole) {
        throw new ForbiddenException(
          `Bu işlem için yetkiniz yok. Gereken roller: ${requiredRoles.join(', ')}`
        );
      }
    }

    // Seviye kontrolü
    if (minLevel) {
      const userLevel = RoleLevel[user.role] || 0;
      if (userLevel < minLevel) {
        throw new ForbiddenException(
          `Bu işlem için yeterli yetki seviyeniz yok. Gereken seviye: ${minLevel}`
        );
      }
    }

    // İzin kontrolü
    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions = RolePermissions[user.role] || [];
      const hasAllPermissions = requiredPermissions.every(
        permission => userPermissions.includes(permission) || userPermissions.includes('*')
      );
      
      if (!hasAllPermissions) {
        throw new ForbiddenException(
          `Bu işlem için gerekli izinlere sahip değilsiniz`
        );
      }
    }

    // Özel kısıtlamalar kontrolü
    if (user.restrictions) {
      const request = context.switchToHttp().getRequest();
      
      // Sadece görüntüleme kontrolü
      if (user.restrictions.viewOnly && request.method !== 'GET') {
        throw new ForbiddenException('Sadece görüntüleme yetkiniz var');
      }
    }

    return true;
  }

  // Kullanıcının belirli bir kaynağa erişim yetkisi var mı?
  static canAccessResource(user: any, resourceType: string, resourceId: string): boolean {
    // Süper admin her şeye erişir
    if (user.role === UserRole.SUPER_ADMIN) return true;

    switch (resourceType) {
      case 'restaurant':
        // Bayi sadece kendi restoranlarına erişir
        if (user.role === UserRole.DEALER && user.assignedRestaurantIds) {
          return user.assignedRestaurantIds.includes(resourceId);
        }
        // Bölge sorumlusu bölgesindeki restoranlara erişir
        if (user.role === UserRole.REGIONAL_MANAGER && user.assignedRestaurantIds) {
          return user.assignedRestaurantIds.includes(resourceId);
        }
        // Saha satış atanan restoranlara erişir
        if (user.role === UserRole.FIELD_SALES && user.assignedRestaurantIds) {
          return user.assignedRestaurantIds.includes(resourceId);
        }
        return true;

      case 'dealer':
        // Bölge sorumlusu kendi bayilerine erişir
        if (user.role === UserRole.REGIONAL_MANAGER && user.assignedDealerIds) {
          return user.assignedDealerIds.includes(resourceId);
        }
        // Bayi kendi kaydına erişir
        if (user.role === UserRole.DEALER) {
          return user.dealerId === resourceId;
        }
        return true;

      case 'region':
        // Bölge sorumlusu kendi bölgesine erişir
        if (user.role === UserRole.REGIONAL_MANAGER) {
          return user.regionId === resourceId;
        }
        return true;

      default:
        return true;
    }
  }
}
