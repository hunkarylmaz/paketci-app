import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Delivery } from '../../deliveries/entities/delivery.entity';

export enum ReceiptTemplate {
  STANDARD = 'standard',
  COMPACT = 'compact',
  DETAILED = 'detailed',
  RESTAURANT = 'restaurant',
}

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  receiptNumber: string;

  @ManyToOne(() => Company, company => company.receipts)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  companyId: string;

  @ManyToOne(() => Delivery, delivery => delivery.receipts)
  @JoinColumn({ name: 'deliveryId' })
  delivery: Delivery;

  @Column()
  deliveryId: string;

  // Bayi Bilgileri
  @Column()
  dealerName: string;

  @Column({ nullable: true })
  dealerLogo: string;

  @Column({ nullable: true })
  dealerAddress: string;

  @Column({ nullable: true })
  dealerPhone: string;

  @Column({ nullable: true })
  dealerTaxNumber: string;

  // Müşteri Bilgileri
  @Column()
  customerName: string;

  @Column({ nullable: true })
  customerPhone: string;

  @Column()
  deliveryAddress: string;

  // Sipariş Bilgileri
  @Column({ type: 'json' })
  items: ReceiptItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // Ödeme Bilgileri
  @Column()
  paymentType: string; // cash, credit_card, meal_card, online

  @Column({ nullable: true })
  paymentTypeLabel: string; // Nakit, Kredi Kartı, Yemek Kartı, Online Ödeme

  // Sipariş Kanalı
  @Column()
  orderChannel: string; // web, mobile, phone, getir, yemeksepeti, trendyol

  @Column({ nullable: true })
  orderChannelLabel: string;

  // Fiş Ayarları
  @Column({ type: 'enum', enum: ReceiptTemplate, default: ReceiptTemplate.STANDARD })
  template: ReceiptTemplate;

  @Column({ type: 'simple-json', nullable: true })
  customSettings: ReceiptCustomSettings;

  // Tarihler
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  printedAt: Date;
}

// Receipt Item Interface
export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  category?: string;
}

// Receipt Custom Settings Interface
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
  paperWidth?: 58 | 80; // 58mm veya 80mm termal yazıcı
}
