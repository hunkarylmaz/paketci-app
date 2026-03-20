import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { Shift } from './entities/shift.entity';
import { Courier } from '../couriers/entities/courier.entity';
import { ShiftComplianceService } from '../../common/services/shift-compliance.service';
import { ExcelExportService } from '../../common/services/excel-export.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Courier])],
  controllers: [ShiftsController],
  providers: [ShiftsService, ShiftComplianceService, ExcelExportService],
  exports: [ShiftsService],
})
export class ShiftsModule {}
