import { Injectable } from '@nestjs/common';

interface CreateNotificationDto {
  userId: string;
  type: string;
  title: string;
  message: string;
}

@Injectable()
export class NotificationsService {
  // In-memory storage for notifications (production'da database kullanılmalı)
  private notifications: any[] = [];

  async create(dto: CreateNotificationDto) {
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...dto,
      read: false,
      createdAt: new Date(),
    };

    this.notifications.push(notification);

    // Console log for debugging
    console.log(`📢 Bildirim: [${dto.type}] ${dto.title} - ${dto.message}`);

    return notification;
  }

  async findByUser(userId: string) {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    return notification;
  }

  async getUnreadCount(userId: string) {
    return this.notifications.filter(n => n.userId === userId && !n.read).length;
  }

  // Yeni sipariş bildirimi gönder
  async sendNewOrderNotification(deliveryId: string, restaurantId: string) {
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: restaurantId,
      type: 'NEW_ORDER',
      title: 'Yeni Sipariş',
      message: `Yeni bir sipariş alındı: ${deliveryId}`,
      deliveryId,
      read: false,
      createdAt: new Date(),
    };

    this.notifications.push(notification);
    console.log(`📢 Yeni Sipariş Bildirimi: ${deliveryId}`);
    return notification;
  }

  // Sipariş iptal bildirimi gönder
  async sendOrderCancelledNotification(
    deliveryId: string,
    restaurantId: string,
    reason: string,
  ) {
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: restaurantId,
      type: 'ORDER_CANCELLED',
      title: 'Sipariş İptal Edildi',
      message: `Sipariş iptal edildi. Sebep: ${reason}`,
      deliveryId,
      reason,
      read: false,
      createdAt: new Date(),
    };

    this.notifications.push(notification);
    console.log(`📢 Sipariş İptal Bildirimi: ${deliveryId} - Sebep: ${reason}`);
    return notification;
  }
}
