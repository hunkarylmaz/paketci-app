import { UsersService, CreateUserDto, UpdateUserDto, AssignUserDto } from './users.service';
import { UserRole } from './enums/user-role.enum';
import { User } from './entities/user.entity';
interface RequestWithUser extends Request {
    user: User;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(role?: UserRole, companyId?: string, regionId?: string, status?: string, req?: RequestWithUser): Promise<User[]>;
    getRoles(): Promise<{
        role: UserRole;
        description: string;
        level: number;
        color: string;
    }[]>;
    findById(id: string): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<{
        message: string;
    }>;
    assignUser(id: string, assignDto: AssignUserDto): Promise<User>;
    getRegionalManagers(regionId?: string): Promise<User[]>;
    getDealers(regionId?: string): Promise<User[]>;
    getFieldSales(territoryId?: string): Promise<User[]>;
    getAccountants(department?: string): Promise<User[]>;
    getOperationsSupport(regionId?: string): Promise<User[]>;
    getAccountantDashboard(req: RequestWithUser): Promise<{
        accessibleResources: {
            restaurantIds: string[];
            dealerIds: string[];
            regionIds: string[];
        };
        message: string;
    }>;
    getFinancialReports(req: RequestWithUser): Promise<{
        userRole: UserRole;
        permissions: string;
    }>;
    getFieldSalesDashboard(req: RequestWithUser): Promise<{
        accessibleResources: {
            restaurantIds: string[];
            dealerIds: string[];
            regionIds: string[];
        };
        monthlyTarget: number;
        monthlyVisitsTarget: number;
        assignedRestaurants: number;
    }>;
    addVisitReport(req: RequestWithUser, visitData: any): Promise<{
        message: string;
        userId: string;
        data: any;
    }>;
    getOperationsDashboard(req: RequestWithUser): Promise<{
        accessibleResources: {
            restaurantIds: string[];
            dealerIds: string[];
            regionIds: string[];
        };
        liveDeliveries: string;
        activeIssues: string;
    }>;
    interveneDelivery(interventionData: any): Promise<{
        message: string;
        data: any;
    }>;
    getRegionalManagerDashboard(req: RequestWithUser): Promise<{
        regionId: string;
        regionName: string;
        accessibleResources: {
            restaurantIds: string[];
            dealerIds: string[];
            regionIds: string[];
        };
        subordinates: number;
        dealers: number;
        restaurants: number;
    }>;
    getSubordinates(req: RequestWithUser): Promise<User[]>;
    getDealerDashboard(req: RequestWithUser): Promise<{
        dealerId: string;
        dealerName: string;
        accessibleResources: {
            restaurantIds: string[];
            dealerIds: string[];
            regionIds: string[];
        };
        restaurants: number;
    }>;
    getMyProfile(req: RequestWithUser): Promise<User>;
    updateMyProfile(req: RequestWithUser, updateData: Partial<UpdateUserDto>): Promise<User>;
}
export {};
