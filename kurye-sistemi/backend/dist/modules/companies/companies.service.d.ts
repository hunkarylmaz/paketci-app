import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
export declare class CompaniesService {
    private companyRepository;
    constructor(companyRepository: Repository<Company>);
    findAll(): Promise<Company[]>;
    findOne(id: string): Promise<Company>;
    create(data: Partial<Company>): Promise<Company>;
    update(id: string, data: Partial<Company>): Promise<Company>;
    private generateCompanyCode;
}
