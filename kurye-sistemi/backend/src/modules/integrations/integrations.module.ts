import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { RestaurantPlatformConfig } from './entities/restaurant-platform-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantPlatformConfig])],
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
})
export class IntegrationsModule {}
