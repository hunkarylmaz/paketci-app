export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    COMPANY_ADMIN = "company_admin",
    REGIONAL_MANAGER = "regional_manager",
    MANAGER = "manager",
    ACCOUNTANT = "accountant",
    FIELD_SALES = "field_sales",
    OPERATIONS_SUPPORT = "operations_support",
    DEALER = "dealer",
    RESTAURANT = "restaurant",
    COURIER = "courier"
}
export declare enum RoleLevel {
    SUPER_ADMIN = 100,
    COMPANY_ADMIN = 90,
    REGIONAL_MANAGER = 80,
    MANAGER = 70,
    ACCOUNTANT = 60,
    FIELD_SALES = 60,
    OPERATIONS_SUPPORT = 60,
    DEALER = 50,
    RESTAURANT = 40,
    COURIER = 10
}
export declare const RolePermissions: {
    super_admin: string[];
    company_admin: string[];
    regional_manager: string[];
    manager: string[];
    accountant: string[];
    field_sales: string[];
    operations_support: string[];
    dealer: string[];
    restaurant: string[];
    courier: string[];
};
export declare const RoleDescriptions: {
    super_admin: string;
    company_admin: string;
    regional_manager: string;
    manager: string;
    accountant: string;
    field_sales: string;
    operations_support: string;
    dealer: string;
    restaurant: string;
    courier: string;
};
export declare const RoleColors: {
    super_admin: string;
    company_admin: string;
    regional_manager: string;
    manager: string;
    accountant: string;
    field_sales: string;
    operations_support: string;
    dealer: string;
    restaurant: string;
    courier: string;
};
