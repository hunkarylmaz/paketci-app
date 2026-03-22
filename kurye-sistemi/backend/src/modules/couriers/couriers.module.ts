import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouriersController } from './couriers.controller';
import { CouriersService } from './couriers.service';
import { Courier } from './entities/courier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Courier])],
  controllers: [CouriersController],
  providers: [CouriersService],
  exports: [CouriersService],
})
export class CouriersModule {}
