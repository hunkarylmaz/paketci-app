import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { Delivery, DeliveryStatus } from '../deliveries/entities/delivery.entity';
import { generateTrackingNumber } from '../../utils/tracking-number.util';

@Injectable()
export class ExtensionService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  // Validate API key and return restaurant info
  async validateApiKey(apiKey: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { apiKey },
    });

    if (!restaurant) {
      return {
        success: false,
        error: 'INVALID_API_KEY',
        message: 'Geçersiz API Key',
      };
    }

    return {
      success: true,
      data: {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        isActive: restaurant.isActive,
      },
    };
  }

  // Create order from extension
  async createOrder(orderData: any, apiKey: string) {
    // Validate API key
    const restaurant = await this.restaurantRepository.findOne({
      where: { apiKey },
    });

    if (!restaurant) {
      return {
        success: false,
        error: 'INVALID_API_KEY',
        message: 'Geçersiz API Key',
      };
    }

    // Check if order already exists (duplicate prevention)
    const existingOrder = await this.deliveryRepository.findOne({
      where: {
        restaurantId: restaurant.id,
        platformOrderId: orderData.platformOrderId,
        platform: orderData.platform,
      },
    });

    if (existingOrder) {
      return {
        success: false,
        error: 'ORDER_ALREADY_EXISTS',
        message: 'Bu sipariş zaten kayıtlı',
        data: {
          paketciOrderId: existingOrder.trackingNumber,
          status: existingOrder.status,
        },
      };
    }

    // Create new delivery
    const delivery = this.deliveryRepository.create({
      trackingNumber: generateTrackingNumber(),
      restaurantId: restaurant.id,
      platform: orderData.platform,
      platformOrderId: orderData.platformOrderId,
      
      // Customer info
      customerName: orderData.customer?.name || 'Müşteri',
      customerPhone: orderData.customer?.phone || '',
      customerNote: orderData.customer?.note || '',
      
      // Address
      deliveryAddress: orderData.address?.full || '',
      deliveryCity: orderData.address?.city || '',
      deliveryDistrict: orderData.address?.district || '',
      deliveryLatitude: orderData.address?.latitude,
      deliveryLongitude: orderData.address?.longitude,
      
      // Items (stored as JSON array)
      items: orderData.items || [],
      
      // Payment
      totalAmount: orderData.payment?.total || 0,
      deliveryFee: orderData.payment?.deliveryFee || 0,
      discountAmount: orderData.payment?.discount || 0,
      paymentMethod: orderData.payment?.method || 'online',
      
      // Status
      status: DeliveryStatus.PENDING_ASSIGNMENT,
      
      // Timing
      platformOrderTime: orderData.timing?.orderTime ? new Date(orderData.timing.orderTime) : new Date(),
      estimatedPrepTime: orderData.timing?.prepTime || 15,
      
      // Source
      sourceUrl: orderData.sourceUrl || '',
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedDeliveries = await this.deliveryRepository.save(delivery);
    const savedDelivery = Array.isArray(savedDeliveries) ? savedDeliveries[0] : savedDeliveries;

    return {
      success: true,
      data: {
        paketciOrderId: savedDelivery.trackingNumber,
        status: savedDelivery.status,
        estimatedPickup: this.calculateEstimatedPickup(savedDelivery),
      },
    };
  }

  // Get order status
  async getOrderStatus(orderId: string, apiKey: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { apiKey },
    });

    if (!restaurant) {
      return {
        success: false,
        error: 'INVALID_API_KEY',
        message: 'Geçersiz API Key',
      };
    }

    const delivery = await this.deliveryRepository.findOne({
      where: {
        trackingNumber: orderId,
        restaurantId: restaurant.id,
      },
    });

    if (!delivery) {
      return {
        success: false,
        error: 'ORDER_NOT_FOUND',
        message: 'Sipariş bulunamadı',
      };
    }

    return {
      success: true,
      data: {
        paketciOrderId: delivery.trackingNumber,
        status: delivery.status,
        courier: delivery.courier ? {
          name: `${delivery.courier.firstName} ${delivery.courier.lastName}`,
          phone: delivery.courier.phone,
        } : null,
        estimatedDelivery: delivery.estimatedDeliveryTime,
      },
    };
  }

  // Calculate estimated pickup time
  private calculateEstimatedPickup(delivery: Delivery): string {
    const now = new Date();
    const prepTime = delivery.estimatedPrepTime || 15;
    const pickupTime = new Date(now.getTime() + prepTime * 60000);
    
    return pickupTime.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
