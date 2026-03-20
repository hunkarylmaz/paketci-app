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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus, PaymentType } from './entities/payment.entity';

@Controller('payments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ManagementRoles()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ManagementRoles()
  async findAll(
    @Query('status') status?: PaymentStatus,
    @Query('paymentType') paymentType?: PaymentType,
    @Query('recipientId') recipientId?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (paymentType) filters.paymentType = paymentType;
    if (recipientId) filters.recipientId = recipientId;
    return this.paymentsService.findAll(filters);
  }

  @Get('stats')
  @ManagementRoles()
  async getStats(@Query('period') period?: string) {
    return this.paymentsService.getStats(period);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  @ManagementRoles()
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @AdminRoles()
  async remove(@Param('id') id: string) {
    await this.paymentsService.remove(id);
    return { message: 'Ödeme kaydı başarıyla silindi' };
  }

  @Post(':id/complete')
  @ManagementRoles()
  async completePayment(
    @Param('id') id: string,
    @Body('paymentDate') paymentDate?: string,
  ) {
    const date = paymentDate ? new Date(paymentDate) : undefined;
    return this.paymentsService.completePayment(id, date);
  }
}
