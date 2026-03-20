// 📍 GÖRSELDEKİ 6 ADIMLI WIZARD YAPISI
// Adım 1: Temel Bilgiler ✓
// Adım 2: İşletme Ayarları ⚙️
// Adım 3: Çalışma Tipi 💰
// Adım 4: Kullanıcılar 👥
// Adım 5: Konum 📍
// Adım 6: Tamamla ✓

// ============================================
// BACKEND - ENTITY GÜNCELLEME (Adım 1)
// ============================================

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

// 📊 9 ÇALIŞMA ŞEKLİ (6 görseldeki + 3 yeni)
export enum PricingType {
  // Görseldeki 6 tip
  PER_PACKAGE = 'PER_PACKAGE',           // Paket Başı
  PER_KM = 'PER_KM',                     // Kilometre Başı
  KM_RANGE = 'KM_RANGE',                 // Kilometre Aralığı
  PACKAGE_PLUS_KM = 'PACKAGE_PLUS_KM',   // Paket + Km
  FIXED_KM_PLUS_KM = 'FIXED_KM_PLUS_KM', // Sabit Km + Km
  COMMISSION = 'COMMISSION',             // Komisyon
  // Yeni 3 tip
  FIXED_PRICE = 'FIXED_PRICE',           // Sabit Ücret (Aylık/Yıllık)
  HOURLY = 'HOURLY',                     // Saatlik Ücret
  ZONE_BASED = 'ZONE_BASED',             // Bölge Bazlı (Mavi/Sarı/Kırmızı)
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
  password: string; // Hash'lenmiş

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
  // ADIM 1: TEMEL BİLGİLER
  // ============================================
  @Column()
  name: string;

  @Column({ nullable: true })
  brandName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  taxNumber: string;

  // ============================================
  // ADIM 2: İŞLETME AYARLARI
  // ============================================
  @Column()
  supportPhone: string;

  @Column({ nullable: true })
  technicalContactName: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  creditCardCommission: number; // % olarak

  @Column({ default: 30 })
  pickupTimeMinutes: number;

  // ============================================
  // ADIM 3: ÇALIŞMA TİPİ (Pricing Config)
  // ============================================
  @Column({
    type: 'enum',
    enum: PricingType,
    default: PricingType.PER_PACKAGE
  })
  pricingType: PricingType;

  @Column({ type: 'jsonb' })
  pricingConfig: {
    // 1. PER_PACKAGE - Paket Başı
    pricePerPackage?: number;  // Her paket için sabit ücret (örn: ₺110)

    // 2. PER_KM - Kilometre Başı  
    pricePerKm?: number;  // Her km için ücret (örn: ₺10)

    // 3. KM_RANGE - Kilometre Aralığı
    ranges?: Array<{
      maxKm: number;  // Maksimum km (örn: 3, 5, 999)
      price: number;  // Bu aralık için ücret (örn: 35, 45, 60)
    }>;

    // 4. PACKAGE_PLUS_KM - Paket + Km
    basePrice?: number;      // Paket başı sabit ücret (örn: ₺30)
    pricePerKm?: number;     // Km başı ücret (örn: ₺8)

    // 5. FIXED_KM_PLUS_KM - Sabit Km + Km
    fixedKm?: number;         // Sabit km limiti (örn: 3km)
    fixedPrice?: number;      // Sabit ücret (örn: ₺35)
    extraPricePerKm?: number; // Ek km başı ücret (örn: ₺10)

    // 6. COMMISSION - Komisyon
    percentage?: number;      // Yüzde (örn: 15)

    // 7. FIXED_PRICE - Sabit Ücret (YENİ)
    fixedAmount?: number;     // Sabit tutar (örn: ₺5000)
    billingPeriod?: string;   // 'MONTHLY' veya 'YEARLY'

    // 8. HOURLY - Saatlik Ücret (YENİ)
    normal?: { start: string; end: string; price: number };
    peak?: { start: string; end: string; price: number };
    night?: { start: string; end: string; price: number };

    // 9. ZONE_BASED - Bölge Bazlı (YENİ)
    zones?: {
      blue: { price: number; neighborhoods: string[] };
      yellow: { price: number; neighborhoods: string[] };
      red: { price: number; neighborhoods: string[] };
    };
  };
      tier2: { maxKm: number; price: number };
      tier3: { maxKm: number; price: number };
    };

    // Saatlik için
    hourlyRates?: {
      normal: { start: string; end: string; price: number };
      peak: { start: string; end: string; price: number };
      night: { start: string; end: string; price: number };
    };
  };

  // ============================================
  // ADIM 4: KULLANICILAR (One-to-Many)
  // ============================================
  @OneToMany(() => RestaurantUser, user => user.restaurantId)
  users: RestaurantUser[];

  // ============================================
  // ADIM 5: KONUM
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
  // BAYİ İLİŞKİSİ
  // ============================================
  @Column()
  dealerId: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
