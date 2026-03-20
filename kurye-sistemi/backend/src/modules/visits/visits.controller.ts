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
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { Visit, VisitOutcome } from './entities/visit.entity';

@ApiTags('Visits - Ziyaretler')
@ApiBearerAuth()
@Controller('visits')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  /**
   * Tüm ziyaretleri listele
   */
  @Get()
  @ManagementRoles()
  @ApiOperation({ summary: 'Tüm ziyaretleri listele', description: 'Filtreleme seçenekleri ile ziyaretleri getirir' })
  @ApiQuery({ name: 'leadId', required: false, description: 'Lead ID filtresi' })
  @ApiQuery({ name: 'restaurantId', required: false, description: 'Restoran ID filtresi' })
  @ApiQuery({ name: 'visitedBy', required: false, description: 'Ziyaret eden kullanıcı ID filtresi' })
  @ApiQuery({ name: 'outcome', enum: VisitOutcome, required: false, description: 'Sonuç filtresi' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Başlangıç tarihi (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Bitiş tarihi (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Ziyaret listesi başarıyla getirildi', type: [Visit] })
  async findAll(
    @Query('leadId') leadId?: string,
    @Query('restaurantId') restaurantId?: string,
    @Query('visitedBy') visitedBy?: string,
    @Query('outcome') outcome?: VisitOutcome,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Visit[]> {
    return this.visitsService.findAll({
      leadId,
      restaurantId,
      visitedBy,
      outcome,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  /**
   * Ziyaret istatistiklerini getir
   */
  @Get('stats')
  @ManagementRoles()
  @ApiOperation({ summary: 'Ziyaret istatistikleri', description: 'Ziyaret istatistiklerini getirir' })
  @ApiResponse({ status: 200, description: 'İstatistikler başarıyla getirildi' })
  async getStats() {
    return this.visitsService.getStats();
  }

  /**
   * Lead'e göre ziyaretleri getir
   */
  @Get('by-lead/:leadId')
  @ManagementRoles()
  @ApiOperation({ summary: 'Lead\'e göre ziyaretleri getir', description: 'Belirli bir leadin tüm ziyaretlerini listeler' })
  @ApiResponse({ status: 200, description: 'Ziyaret listesi başarıyla getirildi', type: [Visit] })
  async getByLead(
    @Param('leadId', ParseUUIDPipe) leadId: string,
  ): Promise<Visit[]> {
    return this.visitsService.getByLead(leadId);
  }

  /**
   * Ziyaretçiye göre ziyaretleri getir
   */
  @Get('by-visitor/:userId')
  @ManagementRoles()
  @ApiOperation({ summary: 'Kullanıcıya göre ziyaretleri getir', description: 'Belirli bir kullanıcının tüm ziyaretlerini listeler' })
  @ApiResponse({ status: 200, description: 'Ziyaret listesi başarıyla getirildi', type: [Visit] })
  async getByVisitor(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Visit[]> {
    return this.visitsService.getByVisitor(userId);
  }

  /**
   * Tarihe göre ziyaretleri getir
   */
  @Get('by-date/:date')
  @ManagementRoles()
  @ApiOperation({ summary: 'Tarihe göre ziyaretleri getir', description: 'Belirli bir tarihteki tüm ziyaretleri listeler' })
  @ApiResponse({ status: 200, description: 'Ziyaret listesi başarıyla getirildi', type: [Visit] })
  async getByDate(@Param('date') date: string): Promise<Visit[]> {
    return this.visitsService.getByDate(new Date(date));
  }

  /**
   * ID ile ziyaret getir
   */
  @Get(':id')
  @ApiOperation({ summary: 'Ziyaret detayı', description: 'ID ile ziyaret bilgilerini getirir' })
  @ApiResponse({ status: 200, description: 'Ziyaret başarıyla getirildi', type: Visit })
  @ApiResponse({ status: 404, description: 'Ziyaret bulunamadı' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Visit> {
    return this.visitsService.findOne(id);
  }

  /**
   * Yeni ziyaret oluştur
   */
  @Post()
  @ManagementRoles()
  @ApiOperation({ summary: 'Yeni ziyaret oluştur', description: 'Yeni bir ziyaret kaydı oluşturur' })
  @ApiResponse({ status: 201, description: 'Ziyaret başarıyla oluşturuldu', type: Visit })
  @ApiResponse({ status: 400, description: 'Lead ID veya Restaurant ID gereklidir' })
  async create(@Body() createVisitDto: CreateVisitDto): Promise<Visit> {
    return this.visitsService.create(createVisitDto);
  }

  /**
   * Ziyaret güncelle
   */
  @Put(':id')
  @ManagementRoles()
  @ApiOperation({ summary: 'Ziyaret güncelle', description: 'Mevcut bir ziyareti günceller' })
  @ApiResponse({ status: 200, description: 'Ziyaret başarıyla güncellendi', type: Visit })
  @ApiResponse({ status: 404, description: 'Ziyaret bulunamadı' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVisitDto: UpdateVisitDto,
  ): Promise<Visit> {
    return this.visitsService.update(id, updateVisitDto);
  }

  /**
   * Ziyaret sil
   */
  @Delete(':id')
  @ManagementRoles()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Ziyaret sil', description: 'Bir ziyareti siler' })
  @ApiResponse({ status: 204, description: 'Ziyaret başarıyla silindi' })
  @ApiResponse({ status: 404, description: 'Ziyaret bulunamadı' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.visitsService.remove(id);
  }
}
