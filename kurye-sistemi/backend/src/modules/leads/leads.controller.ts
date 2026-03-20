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
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { ManagementRoles } from '../auth/decorators/roles.decorator';
import { LeadsService, AssignLeadDto, UpdateLeadStatusDto } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead, LeadStatus, LeadPriority } from './entities/lead.entity';

@ApiTags('Leads - Potansiyel Müşteriler')
@ApiBearerAuth()
@Controller('leads')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  /**
   * Tüm leadleri listele
   */
  @Get()
  @ManagementRoles()
  @ApiOperation({ summary: 'Tüm leadleri listele', description: 'Filtreleme seçenekleri ile leadleri getirir' })
  @ApiQuery({ name: 'status', enum: LeadStatus, required: false, description: 'Durum filtresi' })
  @ApiQuery({ name: 'priority', enum: LeadPriority, required: false, description: 'Öncelik filtresi' })
  @ApiQuery({ name: 'territoryId', required: false, description: 'Bölge ID filtresi' })
  @ApiQuery({ name: 'assignedTo', required: false, description: 'Atanan kullanıcı ID filtresi' })
  @ApiResponse({ status: 200, description: 'Lead listesi başarıyla getirildi', type: [Lead] })
  async findAll(
    @Query('status') status?: LeadStatus,
    @Query('priority') priority?: LeadPriority,
    @Query('territoryId') territoryId?: string,
    @Query('assignedTo') assignedTo?: string,
  ): Promise<Lead[]> {
    return this.leadsService.findAll({
      status,
      priority,
      territoryId,
      assignedTo,
    });
  }

  /**
   * Lead istatistiklerini getir
   */
  @Get('stats')
  @ManagementRoles()
  @ApiOperation({ summary: 'Lead istatistikleri', description: 'Lead istatistiklerini getirir' })
  @ApiResponse({ status: 200, description: 'İstatistikler başarıyla getirildi' })
  async getStats() {
    return this.leadsService.getStats();
  }

  /**
   * Duruma göre leadleri getir
   */
  @Get('by-status/:status')
  @ManagementRoles()
  @ApiOperation({ summary: 'Duruma göre leadleri getir', description: 'Belirli bir durumdaki leadleri listeler' })
  @ApiResponse({ status: 200, description: 'Lead listesi başarıyla getirildi', type: [Lead] })
  async getByStatus(@Param('status') status: LeadStatus): Promise<Lead[]> {
    return this.leadsService.getByStatus(status);
  }

  /**
   * Atanan kullanıcıya göre leadleri getir
   */
  @Get('by-assigned/:userId')
  @ManagementRoles()
  @ApiOperation({ summary: 'Kullanıcıya göre leadleri getir', description: 'Belirli bir kullanıcıya atanmış leadleri listeler' })
  @ApiResponse({ status: 200, description: 'Lead listesi başarıyla getirildi', type: [Lead] })
  async getByAssignedUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Lead[]> {
    return this.leadsService.getByAssignedUser(userId);
  }

  /**
   * ID ile lead getir
   */
  @Get(':id')
  @ApiOperation({ summary: 'Lead detayı', description: 'ID ile lead bilgilerini getirir' })
  @ApiResponse({ status: 200, description: 'Lead başarıyla getirildi', type: Lead })
  @ApiResponse({ status: 404, description: 'Lead bulunamadı' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Lead> {
    return this.leadsService.findOne(id);
  }

  /**
   * Yeni lead oluştur
   */
  @Post()
  @ManagementRoles()
  @ApiOperation({ summary: 'Yeni lead oluştur', description: 'Yeni bir potansiyel müşteri kaydı oluşturur' })
  @ApiResponse({ status: 201, description: 'Lead başarıyla oluşturuldu', type: Lead })
  @ApiResponse({ status: 409, description: 'Bu telefon numarası ile kayıtlı lead zaten var' })
  async create(@Body() createLeadDto: CreateLeadDto): Promise<Lead> {
    return this.leadsService.create(createLeadDto);
  }

  /**
   * Lead güncelle
   */
  @Put(':id')
  @ManagementRoles()
  @ApiOperation({ summary: 'Lead güncelle', description: 'Mevcut bir leadi günceller' })
  @ApiResponse({ status: 200, description: 'Lead başarıyla güncellendi', type: Lead })
  @ApiResponse({ status: 404, description: 'Lead bulunamadı' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ): Promise<Lead> {
    return this.leadsService.update(id, updateLeadDto);
  }

  /**
   * Lead sil
   */
  @Delete(':id')
  @ManagementRoles()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Lead sil', description: 'Bir leadi siler' })
  @ApiResponse({ status: 204, description: 'Lead başarıyla silindi' })
  @ApiResponse({ status: 404, description: 'Lead bulunamadı' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.leadsService.remove(id);
  }

  /**
   * Lead ata
   */
  @Post(':id/assign')
  @ManagementRoles()
  @ApiOperation({ summary: 'Lead ata', description: 'Bir leadi kullanıcıya atar' })
  @ApiResponse({ status: 200, description: 'Lead başarıyla atandı', type: Lead })
  @ApiResponse({ status: 404, description: 'Lead bulunamadı' })
  async assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignDto: AssignLeadDto,
  ): Promise<Lead> {
    return this.leadsService.assign(id, assignDto);
  }

  /**
   * Lead durumunu güncelle
   */
  @Post(':id/status')
  @ManagementRoles()
  @ApiOperation({ summary: 'Lead durumunu güncelle', description: 'Lead durumunu değiştirir' })
  @ApiResponse({ status: 200, description: 'Durum başarıyla güncellendi', type: Lead })
  @ApiResponse({ status: 404, description: 'Lead bulunamadı' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: UpdateLeadStatusDto,
  ): Promise<Lead> {
    return this.leadsService.updateStatus(id, statusDto);
  }
}
