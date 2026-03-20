import { Repository } from 'typeorm';
import { Receipt, ReceiptTemplate, ReceiptCustomSettings } from './entities/receipt.entity';
import { Company } from '../companies/entities/company.entity';
import { Delivery } from '../deliveries/entities/delivery.entity';
export declare class ReceiptsService {
    private receiptRepository;
    private companyRepository;
    private deliveryRepository;
    constructor(receiptRepository: Repository<Receipt>, companyRepository: Repository<Company>, deliveryRepository: Repository<Delivery>);
    private generateReceiptNumber;
    create(deliveryId: string, companyId: string, customSettings?: ReceiptCustomSettings): Promise<Receipt>;
    findAll(companyId: string): Promise<Receipt[]>;
    findOne(id: string, companyId: string): Promise<Receipt>;
    updateTemplate(id: string, companyId: string, template: ReceiptTemplate, customSettings: ReceiptCustomSettings): Promise<Receipt>;
    markAsPrinted(id: string, companyId: string): Promise<void>;
    generateHtml(id: string, companyId: string): Promise<string>;
}
