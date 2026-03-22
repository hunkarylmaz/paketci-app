import { Repository } from 'typeorm';
import { Integration, IntegrationPlatform } from './entities/integration.entity';
import { WebhookEvent } from './entities/webhook-event.entity';
import { CreateIntegrationDto, UpdateIntegrationDto, TestIntegrationDto, PlatformOrderDto } from './dto/integration.dto';
import { YemeksepetiAdapter } from './adapters/yemeksepeti.adapter';
import { MigrosYemekAdapter } from './adapters/migrosyemek.adapter';
import { TrendyolYemekAdapter } from './adapters/trendyolyemek.adapter';
import { GetirYemekAdapter } from './adapters/getiryemek.adapter';
import { PlatformAdapter } from './adapters/platform-adapter.interface';
export declare class IntegrationsService {
    private integrationRepository;
    private webhookEventRepository;
    private yemeksepetiAdapter;
    private migrosAdapter;
    private trendyolAdapter;
    private getirAdapter;
    private readonly logger;
    private adapters;
    constructor(integrationRepository: Repository<Integration>, webhookEventRepository: Repository<WebhookEvent>, yemeksepetiAdapter: YemeksepetiAdapter, migrosAdapter: MigrosYemekAdapter, trendyolAdapter: TrendyolYemekAdapter, getirAdapter: GetirYemekAdapter);
    findAll(restaurantId?: string): Promise<Integration[]>;
    findOne(id: string): Promise<Integration>;
    findByPlatform(restaurantId: string, platform: IntegrationPlatform): Promise<Integration | null>;
    create(dto: CreateIntegrationDto): Promise<Integration>;
    update(id: string, dto: UpdateIntegrationDto): Promise<Integration>;
    remove(id: string): Promise<void>;
    testConnection(dto: TestIntegrationDto): Promise<{
        success: boolean;
        message: string;
        data?: any;
    }>;
    syncOrders(integrationId: string, filters?: any): Promise<any[]>;
    handleWebhook(platform: IntegrationPlatform, payload: any, signature?: string): Promise<void>;
    processWebhookEvent(event: WebhookEvent): Promise<void>;
    createOrderFromExtension(restaurantId: string, orderData: PlatformOrderDto): Promise<any>;
    private detectEventType;
    getPlatformAdapter(platform: IntegrationPlatform): PlatformAdapter | undefined;
}
