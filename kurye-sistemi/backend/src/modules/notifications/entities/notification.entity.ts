import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum NotificationType {
  ORDER_NEW = 'order_new',
  ORDER_CANCELLED = 'order_cancelled',
  ORDER_STATUS_CHANGED = 'order_status_changed',
  COURIER_ASSIGNED = 'courier_assigned',
  COURIER_ARRIVED = 'courier_arrived',
  SYSTEM = 'system',
  PAYMENT = 'payment',
  ALERT = 'alert'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity('notifications')
@Index(['recipientUserId', 'isRead'])
@Index(['restaurantId', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL
  })
  priority: NotificationPriority;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  data: any;

  @Column({ nullable: true })
  recipientUserId: string;

  @Column({ nullable: true })
  recipientRole: string;

  @Column({ nullable: true })
  restaurantId: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  readAt: Date;

  @Column({ default: false })
  isDelivered: boolean;

  @Column({ nullable: true })
  deliveredAt: Date;

  @Column({ nullable: true })
  channel: string; // push, sms, email, websocket

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
