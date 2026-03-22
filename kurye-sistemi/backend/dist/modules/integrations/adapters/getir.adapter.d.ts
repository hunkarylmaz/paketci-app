import { HttpService } from '@nestjs/axios';
import { PlatformAdapter } from './platform-adapter.interface';
import { PlatformOrderDto } from '../dto/integration.dto';
export declare class GetirAdapter implements PlatformAdapter {
    private readonly httpService;
    private readonly logger;
    readonly platformName = "Getir";
    private readonly baseUrl;
    constructor(httpService: HttpService);
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
}
