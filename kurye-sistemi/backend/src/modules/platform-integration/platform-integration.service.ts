// ============================================
// PLATFORM INTEGRATION MODULE
// Yemeksepeti, Trendyol, Migros, Getir, Fuudy
// ============================================

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

// ============================================
// ENTITIES
// ============================================

@Entity('platform_integrations')
export class PlatformIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantId: string;

  @Column({
    type: 'enum',
    enum: ['YEMEKSEPETI', 'TRENDYOL', 'MIGROS', 'GETIR_YEMEK', 'GETIR_CARSI', 'FUUDY']
  })
  platform: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb' })
  authConfig: {
    type: 'OAUTH2' | 'API_KEY';
    clientId?: string;
    clientSecret?: string;
    apiKey?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };

  @Column({ type: 'jsonb' })
  syncConfig: {
    orderPolling: boolean;
    pollingInterval: number;
    menuSync: boolean;
    autoAccept: boolean;
  };

  @Column()
  webhookSecret: string;

  @Column({ nullable: true })
  lastSyncAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('webhook_logs')
export class WebhookLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  platform: string;

  @Column()
  eventType: string;

  @Column({ type: 'jsonb' })
  payload: any;

  @Column()
  signature: string;

  @Column()
  isValid: boolean;

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================
// STANDARD ORDER INTERFACE
// ============================================

export interface StandardOrder {
  id: string;
  externalId: string;
  platform: string;
  restaurantId: string;

  customer: {
    name: string;
    phone: string;
    address: {
      full: string;
      district: string;
      city: string;
      latitude?: number;
      longitude?: number;
    };
    note: string;
  };

  items: {
    externalId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    options: { name: string; price: number }[];
    notes: string;
    total: number;
  }[];

  payment: {
    method: 'CREDIT_CARD' | 'CASH' | 'ONLINE';
    total: number;
    deliveryFee: number;
    discount: number;
    tip: number;
    platformCommission: number;
  };

  timing: {
    createdAt: Date;
    estimatedDelivery: Date;
    preparationTime: number;
  };

  status: OrderStatus;
}

export enum OrderStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// ============================================
// PLATFORM ADAPTERS
// ============================================

export interface PlatformAdapter {
  transform(externalData: any): StandardOrder;
  transformStatus(internalStatus: OrderStatus): string;
  verifyWebhook(payload: any, signature: string, secret: string): boolean;
}

@Injectable()
export class YemeksepetiAdapter implements PlatformAdapter {
  transform(externalData: any): StandardOrder {
    return {
      id: crypto.randomUUID(),
      externalId: externalData.orderId,
      platform: 'YEMEKSEPETI',
      restaurantId: externalData.restaurantId,

      customer: {
        name: `${externalData.customer.firstName} ${externalData.customer.lastName}`,
        phone: externalData.customer.phone,
        address: {
          full: externalData.deliveryAddress.address,
          district: externalData.deliveryAddress.district,
          city: externalData.deliveryAddress.city,
          latitude: externalData.deliveryAddress.latitude,
          longitude: externalData.deliveryAddress.longitude,
        },
        note: externalData.deliveryAddress.note || '',
      },

      items: externalData.items.map((item: any) => ({
        externalId: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        options: item.extras?.map((e: any) => ({ name: e.name, price: e.price })) || [],
        notes: item.note || '',
        total: item.totalPrice,
      })),

      payment: {
        method: externalData.payment.type === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'CASH',
        total: externalData.totalAmount,
        deliveryFee: externalData.deliveryFee || 0,
        discount: externalData.discountAmount || 0,
        tip: externalData.tip || 0,
        platformCommission: externalData.commissionAmount || 0,
      },

      timing: {
        createdAt: new Date(externalData.createdAt),
        estimatedDelivery: new Date(externalData.estimatedDeliveryTime),
        preparationTime: externalData.preparationTime || 30,
      },

      status: OrderStatus.NEW,
    };
  }

  transformStatus(internalStatus: OrderStatus): string {
    const statusMap = {
      [OrderStatus.CONFIRMED]: 'CONFIRMED',
      [OrderStatus.PREPARING]: 'PREPARING',
      [OrderStatus.READY]: 'READY',
      [OrderStatus.ASSIGNED]: 'COURIER_ASSIGNED',
      [OrderStatus.PICKED_UP]: 'PICKED_UP',
      [OrderStatus.IN_TRANSIT]: 'ON_THE_WAY',
      [OrderStatus.DELIVERED]: 'DELIVERED',
      [OrderStatus.CANCELLED]: 'CANCELLED',
    };
    return statusMap[internalStatus] || 'NEW';
  }

