import { Repository } from 'typeorm';
import { Delivery } from '../deliveries/entities/delivery.entity';
import { Courier } from '../couriers/entities/courier.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
interface ReportFilters {
    startDate?: Date;
    endDate?: Date;
    companyId?: string;
    restaurantId?: string;
    courierId?: string;
    status?: string;
}
export declare class ReportsService {
    private deliveryRepo;
    private courierRepo;
    private restaurantRepo;
    private userRepo;
    private companyRepo;
    constructor(deliveryRepo: Repository<Delivery>, courierRepo: Repository<Courier>, restaurantRepo: Repository<Restaurant>, userRepo: Repository<User>, companyRepo: Repository<Company>);
    generateDealerSummaryReport(companyId: string, filters: ReportFilters): Promise<Buffer>;
    private generateDealerDashboardData;
    private generateDailyPerformanceData;
    private generateCourierPerformanceData;
    private generateRestaurantPerformanceData;
    private generatePlatformDistributionData;
    private generateFinancialSummaryData;
    generateRestaurantDetailedReport(restaurantId: string, filters: ReportFilters): Promise<Buffer>;
    private generateRestaurantSummaryData;
    private generateDetailedOrdersData;
    private generateHourlyDistributionData;
    private generateCourierBreakdownData;
    private groupByDate;
    private groupByCourier;
    private calculateAvgDeliveryTime;
    private calculateAvgPreparationTime;
    private calculateDeliveryDuration;
    private translateStatus;
    getDashboardStats(companyId: string): Promise<{
        todayDeliveries: number;
        totalCouriers: number;
        activeCouriers: number;
        totalRestaurants: number;
    }>;
    getCourierPerformance(companyId: string, startDate: Date, endDate: Date): Promise<Courier[]>;
    getRestaurantPerformance(companyId: string, startDate: Date, endDate: Date): Promise<Restaurant[]>;
    getFinancialReport(companyId: string, startDate: Date, endDate: Date): Promise<{
        totalDeliveries: number;
        totalRevenue: number;
        totalTips: number;
        totalIncome: number;
    }>;
}
export {};
