import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Courier } from './entities/courier.entity';

@Injectable()
export class CouriersService {
  constructor(
    @InjectRepository(Courier)
    private courierRepository: Repository<Courier>,
  ) {}

  async create(data: Partial<Courier>): Promise<Courier> {
    const courier = this.courierRepository.create(data);
    return this.courierRepository.save(courier);
  }

  async findAll(): Promise<Courier[]> {
    return this.courierRepository.find();
  }

  async findOne(id: string): Promise<Courier> {
    const courier = await this.courierRepository.findOne({ where: { id } });
    if (!courier) {
      throw new NotFoundException('Kurye bulunamadı');
    }
    return courier;
  }

  async update(id: string, data: Partial<Courier>): Promise<Courier> {
    const courier = await this.findOne(id);
    Object.assign(courier, data);
    return this.courierRepository.save(courier);
  }

  async remove(id: string): Promise<void> {
    const courier = await this.findOne(id);
    await this.courierRepository.remove(courier);
  }
}
