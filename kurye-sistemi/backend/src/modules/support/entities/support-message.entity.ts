import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { SupportTicket } from './support-ticket.entity';
import { User } from '../../users/entities/user.entity';

export enum MessageSenderType {
  COURIER = 'courier',
  DEALER = 'dealer',
  SYSTEM = 'system',
  ADMIN = 'admin',
}

@Entity('support_messages')
export class SupportMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  ticketId: string;

  @ManyToOne(() => SupportTicket, ticket => ticket.messages)
  @JoinColumn({ name: 'ticketId' })
  ticket: SupportTicket;

  @Index()
  @Column({ type: 'uuid' })
  senderId: string;

  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({
    type: 'enum',
    enum: MessageSenderType,
    default: MessageSenderType.COURIER,
  })
  senderType: MessageSenderType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-array', nullable: true })
  attachments: string[];

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
