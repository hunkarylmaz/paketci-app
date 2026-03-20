"use client";

import { useState } from "react";
import { Plus, Search, Phone, MapPin, Star, Package, DollarSign, Edit, Trash2, MoreVertical, Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const couriers = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    phone: "0555 123 4567",
    status: "active",
    rating: 4.8,
    totalDeliveries: 1250,
    todayDeliveries: 12,
    earnings: 3500,
    vehicleType: "Motosiklet",
    plate: "48 AB 123",
    workingType: "Paket Başı",
    isOnline: true,
    lastLocation: "Bodrum Merkez",
  },
  {
    id: 2,
    name: "Mehmet Kaya",
    phone: "0555 234 5678",
    status: "active",
    rating: 4.5,
    totalDeliveries: 890,
    todayDeliveries: 8,
    earnings: 2400,
    vehicleType: "Motosiklet",
    plate: "48 CD 456",
    workingType: "Saatlik",
    isOnline: false,
    lastLocation: "2 saat önce",
  },
  {
    id: 3,
    name: "Ali Demir",
    phone: "0555 345 6789",
    status: "inactive",
    rating: 4.2,
    totalDeliveries: 450,
    todayDeliveries: 0,
    earnings: 0,
    vehicleType: "Araba",
    plate: "48 EF 789",
    workingType: "Paket Başı",
    isOnline: false,
    lastLocation: "Dün",
  },
];

export default function CouriersPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCouriers = couriers.filter((c) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return c.status === "active";
    if (activeTab === "inactive") return c.status === "inactive";
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kuryeler</h1>
          <p className="text-slate-500">{couriers.length} kurye kayıtlı</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Kurye
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Toplam</p>
                <p className="text-xl font-bold text-slate-900">{couriers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Aktif</p>
                <p className="text-xl font-bold text-slate-900">{couriers.filter((c) => c.isOnline).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Bugün</p>
                <p className="text-xl font-bold text-slate-900">20</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Günlük Kazanç</p>
                <p className="text-xl font-bold text-slate-900">5,900₺</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">
              Tümü ({couriers.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-white">
              Aktif ({couriers.filter((c) => c.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="inactive" className="data-[state=active]:bg-white">
              Pasif ({couriers.filter((c) => c.status === "inactive").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Kurye ara..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Courier Cards */}
      <div className="grid gap-4">
        {filteredCouriers.map((courier) => (
          <Card key={courier.id} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-slate-500">{courier.name.charAt(0)}</span>
                    </div>
                    {courier.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{courier.name}</h3>
                      <Badge
                        className={
                          courier.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }
                      >
                        {courier.status === "active" ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" /
                        {courier.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" /
                        {courier.rating}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        {courier.vehicleType}
                      </Badge>
                      <span className="text-sm text-slate-600">{courier.plate}</span>
                      <Badge className="bg-blue-50 text-blue-700 text-xs">
                        {courier.workingType}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 mt-2 text-sm text-slate-400">
                      <MapPin className="w-4 h-4" /
                      {courier.lastLocation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-xs text-slate-500">Toplam Teslimat</p>
                  <p className="text-lg font-bold text-slate-900">{courier.totalDeliveries}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Bugün</p>
                  <p className="text-lg font-bold text-slate-900">{courier.todayDeliveries}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Kazanç</p>
                  <p className="text-lg font-bold text-green-600">{courier.earnings}₺</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
