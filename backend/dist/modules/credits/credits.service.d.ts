import { Repository } from 'typeorm';
import { Credit } from './entities/credit.entity';
import { Company } from '../companies/entities/company.entity';
export declare class CreditsService {
    private creditRepository;
    private companyRepository;
    constructor(creditRepository: Repository<Credit>, companyRepository: Repository<Company>);
    getBalance(companyId: string): Promise<{
        currentBalance: number;
        deliveryFeePerOrder: number;
        estimatedDeliveries: number;
        last30Days: any[];
    }>;
    getTransactions(companyId: string, limit?: number): Promise<Credit[]>;
    addCredit(companyId: string, amount: number, paymentMethod: string, paymentId: string, createdBy: string, description?: string): Promise<Credit>;
    addBonus(companyId: string, amount: number, createdBy: string, description: string): Promise<Credit>;
}
