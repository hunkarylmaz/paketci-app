"use client";

import { useState } from "react";
import { 
  MapPin, Phone, Clock, CheckCircle2, XCircle, Navigation, Camera, Package, 
  Star, DollarSign, ChevronRight, Play, Square, Pause, History, Settings,
  MessageSquare, AlertCircle, Route, CreditCard, Receipt, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const todayStats = {
  completed: 12,
  earnings: 350,
  rating: 4.8,
  onlineHours: 6.5,
  tip: 45,
};

const currentDeliveries = [
  {
    id: "KRY-240317-001",
    customer: "Ali Veli",
    phone: "0555 123 4567",
    address: "Cumhuriyet Mah. Atatürk Cad. No:15, D:3",
    restaurant: "Burger King",
    orderAmount: 285.50,
    paymentType: "Nakit",
    notes: "Apartman girişinde zil çalmayın",
    estimatedTime: "12 dk",
    distance: "2.3 km",
    status: "picked_up",
    items: ["Whopper Menü", "Patates Kızartması", "Kola"],
  },
  {
    id: "KRY-240317-002",
    customer: "Ayşe Yılmaz",
    phone: "0555 234 5678",
    address: "Kıbrıs Şehitleri Cad. No:42",
    restaurant: "McDonald's",
    orderAmount: 145.00,
    paymentType: "Kredi Kartı",
    notes: "",
    estimatedTime: "8 dk",
    distance: "1.8 km",
    status: "assigned",
    items: ["Big Mac Menü"],
  },
];

const completedDeliveries = [
  {
    id: "KRY-240317-000",
    customer: "Mehmet Demir",
    restaurant: "Pizza Hut",
    amount: 185.00,
    time: "13:45",
    status: "delivered",
    rating: 5,
  },
  {
    id: "KRY-240317-099",
    customer: "Fatma Şahin",
    restaurant: "Dominos",
    amount: 120.50,
    time: "13:20",
    status: "delivered",
    rating: 4,
  },
];

export default function CourierAppPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const [selectedDelivery, setSelectedDelivery] = useState(currentDeliveries[0]);
  const [deliveryStatus, setDeliveryStatus] = useState(selectedDelivery.status);
  const [showDetail, setShowDetail] = useState(false);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
  };

  const updateStatus = (newStatus: string) => {
    setDeliveryStatus(newStatus);
    // API call would go here
  };

  // Detail View
  if (showDetail && selectedDelivery) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-3 p-4">
            <Button variant="ghost" size="icon" onClick={() => setShowDetail(false)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold text-slate-900">Sipariş Detayı</h1>
              <p className="text-sm text-slate-500">#{selectedDelivery.id}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Restaurant Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selectedDelivery.restaurant}</p>
                  <Badge className="bg-green-100 text-green-700">Paket Hazır</Badge>
                </div>
              </div>
              <Button size="sm" className="bg-blue-600">
                <Navigation className="w-4 h-4 mr-1" />
                Yol Tarifi
              </Button>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <p className="font-medium text-slate-900 mb-3">Sipariş İçeriği</p>
            <ul className="space-y-2">
              {selectedDelivery.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium">
                    {idx + 1}
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <p className="font-medium text-slate-900 mb-3">Müşteri Bilgileri</p>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-slate-600">{selectedDelivery.customer.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{selectedDelivery.customer}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-slate-600">4.9 (125 değerlendirme)</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${selectedDelivery.phone}`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-medium"
            >
              <Phone className="w-5 h-5" />
              {selectedDelivery.phone}
            </a>

            <div className="mt-4 p-4 bg-slate-50 rounded-xl">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-900">{selectedDelivery.address}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-4 h-4" /
                      {selectedDelivery.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /
                      Tahmini {selectedDelivery.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedDelivery.notes && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <p className="text-yellow-800">{selectedDelivery.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-600">Ödeme Yöntemi</span>
              <Badge className="bg-green-100 text-green-700">{selectedDelivery.paymentType}</Badge>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="font-semibold text-slate-900">Toplam Tutar</span>
              <span className="text-2xl font-bold text-slate-900">{selectedDelivery.orderAmount}₺</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-6">
            {deliveryStatus === "assigned" && (
              <Button
                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
                onClick={() => updateStatus("picked_up")}
              >
                <Package className="w-5 h-5 mr-2" />
                Paketi Aldım
              </Button>
            )}

            {deliveryStatus === "picked_up" && (
              <>
                <Button
                  className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                  onClick={() => updateStatus("delivered")}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Teslim Ettim
                </Button>
                <Button variant="outline" className="w-full h-12">
                  <Camera className="w-5 h-5 mr-2" />
                  Fotoğraf Çek
                </Button>
              </>
            )}

            {deliveryStatus === "delivered" && (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-xl font-semibold text-slate-900">Teslimat Tamamlandı! ✅</p>
                <p className="text-slate-500 mt-2">+29₺ kazancınız eklendi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main View
  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
      {/* Header with Online Toggle */}
      <div className={`${isOnline ? 'bg-blue-600' : 'bg-slate-600'} text-white p-4 transition-colors`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleOnline}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${isOnline ? 'bg-white/20' : 'bg-white/10'}`}
            >
              <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <div>
              <p className="font-medium">{isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}</p>
              <p className="text-xs text-white/70">{isOnline ? 'Sipariş almaya hazır' : 'Mola veriyorsunuz'}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/70">Bugünkü Kazanç</p>
            <p className="text-3xl font-bold">{todayStats.earnings}₺</p>
            <p className="text-xs text-white/70 mt-1">+{todayStats.tip}₺ bahşiş</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/70">Tamamlanan</p>
            <p className="text-3xl font-bold">{todayStats.completed}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>{todayStats.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-white rounded-none border-b">
          <TabsTrigger value="current" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
            Aktif ({currentDeliveries.length})
          </TabsTrigger>
          <TabsTrigger value="available" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
            Mevcut (5)
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
            Geçmiş
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="p-4 space-y-4">
          {currentDeliveries.map((delivery) => (
            <div 
              key={delivery.id}
              onClick={() => {
                setSelectedDelivery(delivery);
                setDeliveryStatus(delivery.status);
                setShowDetail(true);
              }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{delivery.restaurant}</p>
                    <p className="text-sm text-slate-500">{delivery.customer}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <MapPin className="w-3 h-3" />
                      {delivery.distance}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{delivery.orderAmount}₺</p>
                  <Badge className={delivery.status === 'picked_up' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}>
                    {delivery.status === 'picked_up' ? 'Yolda' : 'Yeni'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}

          {currentDeliveries.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aktif siparişiniz yok</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Restoran #{i}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <MapPin className="w-3 h-3" /
                      {1 + i * 0.5} km
                      <Clock className="w-3 h-3 ml-2" /
                      {5 + i} dk
                    </div>
                  </div>
                </div>
                <Button size="sm" className="bg-blue-600">
                  Kabul Et
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="p-4 space-y-4">
          {completedDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{delivery.restaurant}</p>
                  <p className="text-sm text-slate-500">{delivery.customer}</p>
                  <p className="text-xs text-slate-400 mt-1">{delivery.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+{delivery.amount * 0.1}₺</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">{delivery.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 max-w-md mx-auto">
        <div className="grid grid-cols-5 gap-1">
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2" onClick={() => window.location.href = '/courier-app/earnings'}>
            <DollarSign className="w-5 h-5" />
            <span className="text-xs">Kazanç</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2" onClick={() => window.location.href = '/courier-app/route'}>
            <Route className="w-5 h-5" />
            <span className="text-xs">Rota</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2" onClick={() => window.location.href = '/courier-app/settlement'}>
            <Receipt className="w-5 h-5" />
            <span className="text-xs">Mutabakat</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2" onClick={() => window.location.href = '/courier-app/shift'}>
            <Clock className="w-5 h-5" />
            <span className="text-xs">Vardiya</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2" onClick={() => window.location.href = '/courier-app/profile'}>
            <Settings className="w-5 h-5" />
            <span className="text-xs">Profil</span>
          </Button>
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
}
