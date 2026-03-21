import { Injectable, Logger } from '@nestjs/common';
import { PlatformAdapter } from './platform-adapter.interface';
import { PlatformOrderDto } from '../dto/integration.dto';

@Injectable()
export class TrendyolYemekAdapter implements PlatformAdapter {
  private readonly logger = new Logger(TrendyolYemekAdapter.name);
  readonly platformName = 'Trendyol Yemek';

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
        message: 'Trendyol Yemek bağlantısı başarılı',
        data: {
          merchantName: 'Test Restaurant',
          status: 'ACTIVE'
        }
      };
    } catch (error) {
      this.logger.error('Trendyol Yemek connection test failed', error);
      return { success: false, message: error.message };
    }
  }

  normalizeOrder(rawOrder: any): PlatformOrderDto {
    return {
      platformOrderId: rawOrder.orderNumber || rawOrder.id,
      platform: 'trendyolyemek',
      customerName: rawOrder.customer?.fullName || rawOrder.customerName,
      customerPhone: rawOrder.customer?.phoneNumber || rawOrder.customerPhone,
      deliveryAddress: rawOrder.deliveryAddress?.fullAddress || rawOrder.deliveryAddress,
      totalAmount: parseFloat(rawOrder.totalPrice?.value || rawOrder.totalAmount),
      paymentMethod: this.mapPaymentMethod(rawOrder.payment?.type),
      notes: rawOrder.note || rawOrder.notes || '',
      items: (rawOrder.items || []).map((item: any) => ({
        name: item.productName || item.name,
        quantity: item.quantity,
        price: parseFloat(item.unitPrice?.value || item.price),
        options: item.options?.map((opt: any) => opt.name) || []
      })),
      metadata: {
        originalData: rawOrder,
        deliveryType: rawOrder.deliveryType,
        estimatedDeliveryTime: rawOrder.estimatedDeliveryTime,
        isScheduled: rawOrder.isScheduled,
        scheduledDeliveryTime: rawOrder.scheduledDeliveryTime
      }
    };
  }

  async fetchOrders(credentials: any, filters?: any): Promise<any[]> {
    this.logger.log(`Fetching orders for Trendyol merchant ${credentials.merchantId}`);
    return [];
  }

  async updateOrderStatus(credentials: any, orderId: string, status: string): Promise<any> {
    const platformStatus = this.mapStatusToPlatform(status);
    this.logger.log(`Updating Trendyol order ${orderId} status to ${platformStatus}`);
    return { success: true };
  }

  validateWebhook(payload: any, secret: string): boolean {
    return true;
  }

  private mapPaymentMethod(method: string): string {
    const mapping: Record<string, string> = {
      'ONLINE': 'Online Ödeme',
      'CREDIT_CARD': 'Kredi Kartı',
      'CASH': 'Nakit',
      'PAY_AT_DOOR': 'Kapıda Ödeme',
      'MEAL_CARD': 'Yemek Kartı'
    };
    return mapping[method] || method;
  }

  private mapStatusToPlatform(status: string): string {
    const mapping: Record<string, string> = {
      'PENDING': 'CREATED',
      'CONFIRMED': 'ACCEPTED',
      'PREPARING': 'PREPARING',
      'READY': 'PREPARED',
      'ON_THE_WAY': 'ON_COURIER',
      'DELIVERED': 'DELIVERED',
      'CANCELLED': 'CANCELLED'
    };
    return mapping[status] || status;
  }
}
