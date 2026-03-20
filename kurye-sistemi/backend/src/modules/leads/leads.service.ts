import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Lead, LeadStatus, LeadPriority } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

/**
 * Lead atama DTO'su
 */
export interface AssignLeadDto {
  assignedTo: string;
}

/**
 * Lead durum güncelleme DTO'su
 */
export interface UpdateLeadStatusDto {
  status: LeadStatus;
  notes?: string;
}

/**
 * Lead filtreleme seçenekleri
 */
export interface LeadFilters {
  status?: LeadStatus;
  priority?: LeadPriority;
  territoryId?: string;
  assignedTo?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  /**
   * Yeni lead oluştur
   */
  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    // Aynı telefon numarası ile lead var mı kontrol et
    const existingLead = await this.leadRepository.findOne({
      where: { phone: createLeadDto.phone },
    });

    if (existingLead) {
      throw new ConflictException('Bu telefon numarası ile kayıtlı bir lead zaten var');
    }

    const lead = this.leadRepository.create(createLeadDto);
    return this.leadRepository.save(lead);
  }

  /**
   * Tüm leadleri getir (filtreleme ile)
   */
  async findAll(filters?: LeadFilters): Promise<Lead[]> {
    const query = this.leadRepository.createQueryBuilder('lead')
      .leftJoinAndSelect('lead.territory', 'territory')
      .leftJoinAndSelect('lead.assignedUser', 'assignedUser');

    if (filters?.status) {
      query.andWhere('lead.status = :status', { status: filters.status });
    }

    if (filters?.priority) {
      query.andWhere('lead.priority = :priority', { priority: filters.priority });
    }

    if (filters?.territoryId) {
      query.andWhere('lead.territoryId = :territoryId', { territoryId: filters.territoryId });
    }

    if (filters?.assignedTo) {
      query.andWhere('lead.assignedTo = :assignedTo', { assignedTo: filters.assignedTo });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('lead.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    return query.orderBy('lead.createdAt', 'DESC').getMany();
  }

  /**
   * ID ile lead getir
   */
  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['territory', 'assignedUser'],
    });

    if (!lead) {
      throw new NotFoundException('Lead bulunamadı');
    }

    return lead;
  }

  /**
   * Lead güncelle
   */
  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);

    // Telefon numarası değişiyorsa kontrol et
    if (updateLeadDto.phone && updateLeadDto.phone !== lead.phone) {
      const existingLead = await this.leadRepository.findOne({
        where: { phone: updateLeadDto.phone },
      });
      if (existingLead) {
        throw new ConflictException('Bu telefon numarası ile kayıtlı bir lead zaten var');
      }
    }

    // Durum CONVERTED oluyorsa convertedAt tarihini ayarla
    if (updateLeadDto.status === LeadStatus.CONVERTED && lead.status !== LeadStatus.CONVERTED) {
      updateLeadDto['convertedAt'] = new Date();
    }

    Object.assign(lead, updateLeadDto);
    return this.leadRepository.save(lead);
  }

  /**
   * Lead sil
   */
  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    await this.leadRepository.remove(lead);
  }

  /**
   * Lead ata
   */
  async assign(id: string, assignDto: AssignLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);
    
    if (!assignDto.assignedTo) {
      throw new BadRequestException('Atanacak kullanıcı ID gereklidir');
    }

    lead.assignedTo = assignDto.assignedTo;
    return this.leadRepository.save(lead);
  }

  /**
   * Lead durumunu güncelle
   */
  async updateStatus(id: string, statusDto: UpdateLeadStatusDto): Promise<Lead> {
    const lead = await this.findOne(id);
    
    lead.status = statusDto.status;
    
    if (statusDto.notes) {
      lead.notes = lead.notes 
        ? `${lead.notes}\n[${new Date().toISOString()}] ${statusDto.notes}`
        : statusDto.notes;
    }

    // Durum CONVERTED oluyorsa
    if (statusDto.status === LeadStatus.CONVERTED && lead.status !== LeadStatus.CONVERTED) {
      lead.convertedAt = new Date();
    }

    return this.leadRepository.save(lead);
  }

  /**
   * Duruma göre leadleri getir
   */
  async getByStatus(status: LeadStatus): Promise<Lead[]> {
    return this.leadRepository.find({
      where: { status },
      relations: ['territory', 'assignedUser'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Atanan kullanıcıya göre leadleri getir
   */
  async getByAssignedUser(userId: string): Promise<Lead[]> {
    return this.leadRepository.find({
      where: { assignedTo: userId },
      relations: ['territory'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Lead istatistiklerini getir
   */
  async getStats(): Promise<{
    total: number;
    byStatus: Record<LeadStatus, number>;
    byPriority: Record<LeadPriority, number>;
    conversionRate: number;
    totalExpectedRevenue: number;
    thisMonth: number;
  }> {
    const total = await this.leadRepository.count();
    
    // Durum bazlı sayılar
    const byStatus: Record<string, number> = {};
    for (const status of Object.values(LeadStatus)) {
      byStatus[status] = await this.leadRepository.count({ where: { status } });
    }

    // Öncelik bazlı sayılar
    const byPriority: Record<string, number> = {};
    for (const priority of Object.values(LeadPriority)) {
      byPriority[priority] = await this.leadRepository.count({ where: { priority } });
    }

    // Dönüşüm oranı
    const convertedCount = byStatus[LeadStatus.CONVERTED] || 0;
    const conversionRate = total > 0 ? (convertedCount / total) * 100 : 0;

    // Toplam beklenen gelir
    const revenueResult = await this.leadRepository
      .createQueryBuilder('lead')
      .select('SUM(lead.expectedRevenue)', 'total')
      .getRawOne();
    const totalExpectedRevenue = parseFloat(revenueResult?.total || '0');

    // Bu ay oluşturulan leadler
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = await this.leadRepository.count({
      where: { createdAt: MoreThanOrEqual(startOfMonth) },
    });

    return {
      total,
      byStatus: byStatus as Record<LeadStatus, number>,
      byPriority: byPriority as Record<LeadPriority, number>,
      conversionRate: Math.round(conversionRate * 100) / 100,
      totalExpectedRevenue,
      thisMonth,
    };
  }
}
