import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, IsNumber, IsUUID, Min, MaxLength } from 'class-validator';
import { LeadStatus, LeadPriority } from '../entities/lead.entity';

/**
 * Potansiyel müşteri (Lead) güncelleme DTO'su
 */
export class UpdateLeadDto {
  @ApiPropertyOptional({ description: 'Restoran adı', example: 'Burger King Şişli' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  restaurantName?: string;

  @ApiPropertyOptional({ description: 'İşletme sahibi adı', example: 'Ahmet Yılmaz' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  ownerName?: string;

  @ApiPropertyOptional({ description: 'Telefon numarası', example: '0555 123 4567' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Email adresi', example: 'info@burgerking.com' })
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ description: 'Adres', example: 'Şişli Merkez Mahallesi, Şişli/İstanbul' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Bölge ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsOptional()
  territoryId?: string;

  @ApiPropertyOptional({ description: 'Atanan kullanıcı ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Durum', enum: LeadStatus })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional({ description: 'Öncelik', enum: LeadPriority })
  @IsEnum(LeadPriority)
  @IsOptional()
  priority?: LeadPriority;

  @ApiPropertyOptional({ description: 'Notlar', example: 'Müşteri kurye hizmeti almak istiyor' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Beklenen gelir', example: 5000.00 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  expectedRevenue?: number;

  @ApiPropertyOptional({ description: 'Dönüştürülen restoran ID', example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsUUID()
  @IsOptional()
  convertedToRestaurantId?: string;
}
