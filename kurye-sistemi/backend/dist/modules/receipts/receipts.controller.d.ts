import { Response } from 'express';
import { ReceiptsService } from './receipts.service';
import { ReceiptTemplate, ReceiptCustomSettings } from './entities/receipt.entity';
export declare class ReceiptsController {
    private readonly receiptsService;
    constructor(receiptsService: ReceiptsService);
    create(deliveryId: string, companyId: string, settings?: ReceiptCustomSettings): Promise<import("./entities/receipt.entity").Receipt>;
    findAll(companyId: string): Promise<import("./entities/receipt.entity").Receipt[]>;
    findOne(id: string, companyId: string): Promise<import("./entities/receipt.entity").Receipt>;
    getHtml(id: string, companyId: string, res: Response): Promise<void>;
    printReceipt(id: string, companyId: string, res: Response): Promise<void>;
    updateTemplate(id: string, companyId: string, template: ReceiptTemplate, settings: ReceiptCustomSettings): Promise<import("./entities/receipt.entity").Receipt>;
}
