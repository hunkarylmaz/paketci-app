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
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const restaurant_platform_config_entity_1 = require("./entities/restaurant-platform-config.entity");
const yemeksepeti_adapter_1 = require("./adapters/yemeksepeti.adapter");
const getir_adapter_1 = require("./adapters/getir.adapter");
let IntegrationsService = IntegrationsService_1 = class IntegrationsService {
    constructor(configRepo, httpService) {
        this.configRepo = configRepo;
        this.httpService = httpService;
        this.logger = new common_1.Logger(IntegrationsService_1.name);
        this.adapters = new Map();
        this.adapters.set('yemeksepeti', new yemeksepeti_adapter_1.YemeksepetiAdapter(httpService));
        this.adapters.set('getir', new getir_adapter_1.GetirAdapter(httpService));
    }
    async saveIntegration(restaurantId, config) {
        const encryptedApiKey = this.encrypt(config.apiKey);
        const encryptedApiSecret = this.encrypt(config.apiSecret);
        let entity = await this.configRepo.findOne({
            where: { restaurantId, platform: config.platform },
        });
        if (entity) {
            entity.apiKey = encryptedApiKey;
            entity.apiSecret = encryptedApiSecret;
            entity.merchantId = config.merchantId;
            entity.branchId = config.branchId;
            entity.autoAcceptOrders = config.autoAccept;
            entity.isOpen = config.isOpen;
        }
        else {
            entity = this.configRepo.create({
                restaurantId,
                platform: config.platform,
                apiKey: encryptedApiKey,
                apiSecret: encryptedApiSecret,
                merchantId: config.merchantId,
                branchId: config.branchId,
                autoAcceptOrders: config.autoAccept,
                isOpen: config.isOpen,
                status: 'pending_setup',
            });
        }
        return this.configRepo.save(entity);
    }
    async getRestaurantIntegrations(restaurantId) {
        const configs = await this.configRepo.find({
            where: { restaurantId },
        });
        return Promise.all(configs.map(async (config) => {
            const status = await this.checkConnection(config);
            return {
                platform: config.platform,
                connected: status,
                lastSyncAt: config.lastSyncAt,
                pendingOrders: 0,
                todayOrders: 0,
            };
        }));
    }
    async testConnection(restaurantId, platform) {
        const config = await this.configRepo.findOne({
            where: { restaurantId, platform },
        });
        if (!config) {
            throw new common_1.HttpException('Entegrasyon bulunamadı', common_1.HttpStatus.NOT_FOUND);
        }
        try {
            const adapter = this.adapters.get(platform);
            if (!adapter) {
                throw new common_1.HttpException('Platform adapter bulunamadı', common_1.HttpStatus.NOT_IMPLEMENTED);
            }
            const decryptedConfig = {
                ...config,
                apiKey: this.decrypt(config.apiKey),
                apiSecret: this.decrypt(config.apiSecret),
            };
            const success = await adapter.authenticate(decryptedConfig);
            if (success) {
                config.status = 'connected';
                config.connectedAt = new Date();
                await this.configRepo.save(config);
                return {
                    success: true,
                    message: 'Bağlantı başarılı!',
                };
            }
            else {
                config.status = 'error';
                config.lastError = 'Kimlik doğrulama başarısız';
                await this.configRepo.save(config);
                return {
                    success: false,
                    message: 'API bilgileri geçersiz',
                };
            }
        }
        catch (error) {
            this.logger.error(`Connection test failed for ${platform}`, error);
            config.status = 'error';
            config.lastError = error.message;
            await this.configRepo.save(config);
            return {
                success: false,
                message: `Bağlantı hatası: ${error.message}`,
            };
        }
    }
    async fetchOrders(restaurantId, platform) {
        const config = await this.configRepo.findOne({
            where: { restaurantId, platform },
        });
        if (!config || config.status !== 'connected') {
            return [];
        }
        const adapter = this.adapters.get(platform);
        if (!adapter) {
            return [];
        }
        const decryptedConfig = {
            ...config,
            apiKey: this.decrypt(config.apiKey),
            apiSecret: this.decrypt(config.apiSecret),
        };
        const orders = await adapter.getOrders(decryptedConfig);
        config.lastSyncAt = new Date();
        await this.configRepo.save(config);
        return orders;
    }
    async toggleRestaurantStatus(restaurantId, platform, isOpen) {
        const config = await this.configRepo.findOne({
            where: { restaurantId, platform },
        });
        if (!config) {
            throw new common_1.HttpException('Entegrasyon bulunamadı', common_1.HttpStatus.NOT_FOUND);
        }
        const adapter = this.adapters.get(platform);
        if (!adapter) {
            throw new common_1.HttpException('Platform desteklenmiyor', common_1.HttpStatus.NOT_IMPLEMENTED);
        }
        const decryptedConfig = {
            ...config,
            apiKey: this.decrypt(config.apiKey),
            apiSecret: this.decrypt(config.apiSecret),
        };
        const success = await adapter.toggleRestaurantStatus(decryptedConfig, isOpen);
        if (success) {
            config.isOpen = isOpen;
            await this.configRepo.save(config);
        }
        return success;
    }
    async acceptOrder(restaurantId, platform, orderId) {
        const config = await this.configRepo.findOne({
            where: { restaurantId, platform },
        });
        if (!config)
            return false;
        const adapter = this.adapters.get(platform);
        if (!adapter)
            return false;
        const decryptedConfig = {
            ...config,
            apiKey: this.decrypt(config.apiKey),
            apiSecret: this.decrypt(config.apiSecret),
        };
        return adapter.acceptOrder(decryptedConfig, orderId);
    }
    async rejectOrder(restaurantId, platform, orderId, reason) {
        const config = await this.configRepo.findOne({
            where: { restaurantId, platform },
        });
        if (!config)
            return false;
        const adapter = this.adapters.get(platform);
        if (!adapter)
            return false;
        const decryptedConfig = {
            ...config,
            apiKey: this.decrypt(config.apiKey),
            apiSecret: this.decrypt(config.apiSecret),
        };
        return adapter.rejectOrder(decryptedConfig, orderId, reason);
    }
    async checkConnection(config) {
        if (config.status !== 'connected')
            return false;
        if (config.lastSyncAt) {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            return config.lastSyncAt > oneHourAgo;
        }
        return false;
    }
    encrypt(text) {
        return Buffer.from(text).toString('base64');
    }
    decrypt(encrypted) {
        return Buffer.from(encrypted, 'base64').toString('utf8');
    }
    getWebhookUrl(platform, restaurantId) {
        const baseUrl = process.env.API_URL || 'https://api.paketci.app';
        return `${baseUrl}/api/webhooks/${platform}/${restaurantId}`;
    }
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = IntegrationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_platform_config_entity_1.RestaurantPlatformConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map