  verifyWebhook(payload: any, signature: string, secret: string): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    const computed = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
  }
}

// Diğer adapterlar benzer şekilde...
@Injectable()
export class GetirAdapter implements PlatformAdapter {
  transform(externalData: any): StandardOrder {
    // Getir formatına göre dönüşüm
    return {
      id: crypto.randomUUID(),
      externalId: externalData.id,
      platform: externalData.type === 'RESTAURANT' ? 'GETIR_YEMEK' : 'GETIR_CARSI',
      restaurantId: externalData.restaurantId,
      customer: {
        name: externalData.client.name,
        phone: externalData.client.phoneNumber,
        address: {
          full: externalData.client.address.text,
          district: externalData.client.address.district,
          city: externalData.client.address.city,
        },
        note: externalData.client.note || '',
      },
      items: externalData.basket.items.map((item: any) => ({
        externalId: item.product.id,
        name: item.product.name,
        quantity: item.count,
        unitPrice: item.product.price,
        options: item.selectedOptions?.map((o: any) => ({ name: o.name, price: o.price })) || [],
        notes: item.note || '',
        total: item.totalPrice,
      })),
      payment: {
        method: externalData.paymentType === 'ONLINE' ? 'ONLINE' : 'CASH',
        total: externalData.totalPrice,
        deliveryFee: externalData.deliveryFee,
        discount: externalData.discounts?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0,
        tip: externalData.tip || 0,
        platformCommission: externalData.commission || 0,
      },
      timing: {
        createdAt: new Date(externalData.createdAt),
        estimatedDelivery: new Date(externalData.promisedDeliveryTime),
        preparationTime: 30,
      },
      status: OrderStatus.NEW,
    };
  }

  transformStatus(internalStatus: OrderStatus): string {
    const statusMap = {
      [OrderStatus.CONFIRMED]: 'PREPARATION',
      [OrderStatus.PREPARING]: 'PREPARING',
      [OrderStatus.READY]: 'PREPARED',
      [OrderStatus.ASSIGNED]: 'COURIER_ASSIGNED',
      [OrderStatus.PICKED_UP]: 'PICKED_UP',
      [OrderStatus.IN_TRANSIT]: 'ON_THE_WAY',
      [OrderStatus.DELIVERED]: 'DELIVERED',
      [OrderStatus.CANCELLED]: 'CANCELLED',
    };
    return statusMap[internalStatus] || 'NEW';
  }

  verifyWebhook(payload: any, signature: string, secret: string): boolean {
    // Getir webhook verification
    const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('base64');
    return signature === expected;
  }
}

// ============================================
// PLATFORM SERVICE
// ============================================

@Injectable()
export class PlatformIntegrationService {
  private readonly logger = new Logger(PlatformIntegrationService.name);
  private adapters: Map<string, PlatformAdapter> = new Map();

  constructor(
    @InjectRepository(PlatformIntegration)
    private platformRepo: Repository<PlatformIntegration>,
    @InjectRepository(WebhookLog)
    private webhookLogRepo: Repository<WebhookLog>,
    private httpService: HttpService,
    @InjectRedis() private redis: Redis,
    private notificationService: NotificationService,
  ) {
    // Adapterları kaydet
    this.adapters.set('YEMEKSEPETI', new YemeksepetiAdapter());
    this.adapters.set('GETIR_YEMEK', new GetirAdapter());
    this.adapters.set('GETIR_CARSI', new GetirAdapter());
    // Diğer adapterlar...
  }

  // Webhook handler - Tüm platformlar için
  async handleWebhook(platform: string, payload: any, signature: string): Promise<void> {
    const integration = await this.platformRepo.findOne({
      where: { platform, isActive: true },
    });

    if (!integration) {
      this.logger.warn(`No active integration found for ${platform}`);
      return;
    }

    // Webhook log kaydet
    const log = this.webhookLogRepo.create({
      platform,
      eventType: payload.event || payload.type || 'UNKNOWN',
      payload,
      signature,
      isValid: false,
    });

    try {
      // Adapter'ı al
      const adapter = this.adapters.get(platform);
      if (!adapter) {
        throw new Error(`No adapter found for ${platform}`);
      }

      // Webhook doğrulama
      const isValid = adapter.verifyWebhook(payload, signature, integration.webhookSecret);
      log.isValid = isValid;

      if (!isValid) {
        this.logger.warn(`Invalid webhook signature for ${platform}`);
        await this.webhookLogRepo.save(log);
        return;
      }

      // Sipariş verisini standart formata çevir
      const standardOrder = adapter.transform(payload);

      // Siparişi kaydet ve bildirim gönder
      await this.processOrder(standardOrder);

      log.processedAt = new Date();
      await this.webhookLogRepo.save(log);

      this.logger.log(`Order ${standardOrder.externalId} from ${platform} processed successfully`);
    } catch (error) {
      log.errorMessage = error.message;
      await this.webhookLogRepo.save(log);
      this.logger.error(`Error processing webhook from ${platform}: ${error.message}`);
      throw error;
    }
  }

