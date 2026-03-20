import { useState } from 'react';
import { 
  Download, FileSpreadsheet, Calendar, TrendingUp, 
  Utensils, Clock, DollarSign, Package, ChevronDown,
  BarChart3, MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function RestaurantReportsPage() {
  const [dateRange, setDateRange] = useState('last30days');
  const [isExporting, setIsExporting] = useState(false);

  // Restoran detaylı rapor indirme
  const downloadRestaurantReport = async () => {
    setIsExporting(true);
    try {
      const restaurantId = "current-restaurant-id"; // Auth'dan alınacak
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();
      
      const response = await fetch(
        `/api/reports/restaurant/detailed/export?restaurantId=${restaurantId}&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (!response.ok) throw new Error('Rapor indirilemedi');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `restoran-raporu-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Rapor indirme hatası:', error);
      alert('Rapor indirilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsExporting(false);
    }
  };

  const stats = {
    totalOrders: 156,
    completedOrders: 148,
    cancelledOrders: 8,
    totalRevenue: 12450,
    avgOrderValue: 79.80,
    avgDeliveryTime: 32,
  };

  const platformStats = [
    { name: 'Yemeksepeti', orders: 78, percentage: 50, color: 'bg-red-500' },
    { name: 'Getir', orders: 45, percentage: 29, color: 'bg-green-500' },
    { name: 'Trendyol', orders: 23, percentage: 15, color: 'bg-orange-500' },
    { name: 'Doğrudan', orders: 10, percentage: 6, color: 'bg-blue-500' },
  ];

  const hourlyData = [
    { hour: '09:00', orders: 5 },
    { hour: '10:00', orders: 8 },
    { hour: '11:00', orders: 15 },
    { hour: '12:00', orders: 28 },
    { hour: '13:00', orders: 32 },
    { hour: '14:00', orders: 18 },
    { hour: '15:00', orders: 12 },
    { hour: '16:00', orders: 10 },
    { hour: '17:00', orders: 14 },
    { hour: '18:00', orders: 25 },
    { hour: '19:00', orders: 30 },
    { hour: '20:00', orders: 22 },
    { hour: '21:00', orders: 15 },
    { hour: '22:00', orders: 8 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
          <p className="text-gray-500">Detaylı performans ve istatistik raporları</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Bugün</option>
            <option value="yesterday">Dün</option>
            <option value="last7days">Son 7 Gün</option>
            <option value="last30days">Son 30 Gün</option>
            <option value="thisMonth">Bu Ay</option>
            <option value="lastMonth">Geçen Ay</option>
          </select>

          <Button
            onClick={downloadRestaurantReport}
            disabled={isExporting}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {isExporting ? 'İndiriliyor...' : 'Excel Raporu İndir'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Toplam Sipariş
            </CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {stats.completedOrders} Tamamlanan
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                {stats.cancelledOrders} İptal
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Toplam Gelir
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString('tr-TR')} ₺</div>
            <p className="text-xs text-gray-500 mt-1">
              Ortalama: {stats.avgOrderValue.toFixed(2)} ₺ / sipariş
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ortalama Teslimat Süresi
            </CardTitle>
            <Clock className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDeliveryTime} dk</div>
            <p className="text-xs text-green-600 mt-1">
              Hedef sürenin altında ✓
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Platform Dağılımı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformStats.map((platform) => (
              <div key={platform.name} className="flex items-center gap-4">
                <div className="w-32 font-medium text-sm">{platform.name}</div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${platform.color} rounded-full`}
                      style={{ width: `${platform.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-medium">
                  {platform.orders}
                </div>
                <div className="w-12 text-right text-xs text-gray-500">
                  %{platform.percentage}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hourly Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Saatlik Sipariş Dağılımı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 md:grid-cols-14 gap-2">
            {hourlyData.map((data) => (
              <div 
                key={data.hour}
                className="text-center p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <div className="text-xs text-gray-500 mb-1">{data.hour}</div>
                <div className={`text-sm font-semibold ${
                  data.orders > 20 ? 'text-red-600' : 
                  data.orders > 10 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {data.orders}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-100" />
              <span>Düşük</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-orange-100" />
              <span>Orta</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-100" />
              <span>Yoğun</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Excel Rapor İçeriği</h3>
              <p className="text-sm text-blue-700 mt-1">
                İndirilen rapor şu sayfaları içerir:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
                <li>• Özet - Genel istatistikler ve performans metrikleri</li>
                <li>• Tüm Siparişler - Detaylı sipariş listesi</li>
                <li>• Saatlik Dağılım - Günlük saat bazlı analiz</li>
                <li>• Kurye Dağılımı - Kurye performansları</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
