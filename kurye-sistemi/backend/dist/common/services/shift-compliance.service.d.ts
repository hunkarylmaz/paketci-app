import { Repository } from 'typeorm';
import { Shift } from '../../modules/shifts/entities/shift.entity';
import { Courier } from '../../modules/couriers/entities/courier.entity';
export interface ShiftComplianceReport {
    totalShifts: number;
    compliantShifts: number;
    nonCompliantShifts: number;
    complianceRate: number;
    avgLateArrival: number;
    avgEarlyLeave: number;
    totalDeliveries: number;
    avgDeliveryTime: number;
    courierStats: CourierShiftStat[];
}
export interface CourierShiftStat {
    courierId: string;
    name: string;
    totalShifts: number;
    compliantShifts: number;
    nonCompliantShifts: number;
    totalLateMinutes: number;
    totalEarlyLeaveMinutes: number;
    totalDeliveries: number;
    avgDeliveryTime: number;
    complianceRate: number;
}
export declare class ShiftComplianceService {
    private shiftRepository;
    private courierRepository;
    constructor(shiftRepository: Repository<Shift>, courierRepository: Repository<Courier>);
    generateComplianceReport(companyId: string, startDate: Date, endDate: Date): Promise<ShiftComplianceReport>;
    checkCompliance(shift: Shift): Shift;
    private calculateCourierStats;
    startShift(shiftId: string, location?: {
        latitude: number;
        longitude: number;
    }): Promise<Shift>;
    endShift(shiftId: string, location?: {
        latitude: number;
        longitude: number;
    }): Promise<Shift>;
    startBreak(shiftId: string): Promise<Shift>;
    endBreak(shiftId: string): Promise<Shift>;
    private getEmptyReport;
    private calculateAverage;
}
