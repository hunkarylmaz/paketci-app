"use client";

import { useState } from "react";
import { Plus, Search, MapPin, Phone, Clock, Edit, Trash2, MoreVertical, Utensils, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const restaurants = [
  {
    id: 1,
    name: "Burger King",
    address: "Cumhuriyet Cad. No:15, Bodrum",
    phone: "0252 123 4567",
    status: "active",
    totalOrders: 1450,
    monthlyOrders: 89,
    commission: 12,
    workingHours: "10:00 - 22:00",
  },
  {
    id: 2,
    name: "McDonald's",
    address: "Atatürk Bulvarı No:42, Bodrum",
    phone: "0252 234 5678",
    status: "active",
    totalOrders: 2100,
    monthlyOrders: 134,
    commission: 10,
    workingHours: "09:00 - 23:00",
  },
  {
    id: 3,
    name: "Pizza Hut",
    address: "Kıbrıs Şehitleri Cad. No:8, Bodrum",
    phone: "0252 345 6789",
    status: "inactive",
    totalOrders: 890,
    monthlyOrders: 0,
    commission: 15,
    workingHours: "11:00 - 21:00",
  },
];

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Restoranlar</h1>
          <p className="text-slate-500">{restaurants.length} restoran kayıtlı</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Restoran
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Aktif Restoran</p>
                <p className="text-2xl font-bold text-slate-900">2</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Utensils className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Bu Ay Teslimat</p>
                <p className="text-2xl font-bold text-slate-900">223</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Ortalama Komisyon</p>
                <p className="text-2xl font-bold text-slate-900">%12.3</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Restoran ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Restaurant List */}
      <div className="grid gap-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="border-slate-200 hover:border-blue-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                    <Utensils className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{restaurant.name}</h3>
                      <Badge
                        className={
                          restaurant.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                        }
                      >
                        {restaurant.status === "active" ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /
                        {restaurant.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" /
                        {restaurant.phone}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" /
                        {restaurant.workingHours}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-blue-600"
                    onClick={() => window.location.href = `/restaurants/${restaurant.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-slate-400 hover:text-purple-600"
                    onClick={() => window.location.href = '/restaurants/integrations'}
                  >
                    <Link2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Toplam Sipariş</p>
                  <p className="font-semibold text-slate-900">{restaurant.totalOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Bu Ay</p>
                  <p className="font-semibold text-slate-900">{restaurant.monthlyOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Komisyon</p>
                  <p className="font-semibold text-slate-900">%{restaurant.commission}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
