# 🚀 FAZ 1 - KAPSAMLI SİSTEM MİMARİSİ
## Tüm Entegrasyonlar + Bildirimler + Konum Takibi

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              PAKETÇİ PLATFORM - FAZ 1                                        │
│                    (Admin + Bayi + Restoran + Kurye + Tüm Entegrasyonlar)                    │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐│
│  │                       🤖 PLATFORM ENTEGRASYON KATMANI                                    ││
│  │                                                                                          ││
│  │  YEMEKSEPETİ    TRENDYOL    MİGROS      GETİR       GETİR       FUUDY                   ││
│  │    YEMEK        YEMEK       YEMEK       YEMEK       ÇARŞI                              ││
│  │      │            │           │           │           │           │                    ││
│  │      └────────────┴───────────┴───────────┴───────────┴───────────┘                    ││
│  │                           │                                                             ││
│  │                    ┌──────┴──────┐                                                      ││
│  │                    │  INTEGRATION │  • OAuth2 / API Key                                  ││
│  │                    │     HUB      │  • Webhook handlers                                  ││
│  │                    │              │  • Order adapters                                    ││
│  │                    │  ┌────────┐  │  • Menu sync                                         ││
│  │                    │  │ Webhook│  │  • Status push                                       ││
│  │                    │  │ Server │  │                                                      ││
│  │                    │  └────────┘  │                                                      ││
│  │                    └──────────────┘                                                      ││
│  └─────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐│
│  │                       🔌 POS & DONANIM ENTEGRASYONLARI                                   ││
│  │                                                                                          ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                  ││
│  │  │  ADİSYO  │  │SEPETTAKİP│  │ ŞEFİM    │  │ CALLER ID│  │ YAZICI   │                  ││
│  │  │   POS    │  │   POS    │  │   POS    │  │          │  │ (Android)│                  ││
│  │  │          │  │          │  │          │  │          │  │          │                  ││
│  │  │•Sipariş  │  │•Sipariş  │  │•Sipariş  │  │•Müşteri  │  │•Fiş      │                  ││
│  │  │  çekme   │  │  çekme   │  │  çekme   │  │  tanıma  │  │  yazdır  │                  ││
│  │  │•Ödeme    │  │•Ödeme    │  │•Ödeme    │  │•CRM      │  │•Adisyon  │                  ││
│  │  │  aktar   │  │  aktar   │  │  aktar   │  │  popup   │  │  yazdır  │                  ││
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘                  ││
│  │                                                                                          ││
│  │  EKLENTİLER & EXELER:                                                                    ││
│  │  ┌────────────────────────────────────────────────────────────────────────────┐       ││
│  │  │  • Chrome Extension (Yemeksepeti, Getir, Trendyol, Migros için)            │       ││
│  │  │  • Windows Service (Caller ID, Yazıcı yönetimi)                            │       ││
│  │  │  • Android Service (Caller ID, Yazıcı, Bildirimler)                        │       ││
│  │  │  • POS Bridge (Adisyo, Sepettakip, Şefim için lokal bağlantı)              │       ││
│  │  └────────────────────────────────────────────────────────────────────────────┘       ││
│  └─────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐│
│  │                       📍 KONUM TAKİP SİSTEMİ (GPS)                                       ││
│  │                                                                                          ││
│  │  Kurye Konum Gönderimi: Her 5 saniye                                                     ││
│  │                                                                                          ││
│  │  ┌──────────────┐      POST /api/couriers/location      ┌──────────────┐                ││
│  │  │  MOBİL APP   │  ───────────────────────────────────▶ │   BACKEND    │                ││
│  │  │  (Flutter)   │         {lat, lng, timestamp,          │   (Redis)    │                ││
│  │  │              │          courierId, battery}           │              │                ││
│  │  └──────────────┘                                      └──────┬───────┘                ││
│  │                                                               │                         ││
│  │                                                               ▼                         ││
│  │                    ┌───────────────────────────────────────────────┐                    ││
│  │                    │           REDIS (Geospatial)                  │                    ││
│  │                    │  • GEOADD courier_locations {lat} {lng} {id}  │                    ││
│  │                    │  • GEORADIUS (Yakındaki kuryeleri bul)        │                    ││
│  │                    │  • GEODIST (Mesafe hesaplama)                 │                    ││
│  │                    └───────────────────────────────────────────────┘                    ││
│  │                                                               │                         ││
│  │                    ┌──────────────────────────────────────────┘                         ││
│  │                    │                                                                      ││
│  │                    ▼                                                                      ││
│  │          ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐               ││
│  │          │   RESTORAN      │    │     BAYİ        │    │   KURYELER      │               ││
│  │          │   CANLI HARİTA  │    │   OPERASYON     │    │   NAVİGASYON    │               ││
│  │          │                 │    │                 │    │                 │               ││
│  │          │ • Kurye takibi  │    │ • Tüm kuryeler  │    │ • Rota          │               ││
│  │          │ • ETA gösterimi │    │ • Performans    │    │ • Mesafe        │               ││
│  │          │ • Mesafe hesabı │    │ • Bölge analizi │    │ • Tahmini varış │               ││
│  │          └─────────────────┘    └─────────────────┘    └─────────────────┘               ││
│  └─────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐│
│  │                       🔔 BİLDİRİM SİSTEMİ (Multi-Channel)                                ││
│  │                                                                                          ││
│  │  BİLDİRİM TİPLERİ:                                                                       ││
│  │  ┌──────────────────────────────────────────────────────────────────────────────────┐   ││
│  │  │  📦 YENİ SİPARİŞ          ❌ SİPARİŞ İPTALİ       ⚠️ KRITIK STOK               │   ││
│  │  │  🏍️ KURYE ATANDI          ✅ TESLİM EDİLDİ        🔴 KURYE OFFLINE             │   ││
│  │  │  ⏰ SİPARİŞ GECİKİYOR      💰 ÖDEME ALINDI        🆕 YENİ KULLANICI            │   ││
│  │  │  📍 KURYE YAKINDA          🚨 KAZA/ACİL DURUM     💬 YENİ MESAJ               │   ││
│  │  └──────────────────────────────────────────────────────────────────────────────────┘   ││
│  │                                                                                          ││
│  │  BİLDİRİM KANALLARI:                                                                     ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                  ││
│  │  │  PUSH    │  │   SMS    │  │  EMAIL   │  │ SESLİ    │  │ WEBSOCKET│                  ││
│  │  │(Mobil)   │  │          │  │          │  │ UYARI    │  │ (Gerçek  │                  ││
│  │  │•Android  │  │•Mobil    │  │•Detaylı  │  │•Restoran │  │  zamanlı)│                  ││
│  │  │•iOS      │  │•Bildirim│  │•Raporlar │  │  ekranı  │  │•Dashboard│                  ││
│  │  │          │  │          │  │          │  │•Kurye    │  │  güncel. │                  ││
│  │  │          │  │          │  │          │  │  bildirim│  │          │                  ││
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘                  ││
│  │                                                                                          ││
│  │  ALICI GRUPLARI:                                                                         ││
│  │  • RESTORAN: Yeni sipariş, İptal, Kurye atama, Gecikme uyarıları                        ││
│  │  • KURYE:   Yeni sipariş atama, İptal, Acil durum, Mola onay                           ││
│  │  • BAYİ:    Tüm restoran özetleri, Kurye performans, Kritik olaylar                    ││
│  │  • ADMIN:   Sistem durumu, Ödeme bildirimleri, Kritik hatalar                          ││
│  └─────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 DETAYLI MODÜLLER

