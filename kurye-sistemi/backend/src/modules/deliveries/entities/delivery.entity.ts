import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Courier } from '../../couriers/entities/courier.entity';
import { Receipt } from '../../receipts/entities/receipt.entity';

export enum DeliveryStatus {
  PENDING = 'pending',           // Bekliyor
  ASSIGNED = 'assigned',         // Kuryeye atandı
  ACCEPTED = 'accepted',         // Kurye kabul etti
  PICKED_UP = 'picked_up',       // Paket alındı
  IN_TRANSIT = 'in_transit',     // Yolda
  NEAR_DESTINATION = 'near_destination', // Yaklaştı
  DELIVERED = 'delivered',       // Teslim edildi
  CANCELLED = 'cancelled',       // İptal edildi
  FAILED = 'failed',             // Teslimat başarısız
}

export enum PaymentType {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  ONLINE = 'online',
  MEAL_CARD = 'meal_card',
}

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  trackingNumber: string; // Takip numarası: KRY-240317-XXXX

  @Column()
  restaurantId: string;

  @ManyToOne(() => Restaurant, restaurant => restaurant.deliveries)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, company => company.deliveries)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  courierId: string;

  @ManyToOne(() => Courier, courier => courier.deliveries)
  @JoinColumn({ name: 'courierId' })
  courier: Courier;

  @Column({ nullable: true })
  orderSource: string; // web, mobile, phone, getir, yemeksepeti, trendyol

  @OneToMany(() => Receipt, receipt => receipt.delivery)
  receipts: Receipt[];

  // Müşteri bilgileri
  @Column()
  customerName: string;

  @Column()
  customerPhone: string;

  @Column()
  deliveryAddress: string;

  @Column({ nullable: true })
  deliveryCity: string;

  @Column({ nullable: true })
  deliveryDistrict: string;

  @Column({ nullable: true })
  deliveryNeighborhood: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  deliveryLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  deliveryLongitude: number;

  @Column({ type: 'text', nullable: true })
  deliveryNotes: string;

  // Sipariş detayları
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  orderAmount: number;

  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.CASH })
  paymentType: PaymentType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cashAmount: number; // Kapıda ödenecek tutar

  // Durum ve zamanlar
  @Column({ type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.PENDING })
  status: DeliveryStatus;

  // UÇTAN UCA ZAMAN DAMGALARI
  @Column({ type: 'timestamp', nullable: true })
  restaurantNotifiedAt: Date; // Restoran siparişi aldı

  @Column({ type: 'timestamp', nullable: true })
  restaurantAcceptedAt: Date; // Restoran siparişi onayladı

  @Column({ type: 'timestamp', nullable: true })
  restaurantReadyAt: Date; // Restoran paketi hazırladı

  @Column({ type: 'timestamp', nullable: true })
  assignedAt: Date; // Kuryeye atandı

  @Column({ type: 'timestamp', nullable: true })
  courierNotifiedAt: Date; // Kurye bildirimi aldı

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date; // Kurye siparişi kabul etti

  @Column({ type: 'timestamp', nullable: true })
  arrivedAtRestaurantAt: Date; // Kurye restorana vardı

  @Column({ type: 'timestamp', nullable: true })
  pickedUpAt: Date; // Paket alındı

  @Column({ type: 'timestamp', nullable: true })
  inTransitAt: Date; // Yola çıktı

  @Column({ type: 'timestamp', nullable: true })
  arrivedAtDestinationAt: Date; // Adrese vardı

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date; // Teslim edildi

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date; // İptal edildi

  @Column({ type: 'timestamp', nullable: true })
  estimatedDeliveryTime: Date;

  // Kontör ve ücretlendirme
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  creditDeducted: number; // Düşülen kontör (genellikle 2.5 TL)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  courierEarnings: number; // Kurye kazancı

  // Kanıt ve doğrulama
  @Column({ default: false })
  requireDeliveryPhoto: boolean; // Teslimat fotoğrafı zorunlu mu?

  @Column({ nullable: true })
  deliveryPhoto: string; // Teslimat fotoğrafı URL

  @Column({ type: 'simple-json', nullable: true })
  deliveryPhotoMetadata: {
    url: string;
    takenAt: Date;
    latitude?: number;
    longitude?: number;
  }; // Fotoğraf detayları

  @Column({ nullable: true })
  customerSignature: string; // Müşteri imzası (base64)

  @Column({ type: 'simple-json', nullable: true })
  customerSignatureMetadata: {
    signedAt: Date;
    ipAddress?: string;
    deviceInfo?: string;
  };

  // Süre hesaplamaları (dakika cinsinden)
  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  preparationDuration: number; // Hazırlık süresi

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  assignmentDuration: number; // Atanma süresi

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  acceptanceDuration: number; // Kabul süresi

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  pickupWaitDuration: number; // Restoranda bekleme süresi

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  transitDuration: number; // Yolda geçen süre

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  deliveryDuration: number; // Adreste geçen süre

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  totalDuration: number; // Toplam süre (sipariş oluşturmadan teslimata)

  @Column({ nullable: true })
  cancellationReason: string;

  @Column({ nullable: true })
  failureReason: string;

  // Mesafe
  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  totalDistance: number; // km

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
