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
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shift_entity_1 = require("./entities/shift.entity");
let ShiftsService = class ShiftsService {
    constructor(shiftRepository) {
        this.shiftRepository = shiftRepository;
    }
    async create(shiftData) {
        const shift = this.shiftRepository.create(shiftData);
        if (shift.plannedStartAt && shift.plannedEndAt) {
            shift.plannedDuration = Math.round((shift.plannedEndAt.getTime() - shift.plannedStartAt.getTime()) / 60000);
        }
        return this.shiftRepository.save(shift);
    }
    async findAll(companyId, filters) {
        const query = this.shiftRepository.createQueryBuilder('shift')
            .leftJoinAndSelect('shift.courier', 'courier')
            .where('shift.companyId = :companyId', { companyId });
        if (filters?.status) {
            query.andWhere('shift.status = :status', { status: filters.status });
        }
        if (filters?.courierId) {
            query.andWhere('shift.courierId = :courierId', { courierId: filters.courierId });
        }
        if (filters?.startDate && filters?.endDate) {
            query.andWhere('shift.plannedStartAt BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate,
            });
        }
        query.orderBy('shift.plannedStartAt', 'DESC');
        return query.getMany();
    }
    async findOne(id, companyId) {
        return this.shiftRepository.findOne({
            where: { id, companyId },
            relations: ['courier'],
        });
    }
    async update(id, companyId, updateData) {
        await this.shiftRepository.update({ id, companyId }, updateData);
        return this.findOne(id, companyId);
    }
    async remove(id, companyId) {
        await this.shiftRepository.delete({ id, companyId });
    }
    async getActiveShift(courierId, companyId) {
        return this.shiftRepository.findOne({
            where: {
                courierId,
                companyId,
                status: shift_entity_1.ShiftStatus.ACTIVE,
            },
        });
    }
    async getUpcomingShifts(courierId, hours = 24) {
        const now = new Date();
        const future = new Date(now.getTime() + hours * 60 * 60 * 1000);
        return this.shiftRepository.find({
            where: {
                courierId,
                plannedStartAt: (0, typeorm_2.Between)(now, future),
                status: shift_entity_1.ShiftStatus.SCHEDULED,
            },
            order: { plannedStartAt: 'ASC' },
        });
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shift_entity_1.Shift)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map