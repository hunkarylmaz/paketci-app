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
exports.PlatformIntegration = exports.PlatformType = void 0;
const typeorm_1 = require("typeorm");
var PlatformType;
(function (PlatformType) {
    PlatformType["YEMEK_SEPETI"] = "yemeksepeti";
    PlatformType["GETIR_YEMEK"] = "getir_yemek";
    PlatformType["GETIR_CARSI"] = "getir_carsi";
    PlatformType["MIGROS_YEMEK"] = "migros_yemek";
    PlatformType["TRENDYOL_YEMEK"] = "trendyol_yemek";
})(PlatformType || (exports.PlatformType = PlatformType = {}));
let PlatformIntegration = class PlatformIntegration {
};
exports.PlatformIntegration = PlatformIntegration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PlatformIntegration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlatformType,
        unique: true,
    }),
    __metadata("design:type", String)
], PlatformIntegration.prototype, "platformType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PlatformIntegration.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PlatformIntegration.prototype, "apiBaseUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PlatformIntegration.prototype, "authUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PlatformIntegration.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PlatformIntegration.prototype, "defaultCommissionRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PlatformIntegration.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PlatformIntegration.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PlatformIntegration.prototype, "updatedAt", void 0);
exports.PlatformIntegration = PlatformIntegration = __decorate([
    (0, typeorm_1.Entity)('platform_integrations')
], PlatformIntegration);
//# sourceMappingURL=platform-integration.entity.js.map