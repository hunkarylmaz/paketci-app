import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant, RestaurantSalesStatus } from './entities/restaurant.entity';
import { UserRole } from '../users/enums/user-role.enum';

export interface CreateRestaurantDto {
  name: string;
  email: string;
  phone?: string;
  brandName?: string;
  taxNumber?: string;
  supportPhone?: string;
  address: any;
  location: any;
  pricingType: string;
  pricingConfig: any;
  // Yeni alanlar
  companyId?: string;
  dealerId?: string;
  regionId?: string;
  territoryId?: string;
  fieldSalesId?: string;
  priority?: number;
}

export interface UpdateRestaurantDto extends Partial<CreateRestaurantDto> {
  salesStatus?: RestaurantSalesStatus;
  isActive?: boolean;
}

export interface RestaurantFilters {
  companyId?: string;
  dealerId?: string;
  regionId?: string;
  territoryId?: string;
  fieldSalesId?: string;
  salesStatus?: RestaurantSalesStatus;
  isActive?: boolean;
  city?: string;
  district?: string;
}

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  // Tüm restoranları getir (filtreli)
  async findAll(filters?: RestaurantFilters, user?: any): Promise<Restaurant[]> {
    const query = this.restaurantRepository.createQueryBuilder('restaurant');

    // Kullanıcı rolüne göre filtreleme
    if (user) {
      switch (user.role) {
        case UserRole.DEALER:
          // Bayi sadece kendi restoranlarını görebilir
          if (user.dealerId) {
            query.andWhere('restaurant.dealerId = :dealerId', { dealerId: user.dealerId });
          }
          break;

        case UserRole.REGIONAL_MANAGER:
          // Bölge sorumlusu kendi bölgesindeki restoranları görebilir
          if (user.regionId) {
            query.andWhere('restaurant.regionId = :regionId', { regionId: user.regionId });
          }
          // Veya atanmış restoranları
          if (user.assignedRestaurantIds?.length > 0) {
            query.orWhere('restaurant.id IN (:...assignedIds)', { 
              assignedIds: user.assignedRestaurantIds 
            });
          }
          break;

        case UserRole.FIELD_SALES:
          // Saha satış atanan restoranları görebilir
          if (user.assignedRestaurantIds?.length > 0) {
            query.andWhere('restaurant.id IN (:...assignedIds)', { 
              assignedIds: user.assignedRestaurantIds 
            });
          }
          // Veya kendi territory'sindekiler
          if (user.territoryId) {
            query.orWhere('restaurant.territoryId = :territoryId', { 
              territoryId: user.territoryId 
            });
          }
          break;

        case UserRole.COMPANY_ADMIN:
          // Şirket admini kendi şirketinin restoranlarını görebilir
          if (user.companyId) {
            query.andWhere('restaurant.companyId = :companyId', { 
              companyId: user.companyId 
            });
          }
          break;

        case UserRole.RESTAURANT:
          // Restoran kullanıcısı sadece kendi restoranını görebilir
          query.andWhere('restaurant.id = :restaurantId', { 
            restaurantId: user.restaurantId 
          });
          break;

        // Süper admin tümünü görebilir - ek filtre yok
      }
    }

    // Manuel filtreler
    if (filters?.companyId) {
      query.andWhere('restaurant.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.dealerId) {
      query.andWhere('restaurant.dealerId = :dealerId', { dealerId: filters.dealerId });
    }
    if (filters?.regionId) {
      query.andWhere('restaurant.regionId = :regionId', { regionId: filters.regionId });
    }
    if (filters?.territoryId) {
      query.andWhere('restaurant.territoryId = :territoryId', { territoryId: filters.territoryId });
    }
    if (filters?.fieldSalesId) {
      query.andWhere('restaurant.fieldSalesId = :fieldSalesId', { fieldSalesId: filters.fieldSalesId });
    }
    if (filters?.salesStatus) {
      query.andWhere('restaurant.salesStatus = :salesStatus', { salesStatus: filters.salesStatus });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('restaurant.isActive = :isActive', { isActive: filters.isActive });
    }
    if (filters?.city) {
      query.andWhere("restaurant.address->>'city' = :city", { city: filters.city });
    }
    if (filters?.district) {
      query.andWhere("restaurant.address->>'district' = :district", { district: filters.district });
    }

    return query
      .leftJoinAndSelect('restaurant.users', 'users')
      .orderBy('restaurant.createdAt', 'DESC')
      .getMany();
  }

  // ID ile restoran getir
  async findById(id: string, user?: any): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restoran bulunamadı');
    }

    // Yetki kontrolü
    if (user) {
      const hasAccess = await this.checkAccess(restaurant, user);
      if (!hasAccess) {
        throw new NotFoundException('Restoran bulunamadı');
      }
    }

    return restaurant;
  }

  // Yeni restoran oluştur
  async create(createDto: CreateRestaurantDto, user?: any): Promise<Restaurant> {
    // Otomatik atamalar (kullanıcı rolüne göre)
    const data: any = { ...createDto };

    if (user) {
      if (user.role === UserRole.DEALER && user.dealerId) {
        data.dealerId = user.dealerId;
        data.dealerName = user.dealerName;
      }
      if (user.role === UserRole.REGIONAL_MANAGER && user.regionId) {
        data.regionId = user.regionId;
        data.regionName = user.regionName;
      }
      if (user.role === UserRole.FIELD_SALES) {
        if (user.territoryId) {
          data.territoryId = user.territoryId;
          data.territoryName = user.territoryName;
        }
        data.fieldSalesId = user.id;
        data.fieldSalesName = `${user.firstName} ${user.lastName}`;
      }
      if (user.companyId) {
        data.companyId = user.companyId;
      }
    }

    const restaurant = this.restaurantRepository.create(data);
    return this.restaurantRepository.save(restaurant);
  }

  // Restoran güncelle
  async update(id: string, updateDto: UpdateRestaurantDto, user?: any): Promise<Restaurant> {
    const restaurant = await this.findById(id, user);

    Object.assign(restaurant, updateDto);
    return this.restaurantRepository.save(restaurant);
  }

  // Restoran sil (soft delete)
  async remove(id: string, user?: any): Promise<void> {
    const restaurant = await this.findById(id, user);
    restaurant.isActive = false;
    await this.restaurantRepository.save(restaurant);
  }

  // Ziyet kaydet (Saha Satış için)
  async recordVisit(id: string, userId: string, userName: string): Promise<Restaurant> {
    const restaurant = await this.findById(id);
    
    restaurant.lastVisitAt = new Date();
    restaurant.visitCount += 1;
    
    // İlk ziyetse durumu güncelle
    if (restaurant.salesStatus === RestaurantSalesStatus.LEAD) {
      restaurant.salesStatus = RestaurantSalesStatus.VISITED;
    }

    return this.restaurantRepository.save(restaurant);
  }

  // Durum güncelle (Saha Satış için)
  async updateSalesStatus(
    id: string, 
    status: RestaurantSalesStatus, 
    user?: any
  ): Promise<Restaurant> {
    const restaurant = await this.findById(id, user);
    restaurant.salesStatus = status;
    
    if (status === RestaurantSalesStatus.ACTIVE) {
      restaurant.activatedAt = new Date();
      restaurant.isActive = true;
    }

    return this.restaurantRepository.save(restaurant);
  }

  // Atama yap (Bölge Sorumlusu için)
  async assignRestaurant(
    id: string, 
    assignments: {
      dealerId?: string;
      dealerName?: string;
      regionId?: string;
      regionName?: string;
      fieldSalesId?: string;
      fieldSalesName?: string;
    },
    user?: any
  ): Promise<Restaurant> {
    const restaurant = await this.findById(id, user);

    if (assignments.dealerId !== undefined) {
      restaurant.dealerId = assignments.dealerId;
      restaurant.dealerName = assignments.dealerName;
    }
    if (assignments.regionId !== undefined) {
      restaurant.regionId = assignments.regionId;
      restaurant.regionName = assignments.regionName;
    }
    if (assignments.fieldSalesId !== undefined) {
      restaurant.fieldSalesId = assignments.fieldSalesId;
      restaurant.fieldSalesName = assignments.fieldSalesName;
    }

    return this.restaurantRepository.save(restaurant);
  }

  // İstatistikler (Dashboard için)
  async getStats(filters?: RestaurantFilters): Promise<{
    total: number;
    byStatus: Record<RestaurantSalesStatus, number>;
    byRegion: Record<string, number>;
    byDealer: Record<string, number>;
  }> {
    const query = this.restaurantRepository.createQueryBuilder('restaurant');

    // Filtreleri uygula
    if (filters?.companyId) {
      query.andWhere('restaurant.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.regionId) {
      query.andWhere('restaurant.regionId = :regionId', { regionId: filters.regionId });
    }
    if (filters?.dealerId) {
      query.andWhere('restaurant.dealerId = :dealerId', { dealerId: filters.dealerId });
    }

    const restaurants = await query.getMany();

    const byStatus: Record<string, number> = {};
    const byRegion: Record<string, number> = {};
    const byDealer: Record<string, number> = {};

    restaurants.forEach(r => {
      byStatus[r.salesStatus] = (byStatus[r.salesStatus] || 0) + 1;
      if (r.regionName) {
        byRegion[r.regionName] = (byRegion[r.regionName] || 0) + 1;
      }
      if (r.dealerName) {
        byDealer[r.dealerName] = (byDealer[r.dealerName] || 0) + 1;
      }
    });

    return {
      total: restaurants.length,
      byStatus: byStatus as Record<RestaurantSalesStatus, number>,
      byRegion,
      byDealer,
    };
  }

  // Erişim kontrolü
  private async checkAccess(restaurant: Restaurant, user: any): Promise<boolean> {
    if (user.role === UserRole.SUPER_ADMIN) return true;
    if (user.role === UserRole.COMPANY_ADMIN && user.companyId === restaurant.companyId) return true;
    if (user.role === UserRole.DEALER && user.dealerId === restaurant.dealerId) return true;
    if (user.role === UserRole.REGIONAL_MANAGER && user.regionId === restaurant.regionId) return true;
    if (user.role === UserRole.FIELD_SALES && restaurant.fieldSalesId === user.id) return true;
    if (user.role === UserRole.RESTAURANT && user.restaurantId === restaurant.id) return true;

    return false;
  }
}
