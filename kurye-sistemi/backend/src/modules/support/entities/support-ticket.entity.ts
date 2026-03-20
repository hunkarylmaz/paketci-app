import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SupportMessage } from './support-message.entity';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_CUSTOMER = 'waiting_customer',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum TicketCategory {
  ORDER_ISSUE = 'order_issue',
  TECHNICAL = 'technical',
  PAYMENT = 'payment',
  ACCOUNT = 'account',
  COMPLAINT = 'complaint',
  OTHER = 'other',
}

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  ticketNumber: string;

  @Index()
  @Column({ type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, user => user.createdTickets)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TicketCategory,
    default: TicketCategory.OTHER,
  })
  category: TicketCategory;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  assignedTo: string;

  @ManyToOne(() => User, user => user.assignedTickets, { nullable: true })
  @JoinColumn({ name: 'assignedTo' })
  assignee: User;

  // Kurye bilgileri
  @Column({ type: 'varchar', length: 255, nullable: true })
  courierName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  orderNumber: string;

  @Column({ type: 'uuid', nullable: true })
  orderId: string;

  @Column({ type: 'uuid', nullable: true })
  dealerId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dealerName: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({ type: 'int', default: 0 })
  messageCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastMessageAt: Date;

  @Column({ type: 'boolean', default: false })
  isUnreadByDealer: boolean;

  @Column({ type: 'boolean', default: true })
  isUnreadByCourier: boolean;

  @OneToMany(() => SupportMessage, message => message.ticket)
  messages: SupportMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
