"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  ArrowLeft, MapPin, Phone, Clock, DollarSign, Package, 
  TrendingUp, Star, Edit, Plus, Calendar, Download,
  ChevronRight, Users, CreditCard, Utensils
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MapWithNoSSR = dynamic(() => import("@/components/dashboard/map"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] bg-slate-100 rounded-xl flex items-center justify-center">
      <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  ),
});

// Mock restaurant data
const restaurantData = {
  id: 1,
  name: "Burger King",
  address: "Cumhuriyet Cad. No:15, Bodrum",
  phone: "0252 123 4567",
  email: "bodrum@burgerking.com",
  status: "active",
  rating: 4.5,
  totalOrders: 1450,
  monthlyOrders: 89,
  commission: 12,
  workingHours: "10:00 - 22:00",
  coordinates: { lat: 37.0344, lng: 27.4305 },
  manager: "Ahmet Yılmaz",
  managerPhone: "0555 123 4567",
  joinDate: "15 Mart 2023",
  contractEnd: "15 Mart 2026",
  monthlyRevenue: 48500,
  balance: 1250,
};

const orders = [
  { id: "ORD-001", customer: "Ali Veli", amount: 185, status: "delivered", time: "14:30", courier: "Mehmet K." },
  { id: "ORD-002", customer: "Ayşe Yılmaz", amount: 245, status: "delivered", time: "13:15", courier: "Ahmet S." },
  { id: "ORD-003", customer: "Fatma Şahin", amount: 120, status: "cancelled", time: "12:45", courier: "-" },
  { id: "ORD-004", customer: "Can Demir", amount: 320, status: "delivered", time: "11:20", courier: "Mehmet K." },
  { id: "ORD-005", customer: "Zeynep Kaya", amount: 95, status: "delivered", time: "10:45", courier: "Ahmet S." },
];

const menuItems = [
  { name: "Whopper Menü", price: 185, category: "Menüler", sales: 450 },
  { name: "King Chicken", price: 145, category: "Burgerler", sales: 320 },
  { name: "Patates Kızartması (Büyük)", price: 45, category: "Yan Ürünler", sales: 890 },
  { name: "Kola (1L)", price: 35, category: "İçecekler", sales: 1200 },
  { name: "Soğan Halkası", price: 55, category: "Yan Ürünler", sales: 230 },
];

const stats = {
  daily: { orders: 24, revenue: 4250 },
  weekly: { orders: 168, revenue: 28500 },
  monthly: { orders: 723, revenue: 125000 },
};

export default function RestaurantDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Restoran Detayı</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Edit className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Restaurant Info Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-3xl">
              🍔
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{restaurantData.name}</h2>
                <Badge className="bg-green-100 text-green-700">Aktif</Badge>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{restaurantData.rating}</span>
                <span className="text-slate-400">({restaurantData.totalOrders} değerlendirme)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
            <a href={`tel:${restaurantData.phone}`} className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-blue-700">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Ara</span>
            </a>
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Konum
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-slate-500">Bugün</p>
              <p className="text-lg font-bold text-slate-900">{stats.daily.orders}</p>
              <p className="text-xs text-green-600">{stats.daily.revenue}₺</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-slate-500">Bu Hafta</p>
              <p className="text-lg font-bold text-slate-900">{stats.weekly.orders}</p>
              <p className="text-xs text-green-600">{stats.weekly.revenue}₺</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-slate-500">Bu Ay</p>
              <p className="text-lg font-bold text-slate-900">{restaurantData.monthlyOrders}</p>
              <p className="text-xs text-green-600">{restaurantData.monthlyRevenue}₺</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 bg-white">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Özet</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Siparişler</TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Menü</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Location Map */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold">Konum</p>
                  <Button variant="ghost" size="sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    Yol Tarifi
                  </Button>
                </div>
                <div className="h-[150px] rounded-xl overflow-hidden">
                  <MapWithNoSSR />
                </div>
                <p className="text-sm text-slate-500 mt-2">{restaurantData.address}</p>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <p className="font-semibold mb-2">Restoran Bilgileri</p>
                
                <div className="flex justify-between">
                  <span className="text-slate-500">Çalışma Saatleri</span>
                  <span className="font-medium">{restaurantData.workingHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Komisyon Oranı</span>
                  <span className="font-medium">%{restaurantData.commission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Yetkili</span>
                  <span className="font-medium">{restaurantData.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kayıt Tarihi</span>
                  <span className="font-medium">{restaurantData.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sözleşme Bitiş</span>
                  <span className="font-medium">{restaurantData.contractEnd}</span>
                </div>
              </CardContent>
            </Card>

            {/* Balance */}
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Bakiye</p>
                    <p className="text-3xl font-bold">{restaurantData.balance}₺</p>
                  </div>
                  <Button className="bg-white text-green-600 hover:bg-green-50">
                    <Download className="w-4 h-4 mr-2" />
                    Ödeme Al
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{order.customer}</p>
                        <Badge className={order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {order.status === 'delivered' ? 'Teslim Edildi' : 'İptal'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">{order.time} • {order.courier}</p>
                    </div>
                    <p className="font-bold">{order.amount}₺</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="menu" className="space-y-3">
            {menuItems.map((item, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.category} • {item.sales} satış</p>
                    </div>
                    <p className="font-bold text-lg">{item.price}₺</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Ürün Ekle
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
