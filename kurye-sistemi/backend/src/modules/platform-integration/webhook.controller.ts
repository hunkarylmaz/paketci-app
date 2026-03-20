import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { PlatformIntegrationService } from './platform-integration.service';

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private platformService: PlatformIntegrationService) {}

  // Yemeksepeti Webhook
  @Post('yemeksepeti')
  async handleYemeksepeti(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
  ) {
    this.logger.log('Yemeksepeti webhook received');
    await this.platformService.handleWebhook('YEMEKSEPETI', payload, signature);
    return { status: 'ok' };
  }

  // Getir Yemek Webhook
  @Post('getir/yemek')
  async handleGetirYemek(
    @Body() payload: any,
    @Headers('x-webhook-signature') signature: string,
  ) {
    this.logger.log('Getir Yemek webhook received');
    await this.platformService.handleWebhook('GETIR_YEMEK', payload, signature);
    return { status: 'ok' };
  }

  // Getir Çarşı Webhook
  @Post('getir/carsi')
  async handleGetirCarsi(
    @Body() payload: any,
    @Headers('x-webhook-signature') signature: string,
  ) {
    this.logger.log('Getir Çarşı webhook received');
    await this.platformService.handleWebhook('GETIR_CARSI', payload, signature);
    return { status: 'ok' };
  }

  // Trendyol Yemek Webhook
  @Post('trendyol')
  async handleTrendyol(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
  ) {
    this.logger.log('Trendyol webhook received');
    await this.platformService.handleWebhook('TRENDYOL', payload, signature);
    return { status: 'ok' };
  }

  // Migros Yemek Webhook
  @Post('migros')
  async handleMigros(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
  ) {
    this.logger.log('Migros webhook received');
    await this.platformService.handleWebhook('MIGROS', payload, signature);
    return { status: 'ok' };
  }

  // Fuudy Webhook
  @Post('fuudy')
  async handleFuudy(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
  ) {
    this.logger.log('Fuudy webhook received');
    await this.platformService.handleWebhook('FUUDY', payload, signature);
    return { status: 'ok' };
  }
}
