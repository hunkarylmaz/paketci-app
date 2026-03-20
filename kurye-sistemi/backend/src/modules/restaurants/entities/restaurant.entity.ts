// ============================================
// RESTAURANT ENTITY - Yeni Roller İçin Güncellendi
// ============================================

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

// 📊 9 ÇALIŞMA ŞEKLİ
export enum PricingType {
  PER_PACKAGE = 'PER_PACKAGE',
  PER_KM = 'PER_KM',
  KM_RANGE = 'KM_RANGE',
  PACKAGE_PLUS_KM = 'PACKAGE_PLUS_KM',
  FIXED_KM_PLUS_KM = 'FIXED_KM_PLUS_KM',
  COMMISSION = 'COMMISSION',
  FIXED_PRICE = 'FIXED_PRICE',
  HOURLY = 'HOURLY',
  ZONE_BASED = 'ZONE_BASED',
}

// Restoran Satış Durumları (Saha Satış için)
export enum RestaurantSalesStatus {
  LEAD = 'LEAD',
  CONTACTED = 'CONTACTED',
  VISITED = 'VISITED',
  NEGOTIATING = 'NEGOTIATING',
  CONTRACTED = 'CONTRACTED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum RestaurantUserRole {
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

// Restoran kullanıcıları için ayrı entity
@Entity('restaurant_users')
export class RestaurantUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantId: string;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: RestaurantUserRole,
    default: RestaurantUserRole.MANAGER
  })
  role: RestaurantUserRole;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ============================================
  // TEMEL BİLGİLER
  // ============================================
  @Column()
  name: string;

  @Column({ nullable: true })
  brandName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  taxNumber: string;

  @Column({ nullable: true })
  phone: string;

  // ============================================
  // İŞLETME AYARLARI
  // ============================================
  @Column({ nullable: true })
  supportPhone: string;

  @Column({ nullable: true })
  technicalContactName: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  creditCardCommission: number;

  @Column({ default: 30 })
  pickupTimeMinutes: number;

  // ============================================
  // ÇALIŞMA TİPİ (Pricing Config)
  // ============================================
  @Column({
    type: 'enum',
    enum: PricingType,
    default: PricingType.PER_PACKAGE
  })
  pricingType: PricingType;

  @Column({ type: 'jsonb' })
  pricingConfig: {
    pricePerPackage?: number;
    pricePerKm?: number;
    ranges?: Array<{ maxKm: number; price: number }>;
    basePrice?: number;
    fixedKm?: number;
    fixedPrice?: number;
    extraPricePerKm?: number;
    percentage?: number;
    fixedAmount?: number;
    billingPeriod?: string;
    normal?: { start: string; end: string; price: number };
    peak?: { start: string; end: string; price: number };
    night?: { start: string; end: string; price: number };
    zones?: {
      blue: { price: number; neighborhoods: string[] };
      yellow: { price: number; neighborhoods: string[] };
      red: { price: number; neighborhoods: string[] };
    };
  };

  // ============================================
  // KULLANICILAR
  // ============================================
  @OneToMany(() => RestaurantUser, user => user.restaurantId)
  users: RestaurantUser[];

  // ============================================
  // KONUM
  // ============================================
  @Column({ type: 'jsonb' })
  address: {
    full: string;
    district: string;
    city: string;
    neighborhood?: string;
    postalCode?: string;
  };

  @Column({ type: 'jsonb' })
  location: {
    latitude: number;
    longitude: number;
  };

  // ============================================
  // HİYERARŞİ İLİŞKİLERİ (Yeni Roller İçin)
  // ============================================
  
  // Şirket ataması
  @Column({ nullable: true })
  companyId: string;

  // Bayi ataması
  @Column({ nullable: true })
  dealerId: string;

  @Column({ nullable: true })
  dealerName: string;

  // Bölge ataması (Bölge Sorumlusu için)
  @Column({ nullable: true })
  regionId: string;

  @Column({ nullable: true })
  regionName: string;

  // Territory ataması (Saha Satış için)
  @Column({ nullable: true })
  territoryId: string;

  @Column({ nullable: true })
  territoryName: string;

  // Saha satış ataması
  @Column({ nullable: true })
  fieldSalesId: string;

  @Column({ nullable: true })
  fieldSalesName: string;

  // Ziyaret takibi (Saha Satış)
  @Column({ type: 'timestamp', nullable: true })
  lastVisitAt: Date;

  @Column({ type: 'int', default: 0 })
  visitCount: number;

  // Restoran durumu (Saha Satış için)
  @Column({
    type: 'enum',
    enum: RestaurantSalesStatus,
    default: RestaurantSalesStatus.LEAD
  })
  salesStatus: RestaurantSalesStatus;

  // Öncelik/Yıldız (Saha Satış için)
  @Column({ type: 'int', default: 0 })
  priority: number;

  // ============================================
  // EXTENSION AYARLARI
  // ============================================
  @Column({ nullable: true, unique: true })
  apiKey: string;

  @Column({ default: true })
  extensionEnabled: boolean;

  // ============================================
  // DURUM
  // ============================================
  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  activatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
