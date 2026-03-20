import { useState, useEffect } from 'react';
import { 
  CreditCard, Save, RefreshCw, CheckCircle, AlertCircle, 
  Eye, EyeOff, Copy, ExternalLink, Shield, Key, Power,
  Settings, ChevronRight, Utensils, Info, HelpCircle,
  Store, Clock, Bell, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Platform listesi
const platforms = [
  {
    id: 'yemeksepeti',
    name: 'Yemeksepeti',
    icon: '🍽️',
    color: 'bg-red-500',
    description: 'Türkiye\'nin en büyük yemek platformu',
    features: ['Otomatik sipariş çekme', 'Menü senkronizasyonu', 'Durum yönetimi'],
  },
  {
    id: 'getir',
    name: 'Getir Yemek',
    icon: '🛵',
    color: 'bg-green-500',
    description: 'Hızlı teslimat platformu',
    features: ['Anlık bildirimler', 'Hızlı sipariş aktarımı', 'Promosyon yönetimi'],
  },
  {
    id: 'trendyol',
    name: 'Trendyol Yemek',
    icon: '🟠',
    color: 'bg-orange-500',
    description: 'Trendyol\'un yemek servisi',
    features: ['Otomatik onay', 'Kurye atama', 'Raporlama'],
  },
  {
    id: 'migros',
    name: 'Migros Yemek',
    icon: '🦁',
    color: 'bg-yellow-500',
    description: 'Migros\'un yemek platformu',
    features: ['Sipariş entegrasyonu', 'Stok senkronizasyonu'],
  },
  {
    id: 'fuudy',
    name: 'Fuudy',
    icon: '🍔',
    color: 'bg-blue-500',
    description: 'Yerel yemek platformu',
    features: ['Basit entegrasyon', 'Hızlı kurulum'],
  },
];

// Entegrasyon durumu tipi
interface IntegrationStatus {
  platform: string;
  connected: boolean;
  autoAccept: boolean;
  isOpen: boolean;
  apiKey?: string;
  apiSecret?: string;
  merchantId?: string;
  branchId?: string;
  lastSyncAt?: string;
  todayOrders: number;
  pendingOrders: number;
}

export default function IntegrationsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [integrations, setIntegrations] = useState<Record<string, IntegrationStatus>>({});
  const [activeTab, setActiveTab] = useState('platforms');

  // Seçili platform verisi
  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);
  const selectedIntegration = selectedPlatform ? integrations[selectedPlatform] : null;

  // Mock veri yükleme
  useEffect(() => {
    // API'den entegrasyon durumlarını çek
    const mockData: Record<string, IntegrationStatus> = {
      yemeksepeti: {
        platform: 'yemeksepeti',
        connected: true,
        autoAccept: true,
        isOpen: true,
        merchantId: '12345',
        branchId: '67890',
        lastSyncAt: '2026-03-19 14:30',
        todayOrders: 24,
        pendingOrders: 2,
      },
      getir: {
        platform: 'getir',
        connected: false,
        autoAccept: false,
        isOpen: false,
        todayOrders: 0,
        pendingOrders: 0,
      },
    };
    setIntegrations(mockData);
  }, []);

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const updateIntegration = (platform: string, updates: Partial<IntegrationStatus>) => {
    setIntegrations(prev => ({
      ...prev,
      [platform]: { ...prev[platform], ...updates, platform }
    }));
  };

  const testConnection = async (platform: string) => {
    setIsTesting(prev => ({ ...prev, [platform]: true }));
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3;
    updateIntegration(platform, { connected: success });
    setIsTesting(prev => ({ ...prev, [platform]: false }));
    
    return success;
  };

  const saveConfiguration = async () => {
    if (!selectedPlatform) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    alert('Ayarlar kaydedildi!');
  };

  const copyWebhookUrl = (platformId: string) => {
    const url = `https://api.paketciniz.com/api/webhooks/${platformId}`;
    navigator.clipboard.writeText(url);
    alert('Webhook URL kopyalandı!');
  };

  const toggleRestaurantStatus = (platform: string) => {
    const current = integrations[platform]?.isOpen ?? false;
    updateIntegration(platform, { isOpen: !current });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Store className="w-8 h-8 text-blue-600" />
          Platform Entegrasyonları
        </h1>
        <p className="text-gray-500 mt-2">
          Yemeksepeti, Getir ve diğer platformlardan siparişlerinizi otomatik olarak yönetin.
        </p>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Bağlı Platform</p>
                <p className="text-2xl font-bold text-blue-900">
                  {Object.values(integrations).filter(i => i.connected).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Bugünkü Sipariş</p>
                <p className="text-2xl font-bold text-green-900">
                  {Object.values(integrations).reduce((sum, i) => sum + (i.todayOrders || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <Utensils className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Bekleyen</p>
                <p className="text-2xl font-bold text-orange-900">
                  {Object.values(integrations).reduce((sum, i) => sum + (i.pendingOrders || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Otomatik Onay</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Object.values(integrations).filter(i => i.autoAccept).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="platforms">Platformlar</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          <TabsTrigger value="logs">Loglar</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Platform Listesi */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Bağlanacak Platformlar
              </h2>
              
              {platforms.map((platform) => {
                const integration = integrations[platform.id];
                const isConnected = integration?.connected;
                
                return (
                  <Card
                    key={platform.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPlatform === platform.id 
                        ? 'ring-2 ring-blue-500 border-blue-500' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{platform.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              isConnected ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                          </div>
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {platform.description}
                          </p>
                          
                          {isConnected && (
                            <div className="flex items-center gap-2 mt-3">
                              <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Bağlı
                              </Badge>
                              {integration.isOpen ? (
                                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                                  <Power className="w-3 h-3 mr-1" />
                                  Açık
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
                                  <Power className="w-3 h-3 mr-1" />
                                  Kapalı
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {isConnected && integration.todayOrders > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                          <span className="text-gray-500">Bugün:</span>
                          <span className="font-semibold text-gray-900">
                            {integration.todayOrders} sipariş
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Yapılandırma Paneli */}
            <div className="lg:col-span-2">
              {selectedPlatformData ? (
                <Card className="h-full">
                  <CardHeader className="border-b bg-gray-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{selectedPlatformData.icon}</span>
                        <div>
                          <CardTitle>{selectedPlatformData.name} Yapılandırması</CardTitle>
                          <CardDescription>{selectedPlatformData.description}</CardDescription>
                        </div>
                      </div>
                      
                      {selectedIntegration?.connected && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Restoran Durumu:</span>
                          <Switch
                            checked={selectedIntegration?.isOpen ?? false}
                            onCheckedChange={() => toggleRestaurantStatus(selectedPlatform!)}
                          />
                          <Badge className={selectedIntegration?.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {selectedIntegration?.isOpen ? 'Açık' : 'Kapalı'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6">
                    {!selectedIntegration?.connected ? (
                      // Bağlantı yoksa - API bilgileri girme formu
                      <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                          <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div className="text-sm text-amber-800">
                            <p className="font-medium mb-1">API Bilgileri Nasıl Alınır?</p>
                            <p>
                              {selectedPlatformData.name} panelinize giriş yapıp "Ayarlar &gt; API Entegrasyonu" 
                              bölümünden API key bilgilerinizi kopyalayın.
                            </p>
                            <Button variant="link" className="p-0 h-auto text-amber-700 mt-2">
                              Detaylı rehberi gör <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="apiKey">API Key</Label>
                            <div className="relative">
                              <Input
                                id="apiKey"
                                type={showSecrets['apiKey'] ? 'text' : 'password'}
                                placeholder="API key'inizi girin"
                                value={selectedIntegration?.apiKey || ''}
                                onChange={(e) => updateIntegration(selectedPlatform!, { apiKey: e.target.value })}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => toggleSecretVisibility('apiKey')}
                              >
                                {showSecrets['apiKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="apiSecret">API Secret</Label>
                            <div className="relative">
                              <Input
                                id="apiSecret"
                                type={showSecrets['apiSecret'] ? 'text' : 'password'}
                                placeholder="API secret'ınızı girin"
                                value={selectedIntegration?.apiSecret || ''}
                                onChange={(e) => updateIntegration(selectedPlatform!, { apiSecret: e.target.value })}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => toggleSecretVisibility('apiSecret')}
                              >
                                {showSecrets['apiSecret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="merchantId">Merchant ID (Restoran ID)</Label>
                            <Input
                              id="merchantId"
                              placeholder="örn: 12345"
                              value={selectedIntegration?.merchantId || ''}
                              onChange={(e) => updateIntegration(selectedPlatform!, { merchantId: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="branchId">Branch ID (Şube ID)</Label>
                            <Input
                              id="branchId"
                              placeholder="örn: 67890"
                              value={selectedIntegration?.branchId || ''}
                              onChange={(e) => updateIntegration(selectedPlatform!, { branchId: e.target.value })}
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Otomatik İşlemler
                          </h4>
                          
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <Label className="font-medium">Siparişleri Otomatik Kabul Et</Label>
                              <p className="text-sm text-gray-500">
                                Gelen siparişleri manuel onay beklemeden otomatik kabul et
                              </p>
                            </div>
                            <Switch
                              checked={selectedIntegration?.autoAccept || false}
                              onCheckedChange={(checked) => updateIntegration(selectedPlatform!, { autoAccept: checked })}
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => testConnection(selectedPlatform!)}
                            disabled={isTesting[selectedPlatform!]}
                            className="flex-1"
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isTesting[selectedPlatform!] ? 'animate-spin' : ''}`} />
                            {isTesting[selectedPlatform!] ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}
                          </Button>
                          
                          <Button
                            onClick={saveConfiguration}
                            disabled={isSaving}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Kaydediliyor...' : 'Kaydet ve Bağlan'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Bağlantı varsa - Yönetim paneli
                      <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-medium text-green-900">Bağlantı Aktif</p>
                            <p className="text-sm text-green-700">
                              Son senkronizasyon: {selectedIntegration?.lastSyncAt || 'Henüz yapılmadı'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4 text-center">
                              <p className="text-3xl font-bold text-blue-900">{selectedIntegration?.todayOrders || 0}</p>
                              <p className="text-sm text-blue-600">Bugünkü Sipariş</p>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-orange-50 border-orange-200">
                            <CardContent className="p-4 text-center">
                              <p className="text-3xl font-bold text-orange-900">{selectedIntegration?.pendingOrders || 0}</p>
                              <p className="text-sm text-orange-600">Bekleyen</p>
                            </CardContent>
                          </Card>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Ayarlar</h4>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                <div>
                                  <p className="font-medium">Otomatik Kabul</p>
                                  <p className="text-xs text-gray-500">Siparişleri otomatik onayla</p>
                                </div>
                              </div>
                              <Switch
                                checked={selectedIntegration?.autoAccept || false}
                                onCheckedChange={(checked) => updateIntegration(selectedPlatform!, { autoAccept: checked })}
                              />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-blue-500" />
                                <div>
                                  <p className="font-medium">Bildirimler</p>
                                  <p className="text-xs text-gray-500">Yeni sipariş bildirimleri</p>
                                </div>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Webhook URL</h4>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                              https://api.paketciniz.com/api/webhooks/{selectedPlatform}
                            </code>
                            <Button variant="outline" size="sm" onClick={() => copyWebhookUrl(selectedPlatform!)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Bu URL'i {selectedPlatformData.name} panelinde webhook olarak girin.
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => testConnection(selectedPlatform!)}
                            disabled={isTesting[selectedPlatform!]}
                            className="flex-1"
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isTesting[selectedPlatform!] ? 'animate-spin' : ''}`} />
                            Bağlantıyı Test Et
                          </Button>
                          
                          <Button
                            variant="destructive"
                            className="flex-1"
                          >
                            Bağlantıyı Kes
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Seçin</h3>
                    <p className="text-gray-500 max-w-sm">
                      Yapılandırmak istediğiniz platformu sol taraftan seçin veya yeni bir platform bağlayın.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Genel Entegrasyon Ayarları</CardTitle>
              <CardDescription>Tüm platformlar için geçerli varsayılan ayarlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Varsayılan Otomatik Kabul</p>
                  <p className="text-sm text-gray-500">Yeni bağlanan platformlarda otomatik kabul aktif olsun</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Sipariş Senkronizasyonu</p>
                  <p className="text-sm text-gray-gray-500">Platformlarla siparişleri otomatik senkronize et</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Menü Senkronizasyonu</p>
                  <p className="text-sm text-gray-500">Menü değişikliklerini platformlara otomatik gönder</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Entegrasyon Logları</CardTitle>
              <CardDescription>Son entegrasyon olayları ve hatalar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-800">Yemeksepeti bağlantısı başarılı</span>
                  <span className="text-green-600 ml-auto">14:30</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-sm">
                  <Utensils className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800">Yeni sipariş alındı (YS-12345)</span>
                  <span className="text-blue-600 ml-auto">14:25</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-800">Otomatik senkronizasyon tamamlandı</span>
                  <span className="text-gray-600 ml-auto">14:00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
