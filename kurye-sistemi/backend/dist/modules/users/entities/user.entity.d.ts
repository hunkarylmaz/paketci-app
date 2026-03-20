import { Company } from '../../companies/entities/company.entity';
import { UserRole } from '../enums/user-role.enum';
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
    phone: string;
    companyId: string;
    company: Company;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
