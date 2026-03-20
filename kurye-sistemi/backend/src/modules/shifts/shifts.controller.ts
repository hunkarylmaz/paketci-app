import { Controller, Get, Post, Put, Delete, Body, Param, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ShiftsService } from './shifts.service';
import { ShiftComplianceService } from '../../common/services/shift-compliance.service';
import { ExcelExportService } from '../../common/services/excel-export.service';

@Controller('shifts')
export class ShiftsController {
  constructor(
    private readonly shiftsService: ShiftsService,
    private readonly complianceService: ShiftComplianceService,
    private readonly excelService: ExcelExportService,
  ) {}

  @Post()
  async create(@Body() shiftData: any) {
    return this.shiftsService.create(shiftData);
  }

  @Get()
  async findAll(
    @Query('companyId') companyId: string,
    @Query() filters: any,
  ) {
    return this.shiftsService.findAll(companyId, filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.shiftsService.findOne(id, companyId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
    @Body() updateData: any,
  ) {
    return this.shiftsService.update(id, companyId, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('companyId') companyId: string) {
    await this.shiftsService.remove(id, companyId);
    return { message: 'Vardiya silindi' };
  }

  // Vardiya başlat
  @Post(':id/start')
  async startShift(
    @Param('id') id: string,
    @Body() body: { latitude: number; longitude: number },
  ) {
    return this.complianceService.startShift(id, body);
  }

  // Vardiya bitir
  @Post(':id/end')
  async endShift(
    @Param('id') id: string,
    @Body() body: { latitude: number; longitude: number },
  ) {
    return this.complianceService.endShift(id, body);
  }

  // Mola başlat
  @Post(':id/break-start')
  async startBreak(@Param('id') id: string) {
    return this.complianceService.startBreak(id);
  }

  // Mola bitir
  @Post(':id/break-end')
  async endBreak(@Param('id') id: string) {
    return this.complianceService.endBreak(id);
  }

  // Uyumluluk raporu
  @Get('report/compliance')
  async getComplianceReport(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.complianceService.generateComplianceReport(
      companyId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  // Excel export - Vardiya raporu
  @Get('export/excel')
  async exportShifts(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const shifts = await this.shiftsService.findAll(companyId, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    const buffer = this.excelService.exportShifts(shifts, 'vardiyalar');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=vardiyalar.xlsx');
    res.send(buffer);
  }

  // Excel export - Uyumluluk raporu
  @Get('export/compliance-report')
  async exportComplianceReport(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const shifts = await this.shiftsService.findAll(companyId, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    const report = await this.complianceService.generateComplianceReport(
      companyId,
      new Date(startDate),
      new Date(endDate),
    );

    const buffer = this.excelService.exportShiftComplianceReport(shifts, report);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=vardiya-uyumluluk-raporu.xlsx');
    res.send(buffer);
  }
}
