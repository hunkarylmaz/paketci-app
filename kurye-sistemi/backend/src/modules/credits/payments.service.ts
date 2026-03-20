import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit, CreditTransactionType } from './entities/credit.entity';
import { Company } from '../companies/entities/company.entity';
import { NotificationsService } from '../notifications/notifications.service';

export enum PaymentMethod {
  IYZICO_CARD = 'iyzico_card',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface CreatePaymentDto {
  companyId: string;
  amount: number;
  method: PaymentMethod;
  cardDetails?: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
  };
  bankTransferDetails?: {
    senderName: string;
    senderIban: string;
    transferDate: Date;
    description?: string;
  };
}

export interface IyzicoConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
}

@Injectable()
export class PaymentsService {
  private iyzicoConfig: IyzicoConfig;

  constructor(
    @InjectRepository(Credit)
    private creditRepository: Repository<Credit>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private notificationsService: NotificationsService,
  ) {
    // Iyzico sandbox config - production'da değişmeli
    this.iyzicoConfig = {
      apiKey: process.env.IYZICO_API_KEY || 'sandbox-api-key',
      secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-secret-key',
      baseUrl: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
    };
  }

  // IBAN bilgileri
  getBankAccountInfo() {
    return {
      bankName: 'Türkiye İş Bankası',
      accountHolder: 'Paketçi Teknoloji A.Ş.',
      iban: 'TR12 3456 7890 1234 5678 9012 34',
      accountNumber: '1234-567890-12',
      branchCode: '1234',
      branchName: 'Bodrum Şubesi',
      swiftCode: 'ISBKTRIS',
      description: 'Lütfen açıklama kısmına bayi kodunuzu yazınız',
    };
  }

  // Bakiye yükleme talebi oluştur
  async createPaymentRequest(dto: CreatePaymentDto) {
    const company = await this.companyRepository.findOne({
      where: { id: dto.companyId },
    });

    if (!company) {
      throw new Error('Bayi bulunamadı');
    }

    // Ödeme kaydı oluştur
    const payment = this.creditRepository.create({
      companyId: dto.companyId,
      type: CreditTransactionType.TOP_UP,
      amount: dto.amount,
      status: PaymentStatus.PENDING,
      paymentMethod: dto.method,
      metadata: {
        ...dto.cardDetails,
        ...dto.bankTransferDetails,
        requestedAt: new Date(),
      },
      description: this.getPaymentDescription(dto.method, dto.amount),
    });

    const savedPayment = await this.creditRepository.save(payment);

    // Bildirim gönder
    await this.notificationsService.create({
      userId: company.id,
      type: 'payment_pending',
      title: 'Bakiye Yükleme Talebi',
      message: `${dto.amount} TL tutarında bakiye yükleme talebiniz alındı.`,
    });

    return {
      success: true,
      paymentId: savedPayment.id,
      status: PaymentStatus.PENDING,
      message: 'Ödeme talebiniz alındı',
    };
  }

  // Iyzico ile kart ödemesi
  async processIyzicoPayment(paymentId: string, cardDetails: any) {
    const payment = await this.creditRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Ödeme bulunamadı');
    }

