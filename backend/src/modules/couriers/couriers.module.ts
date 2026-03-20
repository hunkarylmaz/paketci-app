import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouriersController } from './couriers.controller';
import { Courier } from './entities/courier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Courier])],
  controllers: [CouriersController],
})
export class CouriersModule {}
