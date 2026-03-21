"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const delivery_entity_1 = require("./entities/delivery.entity");
const company_entity_1 = require("../companies/entities/company.entity");
const credit_entity_1 = require("../credits/entities/credit.entity");
const tracking_number_util_1 = require("../../utils/tracking-number.util");
let DeliveriesService = class DeliveriesService {
    constructor(deliveryRepository, companyRepository, creditRepository, dataSource) {
        this.deliveryRepository = deliveryRepository;
        this.companyRepository = companyRepository;
        this.creditRepository = creditRepository;
        this.dataSource = dataSource;
    }
    async create(companyId, createDto) {
        const company = await this.companyRepository.findOne({ where: { id: companyId } });
        if (!company) {
            throw new common_1.NotFoundException('Şirket bulunamadı');
        }
        if (company.creditBalance < company.deliveryFeePerOrder) {
            throw new common_1.BadRequestException(`Yetersiz kontör bakiyesi. Mevcut: ${company.creditBalance} TL, Gerekli: ${company.deliveryFeePerOrder} TL`);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const delivery = this.deliveryRepository.create({
                ...createDto,
                companyId,
                trackingNumber: (0, tracking_number_util_1.generateTrackingNumber)(),
                creditDeducted: company.deliveryFeePerOrder,
                status: delivery_entity_1.DeliveryStatus.PENDING,
                paymentType: createDto.paymentType,
            });
            await queryRunner.manager.save(delivery);
            const newBalance = parseFloat(company.creditBalance.toString()) - parseFloat(company.deliveryFeePerOrder.toString());
            await queryRunner.manager.update(company_entity_1.Company, companyId, {
                creditBalance: newBalance,
            });
            const creditTransaction = this.creditRepository.create({
                companyId,
                type: credit_entity_1.CreditTransactionType.DELIVERY_DEDUCTION,
                amount: -company.deliveryFeePerOrder,
                balanceAfter: newBalance,
                deliveryId: delivery.id,
                description: `Teslimat #${delivery.trackingNumber} için kontör kullanımı`,
                createdBy: createDto.createdBy || 'system',
            });
            await queryRunner.manager.save(creditTransaction);
            await queryRunner.commitTransaction();
            return delivery;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(companyId, filters) {
        const query = this.deliveryRepository.createQueryBuilder('delivery')
            .leftJoinAndSelect('delivery.restaurant', 'restaurant')
            .leftJoinAndSelect('delivery.courier', 'courier')
            .where('delivery.companyId = :companyId', { companyId });
        if (filters?.status) {
            query.andWhere('delivery.status = :status', { status: filters.status });
        }
        if (filters?.restaurantId) {
            query.andWhere('delivery.restaurantId = :restaurantId', { restaurantId: filters.restaurantId });
        }
        if (filters?.courierId) {
            query.andWhere('delivery.courierId = :courierId', { courierId: filters.courierId });
        }
        if (filters?.startDate && filters?.endDate) {
            query.andWhere('delivery.createdAt BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate,
            });
        }
        query.orderBy('delivery.createdAt', 'DESC');
        return query.getMany();
    }
    async findOne(companyId, id) {
        const delivery = await this.deliveryRepository.findOne({
            where: { id, companyId },
            relations: ['restaurant', 'courier', 'courier.user'],
        });
        if (!delivery) {
            throw new common_1.NotFoundException('Teslimat bulunamadı');
        }
        return delivery;
    }
    async findByTrackingNumber(trackingNumber) {
        const delivery = await this.deliveryRepository.findOne({
            where: { trackingNumber },
            relations: ['restaurant', 'courier'],
        });
        if (!delivery) {
            throw new common_1.NotFoundException('Teslimat bulunamadı');
        }
        return delivery;
    }
    async updateStatus(companyId, id, updateDto, userId) {
        const delivery = await this.findOne(companyId, id);
        const statusTimeMap = {
            [delivery_entity_1.DeliveryStatus.ASSIGNED]: 'assignedAt',
            [delivery_entity_1.DeliveryStatus.ACCEPTED]: 'acceptedAt',
            [delivery_entity_1.DeliveryStatus.PICKED_UP]: 'pickedUpAt',
            [delivery_entity_1.DeliveryStatus.DELIVERED]: 'deliveredAt',
        };
        const updateData = {
            status: updateDto.status,
            ...(statusTimeMap[updateDto.status] && { [statusTimeMap[updateDto.status]]: new Date() }),
            ...(updateDto.courierId && { courierId: updateDto.courierId }),
            ...(updateDto.deliveryPhoto && { deliveryPhoto: updateDto.deliveryPhoto }),
            ...(updateDto.customerSignature && { customerSignature: updateDto.customerSignature }),
            ...(updateDto.cancellationReason && { cancellationReason: updateDto.cancellationReason }),
            ...(updateDto.failureReason && { failureReason: updateDto.failureReason }),
        };
        await this.deliveryRepository.update(id, updateData);
        if (updateDto.status === delivery_entity_1.DeliveryStatus.CANCELLED &&
            delivery.status === delivery_entity_1.DeliveryStatus.PENDING) {
            await this.refundCredit(companyId, delivery);
        }
        return this.findOne(companyId, id);
    }
    async refundCredit(companyId, delivery) {
        const company = await this.companyRepository.findOne({ where: { id: companyId } });
        const newBalance = parseFloat(company.creditBalance.toString()) + parseFloat(delivery.creditDeducted.toString());
        await this.companyRepository.update(companyId, {
            creditBalance: newBalance,
        });
        const creditTransaction = this.creditRepository.create({
            companyId,
            type: credit_entity_1.CreditTransactionType.REFUND,
            amount: delivery.creditDeducted,
            balanceAfter: newBalance,
            deliveryId: delivery.id,
            description: `İptal edilen teslimat #${delivery.trackingNumber} için kontör iadesi`,
            createdBy: 'system',
        });
        await this.creditRepository.save(creditTransaction);
    }
    async createFromPlatform(companyId, platformData) {
        const company = await this.companyRepository.findOne({ where: { id: companyId } });
        if (!company) {
            throw new common_1.NotFoundException('Şirket bulunamadı');
        }
        const delivery = this.deliveryRepository.create({
            ...platformData,
            companyId,
            trackingNumber: (0, tracking_number_util_1.generateTrackingNumber)(),
            creditDeducted: company.deliveryFeePerOrder,
            status: delivery_entity_1.DeliveryStatus.PENDING,
            paymentType: platformData.paymentType,
            orderSource: platformData.platform.toLowerCase(),
        });
        return this.deliveryRepository.save(delivery);
    }
    async autoAssignCourier(deliveryId) {
        const delivery = await this.deliveryRepository.findOne({
            where: { id: deliveryId },
            relations: ['restaurant'],
        });
        if (!delivery) {
            throw new common_1.NotFoundException('Teslimat bulunamadı');
        }
        delivery.status = delivery_entity_1.DeliveryStatus.ASSIGNED;
        delivery.assignedAt = new Date();
        return this.deliveryRepository.save(delivery);
    }
    async cancelOrder(companyId, deliveryId, reason) {
        const delivery = await this.findOne(companyId, deliveryId);
        if (delivery.status === delivery_entity_1.DeliveryStatus.DELIVERED) {
            throw new common_1.BadRequestException('Teslim edilmiş sipariş iptal edilemez');
        }
        if (delivery.status === delivery_entity_1.DeliveryStatus.CANCELLED) {
            throw new common_1.BadRequestException('Sipariş zaten iptal edilmiş');
        }
        delivery.status = delivery_entity_1.DeliveryStatus.CANCELLED;
        delivery.cancelledAt = new Date();
        delivery.cancellationReason = reason;
        await this.deliveryRepository.save(delivery);
        if ([delivery_entity_1.DeliveryStatus.PENDING, delivery_entity_1.DeliveryStatus.ASSIGNED].includes(delivery.status)) {
            await this.refundCredit(companyId, delivery);
        }
        return delivery;
    }
    async getStats(companyId, period) {
        const query = this.deliveryRepository.createQueryBuilder('delivery')
            .where('delivery.companyId = :companyId', { companyId });
        if (period) {
            query.andWhere('delivery.createdAt BETWEEN :start AND :end', period);
        }
        const [total, pending, inProgress, delivered, cancelled, totalRevenue,] = await Promise.all([
            query.getCount(),
            this.deliveryRepository.count({
                where: { companyId, status: delivery_entity_1.DeliveryStatus.PENDING }
            }),
            this.deliveryRepository.count({
                where: [
                    { companyId, status: delivery_entity_1.DeliveryStatus.ASSIGNED },
                    { companyId, status: delivery_entity_1.DeliveryStatus.ACCEPTED },
                    { companyId, status: delivery_entity_1.DeliveryStatus.PICKED_UP },
                    { companyId, status: delivery_entity_1.DeliveryStatus.IN_TRANSIT },
                ],
            }),
            this.deliveryRepository.count({
                where: { companyId, status: delivery_entity_1.DeliveryStatus.DELIVERED }
            }),
            this.deliveryRepository.count({
                where: { companyId, status: delivery_entity_1.DeliveryStatus.CANCELLED }
            }),
            this.deliveryRepository
                .createQueryBuilder('delivery')
                .select('SUM(delivery.orderAmount)', 'total')
                .where('delivery.companyId = :companyId', { companyId })
                .andWhere('delivery.status = :status', { status: delivery_entity_1.DeliveryStatus.DELIVERED })
                .getRawOne(),
        ]);
        return {
            total,
            pending,
            inProgress,
            delivered,
            cancelled,
            totalRevenue: totalRevenue?.total || 0,
        };
    }
};
exports.DeliveriesService = DeliveriesService;
exports.DeliveriesService = DeliveriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(delivery_entity_1.Delivery)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(2, (0, typeorm_1.InjectRepository)(credit_entity_1.Credit)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], DeliveriesService);
//# sourceMappingURL=deliveries.service.js.map