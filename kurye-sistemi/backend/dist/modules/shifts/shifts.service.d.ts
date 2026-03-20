import { Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
export declare class ShiftsService {
    private shiftRepository;
    constructor(shiftRepository: Repository<Shift>);
    create(shiftData: Partial<Shift>): Promise<Shift>;
    findAll(companyId: string, filters?: any): Promise<Shift[]>;
    findOne(id: string, companyId: string): Promise<Shift>;
    update(id: string, companyId: string, updateData: Partial<Shift>): Promise<Shift>;
    remove(id: string, companyId: string): Promise<void>;
    getActiveShift(courierId: string, companyId: string): Promise<Shift | null>;
    getUpcomingShifts(courierId: string, hours?: number): Promise<Shift[]>;
}
