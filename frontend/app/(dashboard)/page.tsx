"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  Package, Users, MapPin, Clock, Search, Filter, Grid3X3, List, 
  Download, FileSpreadsheet, TrendingUp, Calendar, Map,
  ChevronDown, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Leaflet dynamic import for SSR
const MapWithNoSSR = dynamic(() => import("@/components/dashboard/advanced-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  ),
});

const courierStats = {
  total: 7,
  active: 0,
  onDelivery: 1,
  passive: 6,
};

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeTab, setActiveTab] = useState("waiting");
  const [isExporting, setIsExporting] = useState(false);

  // Excel Rapor İndirme
  const downloadDealerReport = async () => {
    setIsExporting(true);
    try {
      const companyId = "current-company-id"; // Auth'dan alınacak
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();
      
      const response = await fetch(
        `/api/reports/dealer/summary/export?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`,
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
      a.download = `bayi-raporu-${new Date().toISOString().split('T')[0]}.xlsx`;
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

  const downloadCourierReport = async () => {
    setIsExporting(true);
    try {
      const companyId = "current-company-id";
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();
      
      const response = await fetch(
        `/api/reports/dealer/summary/export?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`,
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
      a.download = `kurye-performans-raporu-${new Date().toISOString().split('T')[0]}.xlsx`;
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

  return (
    <div className="p-6 space-y-6">
      {/* Header with Export Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Bayi yönetim paneli ve performans özeti</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={downloadDealerReport}
            disabled={isExporting}
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            {isExporting ? 'İndiriliyor...' : 'Bayi Raporu'}
          </Button>
          
          <Button
            variant="outline"
            className="gap-2"
            onClick={downloadCourierReport}
            disabled={isExporting}
          >
            <BarChart3 className="w-4 h-4 text-blue-600" />
            {isExporting ? 'İndiriliyor...' : 'Kurye Raporu'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Toplam Sipariş</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Aktif Kurye</CardTitle>
            <Users className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courierStats.active}</div>
            <p className="text-xs text-gray-500 mt-1">/ {courierStats.total} toplam kurye</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Ort. Teslimat Süresi</CardTitle>
            <Clock className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 dk</div>
            <p className="text-xs text-green-600 mt-1">Hedef: 30 dk altı</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Başarı Oranı</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.8%</div>
            <p className="text-xs text-gray-500 mt-1">Son 30 gün</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Map Section */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              <CardTitle className="text-lg font-semibold">Canlı Kurye Takibi - OpenStreetMap</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-0">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                Gerçek Zamanlı
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            {/* Courier Stats Overlay */}
            <div className="absolute top-4 left-4 z-[400] bg-white rounded-xl shadow-lg p-4 min-w-[280px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Kuryeler ({courierStats.total})</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Aktif ({courierStats.active})
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  Yolda ({courierStats.onDelivery})
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  Pasif ({courierStats.passive})
                </Badge>
              </div>

              <p className="text-sm text-gray-500 mt-3 text-center py-2 bg-gray-50 rounded-lg">
                Çevrimiçi kurye bulunmuyor
              </p>
            </div>

            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 z-[400] bg-white rounded-xl shadow-lg p-2 space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <MapPin className="w-4 h-4" />
                Tüm Kuryeler
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                Aktif Kuryeler
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                Teslimatta
              </Button>
            </div>

            {/* Advanced Map */}
            <MapWithNoSSR />
          </div>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger
                  value="waiting"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span>Bekleyen Siparişler</span>
                    <Badge className="bg-white text-gray-700">0</Badge>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="onway"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span>Yoldaki Siparişler</span>
                    <Badge className="bg-white text-gray-700">1</Badge>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-lg">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-lg">
                <List className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-lg">
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 px-4 py-3 bg-gray-50 rounded-t-xl text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div>Sipariş</div>
            <div>Müşteri</div>
            <div>Restoran</div>
            <div>Adres</div>
            <div>Mesafe</div>
            <div>Saat</div>
            <div>Durum</div>
          </div>

          {/* Empty State */}
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Bu kategoride sipariş bulunmamaktadır</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
