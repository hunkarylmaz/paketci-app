import { IsString, IsEmail, IsOptional, IsEnum, IsNumber, IsBoolean, ValidateNested, IsArray, MinLength, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';
import { PricingType, RestaurantUserRole } from '../entities/restaurant.entity';

// ============================================
// ADIM 1: TEMEL BİLGİLER DTO
// ============================================
export class BasicInfoDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @IsOptional()
  brandName?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  taxNumber?: string;
}

// ============================================
// ADIM 2: İŞLETME AYARLARI DTO
// ============================================
export class BusinessSettingsDto {
  @IsString()
  supportPhone: string;

  @IsString()
  @IsOptional()
  technicalContactName?: string;

  @IsDecimal()
  @IsOptional()
  creditCardCommission?: number;

  @IsNumber()
  @IsOptional()
  pickupTimeMinutes?: number;
}

// ============================================
// ADIM 3: ÇALIŞMA TİPİ DTO (9 Çalışma Şekli)
// ============================================

// 1. PER_PACKAGE - Paket Başı
export interface PerPackageConfig {
  pricePerPackage: number;
}

// 2. PER_KM - Kilometre Başı
export interface PerKmConfig {
  pricePerKm: number;
}

// 3. KM_RANGE - Kilometre Aralığı
export interface KmRange {
  maxKm: number;
  price: number;
}

export interface KmRangeConfig {
  ranges: KmRange[];
}

// 4. PACKAGE_PLUS_KM - Paket + Km
export interface PackagePlusKmConfig {
  basePrice: number;
  pricePerKm: number;
}

// 5. FIXED_KM_PLUS_KM - Sabit Km + Km
export interface FixedKmPlusKmConfig {
  fixedKm: number;
  fixedPrice: number;
  extraPricePerKm: number;
}

// 6. COMMISSION - Komisyon
export interface CommissionConfig {
  percentage: number;
}

// 7. FIXED_PRICE - Sabit Ücret (YENİ)
export interface FixedPriceConfig {
  fixedAmount: number;
  billingPeriod: string; // 'MONTHLY' | 'YEARLY'
}

// 8. HOURLY - Saatlik Ücret (YENİ)
export interface HourlyRate {
  start: string;
  end: string;
  price: number;
}

export interface HourlyConfig {
  normal: HourlyRate;
  peak: HourlyRate;
  night: HourlyRate;
}

// 9. ZONE_BASED - Bölge Bazlı (YENİ)
export interface ZoneConfig {
  price: number;
  neighborhoods: string[];
}

export interface ZoneBasedConfig {
  zones: {
    blue: ZoneConfig;
    yellow: ZoneConfig;
    red: ZoneConfig;
  };
}

// Birleşik Pricing Config (9 Tip)
export class PricingConfigDto {
  // 1. PER_PACKAGE
  pricePerPackage?: number;

  // 2. PER_KM
  pricePerKm?: number;

  // 3. KM_RANGE
  ranges?: KmRange[];

  // 4. PACKAGE_PLUS_KM
  basePrice?: number;

  // 5. FIXED_KM_PLUS_KM
  fixedKm?: number;
  fixedPrice?: number;
  extraPricePerKm?: number;

  // 6. COMMISSION
  percentage?: number;

  // 7. FIXED_PRICE (YENİ)
  fixedAmount?: number;
  billingPeriod?: string;

  // 8. HOURLY (YENİ)
  normal?: HourlyRate;
  peak?: HourlyRate;
  night?: HourlyRate;

  // 9. ZONE_BASED (YENİ)
  zones?: {
    blue: ZoneConfig;
    yellow: ZoneConfig;
    red: ZoneConfig;
  };
}

export class PricingTypeDto {
  @IsEnum(PricingType)
  pricingType: PricingType;

  @ValidateNested()
  @Type(() => PricingConfigDto)
  pricingConfig: PricingConfigDto;
}

// ============================================
// ADIM 4: KULLANICILAR DTO
// ============================================
export class RestaurantUserDto {
  @IsString()
  @MinLength(3)
  fullName: string;

  @IsString()
  phone: string;

  @IsEnum(RestaurantUserRole)
  role: RestaurantUserRole;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// ============================================
// ADIM 5: KONUM DTO
// ============================================
export class AddressDto {
  @IsString()
  full: string;

  @IsString()
  district: string;

  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  neighborhood?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;
}

export class LocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class LocationStepDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}

// ============================================
// TAM WIZARD DTO (Tüm adımlar birleşik)
// ============================================
export class CreateRestaurantWizardDto {
  // Adım 1
  @ValidateNested()
  @Type(() => BasicInfoDto)
  basicInfo: BasicInfoDto;

  // Adım 2
  @ValidateNested()
  @Type(() => BusinessSettingsDto)
  businessSettings: BusinessSettingsDto;

  // Adım 3
  @ValidateNested()
  @Type(() => PricingTypeDto)
  pricing: PricingTypeDto;

  // Adım 4
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestaurantUserDto)
  users: RestaurantUserDto[];

  // Adım 5
  @ValidateNested()
  @Type(() => LocationStepDto)
  locationData: LocationStepDto;

  // Bayi ID (Admin eklerken, Bayi panelinden otomatik atanır)
  @IsString()
  dealerId: string;
}
