export declare class CreatePlatformConfigDto {
    platformId: string;
    apiKey: string;
    apiSecret: string;
    merchantId?: string;
    branchId?: string;
    settings?: {
        minOrderAmount?: number;
        deliveryTime?: number;
        preparationTime?: number;
        workingHours?: {
            open: string;
            close: string;
        };
    };
    webhookUrl?: string;
}
export declare class UpdatePlatformStatusDto {
    isOpen: boolean;
    autoAcceptOrders?: boolean;
}
