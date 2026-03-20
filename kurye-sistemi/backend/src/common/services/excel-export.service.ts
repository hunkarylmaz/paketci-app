import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { Delivery } from '../../modules/deliveries/entities/delivery.entity';
import { Shift } from '../../modules/shifts/entities/shift.entity';

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
  format?: (value: any) => string | number;
}

@Injectable()
export class ExcelExportService {
  
  // Teslimat raporu için kolon tanımları
  private deliveryColumns: ExportColumn[] = [
    { header: 'Takip No', key: 'trackingNumber', width: 15 },
    { header: 'Durum', key: 'status', width: 12 },
    { header: 'Müşteri', key: 'customerName', width: 20 },
    { header: 'Telefon', key: 'customerPhone', width: 15 },
    { header: 'Restoran', key: 'restaurantName', width: 20 },
    { header: 'Kurye', key: 'courierName', width: 20 },
    { header: 'Tutar (TL)', key: 'orderAmount', width: 12 },
    { header: 'Ödeme', key: 'paymentType', width: 12 },
    
    // Uçtan uca süreler
    { header: 'Sipariş Tarihi', key: 'createdAt', width: 18 },
    { header: 'Restoran Onayı', key: 'restaurantAcceptedAt', width: 18 },
    { header: 'Hazır Oldu', key: 'restaurantReadyAt', width: 18 },
    { header: 'Kurye Atandı', key: 'assignedAt', width: 18 },
    { header: 'Kurye Kabul', key: 'acceptedAt', width: 18 },
    { header: 'Restorana Varış', key: 'arrivedAtRestaurantAt', width: 18 },
    { header: 'Paket Alındı', key: 'pickedUpAt', width: 18 },
    { header: 'Yolda', key: 'inTransitAt', width: 18 },
    { header: 'Adrese Varış', key: 'arrivedAtDestinationAt', width: 18 },
    { header: 'Teslimat', key: 'deliveredAt', width: 18 },
    
    // Süre hesaplamaları (dakika)
    { header: 'Hazırlık Süresi', key: 'preparationDuration', width: 14 },
    { header: 'Atanma Süresi', key: 'assignmentDuration', width: 14 },
    { header: 'Kabul Süresi', key: 'acceptanceDuration', width: 14 },
    { header: 'Rest. Bekleme', key: 'pickupWaitDuration', width: 14 },
    { header: 'Yolda Süre', key: 'transitDuration', width: 14 },
    { header: 'Toplam Süre', key: 'totalDuration', width: 14 },
    
    // Maliyet
    { header: 'Kontör (TL)', key: 'creditDeducted', width: 12 },
    { header: 'Kurye Kazancı', key: 'courierEarnings', width: 12 },
    
    // Mesafe
    { header: 'Mesafe (km)', key: 'totalDistance', width: 12 },
    { header: 'Adres', key: 'deliveryAddress', width: 40 },
  ];

  // Vardiya raporu için kolon tanımları
  private shiftColumns: ExportColumn[] = [
    { header: 'Kurye Adı', key: 'courierName', width: 20 },
    { header: 'Vardiya Tipi', key: 'type', width: 12 },
    { header: 'Durum', key: 'status', width: 12 },
    { header: 'Planlanan Başlangıç', key: 'plannedStartAt', width: 18 },
    { header: 'Planlanan Bitiş', key: 'plannedEndAt', width: 18 },
    { header: 'Gerçek Başlangıç', key: 'actualStartAt', width: 18 },
    { header: 'Gerçek Bitiş', key: 'actualEndAt', width: 18 },
    { header: 'Planlanan Süre (dk)', key: 'plannedDuration', width: 16 },
    { header: 'Gerçek Süre (dk)', key: 'actualDuration', width: 16 },
    { header: 'Mola Süresi (sa)', key: 'breakDuration', width: 14 },
    { header: 'Geç Kalma (dk)', key: 'lateArrivalMinutes', width: 14 },
    { header: 'Erken Çıkma (dk)', key: 'earlyLeaveMinutes', width: 14 },
    { header: 'Uyumlu', key: 'isCompliant', width: 10 },
    { header: 'Uyumsuzluk Sebebi', key: 'nonComplianceReason', width: 25 },
    { header: 'Toplam Teslimat', key: 'totalDeliveries', width: 14 },
    { header: 'Ort. Teslimat Süresi', key: 'averageDeliveryTime', width: 18 },
    { header: 'Müşteri Puanı', key: 'customerRating', width: 14 },
    { header: 'Zamanında Teslim %', key: 'onTimeDeliveryRate', width: 18 },
    { header: 'Notlar', key: 'notes', width: 30 },
  ];

