import { Company } from '../../companies/entities/company.entity';
import { UserRole } from '../enums/user-role.enum';
import { Dealer } from '../../dealers/entities/dealer.entity';
import { Region } from '../../regions/entities/region.entity';
import { SupportTicket } from '../../support/entities/support-ticket.entity';
import { SupportMessage } from '../../support/entities/support-message.entity';
import { Lead } from '../../leads/entities/lead.entity';
import { Territory } from '../../territories/entities/territory.entity';
import { Visit } from '../../visits/entities/visit.entity';
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: UserStatus;
    isActive: boolean;
    phone: string;
    companyId: string;
    company: Company;
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
    ownedDealers: Dealer[];
    managedRegions: Region[];
    createdTickets: SupportTicket[];
    assignedTickets: SupportTicket[];
    sentMessages: SupportMessage[];
    assignedLeads: Lead[];
    assignedTerritories: Territory[];
    visits: Visit[];
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
}
export { UserRole, RoleLevel } from '../enums/user-role.enum';
