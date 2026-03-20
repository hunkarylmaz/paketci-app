import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TerritoryStatus, TerritoryPriority } from '../entities/territory.entity';

export class CreateTerritoryDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  regionId?: string;

  @IsString()
  @IsOptional()
  fieldSalesId?: string;

  @IsOptional()
  boundaries?: {
    type: 'polygon';
    coordinates: number[][][];
  };

  @IsEnum(TerritoryPriority)
  @IsOptional()
  priority?: TerritoryPriority;

  @IsEnum(TerritoryStatus)
  @IsOptional()
  status?: TerritoryStatus;
}