    // Iyzico API entegrasyonu burada yapılacak
    // Şimdilik simülasyon
    try {
      // Simüle edilmiş başarılı ödeme
      const isSuccess = await this.simulateIyzicoPayment(cardDetails);

      if (isSuccess) {
        // Bakiyeyi güncelle
        await this.completePayment(paymentId);
        
        return {
          success: true,
          message: 'Ödeme başarıyla tamamlandı',
          transactionId: `IYZ${Date.now()}`,
        };
      } else {
        await this.failPayment(paymentId, 'Kart reddedildi');
        throw new Error('Ödeme başarısız: Kart reddedildi');
      }
    } catch (error) {
      await this.failPayment(paymentId, error.message);
      throw error;
    }
  }

  // Banka havalesi bildirimi
  async notifyBankTransfer(paymentId: string, transferDetails: any) {
    const payment = await this.creditRepository.findOne({
      where: { id: paymentId },
      relations: ['company'],
    });

    if (!payment) {
      throw new Error('Ödeme bulunamadı');
    }

    // Havale bilgilerini kaydet
    await this.creditRepository.update(paymentId, {
      status: PaymentStatus.PROCESSING,
      metadata: {
        ...payment.metadata,
        bankTransfer: transferDetails,
        notifiedAt: new Date(),
      },
    });

    // Admin'e bildirim gönder
    await this.notificationsService.create({
      userId: 'admin',
      type: 'bank_transfer_notification',
      title: 'Yeni Havale Bildirimi',
      message: `${payment.company?.name} bayisi ${payment.amount} TL havale bildirimi yaptı.`,
    });

    // Bayiye bildirim gönder
    await this.notificationsService.create({
      userId: payment.companyId,
      type: 'bank_transfer_received',
      title: 'Havale Bildirimi Alındı',
      message: `${payment.amount} TL tutarındaki havale bildiriminiz inceleniyor. Onaylandıktan sonra bakiyeniz yüklenecektir.`,
    });

    return {
      success: true,
      message: 'Havale bildiriminiz alındı, inceleniyor',
    };
  }

  // Ödemeyi tamamla (başarılı)
  async completePayment(paymentId: string) {
    const payment = await this.creditRepository.findOne({
      where: { id: paymentId },
      relations: ['company'],
    });

    if (!payment) {
      throw new Error('Ödeme bulunamadı');
    }

    // Bakiyeyi güncelle
    const company = await this.companyRepository.findOne({
      where: { id: payment.companyId },
    });

    const newBalance = parseFloat(company.creditBalance.toString()) + parseFloat(payment.amount.toString());
    
    await this.companyRepository.update(payment.companyId, {
      creditBalance: newBalance,
    });

    // Ödeme durumunu güncelle
    await this.creditRepository.update(paymentId, {
      status: PaymentStatus.COMPLETED,
      balanceAfter: newBalance,
      completedAt: new Date(),
    });

    // Başarı bildirimi gönder
    await this.notificationsService.create({
      userId: payment.companyId,
      type: 'payment_completed',
      title: 'Bakiye Yüklendi ✅',
      message: `${payment.amount} TL bakiyeniz başarıyla yüklendi. Yeni bakiyeniz: ${newBalance} TL`,
    });

    return {
      success: true,
      newBalance,
    };
  }

  // Ödemeyi reddet (başarısız)
  async failPayment(paymentId: string, reason: string) {
    await this.creditRepository.update(paymentId, {
      status: PaymentStatus.FAILED,
      failureReason: reason,
      failedAt: new Date(),
    });

    const payment = await this.creditRepository.findOne({
      where: { id: paymentId },
    });

    // Başarısız bildirimi gönder
    await this.notificationsService.create({
      userId: payment.companyId,
      type: 'payment_failed',
      title: 'Ödeme Başarısız ❌',
      message: `${payment.amount} TL ödemeniz başarısız oldu. Sebep: ${reason}`,
    });
  }

  // Ödeme geçmişi
  async getPaymentHistory(companyId: string) {
    return this.creditRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  // Bekleyen ödemeler
  async getPendingPayments() {
    return this.creditRepository.find({
      where: { status: PaymentStatus.PENDING },
      relations: ['company'],
      order: { createdAt: 'DESC' },
    });
  }

  // Private helper methods
  private getPaymentDescription(method: PaymentMethod, amount: number): string {
    if (method === PaymentMethod.IYZICO_CARD) {
      return `${amount} TL Kart ile Bakiye Yükleme`;
    }
    return `${amount} TL Havale ile Bakiye Yükleme`;
  }

  private async simulateIyzicoPayment(cardDetails: any): Promise<boolean> {
    // Gerçek Iyzico entegrasyonu burada yapılacak
    // Şimdilik simülasyon - 95% başarı oranı
    return Math.random() > 0.05;
  }
}
