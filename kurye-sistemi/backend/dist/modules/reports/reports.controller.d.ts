import { Response } from 'express';
import { ReportsService } from './reports.service';
import { ExcelExportService } from '../../common/services/excel-export.service';
import { Repository } from 'typeorm';
import { Delivery } from '../deliveries/entities/delivery.entity';
export declare class ReportsController {
    private readonly reportsService;
    private readonly excelService;
    private deliveryRepository;
    constructor(reportsService: ReportsService, excelService: ExcelExportService, deliveryRepository: Repository<Delivery>);
    getDashboardStats(companyId: string): Promise<{
        message: string;
    }>;
    getDeliveryReport(companyId: string, startDate: string, endDate: string): Promise<Delivery[]>;
    exportDeliveries(companyId: string, startDate: string, endDate: string, res: Response): Promise<void>;
    getCourierPerformance(companyId: string, startDate: string, endDate: string): Promise<{
        message: string;
    }>;
    getRestaurantPerformance(companyId: string, startDate: string, endDate: string): Promise<{
        message: string;
    }>;
    getFinancialReport(companyId: string, startDate: string, endDate: string): Promise<{
        message: string;
    }>;
}
