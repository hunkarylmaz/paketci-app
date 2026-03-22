// Lead Entity - Potansiyel Müşteri
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Visit } from '../../visits/entities/visit.entity';
import { Territory } from '../../territories/entities/territory.entity';

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  VISITED = 'VISITED',
  NEGOTIATING = 'NEGOTIATING',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST'
}

export enum LeadPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantName: string;

  @Column({ nullable: true })
  contactName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW
  })
  status: LeadStatus;

  @Column({
    type: 'enum',
    enum: LeadPriority,
    default: LeadPriority.MEDIUM
  })
  priority: LeadPriority;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  assignedToId: string;

  @ManyToOne(() => User, user => user.assignedLeads, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column({ nullable: true })
  restaurantId: string;

  @ManyToOne(() => Restaurant, restaurant => restaurant.leads, { nullable: true })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @OneToMany(() => Visit, visit => visit.lead)
  visits: Visit[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  territoryId: string;

  @ManyToOne(() => Territory, territory => territory.leads, { nullable: true })
  @JoinColumn({ name: 'territoryId' })
  territory: Territory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
