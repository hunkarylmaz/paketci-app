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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = exports.PaymentStatus = exports.PaymentMethod = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const credit_entity_1 = require("./entities/credit.entity");
const company_entity_1 = require("../companies/entities/company.entity");
const notifications_service_1 = require("../notifications/notifications.service");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["IYZICO_CARD"] = "iyzico_card";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["CANCELLED"] = "cancelled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let PaymentsService = class PaymentsService {
    constructor(creditRepository, companyRepository, notificationsService) {
        this.creditRepository = creditRepository;
        this.companyRepository = companyRepository;
        this.notificationsService = notificationsService;
        this.iyzicoConfig = {
            apiKey: process.env.IYZICO_API_KEY || 'sandbox-api-key',
            secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-secret-key',
            baseUrl: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
        };
    }
    getBankAccountInfo() {
        return {
            bankName: 'Türkiye İş Bankası',
            accountHolder: 'Paketçi Teknoloji A.Ş.',
            iban: 'TR12 3456 7890 1234 5678 9012 34',
            accountNumber: '1234-567890-12',
            branchCode: '1234',
            branchName: 'Bodrum Şubesi',
            swiftCode: 'ISBKTRIS',
            description: 'Lütfen açıklama kısmına bayi kodunuzu yazınız',
        };
    }
    async createPaymentRequest(dto) {
        const company = await this.companyRepository.findOne({
            where: { id: dto.companyId },
        });
        if (!company) {
            throw new Error('Bayi bulunamadı');
        }
        const payment = this.creditRepository.create({
            companyId: dto.companyId,
            type: credit_entity_1.CreditTransactionType.TOP_UP,
            amount: dto.amount,
            status: PaymentStatus.PENDING,
            paymentMethod: dto.method,
            metadata: {
                ...dto.cardDetails,
                ...dto.bankTransferDetails,
                requestedAt: new Date(),
            },
            description: this.getPaymentDescription(dto.method, dto.amount),
        });
        const savedPayment = await this.creditRepository.save(payment);
        await this.notificationsService.create({
            userId: company.id,
            type: 'payment_pending',
            title: 'Bakiye Yükleme Talebi',
            message: `${dto.amount} TL tutarında bakiye yükleme talebiniz alındı.`,
        });
        return {
            success: true,
            paymentId: savedPayment.id,
            status: PaymentStatus.PENDING,
            message: 'Ödeme talebiniz alındı',
        };
    }
    async processIyzicoPayment(paymentId, cardDetails) {
        const payment = await this.creditRepository.findOne({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new Error('Ödeme bulunamadı');
        }
        try {
            const isSuccess = await this.simulateIyzicoPayment(cardDetails);
            if (isSuccess) {
                await this.completePayment(paymentId);
                return {
                    success: true,
                    message: 'Ödeme başarıyla tamamlandı',
                    transactionId: `IYZ${Date.now()}`,
                };
            }
            else {
                await this.failPayment(paymentId, 'Kart reddedildi');
                throw new Error('Ödeme başarısız: Kart reddedildi');
            }
        }
        catch (error) {
            await this.failPayment(paymentId, error.message);
            throw error;
        }
    }
    async notifyBankTransfer(paymentId, transferDetails) {
        const payment = await this.creditRepository.findOne({
            where: { id: paymentId },
            relations: ['company'],
        });
        if (!payment) {
            throw new Error('Ödeme bulunamadı');
        }
        await this.creditRepository.update(paymentId, {
            status: PaymentStatus.PROCESSING,
            metadata: {
                ...payment.metadata,
                bankTransfer: transferDetails,
                notifiedAt: new Date(),
            },
        });
        await this.notificationsService.create({
            userId: 'admin',
            type: 'bank_transfer_notification',
            title: 'Yeni Havale Bildirimi',
            message: `${payment.company?.name} bayisi ${payment.amount} TL havale bildirimi yaptı.`,
        });
        await this.notificationsService.create({
            userId: payment.companyId,
            type: 'bank_transfer_received',
            title: 'Havale Bildirimi Alındı',
            message: `${payment.amount} TL tutarındaki havale bildiriminiz inceleniyor. Onaylandıktan sonra bakiyeniz yüklenecektir.`,
        });
        return {
            success: true,
            message: 'Havale bildiriminiz alındı, inceleniyor',
        };
    }
    async completePayment(paymentId) {
        const payment = await this.creditRepository.findOne({
            where: { id: paymentId },
            relations: ['company'],
        });
        if (!payment) {
            throw new Error('Ödeme bulunamadı');
        }
        const company = await this.companyRepository.findOne({
            where: { id: payment.companyId },
        });
        const newBalance = parseFloat(company.creditBalance.toString()) + parseFloat(payment.amount.toString());
        await this.companyRepository.update(payment.companyId, {
            creditBalance: newBalance,
        });
        await this.creditRepository.update(paymentId, {
            status: PaymentStatus.COMPLETED,
            balanceAfter: newBalance,
            completedAt: new Date(),
        });
        await this.notificationsService.create({
            userId: payment.companyId,
            type: 'payment_completed',
            title: 'Bakiye Yüklendi ✅',
            message: `${payment.amount} TL bakiyeniz başarıyla yüklendi. Yeni bakiyeniz: ${newBalance} TL`,
        });
        return {
            success: true,
            newBalance,
        };
    }
    async failPayment(paymentId, reason) {
        await this.creditRepository.update(paymentId, {
            status: PaymentStatus.FAILED,
            failureReason: reason,
            failedAt: new Date(),
        });
        const payment = await this.creditRepository.findOne({
            where: { id: paymentId },
        });
        await this.notificationsService.create({
            userId: payment.companyId,
            type: 'payment_failed',
            title: 'Ödeme Başarısız ❌',
            message: `${payment.amount} TL ödemeniz başarısız oldu. Sebep: ${reason}`,
        });
    }
    async getPaymentHistory(companyId) {
        return this.creditRepository.find({
            where: { companyId },
            order: { createdAt: 'DESC' },
        });
    }
    async getPendingPayments() {
        return this.creditRepository.find({
            where: { status: PaymentStatus.PENDING },
            relations: ['company'],
            order: { createdAt: 'DESC' },
        });
    }
    getPaymentDescription(method, amount) {
        if (method === PaymentMethod.IYZICO_CARD) {
            return `${amount} TL Kart ile Bakiye Yükleme`;
        }
        return `${amount} TL Havale ile Bakiye Yükleme`;
    }
    async simulateIyzicoPayment(cardDetails) {
        return Math.random() > 0.05;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(credit_entity_1.Credit)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map