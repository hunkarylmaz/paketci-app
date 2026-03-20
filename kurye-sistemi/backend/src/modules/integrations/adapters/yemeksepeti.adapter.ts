import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RestaurantPlatformConfig } from '../entities/restaurant-platform-config.entity';

export interface PlatformOrder {
  platformOrderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentType: 'cash' | 'card' | 'online';
}

export interface IPlatformAdapter {
  authenticate(config: RestaurantPlatformConfig): Promise<boolean>;
  getOrders(config: RestaurantPlatformConfig): Promise<PlatformOrder[]>;
  acceptOrder(config: RestaurantPlatformConfig, orderId: string): Promise<boolean>;
  rejectOrder(config: RestaurantPlatformConfig, orderId: string, reason: string): Promise<boolean>;
  updateMenu(config: RestaurantPlatformConfig, menuData: any): Promise<boolean>;
  toggleRestaurantStatus(config: RestaurantPlatformConfig, isOpen: boolean): Promise<boolean>;
}

@Injectable()
export class YemeksepetiAdapter implements IPlatformAdapter {
  private readonly logger = new Logger(YemeksepetiAdapter.name);
  private readonly baseUrl = 'https://api.yemeksepeti.com/v2';

  constructor(private readonly httpService: HttpService) {}

  async authenticate(config: RestaurantPlatformConfig): Promise<boolean> {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.baseUrl}/auth/token`,
        {
          apiKey: config.apiKey,
          apiSecret: config.apiSecret,
        },
      );

      config.accessToken = response.data.access_token;
      config.refreshToken = response.data.refresh_token;
      config.tokenExpiresAt = new Date(Date.now() + response.data.expires_in * 1000);
      
      return true;
    } catch (error) {
      this.logger.error('Yemeksepeti authentication failed', error);
      return false;
    }
  }

  async getOrders(config: RestaurantPlatformConfig): Promise<PlatformOrder[]> {
    try {
      await this.ensureValidToken(config);
      
      const response = await this.httpService.axiosRef.get(
        `${this.baseUrl}/merchants/${config.merchantId}/orders`,
        {
          headers: { Authorization: `Bearer ${config.accessToken}` },
        },
      );

      return response.data.orders.map((order: any) => ({
        platformOrderId: order.id,
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        deliveryAddress: order.delivery.address,
        items: order.items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: order.total,
        paymentType: order.payment.type === 'ONLINE' ? 'online' : 
                     order.payment.type === 'CREDIT_CARD' ? 'card' : 'cash',
      }));
    } catch (error) {
      this.logger.error('Failed to fetch Yemeksepeti orders', error);
      return [];
    }
  }

  async acceptOrder(config: RestaurantPlatformConfig, orderId: string): Promise<boolean> {
    try {
      await this.ensureValidToken(config);
      
      await this.httpService.axiosRef.post(
        `${this.baseUrl}/orders/${orderId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${config.accessToken}` },
        },
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to accept order ${orderId}`, error);
      return false;
    }
  }

  async rejectOrder(config: RestaurantPlatformConfig, orderId: string, reason: string): Promise<boolean> {
    try {
      await this.ensureValidToken(config);
      
      await this.httpService.axiosRef.post(
        `${this.baseUrl}/orders/${orderId}/reject`,
        { reason },
        {
          headers: { Authorization: `Bearer ${config.accessToken}` },
        },
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to reject order ${orderId}`, error);
      return false;
    }
  }

  async updateMenu(config: RestaurantPlatformConfig, menuData: any): Promise<boolean> {
    // Menu update implementation
    return true;
  }

  async toggleRestaurantStatus(config: RestaurantPlatformConfig, isOpen: boolean): Promise<boolean> {
    try {
      await this.ensureValidToken(config);
      
      await this.httpService.axiosRef.put(
        `${this.baseUrl}/merchants/${config.merchantId}/branches/${config.branchId}/status`,
        { isOpen },
        {
          headers: { Authorization: `Bearer ${config.accessToken}` },
        },
      );
      return true;
    } catch (error) {
      this.logger.error('Failed to toggle restaurant status', error);
      return false;
    }
  }

  private async ensureValidToken(config: RestaurantPlatformConfig): Promise<void> {
    if (config.tokenExpiresAt && config.tokenExpiresAt < new Date()) {
      await this.refreshToken(config);
    }
  }

  private async refreshToken(config: RestaurantPlatformConfig): Promise<void> {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.baseUrl}/auth/refresh`,
        {
          refreshToken: config.refreshToken,
        },
      );

      config.accessToken = response.data.access_token;
      config.refreshToken = response.data.refresh_token;
      config.tokenExpiresAt = new Date(Date.now() + response.data.expires_in * 1000);
    } catch (error) {
      this.logger.error('Token refresh failed', error);
      throw error;
    }
  }
}
