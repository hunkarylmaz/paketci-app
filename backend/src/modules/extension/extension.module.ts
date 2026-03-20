import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtensionController } from './extension.controller';
import { ExtensionService } from './extension.service';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { Delivery } from '../deliveries/entities/delivery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, Delivery]),
  ],
  controllers: [ExtensionController],
  providers: [ExtensionService],
  exports: [ExtensionService],
})
export class ExtensionModule {}
