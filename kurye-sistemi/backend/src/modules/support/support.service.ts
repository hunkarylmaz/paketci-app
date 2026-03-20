import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { SupportTicket, TicketStatus, TicketPriority } from './entities/support-ticket.entity';
import { SupportMessage, MessageSenderType } from './entities/support-message.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private ticketRepository: Repository<SupportTicket>,
    @InjectRepository(SupportMessage)
    private messageRepository: Repository<SupportMessage>,
  ) {}

  // Ticket oluştur (Kurye tarafından)
  async createTicket(userId: string, dealerId: string, dealerName: string, courierName: string, dto: CreateTicketDto): Promise<SupportTicket> {
    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;
    
    const ticket = this.ticketRepository.create({
      ticketNumber,
      createdBy: userId,
      subject: dto.subject,
      description: dto.description,
      category: dto.category || 'other',
      priority: dto.priority || 'medium',
      status: TicketStatus.OPEN,
      dealerId,
      dealerName,
      courierName,
      orderNumber: dto.orderNumber,
      orderId: dto.orderId,
      isUnreadByDealer: true,
      isUnreadByCourier: false,
      messageCount: 1,
      lastMessageAt: new Date(),
    });

    const saved = await this.ticketRepository.save(ticket);

    // İlk mesajı otomatik ekle (açıklama)
    const message = this.messageRepository.create({
      ticketId: saved.id,
      senderId: userId,
      senderType: MessageSenderType.COURIER,
      content: dto.description,
    });

    await this.messageRepository.save(message);

    return saved;
  }

  // Bayiye ait ticket'ları getir
  async getTicketsByDealer(dealerId: string, status?: TicketStatus): Promise<SupportTicket[]> {
    const where: any = { dealerId };
    
    if (status) {
      where.status = status;
    }

    return this.ticketRepository.find({
      where,
      order: { lastMessageAt: 'DESC' },
      relations: ['creator', 'assignee'],
    });
  }

  // Kuryeye ait ticket'ları getir
  async getTicketsByCourier(userId: string): Promise<SupportTicket[]> {
    return this.ticketRepository.find({
      where: { createdBy: userId },
      order: { lastMessageAt: 'DESC' },
      relations: ['assignee'],
    });
  }

  // Ticket detayını getir
  async getTicketById(ticketId: string, userId: string, userRole: string): Promise<SupportTicket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['creator', 'assignee', 'messages', 'messages.sender'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket bulunamadı');
    }

    // Yetki kontrolü
    if (userRole === 'courier' && ticket.createdBy !== userId) {
      throw new ForbiddenException('Bu ticket\'ı görüntüleme yetkiniz yok');
    }

    if (userRole === 'dealer' && ticket.dealerId !== userId) {
      throw new ForbiddenException('Bu ticket\'ı görüntüleme yetkiniz yok');
    }

    return ticket;
  }

  // Mesaj gönder
  async sendMessage(ticketId: string, senderId: string, senderType: MessageSenderType, dto: CreateMessageDto): Promise<SupportMessage> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    
    if (!ticket) {
      throw new NotFoundException('Ticket bulunamadı');
    }

    if (ticket.status === TicketStatus.CLOSED) {
      throw new ForbiddenException('Kapalı ticket\'a mesaj gönderilemez');
    }

    const message = this.messageRepository.create({
      ticketId,
      senderId,
      senderType,
      content: dto.content,
      attachments: dto.attachments || [],
    });

    await this.messageRepository.save(message);

    // Ticket'ı güncelle
    ticket.messageCount += 1;
    ticket.lastMessageAt = new Date();
    
    if (senderType === MessageSenderType.COURIER) {
      ticket.isUnreadByDealer = true;
      ticket.isUnreadByCourier = false;
    } else if (senderType === MessageSenderType.DEALER) {
      ticket.isUnreadByDealer = false;
      ticket.isUnreadByCourier = true;
    }

    // Ticket durumunu güncelle
    if (ticket.status === TicketStatus.OPEN) {
      ticket.status = TicketStatus.IN_PROGRESS;
    }

    await this.ticketRepository.save(ticket);

    return message;
  }

  // Ticket güncelle (Bayi tarafından)
  async updateTicket(ticketId: string, dealerId: string, dto: UpdateTicketDto): Promise<SupportTicket> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });

    if (!ticket) {
      throw new NotFoundException('Ticket bulunamadı');
    }

    if (ticket.dealerId !== dealerId) {
      throw new ForbiddenException('Bu ticket\'ı güncelleme yetkiniz yok');
    }

    Object.assign(ticket, dto);

    if (dto.status === TicketStatus.RESOLVED) {
      ticket.resolvedAt = new Date();
    } else if (dto.status === TicketStatus.CLOSED) {
      ticket.closedAt = new Date();
    }

    return this.ticketRepository.save(ticket);
  }

  // Okunmamış mesaj sayısı (Bayi için)
  async getUnreadCountByDealer(dealerId: string): Promise<number> {
    return this.ticketRepository.count({
      where: { dealerId, isUnreadByDealer: true },
    });
  }

  // Okunmamış mesaj sayısı (Kurye için)
  async getUnreadCountByCourier(userId: string): Promise<number> {
    return this.ticketRepository.count({
      where: { createdBy: userId, isUnreadByCourier: true },
    });
  }

  // Ticket'ı okundu olarak işaretle
  async markAsRead(ticketId: string, userType: 'courier' | 'dealer'): Promise<void> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    
    if (!ticket) return;

    if (userType === 'courier') {
      ticket.isUnreadByCourier = false;
    } else {
      ticket.isUnreadByDealer = false;
    }

    await this.ticketRepository.save(ticket);
  }

  // Son ticket'ları getir (real-time için)
  async getRecentTickets(dealerId: string, after: Date): Promise<SupportTicket[]> {
    return this.ticketRepository.find({
      where: {
        dealerId,
        createdAt: MoreThan(after),
      },
      order: { createdAt: 'DESC' },
      relations: ['creator'],
    });
  }
}
