import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Territory, TerritoryStatus } from './entities/territory.entity';
import { CreateTerritoryDto } from './dto/create-territory.dto';
import { UpdateTerritoryDto } from './dto/update-territory.dto';

@Injectable()
export class TerritoriesService {
  constructor(
    @InjectRepository(Territory)
    private territoryRepository: Repository<Territory>,
  ) {}

  async create(createTerritoryDto: CreateTerritoryDto): Promise<Territory> {
    const existingTerritory = await this.territoryRepository.findOne({
      where: { code: createTerritoryDto.code },
    });
    if (existingTerritory) {
      throw new ConflictException('Bu kod ile bir bölge zaten mevcut');
    }

    const territory = this.territoryRepository.create(createTerritoryDto);
    return this.territoryRepository.save(territory);
  }

  async findAll(filters?: {
    status?: TerritoryStatus;
    regionId?: string;
    fieldSalesId?: string;
  }): Promise<Territory[]> {
    const query = this.territoryRepository.createQueryBuilder('territory')
      .leftJoinAndSelect('territory.region', 'region')
      .leftJoinAndSelect('territory.fieldSales', 'fieldSales')
      .leftJoinAndSelect('territory.restaurants', 'restaurants');

    if (filters?.status) {
      query.andWhere('territory.status = :status', { status: filters.status });
    }
    if (filters?.regionId) {
      query.andWhere('territory.regionId = :regionId', { regionId: filters.regionId });
    }
    if (filters?.fieldSalesId) {
      query.andWhere('territory.fieldSalesId = :fieldSalesId', { fieldSalesId: filters.fieldSalesId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Territory> {
    const territory = await this.territoryRepository.findOne({
      where: { id },
      relations: ['region', 'fieldSales', 'restaurants', 'leads'],
    });

    if (!territory) {
      throw new NotFoundException('Bölge bulunamadı');
    }

    return territory;
  }

  async findByCode(code: string): Promise<Territory | null> {
    return this.territoryRepository.findOne({
      where: { code },
      relations: ['region', 'fieldSales'],
    });
  }

  async update(id: string, updateTerritoryDto: UpdateTerritoryDto): Promise<Territory> {
    const territory = await this.findOne(id);

    if (updateTerritoryDto.code && updateTerritoryDto.code !== territory.code) {
      const existingTerritory = await this.findByCode(updateTerritoryDto.code);
      if (existingTerritory) {
        throw new ConflictException('Bu kod ile bir bölge zaten mevcut');
      }
    }

    Object.assign(territory, updateTerritoryDto);
    return this.territoryRepository.save(territory);
  }

  async remove(id: string): Promise<void> {
    const territory = await this.findOne(id);
    await this.territoryRepository.remove(territory);
  }

  async assignFieldSales(id: string, fieldSalesId: string): Promise<Territory> {
    const territory = await this.findOne(id);
    territory.fieldSalesId = fieldSalesId;
    return this.territoryRepository.save(territory);
  }
}
