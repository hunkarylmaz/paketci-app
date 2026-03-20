import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { TicketCategory, TicketPriority } from '../entities/support-ticket.entity';

export class CreateTicketDto {
  @ApiProperty({ description: 'Ticket subject', example: 'Sipariş teslimat sorunu' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  subject: string;

  @ApiProperty({ description: 'Ticket description', example: 'Siparişi teslim edemedim, müşteri kapıyı açmadı' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ enum: TicketCategory, example: TicketCategory.ORDER_ISSUE })
  @IsOptional()
  @IsEnum(TicketCategory)
  category?: TicketCategory;

  @ApiPropertyOptional({ enum: TicketPriority, example: TicketPriority.HIGH })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({ description: 'Order number if related to an order', example: 'ORD-2024-001' })
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @ApiPropertyOptional({ description: 'Order ID if related to an order' })
  @IsOptional()
  @IsUUID()
  orderId?: string;
}
