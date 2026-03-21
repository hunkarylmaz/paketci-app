import { Controller, Post, Body, Headers, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantPlatformConfig } from '../integrations/entities/restaurant-platform-config.entity';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    @InjectRepository(RestaurantPlatformConfig)
    private configRepo: Repository<RestaurantPlatformConfig>,
    private deliveriesService: DeliveriesService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== YEMEKSEPETİ WEBHOOK ====================

  @Post('yemeksepeti')
  async handleYemeksepetiWebhook(
    @Body() payload: any,
    @Headers('x-yemeksepeti-signature') signature: string,
  ) {
    this.logger.log('Yemeksepeti webhook received', payload);

    try {
      // Signature doğrulama
      if (!this.verifyYemeksepetiSignature(payload, signature)) {
        throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
      }

      // Sipariş tipine göre işlem
      switch (payload.eventType) {
        case 'ORDER_CREATED':
          await this.handleNewOrder('YEMEKSEPETI', payload.data);
          break;
        case 'ORDER_CANCELLED':
          await this.handleCancelledOrder('YEMEKSEPETI', payload.data);
          break;
        case 'ORDER_STATUS_CHANGED':
          await this.handleStatusChange('YEMEKSEPETI', payload.data);
          break;
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Yemeksepeti webhook error', error);
      throw new HttpException('Webhook processing failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ==================== GETİR WEBHOOK ====================

  @Post('getir')
  async handleGetirWebhook(
    @Body() payload: any,
    @Headers('x-getir-signature') signature: string,
  ) {
    this.logger.log('Getir webhook received', payload);

    try {
      if (!this.verifyGetirSignature(payload, signature)) {
        throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
      }

      switch (payload.event) {
        case 'order.new':
          await this.handleNewOrder('GETIR', payload.order);
          break;
        case 'order.cancelled':
          await this.handleCancelledOrder('GETIR', payload.order);
          break;
        case 'order.updated':
          await this.handleStatusChange('GETIR', payload.order);
          break;
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Getir webhook error', error);
      throw new HttpException('Webhook processing failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ==================== TRENDYOL WEBHOOK ====================

  @Post('trendyol')
  async handleTrendyolWebhook(
    @Body() payload: any,
    @Headers('x-trendyol-signature') signature: string,
  ) {
    this.logger.log('Trendyol webhook received', payload);

    try {
      if (!this.verifyTrendyolSignature(payload, signature)) {
        throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
      }

      if (payload.event === 'ORDER_RECEIVED') {
        await this.handleNewOrder('TRENDYOL', payload.payload);
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Trendyol webhook error', error);
      throw new HttpException('Webhook processing failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ==================== MİGROS WEBHOOK ====================

  @Post('migros')
  async handleMigrosWebhook(
    @Body() payload: any,
    @Headers('x-migros-signature') signature: string,
  ) {
    this.logger.log('Migros webhook received', payload);

    try {
      if (!this.verifyMigrosSignature(payload, signature)) {
        throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
      }

      if (payload.eventType === 'NEW_ORDER') {
        await this.handleNewOrder('MIGROS', payload.data);
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Migros webhook error', error);
      throw new HttpException('Webhook processing failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ==================== YARDIMCI METODLAR ====================

  private async handleNewOrder(platform: string, data: any) {
    this.logger.log(`New order from ${platform}`, data);

    // Siparişi veritabanına kaydet
    const order = await this.deliveriesService.createFromPlatform(platform, data);

    // Bildirim gönder
    await this.notificationsService.sendNewOrderNotification(order.id, order.restaurantId);

    // Otomatik kurye ata (eğer ayarlanmışsa)
    await this.deliveriesService.autoAssignCourier(order.id);
  }

  private async handleCancelledOrder(platform: string, data: any) {
    this.logger.log(`Cancelled order from ${platform}`, data);

    const orderId = data.orderId || data.id;
    await this.deliveriesService.cancelOrder(orderId, 'Platform tarafından iptal edildi', 'SYSTEM');

    // Kuryeye bildirim gönder
    await this.notificationsService.sendOrderCancelledNotification(orderId, data.restaurantId || '', 'Platform tarafından iptal edildi');
  }

  private async handleStatusChange(platform: string, data: any) {
    this.logger.log(`Status change from ${platform}`, data);
    // Durum değişikliğini işle
  }

  // ==================== SIGNATURE DOĞRULAMA ====================

  private verifyYemeksepetiSignature(payload: any, signature: string): boolean {
    // TODO: Implement HMAC signature verification
    // const crypto = require('crypto');
    // const expected = crypto.createHmac('sha256', process.env.YEMEKSEPETI_WEBHOOK_SECRET)
    //   .update(JSON.stringify(payload))
    //   .digest('hex');
    // return expected === signature;
    return true; // Development için geçici
  }

  private verifyGetirSignature(payload: any, signature: string): boolean {
    // TODO: Implement Getir signature verification
    return true; // Development için geçici
  }

  private verifyTrendyolSignature(payload: any, signature: string): boolean {
    // TODO: Implement Trendyol signature verification
    return true; // Development için geçici
  }

  private verifyMigrosSignature(payload: any, signature: string): boolean {
    // TODO: Implement Migros signature verification
    return true; // Development için geçici
  }
}
