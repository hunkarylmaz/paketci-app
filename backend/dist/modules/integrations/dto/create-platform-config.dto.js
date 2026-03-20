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
exports.UpdatePlatformStatusDto = exports.CreatePlatformConfigDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePlatformConfigDto {
}
exports.CreatePlatformConfigDto = CreatePlatformConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Platform ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformConfigDto.prototype, "platformId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'API Key from platform' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformConfigDto.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'API Secret from platform' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformConfigDto.prototype, "apiSecret", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Merchant ID from platform', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlatformConfigDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Branch ID from platform', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlatformConfigDto.prototype, "branchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Platform settings', required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePlatformConfigDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Webhook URL for platform callbacks', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlatformConfigDto.prototype, "webhookUrl", void 0);
class UpdatePlatformStatusDto {
}
exports.UpdatePlatformStatusDto = UpdatePlatformStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Open or close the restaurant on platform' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePlatformStatusDto.prototype, "isOpen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Auto accept orders', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePlatformStatusDto.prototype, "autoAcceptOrders", void 0);
//# sourceMappingURL=create-platform-config.dto.js.map