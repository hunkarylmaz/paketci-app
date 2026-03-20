"use client";

import { useState } from "react";
import { 
  Plus, Search, Power, PowerOff, Link2, Unlink, RefreshCw, 
  Settings, Wifi, WifiOff, AlertCircle, CheckCircle2, Store,
  Utensils, ShoppingBag, Truck, CreditCard, Printer, Phone,
  ChevronRight, MoreVertical, Edit, Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Platform definitions
const onlinePlatforms = [
  { 
    id: "yemeksepeti", 
    name: "Yemeksepeti", 
    icon: "🍕", 
    color: "bg-red-500",
    description: "Türkiye'nin lider yemek sipariş platformu",
    commission: "%15-25",
    apiStatus: "connected"
  },
  { 
    id: "getir-yemek", 
    name: "Getir Yemek", 
    icon: "🥑", 
    color: "bg-purple-500",
    description: "Hızlı teslimat ile yemek siparişi",
    commission: "%12-18",
    apiStatus: "connected"
  },
  { 
    id: "getir-carsi", 
    name: "Getir Çarşı", 
    icon: "🛒", 
    color: "bg-yellow-500",
    description: "Market ve çarşı ürünleri teslimatı",
    commission: "%15-20",
    apiStatus: "disconnected"
  },
  { 
    id: "migros-yemek", 
    name: "Migros Yemek", 
    icon: "🦁", 
    color: "bg-orange-500",
    description: "Migros güvencesiyle yemek siparişi",
    commission: "%14-20",
    apiStatus: "connected"
  },
  { 
    id: "trendyol-yemek", 
    name: "Trendyol Yemek", 
    icon: "🥡", 
    color: "bg-orange-600",
    description: "Trendyol'un yemek platformu",
    commission: "%13-19",
    apiStatus: "pending"
  },
];

const posSystems = [
  {
    id: "sepettakip",
    name: "Sepet Takip",
    type: "POS",
    icon: "🧾",
    description: "Restoran yönetim sistemi",
    features: ["Sipariş yönetimi", "Stok takibi", "Raporlama"],
    status: "connected"
  },
  {
    id: "sefim-pos",
    name: "Şefim POS",
    type: "POS",
    icon: "👨‍🍳",
    description: "Profesyonel restoran POS sistemi",
    features: ["Masa yönetimi", "Adisyon", "Mutfak ekranı"],
    status: "connected"
  },
  {
    id: "adisyo",
    name: "Adisyo",
    type: "POS",
    icon: "📱",
    description: "Mobil uyumlu POS çözümü",
    features: ["QR menü", "Online ödeme", "Lojistik"],
    status: "disconnected"
  },
];

const hardwareIntegrations = [
  {
    id: "printer",
    name: "Termal Yazıcı",
    type: "hardware",
    icon: "🖨️",
    description: "Sipariş fişi yazdırma",
    model: "Epson TM-T88V",
    connection: "Ethernet",
    status: "online"
  },
  {
    id: "caller-id",
    name: "Caller ID",
    type: "hardware",
    icon: "📞",
    description: "Gelen arama tespiti",
    model: "USB Modem",
    connection: "USB",
    status: "online"
  },
];

// Mock restaurant data
const restaurants = [
  { 
    id: 1, 
    name: "Burger King", 
    address: "Cumhuriyet Cad. No:15",
    platforms: {
      yemeksepeti: { status: "open", autoAccept: true },
      "getir-yemek": { status: "open", autoAccept: true },
      "getir-carsi": { status: "closed", autoAccept: false },
      "migros-yemek": { status: "open", autoAccept: false },
      "trendyol-yemek": { status: "pending_setup", autoAccept: false },
    }
  },
  { 
    id: 2, 
    name: "McDonald's", 
    address: "Atatürk Bulvarı No:42",
    platforms: {
      yemeksepeti: { status: "closed", autoAccept: false },
      "getir-yemek": { status: "open", autoAccept: true },
      "getir-carsi": { status: "closed", autoAccept: false },
      "migros-yemek": { status: "open", autoAccept: true },
      "trendyol-yemek": { status: "closed", autoAccept: false },
    }
  },
];

export default function RestaurantIntegrationsPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0]);
  const [activeTab, setActiveTab] = useState("platforms");

  const togglePlatformStatus = (platformId: string) => {
    // API call to toggle platform status
    console.log(`Toggling ${platformId} for restaurant ${selectedRestaurant.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Restoran Entegrasyonları</h1>
          <p className="text-slate-500">Online platform ve POS sistemi yönetimi</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Entegrasyon
        </Button>
      </div>

      {/* Restaurant Selector */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500">Restoran Seç</p>
              <select 
                className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg"
                value={selectedRestaurant.id}
                onChange={(e) => {
                  const restaurant = restaurants.find(r => r.id === parseInt(e.target.value));
                  if (restaurant) setSelectedRestaurant(restaurant);
                }}
              >
                {restaurants.map(r => (
                  <option key={r.id} value={r.id}>{r.name} - {r.address}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="platforms" className="data-[state=active]:bg-white">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Online Platformlar
          </TabsTrigger>
          <TabsTrigger value="pos" className="data-[state=active]:bg-white">
            <CreditCard className="w-4 h-4 mr-2" />
            POS Sistemleri
          </TabsTrigger>
          <TabsTrigger value="hardware" className="data-[state=active]:bg-white">
            <Printer className="w-4 h-4 mr-2" />
            Donanım
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white">
            <Settings className="w-4 h-4 mr-2" />
            Ayarlar
          </TabsTrigger>
        </TabsList>

        {/* Online Platforms Tab */}
        <TabsContent value="platforms" className="space-y-4">
          <div className="grid gap-4">
            {onlinePlatforms.map((platform) => {
              const restaurantPlatform = selectedRestaurant.platforms[platform.id as keyof typeof selectedRestaurant.platforms];
              const isOpen = restaurantPlatform?.status === "open";
              const isPending = restaurantPlatform?.status === "pending_setup";
              
              return (
                <Card key={platform.id} className={`border-slate-200 ${isPending ? 'opacity-60' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className={`w-14 h-14 ${platform.color} rounded-xl flex items-center justify-center text-2xl`}>
                          {platform.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg text-slate-900">{platform.name}</h3>
                            {isPending ? (
                              <Badge className="bg-yellow-100 text-yellow-700">Kurulum Bekliyor</Badge>
                            ) : isOpen ? (
                              <Badge className="bg-green-100 text-green-700">Açık</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700">Kapalı</Badge>
                            )}
                          </div>
                          
                          <p className="text-slate-600 mt-1">{platform.description}</p>
                          
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="text-slate-500">Komisyon: {platform.commission}</span>
                            <span className="flex items-center gap-1 text-slate-500">
                              {platform.apiStatus === "connected" ? (
                                <><Wifi className="w-4 h-4 text-green-500" /> Bağlı</>
                              ) : platform.apiStatus === "pending" ? (
                                <><AlertCircle className="w-4 h-4 text-yellow-500" /> Bekliyor</>
                              ) : (
                                <><WifiOff className="w-4 h-4 text-red-500" /> Bağlı Değil</>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {!isPending && (
                          <Button
                            variant={isOpen ? "outline" : "default"}
                            className={isOpen ? "border-red-200 text-red-600" : "bg-green-600"}
                            onClick={() => togglePlatformStatus(platform.id)}
                          >
                            {isOpen ? (
                              <><PowerOff className="w-4 h-4 mr-2" />Kapat</>
                            ) : (
                              <><Power className="w-4 h-4 mr-2" />Aç</>
                            )}
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Ayarlar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* POS Systems Tab */}
        <TabsContent value="pos" className="space-y-4">
          <div className="grid gap-4">
            {posSystems.map((pos) => (
              <Card key={pos.id} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                        {pos.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-slate-900">{pos.name}</h3>
                          <Badge className={pos.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                            {pos.status === 'connected' ? 'Bağlı' : 'Bağlı Değil'}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-600 mt-1">{pos.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {pos.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {pos.status === 'connected' ? (
                        <>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Senkronize Et
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Unlink className="w-4 h-4 mr-2" />
                            Bağlantıyı Kes
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" className="bg-blue-600">
                          <Link2 className="w-4 h-4 mr-2" />
                          Bağlan
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Hardware Tab */}
        <TabsContent value="hardware" className="space-y-4">
          <div className="grid gap-4">
            {hardwareIntegrations.map((hw) => (
              <Card key={hw.id} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                        {hw.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-slate-900">{hw.name}</h3>
                          <Badge className={hw.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {hw.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                          </Badge>
                        </div>
                        
                        <p className="text-slate-600 mt-1">{hw.description}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                          <span>Model: {hw.model}</span>
                          <span>Bağlantı: {hw.connection}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Yapılandır
                      </Button>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Otomatik Sipariş Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Otomatik Sipariş Kabulü</p>
                  <p className="text-sm text-slate-500">Gelen siparişleri otomatik onayla</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Yazıcıya Otomatik Gönder</p>
                  <p className="text-sm text-slate-500">Siparişleri otomatik yazdır</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Caller ID Eşleştirme</p>
                  <p className="text-sm text-slate-500">Gelen aramalarda müşteri bilgisi göster</p>
                </div>
                <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Sesli Bildirim</p>
                  <p className="text-sm text-slate-500">Yeni siparişlerde ses çal</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Mobil Bildirim</p>
                  <p className="text-sm text-slate-500">Telefona push notification gönder</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
