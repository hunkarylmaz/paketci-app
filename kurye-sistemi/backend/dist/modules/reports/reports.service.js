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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const XLSX = require("xlsx");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const delivery_entity_1 = require("../deliveries/entities/delivery.entity");
const courier_entity_1 = require("../couriers/entities/courier.entity");
const restaurant_entity_1 = require("../restaurants/entities/restaurant.entity");
const user_entity_1 = require("../users/entities/user.entity");
const company_entity_1 = require("../companies/entities/company.entity");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
let ReportsService = class ReportsService {
    constructor(deliveryRepo, courierRepo, restaurantRepo, userRepo, companyRepo) {
        this.deliveryRepo = deliveryRepo;
        this.courierRepo = courierRepo;
        this.restaurantRepo = restaurantRepo;
        this.userRepo = userRepo;
        this.companyRepo = companyRepo;
    }
    async generateDealerSummaryReport(companyId, filters) {
        const deliveries = await this.deliveryRepo.find({
            where: {
                companyId,
                createdAt: (0, typeorm_2.Between)(filters.startDate || new Date(0), filters.endDate || new Date()),
            },
            relations: ['courier', 'restaurant'],
        });
        const couriers = await this.courierRepo.find({ where: { companyId } });
        const restaurants = await this.restaurantRepo.find({ where: { companyId } });
        const wb = XLSX.utils.book_new();
        const summaryData = this.generateDealerDashboardData(deliveries, couriers, restaurants, filters);
        const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, ws1, 'Özet');
        const dailyData = this.generateDailyPerformanceData(deliveries);
        const ws2 = XLSX.utils.aoa_to_sheet(dailyData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Günlük Performans');
        const courierData = this.generateCourierPerformanceData(deliveries, couriers);
        const ws3 = XLSX.utils.aoa_to_sheet(courierData);
        XLSX.utils.book_append_sheet(wb, ws3, 'Kurye Performansı');
        const restaurantData = this.generateRestaurantPerformanceData(deliveries, restaurants);
        const ws4 = XLSX.utils.aoa_to_sheet(restaurantData);
        XLSX.utils.book_append_sheet(wb, ws4, 'Restoran Performansı');
        const platformData = this.generatePlatformDistributionData(deliveries);
        const ws5 = XLSX.utils.aoa_to_sheet(platformData);
        XLSX.utils.book_append_sheet(wb, ws5, 'Platform Dağılımı');
        const financialData = this.generateFinancialSummaryData(deliveries);
        const ws6 = XLSX.utils.aoa_to_sheet(financialData);
        XLSX.utils.book_append_sheet(wb, ws6, 'Finansal Özet');
        return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
    generateDealerDashboardData(deliveries, couriers, restaurants, filters) {
        const totalDeliveries = deliveries.length;
        const completedDeliveries = deliveries.filter(d => d.status === 'delivered').length;
        const cancelledDeliveries = deliveries.filter(d => d.status === 'cancelled').length;
        const totalRevenue = deliveries.reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
        const avgDeliveryTime = this.calculateAvgDeliveryTime(deliveries);
        return [
            ['PAKETÇİ - BAYİ ÖZET RAPORU'],
            [''],
            ['Rapor Tarihi:', (0, date_fns_1.format)(new Date(), 'dd MMMM yyyy HH:mm', { locale: locale_1.tr })],
            ['Rapor Dönemi:', `${(0, date_fns_1.format)(filters.startDate || new Date(), 'dd.MM.yyyy')} - ${(0, date_fns_1.format)(filters.endDate || new Date(), 'dd.MM.yyyy')}`],
            [''],
            ['GENEL İSTATİSTİKLER'],
            ['Toplam Sipariş', totalDeliveries],
            ['Tamamlanan Teslimat', completedDeliveries],
            ['İptal Edilen', cancelledDeliveries],
            ['Başarı Oranı', `${((completedDeliveries / totalDeliveries) * 100).toFixed(1)}%`],
            [''],
            ['AKTİF KAYNAKLAR'],
            ['Aktif Kurye Sayısı', couriers.filter(c => c.isActive).length],
            ['Toplam Kurye Sayısı', couriers.length],
            ['Aktif Restoran', restaurants.filter(r => r.isActive).length],
            ['Toplam Restoran', restaurants.length],
            [''],
            ['FİNANSAL METRİKLER'],
            ['Toplam Gelir', `${totalRevenue.toFixed(2)} TL`],
            ['Ortalama Teslimat Ücreti', `${(totalRevenue / totalDeliveries || 0).toFixed(2)} TL`],
            ['Ortalama Teslimat Süresi', `${avgDeliveryTime} dk`],
        ];
    }
    generateDailyPerformanceData(deliveries) {
        const groupedByDate = this.groupByDate(deliveries);
        const dates = Object.keys(groupedByDate).sort();
        const data = [
            ['Tarih', 'Toplam Sipariş', 'Tamamlanan', 'İptal', 'Başarı %', 'Toplam Gelir (TL)', 'Ort. Süre (dk)'],
        ];
        for (const date of dates) {
            const dayDeliveries = groupedByDate[date];
            const completed = dayDeliveries.filter(d => d.status === 'delivered').length;
            const cancelled = dayDeliveries.filter(d => d.status === 'cancelled').length;
            const total = dayDeliveries.length;
            const revenue = dayDeliveries.reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
            const avgTime = this.calculateAvgDeliveryTime(dayDeliveries);
            data.push([
                date,
                total,
                completed,
                cancelled,
                `${((completed / total) * 100).toFixed(1)}%`,
                revenue.toFixed(2),
                avgTime,
            ]);
        }
        return data;
    }
    generateCourierPerformanceData(deliveries, couriers) {
        const data = [
            ['Kurye Adı', 'Telefon', 'Toplam Sipariş', 'Tamamlanan', 'İptal', 'Başarı %', 'Toplam Kazanç (TL)', 'Ort. Teslimat Süresi (dk)'],
        ];
        for (const courier of couriers) {
            const courierDeliveries = deliveries.filter(d => d.courierId === courier.id);
            const completed = courierDeliveries.filter(d => d.status === 'delivered').length;
            const cancelled = courierDeliveries.filter(d => d.status === 'cancelled').length;
            const total = courierDeliveries.length;
            const earnings = courierDeliveries.reduce((sum, d) => sum + (d.courierEarnings || 0), 0);
            const avgTime = this.calculateAvgDeliveryTime(courierDeliveries);
            data.push([
                `${courier.firstName} ${courier.lastName}`,
                courier.phone,
                total,
                completed,
                cancelled,
                total > 0 ? `${((completed / total) * 100).toFixed(1)}%` : '0%',
                earnings.toFixed(2),
                avgTime,
            ]);
        }
        return data;
    }
    generateRestaurantPerformanceData(deliveries, restaurants) {
        const data = [
            ['Restoran Adı', 'Telefon', 'Adres', 'Toplam Sipariş', 'Tamamlanan', 'İptal', 'Başarı %', 'Toplam Gelir (TL)'],
        ];
        for (const restaurant of restaurants) {
            const restaurantDeliveries = deliveries.filter(d => d.restaurantId === restaurant.id);
            const completed = restaurantDeliveries.filter(d => d.status === 'delivered').length;
            const cancelled = restaurantDeliveries.filter(d => d.status === 'cancelled').length;
            const total = restaurantDeliveries.length;
            const revenue = restaurantDeliveries.reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
            data.push([
                restaurant.name,
                restaurant.phone,
                restaurant.address,
                total,
                completed,
                cancelled,
                total > 0 ? `${((completed / total) * 100).toFixed(1)}%` : '0%',
                revenue.toFixed(2),
            ]);
        }
        return data;
    }
    generatePlatformDistributionData(deliveries) {
        const platforms = ['Yemeksepeti', 'Getir', 'Trendyol', 'Migros', 'Getir Çarşı', 'Fuudy', 'Doğrudan'];
        const data = [['Platform', 'Sipariş Sayısı', 'Oran %', 'Tamamlanan', 'İptal', 'Başarı %']];
        for (const platform of platforms) {
            const platformDeliveries = deliveries.filter(d => d.platform === platform || (platform === 'Doğrudan' && !d.platform));
            const completed = platformDeliveries.filter(d => d.status === 'delivered').length;
            const cancelled = platformDeliveries.filter(d => d.status === 'cancelled').length;
            const total = platformDeliveries.length;
            const percentage = deliveries.length > 0 ? ((total / deliveries.length) * 100).toFixed(1) : '0';
            data.push([
                platform,
                total,
                `${percentage}%`,
                completed,
                cancelled,
                total > 0 ? `${((completed / total) * 100).toFixed(1)}%` : '0%',
            ]);
        }
        return data;
    }
    generateFinancialSummaryData(deliveries) {
        const completed = deliveries.filter(d => d.status === 'delivered');
        const totalDeliveryFee = completed.reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
        const totalTips = completed.reduce((sum, d) => sum + (d.tip || 0), 0);
        const totalCourierEarnings = completed.reduce((sum, d) => sum + (d.courierEarnings || 0), 0);
        const totalCompanyRevenue = totalDeliveryFee - totalCourierEarnings;
        return [
            ['FİNANSAL ÖZET'],
            [''],
            ['Gelir Kalemleri', 'Tutar (TL)'],
            ['Teslimat Ücretleri', totalDeliveryFee.toFixed(2)],
            ['Müşteri Bahşişleri', totalTips.toFixed(2)],
            ['Toplam Gelir', (totalDeliveryFee + totalTips).toFixed(2)],
            [''],
            ['Gider Kalemleri', 'Tutar (TL)'],
            ['Kurye Ödemeleri', totalCourierEarnings.toFixed(2)],
            ['Net Firma Geliri', totalCompanyRevenue.toFixed(2)],
        ];
    }
    async generateRestaurantDetailedReport(restaurantId, filters) {
        const deliveries = await this.deliveryRepo.find({
            where: {
                restaurantId,
                createdAt: (0, typeorm_2.Between)(filters.startDate || new Date(0), filters.endDate || new Date()),
            },
            relations: ['courier'],
            order: { createdAt: 'DESC' },
        });
        const restaurant = await this.restaurantRepo.findOne({ where: { id: restaurantId } });
        const wb = XLSX.utils.book_new();
        const summaryData = this.generateRestaurantSummaryData(restaurant, deliveries, filters);
        const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, ws1, 'Özet');
        const ordersData = this.generateDetailedOrdersData(deliveries);
        const ws2 = XLSX.utils.aoa_to_sheet(ordersData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Tüm Siparişler');
        const hourlyData = this.generateHourlyDistributionData(deliveries);
        const ws3 = XLSX.utils.aoa_to_sheet(hourlyData);
        XLSX.utils.book_append_sheet(wb, ws3, 'Saatlik Dağılım');
        const courierBreakdown = this.generateCourierBreakdownData(deliveries);
        const ws4 = XLSX.utils.aoa_to_sheet(courierBreakdown);
        XLSX.utils.book_append_sheet(wb, ws4, 'Kurye Dağılımı');
        return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
    generateRestaurantSummaryData(restaurant, deliveries, filters) {
        const completed = deliveries.filter(d => d.status === 'delivered');
        const cancelled = deliveries.filter(d => d.status === 'cancelled');
        const avgPreparationTime = this.calculateAvgPreparationTime(deliveries);
        const avgDeliveryTime = this.calculateAvgDeliveryTime(deliveries);
        return [
            ['PAKETÇİ - RESTORAN DETAYLI RAPORU'],
            [''],
            ['Restoran Bilgileri'],
            ['Restoran Adı', restaurant?.name || 'Bilinmiyor'],
            ['Telefon', restaurant?.phone || '-'],
            ['Adres', restaurant?.address || '-'],
            [''],
            ['Rapor Dönemi', `${(0, date_fns_1.format)(filters.startDate || new Date(), 'dd.MM.yyyy')} - ${(0, date_fns_1.format)(filters.endDate || new Date(), 'dd.MM.yyyy')}`],
            ['Rapor Tarihi', (0, date_fns_1.format)(new Date(), 'dd MMMM yyyy HH:mm', { locale: locale_1.tr })],
            [''],
            ['PERFORMANS METRİKLERİ'],
            ['Toplam Sipariş', deliveries.length],
            ['Tamamlanan Teslimat', completed.length],
            ['İptal Edilen', cancelled.length],
            ['Başarı Oranı', `${((completed.length / deliveries.length) * 100).toFixed(1)}%`],
            [''],
            ['ZAMAN METRİKLERİ'],
            ['Ortalama Hazırlık Süresi', `${avgPreparationTime} dk`],
            ['Ortalama Teslimat Süresi', `${avgDeliveryTime} dk`],
            ['Toplam Teslimat Süresi', `${avgPreparationTime + avgDeliveryTime} dk`],
            [''],
            ['FİNANSAL BİLGİLER'],
            ['Toplam Teslimat Ücreti', `${completed.reduce((sum, d) => sum + (d.deliveryFee || 0), 0).toFixed(2)} TL`],
            ['Ortalama Sipariş Tutarı', `${(completed.reduce((sum, d) => sum + (d.orderAmount || 0), 0) / completed.length || 0).toFixed(2)} TL`],
        ];
    }
    generateDetailedOrdersData(deliveries) {
        const data = [
            ['Sipariş No', 'Tarih', 'Saat', 'Müşteri', 'Adres', 'Kurye', 'Durum', 'Platform', 'Tutar (TL)', 'Teslimat Ücreti (TL)', 'Süre (dk)'],
        ];
        for (const d of deliveries) {
            data.push([
                d.orderNumber || d.id.slice(0, 8),
                (0, date_fns_1.format)(new Date(d.createdAt), 'dd.MM.yyyy'),
                (0, date_fns_1.format)(new Date(d.createdAt), 'HH:mm'),
                d.customerName || '-',
                d.deliveryAddress?.substring(0, 50) || '-',
                d.courier ? `${d.courier.firstName} ${d.courier.lastName}` : 'Atanmadı',
                this.translateStatus(d.status),
                d.platform || 'Doğrudan',
                (d.orderAmount || 0).toFixed(2),
                (d.deliveryFee || 0).toFixed(2),
                this.calculateDeliveryDuration(d),
            ]);
        }
        return data;
    }
    generateHourlyDistributionData(deliveries) {
        const hours = {};
        for (let i = 0; i < 24; i++)
            hours[i] = 0;
        for (const d of deliveries) {
            const hour = new Date(d.createdAt).getHours();
            hours[hour]++;
        }
        const data = [['Saat Aralığı', 'Sipariş Sayısı', 'Yoğunluk']];
        for (let i = 0; i < 24; i++) {
            const count = hours[i];
            const intensity = count > 10 ? '🔴 Yoğun' : count > 5 ? '🟡 Orta' : '🟢 Düşük';
            data.push([`${i.toString().padStart(2, '0')}:00 - ${i.toString().padStart(2, '0')}:59`, count.toString(), intensity]);
        }
        return data;
    }
    generateCourierBreakdownData(deliveries) {
        const grouped = this.groupByCourier(deliveries);
        const data = [['Kurye Adı', 'Toplam Teslimat', 'Ortalama Süre (dk)', 'Müşteri Puanı']];
        for (const [courierName, courierDeliveries] of Object.entries(grouped)) {
            const avgTime = this.calculateAvgDeliveryTime(courierDeliveries);
            const avgRating = courierDeliveries
                .filter(d => d.rating)
                .reduce((sum, d) => sum + (d.rating || 0), 0) / courierDeliveries.filter(d => d.rating).length || 0;
            data.push([courierName, courierDeliveries.length.toString(), avgTime.toString(), avgRating.toFixed(1)]);
        }
        return data;
    }
    groupByDate(deliveries) {
        return deliveries.reduce((acc, d) => {
            const date = (0, date_fns_1.format)(new Date(d.createdAt), 'yyyy-MM-dd');
            if (!acc[date])
                acc[date] = [];
            acc[date].push(d);
            return acc;
        }, {});
    }
    groupByCourier(deliveries) {
        return deliveries.reduce((acc, d) => {
            const name = d.courier ? `${d.courier.firstName} ${d.courier.lastName}` : 'Atanmamış';
            if (!acc[name])
                acc[name] = [];
            acc[name].push(d);
            return acc;
        }, {});
    }
    calculateAvgDeliveryTime(deliveries) {
        const validDeliveries = deliveries.filter(d => d.pickupTime && d.deliveryTime);
        if (validDeliveries.length === 0)
            return 0;
        const totalMinutes = validDeliveries.reduce((sum, d) => {
            const pickup = new Date(d.pickupTime).getTime();
            const delivery = new Date(d.deliveryTime).getTime();
            return sum + (delivery - pickup) / (1000 * 60);
        }, 0);
        return Math.round(totalMinutes / validDeliveries.length);
    }
    calculateAvgPreparationTime(deliveries) {
        const validDeliveries = deliveries.filter(d => d.createdAt && d.pickupTime);
        if (validDeliveries.length === 0)
            return 0;
        const totalMinutes = validDeliveries.reduce((sum, d) => {
            const created = new Date(d.createdAt).getTime();
            const pickup = new Date(d.pickupTime).getTime();
            return sum + (pickup - created) / (1000 * 60);
        }, 0);
        return Math.round(totalMinutes / validDeliveries.length);
    }
    calculateDeliveryDuration(delivery) {
        if (!delivery.pickupTime || !delivery.deliveryTime)
            return 0;
        const pickup = new Date(delivery.pickupTime).getTime();
        const delivery_time = new Date(delivery.deliveryTime).getTime();
        return Math.round((delivery_time - pickup) / (1000 * 60));
    }
    translateStatus(status) {
        const translations = {
            pending: 'Bekliyor',
            assigned: 'Atandı',
            picked_up: 'Alındı',
            in_transit: 'Yolda',
            delivered: 'Teslim Edildi',
            cancelled: 'İptal Edildi',
        };
        return translations[status] || status;
    }
    async getDashboardStats(companyId) {
        const today = new Date();
        const startOfToday = (0, date_fns_1.startOfDay)(today);
        const endOfToday = (0, date_fns_1.endOfDay)(today);
        const [todayDeliveries, totalCouriers, activeCouriers, totalRestaurants] = await Promise.all([
            this.deliveryRepo.count({
                where: {
                    companyId,
                    createdAt: (0, typeorm_2.Between)(startOfToday, endOfToday),
                },
            }),
            this.courierRepo.count({ where: { companyId } }),
            this.courierRepo.count({ where: { companyId, isActive: true } }),
            this.restaurantRepo.count({ where: { companyId } }),
        ]);
        return {
            todayDeliveries,
            totalCouriers,
            activeCouriers,
            totalRestaurants,
        };
    }
    async getCourierPerformance(companyId, startDate, endDate) {
        return this.courierRepo.find({
            where: { companyId },
            relations: ['deliveries'],
        });
    }
    async getRestaurantPerformance(companyId, startDate, endDate) {
        return this.restaurantRepo.find({
            where: { companyId },
            relations: ['deliveries'],
        });
    }
    async getFinancialReport(companyId, startDate, endDate) {
        const deliveries = await this.deliveryRepo.find({
            where: {
                companyId,
                createdAt: (0, typeorm_2.Between)(startDate, endDate),
                status: delivery_entity_1.DeliveryStatus.DELIVERED,
            },
        });
        const totalRevenue = deliveries.reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
        const totalTips = deliveries.reduce((sum, d) => sum + (d.tip || 0), 0);
        return {
            totalDeliveries: deliveries.length,
            totalRevenue,
            totalTips,
            totalIncome: totalRevenue + totalTips,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(delivery_entity_1.Delivery)),
    __param(1, (0, typeorm_1.InjectRepository)(courier_entity_1.Courier)),
    __param(2, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map