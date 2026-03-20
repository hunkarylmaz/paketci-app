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
var YemeksepetiAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YemeksepetiAdapter = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
let YemeksepetiAdapter = YemeksepetiAdapter_1 = class YemeksepetiAdapter {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(YemeksepetiAdapter_1.name);
        this.baseUrl = 'https://api.yemeksepeti.com/v2';
    }
    async authenticate(config) {
        try {
            const response = await this.httpService.axiosRef.post(`${this.baseUrl}/auth/token`, {
                apiKey: config.apiKey,
                apiSecret: config.apiSecret,
            });
            config.accessToken = response.data.access_token;
            config.refreshToken = response.data.refresh_token;
            config.tokenExpiresAt = new Date(Date.now() + response.data.expires_in * 1000);
            return true;
        }
        catch (error) {
            this.logger.error('Yemeksepeti authentication failed', error);
            return false;
        }
    }
    async getOrders(config) {
        try {
            await this.ensureValidToken(config);
            const response = await this.httpService.axiosRef.get(`${this.baseUrl}/merchants/${config.merchantId}/orders`, {
                headers: { Authorization: `Bearer ${config.accessToken}` },
            });
            return response.data.orders.map((order) => ({
                platformOrderId: order.id,
                customerName: order.customer.name,
                customerPhone: order.customer.phone,
                deliveryAddress: order.delivery.address,
                items: order.items.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalAmount: order.total,
                paymentType: order.payment.type === 'ONLINE' ? 'online' :
                    order.payment.type === 'CREDIT_CARD' ? 'card' : 'cash',
            }));
        }
        catch (error) {
            this.logger.error('Failed to fetch Yemeksepeti orders', error);
            return [];
        }
    }
    async acceptOrder(config, orderId) {
        try {
            await this.ensureValidToken(config);
            await this.httpService.axiosRef.post(`${this.baseUrl}/orders/${orderId}/accept`, {}, {
                headers: { Authorization: `Bearer ${config.accessToken}` },
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to accept order ${orderId}`, error);
            return false;
        }
    }
    async rejectOrder(config, orderId, reason) {
        try {
            await this.ensureValidToken(config);
            await this.httpService.axiosRef.post(`${this.baseUrl}/orders/${orderId}/reject`, { reason }, {
                headers: { Authorization: `Bearer ${config.accessToken}` },
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to reject order ${orderId}`, error);
            return false;
        }
    }
    async updateMenu(config, menuData) {
        return true;
    }
    async toggleRestaurantStatus(config, isOpen) {
        try {
            await this.ensureValidToken(config);
            await this.httpService.axiosRef.put(`${this.baseUrl}/merchants/${config.merchantId}/branches/${config.branchId}/status`, { isOpen }, {
                headers: { Authorization: `Bearer ${config.accessToken}` },
            });
            return true;
        }
        catch (error) {
            this.logger.error('Failed to toggle restaurant status', error);
            return false;
        }
    }
    async ensureValidToken(config) {
        if (config.tokenExpiresAt && config.tokenExpiresAt < new Date()) {
            await this.refreshToken(config);
        }
    }
    async refreshToken(config) {
        try {
            const response = await this.httpService.axiosRef.post(`${this.baseUrl}/auth/refresh`, {
                refreshToken: config.refreshToken,
            });
            config.accessToken = response.data.access_token;
            config.refreshToken = response.data.refresh_token;
            config.tokenExpiresAt = new Date(Date.now() + response.data.expires_in * 1000);
        }
        catch (error) {
            this.logger.error('Token refresh failed', error);
            throw error;
        }
    }
};
exports.YemeksepetiAdapter = YemeksepetiAdapter;
exports.YemeksepetiAdapter = YemeksepetiAdapter = YemeksepetiAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], YemeksepetiAdapter);
//# sourceMappingURL=yemeksepeti.adapter.js.map