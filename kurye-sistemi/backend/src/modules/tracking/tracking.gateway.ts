import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

// WebSocket üzerinden gelen konum verisi
interface LocationUpdate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  batteryLevel: number;
  timestamp: string;
}

// WebSocket üzerinden gelen durum güncellemesi
interface StatusUpdate {
  orderId: string;
  status: string;
  note?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: '/ws',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrackingGateway.name);

  constructor(
    private jwtService: JwtService,
    @InjectRedis() private redis: Redis,
  ) {}

  // Client bağlandığında
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.query.token;
      
      if (!token) {
        this.logger.warn('Connection attempt without token');
        client.disconnect();
        return;
      }

      // JWT doğrulama
      const payload = this.jwtService.verify(token);
      
      // Client bilgilerini socket'e ekle
      client.data.userId = payload.sub;
      client.data.role = payload.role;
      client.data.entityId = payload.entityId; // courierId, restaurantId, dealerId

      // Role göre odaya katıl
      await this.joinRooms(client, payload);

      // Online status güncelle
      await this.redis.setex(`online:${payload.role}:${payload.entityId}`, 300, '1');

      this.logger.log(`Client connected: ${client.id} - Role: ${payload.role}`);
      
      // Bağlantı başarılı bildirimi
      client.emit('connected', {
        status: 'ok',
        userId: payload.sub,
        role: payload.role,
      });
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  // Client bağlantısı koptuğunda
  async handleDisconnect(client: Socket) {
    const { role, entityId } = client.data;
    
    if (role && entityId) {
      await this.redis.del(`online:${role}:${entityId}`);
    }
    
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Kurye konum güncellemesi (5 saniyede bir)
  @SubscribeMessage('location:update')
  async handleLocationUpdate(
    @MessageBody() data: LocationUpdate,
    @ConnectedSocket() client: Socket,
  ) {
    const { role, entityId } = client.data;

    if (role !== 'COURIER') {
      client.emit('error', { message: 'Only couriers can update location' });
      return;
    }

    // Sahte konum kontrolü
    if (this.isMockLocation(data)) {
      this.logger.warn(`Mock location detected for courier ${entityId}`);
      client.emit('error', { message: 'Mock location detected' });
      return;
    }

    // Location Service'e gönder
    await this.updateCourierLocation(entityId, data);

    // Restoranlara bildirim (eğer sipariş varsa)
    await this.notifyActiveOrders(entityId, data);

    // Başarılı yanıt
    client.emit('location:ack', { timestamp: new Date().toISOString() });
  }

  // Kurye sipariş durum güncellemesi
  @SubscribeMessage('order:status')
  async handleOrderStatusUpdate(
    @MessageBody() data: StatusUpdate,
    @ConnectedSocket() client: Socket,
  ) {
    const { role, entityId } = client.data;

    if (role !== 'COURIER') {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Siparişi güncelle ve ilgili restorana bildir
    await this.updateOrderStatus(data.orderId, data.status, entityId);

    // WebSocket üzerinden tüm ilgililere bildir
    this.server.to(`order:${data.orderId}`).emit('order:updated', {
      orderId: data.orderId,
      status: data.status,
      courierId: entityId,
      timestamp: new Date().toISOString(),
    });
  }

  // Restoran kurye takip başlatma
  @SubscribeMessage('tracking:start')
  async handleTrackingStart(
    @MessageBody() data: { orderId: string; courierId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { role } = client.data;

    if (role !== 'RESTAURANT' && role !== 'DEALER') {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Kuryenin odasına katıl
    client.join(`courier:${data.courierId}`);
    client.join(`order:${data.orderId}`);

    // Mevcut konumu gönder
    const location = await this.getCourierLocation(data.courierId);
    if (location) {
      client.emit('location:initial', location);
    }

    this.logger.log(`Tracking started for order ${data.orderId}, courier ${data.courierId}`);
  }

  // Restoran kurye takip bitirme
  @SubscribeMessage('tracking:stop')
  async handleTrackingStop(
    @MessageBody() data: { orderId: string; courierId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`courier:${data.courierId}`);
    client.leave(`order:${data.orderId}`);
    
    this.logger.log(`Tracking stopped for order ${data.orderId}`);
  }

  // Acil durum bildirimi
  @SubscribeMessage('emergency:alert')
  async handleEmergencyAlert(
    @MessageBody() data: { type: string; location: { lat: number; lng: number }; message?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { role, entityId } = client.data;

    if (role !== 'COURIER') {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    this.logger.error(`EMERGENCY ALERT from courier ${entityId}: ${data.type}`);

    // Tüm bayi adminlerine ve sistem adminlerine bildir
    this.server.to('role:ADMIN').to('role:DEALER').emit('emergency:alert', {
      courierId: entityId,
      type: data.type,
      location: data.location,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    // Bildirim servisi üzerinden SMS/Push gönder
    // await this.notificationService.sendEmergencyAlert(...);
  }

  // Mola talebi
  @SubscribeMessage('break:request')
  async handleBreakRequest(
    @MessageBody() data: { type: 'SHORT' | 'LONG' | 'EMERGENCY' },
    @ConnectedSocket() client: Socket,
  ) {
    const { role, entityId } = client.data;

    if (role !== 'COURIER') {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Bayiye bildirim gönder
    this.server.to('role:DEALER').emit('break:request', {
      courierId: entityId,
      type: data.type,
      timestamp: new Date().toISOString(),
    });

    client.emit('break:pending', { message: 'Mola talebiniz gönderildi' });
  }

  // Yardımcı metodlar

  private async joinRooms(client: Socket, payload: any) {
    const { role, entityId } = payload;

    // Role göre oda
    client.join(`role:${role}`);

    // Entity'e özel oda
    if (entityId) {
      client.join(`${role.toLowerCase()}:${entityId}`);
    }

    // Kurye ise aktif siparişlerine katıl
    if (role === 'COURIER') {
      const activeOrders = await this.getActiveOrders(entityId);
      for (const order of activeOrders) {
        client.join(`order:${order.id}`);
      }
    }

    // Restoran ise kendi odasına katıl
    if (role === 'RESTAURANT') {
      client.join(`restaurant:${entityId}`);
    }

    // Bayi ise tüm restoranlarına katıl
    if (role === 'DEALER') {
      const restaurants = await this.getDealerRestaurants(entityId);
      for (const restaurant of restaurants) {
        client.join(`restaurant:${restaurant.id}`);
      }
    }
  }

  private async updateCourierLocation(courierId: string, data: LocationUpdate) {
    // Redis'e kaydet
    await this.redis.setex(
      `courier:location:${courierId}`,
      300,
      JSON.stringify({
        courierId,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        batteryLevel: data.batteryLevel,
        timestamp: data.timestamp,
      }),
    );

    // Geospatial index güncelle
    await this.redis.geoadd(
      'courier:geo',
      data.longitude,
      data.latitude,
      courierId,
    );
  }

  private async notifyActiveOrders(courierId: string, data: LocationUpdate) {
    // Kuryenin aktif siparişlerini bul
    const activeOrders = await this.getActiveOrders(courierId);

    for (const order of activeOrders) {
      // Restorana konum güncellemesi gönder
      this.server.to(`restaurant:${order.restaurantId}`).emit('courier:location', {
        orderId: order.id,
        courierId,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        timestamp: data.timestamp,
      });

      // Kurye restorana yaklaştı mı kontrol et
      if (order.restaurantLat && order.restaurantLng) {
        const distance = this.calculateDistance(
          data.latitude,
          data.longitude,
          order.restaurantLat,
          order.restaurantLng,
        );

        if (distance < 200) { // 200 metre
          this.server.to(`restaurant:${order.restaurantId}`).emit('courier:nearby', {
            orderId: order.id,
            courierId,
            distance: Math.round(distance),
          });
        }
      }
    }
  }

  private isMockLocation(data: LocationUpdate): boolean {
    // Mock location tespiti
    if (!data.accuracy || data.accuracy < 5) {
      return true;
    }
    if (data.speed !== undefined && data.speed > 120) { // 120 km/s üstü şüpheli
      return true;
    }
    return false;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // metre
  }

  private toRad(degree: number): number {
    return degree * (Math.PI / 180);
  }

  private async getCourierLocation(courierId: string) {
    const data = await this.redis.get(`courier:location:${courierId}`);
    return data ? JSON.parse(data) : null;
  }

  private async getActiveOrders(courierId: string): Promise<any[]> {
    // Veritabanından aktif siparişleri çek
    // Mock data for now
    return [];
  }

  private async updateOrderStatus(orderId: string, status: string, courierId: string) {
    // Veritabanı güncelleme
    this.logger.log(`Order ${orderId} status updated to ${status} by courier ${courierId}`);
  }

  private async getDealerRestaurants(dealerId: string): Promise<any[]> {
    // Veritabanından bayiye ait restoranları çek
    return [];
  }
}