  private formatDate(date: Date | null): string {
    if (!date) return '';
    return new Date(date).toLocaleString('tr-TR');
  }

  private formatDuration(minutes: number | null): string {
    if (minutes === null || minutes === undefined) return '';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
  }

  private formatStatus(status: string): string {
    const statusMap = {
      pending: 'Bekliyor',
      assigned: 'Atandı',
      accepted: 'Kabul Edildi',
      picked_up: 'Alındı',
      in_transit: 'Yolda',
      near_destination: 'Yaklaştı',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi',
      failed: 'Başarısız',
      scheduled: 'Planlandı',
      active: 'Aktif',
      on_break: 'Mola',
      completed: 'Tamamlandı',
      no_show: 'Gelmedi',
    };
    return statusMap[status] || status;
  }

  private formatPaymentType(type: string): string {
    const typeMap = {
      cash: 'Nakit',
      credit_card: 'Kredi Kartı',
      online: 'Online',
      meal_card: 'Yemek Kartı',
    };
    return typeMap[type] || type;
  }

  private formatShiftType(type: string): string {
    const typeMap = {
      morning: 'Sabah (08-16)',
      afternoon: 'Öğlen (12-20)',
      evening: 'Akşam (16-00)',
      night: 'Gece (00-08)',
      full_day: 'Tam Gün',
      custom: 'Özel',
    };
    return typeMap[type] || type;
  }

  /**
   * Teslimatları Excel'e aktar
   */
  exportDeliveries(deliveries: any[], fileName: string = 'teslimatlar'): Buffer {
    const data = deliveries.map(d => ({
      trackingNumber: d.trackingNumber,
      status: this.formatStatus(d.status),
      customerName: d.customerName,
      customerPhone: d.customerPhone,
      restaurantName: d.restaurant?.name || '',
      courierName: d.courier ? `${d.courier.firstName} ${d.courier.lastName}` : '',
      orderAmount: d.orderAmount,
      paymentType: this.formatPaymentType(d.paymentType),
      
      // Zamanlar
      createdAt: this.formatDate(d.createdAt),
      restaurantAcceptedAt: this.formatDate(d.restaurantAcceptedAt),
      restaurantReadyAt: this.formatDate(d.restaurantReadyAt),
      assignedAt: this.formatDate(d.assignedAt),
      acceptedAt: this.formatDate(d.acceptedAt),
      arrivedAtRestaurantAt: this.formatDate(d.arrivedAtRestaurantAt),
      pickedUpAt: this.formatDate(d.pickedUpAt),
      inTransitAt: this.formatDate(d.inTransitAt),
      arrivedAtDestinationAt: this.formatDate(d.arrivedAtDestinationAt),
      deliveredAt: this.formatDate(d.deliveredAt),
      
      // Süreler
      preparationDuration: this.formatDuration(d.preparationDuration),
      assignmentDuration: this.formatDuration(d.assignmentDuration),
      acceptanceDuration: this.formatDuration(d.acceptanceDuration),
      pickupWaitDuration: this.formatDuration(d.pickupWaitDuration),
      transitDuration: this.formatDuration(d.transitDuration),
      totalDuration: this.formatDuration(d.totalDuration),
      
      // Maliyet
      creditDeducted: d.creditDeducted,
      courierEarnings: d.courierEarnings,
      
      // Mesafe
      totalDistance: d.totalDistance,
      deliveryAddress: d.deliveryAddress,
    }));

    return this.createWorkbook(data, this.deliveryColumns, fileName);
  }

