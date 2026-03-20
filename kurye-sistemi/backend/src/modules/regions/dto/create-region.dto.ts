import { IsString, IsOptional, IsEnum, IsJSON } from 'class-validator';
import { RegionStatus } from '../entities/region.entity';

export class CreateRegionDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  managerId?: string;

  @IsOptional()
  boundaries?: {
    type: 'polygon';
    coordinates: number[][][];
  };

  @IsEnum(RegionStatus)
  @IsOptional()
  status?: RegionStatus;
}
