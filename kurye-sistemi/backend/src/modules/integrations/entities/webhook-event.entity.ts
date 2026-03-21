import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Integration, IntegrationPlatform } from './integration.entity';

export enum WebhookEventType {
  ORDER_CREATED = 'order.created',
  ORDER_UPDATED = 'order.updated',
  ORDER_CANCELLED = 'order.cancelled',
  ORDER_STATUS_CHANGED = 'order.status_changed',
  MENU_UPDATED = 'menu.updated',
  RESTAURANT_STATUS_CHANGED = 'restaurant.status_changed'
}

export enum WebhookStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  RETRYING = 'retrying'
}

@Entity('webhook_events')
export class WebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  integrationId: string;

  @ManyToOne(() => Integration)
  @JoinColumn({ name: 'integrationId' })
  integration: Integration;

  @Column({
    type: 'enum',
    enum: WebhookEventType,
  })
  eventType: WebhookEventType;

  @Column({
    type: 'enum',
    enum: IntegrationPlatform,
  })
  platform: IntegrationPlatform;

  @Column({ type: 'text' })
  rawPayload: string;

  @Column({ type: 'jsonb' })
  processedData: any;

  @Column({
    type: 'enum',
    enum: WebhookStatus,
    default: WebhookStatus.PENDING,
  })
  status: WebhookStatus;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ default: 0 })
  retryCount: number;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @CreateDateColumn()
  receivedAt: Date;
}
