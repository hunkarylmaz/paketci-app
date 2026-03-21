import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Dealer, DealerStatus } from './entities/dealer.entity';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { UpdateDealerDto } from './dto/update-dealer.dto';

@Injectable()
export class DealersService {
  constructor(
    @InjectRepository(Dealer)
    private dealerRepository: Repository<Dealer>,
  ) {}

  async create(createDealerDto: CreateDealerDto): Promise<Dealer> {
    const dealer = this.dealerRepository.create(createDealerDto);
    return this.dealerRepository.save(dealer);
  }

  async findAll(filters?: {
    status?: DealerStatus;
    regionId?: string;
    ownerId?: string;
  }): Promise<Dealer[]> {
    const query = this.dealerRepository.createQueryBuilder('dealer')
      .leftJoinAndSelect('dealer.region', 'region')
      .leftJoinAndSelect('dealer.owner', 'owner')
      .leftJoinAndSelect('dealer.restaurants', 'restaurants');

    if (filters?.status) {
      query.andWhere('dealer.status = :status', { status: filters.status });
    }
    if (filters?.regionId) {
      query.andWhere('dealer.regionId = :regionId', { regionId: filters.regionId });
    }
    if (filters?.ownerId) {
      query.andWhere('dealer.ownerId = :ownerId', { ownerId: filters.ownerId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Dealer> {
    const dealer = await this.dealerRepository.findOne({
      where: { id },
      relations: ['region', 'owner', 'restaurants', 'contracts', 'invoices'],
    });

    if (!dealer) {
      throw new NotFoundException('Bayi bulunamadı');
    }

    return dealer;
  }

  async update(id: string, updateDealerDto: UpdateDealerDto): Promise<Dealer> {
    const dealer = await this.findOne(id);
    Object.assign(dealer, updateDealerDto);
    return this.dealerRepository.save(dealer);
  }

  async remove(id: string): Promise<void> {
    const dealer = await this.findOne(id);
    await this.dealerRepository.remove(dealer);
  }

  async getCommissionReport(dealerId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const dealer = await this.findOne(dealerId);
    
    const query = this.dealerRepository.createQueryBuilder('dealer')
      .leftJoin('dealer.invoices', 'invoices')
      .where('dealer.id = :dealerId', { dealerId });

    if (startDate && endDate) {
      query.andWhere('invoices.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const result = await query
      .select([
        'dealer.id',
        'dealer.name',
        'dealer.commissionRate',
        'COUNT(invoices.id) as invoiceCount',
        'COALESCE(SUM(invoices.totalAmount), 0) as totalRevenue',
        'COALESCE(SUM(invoices.totalAmount) * dealer.commissionRate / 100, 0) as totalCommission',
      ])
      .groupBy('dealer.id')
      .getRawOne();

    return {
      dealerId: result?.dealer_id || dealerId,
      dealerName: result?.dealer_name || dealer.name,
      commissionRate: parseFloat(result?.dealer_commissionrate || dealer.commissionRate),
      invoiceCount: parseInt(result?.invoicecount, 10) || 0,
      totalRevenue: parseFloat(result?.totalrevenue || 0),
      totalCommission: parseFloat(result?.totalcommission || 0),
      period: startDate && endDate ? { startDate, endDate } : 'all-time',
    };
  }

  async getPerformance(dealerId: string): Promise<any> {
    const dealer = await this.findOne(dealerId);
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [monthlyStats, restaurantCount, contractCount] = await Promise.all([
      this.dealerRepository.createQueryBuilder('dealer')
        .leftJoin('dealer.invoices', 'invoices', 'invoices.createdAt BETWEEN :startOfMonth AND :endOfMonth', {
          startOfMonth,
          endOfMonth,
        })
        .where('dealer.id = :dealerId', { dealerId })
        .select([
          'COALESCE(SUM(invoices.totalAmount), 0) as monthlyRevenue',
          'COUNT(invoices.id) as monthlyInvoices',
        ])
        .getRawOne(),
      this.dealerRepository.createQueryBuilder('dealer')
        .leftJoin('dealer.restaurants', 'restaurants')
        .where('dealer.id = :dealerId', { dealerId })
        .select('COUNT(restaurants.id)', 'count')
        .getRawOne(),
      this.dealerRepository.createQueryBuilder('dealer')
        .leftJoin('dealer.contracts', 'contracts')
        .where('dealer.id = :dealerId', { dealerId })
        .select('COUNT(contracts.id)', 'count')
        .getRawOne(),
    ]);

    const monthlyRevenue = parseFloat(monthlyStats?.monthlyrevenue || '0');
    const monthlyTarget = parseFloat(dealer.monthlyTarget?.toString() || '0');

    return {
      dealerId,
      dealerName: dealer.name,
      monthlyRevenue,
      monthlyTarget,
      targetAchievement: monthlyTarget > 0 ? (monthlyRevenue / monthlyTarget) * 100 : 0,
      monthlyInvoices: parseInt(monthlyStats?.monthlyinvoices, 10) || 0,
      restaurantCount: parseInt(restaurantCount?.count, 10) || 0,
      contractCount: parseInt(contractCount?.count, 10) || 0,
      status: dealer.status,
    };
  }
}
