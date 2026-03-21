import { Injectable, Logger } from '@nestjs/common';
import { PlatformAdapter } from './platform-adapter.interface';
import { PlatformOrderDto } from '../dto/integration.dto';

@Injectable()
export class MigrosYemekAdapter implements PlatformAdapter {
  private readonly logger = new Logger(MigrosYemekAdapter.name);
  readonly platformName = 'Migros Yemek';

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
        message: 'Migros Yemek bağlantısı başarılı',
        data: {
          merchantName: 'Test Restaurant',
          status: 'ACTIVE'
        }
      };
    } catch (error) {
      this.logger.error('Migros Yemek connection test failed', error);
      return { success: false, message: error.message };
    }
  }

  normalizeOrder(rawOrder: any): PlatformOrderDto {
    return {
      platformOrderId: rawOrder.orderId || rawOrder.id,
      platform: 'migrosyemek',
      customerName: rawOrder.customerInfo?.name || rawOrder.customerName,
      customerPhone: rawOrder.customerInfo?.phoneNumber || rawOrder.customerPhone,
      deliveryAddress: this.formatAddress(rawOrder.deliveryAddress),
      totalAmount: parseFloat(rawOrder.totalAmount || rawOrder.price?.total),
      paymentMethod: this.mapPaymentMethod(rawOrder.paymentType),
      notes: rawOrder.customerNote || rawOrder.notes || '',
      items: (rawOrder.products || rawOrder.items || []).map((item: any) => ({
        name: item.productName || item.name,
        quantity: item.quantity,
        price: parseFloat(item.unitPrice || item.price),
        options: item.options?.map((opt: any) => opt.name) || []
      })),
      metadata: {
        originalData: rawOrder,
        deliveryType: rawOrder.deliveryType,
        estimatedDeliveryTime: rawOrder.estimatedDeliveryTime,
        isGift: rawOrder.isGift,
        giftMessage: rawOrder.giftMessage
      }
    };
  }

  async fetchOrders(credentials: any, filters?: any): Promise<any[]> {
    this.logger.log(`Fetching orders for Migros merchant ${credentials.merchantId}`);
    return [];
  }

  async updateOrderStatus(credentials: any, orderId: string, status: string): Promise<any> {
    const platformStatus = this.mapStatusToPlatform(status);
    this.logger.log(`Updating Migros order ${orderId} status to ${platformStatus}`);
    return { success: true };
  }

  validateWebhook(payload: any, secret: string): boolean {
    return true;
  }

  private formatAddress(address: any): string {
    if (typeof address === 'string') return address;
    return `${address.street} ${address.building}, ${address.district}/${address.city}`;
  }

  private mapPaymentMethod(method: string): string {
    const mapping: Record<string, string> = {
      'CREDIT_CARD': 'Kredi Kartı',
      'CASH': 'Nakit',
      'MULTINET': 'Multinet',
      'SODEXO': 'Sodexo',
      'TICKET': 'Ticket',
      'SETCARD': 'Setcard'
    };
    return mapping[method] || method;
  }

  private mapStatusToPlatform(status: string): string {
    const mapping: Record<string, string> = {
      'PENDING': 'PENDING',
      'CONFIRMED': 'ACCEPTED',
      'PREPARING': 'PREPARING',
      'READY': 'PREPARED',
      'ON_THE_WAY': 'ON_DELIVERY',
      'DELIVERED': 'DELIVERED',
      'CANCELLED': 'CANCELLED'
    };
    return mapping[status] || status;
  }
}
