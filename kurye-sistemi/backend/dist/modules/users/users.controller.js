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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const users_service_1 = require("./users.service");
const user_role_enum_1 = require("./enums/user-role.enum");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(role, companyId, regionId, status, req) {
        const filters = {};
        if (role)
            filters.role = role;
        if (status)
            filters.status = status;
        if (req?.user) {
            if (req.user.role === user_role_enum_1.UserRole.COMPANY_ADMIN) {
                filters.companyId = req.user.companyId;
            }
            else if (req.user.role === user_role_enum_1.UserRole.REGIONAL_MANAGER) {
                filters.regionId = req.user.regionId;
            }
            else if (req.user.role === user_role_enum_1.UserRole.DEALER) {
                filters.dealerId = req.user.dealerId;
            }
        }
        return this.usersService.findAll(filters);
    }
    async getRoles() {
        return this.usersService.getRoleList();
    }
    async findById(id) {
        return this.usersService.findById(id);
    }
    async create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    async update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    async remove(id) {
        await this.usersService.remove(id);
        return { message: 'Kullanıcı başarıyla silindi' };
    }
    async assignUser(id, assignDto) {
        return this.usersService.assignUser(id, assignDto);
    }
    async getRegionalManagers(regionId) {
        return this.usersService.findRegionalManagers(regionId);
    }
    async getDealers(regionId) {
        return this.usersService.findDealers(regionId);
    }
    async getFieldSales(territoryId) {
        return this.usersService.findFieldSales(territoryId);
    }
    async getAccountants(department) {
        return this.usersService.findAccountants(department);
    }
    async getOperationsSupport(regionId) {
        return this.usersService.findOperationsSupport(regionId);
    }
    async getAccountantDashboard(req) {
        const resources = await this.usersService.getAccessibleResources(req.user.id);
        return {
            accessibleResources: resources,
            message: 'Muhasebe dashboard verileri',
        };
    }
    async getFinancialReports(req) {
        return {
            userRole: req.user.role,
            permissions: 'Finansal raporlara erişim yetkisi',
        };
    }
    async getFieldSalesDashboard(req) {
        const resources = await this.usersService.getAccessibleResources(req.user.id);
        return {
            accessibleResources: resources,
            monthlyTarget: req.user.monthlyTarget,
            monthlyVisitsTarget: req.user.monthlyVisitsTarget,
            assignedRestaurants: resources.restaurantIds.length,
        };
    }
    async addVisitReport(req, visitData) {
        return {
            message: 'Ziyaret raporu eklendi',
            userId: req.user.id,
            data: visitData,
        };
    }
    async getOperationsDashboard(req) {
        const resources = await this.usersService.getAccessibleResources(req.user.id);
        return {
            accessibleResources: resources,
            liveDeliveries: 'Canlı teslimat verileri',
            activeIssues: 'Aktif sorunlar',
        };
    }
    async interveneDelivery(interventionData) {
        return {
            message: 'Teslimata müdahale edildi',
            data: interventionData,
        };
    }
    async getRegionalManagerDashboard(req) {
        const resources = await this.usersService.getAccessibleResources(req.user.id);
        const subordinates = await this.usersService.findSubordinates(req.user.id);
        return {
            regionId: req.user.regionId,
            regionName: req.user.regionName,
            accessibleResources: resources,
            subordinates: subordinates.length,
            dealers: resources.dealerIds.length,
            restaurants: resources.restaurantIds.length,
        };
    }
    async getSubordinates(req) {
        return this.usersService.findSubordinates(req.user.id);
    }
    async getDealerDashboard(req) {
        const resources = await this.usersService.getAccessibleResources(req.user.id);
        return {
            dealerId: req.user.dealerId,
            dealerName: req.user.dealerName,
            accessibleResources: resources,
            restaurants: resources.restaurantIds.length,
        };
    }
    async getMyProfile(req) {
        return this.usersService.findById(req.user.id);
    }
    async updateMyProfile(req, updateData) {
        const allowedUpdates = ['firstName', 'lastName', 'phone'];
        const filteredUpdates = {};
        allowedUpdates.forEach(field => {
            if (updateData[field] !== undefined) {
                filteredUpdates[field] = updateData[field];
            }
        });
        return this.usersService.update(req.user.id, filteredUpdates);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.ManagementRoles)(),
    __param(0, (0, common_1.Query)('role')),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, common_1.Query)('regionId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.ManagementRoles)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.AdminRoles)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, roles_decorator_1.ManagementRoles)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "assignUser", null);
__decorate([
    (0, common_1.Get)('by-role/regional-managers'),
    (0, roles_decorator_1.ManagementRoles)(),
    __param(0, (0, common_1.Query)('regionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRegionalManagers", null);
__decorate([
    (0, common_1.Get)('by-role/dealers'),
    (0, roles_decorator_1.ManagementRoles)(),
    __param(0, (0, common_1.Query)('regionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getDealers", null);
__decorate([
    (0, common_1.Get)('by-role/field-sales'),
    (0, roles_decorator_1.ManagementRoles)(),
    __param(0, (0, common_1.Query)('territoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFieldSales", null);
__decorate([
    (0, common_1.Get)('by-role/accountants'),
    (0, roles_decorator_1.ManagementRoles)(),
    __param(0, (0, common_1.Query)('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAccountants", null);
__decorate([
    (0, common_1.Get)('by-role/operations-support'),
    (0, roles_decorator_1.ManagementRoles)(),
    __param(0, (0, common_1.Query)('regionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getOperationsSupport", null);
__decorate([
    (0, common_1.Get)('accountant/dashboard'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.ACCOUNTANT),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAccountantDashboard", null);
__decorate([
    (0, common_1.Get)('accountant/financial-reports'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.ACCOUNTANT),
    (0, roles_decorator_1.Permissions)('finance.view', 'reports.financial'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFinancialReports", null);
__decorate([
    (0, common_1.Get)('field-sales/dashboard'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.FIELD_SALES, user_role_enum_1.UserRole.REGIONAL_MANAGER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFieldSalesDashboard", null);
__decorate([
    (0, common_1.Post)('field-sales/visit-report'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.FIELD_SALES),
    (0, roles_decorator_1.Permissions)('restaurants.visit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addVisitReport", null);
__decorate([
    (0, common_1.Get)('operations/dashboard'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.OPERATIONS_SUPPORT, user_role_enum_1.UserRole.REGIONAL_MANAGER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getOperationsDashboard", null);
__decorate([
    (0, common_1.Post)('operations/intervene-delivery'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.OPERATIONS_SUPPORT),
    (0, roles_decorator_1.Permissions)('issues.resolve', 'deliveries.monitor'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "interveneDelivery", null);
__decorate([
    (0, common_1.Get)('regional-manager/dashboard'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRegionalManagerDashboard", null);
__decorate([
    (0, common_1.Get)('regional-manager/subordinates'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER, user_role_enum_1.UserRole.MANAGER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getSubordinates", null);
__decorate([
    (0, common_1.Get)('dealer/dashboard'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.COMPANY_ADMIN, user_role_enum_1.UserRole.REGIONAL_MANAGER, user_role_enum_1.UserRole.DEALER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getDealerDashboard", null);
__decorate([
    (0, common_1.Get)('profile/me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Put)('profile/me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMyProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map