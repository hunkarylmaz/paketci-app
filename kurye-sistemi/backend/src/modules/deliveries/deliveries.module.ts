import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { Delivery } from './entities/delivery.entity';
import { Company } from '../companies/entities/company.entity';
import { Credit } from '../credits/entities/credit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, Company, Credit])],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
  exports: [DeliveriesService],
})
export class DeliveriesModule {}
