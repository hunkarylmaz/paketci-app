"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
let NotificationsService = class NotificationsService {
    constructor() {
        this.notifications = [];
    }
    async create(dto) {
        const notification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...dto,
            read: false,
            createdAt: new Date(),
        };
        this.notifications.push(notification);
        console.log(`📢 Bildirim: [${dto.type}] ${dto.title} - ${dto.message}`);
        return notification;
    }
    async findByUser(userId) {
        return this.notifications
            .filter(n => n.userId === userId)
            .sort((a, b) => b.createdAt - a.createdAt);
    }
    async markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
        return notification;
    }
    async getUnreadCount(userId) {
        return this.notifications.filter(n => n.userId === userId && !n.read).length;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map