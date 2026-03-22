import { PlatformAdapter } from './platform-adapter.interface';
import { PlatformOrderDto } from '../dto/integration.dto';
export declare class YemeksepetiAdapter implements PlatformAdapter {
    private readonly logger;
    readonly platformName = "Yemeksepeti";
    testConnection(credentials: {
        apiKey: string;
        apiSecret?: string;
        merchantId?: string;
        branchId?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: any;
    }>;
    normalizeOrder(rawOrder: any): PlatformOrderDto;
    fetchOrders(credentials: any, filters?: any): Promise<any[]>;
    updateOrderStatus(credentials: any, orderId: string, status: string): Promise<any>;
    validateWebhook(payload: any, secret: string): boolean;
    private mapPaymentMethod;
    private mapStatusToPlatform;
    mapStatusFromPlatform(platformStatus: string): string;
}
