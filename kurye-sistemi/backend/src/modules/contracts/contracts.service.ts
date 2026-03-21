import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ContractStatus } from './entities/contract.entity';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
  ) {}

  async findAll(): Promise<Contract[]> {
    return this.contractRepository.find({
      relations: ['restaurant', 'dealer'],
    });
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['restaurant', 'dealer'],
    });
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }
    return contract;
  }

  async findByRestaurant(restaurantId: string): Promise<Contract[]> {
    return this.contractRepository.find({
      where: { restaurantId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<Contract>): Promise<Contract> {
    const contract = this.contractRepository.create(data);
    return this.contractRepository.save(contract);
  }

  async update(id: string, data: Partial<Contract>): Promise<Contract> {
    await this.contractRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.contractRepository.delete(id);
  }
}
