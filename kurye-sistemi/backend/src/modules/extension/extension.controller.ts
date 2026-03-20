import { Controller, Post, Get, Body, Headers, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ExtensionService } from './extension.service';

@Controller('extension')
export class ExtensionController {
  constructor(private readonly extensionService: ExtensionService) {}

  // Health check
  @Get('health')
  @HttpCode(HttpStatus.OK)
  async health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  // Validate API key
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateApiKey(
    @Headers('authorization') auth: string,
  ) {
    const apiKey = auth?.replace('Bearer ', '');
    
    if (!apiKey) {
      return { 
        success: false, 
        error: 'API_KEY_REQUIRED',
        message: 'API Key gerekli' 
      };
    }

    return this.extensionService.validateApiKey(apiKey);
  }

  // Receive order from extension
  @Post('order')
  @HttpCode(HttpStatus.CREATED)
  async receiveOrder(
    @Body() orderData: any,
    @Headers('authorization') auth: string,
  ) {
    const apiKey = auth?.replace('Bearer ', '');
    
    if (!apiKey) {
      return { 
        success: false, 
        error: 'API_KEY_REQUIRED',
        message: 'API Key gerekli' 
      };
    }

    return this.extensionService.createOrder(orderData, apiKey);
  }

  // Get order status
  @Get('order/:id/status')
  async getOrderStatus(
    @Param('id') orderId: string,
    @Headers('authorization') auth: string,
  ) {
    const apiKey = auth?.replace('Bearer ', '');
    return this.extensionService.getOrderStatus(orderId, apiKey);
  }
}
