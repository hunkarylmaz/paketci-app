import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface SaveIntegrationDto {
  platform: string;
  apiKey: string;
  apiSecret: string;
  merchantId: string;
  branchId?: string;
  autoAccept: boolean;
  isOpen: boolean;
}

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  /**
   * Restoran'ın tüm entegrasyonlarını listele
   */
  @Get('restaurant/:restaurantId')
  async getRestaurantIntegrations(
    @Param('restaurantId') restaurantId: string,
    @Request() req,
  ): Promise<any> {
    // TODO: Check if user has access to this restaurant
    return this.integrationsService.getRestaurantIntegrations(restaurantId);
  }

  /**
   * Entegrasyon kaydet/güncelle
   */
  @Post('restaurant/:restaurantId')
  async saveIntegration(
    @Param('restaurantId') restaurantId: string,
    @Body() config: SaveIntegrationDto,
    @Request() req,
  ) {
    // TODO: Check if user has access to this restaurant
    return this.integrationsService.saveIntegration(restaurantId, config);
  }

  /**
   * Bağlantı testi yap
   */
  @Post('restaurant/:restaurantId/test/:platform')
  async testConnection(
    @Param('restaurantId') restaurantId: string,
    @Param('platform') platform: string,
    @Request() req,
  ) {
    // TODO: Check if user has access to this restaurant
    return this.integrationsService.testConnection(restaurantId, platform);
  }

  /**
   * Siparişleri çek (manuel senkronizasyon)
   */
  @Post('restaurant/:restaurantId/sync/:platform')
  async syncOrders(
    @Param('restaurantId') restaurantId: string,
    @Param('platform') platform: string,
    @Request() req,
  ) {
    // TODO: Check if user has access to this restaurant
    const orders = await this.integrationsService.fetchOrders(restaurantId, platform);
    return {
      success: true,
      count: orders.length,
      orders,
    };
  }

  /**
   * Restoran durumunu değiştir (açık/kapalı)
   */
  @Put('restaurant/:restaurantId/:platform/status')
  async toggleStatus(
    @Param('restaurantId') restaurantId: string,
    @Param('platform') platform: string,
    @Body('isOpen') isOpen: boolean,
    @Request() req,
  ) {
    // TODO: Check if user has access to this restaurant
    const success = await this.integrationsService.toggleRestaurantStatus(
      restaurantId,
      platform,
      isOpen,
    );
    return { success };
  }

  /**
   * Entegrasyon sil
   */
  @Delete('restaurant/:restaurantId/:platform')
  async deleteIntegration(
    @Param('restaurantId') restaurantId: string,
    @Param('platform') platform: string,
    @Request() req,
  ) {
    // TODO: Implement delete
    return { success: true };
  }

  /**
   * Webhook URL'si getir
   */
  @Get('restaurant/:restaurantId/:platform/webhook-url')
  getWebhookUrl(
    @Param('restaurantId') restaurantId: string,
    @Param('platform') platform: string,
  ) {
    const url = this.integrationsService.getWebhookUrl(platform, restaurantId);
    return { url };
  }

  /**
   * Platform listesi
   */
  @Get('platforms')
  getPlatforms() {
    return [
      {
        id: 'yemeksepeti',
        name: 'Yemeksepeti',
        icon: '🍽️',
        requires: ['apiKey', 'apiSecret', 'merchantId', 'branchId'],
        webhookEnabled: true,
      },
      {
        id: 'getir',
        name: 'Getir Yemek',
        icon: '🛵',
        requires: ['apiKey', 'apiSecret', 'merchantId', 'storeId'],
        webhookEnabled: true,
      },
      {
        id: 'trendyol',
        name: 'Trendyol Yemek',
        icon: '🟠',
        requires: ['apiKey', 'apiSecret', 'sellerId'],
        webhookEnabled: true,
      },
      {
        id: 'migros',
        name: 'Migros Yemek',
        icon: '🦁',
        requires: ['apiKey', 'apiSecret', 'restaurantId'],
        webhookEnabled: true,
      },
      {
        id: 'fuudy',
        name: 'Fuudy',
        icon: '🍔',
        requires: ['apiKey', 'apiSecret', 'restaurantId'],
        webhookEnabled: false,
      },
    ];
  }
}
