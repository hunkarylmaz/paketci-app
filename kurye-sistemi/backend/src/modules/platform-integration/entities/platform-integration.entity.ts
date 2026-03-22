import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('platform_integrations')
export class PlatformIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantId: string;

  @Column({
    type: 'enum',
    enum: ['YEMEKSEPETI', 'TRENDYOL', 'MIGROS', 'GETIR_YEMEK', 'GETIR_CARSI', 'FUUDY']
  })
  platform: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb' })
  authConfig: {
    type: 'OAUTH2' | 'API_KEY';
    clientId?: string;
    clientSecret?: string;
    apiKey?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };

  @Column({ type: 'jsonb' })
  syncConfig: {
    orderPolling: boolean;
    pollingInterval: number;
    menuSync: boolean;
    autoAccept: boolean;
  };

  @Column()
  webhookSecret: string;

  @Column({ nullable: true })
  lastSyncAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
