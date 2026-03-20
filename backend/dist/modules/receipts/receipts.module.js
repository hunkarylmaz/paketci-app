"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const receipts_service_1 = require("./receipts.service");
const receipts_controller_1 = require("./receipts.controller");
const receipt_entity_1 = require("./entities/receipt.entity");
const company_entity_1 = require("../companies/entities/company.entity");
const delivery_entity_1 = require("../deliveries/entities/delivery.entity");
let ReceiptsModule = class ReceiptsModule {
};
exports.ReceiptsModule = ReceiptsModule;
exports.ReceiptsModule = ReceiptsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([receipt_entity_1.Receipt, company_entity_1.Company, delivery_entity_1.Delivery])],
        controllers: [receipts_controller_1.ReceiptsController],
        providers: [receipts_service_1.ReceiptsService],
        exports: [receipts_service_1.ReceiptsService],
    })
], ReceiptsModule);
//# sourceMappingURL=receipts.module.js.map