### 1. PLATFORM ENTEGRASYON MODÜLÜ

```typescript
// Tüm platformlar için ortak interface
interface PlatformIntegration {
  id: string;
  name: string;  // 'YEMEKSEPETI', 'TRENDYOL', 'MIGROS', 'GETIR_YEMEK', 'GETIR_CARSI', 'FUUDY'
  
  // Kimlik doğrulama
  auth: {
    type: 'OAUTH2' | 'API_KEY';
    credentials: {
      clientId?: string;
      clientSecret?: string;
      apiKey?: string;
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: Date;
    };
  };
  
  // API Endpoints
  endpoints: {
    baseUrl: string;
    authUrl: string;
    orders: string;
    orderDetail: string;
    updateStatus: string;
    menu: string;
    products: string;
  };
  
  // Webhook yapılandırması
  webhooks: {
    secret: string;
    events: string[];
    url: string;
  };
  
  // Senkronizasyon ayarları
  sync: {
    orderPolling: boolean;
    pollingInterval: number;  // saniye
    menuSync: boolean;
    autoAccept: boolean;
  };
}

// Sipariş adaptörü (Her platformdan gelen veriyi standartlaştırır)
interface OrderAdapter {
  externalOrderId: string;
  platform: string;
  
  // Platformdan gelen ham veriyi Paketçi formatına çevir
  transform(externalData: any): StandardOrder;
  
  // Paketçi durumunu platform formatına çevir
  transformStatus(internalStatus: OrderStatus): PlatformStatus;
}

// Standart sipariş formatı (Tüm platformlar için)
interface StandardOrder {
  id: string;
  externalId: string;
  platform: string;
  
  customer: {
    name: string;
    phone: string;
    address: Address;
    note: string;
  };
  
  items: {
    externalId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    options: { name: string; price: number }[];
    notes: string;
  }[];
  
  payment: {
    method: 'CREDIT_CARD' | 'CASH' | 'ONLINE';
    total: number;
    deliveryFee: number;
    discount: number;
    tip: number;
  };
  
  timing: {
    createdAt: Date;
    estimatedDelivery: Date;
    preparationTime: number;  // dakika
  };
  
  status: OrderStatus;
}
```

