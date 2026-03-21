import { IsString, IsOptional, IsEnum, IsObject, IsBoolean, IsNumber } from 'class-validator';
import { IntegrationPlatform, IntegrationStatus } from '../entities/integration.entity';

export class CreateIntegrationDto {
  @IsEnum(IntegrationPlatform)
  platform: IntegrationPlatform;

  @IsString()
  restaurantId: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsString()
  @IsOptional()
  apiSecret?: string;

  @IsString()
  @IsOptional()
  merchantId?: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  webhookUrl?: string;

  @IsString()
  @IsOptional()
  webhookSecret?: string;

  @IsObject()
  @IsOptional()
  settings?: {
    autoSync?: boolean;
    syncInterval?: number;
    notificationEnabled?: boolean;
    chromeExtensionEnabled?: boolean;
  };

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateIntegrationDto {
  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsString()
  @IsOptional()
  apiSecret?: string;

  @IsString()
  @IsOptional()
  merchantId?: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  webhookUrl?: string;

  @IsString()
  @IsOptional()
  webhookSecret?: string;

  @IsEnum(IntegrationStatus)
  @IsOptional()
  status?: IntegrationStatus;

  @IsObject()
  @IsOptional()
  settings?: {
    autoSync?: boolean;
    syncInterval?: number;
    notificationEnabled?: boolean;
    chromeExtensionEnabled?: boolean;
  };

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class TestIntegrationDto {
  @IsEnum(IntegrationPlatform)
  platform: IntegrationPlatform;

  @IsString()
  apiKey: string;

  @IsString()
  @IsOptional()
  apiSecret?: string;

  @IsString()
  @IsOptional()
  merchantId?: string;

  @IsString()
  @IsOptional()
  branchId?: string;
}

export class SyncOrdersDto {
  @IsString()
  integrationId: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class PlatformOrderDto {
  @IsString()
  platformOrderId: string;

  @IsString()
  platform: string;

  @IsString()
  customerName: string;

  @IsString()
  customerPhone: string;

  @IsString()
  deliveryAddress: string;

  @IsNumber()
  totalAmount: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    options?: string[];
  }>;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
