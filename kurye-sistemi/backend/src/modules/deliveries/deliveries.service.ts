import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Delivery, DeliveryStatus, PaymentType } from './entities/delivery.entity';
import { Company } from '../companies/entities/company.entity';
import { Credit, CreditTransactionType } from '../credits/entities/credit.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { generateTrackingNumber } from '../../utils/tracking-number.util';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Credit)
    private creditRepository: Repository<Credit>,
    private dataSource: DataSource,
  ) {}

  async create(companyId: string, createDto: CreateDeliveryDto): Promise<Delivery> {
    // Şirket kontrolü ve bakiye kontrolü
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    
    if (!company) {
      throw new NotFoundException('Şirket bulunamadı');
    }

    if (company.creditBalance < company.deliveryFeePerOrder) {
      throw new BadRequestException(
        `Yetersiz kontör bakiyesi. Mevcut: ${company.creditBalance} TL, Gerekli: ${company.deliveryFeePerOrder} TL`
      );
    }

    // Transaction başlat
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Teslimat oluştur
      const delivery = this.deliveryRepository.create({
        ...createDto,
        companyId,
        trackingNumber: generateTrackingNumber(),
        creditDeducted: company.deliveryFeePerOrder,
        status: DeliveryStatus.PENDING,
        paymentType: createDto.paymentType as PaymentType,
      });

      await queryRunner.manager.save(delivery);

      // Kontör düş
      const newBalance = parseFloat(company.creditBalance.toString()) - parseFloat(company.deliveryFeePerOrder.toString());
      
      await queryRunner.manager.update(Company, companyId, {
        creditBalance: newBalance,
      });

      // Kontör işlemi kaydet
      const creditTransaction = this.creditRepository.create({
        companyId,
        type: CreditTransactionType.DELIVERY_DEDUCTION,
        amount: -company.deliveryFeePerOrder,
        balanceAfter: newBalance,
        deliveryId: delivery.id,
        description: `Teslimat #${delivery.trackingNumber} için kontör kullanımı`,
        createdBy: createDto.createdBy || 'system',
      });

      await queryRunner.manager.save(creditTransaction);

      await queryRunner.commitTransaction();

      return delivery;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(companyId: string, filters?: any) {
    const query = this.deliveryRepository.createQueryBuilder('delivery')
      .leftJoinAndSelect('delivery.restaurant', 'restaurant')
      .leftJoinAndSelect('delivery.courier', 'courier')
      .where('delivery.companyId = :companyId', { companyId });

    if (filters?.status) {
      query.andWhere('delivery.status = :status', { status: filters.status });
    }

    if (filters?.restaurantId) {
      query.andWhere('delivery.restaurantId = :restaurantId', { restaurantId: filters.restaurantId });
    }

    if (filters?.courierId) {
      query.andWhere('delivery.courierId = :courierId', { courierId: filters.courierId });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('delivery.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    query.orderBy('delivery.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(companyId: string, id: string) {
    const delivery = await this.deliveryRepository.findOne({
      where: { id, companyId },
      relations: ['restaurant', 'courier', 'courier.user'],
    });

    if (!delivery) {
      throw new NotFoundException('Teslimat bulunamadı');
    }

    return delivery;
  }

  async findByTrackingNumber(trackingNumber: string) {
    const delivery = await this.deliveryRepository.findOne({
      where: { trackingNumber },
      relations: ['restaurant', 'courier'],
    });

    if (!delivery) {
      throw new NotFoundException('Teslimat bulunamadı');
    }

    return delivery;
  }

  async updateStatus(
    companyId: string, 
    id: string, 
    updateDto: UpdateDeliveryStatusDto,
    userId: string
  ) {
    const delivery = await this.findOne(companyId, id);
    
    const statusTimeMap = {
      [DeliveryStatus.ASSIGNED]: 'assignedAt',
      [DeliveryStatus.ACCEPTED]: 'acceptedAt',
      [DeliveryStatus.PICKED_UP]: 'pickedUpAt',
      [DeliveryStatus.DELIVERED]: 'deliveredAt',
    };

    const updateData: any = {
      status: updateDto.status,
      ...(statusTimeMap[updateDto.status] && { [statusTimeMap[updateDto.status]]: new Date() }),
      ...(updateDto.courierId && { courierId: updateDto.courierId }),
      ...(updateDto.deliveryPhoto && { deliveryPhoto: updateDto.deliveryPhoto }),
      ...(updateDto.customerSignature && { customerSignature: updateDto.customerSignature }),
      ...(updateDto.cancellationReason && { cancellationReason: updateDto.cancellationReason }),
      ...(updateDto.failureReason && { failureReason: updateDto.failureReason }),
    };

    await this.deliveryRepository.update(id, updateData);

    // Eğer iptal edildiyse ve teslimat başlamadıysa kontör iade et
    if (updateDto.status === DeliveryStatus.CANCELLED && 
        delivery.status === DeliveryStatus.PENDING) {
      await this.refundCredit(companyId, delivery);
    }

    return this.findOne(companyId, id);
  }

  async refundCredit(companyId: string, delivery: Delivery) {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    const newBalance = parseFloat(company.creditBalance.toString()) + parseFloat(delivery.creditDeducted.toString());

    await this.companyRepository.update(companyId, {
      creditBalance: newBalance,
    });

    const creditTransaction = this.creditRepository.create({
      companyId,
      type: CreditTransactionType.REFUND,
      amount: delivery.creditDeducted,
      balanceAfter: newBalance,
      deliveryId: delivery.id,
      description: `İptal edilen teslimat #${delivery.trackingNumber} için kontör iadesi`,
      createdBy: 'system',
    });

    await this.creditRepository.save(creditTransaction);
  }

  // Platform entegrasyonu için yeni sipariş oluşturma
  async createFromPlatform(
    companyId: string,
    platformData: {
      platform: string;
      platformOrderId: string;
      restaurantId: string;
      customerName: string;
      customerPhone: string;
      deliveryAddress: string;
      orderAmount: number;
      paymentType: string;
      deliveryFee?: number;
    },
  ): Promise<Delivery> {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    
    if (!company) {
      throw new NotFoundException('Şirket bulunamadı');
    }

    const delivery = this.deliveryRepository.create({
      ...platformData,
      companyId,
      trackingNumber: generateTrackingNumber(),
      creditDeducted: company.deliveryFeePerOrder,
      status: DeliveryStatus.PENDING,
      paymentType: platformData.paymentType as PaymentType,
      orderSource: platformData.platform.toLowerCase(),
    });

    return this.deliveryRepository.save(delivery);
  }

  // Otomatik kurye atama
  async autoAssignCourier(deliveryId: string): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ['restaurant'],
    });

    if (!delivery) {
      throw new NotFoundException('Teslimat bulunamadı');
    }

    // TODO: Implement smart assignment logic
    // For now, just mark as pending_assignment
    delivery.status = DeliveryStatus.ASSIGNED;
    delivery.assignedAt = new Date();
    
    return this.deliveryRepository.save(delivery);
  }

  // Sipariş iptali
  async cancelOrder(
    companyId: string,
    deliveryId: string,
    reason: string,
  ): Promise<Delivery> {
    const delivery = await this.findOne(companyId, deliveryId);

    if (delivery.status === DeliveryStatus.DELIVERED) {
      throw new BadRequestException('Teslim edilmiş sipariş iptal edilemez');
    }

    if (delivery.status === DeliveryStatus.CANCELLED) {
      throw new BadRequestException('Sipariş zaten iptal edilmiş');
    }

    delivery.status = DeliveryStatus.CANCELLED;
    delivery.cancelledAt = new Date();
    delivery.cancellationReason = reason;

    await this.deliveryRepository.save(delivery);

    // Kontör iadesi yap (eğer teslimat başlamadıysa)
    if ([DeliveryStatus.PENDING, DeliveryStatus.ASSIGNED].includes(delivery.status)) {
      await this.refundCredit(companyId, delivery);
    }

    return delivery;
  }

  async getStats(companyId: string, period?: { start: Date; end: Date }) {
    const query = this.deliveryRepository.createQueryBuilder('delivery')
      .where('delivery.companyId = :companyId', { companyId });

    if (period) {
      query.andWhere('delivery.createdAt BETWEEN :start AND :end', period);
    }

    const [
      total,
      pending,
      inProgress,
      delivered,
      cancelled,
      totalRevenue,
    ] = await Promise.all([
      query.getCount(),
      this.deliveryRepository.count({ 
        where: { companyId, status: DeliveryStatus.PENDING } 
      }),
      this.deliveryRepository.count({
        where: [
          { companyId, status: DeliveryStatus.ASSIGNED },
          { companyId, status: DeliveryStatus.ACCEPTED },
          { companyId, status: DeliveryStatus.PICKED_UP },
          { companyId, status: DeliveryStatus.IN_TRANSIT },
        ],
      }),
      this.deliveryRepository.count({ 
        where: { companyId, status: DeliveryStatus.DELIVERED } 
      }),
      this.deliveryRepository.count({ 
        where: { companyId, status: DeliveryStatus.CANCELLED } 
      }),
      this.deliveryRepository
        .createQueryBuilder('delivery')
        .select('SUM(delivery.orderAmount)', 'total')
        .where('delivery.companyId = :companyId', { companyId })
        .andWhere('delivery.status = :status', { status: DeliveryStatus.DELIVERED })
        .getRawOne(),
    ]);

    return {
      total,
      pending,
      inProgress,
      delivered,
      cancelled,
      totalRevenue: totalRevenue?.total || 0,
    };
  }
}
