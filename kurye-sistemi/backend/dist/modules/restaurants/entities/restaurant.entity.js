"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = exports.RestaurantUser = exports.RestaurantUserRole = exports.RestaurantSalesStatus = exports.PricingType = void 0;
const typeorm_1 = require("typeorm");
const delivery_entity_1 = require("../../deliveries/entities/delivery.entity");
const contract_entity_1 = require("../../contracts/entities/contract.entity");
const company_entity_1 = require("../../companies/entities/company.entity");
const dealer_entity_1 = require("../../dealers/entities/dealer.entity");
const region_entity_1 = require("../../regions/entities/region.entity");
const invoice_entity_1 = require("../../invoices/entities/invoice.entity");
const territory_entity_1 = require("../../territories/entities/territory.entity");
const visit_entity_1 = require("../../visits/entities/visit.entity");
const lead_entity_1 = require("../../leads/entities/lead.entity");
const integration_entity_1 = require("../../integrations/entities/integration.entity");
var PricingType;
(function (PricingType) {
    PricingType["PER_PACKAGE"] = "PER_PACKAGE";
    PricingType["PER_KM"] = "PER_KM";
    PricingType["KM_RANGE"] = "KM_RANGE";
    PricingType["PACKAGE_PLUS_KM"] = "PACKAGE_PLUS_KM";
    PricingType["FIXED_KM_PLUS_KM"] = "FIXED_KM_PLUS_KM";
    PricingType["COMMISSION"] = "COMMISSION";
    PricingType["FIXED_PRICE"] = "FIXED_PRICE";
    PricingType["HOURLY"] = "HOURLY";
    PricingType["ZONE_BASED"] = "ZONE_BASED";
})(PricingType || (exports.PricingType = PricingType = {}));
var RestaurantSalesStatus;
(function (RestaurantSalesStatus) {
    RestaurantSalesStatus["LEAD"] = "LEAD";
    RestaurantSalesStatus["CONTACTED"] = "CONTACTED";
    RestaurantSalesStatus["VISITED"] = "VISITED";
    RestaurantSalesStatus["NEGOTIATING"] = "NEGOTIATING";
    RestaurantSalesStatus["CONTRACTED"] = "CONTRACTED";
    RestaurantSalesStatus["ACTIVE"] = "ACTIVE";
    RestaurantSalesStatus["INACTIVE"] = "INACTIVE";
})(RestaurantSalesStatus || (exports.RestaurantSalesStatus = RestaurantSalesStatus = {}));
var RestaurantUserRole;
(function (RestaurantUserRole) {
    RestaurantUserRole["MANAGER"] = "MANAGER";
    RestaurantUserRole["STAFF"] = "STAFF";
})(RestaurantUserRole || (exports.RestaurantUserRole = RestaurantUserRole = {}));
let RestaurantUser = class RestaurantUser {
};
exports.RestaurantUser = RestaurantUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RestaurantUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RestaurantUser.prototype, "restaurantId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RestaurantUser.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RestaurantUser.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RestaurantUserRole,
        default: RestaurantUserRole.MANAGER
    }),
    __metadata("design:type", String)
], RestaurantUser.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], RestaurantUser.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RestaurantUser.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], RestaurantUser.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RestaurantUser.prototype, "createdAt", void 0);
exports.RestaurantUser = RestaurantUser = __decorate([
    (0, typeorm_1.Entity)('restaurant_users')
], RestaurantUser);
let Restaurant = class Restaurant {
};
exports.Restaurant = Restaurant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Restaurant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "brandName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "taxNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "supportPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "technicalContactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Restaurant.prototype, "creditCardCommission", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 30 }),
    __metadata("design:type", Number)
], Restaurant.prototype, "pickupTimeMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PricingType,
        default: PricingType.PER_PACKAGE
    }),
    __metadata("design:type", String)
], Restaurant.prototype, "pricingType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Restaurant.prototype, "pricingConfig", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RestaurantUser, user => user.restaurantId),
    __metadata("design:type", Array)
], Restaurant.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Restaurant.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Restaurant.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Restaurant.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Restaurant.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 15 }),
    __metadata("design:type", Number)
], Restaurant.prototype, "averagePreparationTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 30 }),
    __metadata("design:type", Number)
], Restaurant.prototype, "maxPreparationTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Restaurant.prototype, "preparationTimeByHour", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "dealerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "dealerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "regionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "regionName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "territoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "territoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "fieldSalesId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "fieldSalesName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Restaurant.prototype, "lastVisitAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Restaurant.prototype, "visitCount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RestaurantSalesStatus,
        default: RestaurantSalesStatus.LEAD
    }),
    __metadata("design:type", String)
], Restaurant.prototype, "salesStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Restaurant.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "apiKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Restaurant.prototype, "extensionEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Restaurant.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Restaurant.prototype, "activatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, company => company.restaurants, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'companyId' }),
    __metadata("design:type", company_entity_1.Company)
], Restaurant.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dealer_entity_1.Dealer, dealer => dealer.restaurants, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'dealerId' }),
    __metadata("design:type", dealer_entity_1.Dealer)
], Restaurant.prototype, "dealer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => region_entity_1.Region, region => region.restaurants, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'regionId' }),
    __metadata("design:type", region_entity_1.Region)
], Restaurant.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => territory_entity_1.Territory, territory => territory.restaurants, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'territoryId' }),
    __metadata("design:type", territory_entity_1.Territory)
], Restaurant.prototype, "territory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => delivery_entity_1.Delivery, delivery => delivery.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "deliveries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contract_entity_1.Contract, contract => contract.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "contracts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_entity_1.Invoice, invoice => invoice.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "invoices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => visit_entity_1.Visit, visit => visit.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "visits", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lead_entity_1.Lead, lead => lead.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "leads", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => integration_entity_1.Integration, integration => integration.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "integrations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Restaurant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Restaurant.prototype, "updatedAt", void 0);
exports.Restaurant = Restaurant = __decorate([
    (0, typeorm_1.Entity)('restaurants')
], Restaurant);
//# sourceMappingURL=restaurant.entity.js.map