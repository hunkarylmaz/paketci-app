import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { POSIntegrationService } from './pos-integration.service';
import { POSIntegration, CallerIDDevice, Printer } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([POSIntegration, CallerIDDevice, Printer]),
    HttpModule,
  ],
  providers: [POSIntegrationService],
  exports: [POSIntegrationService],
})
export class PosIntegrationModule {}
