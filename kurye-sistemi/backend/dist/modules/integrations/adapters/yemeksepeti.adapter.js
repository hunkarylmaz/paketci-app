"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var YemeksepetiAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YemeksepetiAdapter = void 0;
const common_1 = require("@nestjs/common");
let YemeksepetiAdapter = YemeksepetiAdapter_1 = class YemeksepetiAdapter {
    constructor() {
        this.logger = new common_1.Logger(YemeksepetiAdapter_1.name);
        this.platformName = 'Yemeksepeti';
    }
    async testConnection(credentials) {
        try {
            if (!credentials.apiKey) {
                return { success: false, message: 'API Key gerekli' };
            }
            return {
                success: true,
                message: 'Yemeksepeti bağlantısı başarılı',
                data: {
                    merchantName: 'Test Restaurant',
                    status: 'ACTIVE'
                }
            };
        }
        catch (error) {
            this.logger.error('Yemeksepeti connection test failed', error);
            return { success: false, message: error.message };
        }
    }
    normalizeOrder(rawOrder) {
        return {
            platformOrderId: rawOrder.id || rawOrder.orderId,
            platform: 'yemeksepeti',
            customerName: rawOrder.customer?.name || rawOrder.customerName,
            customerPhone: rawOrder.customer?.phone || rawOrder.customerPhone,
            deliveryAddress: rawOrder.address?.fullAddress || rawOrder.deliveryAddress,
            totalAmount: parseFloat(rawOrder.totalPrice || rawOrder.totalAmount),
            paymentMethod: this.mapPaymentMethod(rawOrder.paymentMethod),
            notes: rawOrder.note || rawOrder.notes || '',
            items: (rawOrder.items || []).map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: parseFloat(item.price || item.unitPrice),
                options: item.options || []
            })),
            metadata: {
                originalData: rawOrder,
                deliveryTime: rawOrder.deliveryTime,
                preparationTime: rawOrder.preparationTime,
                isScheduled: rawOrder.isScheduled,
                scheduledFor: rawOrder.scheduledFor
            }
        };
    }
    async fetchOrders(credentials, filters) {
        this.logger.log(`Fetching orders for merchant ${credentials.merchantId}`);
        return [];
    }
    async updateOrderStatus(credentials, orderId, status) {
        const platformStatus = this.mapStatusToPlatform(status);
        this.logger.log(`Updating order ${orderId} status to ${platformStatus}`);
        return { success: true };
    }
    validateWebhook(payload, secret) {
        return true;
    }
    mapPaymentMethod(method) {
        const mapping = {
            'CREDIT_CARD': 'Kredi Kartı',
            'CASH': 'Nakit',
            'ONLINE': 'Online Ödeme',
            'MEAL_CARD': 'Yemek Kartı',
            'PAY_AT_DOOR': 'Kapıda Ödeme'
        };
        return mapping[method] || method;
    }
    mapStatusToPlatform(status) {
        const mapping = {
            'PENDING': 'NEW',
            'CONFIRMED': 'CONFIRMED',
            'PREPARING': 'PREPARING',
            'READY': 'READY',
            'ON_THE_WAY': 'DISPATCHED',
            'DELIVERED': 'DELIVERED',
            'CANCELLED': 'CANCELLED'
        };
        return mapping[status] || status;
    }
    mapStatusFromPlatform(platformStatus) {
        const mapping = {
            'NEW': 'PENDING',
            'CONFIRMED': 'CONFIRMED',
            'PREPARING': 'PREPARING',
            'READY': 'READY',
            'DISPATCHED': 'ON_THE_WAY',
            'DELIVERED': 'DELIVERED',
            'CANCELLED': 'CANCELLED'
        };
        return mapping[platformStatus] || 'UNKNOWN';
    }
};
exports.YemeksepetiAdapter = YemeksepetiAdapter;
exports.YemeksepetiAdapter = YemeksepetiAdapter = YemeksepetiAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], YemeksepetiAdapter);
//# sourceMappingURL=yemeksepeti.adapter.js.map