"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GetirAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetirAdapter = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
let GetirAdapter = GetirAdapter_1 = class GetirAdapter {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(GetirAdapter_1.name);
        this.baseUrl = 'https://api.getir.com/yemek/v1';
    }
    async authenticate(config) {
        try {
            const response = await this.httpService.axiosRef.post(`${this.baseUrl}/auth`, {
                apiKey: config.apiKey,
                apiSecret: config.apiSecret,
            });
            config.accessToken = response.data.token;
            config.tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            return true;
        }
        catch (error) {
            this.logger.error('Getir authentication failed', error);
            return false;
        }
    }
    async getOrders(config) {
        try {
            const response = await this.httpService.axiosRef.get(`${this.baseUrl}/restaurants/${config.restaurantId}/orders`, {
                headers: { 'X-API-Key': config.apiKey },
            });
            return response.data.orders.map((order) => ({
                platformOrderId: order.id,
                customerName: order.customer.name,
                customerPhone: order.customer.phoneNumber,
                deliveryAddress: order.delivery.address.text,
                items: order.items.map((item) => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                totalAmount: order.totalPrice,
                paymentType: order.payment.method === 'ONLINE' ? 'online' : 'cash',
            }));
        }
        catch (error) {
            this.logger.error('Failed to fetch Getir orders', error);
            return [];
        }
    }
    async acceptOrder(config, orderId) {
        try {
            await this.httpService.axiosRef.post(`${this.baseUrl}/orders/${orderId}/prepare`, {}, {
                headers: { 'X-API-Key': config.apiKey },
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to accept Getir order ${orderId}`, error);
            return false;
        }
    }
    async rejectOrder(config, orderId, reason) {
        try {
            await this.httpService.axiosRef.post(`${this.baseUrl}/orders/${orderId}/cancel`, { reason }, {
                headers: { 'X-API-Key': config.apiKey },
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to reject Getir order ${orderId}`, error);
            return false;
        }
    }
    async updateMenu(config, menuData) {
        return true;
    }
    async toggleRestaurantStatus(config, isOpen) {
        try {
            await this.httpService.axiosRef.put(`${this.baseUrl}/restaurants/${config.restaurantId}/status`, { isOpen }, {
                headers: { 'X-API-Key': config.apiKey },
            });
            return true;
        }
        catch (error) {
            this.logger.error('Failed to toggle Getir restaurant status', error);
            return false;
        }
    }
};
exports.GetirAdapter = GetirAdapter;
exports.GetirAdapter = GetirAdapter = GetirAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GetirAdapter);
//# sourceMappingURL=getir.adapter.js.map