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
}
export {};
