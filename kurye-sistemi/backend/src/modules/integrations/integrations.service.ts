import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integration, IntegrationPlatform, IntegrationStatus } from './entities/integration.entity';
import { WebhookEvent, WebhookEventType, WebhookStatus } from './entities/webhook-event.entity';
import { CreateIntegrationDto, UpdateIntegrationDto, TestIntegrationDto, PlatformOrderDto } from './dto/integration.dto';
import { YemeksepetiAdapter } from './adapters/yemeksepeti.adapter';
import { MigrosYemekAdapter } from './adapters/migrosyemek.adapter';
import { TrendyolYemekAdapter } from './adapters/trendyolyemek.adapter';
import { GetirYemekAdapter } from './adapters/getiryemek.adapter';
import { PlatformAdapter } from './adapters/platform-adapter.interface';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);
  private adapters = new Map<IntegrationPlatform, any>();

  constructor(
    @InjectRepository(Integration)
    private integrationRepository: Repository<Integration>,
    @InjectRepository(WebhookEvent)
    private webhookEventRepository: Repository<WebhookEvent>,
    private yemeksepetiAdapter: YemeksepetiAdapter,
    private migrosAdapter: MigrosYemekAdapter,
    private trendyolAdapter: TrendyolYemekAdapter,
    private getirAdapter: GetirYemekAdapter,
  ) {
    this.adapters.set(IntegrationPlatform.YEMEK_SEPETI, yemeksepetiAdapter);
    this.adapters.set(IntegrationPlatform.MIGROS_YEMEK, migrosAdapter);
    this.adapters.set(IntegrationPlatform.TRENDYOL_YEMEK, trendyolAdapter);
    this.adapters.set(IntegrationPlatform.GETIR_YEMEK, getirAdapter);
  }

  async findAll(restaurantId?: string): Promise<Integration[]> {
    const query = this.integrationRepository.createQueryBuilder('integration')
      .leftJoinAndSelect('integration.restaurant', 'restaurant');
    
    if (restaurantId) {
      query.where('integration.restaurantId = :restaurantId', { restaurantId });
    }
    
    return query.getMany();
  }

  async findOne(id: string): Promise<Integration> {
    const integration = await this.integrationRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });
    
    if (!integration) {
      throw new NotFoundException('Integration not found');
    }
    
    return integration;
  }

  async findByPlatform(restaurantId: string, platform: IntegrationPlatform): Promise<Integration | null> {
    return this.integrationRepository.findOne({
      where: { restaurantId, platform },
    });
  }

  async create(dto: CreateIntegrationDto): Promise<Integration> {
    const existing = await this.findByPlatform(dto.restaurantId, dto.platform);
    
    if (existing) {
      throw new Error('Integration already exists for this platform');
    }

    const integration = this.integrationRepository.create({
      ...dto,
      webhookUrl: dto.webhookUrl || `https://api.paketci.app/webhooks/${dto.platform}`,
      status: IntegrationStatus.PENDING,
    });

    return this.integrationRepository.save(integration);
  }

  async update(id: string, dto: UpdateIntegrationDto): Promise<Integration> {
    const integration = await this.findOne(id);
    
    Object.assign(integration, dto);
    
    return this.integrationRepository.save(integration);
  }

  async remove(id: string): Promise<void> {
    const integration = await this.findOne(id);
    await this.integrationRepository.remove(integration);
  }

  async testConnection(dto: TestIntegrationDto): Promise<{ success: boolean; message: string; data?: any }> {
    const adapter = this.adapters.get(dto.platform);
    
    if (!adapter) {
      return { success: false, message: 'Platform adapter not found' };
    }

    return adapter.testConnection({
      apiKey: dto.apiKey,
      apiSecret: dto.apiSecret,
      merchantId: dto.merchantId,
      branchId: dto.branchId,
    });
  }

  async syncOrders(integrationId: string, filters?: any): Promise<any[]> {
    const integration = await this.findOne(integrationId);
    const adapter = this.adapters.get(integration.platform);
    
    if (!adapter) {
      throw new Error('Platform adapter not found');
    }

    const credentials = {
      apiKey: integration.apiKey,
      apiSecret: integration.apiSecret,
      merchantId: integration.merchantId,
      branchId: integration.branchId,
    };

    const rawOrders = await adapter.fetchOrders(credentials, filters);
    
    // Normalize orders
    const normalizedOrders = rawOrders.map(order => adapter.normalizeOrder(order));
    
    // Update last sync time
    await this.integrationRepository.update(integrationId, {
      lastSyncAt: new Date(),
      status: IntegrationStatus.ACTIVE,
    });

    return normalizedOrders;
  }

  async handleWebhook(platform: IntegrationPlatform, payload: any, signature?: string): Promise<void> {
    this.logger.log(`Received webhook from ${platform}`);

    // Find integration by platform
    const integrations = await this.integrationRepository.find({
      where: { platform, status: IntegrationStatus.ACTIVE },
    });

    for (const integration of integrations) {
      try {
        const adapter = this.adapters.get(platform);
        
        if (!adapter) {
          this.logger.warn(`No adapter found for platform ${platform}`);
          continue;
        }

        // Validate webhook if secret exists
        if (integration.webhookSecret && signature) {
          const isValid = adapter.validateWebhook(payload, integration.webhookSecret);
          if (!isValid) {
            this.logger.warn(`Invalid webhook signature for integration ${integration.id}`);
            continue;
          }
        }

        // Create webhook event record
        const webhookEvent = this.webhookEventRepository.create({
          integrationId: integration.id,
          platform,
          eventType: this.detectEventType(payload, platform),
          rawPayload: JSON.stringify(payload),
          processedData: adapter.normalizeOrder(payload),
          status: WebhookStatus.PENDING,
        });

        await this.webhookEventRepository.save(webhookEvent);

        // Process the webhook
        await this.processWebhookEvent(webhookEvent);

      } catch (error) {
        this.logger.error(`Error handling webhook for integration ${integration.id}`, error);
        
        await this.integrationRepository.update(integration.id, {
          status: IntegrationStatus.ERROR,
          lastError: error.message,
        });
      }
    }
  }

  async processWebhookEvent(event: WebhookEvent): Promise<void> {
    try {
      await this.webhookEventRepository.update(event.id, {
        status: WebhookStatus.PROCESSING,
      });

      // Create order from webhook data
      const orderData = event.processedData as PlatformOrderDto;
      
      // TODO: Create order in orders service
      // await this.ordersService.createFromPlatform(orderData, event.integrationId);

      await this.webhookEventRepository.update(event.id, {
        status: WebhookStatus.SUCCESS,
        processedAt: new Date(),
      });

    } catch (error) {
      await this.webhookEventRepository.update(event.id, {
        status: WebhookStatus.FAILED,
        errorMessage: error.message,
      });
      throw error;
    }
  }

  async createOrderFromExtension(restaurantId: string, orderData: PlatformOrderDto): Promise<any> {
    this.logger.log(`Creating order from Chrome Extension for restaurant ${restaurantId}`);
    
    // Normalize order data
    const normalizedOrder = {
      ...orderData,
      platform: orderData.platform || 'chrome_extension',
      metadata: {
        ...orderData.metadata,
        source: 'chrome_extension',
        createdAt: new Date().toISOString(),
      },
    };

    // TODO: Create order via orders service
    // return this.ordersService.createFromPlatform(normalizedOrder, null);
    
    return {
      success: true,
      orderId: `ORD-${Date.now()}`,
      message: 'Order created successfully',
    };
  }

  private detectEventType(payload: any, platform: IntegrationPlatform): WebhookEventType {
    // Platform-specific event type detection
    switch (platform) {
      case IntegrationPlatform.YEMEK_SEPETI:
        if (payload.eventType === 'ORDER_CREATED') return WebhookEventType.ORDER_CREATED;
        if (payload.eventType === 'ORDER_STATUS_UPDATED') return WebhookEventType.ORDER_STATUS_CHANGED;
        break;
      case IntegrationPlatform.MIGROS_YEMEK:
        if (payload.event === 'order.created') return WebhookEventType.ORDER_CREATED;
        break;
      case IntegrationPlatform.TRENDYOL_YEMEK:
        if (payload.eventType === 'ORDER_PLACED') return WebhookEventType.ORDER_CREATED;
        break;
      case IntegrationPlatform.GETIR_YEMEK:
        if (payload.status === 'PLACED') return WebhookEventType.ORDER_CREATED;
        break;
    }
    
    return WebhookEventType.ORDER_CREATED;
  }

  getPlatformAdapter(platform: IntegrationPlatform): PlatformAdapter | undefined {
    return this.adapters.get(platform);
  }
}