### 2. POS ENTEGRASYON MODÜLÜ

```typescript
interface POSIntegration {
  // Desteklenen POS sistemleri
  type: 'ADISYO' | 'SEPETTAKIP' | 'SEFIM';
  
  // Bağlantı
  connection: {
    type: 'LOCAL' | 'CLOUD' | 'HYBRID';
    ip?: string;           // Lokal IP
    port?: number;         // Port
    apiKey?: string;       // API Key (Cloud)
  };
  
  // Fonksiyonlar
  features: {
    pullOrders: boolean;      // Sipariş çekme
    pushPayment: boolean;     // Ödeme aktarma
    syncMenu: boolean;        // Menü senkronizasyonu
    printReceipt: boolean;    // Fiş yazdırma
    printAdisyon: boolean;    // Adisyon yazdırma
  };
}

// Caller ID Entegrasyonu
interface CallerIDIntegration {
  // Donanım
  device: {
    type: 'USB' | 'SERIAL' | 'NETWORK';
    port: string;
    baudRate?: number;
  };
  
  // Özellikler
  features: {
    incomingCall: boolean;
    outgoingCall: boolean;
    callerNumber: boolean;
    callerName: boolean;
  };
  
  // CRM Entegrasyonu
  crm: {
    lookupCustomer: boolean;   // Müşteri tanıma
    showPopup: boolean;        // Ekranda popup göster
    addNote: boolean;          // Not ekleme
    orderHistory: boolean;     // Sipariş geçmişi göster
  };
}

// Yazıcı Entegrasyonu
interface PrinterIntegration {
  // Android yazıcı (Termal/Etiket)
  android: {
    connection: 'BLUETOOTH' | 'USB' | 'WIFI';
    printerType: 'THERMAL' | 'LABEL' | 'IMPACT';
    paperWidth: 58 | 80;  // mm
  };
  
  // Windows servis yazıcı
  windows: {
    printerName: string;
    driver: string;
  };
  
  // Yazdırma tipleri
  printTypes: {
    receipt: ReceiptTemplate;
    adisyon: AdisyonTemplate;
    label: LabelTemplate;
    report: ReportTemplate;
  };
}
```

### 3. KONUM TAKİP SERVİSİ

```typescript
interface LocationTrackingService {
  // Konum gönderme (Kurye App'ten)
  updateLocation(data: {
    courierId: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number;
    speed?: number;
    heading?: number;
    timestamp: Date;
    batteryLevel: number;
    isMock: boolean;  // Sahte konum kontrolü
  });
  
  // Konum sorgulama
  getLocation(courierId: string): GeoPosition;
  
  // Yakındaki kuryeleri bul
  findNearbyCouriers(
    latitude: number,
    longitude: number,
    radius: number  // metre
  ): NearbyCourier[];
  
  // Mesafe hesaplama
  calculateDistance(
    from: GeoPosition,
    to: GeoPosition
  ): number;  // metre
  
  // ETA hesaplama
  calculateETA(
    courierLocation: GeoPosition,
    destination: GeoPosition,
    averageSpeed: number  // km/s
  ): number;  // dakika
  
  // Rota optimizasyonu
  optimizeRoute(
    courierId: string,
    deliveries: Delivery[]
  ): OptimizedRoute;
}
```

### 4. BİLDİRİM SERVİSİ

