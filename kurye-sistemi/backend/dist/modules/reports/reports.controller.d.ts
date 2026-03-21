import { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboardStats(companyId: string): Promise<{
        todayDeliveries: number;
        totalCouriers: number;
        activeCouriers: number;
        totalRestaurants: number;
    }>;
    getDealerSummary(companyId: string, startDate: string, endDate: string): Promise<{
        todayDeliveries: number;
        totalCouriers: number;
        activeCouriers: number;
        totalRestaurants: number;
    }>;
    exportDealerSummary(companyId: string, startDate: string, endDate: string, res: Response): Promise<void>;
    getRestaurantDetailed(restaurantId: string, startDate: string, endDate: string): Promise<import("../restaurants/entities/restaurant.entity").Restaurant[]>;
    exportRestaurantDetailed(restaurantId: string, startDate: string, endDate: string, res: Response): Promise<void>;
    getCourierPerformance(companyId: string, startDate: string, endDate: string): Promise<import("../couriers/entities/courier.entity").Courier[]>;
    getFinancialReport(companyId: string, startDate: string, endDate: string): Promise<{
        totalDeliveries: number;
        totalRevenue: number;
        totalTips: number;
        totalIncome: number;
    }>;
}
