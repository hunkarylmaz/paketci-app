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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const excel_export_service_1 = require("../../common/services/excel-export.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const delivery_entity_1 = require("../deliveries/entities/delivery.entity");
let ReportsController = class ReportsController {
    constructor(reportsService, excelService, deliveryRepository) {
        this.reportsService = reportsService;
        this.excelService = excelService;
        this.deliveryRepository = deliveryRepository;
    }
    async getDashboardStats(companyId) {
        return this.reportsService.getDashboardStats(companyId);
    }
    async getDeliveryReport(companyId, startDate, endDate) {
        return this.deliveryRepository.find({
            where: {
                companyId,
                createdAt: (0, typeorm_2.Between)(new Date(startDate), new Date(endDate)),
            },
            relations: ['restaurant', 'courier'],
            order: { createdAt: 'DESC' },
        });
    }
    async exportDeliveries(companyId, startDate, endDate, res) {
        const deliveries = await this.deliveryRepository.find({
            where: {
                companyId,
                createdAt: (0, typeorm_2.Between)(new Date(startDate), new Date(endDate)),
            },
            relations: ['restaurant', 'courier'],
            order: { createdAt: 'DESC' },
        });
        const buffer = this.excelService.exportDeliveries(deliveries);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=teslimat-raporu.xlsx');
        res.send(buffer);
    }
    async getCourierPerformance(companyId, startDate, endDate) {
        return this.reportsService.getCourierPerformance(companyId, new Date(startDate), new Date(endDate));
    }
    async getRestaurantPerformance(companyId, startDate, endDate) {
        return this.reportsService.getRestaurantPerformance(companyId, new Date(startDate), new Date(endDate));
    }
    async getFinancialReport(companyId, startDate, endDate) {
        return this.reportsService.getFinancialReport(companyId, new Date(startDate), new Date(endDate));
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('deliveries'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDeliveryReport", null);
__decorate([
    (0, common_1.Get)('deliveries/export'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportDeliveries", null);
__decorate([
    (0, common_1.Get)('couriers/performance'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getCourierPerformance", null);
__decorate([
    (0, common_1.Get)('restaurants/performance'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getRestaurantPerformance", null);
__decorate([
    (0, common_1.Get)('financial'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getFinancialReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __param(2, (0, typeorm_1.InjectRepository)(delivery_entity_1.Delivery)),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        excel_export_service_1.ExcelExportService,
        typeorm_2.Repository])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map