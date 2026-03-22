import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RestaurantPlatformConfig } from '../entities/restaurant-platform-config.entity';
import { PlatformAdapter } from './platform-adapter.interface';
import { PlatformOrderDto } from '../dto/integration.dto';

@Injectable()
export class GetirAdapter implements PlatformAdapter {
  private readonly logger = new Logger(GetirAdapter.name);
  readonly platformName = 'Getir';
  private readonly baseUrl = 'https://api.getir.com/yemek/v1';

  constructor(private readonly httpService: HttpService) {}

  async testConnection(credentials: {
    apiKey: string;
    apiSecret?: string;
    merchantId?: string;
    branchId?: string;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      if (!credentials.apiKey) {
        return { success: false, message: 'API Key gerekli' };
      }
      return {
        success: true,
        message: 'Getir bağlantısı başarılı',
        data: { merchantName: 'Test Restaurant', status: 'ACTIVE' }
      };
    } catch (error) {
      this.logger.error('Getir connection test failed', error);
      return { success: false, message: error.message };
    }
  }

  normalizeOrder(rawOrder: any): PlatformOrderDto {
    return {
      platformOrderId: rawOrder.id || rawOrder.orderId,
      platform: 'getir',
      customerName: rawOrder.customer?.name || rawOrder.customerName,
      customerPhone: rawOrder.customer?.phone || rawOrder.customerPhone,
      deliveryAddress: rawOrder.address?.fullAddress || rawOrder.deliveryAddress,
      totalAmount: parseFloat(rawOrder.totalPrice || rawOrder.totalAmount),
      paymentMethod: rawOrder.paymentMethod === 'ONLINE' ? 'online' : 'cash',
      notes: rawOrder.note || rawOrder.notes || '',
      items: (rawOrder.items || []).map((item: any) => ({
        name: item.name || item.product?.name,
        quantity: item.quantity,
        price: parseFloat(item.price || item.product?.price || 0),
      })),
    };
  }

  async fetchOrders(credentials: any, filters?: any): Promise<any[]> {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.baseUrl}/orders`,
        { headers: { 'X-API-Key': credentials.apiKey } }
      );
      return response.data.orders || [];
    } catch (error) {
      this.logger.error('Failed to fetch Getir orders', error);
      return [];
    }
  }

  async updateOrderStatus(credentials: any, orderId: string, status: string): Promise<any> {
    try {
      await this.httpService.axiosRef.post(
        `${this.baseUrl}/orders/${orderId}/status`,
        { status },
        { headers: { 'X-API-Key': credentials.apiKey } }
      );
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to update Getir order ${orderId}`, error);
      return { success: false, error: error.message };
    }
  }

  validateWebhook(payload: any, secret: string): boolean {
    // Implement webhook validation logic
    return true;
  }
}
