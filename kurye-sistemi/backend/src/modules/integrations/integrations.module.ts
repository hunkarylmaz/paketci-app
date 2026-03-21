import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationsController } from './integrations.controller';
import { WebhookController } from './webhook.controller';
import { IntegrationsService } from './integrations.service';
import { Integration } from './entities/integration.entity';
import { WebhookEvent } from './entities/webhook-event.entity';
import { YemeksepetiAdapter } from './adapters/yemeksepeti.adapter';
import { MigrosYemekAdapter } from './adapters/migrosyemek.adapter';
import { TrendyolYemekAdapter } from './adapters/trendyolyemek.adapter';
import { GetirYemekAdapter } from './adapters/getiryemek.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Integration, WebhookEvent]),
  ],
  controllers: [IntegrationsController, WebhookController],
  providers: [
    IntegrationsService,
    YemeksepetiAdapter,
    MigrosYemekAdapter,
    TrendyolYemekAdapter,
    GetirYemekAdapter,
  ],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
