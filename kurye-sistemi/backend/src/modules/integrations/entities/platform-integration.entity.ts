import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PlatformType {
  YEMEK_SEPETI = 'yemeksepeti',
  GETIR_YEMEK = 'getir_yemek',
  GETIR_CARSI = 'getir_carsi',
  MIGROS_YEMEK = 'migros_yemek',
  TRENDYOL_YEMEK = 'trendyol_yemek',
}

@Entity('platform_integrations')
export class PlatformIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PlatformType,
    unique: true,
  })
  platformType: PlatformType;

  @Column()
  name: string;

  @Column({ nullable: true })
  apiBaseUrl: string;

  @Column({ nullable: true })
  authUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defaultCommissionRate: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
