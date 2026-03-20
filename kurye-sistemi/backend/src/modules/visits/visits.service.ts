import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Visit, VisitOutcome } from './entities/visit.entity';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

/**
 * Ziyaret filtreleme seçenekleri
 */
export interface VisitFilters {
  leadId?: string;
  restaurantId?: string;
  visitedBy?: string;
  startDate?: Date;
  endDate?: Date;
  outcome?: VisitOutcome;
}

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>,
  ) {}

  /**
   * Yeni ziyaret oluştur
   */
  async create(createVisitDto: CreateVisitDto): Promise<Visit> {
    // Lead veya Restaurant en az biri olmalı
    if (!createVisitDto.leadId && !createVisitDto.restaurantId) {
      throw new BadRequestException('Lead ID veya Restaurant ID gereklidir');
    }

    const visit = this.visitRepository.create(createVisitDto);
    return this.visitRepository.save(visit);
  }

  /**
   * Tüm ziyaretleri getir (filtreleme ile)
   */
  async findAll(filters?: VisitFilters): Promise<Visit[]> {
    const query = this.visitRepository.createQueryBuilder('visit')
      .leftJoinAndSelect('visit.lead', 'lead')
      .leftJoinAndSelect('visit.restaurant', 'restaurant')
      .leftJoinAndSelect('visit.visitor', 'visitor');

    if (filters?.leadId) {
      query.andWhere('visit.leadId = :leadId', { leadId: filters.leadId });
    }

    if (filters?.restaurantId) {
      query.andWhere('visit.restaurantId = :restaurantId', { restaurantId: filters.restaurantId });
    }

    if (filters?.visitedBy) {
      query.andWhere('visit.visitedBy = :visitedBy', { visitedBy: filters.visitedBy });
    }

    if (filters?.outcome) {
      query.andWhere('visit.outcome = :outcome', { outcome: filters.outcome });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('visit.visitDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    } else if (filters?.startDate) {
      query.andWhere('visit.visitDate >= :startDate', { startDate: filters.startDate });
    } else if (filters?.endDate) {
      query.andWhere('visit.visitDate <= :endDate', { endDate: filters.endDate });
    }

    return query.orderBy('visit.visitDate', 'DESC').getMany();
  }

  /**
   * ID ile ziyaret getir
   */
  async findOne(id: string): Promise<Visit> {
    const visit = await this.visitRepository.findOne({
      where: { id },
      relations: ['lead', 'restaurant', 'visitor'],
    });

    if (!visit) {
      throw new NotFoundException('Ziyaret bulunamadı');
    }

    return visit;
  }

  /**
   * Ziyaret güncelle
   */
  async update(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit> {
    const visit = await this.findOne(id);

    Object.assign(visit, updateVisitDto);
    return this.visitRepository.save(visit);
  }

  /**
   * Ziyaret sil
   */
  async remove(id: string): Promise<void> {
    const visit = await this.findOne(id);
    await this.visitRepository.remove(visit);
  }

  /**
   * Lead'e göre ziyaretleri getir
   */
  async getByLead(leadId: string): Promise<Visit[]> {
    return this.visitRepository.find({
      where: { leadId },
      relations: ['visitor'],
      order: { visitDate: 'DESC' },
    });
  }

  /**
   * Ziyaretçiye göre ziyaretleri getir
   */
  async getByVisitor(userId: string): Promise<Visit[]> {
    return this.visitRepository.find({
      where: { visitedBy: userId },
      relations: ['lead', 'restaurant'],
      order: { visitDate: 'DESC' },
    });
  }

  /**
   * Tarihe göre ziyaretleri getir
   */
  async getByDate(date: Date): Promise<Visit[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.visitRepository.find({
      where: {
        visitDate: Between(startOfDay, endOfDay),
      },
      relations: ['lead', 'restaurant', 'visitor'],
      order: { visitDate: 'ASC' },
    });
  }

  /**
   * Ziyaret istatistiklerini getir
   */
  async getStats(): Promise<{
    total: number;
    byOutcome: Record<VisitOutcome, number>;
    thisMonth: number;
    thisWeek: number;
    today: number;
    averageDuration: number;
    upcomingVisits: number;
  }> {
    const total = await this.visitRepository.count();

    // Sonuç bazlı sayılar
    const byOutcome: Record<string, number> = {};
    for (const outcome of Object.values(VisitOutcome)) {
      byOutcome[outcome] = await this.visitRepository.count({ where: { outcome } });
    }

    const now = new Date();

    // Bu ay
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = await this.visitRepository.count({
      where: { visitDate: MoreThanOrEqual(startOfMonth) },
    });

    // Bu hafta
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const thisWeek = await this.visitRepository.count({
      where: { visitDate: MoreThanOrEqual(startOfWeek) },
    });

    // Bugün
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const today = await this.visitRepository.count({
      where: { visitDate: Between(startOfDay, endOfDay) },
    });

    // Ortalama süre
    const durationResult = await this.visitRepository
      .createQueryBuilder('visit')
      .select('AVG(visit.duration)', 'average')
      .where('visit.duration > 0')
      .getRawOne();
    const averageDuration = Math.round(parseFloat(durationResult?.average || '0'));

    // Yaklaşan ziyaretler
    const upcomingVisits = await this.visitRepository.count({
      where: { visitDate: MoreThanOrEqual(now) },
    });

    return {
      total,
      byOutcome: byOutcome as Record<VisitOutcome, number>,
      thisMonth,
      thisWeek,
      today,
      averageDuration,
      upcomingVisits,
    };
  }
}
