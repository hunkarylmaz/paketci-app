"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IntegrationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const integration_entity_1 = require("./entities/integration.entity");
const webhook_event_entity_1 = require("./entities/webhook-event.entity");
const yemeksepeti_adapter_1 = require("./adapters/yemeksepeti.adapter");
const migrosyemek_adapter_1 = require("./adapters/migrosyemek.adapter");
const trendyolyemek_adapter_1 = require("./adapters/trendyolyemek.adapter");
const getiryemek_adapter_1 = require("./adapters/getiryemek.adapter");
let IntegrationsService = IntegrationsService_1 = class IntegrationsService {
    constructor(integrationRepository, webhookEventRepository, yemeksepetiAdapter, migrosAdapter, trendyolAdapter, getirAdapter) {
        this.integrationRepository = integrationRepository;
        this.webhookEventRepository = webhookEventRepository;
        this.yemeksepetiAdapter = yemeksepetiAdapter;
        this.migrosAdapter = migrosAdapter;
        this.trendyolAdapter = trendyolAdapter;
        this.getirAdapter = getirAdapter;
        this.logger = new common_1.Logger(IntegrationsService_1.name);
        this.adapters = new Map();
        this.adapters.set(integration_entity_1.IntegrationPlatform.YEMEK_SEPETI, yemeksepetiAdapter);
        this.adapters.set(integration_entity_1.IntegrationPlatform.MIGROS_YEMEK, migrosAdapter);
        this.adapters.set(integration_entity_1.IntegrationPlatform.TRENDYOL_YEMEK, trendyolAdapter);
        this.adapters.set(integration_entity_1.IntegrationPlatform.GETIR_YEMEK, getirAdapter);
    }
    async findAll(restaurantId) {
        const query = this.integrationRepository.createQueryBuilder('integration')
            .leftJoinAndSelect('integration.restaurant', 'restaurant');
        if (restaurantId) {
            query.where('integration.restaurantId = :restaurantId', { restaurantId });
        }
        return query.getMany();
    }
    async findOne(id) {
        const integration = await this.integrationRepository.findOne({
            where: { id },
            relations: ['restaurant'],
        });
        if (!integration) {
            throw new common_1.NotFoundException('Integration not found');
        }
        return integration;
    }
    async findByPlatform(restaurantId, platform) {
        return this.integrationRepository.findOne({
            where: { restaurantId, platform },
        });
    }
    async create(dto) {
        const existing = await this.findByPlatform(dto.restaurantId, dto.platform);
        if (existing) {
            throw new Error('Integration already exists for this platform');
        }
        const integration = this.integrationRepository.create({
            ...dto,
            webhookUrl: dto.webhookUrl || `https://api.paketci.app/webhooks/${dto.platform}`,
            status: integration_entity_1.IntegrationStatus.PENDING,
        });
        return this.integrationRepository.save(integration);
    }
    async update(id, dto) {
        const integration = await this.findOne(id);
        Object.assign(integration, dto);
        return this.integrationRepository.save(integration);
    }
    async remove(id) {
        const integration = await this.findOne(id);
        await this.integrationRepository.remove(integration);
    }
    async testConnection(dto) {
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
    async syncOrders(integrationId, filters) {
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
        const normalizedOrders = rawOrders.map(order => adapter.normalizeOrder(order));
        await this.integrationRepository.update(integrationId, {
            lastSyncAt: new Date(),
            status: integration_entity_1.IntegrationStatus.ACTIVE,
        });
        return normalizedOrders;
    }
    async handleWebhook(platform, payload, signature) {
        this.logger.log(`Received webhook from ${platform}`);
        const integrations = await this.integrationRepository.find({
            where: { platform, status: integration_entity_1.IntegrationStatus.ACTIVE },
        });
        for (const integration of integrations) {
            try {
                const adapter = this.adapters.get(platform);
                if (!adapter) {
                    this.logger.warn(`No adapter found for platform ${platform}`);
                    continue;
                }
                if (integration.webhookSecret && signature) {
                    const isValid = adapter.validateWebhook(payload, integration.webhookSecret);
                    if (!isValid) {
                        this.logger.warn(`Invalid webhook signature for integration ${integration.id}`);
                        continue;
                    }
                }
                const webhookEvent = this.webhookEventRepository.create({
                    integrationId: integration.id,
                    platform,
                    eventType: this.detectEventType(payload, platform),
                    rawPayload: JSON.stringify(payload),
                    processedData: adapter.normalizeOrder(payload),
                    status: webhook_event_entity_1.WebhookStatus.PENDING,
                });
                await this.webhookEventRepository.save(webhookEvent);
                await this.processWebhookEvent(webhookEvent);
            }
            catch (error) {
                this.logger.error(`Error handling webhook for integration ${integration.id}`, error);
                await this.integrationRepository.update(integration.id, {
                    status: integration_entity_1.IntegrationStatus.ERROR,
                    lastError: error.message,
                });
            }
        }
    }
    async processWebhookEvent(event) {
        try {
            await this.webhookEventRepository.update(event.id, {
                status: webhook_event_entity_1.WebhookStatus.PROCESSING,
            });
            const orderData = event.processedData;
            await this.webhookEventRepository.update(event.id, {
                status: webhook_event_entity_1.WebhookStatus.SUCCESS,
                processedAt: new Date(),
            });
        }
        catch (error) {
            await this.webhookEventRepository.update(event.id, {
                status: webhook_event_entity_1.WebhookStatus.FAILED,
                errorMessage: error.message,
            });
            throw error;
        }
    }
    async createOrderFromExtension(restaurantId, orderData) {
        this.logger.log(`Creating order from Chrome Extension for restaurant ${restaurantId}`);
        const normalizedOrder = {
            ...orderData,
            platform: orderData.platform || 'chrome_extension',
            metadata: {
                ...orderData.metadata,
                source: 'chrome_extension',
                createdAt: new Date().toISOString(),
            },
        };
        return {
            success: true,
            orderId: `ORD-${Date.now()}`,
            message: 'Order created successfully',
        };
    }
    detectEventType(payload, platform) {
        switch (platform) {
            case integration_entity_1.IntegrationPlatform.YEMEK_SEPETI:
                if (payload.eventType === 'ORDER_CREATED')
                    return webhook_event_entity_1.WebhookEventType.ORDER_CREATED;
                if (payload.eventType === 'ORDER_STATUS_UPDATED')
                    return webhook_event_entity_1.WebhookEventType.ORDER_STATUS_CHANGED;
                break;
            case integration_entity_1.IntegrationPlatform.MIGROS_YEMEK:
                if (payload.event === 'order.created')
                    return webhook_event_entity_1.WebhookEventType.ORDER_CREATED;
                break;
            case integration_entity_1.IntegrationPlatform.TRENDYOL_YEMEK:
                if (payload.eventType === 'ORDER_PLACED')
                    return webhook_event_entity_1.WebhookEventType.ORDER_CREATED;
                break;
            case integration_entity_1.IntegrationPlatform.GETIR_YEMEK:
                if (payload.status === 'PLACED')
                    return webhook_event_entity_1.WebhookEventType.ORDER_CREATED;
                break;
        }
        return webhook_event_entity_1.WebhookEventType.ORDER_CREATED;
    }
    getPlatformAdapter(platform) {
        return this.adapters.get(platform);
    }
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = IntegrationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(integration_entity_1.Integration)),
    __param(1, (0, typeorm_1.InjectRepository)(webhook_event_entity_1.WebhookEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        yemeksepeti_adapter_1.YemeksepetiAdapter,
        migrosyemek_adapter_1.MigrosYemekAdapter,
        trendyolyemek_adapter_1.TrendyolYemekAdapter,
        getiryemek_adapter_1.GetirYemekAdapter])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map