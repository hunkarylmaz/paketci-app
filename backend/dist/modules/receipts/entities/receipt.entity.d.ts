import { Company } from '../../companies/entities/company.entity';
import { Delivery } from '../../deliveries/entities/delivery.entity';
export declare enum ReceiptTemplate {
    STANDARD = "standard",
    COMPACT = "compact",
    DETAILED = "detailed",
    RESTAURANT = "restaurant"
}
export declare class Receipt {
    id: string;
    receiptNumber: string;
    company: Company;
    companyId: string;
    delivery: Delivery;
    deliveryId: string;
    dealerName: string;
    dealerLogo: string;
    dealerAddress: string;
    dealerPhone: string;
    dealerTaxNumber: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    items: ReceiptItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    paymentType: string;
    paymentTypeLabel: string;
    orderChannel: string;
    orderChannelLabel: string;
    template: ReceiptTemplate;
    customSettings: ReceiptCustomSettings;
    createdAt: Date;
    printedAt: Date;
}
export interface ReceiptItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    description?: string;
    category?: string;
}
export interface ReceiptCustomSettings {
    showLogo?: boolean;
    showDealerInfo?: boolean;
    showCustomerInfo?: boolean;
    showOrderChannel?: boolean;
    showPaymentType?: boolean;
    showTaxInfo?: boolean;
    showBarcode?: boolean;
    showQrCode?: boolean;
    footerText?: string;
    headerText?: string;
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    paperWidth?: 58 | 80;
}
