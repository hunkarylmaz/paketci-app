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
exports.CreditsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const credit_entity_1 = require("./entities/credit.entity");
const company_entity_1 = require("../companies/entities/company.entity");
let CreditsService = class CreditsService {
    constructor(creditRepository, companyRepository) {
        this.creditRepository = creditRepository;
        this.companyRepository = companyRepository;
    }
    async getBalance(companyId) {
        const company = await this.companyRepository.findOne({
            where: { id: companyId },
            select: ['id', 'name', 'creditBalance', 'deliveryFeePerOrder'],
        });
        if (!company) {
            throw new common_1.NotFoundException('Şirket bulunamadı');
        }
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const stats = await this.creditRepository
            .createQueryBuilder('credit')
            .select('credit.type', 'type')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(credit.amount)', 'total')
            .where('credit.companyId = :companyId', { companyId })
            .andWhere('credit.createdAt >= :date', { date: thirtyDaysAgo })
            .groupBy('credit.type')
            .getRawMany();
        return {
            currentBalance: company.creditBalance,
            deliveryFeePerOrder: company.deliveryFeePerOrder,
            estimatedDeliveries: Math.floor(company.creditBalance / company.deliveryFeePerOrder),
            last30Days: stats,
        };
    }
    async getTransactions(companyId, limit = 50) {
        return this.creditRepository.find({
            where: { companyId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async addCredit(companyId, amount, paymentMethod, paymentId, createdBy, description) {
        const company = await this.companyRepository.findOne({ where: { id: companyId } });
        if (!company) {
            throw new common_1.NotFoundException('Şirket bulunamadı');
        }
        const newBalance = parseFloat(company.creditBalance.toString()) + amount;
        await this.companyRepository.update(companyId, {
            creditBalance: newBalance,
        });
        const transaction = this.creditRepository.create({
            companyId,
            type: credit_entity_1.CreditTransactionType.PURCHASE,
            amount,
            balanceAfter: newBalance,
            paymentMethod,
            paymentId,
            description: description || `${amount} TL kontör yükleme`,
            createdBy,
        });
        return this.creditRepository.save(transaction);
    }
    async addBonus(companyId, amount, createdBy, description) {
        const company = await this.companyRepository.findOne({ where: { id: companyId } });
        if (!company) {
            throw new common_1.NotFoundException('Şirket bulunamadı');
        }
        const newBalance = parseFloat(company.creditBalance.toString()) + amount;
        await this.companyRepository.update(companyId, {
            creditBalance: newBalance,
        });
        const transaction = this.creditRepository.create({
            companyId,
            type: credit_entity_1.CreditTransactionType.BONUS,
            amount,
            balanceAfter: newBalance,
            description,
            createdBy,
        });
        return this.creditRepository.save(transaction);
    }
};
exports.CreditsService = CreditsService;
exports.CreditsService = CreditsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(credit_entity_1.Credit)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CreditsService);
//# sourceMappingURL=credits.service.js.map