import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { Receipt } from './entities/receipt.entity';
import { Company } from '../companies/entities/company.entity';
import { Delivery } from '../deliveries/entities/delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt, Company, Delivery])],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
  exports: [ReceiptsService],
})
export class ReceiptsModule {}
