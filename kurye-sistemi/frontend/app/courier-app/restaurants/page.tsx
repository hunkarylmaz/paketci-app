"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  MapPin, Navigation, Phone, Clock, Star, Package,
  Search, Filter, ChevronRight, Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MapWithNoSSR = dynamic(() => import("@/components/dashboard/map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-slate-100 rounded-2xl flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  ),
});

const nearbyRestaurants = [
  {
    id: 1,
    name: "Burger King",
    address: "Cumhuriyet Cad. No:15",
    distance: "0.5 km",
    rating: 4.5,
    deliveryTime: "25-35 dk",
    isOpen: true,
    image: "🍔",
    commission: "%15",
    monthlyOrders: 245,
  },
  {
    id: 2,
    name: "McDonald's",
    address: "Atatürk Bulvarı No:42",
    distance: "1.2 km",
    rating: 4.3,
    deliveryTime: "20-30 dk",
    isOpen: true,
    image: "🍟",
    commission: "%12",
    monthlyOrders: 189,
  },
  {
    id: 3,
    name: "Pizza Hut",
    address: "Kıbrıs Şehitleri Cad. No:8",
    distance: "2.1 km",
    rating: 4.1,
    deliveryTime: "35-45 dk",
    isOpen: false,
    image: "🍕",
    commission: "%18",
    monthlyOrders: 156,
  },
  {
    id: 4,
    name: "Dominos Pizza",
    address: "Bahçelievler Mah. No:23",
    distance: "1.8 km",
    rating: 4.4,
    deliveryTime: "30-40 dk",
    isOpen: true,
    image: "🍕",
    commission: "%14",
    monthlyOrders: 198,
  },
];

export default function RestaurantMapPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Yakındaki Restoranlar</h1>
            <p className="text-sm text-blue-100">{nearbyRestaurants.length} restoran bulundu</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-white ${viewMode === 'map' ? 'bg-white/20' : ''}`}
              onClick={() => setViewMode('map')}
            >
              Harita
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={`text-white ${viewMode === 'list' ? 'bg-white/20' : ''}`}
              onClick={() => setViewMode('list')}
            >
              Liste
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Restoran ara..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:bg-white/20"
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["Tümü", "Açık", "En Yakın", "En İyi Puan", "Hızlı Teslimat"].map((filter, idx) => (
            <Button
              key={filter}
              variant={idx === 0 ? "default" : "outline"}
              size="sm"
              className={idx === 0 ? "bg-blue-600" : "whitespace-nowrap"}
            >
              {filter}
            </Button>
          ))}
        </div>

        {viewMode === "map" ? (
          <>
            {/* Map */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="h-[300px] relative">
                <MapWithNoSSR />
                
                {/* User Location Overlay */}
                <div className="absolute bottom-4 left-4 bg-white rounded-xl p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Konumunuz</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">Yakındaki Restoranlar</h3>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  Tümünü Gör
                </Button>
              </div>

              <div className="space-y-3">
                {nearbyRestaurants.map((restaurant) => (
                  <Card 
                    key={restaurant.id}
                    className={`cursor-pointer transition-all ${
                      selectedRestaurant?.id === restaurant.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                          {restaurant.image}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-900">{restaurant.name}</p>
                                <Badge className={restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                  {restaurant.isOpen ? 'Açık' : 'Kapalı'}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-500">{restaurant.address}</p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Navigation className="w-5 h-5 text-blue-600" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-3 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-slate-600">
                              <MapPin className="w-4 h-4" /
                              {restaurant.distance}
                            </span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <Clock className="w-4 h-4" /
                              {restaurant.deliveryTime}
                            </span>
                            <span className="flex items-center gap-1 text-amber-600">
                              <Star className="w-4 h-4 fill-amber-400" /
                              {restaurant.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* List View */
          <div className="space-y-3">
            {nearbyRestaurants.map((restaurant) => (
              <Card key={restaurant.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-3xl">
                      {restaurant.image}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-lg text-slate-900">{restaurant.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                              {restaurant.isOpen ? 'Açık' : 'Kapalı'}
                            </Badge>
                            <Badge variant="secondary">Komisyon: {restaurant.commission}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-amber-600">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span className="font-semibold">{restaurant.rating}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-600 mt-2">{restaurant.address}</p>

                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-500">Mesafe</p>
                          <p className="font-medium">{restaurant.distance}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-500">Süre</p>
                          <p className="font-medium">{restaurant.deliveryTime}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-500">Sipariş</p>
                          <p className="font-medium">{restaurant.monthlyOrders}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" className="flex-1">
                          <Phone className="w-4 h-4 mr-2" />
                          Ara
                        </Button>
                        <Button className="flex-1 bg-blue-600">
                          <Navigation className="w-4 h-4 mr-2" />
                          Yol Tarifi
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
