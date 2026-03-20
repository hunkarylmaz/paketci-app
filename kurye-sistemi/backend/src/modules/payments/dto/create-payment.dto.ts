import { IsString, IsOptional, IsEnum, IsDecimal, IsDate, IsJSON } from 'class-validator';
import { PaymentType, PaymentStatus, PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsString()
  recipientId: string;

  @IsDecimal()
  amount: number;

  @IsString()
  period: string;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsDate()
  @IsOptional()
  paymentDate?: Date;

  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsOptional()
  details?: {
    bankName?: string;
    accountNumber?: string;
    iban?: string;
    transactionId?: string;
  };
}
