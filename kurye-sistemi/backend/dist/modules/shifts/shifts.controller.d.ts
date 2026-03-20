import { Response } from 'express';
import { ShiftsService } from './shifts.service';
import { ShiftComplianceService } from '../../common/services/shift-compliance.service';
import { ExcelExportService } from '../../common/services/excel-export.service';
export declare class ShiftsController {
    private readonly shiftsService;
    private readonly complianceService;
    private readonly excelService;
    constructor(shiftsService: ShiftsService, complianceService: ShiftComplianceService, excelService: ExcelExportService);
    create(shiftData: any): Promise<import("./entities/shift.entity").Shift>;
    findAll(companyId: string, filters: any): Promise<import("./entities/shift.entity").Shift[]>;
    findOne(id: string, companyId: string): Promise<import("./entities/shift.entity").Shift>;
    update(id: string, companyId: string, updateData: any): Promise<import("./entities/shift.entity").Shift>;
    remove(id: string, companyId: string): Promise<{
        message: string;
    }>;
    startShift(id: string, body: {
        latitude: number;
        longitude: number;
    }): Promise<import("./entities/shift.entity").Shift>;
    endShift(id: string, body: {
        latitude: number;
        longitude: number;
    }): Promise<import("./entities/shift.entity").Shift>;
    startBreak(id: string): Promise<import("./entities/shift.entity").Shift>;
    endBreak(id: string): Promise<import("./entities/shift.entity").Shift>;
    getComplianceReport(companyId: string, startDate: string, endDate: string): Promise<import("../../common/services/shift-compliance.service").ShiftComplianceReport>;
    exportShifts(companyId: string, startDate: string, endDate: string, res: Response): Promise<void>;
    exportComplianceReport(companyId: string, startDate: string, endDate: string, res: Response): Promise<void>;
}
