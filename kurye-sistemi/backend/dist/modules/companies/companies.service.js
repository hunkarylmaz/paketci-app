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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("./entities/company.entity");
const company_status_enum_1 = require("./enums/company-status.enum");
let CompaniesService = class CompaniesService {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async findAll() {
        return this.companyRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        return this.companyRepository.findOne({
            where: { id },
            relations: ['users', 'restaurants', 'couriers'],
        });
    }
    async create(data) {
        const code = await this.generateCompanyCode();
        const company = this.companyRepository.create({
            ...data,
            code,
            status: company_status_enum_1.CompanyStatus.PENDING_PAYMENT,
            creditBalance: 0,
            deliveryFeePerOrder: 2.5,
        });
        return this.companyRepository.save(company);
    }
    async update(id, data) {
        await this.companyRepository.update(id, data);
        return this.findOne(id);
    }
    async generateCompanyCode() {
        const count = await this.companyRepository.count();
        const nextNumber = count + 1;
        return `KRY${String(nextNumber).padStart(3, '0')}`;
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map