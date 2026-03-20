export interface ExportColumn {
    header: string;
    key: string;
    width?: number;
    format?: (value: any) => string | number;
}
export declare class ExcelExportService {
    private deliveryColumns;
    private shiftColumns;
    private formatDate;
    private formatDuration;
    private formatStatus;
    private formatPaymentType;
    private formatShiftType;
    exportDeliveries(deliveries: any[], fileName?: string): Buffer;
    exportShifts(shifts: any[], fileName?: string): Buffer;
    exportShiftComplianceReport(shifts: any[], summary: any, fileName?: string): Buffer;
    private createWorkbook;
}
