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
import { PlatformIntegration } from './entities/platform-integration.entity';
import { WebhookLog } from './entities/webhook-log.entity';

// ============================================
// STANDARD ORDER INTERFACE
// ============================================

export interface StandardOrder {
  platformOrderId: string;
  platform: string;
  orderType: 'DELIVERY' | 'PICKUP';
  customer: {
    name: string;
    phone: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    floor?: string;
    apartment?: string;
    doorNumber?: string;
    note?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    options?: string[];
    note?: string;
  }>;
  totals: {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
  };
  payment: {
    method: 'ONLINE' | 'CASH' | 'CARD_AT_DOOR';
    isPaid: boolean;
  };
  timing: {
    preparationTime?: number;
    estimatedDeliveryTime?: Date;
  };
  rawPayload: any;
}

export interface PlatformMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  categoryName: string;
  isAvailable: boolean;
  imageUrl?: string;
  options?: any[];
}

// ============================================
// PLATFORM ADAPTER INTERFACE
// ============================================

export interface PlatformAdapter {
  authenticate(config: any): Promise<{ accessToken: string; expiresAt: Date }>;
  refreshToken(config: any): Promise<{ accessToken: string; expiresAt: Date }>;
  fetchOrders(config: any, since?: Date): Promise<StandardOrder[]>;
  acceptOrder(config: any, orderId: string): Promise<void>;
  rejectOrder(config: any, orderId: string, reason: string): Promise<void>;
  updateOrderStatus(config: any, orderId: string, status: string): Promise<void>;
  fetchMenu(config: any): Promise<PlatformMenuItem[]>;
  updateMenuItem(config: any, item: PlatformMenuItem): Promise<void>;
  validateWebhookSignature(payload: any, signature: string, secret: string): boolean;
}

// ============================================
// SERVICE
// ============================================

@WebSocketGateway({ namespace: 'platform-integration', cors: { origin: '*' } })
@Injectable()
export class PlatformIntegrationService {
  @WebSocketServer()
  private wsServer: Server;

  private readonly adapters = new Map<string, PlatformAdapter>();

  constructor(
    @InjectRepository(PlatformIntegration)
    private integrationRepo: Repository<PlatformIntegration>,
    @InjectRepository(WebhookLog)
    private webhookLogRepo: Repository<WebhookLog>,
    private httpService: HttpService,
    @InjectRedis() private redis: Redis,
  ) {}

  private readonly logger = new Logger(PlatformIntegrationService.name);

  // Platform adapter register
  registerAdapter(platform: string, adapter: PlatformAdapter) {
    this.adapters.set(platform, adapter);
    this.logger.log(`Adapter registered for ${platform}`);
  }

  // ============================================
  // AUTHENTICATION
  // ============================================

