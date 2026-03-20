import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantWizardDto } from './dto/create-restaurant-wizard.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // ============================================
  // WIZARD - RESTORAN OLUŞTUR (Adım 6)
  // ============================================
  @Post('wizard')
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  async createFromWizard(@Body() dto: CreateRestaurantWizardDto) {
    const restaurant = await this.restaurantsService.createFromWizard(dto);
    
    return {
      success: true,
      message: 'Restoran başarıyla oluşturuldu',
      data: {
        id: restaurant.id,
        name: restaurant.name,
        apiKey: restaurant.apiKey,
      },
    };
  }

  // ============================================
  // BAYİ'NİN RESTORANLARI (Listeleme)
  // ============================================
  @Get('by-dealer/:dealerId')
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  async findByDealer(@Param('dealerId') dealerId: string) {
    const restaurants = await this.restaurantsService.findByDealer(dealerId);
    
    return {
      success: true,
      data: restaurants,
    };
  }

  // ============================================
  // RESTORAN DETAYI
  // ============================================
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  async findOne(@Param('id') id: string) {
    const restaurant = await this.restaurantsService.findOne(id);
    
    return {
      success: true,
      data: restaurant,
    };
  }

  // ============================================
  // ADRES ARAMA (Adım 5 - Konum için)
  // ============================================
  @Get('geocode/search')
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  async searchAddress(@Query('query') query: string) {
    const results = await this.restaurantsService.searchAddress(query);
    
    return {
      success: true,
      data: results,
    };
  }

  // ============================================
  // MAHALLE LİSTESİ (Adım 3 - Bölge bazlı için)
  // ============================================
  @Get('neighborhoods')
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  async getNeighborhoods(
    @Query('district') district: string,
    @Query('city') city: string,
  ) {
    const neighborhoods = await this.restaurantsService.getNeighborhoods(district, city);
    
    return {
      success: true,
      data: neighborhoods,
    };
  }

  // ============================================
  // API KEY YENİLEME
  // ============================================
  @Put(':id/regenerate-api-key')
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  async regenerateApiKey(@Param('id') id: string) {
    const newApiKey = await this.restaurantsService.regenerateApiKey(id);
    
    return {
      success: true,
      message: 'API Key yenilendi',
      data: { apiKey: newApiKey },
    };
  }
}
