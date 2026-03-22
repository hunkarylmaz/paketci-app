import { Delivery } from '../../deliveries/entities/delivery.entity';
import { Contract } from '../../contracts/entities/contract.entity';
import { Company } from '../../companies/entities/company.entity';
import { Dealer } from '../../dealers/entities/dealer.entity';
import { Region } from '../../regions/entities/region.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { Territory } from '../../territories/entities/territory.entity';
import { Visit } from '../../visits/entities/visit.entity';
import { Lead } from '../../leads/entities/lead.entity';
import { Integration } from '../../integrations/entities/integration.entity';
export declare enum PricingType {
    PER_PACKAGE = "PER_PACKAGE",
    PER_KM = "PER_KM",
    KM_RANGE = "KM_RANGE",
    PACKAGE_PLUS_KM = "PACKAGE_PLUS_KM",
    FIXED_KM_PLUS_KM = "FIXED_KM_PLUS_KM",
    COMMISSION = "COMMISSION",
    FIXED_PRICE = "FIXED_PRICE",
    HOURLY = "HOURLY",
    ZONE_BASED = "ZONE_BASED"
}
export declare enum RestaurantSalesStatus {
    LEAD = "LEAD",
    CONTACTED = "CONTACTED",
    VISITED = "VISITED",
    NEGOTIATING = "NEGOTIATING",
    CONTRACTED = "CONTRACTED",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare enum RestaurantUserRole {
    MANAGER = "MANAGER",
    STAFF = "STAFF"
}
export declare class RestaurantUser {
    id: string;
    restaurantId: string;
    fullName: string;
    phone: string;
    role: RestaurantUserRole;
    username: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
}
export declare class Restaurant {
    id: string;
    name: string;
    brandName: string;
    email: string;
    taxNumber: string;
    phone: string;
    supportPhone: string;
    technicalContactName: string;
    creditCardCommission: number;
    pickupTimeMinutes: number;
    pricingType: PricingType;
    pricingConfig: {
        pricePerPackage?: number;
        pricePerKm?: number;
        ranges?: Array<{
            maxKm: number;
            price: number;
        }>;
        basePrice?: number;
        fixedKm?: number;
        fixedPrice?: number;
        extraPricePerKm?: number;
        percentage?: number;
        fixedAmount?: number;
        billingPeriod?: string;
        normal?: {
            start: string;
            end: string;
            price: number;
        };
        peak?: {
            start: string;
            end: string;
            price: number;
        };
        night?: {
            start: string;
            end: string;
            price: number;
        };
        zones?: {
            blue: {
                price: number;
                neighborhoods: string[];
            };
            yellow: {
                price: number;
                neighborhoods: string[];
            };
            red: {
                price: number;
                neighborhoods: string[];
            };
        };
    };
    users: RestaurantUser[];
    latitude: number;
    longitude: number;
    address: {
        full: string;
        district: string;
        city: string;
        neighborhood?: string;
        postalCode?: string;
    };
    location: {
        latitude: number;
        longitude: number;
    };
    averagePreparationTime: number;
    maxPreparationTime: number;
    preparationTimeByHour: Record<string, number>;
    companyId: string;
    dealerId: string;
    dealerName: string;
    regionId: string;
    regionName: string;
    territoryId: string;
    territoryName: string;
    fieldSalesId: string;
    fieldSalesName: string;
    lastVisitAt: Date;
    visitCount: number;
    salesStatus: RestaurantSalesStatus;
    priority: number;
    apiKey: string;
    extensionEnabled: boolean;
    isActive: boolean;
    activatedAt: Date;
    company: Company;
    dealer: Dealer;
    region: Region;
    territory: Territory;
    deliveries: Delivery[];
    contracts: Contract[];
    invoices: Invoice[];
    visits: Visit[];
    leads: Lead[];
    integrations: Integration[];
    createdAt: Date;
    updatedAt: Date;
}
