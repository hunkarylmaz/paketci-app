import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Dealer } from '../../dealers/entities/dealer.entity';

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  contractNumber: string;

  @Index()
  @Column({ type: 'uuid' })
  restaurantId: string;

  @ManyToOne(() => Restaurant, restaurant => restaurant.contracts)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  dealerId: string;

  @ManyToOne(() => Dealer, dealer => dealer.contracts, { nullable: true })
  @JoinColumn({ name: 'dealerId' })
  dealer: Dealer;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10.00 })
  commissionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monthlyMinimum: number;

  @Column({ type: 'text', nullable: true })
  terms: string;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT,
  })
  status: ContractStatus;

  @Column({ type: 'timestamp', nullable: true })
  signedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  signedBy: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documentUrl: string;

  @Column({ type: 'boolean', default: false })
  autoRenewal: boolean;

  @Column({ type: 'int', default: 30 })
  paymentTerm: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
