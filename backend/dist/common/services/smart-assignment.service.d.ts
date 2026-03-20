import { Repository } from 'typeorm';
import { Courier } from '../../modules/couriers/entities/courier.entity';
import { Shift } from '../../modules/shifts/entities/shift.entity';
import { Restaurant } from '../../modules/restaurants/entities/restaurant.entity';
export interface AssignmentCandidate {
    courier: Courier;
    shift: Shift;
    score: number;
    estimatedArrivalTime: Date;
    distance: number;
    compatibility: {
        shiftActive: boolean;
        inZone: boolean;
        workload: number;
        performance: number;
    };
}
export declare class SmartAssignmentService {
    private courierRepository;
    private shiftRepository;
    private restaurantRepository;
    constructor(courierRepository: Repository<Courier>, shiftRepository: Repository<Shift>, restaurantRepository: Repository<Restaurant>);
    findBestCourier(restaurantId: string, companyId: string, options?: {
        maxDistance?: number;
        preferActiveShift?: boolean;
        minPerformance?: number;
    }): Promise<AssignmentCandidate | null>;
    private calculatePreparationTime;
    private findAvailableCouriers;
    private getActiveShift;
    private calculateDistance;
    private toRad;
    private estimateTravelTime;
    private calculateCompatibilityScore;
    private getCourierWorkload;
    getAssignmentRecommendations(companyId: string, pendingDeliveries: any[]): Promise<Map<string, AssignmentCandidate>>;
}
