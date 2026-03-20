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
exports.Receipt = exports.ReceiptTemplate = void 0;
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/entities/company.entity");
const delivery_entity_1 = require("../../deliveries/entities/delivery.entity");
var ReceiptTemplate;
(function (ReceiptTemplate) {
    ReceiptTemplate["STANDARD"] = "standard";
    ReceiptTemplate["COMPACT"] = "compact";
    ReceiptTemplate["DETAILED"] = "detailed";
    ReceiptTemplate["RESTAURANT"] = "restaurant";
})(ReceiptTemplate || (exports.ReceiptTemplate = ReceiptTemplate = {}));
let Receipt = class Receipt {
};
exports.Receipt = Receipt;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Receipt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Receipt.prototype, "receiptNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, company => company.receipts),
    (0, typeorm_1.JoinColumn)({ name: 'companyId' }),
    __metadata("design:type", company_entity_1.Company)
], Receipt.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Receipt.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => delivery_entity_1.Delivery, delivery => delivery.receipts),
    (0, typeorm_1.JoinColumn)({ name: 'deliveryId' }),
    __metadata("design:type", delivery_entity_1.Delivery)
], Receipt.prototype, "delivery", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Receipt.prototype, "deliveryId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Receipt.prototype, "dealerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "dealerLogo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "dealerAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "dealerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "dealerTaxNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Receipt.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "customerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Receipt.prototype, "deliveryAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], Receipt.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Receipt.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Receipt.prototype, "deliveryFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Receipt.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Receipt.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Receipt.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "paymentTypeLabel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Receipt.prototype, "orderChannel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Receipt.prototype, "orderChannelLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReceiptTemplate, default: ReceiptTemplate.STANDARD }),
    __metadata("design:type", String)
], Receipt.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Receipt.prototype, "customSettings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Receipt.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Receipt.prototype, "printedAt", void 0);
exports.Receipt = Receipt = __decorate([
    (0, typeorm_1.Entity)('receipts')
], Receipt);
//# sourceMappingURL=receipt.entity.js.map