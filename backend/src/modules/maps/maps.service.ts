import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

interface Coordinates {
  lat: number;
  lng: number;
}

interface RouteResult {
  distance: number; // metre
  duration: number; // saniye
  geometry: string; // polyline
  steps: RouteStep[];
  waypoints: Coordinates[];
}

interface RouteStep {
  distance: number;
  duration: number;
  instruction: string;
  name: string;
  coordinates: Coordinates;
}

interface GeocodingResult {
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  address: {
    road?: string;
    houseNumber?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

interface MapTileOptions {
  zoom: number;
  x: number;
  y: number;
  style?: 'standard' | 'dark' | 'satellite';
}

@Injectable()
export class MapsService {
  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org';
  private readonly osrmUrl = 'https://router.project-osrm.org';
  private readonly tileServers = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  constructor(
    private readonly httpService: HttpService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  // ==================== ROTA HESAPLAMA (OSRM) ====================

  async calculateRoute(origin: Coordinates, destination: Coordinates, waypoints?: Coordinates[]): Promise<RouteResult> {
    try {
      // Cache key oluştur
      const cacheKey = `route:${origin.lat},${origin.lng}:${destination.lat},${destination.lng}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // OSRM API çağrısı
      let coordinates = `${origin.lng},${origin.lat}`;
      if (waypoints?.length) {
        coordinates += ';' + waypoints.map(w => `${w.lng},${w.lat}`).join(';');
      }
      coordinates += `;${destination.lng},${destination.lat}`;

      const url = `${this.osrmUrl}/route/v1/driving/${coordinates}?overview=full&geometries=polyline&steps=true&alternatives=false`;

      const response = await firstValueFrom(this.httpService.get(url));
      const route = response.data.routes[0];

      if (!route) {
        throw new HttpException('Rota bulunamadı', HttpStatus.NOT_FOUND);
      }

      const result: RouteResult = {
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry,
        waypoints: route.waypoints?.map((wp: any) => ({
          lat: wp.location[1],
          lng: wp.location[0],
        })) || [origin, destination],
        steps: route.legs[0]?.steps.map((step: any) => ({
          distance: step.distance,
          duration: step.duration,
          instruction: this.formatInstruction(step.maneuver.type, step.name),
          name: step.name,
          coordinates: {
            lat: step.maneuver.location[1],
            lng: step.maneuver.location[0],
          },
        })) || [],
      };

      // Cache'e kaydet (5 dakika)
      await this.redis.setex(cacheKey, 300, JSON.stringify(result));

      return result;
    } catch (error) {
      throw new HttpException(
        `Rota hesaplanamadı: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async calculateOptimizedRoute(waypoints: Coordinates[]): Promise<RouteResult> {
    if (waypoints.length < 2) {
      throw new HttpException('En az 2 nokta gerekli', HttpStatus.BAD_REQUEST);
    }

    try {
      // OSRM Trip API - en optimize rotayı hesaplar
      const coordinates = waypoints.map(w => `${w.lng},${w.lat}`).join(';');
      const url = `${this.osrmUrl}/trip/v1/driving/${coordinates}?roundtrip=false&source=first&destination=last&overview=full&geometries=polyline`;

      const response = await firstValueFrom(this.httpService.get(url));
      const trip = response.data.trips[0];

      if (!trip) {
        throw new HttpException('Optimize rota bulunamadı', HttpStatus.NOT_FOUND);
      }

      return {
        distance: trip.distance,
        duration: trip.duration,
        geometry: trip.geometry,
        waypoints: waypoints,
        steps: [], // Trip API adım detayı vermez
      };
    } catch (error) {
      throw new HttpException(
        `Optimize rota hesaplanamadı: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== GEOCODING (Nominatim) ====================

  async geocodeAddress(address: string): Promise<GeocodingResult[]> {
    try {
      const cacheKey = `geocode:${Buffer.from(address).toString('base64')}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const url = `${this.nominatimUrl}/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=5`;

      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { 'User-Agent': 'PaketciApp/1.0' },
        }),
      );

      const results: GeocodingResult[] = response.data.map((item: any) => ({
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
        address: {
          road: item.address?.road,
          houseNumber: item.address?.house_number,
          suburb: item.address?.suburb || item.address?.neighbourhood,
          city: item.address?.city || item.address?.town,
          state: item.address?.state,
          postcode: item.address?.postcode,
          country: item.address?.country,
        },
      }));

      // Cache'e kaydet (24 saat)
      await this.redis.setex(cacheKey, 86400, JSON.stringify(results));

      return results;
    } catch (error) {
      throw new HttpException(
        `Adres aranamadı: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult> {
    try {
      const cacheKey = `reverse:${lat},${lng}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const url = `${this.nominatimUrl}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { 'User-Agent': 'PaketciApp/1.0' },
        }),
      );

      const item = response.data;
      const result: GeocodingResult = {
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
        address: {
          road: item.address?.road,
          houseNumber: item.address?.house_number,
          suburb: item.address?.suburb,
          city: item.address?.city || item.address?.town,
          state: item.address?.state,
          postcode: item.address?.postcode,
          country: item.address?.country,
        },
      };

      // Cache'e kaydet (24 saat)
      await this.redis.setex(cacheKey, 86400, JSON.stringify(result));

      return result;
    } catch (error) {
      throw new HttpException(
        `Koordinat çözümlenemedi: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== HARİTA TILE'LERİ ====================

  getTileUrl(style: 'standard' | 'dark' | 'satellite' = 'standard'): string {
    return this.tileServers[style];
  }

  getTileServers(): Record<string, string> {
    return this.tileServers;
  }

  // ==================== MESAFE VE SÜRE HESAPLAMA ====================

  async calculateDistanceMatrix(origins: Coordinates[], destinations: Coordinates[]): Promise<number[][]> {
    // OSRM Table API kullanarak mesafe matrisi hesaplama
    try {
      const allPoints = [...origins, ...destinations];
      const coordinates = allPoints.map(p => `${p.lng},${p.lat}`).join(';');
      const url = `${this.osrmUrl}/table/v1/driving/${coordinates}?annotations=distance`;

      const response = await firstValueFrom(this.httpService.get(url));
      const distances: number[][] = response.data.distances;

      // Sadece origins x destinations kısmını döndür
      return distances.slice(0, origins.length).map(row =>
        row.slice(origins.length),
      );
    } catch (error) {
      throw new HttpException(
        `Mesafe matrisi hesaplanamadı: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== YARDIMCI METODLAR ====================

  private formatInstruction(type: string, name: string): string {
    const instructions: Record<string, string> = {
      turn: `Dönüş yapın: ${name}`,
      'new name': `Yola devam edin: ${name}`,
      depart: `Başlangıç noktasından hareket edin`,
      arrive: `Hedefe ulaştınız`,
      merge: `Yola girin: ${name}`,
      'on ramp': `Bağlantı yoluna girin: ${name}`,
      'off ramp': `Bağlantı yolundan çıkın: ${name}`,
      fork: `Yol ayrımında ${name} yönüne gidin`,
      'end of road': `Yol sonunda ${name} yönüne dönün`,
      continue: `${name} üzerinde devam edin`,
      roundabout: `Döner kavşaktan çıkın: ${name}`,
      'exit roundabout': `Döner kavşaktan ${name} yönüne çıkın`,
      rotary: `Döner kavşağa girin: ${name}`,
      'exit rotary': `Döner kavşaktan ${name} yönüne çıkın`,
      'roundabout turn': `Döner kavşakta dönün: ${name}`,
      notification: `${name}`,
    };

    return instructions[type] || `Devam edin: ${name}`;
  }

  // Polyline decoder (Google encoded polyline format)
  decodePolyline(encoded: string): Coordinates[] {
    const coordinates: Coordinates[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let shift = 0;
      let result = 0;
      let byte;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      coordinates.push({
        lat: lat / 1e5,
        lng: lng / 1e5,
      });
    }

    return coordinates;
  }
}
