import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { PlatformIntegration } from './platform-integration.entity';
export declare enum PlatformStatus {
    PENDING_SETUP = "pending_setup",
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    ERROR = "error"
}
export declare class RestaurantPlatformConfig {
    id: string;
    restaurantId: string;
    restaurant: Restaurant;
    platformId: string;
    platform: PlatformIntegration;
    apiKey: string;
    apiSecret: string;
    merchantId: string;
    branchId: string;
    accessToken: string;
    refreshToken: string;
    tokenExpiresAt: Date;
    status: PlatformStatus;
    isOpen: boolean;
    autoAcceptOrders: boolean;
    customCommissionRate: number;
    settings: {
        minOrderAmount?: number;
        deliveryTime?: number;
        preparationTime?: number;
        workingHours?: {
            open: string;
            close: string;
        };
    };
    webhookUrl: string;
    lastErrorMessage: string;
    lastSyncAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
