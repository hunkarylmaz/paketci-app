import { PaymentsService, CreatePaymentDto } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
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
    createPayment(dto: CreatePaymentDto): Promise<{
        success: boolean;
        paymentId: string;
        status: import("./payments.service").PaymentStatus;
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
    getPaymentHistory(companyId: string): Promise<import("./entities/credit.entity").Credit[]>;
    getPendingPayments(): Promise<import("./entities/credit.entity").Credit[]>;
    approvePayment(paymentId: string): Promise<{
        success: boolean;
        newBalance: number;
    }>;
    getPresetAmounts(): {
        amounts: number[];
        popularAmount: number;
    };
}
