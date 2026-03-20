import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, IsDate, IsNumber, Min, Max, IsDecimal, IsLatitude, IsLongitude } from 'class-validator';
import { Type } from 'class-transformer';
import { VisitOutcome } from '../entities/visit.entity';

/**
 * Ziyaret oluşturma DTO'su
 */
export class CreateVisitDto {
  @ApiPropertyOptional({ description: 'Lead ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsOptional()
  leadId?: string;

  @ApiPropertyOptional({ description: 'Restoran ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  @IsOptional()
  restaurantId?: string;

  @ApiProperty({ description: 'Ziyaret eden kullanıcı ID', example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsUUID()
  visitedBy: string;

  @ApiProperty({ description: 'Ziyaret tarihi', example: '2024-03-21T10:00:00Z' })
  @IsDate()
  @Type(() => Date)
  visitDate: Date;

  @ApiPropertyOptional({ description: 'Enlem', example: 41.0082 })
  @IsDecimal()
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Boylam', example: 28.9784 })
  @IsDecimal()
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Konum adresi', example: 'Şişli, İstanbul' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Notlar', example: 'Müşteri görüşmesi yapıldı' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Sonuç', enum: VisitOutcome, default: VisitOutcome.PENDING })
  @IsEnum(VisitOutcome)
  @IsOptional()
  outcome?: VisitOutcome;

  @ApiPropertyOptional({ description: 'Sonraki aksiyon', example: 'Teklif gönderilecek' })
  @IsString()
  @IsOptional()
  nextAction?: string;

  @ApiPropertyOptional({ description: 'Sonraki ziyaret tarihi', example: '2024-03-28T10:00:00Z' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  nextVisitDate?: Date;

  @ApiPropertyOptional({ description: 'Fotoğraf URL listesi', example: ['https://example.com/photo1.jpg'] })
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @ApiPropertyOptional({ description: 'Ziyaret süresi (dakika)', example: 30 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number;
}
