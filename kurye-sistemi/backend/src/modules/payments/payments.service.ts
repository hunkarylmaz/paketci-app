import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentType } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }

  async findAll(filters?: {
    status?: PaymentStatus;
    paymentType?: PaymentType;
    recipientId?: string;
  }): Promise<Payment[]> {
    const query = this.paymentRepository.createQueryBuilder('payment');

    if (filters?.status) {
      query.andWhere('payment.status = :status', { status: filters.status });
    }
    if (filters?.paymentType) {
      query.andWhere('payment.paymentType = :paymentType', { paymentType: filters.paymentType });
    }
    if (filters?.recipientId) {
      query.andWhere('payment.recipientId = :recipientId', { recipientId: filters.recipientId });
    }

    return query.orderBy('payment.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Ödeme kaydı bulunamadı');
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  async completePayment(id: string, paymentDate?: Date): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = PaymentStatus.COMPLETED;
    payment.paymentDate = paymentDate || new Date();
    return this.paymentRepository.save(payment);
  }

  async getStats(period?: string): Promise<any> {
    const query = this.paymentRepository.createQueryBuilder('payment');

    if (period) {
      query.where('payment.period = :period', { period });
    }

    const [courierStats, dealerStats, totalStats] = await Promise.all([
      query
        .clone()
        .where('payment.paymentType = :type', { type: PaymentType.COURIER })
        .select([
          'COUNT(*) as count',
          'COALESCE(SUM(payment.amount), 0) as total',
        ])
        .getRawOne(),
      query
        .clone()
        .where('payment.paymentType = :type', { type: PaymentType.DEALER })
        .select([
          'COUNT(*) as count',
          'COALESCE(SUM(payment.amount), 0) as total',
        ])
        .getRawOne(),
      query
        .clone()
        .select([
          'COUNT(*) as count',
          'COALESCE(SUM(payment.amount), 0) as total',
        ])
        .getRawOne(),
    ]);

    return {
      courierPayments: {
        count: parseInt(courierStats?.count, 10) || 0,
        total: parseFloat(courierStats?.total || 0),
      },
      dealerPayments: {
        count: parseInt(dealerStats?.count, 10) || 0,
        total: parseFloat(dealerStats?.total || 0),
      },
      total: {
        count: parseInt(totalStats?.count, 10) || 0,
        total: parseFloat(totalStats?.total || 0),
      },
      period: period || 'all-time',
    };
  }
}
