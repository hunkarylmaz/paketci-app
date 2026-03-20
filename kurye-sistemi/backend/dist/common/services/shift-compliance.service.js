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
exports.ShiftComplianceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shift_entity_1 = require("../../modules/shifts/entities/shift.entity");
const courier_entity_1 = require("../../modules/couriers/entities/courier.entity");
let ShiftComplianceService = class ShiftComplianceService {
    constructor(shiftRepository, courierRepository) {
        this.shiftRepository = shiftRepository;
        this.courierRepository = courierRepository;
    }
    async generateComplianceReport(companyId, startDate, endDate) {
        const shifts = await this.shiftRepository.find({
            where: {
                companyId,
                plannedStartAt: (0, typeorm_2.Between)(startDate, endDate),
            },
            relations: ['courier'],
        });
        if (shifts.length === 0) {
            return this.getEmptyReport();
        }
        const checkedShifts = shifts.map(shift => this.checkCompliance(shift));
        const courierStats = await this.calculateCourierStats(checkedShifts);
        const compliantShifts = checkedShifts.filter(s => s.isCompliant).length;
        const nonCompliantShifts = checkedShifts.filter(s => !s.isCompliant).length;
        const lateArrivals = checkedShifts
            .filter(s => s.lateArrivalMinutes > 0)
            .map(s => s.lateArrivalMinutes);
        const earlyLeaves = checkedShifts
            .filter(s => s.earlyLeaveMinutes > 0)
            .map(s => s.earlyLeaveMinutes);
        const totalDeliveries = checkedShifts.reduce((sum, s) => sum + (s.performanceMetrics?.totalDeliveries || 0), 0);
        const avgDeliveryTime = this.calculateAverage(checkedShifts
            .filter(s => s.performanceMetrics?.averageDeliveryTime)
            .map(s => s.performanceMetrics.averageDeliveryTime));
        return {
            totalShifts: shifts.length,
            compliantShifts,
            nonCompliantShifts,
            complianceRate: Math.round((compliantShifts / shifts.length) * 100),
            avgLateArrival: Math.round(this.calculateAverage(lateArrivals)),
            avgEarlyLeave: Math.round(this.calculateAverage(earlyLeaves)),
            totalDeliveries,
            avgDeliveryTime: Math.round(avgDeliveryTime),
            courierStats,
        };
    }
    checkCompliance(shift) {
        const toleranceMinutes = 5;
        let isCompliant = true;
        let nonComplianceReason = '';
        let lateArrivalMinutes = 0;
        let earlyLeaveMinutes = 0;
        if (shift.actualStartAt && shift.plannedStartAt) {
            const diff = (shift.actualStartAt.getTime() - shift.plannedStartAt.getTime()) / 60000;
            if (diff > toleranceMinutes) {
                isCompliant = false;
                lateArrivalMinutes = Math.round(diff);
                nonComplianceReason = `Geç kalma: ${lateArrivalMinutes} dk`;
            }
        }
        if (shift.actualEndAt && shift.plannedEndAt) {
            const diff = (shift.plannedEndAt.getTime() - shift.actualEndAt.getTime()) / 60000;
            if (diff > toleranceMinutes) {
                isCompliant = false;
                earlyLeaveMinutes = Math.round(diff);
                nonComplianceReason = nonComplianceReason
                    ? `${nonComplianceReason}, Erken çıkma: ${earlyLeaveMinutes} dk`
                    : `Erken çıkma: ${earlyLeaveMinutes} dk`;
            }
        }
        if (shift.status === shift_entity_1.ShiftStatus.NO_SHOW) {
            isCompliant = false;
            nonComplianceReason = 'Vardiyaya gelmedi';
        }
        if (shift.status === shift_entity_1.ShiftStatus.CANCELLED) {
            isCompliant = false;
            nonComplianceReason = 'Vardiya iptal edildi';
        }
        shift.isCompliant = isCompliant;
        shift.nonComplianceReason = nonComplianceReason;
        shift.lateArrivalMinutes = lateArrivalMinutes;
        shift.earlyLeaveMinutes = earlyLeaveMinutes;
        if (shift.plannedStartAt && shift.plannedEndAt) {
            shift.plannedDuration = Math.round((shift.plannedEndAt.getTime() - shift.plannedStartAt.getTime()) / 60000);
        }
        if (shift.actualStartAt && shift.actualEndAt) {
            shift.actualDuration = Math.round((shift.actualEndAt.getTime() - shift.actualStartAt.getTime()) / 60000);
        }
        return shift;
    }
    async calculateCourierStats(shifts) {
        const courierMap = new Map();
        for (const shift of shifts) {
            if (!shift.courier)
                continue;
            const id = shift.courierId;
            const existing = courierMap.get(id);
            if (existing) {
                existing.totalShifts++;
                if (shift.isCompliant) {
                    existing.compliantShifts++;
                }
                else {
                    existing.nonCompliantShifts++;
                }
                existing.totalLateMinutes += shift.lateArrivalMinutes || 0;
                existing.totalEarlyLeaveMinutes += shift.earlyLeaveMinutes || 0;
                existing.totalDeliveries += shift.performanceMetrics?.totalDeliveries || 0;
                existing.complianceRate = Math.round((existing.compliantShifts / existing.totalShifts) * 100);
            }
            else {
                courierMap.set(id, {
                    courierId: id,
                    name: `${shift.courier.firstName} ${shift.courier.lastName}`,
                    totalShifts: 1,
                    compliantShifts: shift.isCompliant ? 1 : 0,
                    nonCompliantShifts: shift.isCompliant ? 0 : 1,
                    totalLateMinutes: shift.lateArrivalMinutes || 0,
                    totalEarlyLeaveMinutes: shift.earlyLeaveMinutes || 0,
                    totalDeliveries: shift.performanceMetrics?.totalDeliveries || 0,
                    avgDeliveryTime: shift.performanceMetrics?.averageDeliveryTime || 0,
                    complianceRate: shift.isCompliant ? 100 : 0,
                });
            }
        }
        return Array.from(courierMap.values()).sort((a, b) => b.complianceRate - a.complianceRate);
    }
    async startShift(shiftId, location) {
        const shift = await this.shiftRepository.findOne({ where: { id: shiftId } });
        if (!shift) {
            throw new Error('Vardiya bulunamadı');
        }
        shift.status = shift_entity_1.ShiftStatus.ACTIVE;
        shift.actualStartAt = new Date();
        if (location) {
            shift.startLocation = location;
        }
        if (shift.plannedStartAt) {
            const diff = (shift.actualStartAt.getTime() - shift.plannedStartAt.getTime()) / 60000;
            if (diff > 5) {
                shift.lateArrivalMinutes = Math.round(diff);
            }
        }
        return this.shiftRepository.save(shift);
    }
    async endShift(shiftId, location) {
        const shift = await this.shiftRepository.findOne({ where: { id: shiftId } });
        if (!shift) {
            throw new Error('Vardiya bulunamadı');
        }
        shift.status = shift_entity_1.ShiftStatus.COMPLETED;
        shift.actualEndAt = new Date();
        if (location) {
            shift.endLocation = location;
        }
        if (shift.plannedEndAt) {
            const diff = (shift.plannedEndAt.getTime() - shift.actualEndAt.getTime()) / 60000;
            if (diff > 5) {
                shift.earlyLeaveMinutes = Math.round(diff);
            }
        }
        this.checkCompliance(shift);
        return this.shiftRepository.save(shift);
    }
    async startBreak(shiftId) {
        const shift = await this.shiftRepository.findOne({ where: { id: shiftId } });
        if (!shift) {
            throw new Error('Vardiya bulunamadı');
        }
        shift.status = shift_entity_1.ShiftStatus.ON_BREAK;
        shift.breakStartedAt = new Date();
        return this.shiftRepository.save(shift);
    }
    async endBreak(shiftId) {
        const shift = await this.shiftRepository.findOne({ where: { id: shiftId } });
        if (!shift) {
            throw new Error('Vardiya bulunamadı');
        }
        shift.status = shift_entity_1.ShiftStatus.ACTIVE;
        shift.breakEndedAt = new Date();
        if (shift.breakStartedAt) {
            const breakMinutes = (shift.breakEndedAt.getTime() - shift.breakStartedAt.getTime()) / 60000;
            shift.breakDuration = parseFloat((breakMinutes / 60).toFixed(2));
        }
        return this.shiftRepository.save(shift);
    }
    getEmptyReport() {
        return {
            totalShifts: 0,
            compliantShifts: 0,
            nonCompliantShifts: 0,
            complianceRate: 0,
            avgLateArrival: 0,
            avgEarlyLeave: 0,
            totalDeliveries: 0,
            avgDeliveryTime: 0,
            courierStats: [],
        };
    }
    calculateAverage(numbers) {
        if (numbers.length === 0)
            return 0;
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }
};
exports.ShiftComplianceService = ShiftComplianceService;
exports.ShiftComplianceService = ShiftComplianceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shift_entity_1.Shift)),
    __param(1, (0, typeorm_1.InjectRepository)(courier_entity_1.Courier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ShiftComplianceService);
//# sourceMappingURL=shift-compliance.service.js.map