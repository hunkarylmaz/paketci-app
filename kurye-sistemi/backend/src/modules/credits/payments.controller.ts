import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PaymentsService, CreatePaymentDto, PaymentMethod } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Banka hesap bilgilerini getir
  @Get('bank-account')
  getBankAccountInfo() {
    return this.paymentsService.getBankAccountInfo();
  }

  // Yeni ödeme talebi oluştur
  @Post('create')
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPaymentRequest(dto);
  }

  // Iyzico ile ödeme tamamla
  @Post(':id/iyzico-pay')
  async processIyzicoPayment(
    @Param('id') paymentId: string,
    @Body('cardDetails') cardDetails: any,
  ) {
    return this.paymentsService.processIyzicoPayment(paymentId, cardDetails);
  }

  // Havale bildirimi gönder
  @Post(':id/bank-transfer-notify')
  async notifyBankTransfer(
    @Param('id') paymentId: string,
    @Body('transferDetails') transferDetails: any,
  ) {
    return this.paymentsService.notifyBankTransfer(paymentId, transferDetails);
  }

  // Ödeme geçmişi
  @Get('history')
  async getPaymentHistory(@Query('companyId') companyId: string) {
    return this.paymentsService.getPaymentHistory(companyId);
  }

  // Bekleyen ödemeler (admin için)
  @Get('pending')
  async getPendingPayments() {
    return this.paymentsService.getPendingPayments();
  }

  // Ödemeyi onayla (admin için)
  @Post(':id/approve')
  async approvePayment(@Param('id') paymentId: string) {
    return this.paymentsService.completePayment(paymentId);
  }

  // Ön tanımlı yükleme miktarları
  @Get('preset-amounts')
  getPresetAmounts() {
    return {
      amounts: [100, 250, 500, 1000, 2500, 5000],
      popularAmount: 500,
    };
  }
}
