import { IsString, IsOptional, IsEnum, IsNumber, IsDecimal, Min, Max } from 'class-validator';
import { DealerStatus } from '../entities/dealer.entity';

export class CreateDealerDto {
  @IsString()
  name: string;

  @IsString()
  companyName: string;

  @IsString()
  @IsOptional()
  ownerId?: string;

  @IsString()
  @IsOptional()
  regionId?: string;

  @IsDecimal()
  @IsOptional()
  @Min(0)
  @Max(100)
  commissionRate?: number;

  @IsOptional()
  address?: {
    full: string;
    district: string;
    city: string;
    postalCode?: string;
  };

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsEnum(DealerStatus)
  @IsOptional()
  status?: DealerStatus;

  @IsString()
  @IsOptional()
  taxNumber?: string;

  @IsString()
  @IsOptional()
  bankAccount?: string;

  @IsDecimal()
  @IsOptional()
  monthlyTarget?: number;
}
