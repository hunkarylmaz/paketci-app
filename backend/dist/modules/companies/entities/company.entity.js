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
exports.Company = void 0;
const typeorm_1 = require("typeorm");
const delivery_entity_1 = require("../../deliveries/entities/delivery.entity");
const restaurant_entity_1 = require("../../restaurants/entities/restaurant.entity");
const courier_entity_1 = require("../../couriers/entities/courier.entity");
const shift_entity_1 = require("../../shifts/entities/shift.entity");
const credit_entity_1 = require("../../credits/entities/credit.entity");
const receipt_entity_1 = require("../../receipts/entities/receipt.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const company_status_enum_1 = require("../enums/company-status.enum");
let Company = class Company {
};
exports.Company = Company;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Company.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Company.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "taxNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Company.prototype, "creditBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 2.5 }),
    __metadata("design:type", Number)
], Company.prototype, "deliveryFeePerOrder", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => restaurant_entity_1.Restaurant, restaurant => restaurant.company),
    __metadata("design:type", Array)
], Company.prototype, "restaurants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => courier_entity_1.Courier, courier => courier.company),
    __metadata("design:type", Array)
], Company.prototype, "couriers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => delivery_entity_1.Delivery, delivery => delivery.company),
    __metadata("design:type", Array)
], Company.prototype, "deliveries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shift_entity_1.Shift, shift => shift.company),
    __metadata("design:type", Array)
], Company.prototype, "shifts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => credit_entity_1.Credit, credit => credit.company),
    __metadata("design:type", Array)
], Company.prototype, "credits", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, user => user.company),
    __metadata("design:type", Array)
], Company.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => receipt_entity_1.Receipt, receipt => receipt.company),
    __metadata("design:type", Array)
], Company.prototype, "receipts", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Company.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: company_status_enum_1.CompanyStatus, default: company_status_enum_1.CompanyStatus.ACTIVE }),
    __metadata("design:type", String)
], Company.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Company.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Company.prototype, "updatedAt", void 0);
exports.Company = Company = __decorate([
    (0, typeorm_1.Entity)('companies')
], Company);
//# sourceMappingURL=company.entity.js.map