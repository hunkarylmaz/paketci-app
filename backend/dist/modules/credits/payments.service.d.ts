import { Repository } from 'typeorm';
import { Credit } from './entities/credit.entity';
import { Company } from '../companies/entities/company.entity';
import { NotificationsService } from '../notifications/notifications.service';
export declare enum PaymentMethod {
    IYZICO_CARD = "iyzico_card",
    BANK_TRANSFER = "bank_transfer"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export interface CreatePaymentDto {
    companyId: string;
    amount: number;
    method: PaymentMethod;
    cardDetails?: {
        cardHolderName: string;
        cardNumber: string;
        expireMonth: string;
        expireYear: string;
        cvc: string;
    };
    bankTransferDetails?: {
        senderName: string;
        senderIban: string;
        transferDate: Date;
        description?: string;
    };
}
export interface IyzicoConfig {
    apiKey: string;
    secretKey: string;
    baseUrl: string;
}
export declare class PaymentsService {
    private creditRepository;
    private companyRepository;
    private notificationsService;
    private iyzicoConfig;
    constructor(creditRepository: Repository<Credit>, companyRepository: Repository<Company>, notificationsService: NotificationsService);
    getBankAccountInfo(): {
        bankName: string;
        accountHolder: string;
        iban: string;
        accountNumber: string;
        branchCode: string;
        branchName: string;
        swiftCode: string;
        description: string;
    };
    createPaymentRequest(dto: CreatePaymentDto): Promise<{
        success: boolean;
        paymentId: string;
        status: PaymentStatus;
        message: string;
    }>;
    processIyzicoPayment(paymentId: string, cardDetails: any): Promise<{
        success: boolean;
        message: string;
        transactionId: string;
    }>;
    notifyBankTransfer(paymentId: string, transferDetails: any): Promise<{
        success: boolean;
        message: string;
    }>;
    completePayment(paymentId: string): Promise<{
        success: boolean;
        newBalance: number;
    }>;
    failPayment(paymentId: string, reason: string): Promise<void>;
    getPaymentHistory(companyId: string): Promise<Credit[]>;
    getPendingPayments(): Promise<Credit[]>;
    private getPaymentDescription;
    private simulateIyzicoPayment;
}
