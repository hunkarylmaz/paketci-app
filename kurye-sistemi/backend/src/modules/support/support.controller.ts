import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageSenderType } from './entities/support-message.entity';

@ApiTags('Support')
@ApiBearerAuth()
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // Kurye: Yeni ticket oluştur
  @Post('tickets')
  @ApiOperation({ summary: 'Yeni destek talebi oluştur (Kurye)' })
  async createTicket(@Body() dto: CreateTicketDto, @Request() req) {
    // TODO: Get dealerId, dealerName, courierName from user context
    const dealerId = req.user.dealerId;
    const dealerName = req.user.dealerName || 'Aydınlar Dağıtım';
    const courierName = req.user.name || 'Ahmet Yılmaz';
    
    return this.supportService.createTicket(
      req.user.id,
      dealerId,
      dealerName,
      courierName,
      dto,
    );
  }

  // Kurye: Ticket'larımı görüntüle
  @Get('tickets/my')
  @ApiOperation({ summary: 'Kuryenin ticketlarını getir' })
  async getMyTickets(@Request() req) {
    return this.supportService.getTicketsByCourier(req.user.id);
  }

  // Kurye: Ticket detayı
  @Get('tickets/:id')
  @ApiOperation({ summary: 'Ticket detayını getir' })
  async getTicket(@Param('id') id: string, @Request() req) {
    return this.supportService.getTicketById(id, req.user.id, req.user.role);
  }

  // Kurye: Mesaj gönder
  @Post('tickets/:id/messages')
  @ApiOperation({ summary: 'Ticket\'a mesaj gönder (Kurye)' })
  async sendMessage(
    @Param('id') ticketId: string,
    @Body() dto: CreateMessageDto,
    @Request() req,
  ) {
    return this.supportService.sendMessage(
      ticketId,
      req.user.id,
      MessageSenderType.COURIER,
      dto,
    );
  }

  // Kurye: Okunmamış sayısı
  @Get('tickets/unread/count')
  @ApiOperation({ summary: 'Okunmamış ticket sayısı' })
  async getUnreadCount(@Request() req) {
    const count = await this.supportService.getUnreadCountByCourier(req.user.id);
    return { count };
  }

  // Bayi: Ticket'ları görüntüle
  @Get('dealer/tickets')
  @ApiOperation({ summary: 'Bayiye gelen ticketları getir' })
  @ApiQuery({ name: 'status', required: false })
  async getDealerTickets(@Request() req, @Query('status') status?: string) {
    return this.supportService.getTicketsByDealer(req.user.dealerId, status as any);
  }

  // Bayi: Ticket detayı
  @Get('dealer/tickets/:id')
  @ApiOperation({ summary: 'Bayi için ticket detayı' })
  async getDealerTicket(@Param('id') id: string, @Request() req) {
    return this.supportService.getTicketById(id, req.user.dealerId, 'dealer');
  }

  // Bayi: Mesaj gönder
  @Post('dealer/tickets/:id/messages')
  @ApiOperation({ summary: 'Ticket\'a mesaj gönder (Bayi)' })
  async sendDealerMessage(
    @Param('id') ticketId: string,
    @Body() dto: CreateMessageDto,
    @Request() req,
  ) {
    return this.supportService.sendMessage(
      ticketId,
      req.user.id,
      MessageSenderType.DEALER,
      dto,
    );
  }

  // Bayi: Ticket güncelle (durum, atama vs.)
  @Patch('dealer/tickets/:id')
  @ApiOperation({ summary: 'Ticket güncelle (Bayi)' })
  async updateTicket(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
    @Request() req,
  ) {
    return this.supportService.updateTicket(id, req.user.dealerId, dto);
  }

  // Bayi: Okunmamış sayısı
  @Get('dealer/tickets/unread/count')
  @ApiOperation({ summary: 'Bayi için okunmamış ticket sayısı' })
  async getDealerUnreadCount(@Request() req) {
    const count = await this.supportService.getUnreadCountByDealer(req.user.dealerId);
    return { count };
  }

  // Bayi: Ticket'ı okundu olarak işaretle
  @Post('dealer/tickets/:id/read')
  @ApiOperation({ summary: 'Ticket\'ı okundu olarak işaretle' })
  async markAsRead(@Param('id') id: string, @Request() req) {
    await this.supportService.markAsRead(id, 'dealer');
    return { success: true };
  }

  // Real-time için son ticket'ları getir (polling)
  @Get('dealer/tickets/recent')
  @ApiOperation({ summary: 'Son ticketları getir (polling için)' })
  async getRecentTickets(@Request() req, @Query('after') after?: string) {
    const afterDate = after ? new Date(after) : new Date(Date.now() - 60000); // default: son 1 dakika
    return this.supportService.getRecentTickets(req.user.dealerId, afterDate);
  }
}
