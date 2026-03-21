interface CreateNotificationDto {
    userId: string;
    type: string;
    title: string;
    message: string;
}
export declare class NotificationsService {
    private notifications;
    create(dto: CreateNotificationDto): Promise<{
        read: boolean;
        createdAt: Date;
        userId: string;
        type: string;
        title: string;
        message: string;
        id: string;
    }>;
    findByUser(userId: string): Promise<any[]>;
    markAsRead(notificationId: string): Promise<any>;
    getUnreadCount(userId: string): Promise<number>;
    sendNewOrderNotification(deliveryId: string, restaurantId: string): Promise<{
        id: string;
        userId: string;
        type: string;
        title: string;
        message: string;
        deliveryId: string;
        read: boolean;
        createdAt: Date;
    }>;
    sendOrderCancelledNotification(deliveryId: string, restaurantId: string, reason: string): Promise<{
        id: string;
        userId: string;
        type: string;
        title: string;
        message: string;
        deliveryId: string;
        reason: string;
        read: boolean;
        createdAt: Date;
    }>;
}
export {};
