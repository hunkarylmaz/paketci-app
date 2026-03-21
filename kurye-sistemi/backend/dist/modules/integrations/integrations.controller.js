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
exports.IntegrationsController = void 0;
const common_1 = require("@nestjs/common");
const integrations_service_1 = require("./integrations.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let IntegrationsController = class IntegrationsController {
    constructor(integrationsService) {
        this.integrationsService = integrationsService;
    }
    async getRestaurantIntegrations(restaurantId, req) {
        return this.integrationsService.getRestaurantIntegrations(restaurantId);
    }
    async saveIntegration(restaurantId, config, req) {
        return this.integrationsService.saveIntegration(restaurantId, config);
    }
    async testConnection(restaurantId, platform, req) {
        return this.integrationsService.testConnection(restaurantId, platform);
    }
    async syncOrders(restaurantId, platform, req) {
        const orders = await this.integrationsService.fetchOrders(restaurantId, platform);
        return {
            success: true,
            count: orders.length,
            orders,
        };
    }
    async toggleStatus(restaurantId, platform, isOpen, req) {
        const success = await this.integrationsService.toggleRestaurantStatus(restaurantId, platform, isOpen);
        return { success };
    }
    async deleteIntegration(restaurantId, platform, req) {
        return { success: true };
    }
    getWebhookUrl(restaurantId, platform) {
        const url = this.integrationsService.getWebhookUrl(platform, restaurantId);
        return { url };
    }
    getPlatforms() {
        return [
            {
                id: 'yemeksepeti',
                name: 'Yemeksepeti',
                icon: '🍽️',
                requires: ['apiKey', 'apiSecret', 'merchantId', 'branchId'],
                webhookEnabled: true,
            },
            {
                id: 'getir',
                name: 'Getir Yemek',
                icon: '🛵',
                requires: ['apiKey', 'apiSecret', 'merchantId', 'storeId'],
                webhookEnabled: true,
            },
            {
                id: 'trendyol',
                name: 'Trendyol Yemek',
                icon: '🟠',
                requires: ['apiKey', 'apiSecret', 'sellerId'],
                webhookEnabled: true,
            },
            {
                id: 'migros',
                name: 'Migros Yemek',
                icon: '🦁',
                requires: ['apiKey', 'apiSecret', 'restaurantId'],
                webhookEnabled: true,
            },
            {
                id: 'fuudy',
                name: 'Fuudy',
                icon: '🍔',
                requires: ['apiKey', 'apiSecret', 'restaurantId'],
                webhookEnabled: false,
            },
        ];
    }
};
exports.IntegrationsController = IntegrationsController;
__decorate([
    (0, common_1.Get)('restaurant/:restaurantId'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getRestaurantIntegrations", null);
__decorate([
    (0, common_1.Post)('restaurant/:restaurantId'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "saveIntegration", null);
__decorate([
    (0, common_1.Post)('restaurant/:restaurantId/test/:platform'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Param)('platform')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Post)('restaurant/:restaurantId/sync/:platform'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Param)('platform')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "syncOrders", null);
__decorate([
    (0, common_1.Put)('restaurant/:restaurantId/:platform/status'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Param)('platform')),
    __param(2, (0, common_1.Body)('isOpen')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "toggleStatus", null);
__decorate([
    (0, common_1.Delete)('restaurant/:restaurantId/:platform'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Param)('platform')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "deleteIntegration", null);
__decorate([
    (0, common_1.Get)('restaurant/:restaurantId/:platform/webhook-url'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Param)('platform')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "getWebhookUrl", null);
__decorate([
    (0, common_1.Get)('platforms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "getPlatforms", null);
exports.IntegrationsController = IntegrationsController = __decorate([
    (0, common_1.Controller)('integrations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [integrations_service_1.IntegrationsService])
], IntegrationsController);
//# sourceMappingURL=integrations.controller.js.map