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
exports.SmartAssignmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const courier_entity_1 = require("../../modules/couriers/entities/courier.entity");
const shift_entity_1 = require("../../modules/shifts/entities/shift.entity");
const restaurant_entity_1 = require("../../modules/restaurants/entities/restaurant.entity");
let SmartAssignmentService = class SmartAssignmentService {
    constructor(courierRepository, shiftRepository, restaurantRepository) {
        this.courierRepository = courierRepository;
        this.shiftRepository = shiftRepository;
        this.restaurantRepository = restaurantRepository;
    }
    async findBestCourier(restaurantId, companyId, options = {}) {
        const { maxDistance = 10, preferActiveShift = true, minPerformance = 70 } = options;
        const restaurant = await this.restaurantRepository.findOne({
            where: { id: restaurantId, companyId },
        });
        if (!restaurant) {
            throw new Error('Restoran bulunamadı');
        }
        const preparationTime = this.calculatePreparationTime(restaurant);
        const estimatedReadyTime = new Date(Date.now() + preparationTime * 60000);
        const candidates = await this.findAvailableCouriers(companyId, maxDistance, restaurant);
        if (candidates.length === 0) {
            return null;
        }
        const scoredCandidates = await Promise.all(candidates.map(async (courier) => {
            const shift = await this.getActiveShift(courier.id, companyId);
            const distance = this.calculateDistance(restaurant.latitude, restaurant.longitude, courier.currentLatitude, courier.currentLongitude);
            const estimatedTravelTime = this.estimateTravelTime(distance);
            const estimatedArrivalTime = new Date(Date.now() + estimatedTravelTime * 60000);
            const score = this.calculateCompatibilityScore({
                courier,
                shift,
                distance,
                estimatedArrivalTime,
                estimatedReadyTime,
                preparationTime,
                preferActiveShift,
                minPerformance,
            });
            return {
                courier,
                shift,
                score,
                estimatedArrivalTime,
                distance,
                compatibility: {
                    shiftActive: !!shift && shift.status === shift_entity_1.ShiftStatus.ACTIVE,
                    inZone: distance <= maxDistance,
                    workload: await this.getCourierWorkload(courier.id),
                    performance: courier.performanceRating || 80,
                },
            };
        }));
        scoredCandidates.sort((a, b) => b.score - a.score);
        return scoredCandidates[0] || null;
    }
    calculatePreparationTime(restaurant) {
        const now = new Date();
        const currentHour = now.getHours();
        if (restaurant.preparationTimeByHour?.[currentHour]) {
            return restaurant.preparationTimeByHour[currentHour];
        }
        const isRushHour = (currentHour >= 12 && currentHour <= 14) ||
            (currentHour >= 19 && currentHour <= 21);
        if (isRushHour) {
            return Math.min(restaurant.averagePreparationTime * 1.3, restaurant.maxPreparationTime);
        }
        return restaurant.averagePreparationTime;
    }
    async findAvailableCouriers(companyId, maxDistance, restaurant) {
        return this.courierRepository.find({
            where: {
                companyId,
                status: courier_entity_1.CourierStatus.ONLINE,
                isOnDelivery: false,
                isOnBreak: false,
            },
        });
    }
    async getActiveShift(courierId, companyId) {
        const now = new Date();
        return this.shiftRepository.findOne({
            where: {
                courierId,
                companyId,
                status: shift_entity_1.ShiftStatus.ACTIVE,
                plannedStartAt: (0, typeorm_2.Between)(new Date(now.getTime() - 24 * 60 * 60 * 1000), new Date(now.getTime() + 24 * 60 * 60 * 1000)),
            },
        });
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(value) {
        return (value * Math.PI) / 180;
    }
    estimateTravelTime(distanceKm) {
        const baseTime = (distanceKm / 25) * 60;
        return Math.round(baseTime * 1.2);
    }
    calculateCompatibilityScore(params) {
        let score = 0;
        const { courier, shift, distance, estimatedArrivalTime, estimatedReadyTime, preparationTime, preferActiveShift, minPerformance, } = params;
        const distanceScore = Math.max(0, 30 - distance * 3);
        score += distanceScore;
        if (shift) {
            if (shift.status === shift_entity_1.ShiftStatus.ACTIVE) {
                score += 25;
            }
            else if (shift.status === shift_entity_1.ShiftStatus.SCHEDULED) {
                score += 10;
            }
        }
        else if (!preferActiveShift) {
            score += 15;
        }
        const arrivalDiff = Math.abs(estimatedArrivalTime.getTime() - estimatedReadyTime.getTime()) / 60000;
        if (arrivalDiff <= 5) {
            score += 25;
        }
        else if (arrivalDiff <= 10) {
            score += 20;
        }
        else if (arrivalDiff <= 15) {
            score += 10;
        }
        const performance = courier.performanceRating || 80;
        if (performance >= minPerformance) {
            score += (performance / 100) * 20;
        }
        return Math.round(score);
    }
    async getCourierWorkload(courierId) {
        return 30;
    }
    async getAssignmentRecommendations(companyId, pendingDeliveries) {
        const recommendations = new Map();
        for (const delivery of pendingDeliveries) {
            const bestCourier = await this.findBestCourier(delivery.restaurantId, companyId);
            if (bestCourier && bestCourier.score >= 60) {
                recommendations.set(delivery.id, bestCourier);
            }
        }
        return recommendations;
    }
};
exports.SmartAssignmentService = SmartAssignmentService;
exports.SmartAssignmentService = SmartAssignmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(courier_entity_1.Courier)),
    __param(1, (0, typeorm_1.InjectRepository)(shift_entity_1.Shift)),
    __param(2, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SmartAssignmentService);
//# sourceMappingURL=smart-assignment.service.js.map