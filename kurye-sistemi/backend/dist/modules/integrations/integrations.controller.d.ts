import { IntegrationsService } from './integrations.service';
interface SaveIntegrationDto {
    platform: string;
    apiKey: string;
    apiSecret: string;
    merchantId: string;
    branchId?: string;
    autoAccept: boolean;
    isOpen: boolean;
}
export declare class IntegrationsController {
    private readonly integrationsService;
    constructor(integrationsService: IntegrationsService);
    getRestaurantIntegrations(restaurantId: string, req: any): Promise<any>;
    saveIntegration(restaurantId: string, config: SaveIntegrationDto, req: any): Promise<import("./entities/restaurant-platform-config.entity").RestaurantPlatformConfig>;
    testConnection(restaurantId: string, platform: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    syncOrders(restaurantId: string, platform: string, req: any): Promise<{
        success: boolean;
        count: number;
        orders: import("./adapters/yemeksepeti.adapter").PlatformOrder[];
    }>;
    toggleStatus(restaurantId: string, platform: string, isOpen: boolean, req: any): Promise<{
        success: boolean;
    }>;
    deleteIntegration(restaurantId: string, platform: string, req: any): Promise<{
        success: boolean;
    }>;
    getWebhookUrl(restaurantId: string, platform: string): {
        url: string;
    };
    getPlatforms(): {
        id: string;
        name: string;
        icon: string;
        requires: string[];
        webhookEnabled: boolean;
    }[];
}
export {};
