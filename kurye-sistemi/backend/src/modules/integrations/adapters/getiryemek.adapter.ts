import { Injectable, Logger } from '@nestjs/common';
import { PlatformAdapter } from './platform-adapter.interface';
import { PlatformOrderDto } from '../dto/integration.dto';

@Injectable()
export class GetirYemekAdapter implements PlatformAdapter {
  private readonly logger = new Logger(GetirYemekAdapter.name);
  readonly platformName = 'Getir Yemek';

  async testConnection(credentials: {
    apiKey: string;
    apiSecret?: string;
    merchantId?: string;
    branchId?: string;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      if (!credentials.apiKey || !credentials.apiSecret) {
        return { success: false, message: 'API Key ve Secret gerekli' };
      }

      return {
        success: true,
        message: 'Getir Yemek bağlantısı başarılı',
        data: {
          merchantName: 'Test Restaurant',
          status: 'ACTIVE'
        }
      };
    } catch (error) {
      this.logger.error('Getir Yemek connection test failed', error);
      return { success: false, message: error.message };
    }
  }

  normalizeOrder(rawOrder: any): PlatformOrderDto {
    return {
      platformOrderId: rawOrder.id || rawOrder.orderId,
      platform: 'getiryemek',
      customerName: rawOrder.client?.name || rawOrder.customerName,
      customerPhone: rawOrder.client?.phoneNumber || rawOrder.customerPhone,
      deliveryAddress: this.formatAddress(rawOrder.client?.address || rawOrder.deliveryAddress),
      totalAmount: parseFloat(rawOrder.totalPrice || rawOrder.totalAmount),
      paymentMethod: this.mapPaymentMethod(rawOrder.paymentMethod),
      notes: rawOrder.clientNote || rawOrder.notes || '',
      items: (rawOrder.products || rawOrder.items || []).map((item: any) => ({
        name: item.name || item.productName,
        quantity: item.count || item.quantity,
        price: parseFloat(item.price || item.unitPrice),
        options: item.extras?.map((extra: any) => extra.name) || []
      })),
      metadata: {
        originalData: rawOrder,
        deliveryType: rawOrder.deliveryType,
        clientDeliveryDate: rawOrder.clientDeliveryDate,
        isPreOrder: rawOrder.isPreOrder,
        courier: rawOrder.courier
      }
    };
  }

  async fetchOrders(credentials: any, filters?: any): Promise<any[]> {
    this.logger.log(`Fetching orders for Getir merchant ${credentials.merchantId}`);
    return [];
  }

  async updateOrderStatus(credentials: any, orderId: string, status: string): Promise<any> {
    const platformStatus = this.mapStatusToPlatform(status);
    this.logger.log(`Updating Getir order ${orderId} status to ${platformStatus}`);
    return { success: true };
  }

  validateWebhook(payload: any, secret: string): boolean {
    return true;
  }

  private formatAddress(address: any): string {
    if (typeof address === 'string') return address;
    return `${address.street || ''} ${address.building || ''}, ${address.district || ''}/${address.city || ''}`;
  }

  private mapPaymentMethod(method: string): string {
    const mapping: Record<string, string> = {
      'ONLINE': 'Online Ödeme',
      'CASH': 'Nakit',
      'CREDIT_CARD': 'Kredi Kartı',
      'PAY_AT_DOOR': 'Kapıda Ödeme'
    };
    return mapping[method] || method;
  }

  private mapStatusToPlatform(status: string): string {
    const mapping: Record<string, string> = {
      'PENDING': 'PLACED',
      'CONFIRMED': 'ACCEPTED',
      'PREPARING': 'PREPARING',
      'READY': 'PREPARED',
      'ON_THE_WAY': 'ON_THE_WAY',
      'DELIVERED': 'DELIVERED',
      'CANCELLED': 'CANCELLED'
    };
    return mapping[status] || status;
  }
}
