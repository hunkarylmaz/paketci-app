import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { MapsService } from './maps.service';

interface Coordinates {
  lat: number;
  lng: number;
}

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  // ==================== ROTA HESAPLAMA ====================

  @Post('route')
  async calculateRoute(
    @Body() body: {
      origin: Coordinates;
      destination: Coordinates;
      waypoints?: Coordinates[];
    },
  ) {
    return this.mapsService.calculateRoute(
      body.origin,
      body.destination,
      body.waypoints,
    );
  }

  @Post('route/optimized')
  async calculateOptimizedRoute(
    @Body() body: { waypoints: Coordinates[] },
  ) {
    return this.mapsService.calculateOptimizedRoute(body.waypoints);
  }

  // ==================== GEOCODING ====================

  @Get('geocode')
  async geocodeAddress(@Query('address') address: string) {
    return this.mapsService.geocodeAddress(address);
  }

  @Get('reverse-geocode')
  async reverseGeocode(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.mapsService.reverseGeocode(parseFloat(lat), parseFloat(lng));
  }

  // ==================== HARİTA SERVİSLERİ ====================

  @Get('tiles')
  getTileServers() {
    return {
      servers: this.mapsService.getTileServers(),
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    };
  }

  @Post('distance-matrix')
  async calculateDistanceMatrix(
    @Body() body: { origins: Coordinates[]; destinations: Coordinates[] },
  ) {
    return this.mapsService.calculateDistanceMatrix(
      body.origins,
      body.destinations,
    );
  }

  @Post('polyline/decode')
  decodePolyline(@Body() body: { encoded: string }) {
    return {
      coordinates: this.mapsService.decodePolyline(body.encoded),
    };
  }
}
