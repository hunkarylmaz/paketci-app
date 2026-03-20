import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Courier, CourierStatus } from '../../modules/couriers/entities/courier.entity';
import { Shift, ShiftStatus } from '../../modules/shifts/entities/shift.entity';
import { Restaurant } from '../../modules/restaurants/entities/restaurant.entity';

export interface AssignmentCandidate {
  courier: Courier;
  shift: Shift;
  score: number; // 0-100 arası uyum puanı
  estimatedArrivalTime: Date;
  distance: number;
  compatibility: {
    shiftActive: boolean;
    inZone: boolean;
    workload: number; // 0-100
    performance: number; // 0-100
  };
}

@Injectable()
export class SmartAssignmentService {
  constructor(
    @InjectRepository(Courier)
    private courierRepository: Repository<Courier>,
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  /**
   * Restoran hazırlık süresine göre en uygun kuryeyi bul
   */
  async findBestCourier(
    restaurantId: string,
    companyId: string,
    options: {
      maxDistance?: number; // km
      preferActiveShift?: boolean;
      minPerformance?: number;
    } = {}
  ): Promise<AssignmentCandidate | null> {
    const { maxDistance = 10, preferActiveShift = true, minPerformance = 70 } = options;

    // Restoran bilgilerini al
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId, companyId },
    });

    if (!restaurant) {
      throw new Error('Restoran bulunamadı');
    }

    // Hazırlık süresini hesapla
    const preparationTime = this.calculatePreparationTime(restaurant);
    const estimatedReadyTime = new Date(Date.now() + preparationTime * 60000);

    // Müsait kuryeleri bul
    const candidates = await this.findAvailableCouriers(companyId, maxDistance, restaurant);

    if (candidates.length === 0) {
      return null;
    }

    // Her kurye için uyum puanı hesapla
    const scoredCandidates: AssignmentCandidate[] = await Promise.all(
      candidates.map(async (courier) => {
        const shift = await this.getActiveShift(courier.id, companyId);
        const distance = this.calculateDistance(
          restaurant.latitude,
          restaurant.longitude,
          courier.currentLatitude,
          courier.currentLongitude
        );

        // Tahmini varış zamanı
        const estimatedTravelTime = this.estimateTravelTime(distance);
        const estimatedArrivalTime = new Date(Date.now() + estimatedTravelTime * 60000);

        // Uyum puanı hesapla
        const score = this.calculateCompatibilityScore({
          courier,
          shift,
          distance,
          estimatedArrivalTime,
          estimatedReadyTime,
          preparationTime,
          preferActiveShift,
          minPerformance,
        });

        return {
          courier,
          shift,
          score,
          estimatedArrivalTime,
          distance,
          compatibility: {
            shiftActive: !!shift && shift.status === ShiftStatus.ACTIVE,
            inZone: distance <= maxDistance,
            workload: await this.getCourierWorkload(courier.id),
            performance: courier.performanceRating || 80,
          },
        };
      })
    );

    // Puana göre sırala ve en iyiyi döndür
    scoredCandidates.sort((a, b) => b.score - a.score);
    return scoredCandidates[0] || null;
  }

  /**
   * Restoranın hazırlık süresini hesapla
   */
  private calculatePreparationTime(restaurant: Restaurant): number {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Saat bazlı hazırlık süresi var mı?
    if (restaurant.preparationTimeByHour?.[currentHour]) {
      return restaurant.preparationTimeByHour[currentHour];
    }

    // Yoğun saat kontrolü
    const isRushHour = (currentHour >= 12 && currentHour <= 14) || 
                       (currentHour >= 19 && currentHour <= 21);
    
    if (isRushHour) {
      return Math.min(restaurant.averagePreparationTime * 1.3, restaurant.maxPreparationTime);
    }

    return restaurant.averagePreparationTime;
  }

  /**
   * Müsait kuryeleri bul
   */
  private async findAvailableCouriers(
    companyId: string,
    maxDistance: number,
    restaurant: Restaurant
  ): Promise<Courier[]> {
    return this.courierRepository.find({
      where: {
        companyId,
        status: CourierStatus.ONLINE,
        isOnDelivery: false,
        isOnBreak: false,
      },
    });
  }

  /**
   * Aktif vardiya bul
   */
  private async getActiveShift(
    courierId: string,
    companyId: string
  ): Promise<Shift | null> {
    const now = new Date();
    
    return this.shiftRepository.findOne({
      where: {
        courierId,
        companyId,
        status: ShiftStatus.ACTIVE,
        plannedStartAt: Between(
          new Date(now.getTime() - 24 * 60 * 60 * 1000), // 24 saat önce
          new Date(now.getTime() + 24 * 60 * 60 * 1000)  // 24 saat sonra
        ),
      },
    });
  }

  /**
   * İki nokta arası mesafe (km)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  /**
   * Seyahat süresi tahmini (dakika)
   */
  private estimateTravelTime(distanceKm: number): number {
    // Ortalama hız: 25 km/s (şehir içi)
    const baseTime = (distanceKm / 25) * 60;
    // Trafik payı ekle
    return Math.round(baseTime * 1.2);
  }

  /**
   * Uyum puanı hesapla (0-100)
   */
  private calculateCompatibilityScore(params: {
    courier: Courier;
    shift: Shift | null;
    distance: number;
    estimatedArrivalTime: Date;
    estimatedReadyTime: Date;
    preparationTime: number;
    preferActiveShift: boolean;
    minPerformance: number;
  }): number {
    let score = 0;
    const {
      courier,
      shift,
      distance,
      estimatedArrivalTime,
      estimatedReadyTime,
      preparationTime,
      preferActiveShift,
      minPerformance,
    } = params;

    // 1. Mesafe puanı (30 puan)
    const distanceScore = Math.max(0, 30 - distance * 3);
    score += distanceScore;

    // 2. Vardiya uyumu (25 puan)
    if (shift) {
      if (shift.status === ShiftStatus.ACTIVE) {
        score += 25;
      } else if (shift.status === ShiftStatus.SCHEDULED) {
        score += 10;
      }
    } else if (!preferActiveShift) {
      score += 15;
    }

    // 3. Zamanlama uyumu (25 puan)
    const arrivalDiff = Math.abs(
      estimatedArrivalTime.getTime() - estimatedReadyTime.getTime()
    ) / 60000; // dakika farkı

    if (arrivalDiff <= 5) {
      score += 25; // Mükemmel zamanlama
    } else if (arrivalDiff <= 10) {
      score += 20; // İyi zamanlama
    } else if (arrivalDiff <= 15) {
      score += 10; // Kabul edilebilir
    }

    // 4. Performans puanı (20 puan)
    const performance = courier.performanceRating || 80;
    if (performance >= minPerformance) {
      score += (performance / 100) * 20;
    }

    return Math.round(score);
  }

  /**
   * Kurye iş yükü (aktif teslimat sayısı)
   */
  private async getCourierWorkload(courierId: string): Promise<number> {
    // Aktif teslimat sayısını döndür (0-100 arası normalize edilmiş)
    // Şimdilik basit hesaplama
    return 30; // Placeholder
  }

  /**
   * Toplu atama önerileri
   */
  async getAssignmentRecommendations(
    companyId: string,
    pendingDeliveries: any[]
  ): Promise<Map<string, AssignmentCandidate>> {
    const recommendations = new Map<string, AssignmentCandidate>();

    for (const delivery of pendingDeliveries) {
      const bestCourier = await this.findBestCourier(
        delivery.restaurantId,
        companyId
      );
      
      if (bestCourier && bestCourier.score >= 60) {
        recommendations.set(delivery.id, bestCourier);
      }
    }

    return recommendations;
  }
}
