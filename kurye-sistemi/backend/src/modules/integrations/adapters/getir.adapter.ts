import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RestaurantPlatformConfig } from '../entities/restaurant-platform-config.entity';
import { IPlatformAdapter, PlatformOrder } from './yemeksepeti.adapter';

@Injectable()
export class GetirAdapter implements IPlatformAdapter {
  private readonly logger = new Logger(GetirAdapter.name);
  private readonly baseUrl = 'https://api.getir.com/yemek/v1';

  constructor(private readonly httpService: HttpService) {}

  async authenticate(config: RestaurantPlatformConfig): Promise<boolean> {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.baseUrl}/auth`,
        {
          apiKey: config.apiKey,
          apiSecret: config.apiSecret,
        },
      );

      config.accessToken = response.data.token;
      config.tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      return true;
    } catch (error) {
      this.logger.error('Getir authentication failed', error);
      return false;
    }
  }

  async getOrders(config: RestaurantPlatformConfig): Promise<PlatformOrder[]> {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.baseUrl}/restaurants/${config.restaurantId}/orders`,
        {
          headers: { 'X-API-Key': config.apiKey },
        },
      );

      return response.data.orders.map((order: any) => ({
        platformOrderId: order.id,
        customerName: order.customer.name,
        customerPhone: order.customer.phoneNumber,
        deliveryAddress: order.delivery.address.text,
        items: order.items.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: order.totalPrice,
        paymentType: order.payment.method === 'ONLINE' ? 'online' : 'cash',
      }));
    } catch (error) {
      this.logger.error('Failed to fetch Getir orders', error);
      return [];
    }
  }

  async acceptOrder(config: RestaurantPlatformConfig, orderId: string): Promise<boolean> {
    try {
      await this.httpService.axiosRef.post(
        `${this.baseUrl}/orders/${orderId}/prepare`,
        {},
        {
          headers: { 'X-API-Key': config.apiKey },
        },
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to accept Getir order ${orderId}`, error);
      return false;
    }
  }

  async rejectOrder(config: RestaurantPlatformConfig, orderId: string, reason: string): Promise<boolean> {
    try {
      await this.httpService.axiosRef.post(
        `${this.baseUrl}/orders/${orderId}/cancel`,
        { reason },
        {
          headers: { 'X-API-Key': config.apiKey },
        },
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to reject Getir order ${orderId}`, error);
      return false;
    }
  }

  async updateMenu(config: RestaurantPlatformConfig, menuData: any): Promise<boolean> {
    return true;
  }

  async toggleRestaurantStatus(config: RestaurantPlatformConfig, isOpen: boolean): Promise<boolean> {
    try {
      await this.httpService.axiosRef.put(
        `${this.baseUrl}/restaurants/${config.restaurantId}/status`,
        { isOpen },
        {
          headers: { 'X-API-Key': config.apiKey },
        },
      );
      return true;
    } catch (error) {
      this.logger.error('Failed to toggle Getir restaurant status', error);
      return false;
    }
  }
}
