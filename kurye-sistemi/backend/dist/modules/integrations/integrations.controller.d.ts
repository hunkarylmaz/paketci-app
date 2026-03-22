import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto, UpdateIntegrationDto, TestIntegrationDto, PlatformOrderDto } from './dto/integration.dto';
import { IntegrationPlatform } from './entities/integration.entity';
export declare class IntegrationsController {
    private readonly integrationsService;
    constructor(integrationsService: IntegrationsService);
    findAll(restaurantId?: string): Promise<import("./entities/integration.entity").Integration[]>;
    findOne(id: string): Promise<import("./entities/integration.entity").Integration>;
    create(dto: CreateIntegrationDto): Promise<import("./entities/integration.entity").Integration>;
    update(id: string, dto: UpdateIntegrationDto): Promise<import("./entities/integration.entity").Integration>;
    remove(id: string): Promise<void>;
    testConnection(dto: TestIntegrationDto): Promise<{
        success: boolean;
        message: string;
        data?: any;
    }>;
    syncOrders(id: string, startDate?: string, endDate?: string): Promise<any[]>;
    createOrderFromExtension(orderData: PlatformOrderDto, restaurantId: string): Promise<any>;
    getPlatforms(): {
        id: IntegrationPlatform;
        name: string;
        icon: string;
        color: string;
        description: string;
        commission: string;
        features: string[];
        authType: string;
    }[];
}
