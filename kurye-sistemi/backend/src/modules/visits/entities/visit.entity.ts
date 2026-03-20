import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Lead } from './lead.entity';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

export enum VisitOutcome {
  SUCCESSFUL = 'successful',
  NO_SHOW = 'no_show',
  POSTPONED = 'postponed',
  NOT_INTERESTED = 'not_interested',
  PENDING = 'pending',
}

@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  leadId: string;

  @ManyToOne(() => Lead, lead => lead.visits, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  restaurantId: string;

  @ManyToOne(() => Restaurant, restaurant => restaurant.visits, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @Index()
  @Column({ type: 'uuid' })
  visitedBy: string;

  @ManyToOne(() => User, user => user.visits)
  @JoinColumn({ name: 'visitedBy' })
  visitor: User;

  @Column({ type: 'timestamp' })
  visitDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: VisitOutcome,
    default: VisitOutcome.PENDING,
  })
  outcome: VisitOutcome;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nextAction: string;

  @Column({ type: 'timestamp', nullable: true })
  nextVisitDate: Date;

  @Column({ type: 'simple-array', nullable: true })
  photos: string[];

  @Column({ type: 'int', default: 0 })
  duration: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