```typescript
interface NotificationService {
  // Bildirim gönderme
  send(notification: {
    type: NotificationType;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
    
    // Alıcılar
    recipients: {
      userIds?: string[];
      role?: 'ADMIN' | 'DEALER' | 'RESTAURANT' | 'COURIER';
      restaurantId?: string;
      courierId?: string;
      dealerId?: string;
    };
    
    // İçerik
    content: {
      title: string;
      body: string;
      data?: any;  // Ek veri
      imageUrl?: string;
      actionUrl?: string;
    };
    
    // Kanallar
    channels: ('PUSH' | 'SMS' | 'EMAIL' | 'WEBSOCKET' | 'VOICE')[];
  });
  
  // Bildirim tipleri
  types: {
    NEW_ORDER: { orderId: string; restaurantId: string; };
    ORDER_CANCELLED: { orderId: string; reason: string; };
    ORDER_ASSIGNED: { orderId: string; courierId: string; };
    ORDER_READY: { orderId: string; };
    ORDER_DELIVERED: { orderId: string; };
    ORDER_DELAYED: { orderId: string; estimatedDelay: number; };
    
    COURIER_NEARBY: { orderId: string; distance: number; };
    COURIER_OFFLINE: { courierId: string; lastSeen: Date; };
    COURIER_EMERGENCY: { courierId: string; location: GeoPosition; };
    
    LOW_STOCK: { productId: string; currentStock: number; };
    PAYMENT_RECEIVED: { amount: number; orderId?: string; };
    
    BREAK_REQUEST: { courierId: string; type: 'SHORT' | 'LONG' | 'EMERGENCY'; };
    BREAK_APPROVED: { courierId: string; };
  };
}

// Bildirim şablonları
const NOTIFICATION_TEMPLATES = {
  NEW_ORDER: {
    title: '📦 Yeni Sipariş!',
    body: 'Sipariş #{orderId} geldi. Toplam: ₺{total}',
    sound: 'new_order.mp3',
    priority: 'HIGH',
  },
  ORDER_CANCELLED: {
    title: '❌ Sipariş İptal Edildi',
    body: 'Sipariş #{orderId} iptal edildi. Sebep: {reason}',
    priority: 'HIGH',
  },
  COURIER_NEARBY: {
    title: '🏍️ Kurye Yaklaşıyor',
    body: 'Kuryeniz {distance} metre uzaklıkta',
    priority: 'NORMAL',
  },
};
```

---

## 🗂️ VERİTABANI ŞEMASI

```sql
-- Platform Entegrasyonları
CREATE TABLE platform_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    platform_type VARCHAR(50), -- YEMEKSEPETI, TRENDYOL, etc.
    is_active BOOLEAN DEFAULT true,
    auth_config JSONB,
    sync_config JSONB,
    webhook_secret VARCHAR(255),
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- POS Entegrasyonları
CREATE TABLE pos_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    pos_type VARCHAR(50), -- ADISYO, SEPETTAKIP, SEFIM
    connection_config JSONB,
    features JSONB,
    is_active BOOLEAN DEFAULT true
);

-- Caller ID Cihazları
CREATE TABLE caller_id_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    device_type VARCHAR(50),
    connection_config JSONB,
    is_active BOOLEAN DEFAULT true
);

-- Kurye Konumları (Redis'te de tutulacak)
CREATE TABLE courier_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    courier_id UUID REFERENCES couriers(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    accuracy DECIMAL(8, 2),
    speed DECIMAL(5, 2),
    battery_level INTEGER,
    is_mock BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Bildirimler
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(100),
    priority VARCHAR(20),
    title VARCHAR(255),
    body TEXT,
    data JSONB,
    
    -- Alıcı
    recipient_user_id UUID REFERENCES users(id),
    recipient_role VARCHAR(50),
    restaurant_id UUID REFERENCES restaurants(id),
    courier_id UUID REFERENCES couriers(id),
    dealer_id UUID REFERENCES dealers(id),
    
    -- Durum
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    -- Kanallar
    channels_sent JSONB,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Logları
CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50),
    event_type VARCHAR(100),
    payload JSONB,
    signature VARCHAR(255),
    is_valid BOOLEAN,
    processed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ⚙️ SERVİSLER VE EXELER

### 1. Windows Servisi (POS + Caller ID + Yazıcı)

```csharp
// PaketciWindowsService.cs
public class PaketciWindowsService : ServiceBase
{
    // Caller ID dinleyici
    private CallerIDListener _callerIdListener;
    
