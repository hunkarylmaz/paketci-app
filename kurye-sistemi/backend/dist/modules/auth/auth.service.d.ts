import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            companyId: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        status: import("../users/entities/user.entity").UserStatus;
        isActive: boolean;
        phone: string;
        companyId: string;
        company: import("../companies/entities/company.entity").Company;
        regionId: string;
        regionName: string;
        dealerId: string;
        dealerName: string;
        territoryId: string;
        territoryName: string;
        department: string;
        reportsToId: string;
        reportsTo: User;
        subordinates: User[];
        ownedDealers: import("../dealers/entities/dealer.entity").Dealer[];
        managedRegions: import("../regions/entities/region.entity").Region[];
        createdTickets: import("../support/entities/support-ticket.entity").SupportTicket[];
        assignedTickets: import("../support/entities/support-ticket.entity").SupportTicket[];
        sentMessages: import("../support/entities/support-message.entity").SupportMessage[];
        assignedLeads: import("../leads/entities/lead.entity").Lead[];
        assignedTerritories: import("../territories/entities/territory.entity").Territory[];
        visits: import("../visits/entities/visit.entity").Visit[];
        assignedRestaurantIds: string[];
        assignedDealerIds: string[];
        monthlyTarget: number;
        monthlyVisitsTarget: number;
        customPermissions: string[];
        restrictions: {
            viewOnly?: boolean;
            ownRegionOnly?: boolean;
            ownDealerOnly?: boolean;
            ownRestaurantsOnly?: boolean;
        };
        lastLoginAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(userId: string): Promise<User>;
}