  async authenticatePlatform(
    restaurantId: string,
    platform: string,
    credentials: any,
  ): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    try {
      const adapter = this.adapters.get(platform);
      if (!adapter) {
        return { success: false, error: 'Platform adapter not found' };
      }

      const auth = await adapter.authenticate(credentials);

      // Save to database
      let integration = await this.integrationRepo.findOne({
        where: { restaurantId, platform },
      });

      if (!integration) {
        integration = this.integrationRepo.create({
          restaurantId,
          platform,
          authConfig: {
            type: credentials.type || 'API_KEY',
            ...credentials,
            accessToken: auth.accessToken,
          },
          syncConfig: {
            orderPolling: true,
            pollingInterval: 60,
            menuSync: true,
            autoAccept: false,
          },
          webhookSecret: crypto.randomBytes(32).toString('hex'),
        });
      } else {
        integration.authConfig = {
          ...integration.authConfig,
          accessToken: auth.accessToken,
        };
      }

      await this.integrationRepo.save(integration);

      return { success: true, accessToken: auth.accessToken };
    } catch (error) {
      this.logger.error(`Authentication failed for ${platform}`, error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // ORDER SYNC
  // ============================================

  async syncOrders(
    restaurantId: string,
    platform: string,
  ): Promise<{ synced: number; orders: StandardOrder[] }> {
    const integration = await this.integrationRepo.findOne({
      where: { restaurantId, platform, isActive: true },
    });

    if (!integration) {
      throw new Error('Integration not found');
    }

    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new Error('Adapter not found');
    }

    const lastSync = integration.lastSyncAt || new Date(Date.now() - 24 * 60 * 60 * 1000);
    const orders = await adapter.fetchOrders(integration.authConfig, lastSync);

    // Cache orders in Redis for real-time processing
    for (const order of orders) {
      await this.redis.setex(
        `order:${platform}:${order.platformOrderId}`,
        3600,
        JSON.stringify(order),
      );

      // Broadcast via WebSocket
      this.wsServer.emit(`restaurant:${restaurantId}:new_order`, order);
    }

    // Update last sync time
    integration.lastSyncAt = new Date();
    await this.integrationRepo.save(integration);

    return { synced: orders.length, orders };
  }

  // ============================================
  // WEBHOOK HANDLING
  // ============================================

  async handleWebhook(
    platform: string,
    payload: any,
    signature: string,
  ): Promise<{ success: boolean; order?: StandardOrder }> {
    const log = this.webhookLogRepo.create({
      platform,
      eventType: payload.eventType || 'unknown',
      payload,
      signature,
      isValid: false,
    });

    try {
      // Find integration by webhook secret
      const integration = await this.integrationRepo.findOne({
        where: { platform, isActive: true },
      });

      if (!integration) {
        throw new Error('Integration not found');
      }

      const adapter = this.adapters.get(platform);
      if (!adapter) {
        throw new Error('Adapter not found');
      }

      // Validate signature
      const isValid = adapter.validateWebhookSignature(
        payload,
        signature,
        integration.webhookSecret,
      );

      log.isValid = isValid;

      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      // Process based on event type
      if (payload.eventType === 'NEW_ORDER') {
        const order = await this.processNewOrder(platform, payload);
        log.processedAt = new Date();
        await this.webhookLogRepo.save(log);
        return { success: true, order };
      }

      await this.webhookLogRepo.save(log);
      return { success: true };
    } catch (error) {
      log.errorMessage = error.message;
      await this.webhookLogRepo.save(log);
      throw error;
    }
  }

  private async processNewOrder(
    platform: string,
    payload: any,
  ): Promise<StandardOrder> {
    const adapter = this.adapters.get(platform);
    
    // Convert platform-specific payload to standard order
    const order: StandardOrder = {
      platformOrderId: payload.orderId || payload.id,
      platform,
      orderType: payload.isPickup ? 'PICKUP' : 'DELIVERY',
      customer: {
        name: payload.customer?.name || '',
        phone: payload.customer?.phone || '',
        address: payload.delivery?.address?.text || payload.address,
        latitude: payload.delivery?.address?.latitude,
        longitude: payload.delivery?.address?.longitude,
        note: payload.customer?.note || '',
      },
      items: (payload.items || []).map((item: any) => ({
        name: item.product?.name || item.name,
        quantity: item.quantity,
        price: parseFloat(item.product?.price || item.price || 0),
        options: item.options?.map((o: any) => o.name),
        note: item.note,
      })),
      totals: {
        subtotal: parseFloat(payload.subtotal || 0),
        deliveryFee: parseFloat(payload.deliveryFee || 0),
        discount: parseFloat(payload.discountTotal || 0),
        total: parseFloat(payload.totalPrice || payload.total || 0),
      },
      payment: {
        method: payload.payment?.method || 'ONLINE',
        isPaid: payload.payment?.isPaid || false,
      },
      timing: {
        preparationTime: payload.preparationTime,
        estimatedDeliveryTime: payload.estimatedDeliveryTime,
      },
      rawPayload: payload,
    };

    // Auto-accept if configured
    const integration = await this.integrationRepo.findOne({
      where: { platform, restaurantId: payload.restaurantId },
    });

    if (integration?.syncConfig?.autoAccept) {
      await adapter.acceptOrder(integration.authConfig, order.platformOrderId);
      this.logger.log(`Auto-accepted order ${order.platformOrderId}`);
    }

    return order;
  }

  // ============================================
  // MENU SYNC
  // ============================================

  async syncMenu(
    restaurantId: string,
    platform: string,
  ): Promise<{ items: PlatformMenuItem[] }> {
    const integration = await this.integrationRepo.findOne({
      where: { restaurantId, platform, isActive: true },
    });

    if (!integration) {
      throw new Error('Integration not found');
    }

    const adapter = this.adapters.get(platform);
    const items = await adapter.fetchMenu(integration.authConfig);

    return { items };
  }

  // ============================================
  // STATUS UPDATE
  // ============================================

  async updateOrderStatus(
    restaurantId: string,
    platform: string,
    orderId: string,
    status: string,
  ): Promise<void> {
    const integration = await this.integrationRepo.findOne({
      where: { restaurantId, platform, isActive: true },
    });

    if (!integration) {
      throw new Error('Integration not found');
    }

    const adapter = this.adapters.get(platform);
    await adapter.updateOrderStatus(integration.authConfig, orderId, status);

    this.logger.log(`Order ${orderId} status updated to ${status}`);
  }

  // ============================================
  // POLLING
  // ============================================

  async startPolling(restaurantId: string, platform: string): Promise<void> {
    const intervalKey = `polling:${restaurantId}:${platform}`;
    
    // Check if already polling
    const existing = await this.redis.get(intervalKey);
    if (existing) {
      return;
    }

    // Get polling interval from config
    const integration = await this.integrationRepo.findOne({
      where: { restaurantId, platform },
    });

    const interval = (integration?.syncConfig?.pollingInterval || 60) * 1000;

    // Store polling info in Redis
    await this.redis.setex(intervalKey, 300, JSON.stringify({
      startedAt: new Date().toISOString(),
      interval,
    }));

    this.logger.log(`Started polling for ${platform} - ${restaurantId}`);
  }
}
