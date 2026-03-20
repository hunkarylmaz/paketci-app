import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Shift, ShiftStatus } from '../../modules/shifts/entities/shift.entity';
import { Courier } from '../../modules/couriers/entities/courier.entity';

export interface ShiftComplianceReport {
  totalShifts: number;
  compliantShifts: number;
  nonCompliantShifts: number;
  complianceRate: number;
  avgLateArrival: number;
  avgEarlyLeave: number;
  totalDeliveries: number;
  avgDeliveryTime: number;
  courierStats: CourierShiftStat[];
}

export interface CourierShiftStat {
  courierId: string;
  name: string;
  totalShifts: number;
  compliantShifts: number;
  nonCompliantShifts: number;
  totalLateMinutes: number;
  totalEarlyLeaveMinutes: number;
  totalDeliveries: number;
  avgDeliveryTime: number;
  complianceRate: number;
}

@Injectable()
export class ShiftComplianceService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
    @InjectRepository(Courier)
    private courierRepository: Repository<Courier>,
  ) {}

  /**
   * Vardiya uyumluluk raporu oluştur
   */
  async generateComplianceReport(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ShiftComplianceReport> {
    // Tüm vardiyaları al
    const shifts = await this.shiftRepository.find({
      where: {
        companyId,
        plannedStartAt: Between(startDate, endDate),
      },
      relations: ['courier'],
    });

    if (shifts.length === 0) {
      return this.getEmptyReport();
    }

    // Her vardiya için uyumluluk kontrolü
    const checkedShifts = shifts.map(shift => this.checkCompliance(shift));

    // Kurye bazlı istatistikler
    const courierStats = await this.calculateCourierStats(checkedShifts);

    // Genel özet
    const compliantShifts = checkedShifts.filter(s => s.isCompliant).length;
    const nonCompliantShifts = checkedShifts.filter(s => !s.isCompliant).length;

    const lateArrivals = checkedShifts
      .filter(s => s.lateArrivalMinutes > 0)
      .map(s => s.lateArrivalMinutes);
    
    const earlyLeaves = checkedShifts
      .filter(s => s.earlyLeaveMinutes > 0)
      .map(s => s.earlyLeaveMinutes);

    const totalDeliveries = checkedShifts.reduce(
      (sum, s) => sum + (s.performanceMetrics?.totalDeliveries || 0),
      0
    );

    const avgDeliveryTime = this.calculateAverage(
      checkedShifts
        .filter(s => s.performanceMetrics?.averageDeliveryTime)
        .map(s => s.performanceMetrics.averageDeliveryTime)
    );

    return {
      totalShifts: shifts.length,
      compliantShifts,
      nonCompliantShifts,
      complianceRate: Math.round((compliantShifts / shifts.length) * 100),
      avgLateArrival: Math.round(this.calculateAverage(lateArrivals)),
      avgEarlyLeave: Math.round(this.calculateAverage(earlyLeaves)),
      totalDeliveries,
      avgDeliveryTime: Math.round(avgDeliveryTime),
      courierStats,
    };
  }

  /**
   * Tek bir vardiya için uyumluluk kontrolü
   */
  checkCompliance(shift: Shift): Shift {
    const toleranceMinutes = 5; // 5 dakika tolerans
    
    let isCompliant = true;
    let nonComplianceReason = '';
    let lateArrivalMinutes = 0;
    let earlyLeaveMinutes = 0;

    // Başlangıç kontrolü
    if (shift.actualStartAt && shift.plannedStartAt) {
      const diff = (shift.actualStartAt.getTime() - shift.plannedStartAt.getTime()) / 60000;
      
      if (diff > toleranceMinutes) {
        isCompliant = false;
        lateArrivalMinutes = Math.round(diff);
        nonComplianceReason = `Geç kalma: ${lateArrivalMinutes} dk`;
      }
    }

    // Bitiş kontrolü
    if (shift.actualEndAt && shift.plannedEndAt) {
      const diff = (shift.plannedEndAt.getTime() - shift.actualEndAt.getTime()) / 60000;
      
      if (diff > toleranceMinutes) {
        isCompliant = false;
        earlyLeaveMinutes = Math.round(diff);
        nonComplianceReason = nonComplianceReason 
          ? `${nonComplianceReason}, Erken çıkma: ${earlyLeaveMinutes} dk`
          : `Erken çıkma: ${earlyLeaveMinutes} dk`;
      }
    }

    // No-show kontrolü
    if (shift.status === ShiftStatus.NO_SHOW) {
      isCompliant = false;
      nonComplianceReason = 'Vardiyaya gelmedi';
    }

    // İptal kontrolü
    if (shift.status === ShiftStatus.CANCELLED) {
      isCompliant = false;
      nonComplianceReason = 'Vardiya iptal edildi';
    }

    // Güncelle
    shift.isCompliant = isCompliant;
    shift.nonComplianceReason = nonComplianceReason;
    shift.lateArrivalMinutes = lateArrivalMinutes;
    shift.earlyLeaveMinutes = earlyLeaveMinutes;

    // Süre hesaplamaları
    if (shift.plannedStartAt && shift.plannedEndAt) {
      shift.plannedDuration = Math.round(
        (shift.plannedEndAt.getTime() - shift.plannedStartAt.getTime()) / 60000
      );
    }

    if (shift.actualStartAt && shift.actualEndAt) {
      shift.actualDuration = Math.round(
        (shift.actualEndAt.getTime() - shift.actualStartAt.getTime()) / 60000
      );
    }

    return shift;
  }

  /**
   * Kurye bazlı istatistikler
   */
  private async calculateCourierStats(shifts: Shift[]): Promise<CourierShiftStat[]> {
    const courierMap = new Map<string, CourierShiftStat>();

    for (const shift of shifts) {
      if (!shift.courier) continue;

      const id = shift.courierId;
      const existing = courierMap.get(id);

      if (existing) {
        existing.totalShifts++;
        if (shift.isCompliant) {
          existing.compliantShifts++;
        } else {
          existing.nonCompliantShifts++;
        }
        existing.totalLateMinutes += shift.lateArrivalMinutes || 0;
        existing.totalEarlyLeaveMinutes += shift.earlyLeaveMinutes || 0;
        existing.totalDeliveries += shift.performanceMetrics?.totalDeliveries || 0;
        existing.complianceRate = Math.round(
          (existing.compliantShifts / existing.totalShifts) * 100
        );
      } else {
        courierMap.set(id, {
          courierId: id,
          name: `${shift.courier.firstName} ${shift.courier.lastName}`,
          totalShifts: 1,
          compliantShifts: shift.isCompliant ? 1 : 0,
          nonCompliantShifts: shift.isCompliant ? 0 : 1,
          totalLateMinutes: shift.lateArrivalMinutes || 0,
          totalEarlyLeaveMinutes: shift.earlyLeaveMinutes || 0,
          totalDeliveries: shift.performanceMetrics?.totalDeliveries || 0,
          avgDeliveryTime: shift.performanceMetrics?.averageDeliveryTime || 0,
          complianceRate: shift.isCompliant ? 100 : 0,
        });
      }
    }

    return Array.from(courierMap.values()).sort(
      (a, b) => b.complianceRate - a.complianceRate
    );
  }

  /**
   * Vardiya başlat
   */
  async startShift(shiftId: string, location?: { latitude: number; longitude: number }): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({ where: { id: shiftId } });
    
    if (!shift) {
      throw new Error('Vardiya bulunamadı');
    }

    shift.status = ShiftStatus.ACTIVE;
    shift.actualStartAt = new Date();
    
    if (location) {
      shift.startLocation = location;
    }

    // Geç kalma kontrolü
    if (shift.plannedStartAt) {
      const diff = (shift.actualStartAt.getTime() - shift.plannedStartAt.getTime()) / 60000;
      if (diff > 5) {
        shift.lateArrivalMinutes = Math.round(diff);
      }
    }

    return this.shiftRepository.save(shift);
  }

  /**
   * Vardiya bitir
   */
  async endShift(shiftId: string, location?: { latitude: number; longitude: number }): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({ where: { id: shiftId } });
    
    if (!shift) {
      throw new Error('Vardiya bulunamadı');
    }

    shift.status = ShiftStatus.COMPLETED;
    shift.actualEndAt = new Date();
    
    if (location) {
      shift.endLocation = location;
    }

    // Erken çıkma kontrolü
    if (shift.plannedEndAt) {
      const diff = (shift.plannedEndAt.getTime() - shift.actualEndAt.getTime()) / 60000;
      if (diff > 5) {
        shift.earlyLeaveMinutes = Math.round(diff);
      }
    }

    // Uyumluluk kontrolü
    this.checkCompliance(shift);

    return this.shiftRepository.save(shift);
  }

  /**
   * Mola başlat
   */
  async startBreak(shiftId: string): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({ where: { id: shiftId } });
    
    if (!shift) {
      throw new Error('Vardiya bulunamadı');
    }

    shift.status = ShiftStatus.ON_BREAK;
    shift.breakStartedAt = new Date();

    return this.shiftRepository.save(shift);
  }

  /**
   * Mola bitir
   */
  async endBreak(shiftId: string): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({ where: { id: shiftId } });
    
    if (!shift) {
      throw new Error('Vardiya bulunamadı');
    }

    shift.status = ShiftStatus.ACTIVE;
    shift.breakEndedAt = new Date();

    if (shift.breakStartedAt) {
      const breakMinutes = (shift.breakEndedAt.getTime() - shift.breakStartedAt.getTime()) / 60000;
      shift.breakDuration = parseFloat((breakMinutes / 60).toFixed(2));
    }

    return this.shiftRepository.save(shift);
  }

  /**
   * Boş rapor
   */
  private getEmptyReport(): ShiftComplianceReport {
    return {
      totalShifts: 0,
      compliantShifts: 0,
      nonCompliantShifts: 0,
      complianceRate: 0,
      avgLateArrival: 0,
      avgEarlyLeave: 0,
      totalDeliveries: 0,
      avgDeliveryTime: 0,
      courierStats: [],
    };
  }

  /**
   * Ortalama hesapla
   */
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }
}
