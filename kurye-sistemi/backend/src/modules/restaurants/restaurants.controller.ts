import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles, Permissions } from '../auth/decorators/roles.decorator';
import { RestaurantsService, CreateRestaurantDto, UpdateRestaurantDto } from './restaurants.service';
import { RestaurantSalesStatus } from './entities/restaurant.entity';
import { UserRole } from '../users/enums/user-role.enum';

// Request tipi için interface
interface RequestWithUser extends Request {
  user: any;
}

@Controller('restaurants')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // Tüm restoranları listele
  @Get()
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('dealerId') dealerId?: string,
    @Query('regionId') regionId?: string,
    @Query('territoryId') territoryId?: string,
    @Query('salesStatus') salesStatus?: RestaurantSalesStatus,
    @Query('isActive') isActive?: string,
    @Query('city') city?: string,
    @Req() req?: RequestWithUser,
  ) {
    const filters: any = {};
    
    if (companyId) filters.companyId = companyId;
    if (dealerId) filters.dealerId = dealerId;
    if (regionId) filters.regionId = regionId;
    if (territoryId) filters.territoryId = territoryId;
    if (salesStatus) filters.salesStatus = salesStatus;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (city) filters.city = city;

    return this.restaurantsService.findAll(filters, req?.user);
  }

  // İstatistikler
  @Get('stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER)
  async getStats(
    @Query('companyId') companyId?: string,
    @Query('regionId') regionId?: string,
    @Query('dealerId') dealerId?: string,
    @Req() req?: RequestWithUser,
  ) {
    const filters: any = {};
    
    if (companyId) filters.companyId = companyId;
    if (regionId) filters.regionId = regionId;
    if (dealerId) filters.dealerId = dealerId;

    // Kullanıcı rolüne göre filtre ekle
    if (req?.user) {
      if (req.user.role === UserRole.REGIONAL_MANAGER && req.user.regionId) {
        filters.regionId = req.user.regionId;
      }
      if (req.user.role === UserRole.DEALER && req.user.dealerId) {
        filters.dealerId = req.user.dealerId;
      }
    }

    return this.restaurantsService.getStats(filters);
  }

  // ID ile restoran getir
  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.restaurantsService.findById(id, req.user);
  }

  // Yeni restoran oluştur
  @Post()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.FIELD_SALES
  )
  async create(@Body() createDto: CreateRestaurantDto, @Req() req: RequestWithUser) {
    return this.restaurantsService.create(createDto, req.user);
  }

  // Restoran güncelle
  @Put(':id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.MANAGER,
    UserRole.FIELD_SALES
  )
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRestaurantDto,
    @Req() req: RequestWithUser,
  ) {
    return this.restaurantsService.update(id, updateDto, req.user);
  }

  // Restoran sil
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER)
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.restaurantsService.remove(id, req.user);
    return { message: 'Restoran başarıyla silindi' };
  }

  // === SAHA SATIŞ ENDPOINTLERİ ===

  // Ziyaret kaydet
  @Post(':id/visit')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES)
  @Permissions('restaurants.visit')
  async recordVisit(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.restaurantsService.recordVisit(
      id,
      req.user.id,
      `${req.user.firstName} ${req.user.lastName}`
    );
  }

  // Durum güncelle (Saha Satış)
  @Put(':id/sales-status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES, UserRole.REGIONAL_MANAGER)
  async updateSalesStatus(
    @Param('id') id: string,
    @Body('status') status: RestaurantSalesStatus,
    @Req() req: RequestWithUser,
  ) {
    return this.restaurantsService.updateSalesStatus(id, status, req.user);
  }

  // Atama yap (Bölge Sorumlusu)
  @Post(':id/assign')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER)
  async assignRestaurant(
    @Param('id') id: string,
    @Body() assignments: {
      dealerId?: string;
      dealerName?: string;
      regionId?: string;
      regionName?: string;
      fieldSalesId?: string;
      fieldSalesName?: string;
    },
    @Req() req: RequestWithUser,
  ) {
    return this.restaurantsService.assignRestaurant(id, assignments, req.user);
  }

  // === BAYİ ENDPOINTLERİ ===

  // Bayinin restoranlarını getir
  @Get('by-dealer/:dealerId')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.DEALER
  )
  async getByDealer(
    @Param('dealerId') dealerId: string,
    @Req() req: RequestWithUser,
  ) {
    // Yetki kontrolü
    if (req.user.role === UserRole.DEALER && req.user.dealerId !== dealerId) {
      return { error: 'Bu bayiye erişim yetkiniz yok' };
    }

    return this.restaurantsService.findAll({ dealerId }, req.user);
  }

  // === BÖLGE ENDPOINTLERİ ===

  // Bölgedeki restoranları getir
  @Get('by-region/:regionId')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.REGIONAL_MANAGER
  )
  async getByRegion(
    @Param('regionId') regionId: string,
    @Req() req: RequestWithUser,
  ) {
    // Yetki kontrolü
    if (req.user.role === UserRole.REGIONAL_MANAGER && req.user.regionId !== regionId) {
      return { error: 'Bu bölgeye erişim yetkiniz yok' };
    }

    return this.restaurantsService.findAll({ regionId }, req.user);
  }

  // === TERRITORY ENDPOINTLERİ ===

  // Territory'deki restoranları getir
  @Get('by-territory/:territoryId')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.FIELD_SALES
  )
  async getByTerritory(
    @Param('territoryId') territoryId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.restaurantsService.findAll({ territoryId }, req.user);
  }

  // === POTANSİYEL RESTORANLAR (Saha Satış) ===

  // Potansiyel restoranları getir (Lead durumundakiler)
  @Get('sales/leads')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES, UserRole.REGIONAL_MANAGER)
  async getLeads(@Req() req: RequestWithUser) {
    return this.restaurantsService.findAll(
      { salesStatus: RestaurantSalesStatus.LEAD },
      req.user
    );
  }

  // Aktif restoranları getir
  @Get('sales/active')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.REGIONAL_MANAGER,
    UserRole.DEALER,
    UserRole.FIELD_SALES
  )
  async getActive(@Req() req: RequestWithUser) {
    return this.restaurantsService.findAll(
      { salesStatus: RestaurantSalesStatus.ACTIVE, isActive: true },
      req.user
    );
  }
}
