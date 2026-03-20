import { Company } from '../../companies/entities/company.entity';
import { Courier } from '../../couriers/entities/courier.entity';
export declare enum ShiftStatus {
    SCHEDULED = "scheduled",
    ACTIVE = "active",
    ON_BREAK = "on_break",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show"
}
export declare enum ShiftType {
    MORNING = "morning",
    AFTERNOON = "afternoon",
    EVENING = "evening",
    NIGHT = "night",
    FULL_DAY = "full_day",
    CUSTOM = "custom"
}
export declare class Shift {
    id: string;
    courierId: string;
    courier: Courier;
    companyId: string;
    company: Company;
    type: ShiftType;
    plannedStartAt: Date;
    plannedEndAt: Date;
    actualStartAt: Date;
    actualEndAt: Date;
    breakStartedAt: Date;
    breakEndedAt: Date;
    breakDuration: number;
    status: ShiftStatus;
    startLocation: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    endLocation: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    plannedDuration: number;
    actualDuration: number;
    lateArrivalMinutes: number;
    earlyLeaveMinutes: number;
    isCompliant: boolean;
    nonComplianceReason: string;
    performanceMetrics: {
        totalDeliveries: number;
        averageDeliveryTime: number;
        customerRating: number;
        onTimeDeliveryRate: number;
    };
    notes: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
