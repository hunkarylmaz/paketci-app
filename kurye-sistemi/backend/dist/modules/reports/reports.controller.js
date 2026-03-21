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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getDashboardStats(companyId) {
        return this.reportsService.getDashboardStats(companyId);
    }
    async getDealerSummary(companyId, startDate, endDate) {
        return this.reportsService.getDashboardStats(companyId);
    }
    async exportDealerSummary(companyId, startDate, endDate, res) {
        const buffer = await this.reportsService.generateDealerSummaryReport(companyId, {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
        const filename = `bayi-raporu-${(0, date_fns_1.format)(new Date(), 'yyyy-MM-dd', { locale: locale_1.tr })}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);
    }
    async getRestaurantDetailed(restaurantId, startDate, endDate) {
        return this.reportsService.getRestaurantPerformance('', new Date(startDate), new Date(endDate));
    }
    async exportRestaurantDetailed(restaurantId, startDate, endDate, res) {
        const buffer = await this.reportsService.generateRestaurantDetailedReport(restaurantId, {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
        const filename = `restoran-raporu-${(0, date_fns_1.format)(new Date(), 'yyyy-MM-dd', { locale: locale_1.tr })}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);
    }
    async getCourierPerformance(companyId, startDate, endDate) {
        return this.reportsService.getCourierPerformance(companyId, new Date(startDate), new Date(endDate));
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
    (0, common_1.Get)('dealer/summary'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDealerSummary", null);
__decorate([
    (0, common_1.Get)('dealer/summary/export'),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportDealerSummary", null);
__decorate([
    (0, common_1.Get)('restaurant/detailed'),
    __param(0, (0, common_1.Query)('restaurantId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getRestaurantDetailed", null);
__decorate([
    (0, common_1.Get)('restaurant/detailed/export'),
    __param(0, (0, common_1.Query)('restaurantId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportRestaurantDetailed", null);
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map