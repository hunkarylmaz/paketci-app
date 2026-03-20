import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region, RegionStatus } from './entities/region.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    const existingRegion = await this.regionRepository.findOne({
      where: { code: createRegionDto.code },
    });
    if (existingRegion) {
      throw new ConflictException('Bu kod ile bir bölge zaten mevcut');
    }

    const region = this.regionRepository.create(createRegionDto);
    return this.regionRepository.save(region);
  }

  async findAll(filters?: {
    status?: RegionStatus;
    managerId?: string;
  }): Promise<Region[]> {
    const query = this.regionRepository.createQueryBuilder('region')
      .leftJoinAndSelect('region.manager', 'manager')
      .leftJoinAndSelect('region.dealers', 'dealers')
      .leftJoinAndSelect('region.territories', 'territories');

    if (filters?.status) {
      query.andWhere('region.status = :status', { status: filters.status });
    }
    if (filters?.managerId) {
      query.andWhere('region.managerId = :managerId', { managerId: filters.managerId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Region> {
    const region = await this.regionRepository.findOne({
      where: { id },
      relations: ['manager', 'dealers', 'territories', 'restaurants'],
    });

    if (!region) {
      throw new NotFoundException('Bölge bulunamadı');
    }

    return region;
  }

  async findByCode(code: string): Promise<Region | null> {
    return this.regionRepository.findOne({
      where: { code },
      relations: ['manager', 'dealers', 'territories'],
    });
  }

  async update(id: string, updateRegionDto: UpdateRegionDto): Promise<Region> {
    const region = await this.findOne(id);

    if (updateRegionDto.code && updateRegionDto.code !== region.code) {
      const existingRegion = await this.findByCode(updateRegionDto.code);
      if (existingRegion) {
        throw new ConflictException('Bu kod ile bir bölge zaten mevcut');
      }
    }

    Object.assign(region, updateRegionDto);
    return this.regionRepository.save(region);
  }

  async remove(id: string): Promise<void> {
    const region = await this.findOne(id);
    await this.regionRepository.remove(region);
  }

  async getStats(id?: string): Promise<any> {
    const query = this.regionRepository.createQueryBuilder('region')
      .leftJoin('region.dealers', 'dealers')
      .leftJoin('region.territories', 'territories')
      .leftJoin('region.restaurants', 'restaurants')
      .select([
        'region.id',
        'region.name',
        'region.code',
        'COUNT(DISTINCT dealers.id) as dealerCount',
        'COUNT(DISTINCT territories.id) as territoryCount',
        'COUNT(DISTINCT restaurants.id) as restaurantCount',
      ])
      .groupBy('region.id');

    if (id) {
      query.where('region.id = :id', { id });
      const result = await query.getRawOne();
      if (!result) {
        throw new NotFoundException('Bölge bulunamadı');
      }
      return {
        id: result.region_id,
        name: result.region_name,
        code: result.region_code,
        dealerCount: parseInt(result.dealercount, 10) || 0,
        territoryCount: parseInt(result.territorycount, 10) || 0,
        restaurantCount: parseInt(result.restaurantcount, 10) || 0,
      };
    }

    const results = await query.getRawMany();
    return results.map(r => ({
      id: r.region_id,
      name: r.region_name,
      code: r.region_code,
      dealerCount: parseInt(r.dealercount, 10) || 0,
      territoryCount: parseInt(r.territorycount, 10) || 0,
      restaurantCount: parseInt(r.restaurantcount, 10) || 0,
    }));
  }
}
