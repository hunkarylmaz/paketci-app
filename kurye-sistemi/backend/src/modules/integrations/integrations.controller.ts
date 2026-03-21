import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto, UpdateIntegrationDto, TestIntegrationDto, PlatformOrderDto } from './dto/integration.dto';
import { IntegrationPlatform } from './entities/integration.entity';

@ApiTags('Integrations')
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all integrations' })
  findAll(@Query('restaurantId') restaurantId?: string) {
    return this.integrationsService.findAll(restaurantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get integration by ID' })
  findOne(@Param('id') id: string) {
    return this.integrationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new integration' })
  create(@Body() dto: CreateIntegrationDto) {
    return this.integrationsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update integration' })
  update(@Param('id') id: string, @Body() dto: UpdateIntegrationDto) {
    return this.integrationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete integration' })
  remove(@Param('id') id: string) {
    return this.integrationsService.remove(id);
  }

  @Post('test')
  @ApiOperation({ summary: 'Test platform connection' })
  testConnection(@Body() dto: TestIntegrationDto) {
    return this.integrationsService.testConnection(dto);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Sync orders from platform' })
  syncOrders(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.integrationsService.syncOrders(id, { startDate, endDate });
  }

  @Post('extension/order')
  @ApiOperation({ summary: 'Create order from Chrome Extension' })
  createOrderFromExtension(
    @Body() orderData: PlatformOrderDto,
    @Query('restaurantId') restaurantId: string,
  ) {
    return this.integrationsService.createOrderFromExtension(restaurantId, orderData);
  }

  @Get('platforms/list')
  @ApiOperation({ summary: 'Get available platforms' })
  getPlatforms() {
    return [
      {
        id: IntegrationPlatform.YEMEK_SEPETI,
        name: 'Yemeksepeti',
        icon: '🍽️',
        color: 'bg-red-500',
        description: 'Türkiye\'nin en büyük online yemek sipariş platformu',
        commission: '%15-25',
        features: ['Restoran Yönetimi', 'Sipariş Takibi', 'Kampanya Yönetimi'],
        authType: 'apiKey',
      },
      {
        id: IntegrationPlatform.MIGROS_YEMEK,
        name: 'Migros Yemek',
        icon: '🥘',
        color: 'bg-orange-500',
        description: 'Migros\'un yemek sipariş platformu',
        commission: '%12-20',
        features: ['Hızlı Teslimat', 'Migros Privileges', 'Geniş Kitle'],
        authType: 'apiKey',
      },
      {
        id: IntegrationPlatform.TRENDYOL_YEMEK,
        name: 'Trendyol Yemek',
        icon: '🛵',
        color: 'bg-orange-600',
        description: 'Trendyol\'un yemek sipariş hizmeti',
        commission: '%10-18',
        features: ['Trendyol Go Entegrasyonu', 'Hızlı Teslimat', 'Geniş Müşteri Ağı'],
        authType: 'apiKey',
      },
      {
        id: IntegrationPlatform.GETIR_YEMEK,
        name: 'Getir Yemek',
        icon: '📱',
        color: 'bg-purple-500',
        description: 'Getir\'in yemek sipariş platformu',
        commission: '%20-30',
        features: ['Dakikalar İçinde Teslimat', 'Getir Bünyesinde', 'Yüksek Frekans'],
        authType: 'apiKey',
      },
    ];
  }
}
