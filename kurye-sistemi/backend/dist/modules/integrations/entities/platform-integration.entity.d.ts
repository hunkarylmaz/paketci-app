export declare enum PlatformType {
    YEMEK_SEPETI = "yemeksepeti",
    GETIR_YEMEK = "getir_yemek",
    GETIR_CARSI = "getir_carsi",
    MIGROS_YEMEK = "migros_yemek",
    TRENDYOL_YEMEK = "trendyol_yemek"
}
export declare class PlatformIntegration {
    id: string;
    platformType: PlatformType;
    name: string;
    apiBaseUrl: string;
    authUrl: string;
    description: string;
    defaultCommissionRate: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
