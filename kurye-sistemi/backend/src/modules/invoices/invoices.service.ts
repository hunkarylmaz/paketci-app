import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Invoice, InvoiceStatus } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const existingInvoice = await this.invoiceRepository.findOne({
      where: { invoiceNumber: createInvoiceDto.invoiceNumber },
    });
    if (existingInvoice) {
      throw new ConflictException('Bu fatura numarası zaten mevcut');
    }

    const invoice = this.invoiceRepository.create(createInvoiceDto);
    return this.invoiceRepository.save(invoice);
  }

  async findAll(filters?: {
    status?: InvoiceStatus;
    restaurantId?: string;
    dealerId?: string;
  }): Promise<Invoice[]> {
    const query = this.invoiceRepository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.restaurant', 'restaurant')
      .leftJoinAndSelect('invoice.dealer', 'dealer');

    if (filters?.status) {
      query.andWhere('invoice.status = :status', { status: filters.status });
    }
    if (filters?.restaurantId) {
      query.andWhere('invoice.restaurantId = :restaurantId', { restaurantId: filters.restaurantId });
    }
    if (filters?.dealerId) {
      query.andWhere('invoice.dealerId = :dealerId', { dealerId: filters.dealerId });
    }

    return query.orderBy('invoice.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['restaurant', 'dealer'],
    });

    if (!invoice) {
      throw new NotFoundException('Fatura bulunamadı');
    }

    return invoice;
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
    return this.invoiceRepository.findOne({
      where: { invoiceNumber },
      relations: ['restaurant', 'dealer'],
    });
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    if (updateInvoiceDto.invoiceNumber && updateInvoiceDto.invoiceNumber !== invoice.invoiceNumber) {
      const existingInvoice = await this.findByInvoiceNumber(updateInvoiceDto.invoiceNumber);
      if (existingInvoice) {
        throw new ConflictException('Bu fatura numarası zaten mevcut');
      }
    }

    Object.assign(invoice, updateInvoiceDto);
    return this.invoiceRepository.save(invoice);
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.remove(invoice);
  }

  async getByRestaurant(restaurantId: string, status?: InvoiceStatus): Promise<Invoice[]> {
    const query = this.invoiceRepository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.restaurant', 'restaurant')
      .leftJoinAndSelect('invoice.dealer', 'dealer')
      .where('invoice.restaurantId = :restaurantId', { restaurantId });

    if (status) {
      query.andWhere('invoice.status = :status', { status });
    }

    return query.orderBy('invoice.createdAt', 'DESC').getMany();
  }

  async getOverdue(): Promise<Invoice[]> {
    const today = new Date();
    return this.invoiceRepository.find({
      where: {
        dueDate: LessThan(today),
        status: InvoiceStatus.SENT,
      },
      relations: ['restaurant', 'dealer'],
      order: { dueDate: 'ASC' },
    });
  }

  async markAsPaid(id: string, paidDate?: Date): Promise<Invoice> {
    const invoice = await this.findOne(id);
    invoice.status = InvoiceStatus.PAID;
    invoice.paidDate = paidDate || new Date();
    return this.invoiceRepository.save(invoice);
  }

  async updateOverdueStatus(): Promise<number> {
    const today = new Date();
    const result = await this.invoiceRepository
      .createQueryBuilder()
      .update(Invoice)
      .set({ status: InvoiceStatus.OVERDUE })
      .where('dueDate < :today', { today })
      .andWhere('status = :status', { status: InvoiceStatus.SENT })
      .execute();

    return result.affected || 0;
  }
}
