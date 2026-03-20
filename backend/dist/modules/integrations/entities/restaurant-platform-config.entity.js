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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantPlatformConfig = exports.PlatformStatus = void 0;
const typeorm_1 = require("typeorm");
const restaurant_entity_1 = require("../../restaurants/entities/restaurant.entity");
const platform_integration_entity_1 = require("./platform-integration.entity");
var PlatformStatus;
(function (PlatformStatus) {
    PlatformStatus["PENDING_SETUP"] = "pending_setup";
    PlatformStatus["CONNECTED"] = "connected";
    PlatformStatus["DISCONNECTED"] = "disconnected";
    PlatformStatus["ERROR"] = "error";
})(PlatformStatus || (exports.PlatformStatus = PlatformStatus = {}));
let RestaurantPlatformConfig = class RestaurantPlatformConfig {
};
exports.RestaurantPlatformConfig = RestaurantPlatformConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(() => restaurant_entity_1.Restaurant),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "restaurantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_entity_1.Restaurant),
    (0, typeorm_1.JoinColumn)({ name: 'restaurantId' }),
    __metadata("design:type", restaurant_entity_1.Restaurant)
], RestaurantPlatformConfig.prototype, "restaurant", void 0);
__decorate([
    (0, typeorm_1.Column)(() => platform_integration_entity_1.PlatformIntegration),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "platformId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => platform_integration_entity_1.PlatformIntegration),
    (0, typeorm_1.JoinColumn)({ name: 'platformId' }),
    __metadata("design:type", platform_integration_entity_1.PlatformIntegration)
], RestaurantPlatformConfig.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "apiKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "apiSecret", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "merchantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "accessToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], RestaurantPlatformConfig.prototype, "tokenExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlatformStatus,
        default: PlatformStatus.PENDING_SETUP,
    }),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], RestaurantPlatformConfig.prototype, "isOpen", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], RestaurantPlatformConfig.prototype, "autoAcceptOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], RestaurantPlatformConfig.prototype, "customCommissionRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], RestaurantPlatformConfig.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "webhookUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RestaurantPlatformConfig.prototype, "lastErrorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], RestaurantPlatformConfig.prototype, "lastSyncAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RestaurantPlatformConfig.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RestaurantPlatformConfig.prototype, "updatedAt", void 0);
exports.RestaurantPlatformConfig = RestaurantPlatformConfig = __decorate([
    (0, typeorm_1.Entity)('restaurant_platform_configs')
], RestaurantPlatformConfig);
//# sourceMappingURL=restaurant-platform-config.entity.js.map