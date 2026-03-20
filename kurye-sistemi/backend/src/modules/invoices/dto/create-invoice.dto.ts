import { IsString, IsOptional, IsEnum, IsDecimal, IsDate, IsArray, IsNumber } from 'class-validator';
import { InvoiceStatus } from '../entities/invoice.entity';

export class CreateInvoiceDto {
  @IsString()
  invoiceNumber: string;

  @IsString()
  restaurantId: string;

  @IsString()
  @IsOptional()
  dealerId?: string;

  @IsDecimal()
  amount: number;

  @IsDecimal()
  @IsOptional()
  taxAmount?: number;

  @IsDecimal()
  totalAmount: number;

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsDate()
  dueDate: Date;

  @IsArray()
  @IsOptional()
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;

  @IsString()
  @IsOptional()
  notes?: string;
}
