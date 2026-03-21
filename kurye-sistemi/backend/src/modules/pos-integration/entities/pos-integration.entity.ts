import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum POSType {
  ADISYO = 'ADISYO',
  SEPETTAKIP = 'SEPETTAKIP',
  SEFIM = 'SEFIM',
  OTHER = 'OTHER',
}

@Entity('pos_integrations')
export class POSIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantId: string;

  @Column({ type: 'enum', enum: POSType })
  posType: POSType;

  @Column({ type: 'jsonb' })
  connectionConfig: {
    type: 'LOCAL' | 'CLOUD' | 'HYBRID';
    ip?: string;
    port?: number;
    apiKey?: string;
    apiSecret?: string;
    endpoint?: string;
  };

  @Column({ type: 'jsonb' })
  features: {
    pullOrders: boolean;
    pushPayment: boolean;
    syncMenu: boolean;
    printReceipt: boolean;
    printAdisyon: boolean;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastSyncAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
