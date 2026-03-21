import { Controller, Post, Body, Headers, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { IntegrationPlatform } from './entities/integration.entity';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post(':platform')
  @ApiOperation({ summary: 'Receive webhook from platform' })
  async receiveWebhook(
    @Param('platform') platform: string,
    @Body() payload: any,
    @Headers('x-signature') signature?: string,
    @Headers('x-webhook-secret') secret?: string,
  ) {
    this.logger.log(`Received webhook from ${platform}`);

    const platformEnum = this.mapPlatformString(platform);
    
    if (!platformEnum) {
      return { status: 'error', message: 'Invalid platform' };
    }

    try {
      await this.integrationsService.handleWebhook(
        platformEnum,
        payload,
        signature || secret,
      );

      return {
        status: 'success',
        message: 'Webhook received and processing',
      };
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`);
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('extension/order')
  @ApiOperation({ summary: 'Receive order from Chrome Extension' })
  async receiveExtensionOrder(
    @Body() payload: {
      restaurantId: string;
      order: any;
      platform: string;
    },
    @Headers('x-extension-key') extensionKey?: string,
  ) {
    this.logger.log(`Received order from Chrome Extension for restaurant ${payload.restaurantId}`);

    // Validate extension key
    // if (extensionKey !== process.env.EXTENSION_SECRET_KEY) {
    //   return { status: 'error', message: 'Invalid extension key' };
    // }

    try {
      const result = await this.integrationsService.createOrderFromExtension(
        payload.restaurantId,
        payload.order,
      );

      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Extension order processing failed: ${error.message}`);
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  private mapPlatformString(platform: string): IntegrationPlatform | null {
    const mapping: Record<string, IntegrationPlatform> = {
      'yemeksepeti': IntegrationPlatform.YEMEK_SEPETI,
      'migrosyemek': IntegrationPlatform.MIGROS_YEMEK,
      'trendyolyemek': IntegrationPlatform.TRENDYOL_YEMEK,
      'getiryemek': IntegrationPlatform.GETIR_YEMEK,
    };

    return mapping[platform.toLowerCase()] || null;
  }
}
