import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Cron } from '@nestjs/schedule';

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  timestamp: Date;
}

export interface CourierLocation {
  courierId: string;
  position: GeoPosition;
  batteryLevel: number;
  isOnline: boolean;
  lastSeen: Date;
}

export interface NearbyCourier {
  courierId: string;
  distance: number; // metre
  position: GeoPosition;
  eta?: number; // dakika
}

export interface OptimizedRoute {
  waypoints: GeoPosition[];
  totalDistance: number; // metre
  estimatedDuration: number; // dakika
  polylines: string[]; // Google Maps encoded polyline
}

@Injectable()
export class LocationTrackingService {
  private readonly logger = new Logger(LocationTrackingService.name);
  private readonly REDIS_KEY_PREFIX = 'courier:location:';
  private readonly REDIS_GEO_KEY = 'courier:geo';

  @WebSocketServer()
  private wsServer: Server;

  constructor(@InjectRedis() private redis: Redis) {}

  // Kurye konumunu güncelle
  async updateLocation(data: {
    courierId: string;
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    speed?: number;
    heading?: number;
    batteryLevel: number;
    isMock?: boolean;
    timestamp: Date;
  }): Promise<void> {
    // Sahte konum kontrolü
    if (data.isMock) {
      this.logger.warn(`Mock location detected for courier ${data.courierId}`);
      // Bildirim gönder
      return;
    }

    const location: CourierLocation = {
      courierId: data.courierId,
      position: {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
        altitude: data.altitude,
        speed: data.speed,
        heading: data.heading,
        timestamp: data.timestamp,
      },
      batteryLevel: data.batteryLevel,
      isOnline: true,
      lastSeen: new Date(),
    };

    // Redis'e kaydet (JSON)
    await this.redis.setex(
      `${this.REDIS_KEY_PREFIX}${data.courierId}`,
      300, // 5 dakika TTL
      JSON.stringify(location),
    );

    // Redis Geospatial index'e ekle
    await this.redis.geoadd(
      this.REDIS_GEO_KEY,
      data.longitude,
      data.latitude,
      data.courierId,
    );

    // WebSocket üzerinden yayınla
    this.wsServer.to(`courier:${data.courierId}`).emit('location_update', {
      courierId: data.courierId,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed,
      timestamp: data.timestamp,
    });

    // Restoranlara yoldaki kurye bildirimi
    if (data.speed !== undefined && data.speed > 5) {
      await this.notifyNearbyRestaurants(data.courierId, location);
    }
  }

