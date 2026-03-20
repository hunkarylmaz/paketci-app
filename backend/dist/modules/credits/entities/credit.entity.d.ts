import { Company } from '../../companies/entities/company.entity';
export declare enum CreditTransactionType {
    PURCHASE = "purchase",
    DELIVERY_DEDUCTION = "delivery_deduction",
    REFUND = "refund",
    BONUS = "bonus",
    ADJUSTMENT = "adjustment",
    TOP_UP = "top_up"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare class Credit {
    id: string;
    companyId: string;
    company: Company;
    type: CreditTransactionType;
    amount: number;
    balanceAfter: number;
    deliveryId: string;
    paymentMethod: string;
    paymentId: string;
    status: PaymentStatus;
    metadata: any;
    failureReason: string;
    completedAt: Date;
    failedAt: Date;
    description: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
