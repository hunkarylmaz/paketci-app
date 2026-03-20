import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantPlatformConfig } from './entities/restaurant-platform-config.entity';
import { YemeksepetiAdapter, IPlatformAdapter, PlatformOrder } from './adapters/yemeksepeti.adapter';
import { GetirAdapter } from './adapters/getir.adapter';

interface IntegrationConfig {
  platform: string;
  apiKey: string;
  apiSecret: string;
  merchantId: string;
  branchId?: string;
  autoAccept: boolean;
  isOpen: boolean;
}

interface IntegrationStatus {
  platform: string;
  connected: boolean;
  lastSyncAt?: Date;
  error?: string;
  pendingOrders: number;
  todayOrders: number;
}

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);
  private adapters: Map<string, IPlatformAdapter> = new Map();

  constructor(
    @InjectRepository(RestaurantPlatformConfig)
    private configRepo: Repository<RestaurantPlatformConfig>,
    private httpService: HttpService,
  ) {
    // Adapter'ları kaydet
    this.adapters.set('yemeksepeti', new YemeksepetiAdapter(httpService));
    this.adapters.set('getir', new GetirAdapter(httpService));
  }

  // ==================== RESTORAN API KEY YÖNETİMİ ====================

  /**
   * Restoran için platform entegrasyonu kaydet/güncelle
   */
  async saveIntegration(
    restaurantId: string,
    config: IntegrationConfig,
  ): Promise<RestaurantPlatformConfig> {
    // Şifreleme için AES kullan
    const encryptedApiKey = this.encrypt(config.apiKey);
    const encryptedApiSecret = this.encrypt(config.apiSecret);

    let entity = await this.configRepo.findOne({
      where: { restaurantId, platform: config.platform },
    });

    if (entity) {
      // Güncelle
      entity.apiKey = encryptedApiKey;
      entity.apiSecret = encryptedApiSecret;
      entity.merchantId = config.merchantId;
      entity.branchId = config.branchId;
      entity.autoAcceptOrders = config.autoAccept;
      entity.isOpen = config.isOpen;
    } else {
      // Yeni oluştur
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

  /**
   * Restoran'ın tüm entegrasyonlarını getir
   */
  async getRestaurantIntegrations(restaurantId: string): Promise<IntegrationStatus[]> {
    const configs = await this.configRepo.find({
      where: { restaurantId },
    });

    return Promise.all(
      configs.map(async (config) => {
        const status = await this.checkConnection(config);
        return {
          platform: config.platform,
          connected: status,
          lastSyncAt: config.lastSyncAt,
          pendingOrders: 0, // TODO: Count from DB
          todayOrders: 0,   // TODO: Count from DB
        };
      }),
    );
  }

  /**
   * Platform bağlantısını test et
   */
  async testConnection(
    restaurantId: string,
    platform: string,
  ): Promise<{ success: boolean; message: string }> {
    const config = await this.configRepo.findOne({
      where: { restaurantId, platform },
    });

    if (!config) {
      throw new HttpException(
        'Entegrasyon bulunamadı',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const adapter = this.adapters.get(platform);
      if (!adapter) {
        throw new HttpException(
          'Platform adapter bulunamadı',
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      // API key'leri çöz
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
      } else {
        config.status = 'error';
        config.lastError = 'Kimlik doğrulama başarısız';
        await this.configRepo.save(config);

        return {
          success: false,
          message: 'API bilgileri geçersiz',
        };
      }
    } catch (error) {
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

  /**
   * Platformdan siparişleri çek
   */
  async fetchOrders(
    restaurantId: string,
    platform: string,
  ): Promise<PlatformOrder[]> {
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

    // API key'leri çöz
    const decryptedConfig = {
      ...config,
      apiKey: this.decrypt(config.apiKey),
      apiSecret: this.decrypt(config.apiSecret),
    };

    const orders = await adapter.getOrders(decryptedConfig);

    // Son senkronizasyon zamanını güncelle
    config.lastSyncAt = new Date();
    await this.configRepo.save(config);

    return orders;
  }

  /**
   * Restoran durumunu değiştir (açık/kapalı)
   */
  async toggleRestaurantStatus(
    restaurantId: string,
    platform: string,
    isOpen: boolean,
  ): Promise<boolean> {
    const config = await this.configRepo.findOne({
      where: { restaurantId, platform },
    });

    if (!config) {
      throw new HttpException('Entegrasyon bulunamadı', HttpStatus.NOT_FOUND);
    }

    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new HttpException('Platform desteklenmiyor', HttpStatus.NOT_IMPLEMENTED);
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

  /**
   * Siparişi kabul et
   */
  async acceptOrder(
    restaurantId: string,
    platform: string,
    orderId: string,
  ): Promise<boolean> {
    const config = await this.configRepo.findOne({
      where: { restaurantId, platform },
    });

    if (!config) return false;

    const adapter = this.adapters.get(platform);
    if (!adapter) return false;

    const decryptedConfig = {
      ...config,
      apiKey: this.decrypt(config.apiKey),
      apiSecret: this.decrypt(config.apiSecret),
    };

    return adapter.acceptOrder(decryptedConfig, orderId);
  }

  /**
   * Siparişi reddet
   */
  async rejectOrder(
    restaurantId: string,
    platform: string,
    orderId: string,
    reason: string,
  ): Promise<boolean> {
    const config = await this.configRepo.findOne({
      where: { restaurantId, platform },
    });

    if (!config) return false;

    const adapter = this.adapters.get(platform);
    if (!adapter) return false;

    const decryptedConfig = {
      ...config,
      apiKey: this.decrypt(config.apiKey),
      apiSecret: this.decrypt(config.apiSecret),
    };

    return adapter.rejectOrder(decryptedConfig, orderId, reason);
  }

  // ==================== YARDIMCI METODLAR ====================

  private async checkConnection(config: RestaurantPlatformConfig): Promise<boolean> {
    if (config.status !== 'connected') return false;
    
    // Son 1 saatte senkronizasyon varsa bağlı kabul et
    if (config.lastSyncAt) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return config.lastSyncAt > oneHourAgo;
    }
    
    return false;
  }

  private encrypt(text: string): string {
    // TODO: Implement proper AES encryption
    // For now, simple base64 (NOT SECURE - replace with AES-256)
    return Buffer.from(text).toString('base64');
  }

  private decrypt(encrypted: string): string {
    // TODO: Implement proper AES decryption
    return Buffer.from(encrypted, 'base64').toString('utf8');
  }

  /**
   * Webhook URL'si oluştur
   */
  getWebhookUrl(platform: string, restaurantId: string): string {
    const baseUrl = process.env.API_URL || 'https://api.paketci.app';
    return `${baseUrl}/api/webhooks/${platform}/${restaurantId}`;
  }
}
