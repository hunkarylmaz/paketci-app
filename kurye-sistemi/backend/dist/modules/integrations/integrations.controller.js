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
const swagger_1 = require("@nestjs/swagger");
const integrations_service_1 = require("./integrations.service");
const integration_dto_1 = require("./dto/integration.dto");
const integration_entity_1 = require("./entities/integration.entity");
let IntegrationsController = class IntegrationsController {
    constructor(integrationsService) {
        this.integrationsService = integrationsService;
    }
    findAll(restaurantId) {
        return this.integrationsService.findAll(restaurantId);
    }
    findOne(id) {
        return this.integrationsService.findOne(id);
    }
    create(dto) {
        return this.integrationsService.create(dto);
    }
    update(id, dto) {
        return this.integrationsService.update(id, dto);
    }
    remove(id) {
        return this.integrationsService.remove(id);
    }
    testConnection(dto) {
        return this.integrationsService.testConnection(dto);
    }
    syncOrders(id, startDate, endDate) {
        return this.integrationsService.syncOrders(id, { startDate, endDate });
    }
    createOrderFromExtension(orderData, restaurantId) {
        return this.integrationsService.createOrderFromExtension(restaurantId, orderData);
    }
    getPlatforms() {
        return [
            {
                id: integration_entity_1.IntegrationPlatform.YEMEK_SEPETI,
                name: 'Yemeksepeti',
                icon: '🍽️',
                color: 'bg-red-500',
                description: 'Türkiye\'nin en büyük online yemek sipariş platformu',
                commission: '%15-25',
                features: ['Restoran Yönetimi', 'Sipariş Takibi', 'Kampanya Yönetimi'],
                authType: 'apiKey',
            },
            {
                id: integration_entity_1.IntegrationPlatform.MIGROS_YEMEK,
                name: 'Migros Yemek',
                icon: '🥘',
                color: 'bg-orange-500',
                description: 'Migros\'un yemek sipariş platformu',
                commission: '%12-20',
                features: ['Hızlı Teslimat', 'Migros Privileges', 'Geniş Kitle'],
                authType: 'apiKey',
            },
            {
                id: integration_entity_1.IntegrationPlatform.TRENDYOL_YEMEK,
                name: 'Trendyol Yemek',
                icon: '🛵',
                color: 'bg-orange-600',
                description: 'Trendyol\'un yemek sipariş hizmeti',
                commission: '%10-18',
                features: ['Trendyol Go Entegrasyonu', 'Hızlı Teslimat', 'Geniş Müşteri Ağı'],
                authType: 'apiKey',
            },
            {
                id: integration_entity_1.IntegrationPlatform.GETIR_YEMEK,
                name: 'Getir Yemek',
                icon: '📱',
                color: 'bg-purple-500',
                description: 'Getir\'in yemek sipariş platformu',
                commission: '%20-30',
                features: ['Dakikalar İçinde Teslimat', 'Getir Bünyesinde', 'Yüksek Frekans'],
                authType: 'apiKey',
            },
        ];
    }
};
exports.IntegrationsController = IntegrationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all integrations' }),
    __param(0, (0, common_1.Query)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get integration by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new integration' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [integration_dto_1.CreateIntegrationDto]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update integration' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, integration_dto_1.UpdateIntegrationDto]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete integration' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test platform connection' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [integration_dto_1.TestIntegrationDto]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Post)(':id/sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync orders from platform' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "syncOrders", null);
__decorate([
    (0, common_1.Post)('extension/order'),
    (0, swagger_1.ApiOperation)({ summary: 'Create order from Chrome Extension' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [integration_dto_1.PlatformOrderDto, String]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "createOrderFromExtension", null);
__decorate([
    (0, common_1.Get)('platforms/list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available platforms' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "getPlatforms", null);
exports.IntegrationsController = IntegrationsController = __decorate([
    (0, swagger_1.ApiTags)('Integrations'),
    (0, common_1.Controller)('integrations'),
    __metadata("design:paramtypes", [integrations_service_1.IntegrationsService])
], IntegrationsController);
//# sourceMappingURL=integrations.controller.js.map