import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TrackingGateway } from './tracking.gateway';
import { LocationTrackingService } from './location-tracking.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'your-secret-key'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.get('REDIS_URL', 'redis://localhost:6379'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TrackingGateway, LocationTrackingService],
  exports: [LocationTrackingService],
})
export class TrackingModule {}
