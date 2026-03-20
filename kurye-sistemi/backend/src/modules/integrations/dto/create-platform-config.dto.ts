import { IsString, IsOptional, IsObject, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlatformConfigDto {
  @ApiProperty({ description: 'Platform ID' })
  @IsString()
  platformId: string;

  @ApiProperty({ description: 'API Key from platform' })
  @IsString()
  apiKey: string;

  @ApiProperty({ description: 'API Secret from platform' })
  @IsString()
  apiSecret: string;

  @ApiProperty({ description: 'Merchant ID from platform', required: false })
  @IsString()
  @IsOptional()
  merchantId?: string;

  @ApiProperty({ description: 'Branch ID from platform', required: false })
  @IsString()
  @IsOptional()
  branchId?: string;

  @ApiProperty({ description: 'Platform settings', required: false })
  @IsObject()
  @IsOptional()
  settings?: {
    minOrderAmount?: number;
    deliveryTime?: number;
    preparationTime?: number;
    workingHours?: {
      open: string;
      close: string;
    };
  };

  @ApiProperty({ description: 'Webhook URL for platform callbacks', required: false })
  @IsString()
  @IsOptional()
  webhookUrl?: string;
}

export class UpdatePlatformStatusDto {
  @ApiProperty({ description: 'Open or close the restaurant on platform' })
  @IsBoolean()
  isOpen: boolean;

  @ApiProperty({ description: 'Auto accept orders', required: false })
  @IsBoolean()
  @IsOptional()
  autoAcceptOrders?: boolean;
}
