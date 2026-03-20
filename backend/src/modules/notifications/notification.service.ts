import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as admin from 'firebase-admin';
import * as Twilio from 'twilio';

// Notification Entity
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  priority: string;

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

  @Column({ nullable: true })
  courierId: string;

  @Column({ nullable: true })
  dealerId: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ type: 'jsonb' })
  channelsSent: string[];

  @CreateDateColumn()
  createdAt: Date;
}

export interface NotificationPayload {
  type: NotificationType;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  recipients: {
    userIds?: string[];
    role?: 'ADMIN' | 'DEALER' | 'RESTAURANT' | 'COURIER';
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

export enum NotificationType {
  NEW_ORDER = 'NEW_ORDER',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_ASSIGNED = 'ORDER_ASSIGNED',
  ORDER_READY = 'ORDER_READY',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  ORDER_DELAYED = 'ORDER_DELAYED',
  COURIER_NEARBY = 'COURIER_NEARBY',
  COURIER_OFFLINE = 'COURIER_OFFLINE',
  COURIER_EMERGENCY = 'COURIER_EMERGENCY',
  LOW_STOCK = 'LOW_STOCK',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  BREAK_REQUEST = 'BREAK_REQUEST',
  BREAK_APPROVED = 'BREAK_APPROVED',
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private twilioClient: Twilio.Twilio;
  private fcmApp: admin.app.App;

  @WebSocketServer()
  private wsServer: Server;

  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRedis() private redis: Redis,
  ) {
    // Firebase Admin initialize
    if (!admin.apps.length) {
      this.fcmApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    } else {
      this.fcmApp = admin.app();
    }

    // Twilio initialize
    this.twilioClient = Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async send(payload: NotificationPayload): Promise<void> {
    // Bildirimi veritabanına kaydet
    const notification = this.notificationRepo.create({
      type: payload.type,
      priority: payload.priority,
      title: payload.content.title,
      body: payload.content.body,
      data: payload.content.data,
      recipientUserId: payload.recipients.userIds?.[0],
      recipientRole: payload.recipients.role,
      restaurantId: payload.recipients.restaurantId,
      courierId: payload.recipients.courierId,
      dealerId: payload.recipients.dealerId,
      channelsSent: payload.channels,
    });

    await this.notificationRepo.save(notification);

    // Kanallara gönder
    const sendPromises: Promise<void>[] = [];

    if (payload.channels.includes('PUSH')) {
      sendPromises.push(this.sendPushNotification(payload, notification.id));
    }

    if (payload.channels.includes('SMS')) {
      sendPromises.push(this.sendSMS(payload));
    }

    if (payload.channels.includes('WEBSOCKET')) {
      sendPromises.push(this.sendWebSocket(payload));
    }

    if (payload.channels.includes('EMAIL')) {
      sendPromises.push(this.sendEmail(payload));
    }

    await Promise.all(sendPromises);
  }

  private async sendPushNotification(
    payload: NotificationPayload,
    notificationId: string,
  ): Promise<void> {
    try {
      // FCM token'ları al
      const tokens = await this.getFCMTokens(payload.recipients);

      if (tokens.length === 0) {
        this.logger.warn('No FCM tokens found for recipients');
        return;
      }

      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title: payload.content.title,
          body: payload.content.body,
          imageUrl: payload.content.imageUrl,
        },
        data: {
          ...payload.content.data,
          notificationId,
          type: payload.type,
        },
        android: {
          priority: payload.priority === 'CRITICAL' ? 'high' : 'normal',
          notification: {
            channelId: payload.type,
            sound: this.getSoundForType(payload.type),
            vibrateTimingsMillis: [200, 100, 200],
          },
        },
        apns: {
          payload: {
            aps: {
              sound: this.getSoundForType(payload.type),
              badge: 1,
            },
          },
        },
      };

      const response = await this.fcmApp.messaging().sendEachForMulticast(message);
      this.logger.log(`Push notification sent: ${response.successCount} success, ${response.failureCount} failed`);
    } catch (error) {
      this.logger.error(`Push notification error: ${error.message}`);
    }
  }

  private async sendSMS(payload: NotificationPayload): Promise<void> {
    try {
      // Sadece kritik bildirimler için SMS
      if (payload.priority !== 'CRITICAL' && payload.priority !== 'HIGH') {
        return;
      }

      const phoneNumbers = await this.getPhoneNumbers(payload.recipients);

      for (const phone of phoneNumbers) {
        await this.twilioClient.messages.create({
          body: `${payload.content.title}\n${payload.content.body}`,
          from: process.env.TWILIO_PHONE,
          to: phone,
        });
      }

      this.logger.log(`SMS sent to ${phoneNumbers.length} recipients`);
    } catch (error) {
      this.logger.error(`SMS error: ${error.message}`);
    }
  }

  private async sendWebSocket(payload: NotificationPayload): Promise<void> {
    try {
      const rooms: string[] = [];

      if (payload.recipients.restaurantId) {
        rooms.push(`restaurant:${payload.recipients.restaurantId}`);
      }
      if (payload.recipients.courierId) {
        rooms.push(`courier:${payload.recipients.courierId}`);
      }
      if (payload.recipients.dealerId) {
        rooms.push(`dealer:${payload.recipients.dealerId}`);
      }
      if (payload.recipients.role) {
        rooms.push(`role:${payload.recipients.role}`);
      }

      const wsPayload = {
        type: payload.type,
        priority: payload.priority,
        title: payload.content.title,
        body: payload.content.body,
        data: payload.content.data,
        timestamp: new Date().toISOString(),
      };

      for (const room of rooms) {
        this.wsServer.to(room).emit('notification', wsPayload);
      }

      this.logger.log(`WebSocket notification sent to rooms: ${rooms.join(', ')}`);
    } catch (error) {
      this.logger.error(`WebSocket error: ${error.message}`);
    }
  }

  private async sendEmail(payload: NotificationPayload): Promise<void> {
    // Email servisi entegrasyonu (SendGrid, AWS SES vs.)
    this.logger.log('Email notification queued');
  }

  // Bildirim tiplerine göre ses
  private getSoundForType(type: NotificationType): string {
    const sounds = {
      [NotificationType.NEW_ORDER]: 'new_order.mp3',
      [NotificationType.ORDER_CANCELLED]: 'cancel.mp3',
      [NotificationType.COURIER_EMERGENCY]: 'emergency.mp3',
    };
    return sounds[type] || 'default.mp3';
  }

  // FCM token'ları al
  private async getFCMTokens(recipients: NotificationPayload['recipients']): Promise<string[]> {
    const tokens: string[] = [];

    if (recipients.courierId) {
      const courierToken = await this.redis.get(`fcm:courier:${recipients.courierId}`);
      if (courierToken) tokens.push(courierToken);
    }

    if (recipients.restaurantId) {
      const restaurantTokens = await this.redis.smembers(`fcm:restaurant:${recipients.restaurantId}`);
      tokens.push(...restaurantTokens);
    }

    return tokens;
  }

  // Telefon numaraları al
  private async getPhoneNumbers(recipients: NotificationPayload['recipients']): Promise<string[]> {
    // Veritabanından telefon numaralarını çek
    const phones: string[] = [];
    // Implementation...
    return phones;
  }

  // Tüm kullanıcılara toplu bildirim
  async broadcast(
    type: NotificationType,
    content: { title: string; body: string },
    role?: string,
  ): Promise<void> {
    await this.send({
      type,
      priority: 'NORMAL',
      recipients: { role: role as any },
      content,
      channels: ['PUSH', 'WEBSOCKET'],
    });
  }
}
