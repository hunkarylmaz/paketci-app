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
exports.ShiftsController = void 0;
const common_1 = require("@nestjs/common");
const shifts_service_1 = require("./shifts.service");
const shift_compliance_service_1 = require("../../common/services/shift-compliance.service");
const excel_export_service_1 = require("../../common/services/excel-export.service");
let ShiftsController = class ShiftsController {
    constructor(shiftsService, complianceService, excelService) {
        this.shiftsService = shiftsService;
        this.complianceService = complianceService;
        this.excelService = excelService;
    }
    async create(shiftData) {
        return this.shiftsService.create(shiftData);
    }
    async findAll(companyId, filters) {
        return this.shiftsService.findAll(companyId, filters);
    }
    async findOne(id, companyId) {
        return this.shiftsService.findOne(id, companyId);
    }
    async update(id, companyId, updateData) {
        return this.shiftsService.update(id, companyId, updateData);
    }
    async remove(id, companyId) {
        await this.shiftsService.remove(id, companyId);
        return { message: 'Vardiya silindi' };
    }
    async startShift(id, body) {
        return this.complianceService.startShift(id, body);
    }
    async endShift(id, body) {
        return this.complianceService.endShift(id, body);
    }
    async startBreak(id) {
        return this.complianceService.startBreak(id);
    }
    async endBreak(id) {
        return this.complianceService.endBreak(id);
    }
    async getComplianceReport(companyId, startDate, endDate) {
        return this.complianceService.generateComplianceReport(companyId, new Date(startDate), new Date(endDate));
    }
    async exportShifts(companyId, startDate, endDate, res) {
        const shifts = await this.shiftsService.findAll(companyId, {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });
        const buffer = this.excelService.exportShifts(shifts, 'vardiyalar');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=vardiyalar.xlsx');
        res.send(buffer);
    }
    async exportComplianceReport(companyId, startDate, endDate, res) {
        const shifts = await this.shiftsService.findAll(companyId, {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });
        const report = await this.complianceService.generateComplianceReport(companyId, new Date(startDate), new Date(endDate));
        const buffer = this.excelService.exportShiftComplianceReport(shifts, report);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=vardiya-uyumluluk-raporu.xlsx');
        res.send(buffer);
    }
};
exports.ShiftsController = ShiftsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "startShift", null);
__decorate([
    (0, common_1.Post)(':id/end'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "endShift", null);
__decorate([
    (0, common_1.Post)(':id/break-start'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "startBreak", null);
__decorate([
    (0, common_1.Post)(':id/break-end'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "endBreak", null);
__decorate([
    (0, common_1.Get)('report/compliance'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "getComplianceReport", null);
__decorate([
    (0, common_1.Get)('export/excel'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "exportShifts", null);
__decorate([
    (0, common_1.Get)('export/compliance-report'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ShiftsController.prototype, "exportComplianceReport", null);
exports.ShiftsController = ShiftsController = __decorate([
    (0, common_1.Controller)('shifts'),
    __metadata("design:paramtypes", [shifts_service_1.ShiftsService,
        shift_compliance_service_1.ShiftComplianceService,
        excel_export_service_1.ExcelExportService])
], ShiftsController);
//# sourceMappingURL=shifts.controller.js.map