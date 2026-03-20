"use client";

import { useState } from "react";
import { Plus, Search, MapPin, Phone, Package, Clock, ChevronRight, Filter, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const orders = [
  {
    id: "KRY-240317-001",
    customer: "Ali Veli",
    phone: "0555 123 4567",
    address: "Cumhuriyet Mah. Atatürk Cad. No:15",
    restaurant: "Burger King",
    amount: 285.50,
    paymentType: "Nakit",
    status: "pending",
    distance: "2.3 km",
    time: "14:30",
  },
  {
    id: "KRY-240317-002",
    customer: "Ayşe Yılmaz",
    phone: "0555 234 5678",
    address: "Kıbrıs Şehitleri Cad. No:42",
    restaurant: "McDonald's",
    amount: 145.00,
    paymentType: "Kredi Kartı",
    status: "assigned",
    distance: "1.8 km",
    time: "14:25",
    courier: "Ahmet Y.",
  },
  {
    id: "KRY-240317-003",
    customer: "Mehmet Demir",
    phone: "0555 345 6789",
    address: "Bahçelievler Mah. No:8",
    restaurant: "Pizza Hut",
    amount: 320.00,
    paymentType: "Nakit",
    status: "delivered",
    distance: "3.1 km",
    time: "14:15",
    courier: "Mehmet K.",
  },
];

const statusColors = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Bekliyor" },
  assigned: { bg: "bg-blue-100", text: "text-blue-700", label: "Atandı" },
  picked_up: { bg: "bg-purple-100", text: "text-purple-700", label: "Alındı" },
  delivered: { bg: "bg-green-100", text: "text-green-700", label: "Teslim Edildi" },
  cancelled: { bg: "bg-red-100", text: "text-red-700", label: "İptal" },
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Siparişler</h1>
          <p className="text-slate-500">{orders.length} aktif sipariş</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Sipariş
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Bekleyen", value: 8, color: "bg-yellow-100 text-yellow-700" },
          { label: "Yolda", value: 5, color: "bg-blue-100 text-blue-700" },
          { label: "Teslim Edilen", value: 50, color: "bg-green-100 text-green-700" },
          { label: "İptal", value: 2, color: "bg-red-100 text-red-700" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color.split(" ")[1]}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="current" className="data-[state=active]:bg-white">Güncel</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white">Geçmiş</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Sipariş ara..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Sipariş</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Müşteri</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Restoran</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Adres</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Tutar</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Durum</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = statusColors[order.status as keyof typeof statusColors];
                  return (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">{order.id}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{order.time}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-slate-900">{order.customer}</p>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Phone className="w-3 h-3" /
                          {order.phone}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-slate-900">{order.restaurant}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-1 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                          <div>
                            <p>{order.address}</p>
                            <p className="text-xs text-slate-400">{order.distance}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-900">{order.amount}₺</p>
                        <Badge variant="secondary" className="text-xs mt-1">{order.paymentType}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${status.bg} ${status.text} border-0`}>{status.label}</Badge>
                        {order.courier && (
                          <p className="text-xs text-slate-500 mt-1">{order.courier}</p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