    // POS bağlantıları
    private Dictionary<string, POSConnection> _posConnections;
    
    // Yazıcı yöneticisi
    private PrinterManager _printerManager;
    
    // WebSocket Client (Backend'e bağlan)
    private WebSocketClient _wsClient;
    
    protected override void OnStart(string[] args)
    {
        // Caller ID başlat
        _callerIdListener = new CallerIDListener();
        _callerIdListener.IncomingCall += OnIncomingCall;
        _callerIdListener.Start();
        
        // POS bağlantılarını kur
        InitializePOSConnections();
        
        // WebSocket bağlantısı
        _wsClient = new WebSocketClient("wss://api.paketci.app/ws");
        _wsClient.OnMessage += OnWebSocketMessage;
        _wsClient.Connect();
    }
    
    private void OnIncomingCall(object sender, CallEventArgs e)
    {
        // Müşteri bilgilerini getir
        var customer = GetCustomerByPhone(e.PhoneNumber);
        
        // Restoran ekranında popup göster
        ShowCustomerPopup(customer);
        
        // Backend'e bildir
        _wsClient.Send(JsonConvert.SerializeObject(new {
            type = "INCOMING_CALL",
            phone = e.PhoneNumber,
            restaurantId = Config.RestaurantId
        }));
    }
    
    private void OnWebSocketMessage(object sender, MessageEventArgs e)
    {
        var message = JsonConvert.DeserializeObject<dynamic>(e.Data);
        
        switch((string)message.type)
        {
            case "PRINT_RECEIPT":
                _printerManager.PrintReceipt(message.data);
                break;
            case "PRINT_ADISYON":
                _printerManager.PrintAdisyon(message.data);
                break;
        }
    }
}
```

### 2. Android Servisi (Caller ID + Bildirim + Konum)

```kotlin
// PaketciAndroidService.kt
class PaketciService : Service() {
    
    // Konum yöneticisi
    private lateinit var locationManager: LocationManager
    private val locationUpdateInterval = 5000L // 5 saniye
    
    // Caller ID dinleyici
    private lateinit var callReceiver: CallReceiver
    
    // Bildirim yöneticisi
    private lateinit var notificationManager: NotificationManager
    
    // WebSocket
    private lateinit var webSocketClient: WebSocketClient
    
    override fun onCreate() {
        super.onCreate()
        
        // Konum takibi başlat
        startLocationTracking()
        
        // Caller ID dinleyici kaydet
        callReceiver = CallReceiver()
        registerReceiver(callReceiver, IntentFilter(TelephonyManager.ACTION_PHONE_STATE_CHANGED))
        
        // WebSocket bağlan
        connectWebSocket()
    }
    
    private fun startLocationTracking() {
        val locationRequest = LocationRequest.create().apply {
            interval = locationUpdateInterval
            fastestInterval = 3000
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
        }
        
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                val location = result.lastLocation
                
                // Backend'e gönder
                sendLocationToServer(location)
            }
        }
        
        fusedLocationClient.requestLocationUpdates(
            locationRequest,
            locationCallback,
            Looper.getMainLooper()
        )
    }
    
    private fun sendLocationToServer(location: Location) {
        val payload = JSONObject().apply {
            put("courierId", courierId)
            put("latitude", location.latitude)
            put("longitude", location.longitude)
            put("speed", location.speed)
            put("batteryLevel", getBatteryLevel())
            put("timestamp", System.currentTimeMillis())
        }
        
        webSocketClient.send(payload.toString())
    }
}

// CallReceiver.kt - Gelen arama dinleyici
class CallReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE)
        
        if (state == TelephonyManager.EXTRA_STATE_RINGING) {
            val phoneNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER)
            
            // Müşteri bilgilerini göster
            showCallerInfoPopup(context, phoneNumber)
        }
    }
}
```

### 3. Chrome Extension (Platform entegrasyonu olmayanlar için)

```javascript
// content.js
// Her platform için ayrı detector

const PLATFORM_DETECTORS = {
  'yemeksepeti.com': YemeksepetiDetector,
  'getir.com': GetirDetector,
  'trendyol.com': TrendyolDetector,
  'migros.com': MigrosDetector
};

