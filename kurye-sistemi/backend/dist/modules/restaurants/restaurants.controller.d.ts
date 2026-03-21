import { RestaurantsService, CreateRestaurantDto, UpdateRestaurantDto } from './restaurants.service';
import { RestaurantSalesStatus } from './entities/restaurant.entity';
interface RequestWithUser extends Request {
    user: any;
}
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    findAll(companyId?: string, dealerId?: string, regionId?: string, territoryId?: string, salesStatus?: RestaurantSalesStatus, isActive?: string, city?: string, req?: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant[]>;
    getStats(companyId?: string, regionId?: string, dealerId?: string, req?: RequestWithUser): Promise<{
        total: number;
        byStatus: Record<RestaurantSalesStatus, number>;
        byRegion: Record<string, number>;
        byDealer: Record<string, number>;
    }>;
    findById(id: string, req: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant>;
    create(createDto: CreateRestaurantDto, req: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant>;
    update(id: string, updateDto: UpdateRestaurantDto, req: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant>;
    remove(id: string, req: RequestWithUser): Promise<{
        message: string;
    }>;
    recordVisit(id: string, req: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant>;
    updateSalesStatus(id: string, status: RestaurantSalesStatus, req: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant>;
    assignRestaurant(id: string, assignments: {
        dealerId?: string;
        dealerName?: string;
        regionId?: string;
        regionName?: string;
        fieldSalesId?: string;
        fieldSalesName?: string;
    }, req: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant>;
    getByDealer(dealerId: string, req: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant[] | {
        error: string;
    }>;
    getByRegion(regionId: string, req: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant[] | {
        error: string;
    }>;
    getByTerritory(territoryId: string, req: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant[]>;
    getLeads(req: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant[]>;
    getActive(req: RequestWithUser): Promise<import("./entities/restaurant.entity").Restaurant[]>;
}
export {};
