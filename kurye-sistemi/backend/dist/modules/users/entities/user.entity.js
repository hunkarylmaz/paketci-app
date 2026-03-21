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
exports.RoleLevel = exports.UserRole = exports.User = exports.UserStatus = void 0;
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../../companies/entities/company.entity");
const user_role_enum_1 = require("../enums/user-role.enum");
const dealer_entity_1 = require("../../dealers/entities/dealer.entity");
const region_entity_1 = require("../../regions/entities/region.entity");
const support_ticket_entity_1 = require("../../support/entities/support-ticket.entity");
const support_message_entity_1 = require("../../support/entities/support-message.entity");
const lead_entity_1 = require("../../leads/entities/lead.entity");
const territory_entity_1 = require("../../territories/entities/territory.entity");
const visit_entity_1 = require("../../visits/entities/visit.entity");
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: user_role_enum_1.UserRole, default: user_role_enum_1.UserRole.COURIER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, company => company.users),
    (0, typeorm_1.JoinColumn)({ name: 'companyId' }),
    __metadata("design:type", company_entity_1.Company)
], User.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "regionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "regionName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "dealerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "dealerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "territoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "territoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "reportsToId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, user => user.subordinates),
    (0, typeorm_1.JoinColumn)({ name: 'reportsToId' }),
    __metadata("design:type", User)
], User.prototype, "reportsTo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User, user => user.reportsTo),
    __metadata("design:type", Array)
], User.prototype, "subordinates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dealer_entity_1.Dealer, dealer => dealer.owner),
    __metadata("design:type", Array)
], User.prototype, "ownedDealers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => region_entity_1.Region, region => region.manager),
    __metadata("design:type", Array)
], User.prototype, "managedRegions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => support_ticket_entity_1.SupportTicket, ticket => ticket.creator),
    __metadata("design:type", Array)
], User.prototype, "createdTickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => support_ticket_entity_1.SupportTicket, ticket => ticket.assignee),
    __metadata("design:type", Array)
], User.prototype, "assignedTickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => support_message_entity_1.SupportMessage, message => message.sender),
    __metadata("design:type", Array)
], User.prototype, "sentMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lead_entity_1.Lead, lead => lead.assignedTo),
    __metadata("design:type", Array)
], User.prototype, "assignedLeads", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => territory_entity_1.Territory, territory => territory.fieldSales),
    __metadata("design:type", Array)
], User.prototype, "assignedTerritories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => visit_entity_1.Visit, visit => visit.visitor),
    __metadata("design:type", Array)
], User.prototype, "visits", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "assignedRestaurantIds", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "assignedDealerIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "monthlyTarget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "monthlyVisitsTarget", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "customPermissions", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "restrictions", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
var user_role_enum_2 = require("../enums/user-role.enum");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return user_role_enum_2.UserRole; } });
Object.defineProperty(exports, "RoleLevel", { enumerable: true, get: function () { return user_role_enum_2.RoleLevel; } });
//# sourceMappingURL=user.entity.js.map