  // Kurye konumunu al
  async getLocation(courierId: string): Promise<CourierLocation | null> {
    const data = await this.redis.get(`${this.REDIS_KEY_PREFIX}${courierId}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  // Birden fazla kurye konumunu al
  async getMultipleLocations(courierIds: string[]): Promise<CourierLocation[]> {
    const keys = courierIds.map(id => `${this.REDIS_KEY_PREFIX}${id}`);
    const data = await this.redis.mget(...keys);
    
    return data
      .filter(d => d !== null)
      .map(d => JSON.parse(d as string));
  }

  // Belirli bir noktaya yakın kuryeleri bul
  async findNearbyCouriers(
    latitude: number,
    longitude: number,
    radius: number, // metre
    options?: {
      unit?: 'm' | 'km' | 'mi' | 'ft';
      withCoordinates?: boolean;
      withDistance?: boolean;
      count?: number;
      order?: 'ASC' | 'DESC';
    },
  ): Promise<NearbyCourier[]> {
    const {
      unit = 'm',
      withCoordinates = true,
      withDistance = true,
      count = 10,
      order = 'ASC',
    } = options || {};

    // Redis GEOSEARCH komutu (Redis 6.2+)
    const results = await this.redis.geosearch(
      this.REDIS_GEO_KEY,
      'FROMLONLAT',
      longitude,
      latitude,
      'BYRADIUS',
      radius,
      unit,
      'WITHDIST',
      'WITHCOORD',
      'COUNT',
      count,
      order,
    ) as any[];

    const nearby: NearbyCourier[] = [];

    for (let i = 0; i < results.length; i += 3) {
      const courierId = results[i] as string;
      const distance = parseFloat(results[i + 1] as string);
      const coordinates = results[i + 2] as [string, string];

      nearby.push({
        courierId,
        distance,
        position: {
          latitude: parseFloat(coordinates[1]),
          longitude: parseFloat(coordinates[0]),
          timestamp: new Date(),
        },
      });
    }

    return nearby;
  }

  // İki nokta arası mesafe hesapla
  async calculateDistance(
    from: GeoPosition,
    to: GeoPosition,
    unit: 'm' | 'km' = 'm',
  ): Promise<number> {
    const distance = await this.redis.geodist(
      this.REDIS_GEO_KEY,
      `${from.longitude},${from.latitude}`,
      `${to.longitude},${to.latitude}`,
    );

    let meters = parseFloat(distance || '0');
    if (unit === 'km') {
      meters = meters / 1000;
    }
    return meters;
  }

  // ETA (Tahmini varış süresi) hesapla
  calculateETA(
    courierLocation: GeoPosition,
    destination: GeoPosition,
    averageSpeed: number = 30, // km/saat
  ): number {
    // Haversine formülü ile mesafe hesaplama
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = this.toRad(destination.latitude - courierLocation.latitude);
    const dLon = this.toRad(destination.longitude - courierLocation.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(courierLocation.latitude)) *
        Math.cos(this.toRad(destination.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // km

    // Süre hesaplama (dakika)
    const duration = (distance / averageSpeed) * 60;
    return Math.round(duration);
  }

  private toRad(degree: number): number {
    return degree * (Math.PI / 180);
  }

  // Rota optimizasyonu (Google Maps Directions API)
  async optimizeRoute(
    courierId: string,
    deliveries: { orderId: string; latitude: number; longitude: number; priority: number }[],
  ): Promise<OptimizedRoute> {
    // Kurye mevcut konumu
    const courierLoc = await this.getLocation(courierId);
    if (!courierLoc) {
      throw new Error('Courier location not found');
    }

    // Teslimat noktalarını sırala (en yakından uzağa)
    const sortedDeliveries = deliveries.sort((a, b) => {
      const distA = this.calculateHaversine(
        courierLoc.position,
        { latitude: a.latitude, longitude: a.longitude, timestamp: new Date() },
      );
      const distB = this.calculateHaversine(
        courierLoc.position,
        { latitude: b.latitude, longitude: b.longitude, timestamp: new Date() },
      );
      return distA - distB;
    });

    const waypoints: GeoPosition[] = sortedDeliveries.map(d => ({
      latitude: d.latitude,
      longitude: d.longitude,
      timestamp: new Date(),
    }));

    // Toplam mesafe hesapla
    let totalDistance = 0;
    let prevPoint = courierLoc.position;
    
    for (const point of waypoints) {
      totalDistance += this.calculateHaversine(prevPoint, point);
      prevPoint = point;
    }

    // Tahmini süre (ortalama 30 km/saat)
    const estimatedDuration = (totalDistance / 30) * 60;

    return {
      waypoints: [courierLoc.position, ...waypoints],
      totalDistance: Math.round(totalDistance * 1000), // metre
      estimatedDuration: Math.round(estimatedDuration),
      polylines: [], // Google Maps API'den alınacak
    };
  }

  private calculateHaversine(from: GeoPosition, to: GeoPosition): number {
    const R = 6371;
    const dLat = this.toRad(to.latitude - from.latitude);
    const dLon = this.toRad(to.longitude - from.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(from.latitude)) *
        Math.cos(this.toRad(to.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Çevrimdışı kuryeleri kontrol et
  @Cron('*/30 * * * *') // Her 30 saniye
  async checkOfflineCouriers(): Promise<void> {
    const allKeys = await this.redis.keys(`${this.REDIS_KEY_PREFIX}*`);
    const now = Date.now();

    for (const key of allKeys) {
      const data = await this.redis.get(key);
      if (!data) continue;

      const location: CourierLocation = JSON.parse(data);
      const lastSeen = new Date(location.lastSeen).getTime();
      const offlineThreshold = 5 * 60 * 1000; // 5 dakika

      if (now - lastSeen > offlineThreshold && location.isOnline) {
        // Kurye çevrimdışı
        location.isOnline = false;
        await this.redis.setex(
          key,
          300,
          JSON.stringify(location),
        );

        // Bildirim gönder
        // await this.notificationService.send({...})

        this.logger.warn(`Courier ${location.courierId} is offline`);
      }
    }
  }

  // Restoranlara yaklaşan kurye bildirimi
  private async notifyNearbyRestaurants(
    courierId: string,
    location: CourierLocation,
  ): Promise<void> {
    // Yakındaki restoranları bul (örnek: 500m)
    // Bu kısım restoran lokasyonlarına göre implemente edilecek
    
    // WebSocket üzerinden bildirim
    this.wsServer.to('restaurants:nearby').emit('courier_nearby', {
      courierId,
      latitude: location.position.latitude,
      longitude: location.position.longitude,
      timestamp: location.position.timestamp,
    });
  }

  // Konum geçmişi al
  async getLocationHistory(
    courierId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<GeoPosition[]> {
    // PostgreSQL'den veya time-series DB'den al
    // Şimdilik mock
    return [];
  }

  // Bölge kontrolü (Geofencing)
  async checkGeofence(
    courierId: string,
    zoneId: string,
    zoneCenter: GeoPosition,
    radius: number,
  ): Promise<{ isInside: boolean; distance: number }> {
    const courierLoc = await this.getLocation(courierId);
    if (!courierLoc) {
      return { isInside: false, distance: Infinity };
    }

    const distance = this.calculateHaversine(courierLoc.position, zoneCenter) * 1000; // metre
    return {
      isInside: distance <= radius,
      distance: Math.round(distance),
    };
  }
}
