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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AdminRoles, ManagementRoles } from '../auth/decorators/roles.decorator';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceStatus } from './entities/invoice.entity';

@Controller('invoices')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ManagementRoles()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  @ManagementRoles()
  async findAll(
    @Query('status') status?: InvoiceStatus,
    @Query('restaurantId') restaurantId?: string,
    @Query('dealerId') dealerId?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (restaurantId) filters.restaurantId = restaurantId;
    if (dealerId) filters.dealerId = dealerId;
    return this.invoicesService.findAll(filters);
  }

  @Get('overdue')
  @ManagementRoles()
  async getOverdue() {
    return this.invoicesService.getOverdue();
  }

  @Get('by-restaurant/:restaurantId')
  @ManagementRoles()
  async getByRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Query('status') status?: InvoiceStatus,
  ) {
    return this.invoicesService.getByRestaurant(restaurantId, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Put(':id')
  @ManagementRoles()
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  @AdminRoles()
  async remove(@Param('id') id: string) {
    await this.invoicesService.remove(id);
    return { message: 'Fatura başarıyla silindi' };
  }

  @Post(':id/mark-as-paid')
  @ManagementRoles()
  async markAsPaid(
    @Param('id') id: string,
    @Body('paidDate') paidDate?: string,
  ) {
    const date = paidDate ? new Date(paidDate) : undefined;
    return this.invoicesService.markAsPaid(id, date);
  }

  @Post('update-overdue-status')
  @ManagementRoles()
  async updateOverdueStatus() {
    const count = await this.invoicesService.updateOverdueStatus();
    return { message: `${count} fatura gecikmiş olarak işaretlendi` };
  }
}
