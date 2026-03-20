"use client";

import { useState } from "react";
import { 
  CreditCard, Save, RefreshCw, CheckCircle, AlertCircle, 
  Eye, EyeOff, Copy, ExternalLink, Shield, Key
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  autoAccept: boolean;
  isOpen: boolean;
  apiKey?: string;
  apiSecret?: string;
  merchantId?: string;
  branchId?: string;
  webhookUrl?: string;
}

const initialPlatforms: PlatformConfig[] = [
  {
    id: "yemeksepeti",
    name: "Yemeksepeti",
    icon: "🍽️",
    color: "bg-red-500",
    connected: false,
    autoAccept: false,
    isOpen: true,
  },
  {
    id: "getir",
    name: "Getir Yemek",
    icon: "🛵",
    color: "bg-green-500",
    connected: false,
    autoAccept: false,
    isOpen: true,
  },
  {
    id: "trendyol",
    name: "Trendyol Yemek",
    icon: "🟠",
    color: "bg-orange-500",
    connected: false,
    autoAccept: false,
    isOpen: true,
  },
  {
    id: "migros",
    name: "Migros Yemek",
    icon: "🦁",
    color: "bg-yellow-500",
    connected: false,
    autoAccept: false,
    isOpen: true,
  },
  {
    id: "fuudy",
    name: "Fuudy",
    icon: "🍔",
    color: "bg-blue-500",
    connected: false,
    autoAccept: false,
    isOpen: true,
  },
];

export default function RestaurantIntegrationsPage() {
  const [platforms, setPlatforms] = useState<PlatformConfig[]>(initialPlatforms);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  const toggleSecretVisibility = (platformId: string, field: string) => {
    const key = `${platformId}-${field}`;
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updatePlatform = (platformId: string, updates: Partial<PlatformConfig>) => {
    setPlatforms(prev => prev.map(p =
      p.id === platformId ? { ...p, ...updates } : p
    ));
  };

  const testConnection = async (platformId: string) => {
    setIsTesting(prev =㸾 ({ ...prev, [platformId]: true }));
    
    // API test simulation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Random success/fail for demo
    const success = Math.random() > 0.3;
    
    updatePlatform(platformId, { connected: success });
    setIsTesting(prev => ({ ...prev, [platformId]: false }));
    
    return success;
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    
    // API call to save
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    alert("Ayarlar kaydedildi!");
  };

  const copyWebhookUrl = (platformId: string) => {
    const url = `${window.location.origin}/api/webhooks/${platformId}`;
    navigator.clipboard.writeText(url);
    alert("Webhook URL kopyalandı!");
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Entegrasyonları</h1>
        <p className="text-gray-500 mt-1">
          Yemeksepeti, Getir ve diğer platformlardan siparişlerinizi otomatik çekin.
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">API Key Nasıl Alınır?</h3>
              <p className="text-sm text-blue-700 mt-1">
                Platform panelinize giriş yapıp API/Entegrasyon bölümünden key'lerinizi kopyalayın. 
                Detaylı rehber için <a href="#" className="underline">tıklayın</a>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-gray-900">Bağlı Platformlar</h2>
          
          {platforms.map((platform) => (
            <Card
              key={platform.id}
              className={`cursor-pointer transition-all ${
                selectedPlatform === platform.id 
                  ? "ring-2 ring-blue-500 border-blue-500" 
                  : "hover:border-gray-300"
              }`}
              onClick={() => setSelectedPlatform(platform.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <div className="font-medium">{platform.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {platform.connected ? (
                          <>
                            <Badge className="bg-green-100 text-green-700 border-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Bağlı
                            </Badge>
                            {platform.isOpen ? (
                              <Badge className="bg-blue-100 text-blue-700 border-0">Açık</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-700 border-0">Kapalı</Badge>
                            )}
                          </>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 border-0">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Bağlı Değil
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`w-3 h-3 rounded-full ${
                    platform.connected ? "bg-green-500" : "bg-gray-300"
                  }`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-2">
          {selectedPlatformData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedPlatformData.icon}</span>
                  {selectedPlatformData.name} Yapılandırması
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* API Key Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    API Bilgileri
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="relative">
                        <Input
                          id="apiKey"
                          type={showSecrets[`${selectedPlatformData.id}-apiKey`] ? "text" : "password"}
                          placeholder="API key'inizi girin"
                          value={selectedPlatformData.apiKey || ""}
                          onChange={(e) => updatePlatform(selectedPlatformData.id, { apiKey: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => toggleSecretVisibility(selectedPlatformData.id, "apiKey")}
                        >
                          {showSecrets[`${selectedPlatformData.id}-apiKey`] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apiSecret">API Secret</Label>
                      <div className="relative">
                        <Input
                          id="apiSecret"
                          type={showSecrets[`${selectedPlatformData.id}-apiSecret`] ? "text" : "password"}
                          placeholder="API secret'ınızı girin"
                          value={selectedPlatformData.apiSecret || ""}
                          onChange={(e) => updatePlatform(selectedPlatformData.id, { apiSecret: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => toggleSecretVisibility(selectedPlatformData.id, "apiSecret")}
                        >
                          {showSecrets[`${selectedPlatformData.id}-apiSecret`] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="merchantId">Merchant ID (Restoran ID)</Label>
                      <Input
                        id="merchantId"
                        placeholder="örn: 12345"
                        value={selectedPlatformData.merchantId || ""}
                        onChange={(e) => updatePlatform(selectedPlatformData.id, { merchantId: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branchId">Branch ID (Şube ID)</Label>
                      <Input
                        id="branchId"
                        placeholder="örn: 67890"
                        value={selectedPlatformData.branchId || ""}
                        onChange={(e) => updatePlatform(selectedPlatformData.id, { branchId: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Webhook Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Webhook URL
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Bu URL'i {selectedPlatformData.name} panelinde webhook olarak girin:
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                        {`${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/${selectedPlatformData.id}`}
                      </code>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyWebhookUrl(selectedPlatformData.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Auto Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Otomatik İşlemler
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Siparişleri Otomatik Kabul Et</Label>
                        <p className="text-sm text-gray-500">
                          Gelen siparişleri otomatik onayla
                        </p>
                      </div>
                      
                      <Switch
                        checked={selectedPlatformData.autoAccept}
                        onCheckedChange={(checked) => 
                          updatePlatform(selectedPlatformData.id, { autoAccept: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Restoranı Açık Tut</Label>
                        <p className="text-sm text-gray-500">
                          Platformda restoran durumunu açık göster
                        </p>
                      </div>
                      
                      <Switch
                        checked={selectedPlatformData.isOpen}
                        onCheckedChange={(checked) => 
                          updatePlatform(selectedPlatformData.id, { isOpen: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => testConnection(selectedPlatformData.id)}
                    disabled={isTesting[selectedPlatformData.id]}
                    className="flex-1"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isTesting[selectedPlatformData.id] ? "animate-spin" : ""}`} />
                    {isTesting[selectedPlatformData.id] ? "Test Ediliyor..." : "Bağlantıyı Test Et"}
                  </Button>
                  
                  <Button
                    onClick={saveConfiguration}
                    disabled={isSaving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Kaydediliyor..." : "Kaydet"}
                  㰼/Button>
                </div>
              </CardContent>
            㰼/Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Yapılandırmak için sol taraftan bir platform seçin
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