  /**
   * Vardiya raporunu Excel'e aktar
   */
  exportShifts(shifts: any[], fileName: string = 'vardiyalar'): Buffer {
    const data = shifts.map(s => ({
      courierName: s.courier ? `${s.courier.firstName} ${s.courier.lastName}` : '',
      type: this.formatShiftType(s.type),
      status: this.formatStatus(s.status),
      plannedStartAt: this.formatDate(s.plannedStartAt),
      plannedEndAt: this.formatDate(s.plannedEndAt),
      actualStartAt: this.formatDate(s.actualStartAt),
      actualEndAt: this.formatDate(s.actualEndAt),
      plannedDuration: s.plannedDuration,
      actualDuration: s.actualDuration,
      breakDuration: s.breakDuration,
      lateArrivalMinutes: s.lateArrivalMinutes,
      earlyLeaveMinutes: s.earlyLeaveMinutes,
      isCompliant: s.isCompliant ? 'Evet' : 'Hayır',
      nonComplianceReason: s.nonComplianceReason || '',
      totalDeliveries: s.performanceMetrics?.totalDeliveries || 0,
      averageDeliveryTime: s.performanceMetrics?.averageDeliveryTime || 0,
      customerRating: s.performanceMetrics?.customerRating || 0,
      onTimeDeliveryRate: s.performanceMetrics?.onTimeDeliveryRate 
        ? `${s.performanceMetrics.onTimeDeliveryRate}%` 
        : '',
      notes: s.notes || '',
    }));

    return this.createWorkbook(data, this.shiftColumns, fileName);
  }

  /**
   * Vardiya uyumluluk özeti
   */
  exportShiftComplianceReport(
    shifts: any[], 
    summary: any,
    fileName: string = 'vardiya-uyumluluk-raporu'
  ): Buffer {
    const wb = XLSX.utils.book_new();

    // 1. Detaylı vardiya listesi
    const shiftData = shifts.map(s => ({
      'Kurye': s.courier ? `${s.courier.firstName} ${s.courier.lastName}` : '',
      'Tarih': s.plannedStartAt ? new Date(s.plannedStartAt).toLocaleDateString('tr-TR') : '',
      'Planlanan Başlangıç': this.formatDate(s.plannedStartAt),
      'Gerçek Başlangıç': this.formatDate(s.actualStartAt),
      'Geç Kalma (dk)': s.lateArrivalMinutes || 0,
      'Planlanan Bitiş': this.formatDate(s.plannedEndAt),
      'Gerçek Bitiş': this.formatDate(s.actualEndAt),
      'Erken Çıkma (dk)': s.earlyLeaveMinutes || 0,
      'Uyumlu': s.isCompliant ? 'Evet' : 'Hayır',
      'Sebep': s.nonComplianceReason || '',
    }));

    const ws1 = XLSX.utils.json_to_sheet(shiftData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Vardiya Detayları');

    // 2. Özet rapor
    const summaryData = [
      { 'Metrik': 'Toplam Vardiya', 'Değer': summary.totalShifts },
      { 'Metrik': 'Uyumlu Vardiya', 'Değer': summary.compliantShifts },
      { 'Metrik': 'Uyumsuz Vardiya', 'Değer': summary.nonCompliantShifts },
      { 'Metrik': 'Uyumluluk Oranı %', 'Değer': `${summary.complianceRate}%` },
      { 'Metrik': 'Ortalama Geç Kalma', 'Değer': `${summary.avgLateArrival} dk` },
      { 'Metrik': 'Ortalama Erken Çıkma', 'Değer': `${summary.avgEarlyLeave} dk` },
      { 'Metrik': 'Toplam Teslimat', 'Değer': summary.totalDeliveries },
      { 'Metrik': 'Ortalama Teslimat Süresi', 'Değer': `${summary.avgDeliveryTime} dk` },
    ];

    const ws2 = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Özet');

    // 3. Kurye bazlı performans
    const courierData = summary.courierStats.map(c => ({
      'Kurye': c.name,
      'Toplam Vardiya': c.totalShifts,
      'Uyumlu': c.compliantShifts,
      'Uyumsuz': c.nonCompliantShifts,
      'Geç Kalma (toplam dk)': c.totalLateMinutes,
      'Teslimat Sayısı': c.totalDeliveries,
      'Ort. Teslimat Süresi': `${c.avgDeliveryTime} dk`,
    }));

    const ws3 = XLSX.utils.json_to_sheet(courierData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Kurye Performansı');

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Genel workbook oluşturucu
   */
  private createWorkbook(
    data: any[], 
    columns: ExportColumn[], 
    fileName: string
  ): Buffer {
    const wb = XLSX.utils.book_new();
    
    // JSON'dan sheet oluştur
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Kolon genişliklerini ayarla
    const colWidths = columns.map(col => ({ wch: col.width || 15 }));
    ws['!cols'] = colWidths;
    
    // Sheet'i workbook'a ekle
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    
    // Buffer olarak döndür
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }
}
