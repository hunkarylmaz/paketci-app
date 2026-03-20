import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // ==================== DASHBOARD ====================

  @Get('dashboard')
  async getDashboardStats(@Query('companyId') companyId: string) {
    return this.reportsService.getDashboardStats(companyId);
  }

  // ==================== BAYİ RAPORLARI (XLSX) ====================

  @Get('dealer/summary')
  async getDealerSummary(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getDashboardStats(companyId);
  }

  @Get('dealer/summary/export')
  async exportDealerSummary(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateDealerSummaryReport(companyId, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    const filename = `bayi-raporu-${format(new Date(), 'yyyy-MM-dd', { locale: tr })}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  }

  // ==================== RESTORAN RAPORLARI (XLSX) ====================

  @Get('restaurant/detailed')
  async getRestaurantDetailed(
    @Query('restaurantId') restaurantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getRestaurantPerformance('', new Date(startDate), new Date(endDate));
  }

  @Get('restaurant/detailed/export')
  async exportRestaurantDetailed(
    @Query('restaurantId') restaurantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateRestaurantDetailedReport(restaurantId, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    const filename = `restoran-raporu-${format(new Date(), 'yyyy-MM-dd', { locale: tr })}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  }

  // ==================== KURYE RAPORLARI ====================

  @Get('couriers/performance')
  async getCourierPerformance(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getCourierPerformance(
      companyId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  // ==================== FİNANSAL RAPORLAR ====================

  @Get('financial')
  async getFinancialReport(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getFinancialReport(
      companyId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
