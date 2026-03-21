"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const restaurants_service_1 = require("./restaurants.service");
const restaurant_entity_1 = require("./entities/restaurant.entity");
const user_role_enum_1 = require("../users/enums/user-role.enum");
let RestaurantsController = class RestaurantsController {
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    async findAll(companyId, dealerId, regionId, territoryId, salesStatus, isActive, city, req) {
        const filters = {};
        if (companyId)
            filters.companyId = companyId;
        if (dealerId)
            filters.dealerId = dealerId;
        if (regionId)
            filters.regionId = regionId;
        if (territoryId)
            filters.territoryId = territoryId;
        if (salesStatus)
            filters.salesStatus = salesStatus;
        if (isActive !== undefined)
            filters.isActive = isActive === 'true';
        if (city)
            filters.city = city;
        return this.restaurantsService.findAll(filters, req?.user);
    }
    async getStats(companyId, regionId, dealerId, req) {
        const filters = {};
        if (companyId)
            filters.companyId = companyId;
        if (regionId)
            filters.regionId = regionId;
        if (dealerId)
            filters.dealerId = dealerId;
        if (req?.user) {
            if (req.user.role === user_role_enum_1.UserRole.REGIONAL_MANAGER && req.user.regionId) {
                filters.regionId = req.user.regionId;
            }
            if (req.user.role === user_role_enum_1.UserRole.DEALER && req.user.dealerId) {
                filters.dealerId = req.user.dealerId;
            }
        }
        return this.restaurantsService.getStats(filters);
    }
    async findById(id, req) {
        return this.restaurantsService.findById(id, req.user);
    }
    async create(createDto, req) {
        return this.restaurantsService.create(createDto, req.user);
    }
    async update(id, updateDto, req) {
        return this.restaurantsService.update(id, updateDto, req.user);
    }
    async remove(id, req) {
        await this.restaurantsService.remove(id, req.user);
        return { message: 'Restoran başarıyla silindi' };
    }
    async recordVisit(id, req) {
        return this.restaurantsService.recordVisit(id, req.user.id, `${req.user.firstName} ${req.user.lastName}`);
    }
    async updateSalesStatus(id, status, req) {
        return this.restaurantsService.updateSalesStatus(id, status, req.user);
    }
    async assignRestaurant(id, assignments, req) {
        return this.restaurantsService.assignRestaurant(id, assignments, req.user);
    }
    async getByDealer(dealerId, req) {
        if (req.user.role === user_role_enum_1.UserRole.DEALER && req.user.dealerId !== dealerId) {
            return { error: 'Bu bayiye erişim yetkiniz yok' };
        }
        return this.restaurantsService.findAll({ dealerId }, req.user);
    }
    async getByRegion(regionId, req) {
        if (req.user.role === user_role_enum_1.UserRole.REGIONAL_MANAGER && req.user.regionId !== regionId) {
            return { error: 'Bu bölgeye erişim yetkiniz yok' };
        }
        return this.restaurantsService.findAll({ regionId }, req.user);
    }
    async getByTerritory(territoryId, req) {
        return this.restaurantsService.findAll({ territoryId }, req.user);
    }
    async getLeads(req) {
        return this.restaurantsService.findAll({ salesStatus: restaurant_entity_1.RestaurantSalesStatus.LEAD }, req.user);
    }
    async getActive(req) {
        return this.restaurantsService.findAll({ salesStatus: restaurant_entity_1.RestaurantSalesStatus.ACTIVE, isActive: true }, req.user);
    }
};
exports.RestaurantsController = RestaurantsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('dealerId')),
    __param(2, (0, common_1.Query)('regionId')),
    __param(3, (0, common_1.Query)('territoryId')),
    __param(4, (0, common_1.Query)('salesStatus')),
    __param(5, (0, common_1.Query)('isActive')),
    __param(6, (0, common_1.Query)('city')),
    __param(7, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('regionId')),
    __param(2, (0, common_1.Query)('dealerId')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER, user_role_enum_1.UserRole.FIELD_SALES),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER, user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.FIELD_SALES),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/visit'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.FIELD_SALES),
    (0, roles_decorator_1.Permissions)('restaurants.visit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "recordVisit", null);
__decorate([
    (0, common_1.Put)(':id/sales-status'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.FIELD_SALES, user_role_enum_1.UserRole.REGIONAL_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "updateSalesStatus", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "assignRestaurant", null);
__decorate([
    (0, common_1.Get)('by-dealer/:dealerId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER, user_role_enum_1.UserRole.DEALER),
    __param(0, (0, common_1.Param)('dealerId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getByDealer", null);
__decorate([
    (0, common_1.Get)('by-region/:regionId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER),
    __param(0, (0, common_1.Param)('regionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getByRegion", null);
__decorate([
    (0, common_1.Get)('by-territory/:territoryId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER, user_role_enum_1.UserRole.FIELD_SALES),
    __param(0, (0, common_1.Param)('territoryId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getByTerritory", null);
__decorate([
    (0, common_1.Get)('sales/leads'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.FIELD_SALES, user_role_enum_1.UserRole.REGIONAL_MANAGER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getLeads", null);
__decorate([
    (0, common_1.Get)('sales/active'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER, user_role_enum_1.UserRole.DEALER, user_role_enum_1.UserRole.FIELD_SALES),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getActive", null);
exports.RestaurantsController = RestaurantsController = __decorate([
    (0, common_1.Controller)('restaurants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsController);
//# sourceMappingURL=restaurants.controller.js.map