  // Sipariş işleme
  private async processOrder(order: StandardOrder): Promise<void> {
    // Siparişi veritabanına kaydet
    // await this.orderRepo.save(order);

    // Redis'e kuyruğa ekle (gerçek zamanlı işlem için)
    await this.redis.lpush('orders:pending', JSON.stringify(order));

    // Restorana bildirim gönder
    await this.notificationService.send({
      type: 'NEW_ORDER',
      priority: 'HIGH',
      recipients: { restaurantId: order.restaurantId },
      content: {
        title: '📦 Yeni Sipariş!',
        body: `Sipariş #${order.externalId} - ₺${order.payment.total}`,
        data: { orderId: order.id },
      },
      channels: ['PUSH', 'WEBSOCKET'],
    });

    // WebSocket üzerinden anlık bildirim
    // this.wsServer.to(`restaurant:${order.restaurantId}`).emit('new_order', order);
  }

  // Platform API'ye durum gönderme
  async updateOrderStatus(
    integrationId: string,
    externalOrderId: string,
    status: OrderStatus,
  ): Promise<void> {
    const integration = await this.platformRepo.findOne({ where: { id: integrationId } });
    if (!integration) throw new Error('Integration not found');

    const adapter = this.adapters.get(integration.platform);
    if (!adapter) throw new Error('Adapter not found');

    const platformStatus = adapter.transformStatus(status);

    // Platform API'sine gönder
    const endpoint = this.getPlatformEndpoint(integration.platform, 'updateStatus');
    
    await firstValueFrom(
      this.httpService.post(
        endpoint,
        {
          orderId: externalOrderId,
          status: platformStatus,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${integration.authConfig.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );
  }

  // Platform endpoint'lerini al
  private getPlatformEndpoint(platform: string, action: string): string {
    const endpoints = {
      YEMEKSEPETI: {
        updateStatus: 'https://api.yemeksepeti.com/v1/orders/status',
      },
      GETIR_YEMEK: {
        updateStatus: 'https://api.getir.com/yemek/v1/orders/status',
      },
      // ... diğer platformlar
    };
    return endpoints[platform]?.[action] || '';
  }

  // Periyodik sipariş çekme (polling - webhook yedek)
  @Cron('*/30 * * * * *') // Her 30 saniye
  async pollOrders(): Promise<void> {
    const integrations = await this.platformRepo.find({
      where: { isActive: true, syncConfig: { orderPolling: true } },
    });

    for (const integration of integrations) {
      try {
        await this.pollPlatformOrders(integration);
      } catch (error) {
        this.logger.error(`Polling error for ${integration.platform}: ${error.message}`);
      }
    }
  }

  private async pollPlatformOrders(integration: PlatformIntegration): Promise<void> {
    const lastSync = integration.lastSyncAt || new Date(Date.now() - 5 * 60 * 1000);
    
    const endpoint = this.getPollingEndpoint(integration.platform);
    
    const response = await firstValueFrom(
      this.httpService.get(endpoint, {
        headers: { Authorization: `Bearer ${integration.authConfig.accessToken}` },
        params: { since: lastSync.toISOString() },
      }),
    );

    const orders = response.data.orders || [];
    
    for (const externalOrder of orders) {
      const adapter = this.adapters.get(integration.platform);
      const standardOrder = adapter.transform(externalOrder);
      standardOrder.restaurantId = integration.restaurantId;
      
      await this.processOrder(standardOrder);
    }

    integration.lastSyncAt = new Date();
    await this.platformRepo.save(integration);
  }

  private getPollingEndpoint(platform: string): string {
    const endpoints = {
      YEMEKSEPETI: 'https://api.yemeksepeti.com/v1/orders',
      GETIR_YEMEK: 'https://api.getir.com/yemek/v1/orders',
      TRENDYOL: 'https://api.trendyol.com/meal/v1/orders',
      MIGROS: 'https://api.migros.com/yemek/v1/orders',
      FUUDY: 'https://api.fuudy.com/v1/orders',
    };
    return endpoints[platform] || '';
  }
}
