import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { RestaurantPlatformConfig } from './entities/restaurant-platform-config.entity';
import { PlatformOrder } from './adapters/yemeksepeti.adapter';
interface IntegrationConfig {
    platform: string;
    apiKey: string;
    apiSecret: string;
    merchantId: string;
    branchId?: string;
    autoAccept: boolean;
    isOpen: boolean;
}
interface IntegrationStatus {
    platform: string;
    connected: boolean;
    lastSyncAt?: Date;
    error?: string;
    pendingOrders: number;
    todayOrders: number;
}
export declare class IntegrationsService {
    private configRepo;
    private httpService;
    private readonly logger;
    private adapters;
    constructor(configRepo: Repository<RestaurantPlatformConfig>, httpService: HttpService);
    saveIntegration(restaurantId: string, config: IntegrationConfig): Promise<RestaurantPlatformConfig>;
    getRestaurantIntegrations(restaurantId: string): Promise<IntegrationStatus[]>;
    testConnection(restaurantId: string, platform: string): Promise<{
        success: boolean;
        message: string;
    }>;
    fetchOrders(restaurantId: string, platform: string): Promise<PlatformOrder[]>;
    toggleRestaurantStatus(restaurantId: string, platform: string, isOpen: boolean): Promise<boolean>;
    acceptOrder(restaurantId: string, platform: string, orderId: string): Promise<boolean>;
    rejectOrder(restaurantId: string, platform: string, orderId: string, reason: string): Promise<boolean>;
    private checkConnection;
    private encrypt;
    private decrypt;
    getWebhookUrl(platform: string, restaurantId: string): string;
}
export {};
