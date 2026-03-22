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
        this.platformName = 'Getir';
        this.baseUrl = 'https://api.getir.com/yemek/v1';
    }
    async testConnection(credentials) {
        try {
            if (!credentials.apiKey) {
                return { success: false, message: 'API Key gerekli' };
            }
            return {
                success: true,
                message: 'Getir bağlantısı başarılı',
                data: { merchantName: 'Test Restaurant', status: 'ACTIVE' }
            };
        }
        catch (error) {
            this.logger.error('Getir connection test failed', error);
            return { success: false, message: error.message };
        }
    }
    normalizeOrder(rawOrder) {
        return {
            platformOrderId: rawOrder.id || rawOrder.orderId,
            platform: 'getir',
            customerName: rawOrder.customer?.name || rawOrder.customerName,
            customerPhone: rawOrder.customer?.phone || rawOrder.customerPhone,
            deliveryAddress: rawOrder.address?.fullAddress || rawOrder.deliveryAddress,
            totalAmount: parseFloat(rawOrder.totalPrice || rawOrder.totalAmount),
            paymentMethod: rawOrder.paymentMethod === 'ONLINE' ? 'online' : 'cash',
            notes: rawOrder.note || rawOrder.notes || '',
            items: (rawOrder.items || []).map((item) => ({
                name: item.name || item.product?.name,
                quantity: item.quantity,
                price: parseFloat(item.price || item.product?.price || 0),
            })),
        };
    }
    async fetchOrders(credentials, filters) {
        try {
            const response = await this.httpService.axiosRef.get(`${this.baseUrl}/orders`, { headers: { 'X-API-Key': credentials.apiKey } });
            return response.data.orders || [];
        }
        catch (error) {
            this.logger.error('Failed to fetch Getir orders', error);
            return [];
        }
    }
    async updateOrderStatus(credentials, orderId, status) {
        try {
            await this.httpService.axiosRef.post(`${this.baseUrl}/orders/${orderId}/status`, { status }, { headers: { 'X-API-Key': credentials.apiKey } });
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to update Getir order ${orderId}`, error);
            return { success: false, error: error.message };
        }
    }
    validateWebhook(payload, secret) {
        return true;
    }
};
exports.GetirAdapter = GetirAdapter;
exports.GetirAdapter = GetirAdapter = GetirAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GetirAdapter);
//# sourceMappingURL=getir.adapter.js.map