import { PlatformOrderDto } from '../dto/integration.dto';

export interface PlatformAdapter {
  readonly platformName: string;
  
  testConnection(credentials: {
    apiKey: string;
    apiSecret?: string;
    merchantId?: string;
    branchId?: string;
  }): Promise<{ success: boolean; message: string; data?: any }>;

  normalizeOrder(rawOrder: any): PlatformOrderDto;
  
  fetchOrders(credentials: any, filters?: any): Promise<any[]>;
  
  updateOrderStatus(credentials: any, orderId: string, status: string): Promise<any>;
  
  validateWebhook(payload: any, secret: string): boolean;
}
