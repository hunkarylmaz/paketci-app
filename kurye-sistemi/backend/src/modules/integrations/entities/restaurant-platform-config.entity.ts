import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { PlatformIntegration } from './platform-integration.entity';

export enum PlatformStatus {
  PENDING_SETUP = 'pending_setup',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

@Entity('restaurant_platform_configs')
export class RestaurantPlatformConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column(() => Restaurant)
  restaurantId: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @Column(() => PlatformIntegration)
  platformId: string;

  @ManyToOne(() => PlatformIntegration)
  @JoinColumn({ name: 'platformId' })
  platform: PlatformIntegration;

  // API Credentials - Encrypted storage
  @Column({ type: 'text', nullable: true })
  apiKey: string;

  @Column({ type: 'text', nullable: true })
  apiSecret: string;

  @Column({ type: 'text', nullable: true })
  merchantId: string;

  @Column({ type: 'text', nullable: true })
  branchId: string;

  @Column({ type: 'text', nullable: true })
  accessToken: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ type: 'timestamp', nullable: true })
  tokenExpiresAt: Date;

  // Platform Settings
  @Column({
    type: 'enum',
    enum: PlatformStatus,
    default: PlatformStatus.PENDING_SETUP,
  })
  status: PlatformStatus;

  @Column({ default: false })
  isOpen: boolean;

  @Column({ default: false })
  autoAcceptOrders: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  customCommissionRate: number;

  @Column({ type: 'json', nullable: true })
  settings: {
    minOrderAmount?: number;
    deliveryTime?: number;
    preparationTime?: number;
    workingHours?: {
      open: string;
      close: string;
    };
  };

  @Column({ type: 'text', nullable: true })
  webhookUrl: string;

  @Column({ type: 'text', nullable: true })
  lastErrorMessage: string;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
