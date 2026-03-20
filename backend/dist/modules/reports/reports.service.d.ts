export declare class ReportsService {
    getDashboardStats(companyId: string): Promise<{
        message: string;
    }>;
    getCourierPerformance(companyId: string, startDate: Date, endDate: Date): Promise<{
        message: string;
    }>;
    getRestaurantPerformance(companyId: string, startDate: Date, endDate: Date): Promise<{
        message: string;
    }>;
    getFinancialReport(companyId: string, startDate: Date, endDate: Date): Promise<{
        message: string;
    }>;
}
