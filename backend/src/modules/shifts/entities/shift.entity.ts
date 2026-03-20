import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Courier } from '../../couriers/entities/courier.entity';

export enum ShiftStatus {
  SCHEDULED = 'scheduled',     // Planlandı
  ACTIVE = 'active',           // Aktif
  ON_BREAK = 'on_break',       // Mola'da
  COMPLETED = 'completed',     // Tamamlandı
  CANCELLED = 'cancelled',     // İptal edildi
  NO_SHOW = 'no_show',         // Gelmedi
}

export enum ShiftType {
  MORNING = 'morning',         // Sabah (08:00-16:00)
  AFTERNOON = 'afternoon',     // Öğlen (12:00-20:00)
  EVENING = 'evening',         // Akşam (16:00-00:00)
  NIGHT = 'night',             // Gece (00:00-08:00)
  FULL_DAY = 'full_day',       // Tam gün
  CUSTOM = 'custom',           // Özel
}

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courierId: string;

  @ManyToOne(() => Courier, courier => courier.shifts)
  @JoinColumn({ name: 'courierId' })
  courier: Courier;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, company => company.shifts)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'enum', enum: ShiftType, default: ShiftType.CUSTOM })
  type: ShiftType;

  @Column({ type: 'timestamp' })
  plannedStartAt: Date; // Planlanan başlangıç

  @Column({ type: 'timestamp' })
  plannedEndAt: Date; // Planlanan bitiş

  @Column({ type: 'timestamp', nullable: true })
  actualStartAt: Date; // Gerçek başlangıç

  @Column({ type: 'timestamp', nullable: true })
  actualEndAt: Date; // Gerçek bitiş

  @Column({ type: 'timestamp', nullable: true })
  breakStartedAt: Date; // Mola başlangıcı

  @Column({ type: 'timestamp', nullable: true })
  breakEndedAt: Date; // Mola bitişi

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  breakDuration: number; // Mola süresi (saat)

  @Column({ type: 'enum', enum: ShiftStatus, default: ShiftStatus.SCHEDULED })
  status: ShiftStatus;

  // Konum kayıtları
  @Column({ type: 'simple-json', nullable: true })
  startLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  @Column({ type: 'simple-json', nullable: true })
  endLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  // Süre hesaplamaları (dakika cinsinden)
  @Column({ type: 'int', nullable: true })
  plannedDuration: number; // Planlanan süre

  @Column({ type: 'int', nullable: true })
  actualDuration: number; // Gerçekleşen süre

  @Column({ type: 'int', nullable: true })
  lateArrivalMinutes: number; // Geç kalma süresi

  @Column({ type: 'int', nullable: true })
  earlyLeaveMinutes: number; // Erken çıkma süresi

  // Uyumluluk ve performans
  @Column({ default: true })
  isCompliant: boolean; // Vardiyaya uyumlu mu?

  @Column({ type: 'text', nullable: true })
  nonComplianceReason: string; // Uyumsuzluk sebebi

  @Column({ type: 'simple-json', nullable: true })
  performanceMetrics: {
    totalDeliveries: number;
    averageDeliveryTime: number;
    customerRating: number;
    onTimeDeliveryRate: number;
  };

  // Notlar
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  createdBy: string; // Oluşturan kullanıcı

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
