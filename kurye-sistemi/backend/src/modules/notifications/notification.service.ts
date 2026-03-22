import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationPriority } from './entities/notification.entity';

export interface NotificationPayload {
  type: NotificationType;
  priority: NotificationPriority;
  recipients: {
    userIds?: string[];
    role?: string;
    restaurantId?: string;
    courierId?: string;
    dealerId?: string;
  };
  content: {
    title: string;
    body: string;
    data?: any;
    imageUrl?: string;
    actionUrl?: string;
  };
  channels: ('PUSH' | 'SMS' | 'EMAIL' | 'WEBSOCKET' | 'VOICE')[];
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async send(payload: NotificationPayload): Promise<void> {
    const notification = this.notificationRepo.create({
      type: payload.type,
      priority: payload.priority,
      title: payload.content.title,
      body: payload.content.body,
      data: payload.content.data,
      recipientUserId: payload.recipients.userIds?.[0],
      recipientRole: payload.recipients.role,
      restaurantId: payload.recipients.restaurantId,
      channel: payload.channels.join(','),
      isDelivered: true,
      deliveredAt: new Date(),
    });

    await this.notificationRepo.save(notification);
    this.logger.log(`Notification sent: ${payload.type} - ${payload.content.title}`);
  }

  async broadcast(
    type: NotificationType,
    content: { title: string; body: string },
    role?: string,
  ): Promise<void> {
    await this.send({
      type,
      priority: NotificationPriority.NORMAL,
      recipients: { role },
      content,
      channels: ['WEBSOCKET'],
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.notificationRepo.update(notificationId, {
      isRead: true,
      readAt: new Date(),
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepo.count({
      where: {
        recipientUserId: userId,
        isRead: false,
      },
    });
  }

  async getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { recipientUserId: userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
