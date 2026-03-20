import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Shift, ShiftStatus, ShiftType } from './entities/shift.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
  ) {}

  async create(shiftData: Partial<Shift>): Promise<Shift> {
    const shift = this.shiftRepository.create(shiftData);
    
    // Planlanan süreyi hesapla
    if (shift.plannedStartAt && shift.plannedEndAt) {
      shift.plannedDuration = Math.round(
        (shift.plannedEndAt.getTime() - shift.plannedStartAt.getTime()) / 60000
      );
    }
    
    return this.shiftRepository.save(shift);
  }

  async findAll(companyId: string, filters?: any): Promise<Shift[]> {
    const query = this.shiftRepository.createQueryBuilder('shift')
      .leftJoinAndSelect('shift.courier', 'courier')
      .where('shift.companyId = :companyId', { companyId });

    if (filters?.status) {
      query.andWhere('shift.status = :status', { status: filters.status });
    }

    if (filters?.courierId) {
      query.andWhere('shift.courierId = :courierId', { courierId: filters.courierId });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('shift.plannedStartAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    query.orderBy('shift.plannedStartAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string, companyId: string): Promise<Shift> {
    return this.shiftRepository.findOne({
      where: { id, companyId },
      relations: ['courier'],
    });
  }

  async update(id: string, companyId: string, updateData: Partial<Shift>): Promise<Shift> {
    await this.shiftRepository.update({ id, companyId }, updateData);
    return this.findOne(id, companyId);
  }

  async remove(id: string, companyId: string): Promise<void> {
    await this.shiftRepository.delete({ id, companyId });
  }

  async getActiveShift(courierId: string, companyId: string): Promise<Shift | null> {
    return this.shiftRepository.findOne({
      where: {
        courierId,
        companyId,
        status: ShiftStatus.ACTIVE,
      },
    });
  }

  async getUpcomingShifts(courierId: string, hours: number = 24): Promise<Shift[]> {
    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);

    return this.shiftRepository.find({
      where: {
        courierId,
        plannedStartAt: Between(now, future),
        status: ShiftStatus.SCHEDULED,
      },
      order: { plannedStartAt: 'ASC' },
    });
  }
}
