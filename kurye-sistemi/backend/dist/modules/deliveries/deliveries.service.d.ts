import { Repository, DataSource } from 'typeorm';
import { Delivery } from './entities/delivery.entity';
import { Company } from '../companies/entities/company.entity';
import { Credit } from '../credits/entities/credit.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
export declare class DeliveriesService {
    private deliveryRepository;
    private companyRepository;
    private creditRepository;
    private dataSource;
    constructor(deliveryRepository: Repository<Delivery>, companyRepository: Repository<Company>, creditRepository: Repository<Credit>, dataSource: DataSource);
    create(companyId: string, createDto: CreateDeliveryDto): Promise<Delivery>;
    findAll(companyId: string, filters?: any): Promise<Delivery[]>;
    findOne(companyId: string, id: string): Promise<Delivery>;
    findByTrackingNumber(trackingNumber: string): Promise<Delivery>;
    updateStatus(companyId: string, id: string, updateDto: UpdateDeliveryStatusDto, userId: string): Promise<Delivery>;
    refundCredit(companyId: string, delivery: Delivery): Promise<void>;
    createFromPlatform(companyId: string, platformData: {
        platform: string;
        platformOrderId: string;
        restaurantId: string;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        orderAmount: number;
        paymentType: string;
        deliveryFee?: number;
    }): Promise<Delivery>;
    autoAssignCourier(deliveryId: string): Promise<Delivery>;
    cancelOrder(companyId: string, deliveryId: string, reason: string): Promise<Delivery>;
    getStats(companyId: string, period?: {
        start: Date;
        end: Date;
    }): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        delivered: number;
        cancelled: number;
        totalRevenue: any;
    }>;
}
