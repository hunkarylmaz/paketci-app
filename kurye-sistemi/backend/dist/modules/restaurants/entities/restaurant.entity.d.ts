import { Company } from '../../companies/entities/company.entity';
import { Delivery } from '../../deliveries/entities/delivery.entity';
export declare enum RestaurantStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class Restaurant {
    id: string;
    name: string;
    brandName: string;
    address: string;
    city: string;
    district: string;
    neighborhood: string;
    latitude: number;
    longitude: number;
    phone: string;
    email: string;
    contactName: string;
    contactPhone: string;
    status: RestaurantStatus;
    operatingHours: {
        monday: {
            open: string;
            close: string;
            closed: boolean;
        };
        tuesday: {
            open: string;
            close: string;
            closed: boolean;
        };
        wednesday: {
            open: string;
            close: string;
            closed: boolean;
        };
        thursday: {
            open: string;
            close: string;
            closed: boolean;
        };
        friday: {
            open: string;
            close: string;
            closed: boolean;
        };
        saturday: {
            open: string;
            close: string;
            closed: boolean;
        };
        sunday: {
            open: string;
            close: string;
            closed: boolean;
        };
    };
    companyId: string;
    company: Company;
    deliveries: Delivery[];
    averagePreparationTime: number;
    minPreparationTime: number;
    maxPreparationTime: number;
    preparationTimeByHour: {
        [hour: string]: number;
    };
    autoAssignmentEnabled: boolean;
    autoAssignmentRadius: number;
    integrationSettings: {
        trendyol?: {
            apiKey: string;
            secret: string;
            enabled: boolean;
        };
        getir?: {
            apiKey: string;
            secret: string;
            enabled: boolean;
        };
        yemeksepeti?: {
            apiKey: string;
            secret: string;
            enabled: boolean;
        };
        custom?: {
            webhookUrl: string;
            secret: string;
            enabled: boolean;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}
