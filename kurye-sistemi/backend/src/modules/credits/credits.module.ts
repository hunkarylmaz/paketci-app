import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditsController } from './credits.controller';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Credit } from './entities/credit.entity';
import { Company } from '../companies/entities/company.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Credit, Company]),
    NotificationsModule,
  ],
  controllers: [CreditsController, PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class CreditsModule {}
