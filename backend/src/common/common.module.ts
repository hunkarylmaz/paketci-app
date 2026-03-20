import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcelExportService } from './services/excel-export.service';
import { SmartAssignmentService } from './services/smart-assignment.service';
import { ShiftComplianceService } from './services/shift-compliance.service';
import { Courier } from '../modules/couriers/entities/courier.entity';
import { Shift } from '../modules/shifts/entities/shift.entity';
import { Restaurant } from '../modules/restaurants/entities/restaurant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Courier, Shift, Restaurant]),
  ],
  providers: [
    ExcelExportService,
    SmartAssignmentService,
    ShiftComplianceService,
  ],
  exports: [
    ExcelExportService,
    SmartAssignmentService,
    ShiftComplianceService,
  ],
})
export class CommonModule {}
