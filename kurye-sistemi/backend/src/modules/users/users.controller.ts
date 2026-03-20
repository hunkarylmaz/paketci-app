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
import { Roles, Permissions, AdminRoles, ManagementRoles } from '../auth/decorators/roles.decorator';
import { UsersService, CreateUserDto, UpdateUserDto, AssignUserDto } from './users.service';
import { UserRole } from './enums/user-role.enum';
import { User } from './entities/user.entity';

// Request tipi için interface
interface RequestWithUser extends Request {
  user: User;
}

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Tüm kullanıcıları listele
  @Get()
  @ManagementRoles()
  async findAll(
    @Query('role') role?: UserRole,
    @Query('companyId') companyId?: string,
    @Query('regionId') regionId?: string,
    @Query('status') status?: string,
    @Req() req?: RequestWithUser,
  ) {
    const filters: any = {};
    
    if (role) filters.role = role;
    if (status) filters.status = status;
    
    // Yetki bazlı filtreleme
    if (req?.user) {
      if (req.user.role === UserRole.COMPANY_ADMIN) {
        filters.companyId = req.user.companyId;
      } else if (req.user.role === UserRole.REGIONAL_MANAGER) {
        filters.regionId = req.user.regionId;
      } else if (req.user.role === UserRole.DEALER) {
        filters.dealerId = req.user.dealerId;
      }
    }

    return this.usersService.findAll(filters);
  }

  // Rol listesini getir
  @Get('roles')
  async getRoles() {
    return this.usersService.getRoleList();
  }

  // ID ile kullanıcı getir
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Yeni kullanıcı oluştur
  @Post()
  @AdminRoles()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Kullanıcı güncelle
  @Put(':id')
  @ManagementRoles()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // Kullanıcı sil
  @Delete(':id')
  @AdminRoles()
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'Kullanıcı başarıyla silindi' };
  }

  // Kullanıcıya atama yap
  @Post(':id/assign')
  @ManagementRoles()
  async assignUser(
    @Param('id') id: string,
    @Body() assignDto: AssignUserDto,
  ) {
    return this.usersService.assignUser(id, assignDto);
  }

  // --- ROL BAZLI ENDPOINTLER ---

  // Bölge sorumlularını listele
  @Get('by-role/regional-managers')
  @ManagementRoles()
  async getRegionalManagers(@Query('regionId') regionId?: string) {
    return this.usersService.findRegionalManagers(regionId);
  }

  // Bayileri listele
  @Get('by-role/dealers')
  @ManagementRoles()
  async getDealers(@Query('regionId') regionId?: string) {
    return this.usersService.findDealers(regionId);
  }

  // Saha satış temsilcilerini listele
  @Get('by-role/field-sales')
  @ManagementRoles()
  async getFieldSales(@Query('territoryId') territoryId?: string) {
    return this.usersService.findFieldSales(territoryId);
  }

  // Muhasebecileri listele
  @Get('by-role/accountants')
  @ManagementRoles()
  async getAccountants(@Query('department') department?: string) {
    return this.usersService.findAccountants(department);
  }

  // Operasyon destek personelini listele
  @Get('by-role/operations-support')
  @ManagementRoles()
  async getOperationsSupport(@Query('regionId') regionId?: string) {
    return this.usersService.findOperationsSupport(regionId);
  }

  // --- MÜHASEBE ENDPOINTLERİ ---

  // Muhasebe dashboard verileri
  @Get('accountant/dashboard')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT)
  async getAccountantDashboard(@Req() req: RequestWithUser) {
    // Erişilebilir kaynakları getir
    const resources = await this.usersService.getAccessibleResources(req.user.id);
    
    return {
      accessibleResources: resources,
      message: 'Muhasebe dashboard verileri',
    };
  }

  // Finansal raporlar için yetki kontrolü
  @Get('accountant/financial-reports')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ACCOUNTANT)
  @Permissions('finance.view', 'reports.financial')
  async getFinancialReports(@Req() req: RequestWithUser) {
    return {
      userRole: req.user.role,
      permissions: 'Finansal raporlara erişim yetkisi',
    };
  }

  // --- SAHA SATIŞ ENDPOINTLERİ ---

  // Saha satış dashboard
  @Get('field-sales/dashboard')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES, UserRole.REGIONAL_MANAGER)
  async getFieldSalesDashboard(@Req() req: RequestWithUser) {
    const resources = await this.usersService.getAccessibleResources(req.user.id);
    
    return {
      accessibleResources: resources,
      monthlyTarget: req.user.monthlyTarget,
      monthlyVisitsTarget: req.user.monthlyVisitsTarget,
      assignedRestaurants: resources.restaurantIds.length,
    };
  }

  // Ziyaret raporu ekle
  @Post('field-sales/visit-report')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.FIELD_SALES)
  @Permissions('restaurants.visit')
  async addVisitReport(@Req() req: RequestWithUser, @Body() visitData: any) {
    return {
      message: 'Ziyaret raporu eklendi',
      userId: req.user.id,
      data: visitData,
    };
  }

  // --- OPERASYON DESTEK ENDPOINTLERİ ---

  // Operasyon dashboard
  @Get('operations/dashboard')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.OPERATIONS_SUPPORT, UserRole.REGIONAL_MANAGER)
  async getOperationsDashboard(@Req() req: RequestWithUser) {
    const resources = await this.usersService.getAccessibleResources(req.user.id);
    
    return {
      accessibleResources: resources,
      liveDeliveries: 'Canlı teslimat verileri',
      activeIssues: 'Aktif sorunlar',
    };
  }

  // Teslimat müdahale et
  @Post('operations/intervene-delivery')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.OPERATIONS_SUPPORT)
  @Permissions('issues.resolve', 'deliveries.monitor')
  async interveneDelivery(@Body() interventionData: any) {
    return {
      message: 'Teslimata müdahale edildi',
      data: interventionData,
    };
  }

  // --- BÖLGE SORUMLUSU ENDPOINTLERİ ---

  // Bölge dashboard
  @Get('regional-manager/dashboard')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER)
  async getRegionalManagerDashboard(@Req() req: RequestWithUser) {
    const resources = await this.usersService.getAccessibleResources(req.user.id);
    const subordinates = await this.usersService.findSubordinates(req.user.id);
    
    return {
      regionId: req.user.regionId,
      regionName: req.user.regionName,
      accessibleResources: resources,
      subordinates: subordinates.length,
      dealers: resources.dealerIds.length,
      restaurants: resources.restaurantIds.length,
    };
  }

  // Alt çalışanları listele
  @Get('regional-manager/subordinates')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.MANAGER)
  async getSubordinates(@Req() req: RequestWithUser) {
    return this.usersService.findSubordinates(req.user.id);
  }

  // --- BAYİ ENDPOINTLERİ ---

  // Bayi dashboard
  @Get('dealer/dashboard')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.REGIONAL_MANAGER, UserRole.DEALER)
  async getDealerDashboard(@Req() req: RequestWithUser) {
    const resources = await this.usersService.getAccessibleResources(req.user.id);
    
    return {
      dealerId: req.user.dealerId,
      dealerName: req.user.dealerName,
      accessibleResources: resources,
      restaurants: resources.restaurantIds.length,
    };
  }

  // --- PROFİL ENDPOINTLERİ ---

  // Kendi profilini getir
  @Get('profile/me')
  async getMyProfile(@Req() req: RequestWithUser) {
    return this.usersService.findById(req.user.id);
  }

  // Profil güncelle
  @Put('profile/me')
  async updateMyProfile(
    @Req() req: RequestWithUser,
    @Body() updateData: Partial<UpdateUserDto>,
  ) {
    // Sadece belirli alanların güncellenmesine izin ver
    const allowedUpdates = ['firstName', 'lastName', 'phone'];
    const filteredUpdates: any = {};
    
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredUpdates[field] = updateData[field];
      }
    });

    return this.usersService.update(req.user.id, filteredUpdates);
  }
}
