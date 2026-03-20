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
exports.Shift = exports.ShiftType = exports.ShiftStatus = void 0;
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/entities/company.entity");
const courier_entity_1 = require("../../couriers/entities/courier.entity");
var ShiftStatus;
(function (ShiftStatus) {
    ShiftStatus["SCHEDULED"] = "scheduled";
    ShiftStatus["ACTIVE"] = "active";
    ShiftStatus["ON_BREAK"] = "on_break";
    ShiftStatus["COMPLETED"] = "completed";
    ShiftStatus["CANCELLED"] = "cancelled";
    ShiftStatus["NO_SHOW"] = "no_show";
})(ShiftStatus || (exports.ShiftStatus = ShiftStatus = {}));
var ShiftType;
(function (ShiftType) {
    ShiftType["MORNING"] = "morning";
    ShiftType["AFTERNOON"] = "afternoon";
    ShiftType["EVENING"] = "evening";
    ShiftType["NIGHT"] = "night";
    ShiftType["FULL_DAY"] = "full_day";
    ShiftType["CUSTOM"] = "custom";
})(ShiftType || (exports.ShiftType = ShiftType = {}));
let Shift = class Shift {
};
exports.Shift = Shift;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Shift.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Shift.prototype, "courierId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => courier_entity_1.Courier, courier => courier.shifts),
    (0, typeorm_1.JoinColumn)({ name: 'courierId' }),
    __metadata("design:type", courier_entity_1.Courier)
], Shift.prototype, "courier", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Shift.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, company => company.shifts),
    (0, typeorm_1.JoinColumn)({ name: 'companyId' }),
    __metadata("design:type", company_entity_1.Company)
], Shift.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ShiftType, default: ShiftType.CUSTOM }),
    __metadata("design:type", String)
], Shift.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Shift.prototype, "plannedStartAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Shift.prototype, "plannedEndAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Shift.prototype, "actualStartAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Shift.prototype, "actualEndAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Shift.prototype, "breakStartedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Shift.prototype, "breakEndedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Shift.prototype, "breakDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ShiftStatus, default: ShiftStatus.SCHEDULED }),
    __metadata("design:type", String)
], Shift.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Shift.prototype, "startLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Shift.prototype, "endLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Shift.prototype, "plannedDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Shift.prototype, "actualDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Shift.prototype, "lateArrivalMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Shift.prototype, "earlyLeaveMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Shift.prototype, "isCompliant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Shift.prototype, "nonComplianceReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Shift.prototype, "performanceMetrics", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Shift.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Shift.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Shift.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Shift.prototype, "updatedAt", void 0);
exports.Shift = Shift = __decorate([
    (0, typeorm_1.Entity)('shifts')
], Shift);
//# sourceMappingURL=shift.entity.js.map