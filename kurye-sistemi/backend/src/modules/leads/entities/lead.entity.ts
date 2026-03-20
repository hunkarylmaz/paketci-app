import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Territory } from '../../territories/entities/territory.entity';

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  VISITED = 'visited',
  NEGOTIATING = 'negotiating',
  CONVERTED = 'converted',
  LOST = 'lost',
}

export enum LeadPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  HOT = 'hot',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  restaurantName: string;

  @Column({ type: 'varchar', length: 255 })
  ownerName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'text' })
  address: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  territoryId: string;

  @ManyToOne(() => Territory, territory => territory.leads, { nullable: true })
  @JoinColumn({ name: 'territoryId' })
  territory: Territory;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  assignedTo: string;

  @ManyToOne(() => User, user => user.assignedLeads, { nullable: true })
  @JoinColumn({ name: 'assignedTo' })
  assignedUser: User;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column({
    type: 'enum',
    enum: LeadPriority,
    default: LeadPriority.MEDIUM,
  })
  priority: LeadPriority;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'int', default: 0 })
  visitCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastVisitAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  expectedRevenue: number;

  @Column({ type: 'timestamp', nullable: true })
  convertedAt: Date;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  convertedToRestaurantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
