import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

export enum CreditTransactionType {
  PURCHASE = 'purchase',
  DELIVERY_DEDUCTION = 'delivery_deduction',
  REFUND = 'refund',
  BONUS = 'bonus',
  ADJUSTMENT = 'adjustment',
  TOP_UP = 'top_up',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('credits')
export class Credit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, company => company.credits)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'enum', enum: CreditTransactionType })
  type: CreditTransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceAfter: number;

  @Column({ nullable: true })
  deliveryId: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ type: 'enum', enum: PaymentStatus, nullable: true })
  status: PaymentStatus;

  @Column({ type: 'simple-json', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  failureReason: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  failedAt: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'system' })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
