import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit, CreditTransactionType } from './entities/credit.entity';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Credit)
    private creditRepository: Repository<Credit>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async getBalance(companyId: string) {
    const company = await this.companyRepository.findOne({ 
      where: { id: companyId },
      select: ['id', 'name', 'creditBalance', 'deliveryFeePerOrder'],
    });

    if (!company) {
      throw new NotFoundException('Şirket bulunamadı');
    }

    // Son 30 günün kullanım istatistikleri
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await this.creditRepository
      .createQueryBuilder('credit')
      .select('credit.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(credit.amount)', 'total')
      .where('credit.companyId = :companyId', { companyId })
      .andWhere('credit.createdAt >= :date', { date: thirtyDaysAgo })
      .groupBy('credit.type')
      .getRawMany();

    return {
      currentBalance: company.creditBalance,
      deliveryFeePerOrder: company.deliveryFeePerOrder,
      estimatedDeliveries: Math.floor(company.creditBalance / company.deliveryFeePerOrder),
      last30Days: stats,
    };
  }

  async getTransactions(companyId: string, limit: number = 50) {
    return this.creditRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async addCredit(
    companyId: string, 
    amount: number, 
    paymentMethod: string,
    paymentId: string,
    createdBy: string,
    description?: string
  ) {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    
    if (!company) {
      throw new NotFoundException('Şirket bulunamadı');
    }

    const newBalance = parseFloat(company.creditBalance.toString()) + amount;

    await this.companyRepository.update(companyId, {
      creditBalance: newBalance,
    });

    const transaction = this.creditRepository.create({
      companyId,
      type: CreditTransactionType.PURCHASE,
      amount,
      balanceAfter: newBalance,
      paymentMethod,
      paymentId,
      description: description || `${amount} TL kontör yükleme`,
      createdBy,
    });

    return this.creditRepository.save(transaction);
  }

  async addBonus(
    companyId: string,
    amount: number,
    createdBy: string,
    description: string
  ) {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    
    if (!company) {
      throw new NotFoundException('Şirket bulunamadı');
    }

    const newBalance = parseFloat(company.creditBalance.toString()) + amount;

    await this.companyRepository.update(companyId, {
      creditBalance: newBalance,
    });

    const transaction = this.creditRepository.create({
      companyId,
      type: CreditTransactionType.BONUS,
      amount,
      balanceAfter: newBalance,
      description,
      createdBy,
    });

    return this.creditRepository.save(transaction);
  }
}
