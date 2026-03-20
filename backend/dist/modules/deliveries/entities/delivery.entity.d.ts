import { Company } from '../../companies/entities/company.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Courier } from '../../couriers/entities/courier.entity';
import { Receipt } from '../../receipts/entities/receipt.entity';
export declare enum DeliveryStatus {
    PENDING = "pending",
    ASSIGNED = "assigned",
    ACCEPTED = "accepted",
    PICKED_UP = "picked_up",
    IN_TRANSIT = "in_transit",
    NEAR_DESTINATION = "near_destination",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    FAILED = "failed"
}
export declare enum PaymentType {
    CASH = "cash",
    CREDIT_CARD = "credit_card",
    ONLINE = "online",
    MEAL_CARD = "meal_card"
}
export declare class Delivery {
    id: string;
    trackingNumber: string;
    restaurantId: string;
    restaurant: Restaurant;
    companyId: string;
    company: Company;
    courierId: string;
    courier: Courier;
    orderSource: string;
    receipts: Receipt[];
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryDistrict: string;
    deliveryNeighborhood: string;
    deliveryLatitude: number;
    deliveryLongitude: number;
    deliveryNotes: string;
    orderAmount: number;
    paymentType: PaymentType;
    cashAmount: number;
    status: DeliveryStatus;
    restaurantNotifiedAt: Date;
    restaurantAcceptedAt: Date;
    restaurantReadyAt: Date;
    assignedAt: Date;
    courierNotifiedAt: Date;
    acceptedAt: Date;
    arrivedAtRestaurantAt: Date;
    pickedUpAt: Date;
    inTransitAt: Date;
    arrivedAtDestinationAt: Date;
    deliveredAt: Date;
    cancelledAt: Date;
    estimatedDeliveryTime: Date;
    creditDeducted: number;
    courierEarnings: number;
    requireDeliveryPhoto: boolean;
    deliveryPhoto: string;
    deliveryPhotoMetadata: {
        url: string;
        takenAt: Date;
        latitude?: number;
        longitude?: number;
    };
    customerSignature: string;
    customerSignatureMetadata: {
        signedAt: Date;
        ipAddress?: string;
        deviceInfo?: string;
    };
    preparationDuration: number;
    assignmentDuration: number;
    acceptanceDuration: number;
    pickupWaitDuration: number;
    transitDuration: number;
    deliveryDuration: number;
    totalDuration: number;
    cancellationReason: string;
    failureReason: string;
    totalDistance: number;
    createdAt: Date;
    updatedAt: Date;
}
