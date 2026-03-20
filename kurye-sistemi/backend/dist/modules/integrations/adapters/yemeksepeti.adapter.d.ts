import { HttpService } from '@nestjs/axios';
import { RestaurantPlatformConfig } from '../entities/restaurant-platform-config.entity';
export interface PlatformOrder {
    platformOrderId: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    paymentType: 'cash' | 'card' | 'online';
}
export interface IPlatformAdapter {
    authenticate(config: RestaurantPlatformConfig): Promise<boolean>;
    getOrders(config: RestaurantPlatformConfig): Promise<PlatformOrder[]>;
    acceptOrder(config: RestaurantPlatformConfig, orderId: string): Promise<boolean>;
    rejectOrder(config: RestaurantPlatformConfig, orderId: string, reason: string): Promise<boolean>;
    updateMenu(config: RestaurantPlatformConfig, menuData: any): Promise<boolean>;
    toggleRestaurantStatus(config: RestaurantPlatformConfig, isOpen: boolean): Promise<boolean>;
}
export declare class YemeksepetiAdapter implements IPlatformAdapter {
    private readonly httpService;
    private readonly logger;
    private readonly baseUrl;
    constructor(httpService: HttpService);
    authenticate(config: RestaurantPlatformConfig): Promise<boolean>;
    getOrders(config: RestaurantPlatformConfig): Promise<PlatformOrder[]>;
    acceptOrder(config: RestaurantPlatformConfig, orderId: string): Promise<boolean>;
    rejectOrder(config: RestaurantPlatformConfig, orderId: string, reason: string): Promise<boolean>;
    updateMenu(config: RestaurantPlatformConfig, menuData: any): Promise<boolean>;
    toggleRestaurantStatus(config: RestaurantPlatformConfig, isOpen: boolean): Promise<boolean>;
    private ensureValidToken;
    private refreshToken;
}
