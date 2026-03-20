"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const excel_export_service_1 = require("./services/excel-export.service");
const smart_assignment_service_1 = require("./services/smart-assignment.service");
const shift_compliance_service_1 = require("./services/shift-compliance.service");
const courier_entity_1 = require("../modules/couriers/entities/courier.entity");
const shift_entity_1 = require("../modules/shifts/entities/shift.entity");
const restaurant_entity_1 = require("../modules/restaurants/entities/restaurant.entity");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([courier_entity_1.Courier, shift_entity_1.Shift, restaurant_entity_1.Restaurant]),
        ],
        providers: [
            excel_export_service_1.ExcelExportService,
            smart_assignment_service_1.SmartAssignmentService,
            shift_compliance_service_1.ShiftComplianceService,
        ],
        exports: [
            excel_export_service_1.ExcelExportService,
            smart_assignment_service_1.SmartAssignmentService,
            shift_compliance_service_1.ShiftComplianceService,
        ],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map