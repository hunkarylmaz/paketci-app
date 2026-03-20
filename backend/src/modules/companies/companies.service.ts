import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CompanyStatus } from './enums/company-status.enum';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async findAll() {
    return this.companyRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.companyRepository.findOne({
      where: { id },
      relations: ['users', 'restaurants', 'couriers'],
    });
  }

  async create(data: Partial<Company>) {
    const code = await this.generateCompanyCode();
    const company = this.companyRepository.create({
      ...data,
      code,
      status: CompanyStatus.PENDING_PAYMENT,
      creditBalance: 0,
      deliveryFeePerOrder: 2.5,
    });
    return this.companyRepository.save(company);
  }

  async update(id: string, data: Partial<Company>) {
    await this.companyRepository.update(id, data);
    return this.findOne(id);
  }

  private async generateCompanyCode(): Promise<string> {
    const count = await this.companyRepository.count();
    const nextNumber = count + 1;
    return `KRY${String(nextNumber).padStart(3, '0')}`;
  }
}
