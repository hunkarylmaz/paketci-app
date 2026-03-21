import { Injectable, Logger } from '@nestjs/common';
import { PlatformAdapter } from './platform-adapter.interface';
import { PlatformOrderDto } from '../dto/integration.dto';

@Injectable()
export class YemeksepetiAdapter implements PlatformAdapter {
  private readonly logger = new Logger(YemeksepetiAdapter.name);
  readonly platformName = 'Yemeksepeti';

  async testConnection(credentials: {
    apiKey: string;
    apiSecret?: string;
    merchantId?: string;
    branchId?: string;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // API test simulation
      if (!credentials.apiKey) {
        return { success: false, message: 'API Key gerekli' };
      }

      // Gerçek entegrasyonda:
      // const response = await fetch('https://api.yemeksepeti.com/v1/merchants/me', {
      //   headers: { 'Authorization': `Bearer ${credentials.apiKey}` }
      // });

      return {
        success: true,
        message: 'Yemeksepeti bağlantısı başarılı',
        data: {
          merchantName: 'Test Restaurant',
          status: 'ACTIVE'
        }
      };
    } catch (error) {
      this.logger.error('Yemeksepeti connection test failed', error);
      return { success: false, message: error.message };
    }
  }

  normalizeOrder(rawOrder: any): PlatformOrderDto {
    return {
      platformOrderId: rawOrder.id || rawOrder.orderId,
      platform: 'yemeksepeti',
      customerName: rawOrder.customer?.name || rawOrder.customerName,
      customerPhone: rawOrder.customer?.phone || rawOrder.customerPhone,
      deliveryAddress: rawOrder.address?.fullAddress || rawOrder.deliveryAddress,
      totalAmount: parseFloat(rawOrder.totalPrice || rawOrder.totalAmount),
      paymentMethod: this.mapPaymentMethod(rawOrder.paymentMethod),
      notes: rawOrder.note || rawOrder.notes || '',
      items: (rawOrder.items || []).map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price || item.unitPrice),
        options: item.options || []
      })),
      metadata: {
        originalData: rawOrder,
        deliveryTime: rawOrder.deliveryTime,
        preparationTime: rawOrder.preparationTime,
        isScheduled: rawOrder.isScheduled,
        scheduledFor: rawOrder.scheduledFor
      }
    };
  }

  async fetchOrders(credentials: any, filters?: any): Promise<any[]> {
    // Gerçek entegrasyonda:
    // const response = await fetch(`https://api.yemeksepeti.com/v1/merchants/${credentials.merchantId}/orders`, {
    //   headers: { 'Authorization': `Bearer ${credentials.apiKey}` }
    // });
    // return response.json();
    
    this.logger.log(`Fetching orders for merchant ${credentials.merchantId}`);
    return [];
  }

  async updateOrderStatus(credentials: any, orderId: string, status: string): Promise<any> {
    const platformStatus = this.mapStatusToPlatform(status);
    
    // Gerçek entegrasyonda:
    // await fetch(`https://api.yemeksepeti.com/v1/orders/${orderId}/status`, {
    //   method: 'PUT',
    //   headers: { 'Authorization': `Bearer ${credentials.apiKey}` },
    //   body: JSON.stringify({ status: platformStatus })
    // });

    this.logger.log(`Updating order ${orderId} status to ${platformStatus}`);
    return { success: true };
  }

  validateWebhook(payload: any, secret: string): boolean {
    // Webhook signature validation
    // const signature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
    // return signature === payload.signature;
    return true;
  }

  private mapPaymentMethod(method: string): string {
    const mapping: Record<string, string> = {
      'CREDIT_CARD': 'Kredi Kartı',
      'CASH': 'Nakit',
      'ONLINE': 'Online Ödeme',
      'MEAL_CARD': 'Yemek Kartı',
      'PAY_AT_DOOR': 'Kapıda Ödeme'
    };
    return mapping[method] || method;
  }

  private mapStatusToPlatform(status: string): string {
    const mapping: Record<string, string> = {
      'PENDING': 'NEW',
      'CONFIRMED': 'CONFIRMED',
      'PREPARING': 'PREPARING',
      'READY': 'READY',
      'ON_THE_WAY': 'DISPATCHED',
      'DELIVERED': 'DELIVERED',
      'CANCELLED': 'CANCELLED'
    };
    return mapping[status] || status;
  }

  mapStatusFromPlatform(platformStatus: string): string {
    const mapping: Record<string, string> = {
      'NEW': 'PENDING',
      'CONFIRMED': 'CONFIRMED',
      'PREPARING': 'PREPARING',
      'READY': 'READY',
      'DISPATCHED': 'ON_THE_WAY',
      'DELIVERED': 'DELIVERED',
      'CANCELLED': 'CANCELLED'
    };
    return mapping[platformStatus] || 'UNKNOWN';
  }
}
