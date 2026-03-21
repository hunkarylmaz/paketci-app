import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Delivery } from '../../deliveries/entities/delivery.entity';
import { Shift } from '../../shifts/entities/shift.entity';

export enum CourierStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
  BUSY = 'busy',
}

@Entity('couriers')
export class Courier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: CourierStatus, default: CourierStatus.OFFLINE })
  status: CourierStatus;

  @Column({ default: false })
  isOnDelivery: boolean;

  @Column({ default: false })
  isOnBreak: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  currentLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  currentLongitude: number;

  @Column({ nullable: true })
  lastLocationAt: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  performanceRating: number;

  @Column({ default: true })
  isActive: boolean; // Kurye aktif/pasif durumu

  @Column()
  companyId: string;

  @ManyToOne(() => Company, company => company.couriers)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @OneToMany(() => Delivery, delivery => delivery.courier)
  deliveries: Delivery[];

  @OneToMany(() => Shift, shift => shift.courier)
  shifts: Shift[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
