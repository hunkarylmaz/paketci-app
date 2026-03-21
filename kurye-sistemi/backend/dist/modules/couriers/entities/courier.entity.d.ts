import { Company } from '../../companies/entities/company.entity';
import { Delivery } from '../../deliveries/entities/delivery.entity';
import { Shift } from '../../shifts/entities/shift.entity';
export declare enum CourierStatus {
    OFFLINE = "offline",
    ONLINE = "online",
    BUSY = "busy"
}
export declare class Courier {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    status: CourierStatus;
    isOnDelivery: boolean;
    isOnBreak: boolean;
    currentLatitude: number;
    currentLongitude: number;
    lastLocationAt: Date;
    performanceRating: number;
    isActive: boolean;
    companyId: string;
    company: Company;
    deliveries: Delivery[];
    shifts: Shift[];
    createdAt: Date;
    updatedAt: Date;
}
