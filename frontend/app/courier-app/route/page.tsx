"use client";

import { useState } from "react";
import { 
  ArrowLeft, Navigation, MapPin, Clock, Package, Phone, 
  RotateCcw, Play, Square, Layers, Zap, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/components/dashboard/map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-slate-100 rounded-2xl flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  ),
});

const routeStops = [
  {
    id: 1,
    type: "pickup",
    name: "Burger King",
    address: "Cumhuriyet Cad. No:15",
    time: "14:30",
    distance: "0.5 km",
    duration: "2 dk",
    status: "completed",
    orderId: "KRY-001",
  },
  {
    id: 2,
    type: "pickup",
    name: "McDonald's",
    address: "Atatürk Bulvarı No:42",
    time: "14:45",
    distance: "1.2 km",
    duration: "5 dk",
    status: "current",
    orderId: "KRY-002",
  },
  {
    id: 3,
    type: "delivery",
    name: "Ali Veli",
    address: "Bahçelievler Mah. No:8",
    time: "15:00",
    distance: "0.8 km",
    duration: "4 dk",
    status: "pending",
    orderId: "KRY-001",
  },
  {
    id: 4,
    type: "delivery",
    name: "Ayşe Yılmaz",
    address: "Kıbrıs Şehitleri Cad. No:25",
    time: "15:15",
    distance: "1.5 km",
    duration: "7 dk",
    status: "pending",
    orderId: "KRY-002",
  },
];

export default function CourierRoutePage() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStop, setCurrentStop] = useState(1);

  const totalDistance = routeStops.reduce((acc, stop) => acc + parseFloat(stop.distance), 0);
  const totalDuration = routeStops.reduce((acc, stop) => acc + parseInt(stop.duration), 0);

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Rota Optimizasyonu</h1>
              <p className="text-sm text-blue-100">{routeStops.length} durak • {totalDistance} km • {totalDuration} dk</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Layers className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="h-[250px] relative">
            <MapWithNoSSR />
            
            {/* Route Overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Optimize Edildi</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Tahmini süre: 18 dk</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex gap-2">
              {!isNavigating ? (
                <Button 
                  className="flex-1 bg-blue-600 h-12"
                  onClick={() => setIsNavigating(true)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Navigasyonu Başlat
                </Button>
              ) : (
                <>
                  <Button 
                    variant="destructive" 
                    className="flex-1 h-12"
                    onClick={() => setIsNavigating(false)}
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Durdur
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stops List */}
      <div className="px-4 pb-6">
        <h3 className="font-semibold text-slate-900 mb-4">Rota Durakları</h3>
        
        <div className="space-y-0">
          {routeStops.map((stop, index) => (
            <div key={stop.id} className="relative">
              {/* Connector Line */}
              {index < routeStops.length - 1 && (
                <div className="absolute left-5 top-12 w-0.5 h-12 bg-slate-200" />
              )}
              
              <div className={`bg-white rounded-xl p-4 shadow-sm mb-3 ${
                stop.status === 'current' ? 'ring-2 ring-blue-500' : ''
              }`}>
                <div className="flex gap-4">
                  {/* Stop Number */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    stop.status === 'completed' ? 'bg-green-100 text-green-600' :
                    stop.status === 'current' ? 'bg-blue-600 text-white' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {stop.status === 'completed' ? (
                      <Navigation className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className={stop.type === 'pickup' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>
                            {stop.type === 'pickup' ? 'Alım' : 'Teslimat'}
                          </Badge>
                          <span className="text-xs text-slate-400">{stop.orderId}</span>
                        </div>
                        <p className="font-semibold text-slate-900 mt-1">{stop.name}</p>
                        <p className="text-sm text-slate-500">{stop.address}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Navigation className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /
                        {stop.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" /
                        {stop.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /
                        {stop.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
