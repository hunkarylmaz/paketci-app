import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { CouriersModule } from './modules/couriers/couriers.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { CreditsModule } from './modules/credits/credits.module';
import { UsersModule } from './modules/users/users.module';
import { MapsModule } from './modules/maps/maps.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { CommonModule } from './common/common.module';

import { ReceiptsModule } from './modules/receipts/receipts.module';
import { ExtensionModule } from './modules/extension/extension.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { TrackingModule } from './modules/tracking/tracking.module';

// New comprehensive modules
import { RegionsModule } from './modules/regions/regions.module';
import { DealersModule } from './modules/dealers/dealers.module';
import { TerritoriesModule } from './modules/territories/territories.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { LeadsModule } from './modules/leads/leads.module';
import { VisitsModule } from './modules/visits/visits.module';
import { ContractsModule } from './modules/contracts/contracts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get('DB_PORT', 5432),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASS', 'password'),
        database: config.get('DB_NAME', 'kurye_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    CompaniesModule,
    RestaurantsModule,
    CouriersModule,
    DeliveriesModule,
    CreditsModule,
    MapsModule,
    NotificationsModule,
    ReportsModule,
    ShiftsModule,
    ReceiptsModule,
    ExtensionModule,
    WebhooksModule,
    IntegrationsModule,
    TrackingModule,
    // New modules
    RegionsModule,
    DealersModule,
    TerritoriesModule,
    InvoicesModule,
    PaymentsModule,
    LeadsModule,
    VisitsModule,
    ContractsModule,
    CommonModule,
  ],
})
export class AppModule {}
