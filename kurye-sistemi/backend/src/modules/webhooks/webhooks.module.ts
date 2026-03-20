import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantPlatformConfig } from '../integrations/entities/restaurant-platform-config.entity';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantPlatformConfig]),
    DeliveriesModule,
    NotificationsModule,
  ],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