// Sipariş algılandığında
function onOrderDetected(orderData, platform) {
  // Paketçi API'sine gönder
  chrome.runtime.sendMessage({
    type: 'NEW_ORDER',
    platform: platform,
    data: orderData
  });
  
  // Bildirim göster
  showNotification('Yeni sipariş algılandı!', `${platform}'den yeni sipariş`);
}

// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NEW_ORDER') {
    // Backend'e gönder
    fetch('https://api.paketci.app/extension/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(message.data)
    });
  }
});
```

---

## 📱 MOBİL APP YAPILANDIRMASI

### Kurye App (Flutter)

```yaml
# pubspec.yaml dependencies
dependencies:
  flutter:
    sdk: flutter
  
  # Konum
  geolocator: ^10.0.0
  
  # WebSocket
  web_socket_channel: ^2.4.0
  
  # Bildirimler
  firebase_messaging: ^14.6.0
  flutter_local_notifications: ^15.1.0
  
  # Harita
  google_maps_flutter: ^2.4.0
  
  # Arka plan servisleri
  background_fetch: ^1.1.0
  
  # Ses
  just_audio: ^0.9.0
  
  # Yazıcı
  flutter_bluetooth_printer: ^1.0.0
```

### Servis Yapısı

```dart
// location_service.dart
class LocationService {
  static const UPDATE_INTERVAL = Duration(seconds: 5);
  
  Stream<Position> get locationStream => Geolocator.getPositionStream(
    locationSettings: LocationSettings(
      accuracy: LocationAccuracy.best,
      distanceFilter: 10, // 10 metre
    ),
  );
  
  void startTracking() {
    locationStream.listen((position) async {
      final battery = await Battery().batteryLevel;
      
      await ApiService.sendLocation(
        latitude: position.latitude,
        longitude: position.longitude,
        speed: position.speed,
        batteryLevel: battery,
      );
    });
  }
}

// notification_service.dart
class NotificationService {
  void initialize() {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      // Ön planda bildirim göster
      showLocalNotification(message);
      
      // Ses çal
      if (message.data['type'] == 'NEW_ORDER') {
        AudioService.playOrderSound();
      }
    });
    
    FirebaseMessaging.onBackgroundMessage(_backgroundMessageHandler);
  }
  
  static Future<void> _backgroundMessageHandler(RemoteMessage message) async {
    // Arka planda bildirim alındığında
    showLocalNotification(message);
  }
}
```

---

## 🚀 IMPLEMENTASYON SIRASI

### Hafta 1-2: Backend Temelleri
```
Gün 1-3: Platform Integration Modülü
├── Entity'ler (PlatformIntegration, OrderAdapter)
├── Yemeksepeti API Client
├── Webhook handlers
└── Order transform servisi

Gün 4-6: Konum Takip Sistemi
├── Redis geospatial kurulumu
├── Location service
├── ETA calculation
└── Route optimization

Gün 7-10: Bildirim Sistemi
├── Notification entity
├── FCM entegrasyonu
├── SMS entegrasyonu (Twilio)
├── Email servisi
└── WebSocket bildirimleri

Gün 11-14: POS ve Donanım API'leri
├── POS integration endpoints
├── Caller ID API
├── Printer API
└── Windows servis API
```

### Hafta 3-4: Frontend ve Servisler
```
Gün 15-18: Restoran Portalı
├── Partner.paketci.app temel yapı
├── Sipariş yönetimi ekranları
├── Entegrasyon ayarları
└── Canlı kurye haritası

Gün 19-21: Windows Servisi
├── Caller ID dinleyici
├── POS bağlantı modülleri
├── Yazıcı yönetimi
└── WebSocket client

Gün 22-24: Android Servisi
├── Caller ID receiver
├── Konum servisi
├── Bildirim servisi
└── Yazıcı entegrasyonu
```

### Hafta 5-6: Mobil ve Test
```
Gün 25-28: Kurye Mobil App
├── Konum gönderme
├── Bildirim alma
├── Navigasyon
└── Performans optimizasyonu

Gün 29-30: Entegrasyon Testleri
├── Platform testleri
├── POS testleri
├── Load test
└── Güvenlik testi
```

---

**Şimdi başlayalım mı?** Hangi modülden başlamak istersin:
1. **Backend** - Platform Integration API
2. **Restoran Portalı** - Frontend
3. **Windows Servisi** - POS + Caller ID
4. **Mobil App** - Konum + Bildirim
