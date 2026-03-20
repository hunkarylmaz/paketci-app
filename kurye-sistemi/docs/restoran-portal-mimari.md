# 🍽️ RESTORAN PORTALI (partner.paketci.app)

## Genel Bakış

Restoranların kendi operasyonlarını yönettiği, siparişleri takip ettiği, menü ve stok yönetimi yaptığı kapsamlı web portalı.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🍽️ PARTNER.PAKETCI.APP - RESTORAN PORTALI                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  📦      │  │  📋      │  │  📊      │  │  🔔      │  │  ⚙️      │     │
│  │ SİPARİŞ │  │  MENÜ   │  │  RAPOR  │  │BİLDİRİM │  │  AYARLAR │     │
│  │          │  │          │  │          │  │          │  │          │     │
│  │• Yeni    │  │• Ürünler│  │• Satış   │  │• Yeni    │  │• Profil  │     │
│  │• Aktif   │  │• Kategori│  │• Teslimat│  │ sipariş │  │• Çalışma │     │
│  │• Geçmiş  │  │• Fiyatlar│  │• Performans│ • Sistem │  │  şekli   │     │
│  │• İptaller│  │• Stok    │  │• Mali    │  │• Kurye   │  │• Entegrasyon│  │
│  │          │  │          │  │          │  │  durum  │  │• Kullanıcı│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 1. SİPARİŞ YÖNETİMİ MODÜLÜ

### 1.1 Entegrasyon Yönetimi

```typescript
interface IntegrationHub {
  // Bağlı platformlar
  connectedPlatforms: {
    yemeksepeti: PlatformConnection;
    getir: PlatformConnection;
    trendyol: PlatformConnection;
    migros: PlatformConnection;
    manual: ManualEntryConfig;
  };
  
  // Platform bağlantı durumu
  platformStatus: {
    isConnected: boolean;
    lastSync: Date;
    apiStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
    authExpiry: Date;
  };
}

interface PlatformConnection {
  // OAuth2 veya API Key ile bağlantı
  auth: {
    type: 'OAUTH2' | 'API_KEY';
    credentials: OAuth2Tokens | APIKeyCredentials;
    expiresAt: Date;
  };
  
  // Webhook yapılandırması
  webhooks: {
    newOrder: WebhookConfig;
    statusUpdate: WebhookConfig;
    cancellation: WebhookConfig;
  };
  
  // Senkronizasyon ayarları
  sync: {
    autoImport: boolean;        // Otomatik sipariş import
    menuSync: boolean;          // Menü senkronizasyonu
    statusPush: boolean;        // Durum geri bildirimi
    interval: number;           // Senkronizasyon aralığı (dakika)
  };
}
```

### 1.2 Sipariş Akışı (Lifecycle)

```
┌─────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│  YENİ   │───▶│  ONAYLANDI│───▶│  HAZIRLANIYOR│───▶│  HAZIR    │───▶│  KURYEDE  │
│ (Sipariş│    │  (Restoran│    │  (Mutfak) │    │  (Paket   │    │  (Yolda)  │
│  geldi) │    │  onayladı)│    │           │    │  hazır)   │    │           │
└─────────┘    └───────────┘    └───────────┘    └───────────┘    └──────┬────┘
                                                                           │
┌──────────────────────────────────────────────────────────────────────────┘
│
▼
┌───────────┐    ┌───────────┐
│  TESLİM   │◀───│  YOLDA    │
│  EDİLDİ   │    │           │
└───────────┘    └───────────┘

İPTAL AKIŞI (Herhangi bir aşamada):
┌─────────┐    ┌───────────┐    ┌───────────┐
│  İPTAL  │───▶│  ONAY     │───▶│  İPTAL    │
│  İSTEĞİ │    │  BEKLİYOR │    │  EDİLDİ   │
└─────────┘    │  (Bayi)   │    └───────────┘
               └───────────┘
```

### 1.3 Sipariş Detay Ekranı

```typescript
interface OrderDetailView {
  // Temel bilgiler
  header: {
    orderNumber: string;
    platform: 'YEMEKSEPETI' | 'GETIR' | 'TRENDYOL' | 'MIGROS' | 'MANUAL';
    status: OrderStatus;
    priority: 'NORMAL' | 'HIGH' | 'URGENT';
    createdAt: Date;
    estimatedDelivery: Date;
  };
  
  // Müşteri bilgileri
  customer: {
    name: string;
    phone: string;
    address: Address;
    deliveryNotes: string;
    orderHistory: CustomerHistory;
  };
  
  // Sipariş kalemleri
  items: {
    product: Product;
    quantity: number;
    unitPrice: number;
    options: SelectedOption[];
    notes: string;
    total: number;
  }[];
  
  // Ödeme bilgileri
  payment: {
    method: 'CREDIT_CARD' | 'CASH' | 'ONLINE';
    subtotal: number;
    discount: number;
    deliveryFee: number;
    tip: number;
    total: number;
    platformCommission: number;
  };
  
  // Teslimat bilgileri
  delivery: {
    courier: Courier | null;
    estimatedPickup: Date;
    estimatedDelivery: Date;
    actualPickup: Date | null;
    actualDelivery: Date | null;
    trackingUrl: string;
  };
  
  // Eylemler
  actions: {
    canConfirm: boolean;
    canPrepare: boolean;
    canReady: boolean;
    canAssignCourier: boolean;
    canCancel: boolean;
    canPrint: boolean;
  };
}
```

### 1.4 Sipariş Listesi Görünümü

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  📦 AKTİF SİPARİŞLER                                    [+ Yeni Sipariş]    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Filtre: [Tümü ▼] [Platform: Tümü ▼] [Tarih: Bugün ▼]        [🔍 Ara...]    │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ 🟠 #YS-28472    Yemeksepeti    ⏱️ 12 dk    🔥 ACİL                   │  │
│  │    Ahmet Y. - Kadıköy              3 ürün    ₺245                    │  │
│  │    Durum: HAZIRLANIYOR    Mutfak: 15 dk                              │  │
│  │    [✓ Hazır] [👤 Kurye Ata] [🖨️ Fiş] [❌ İptal]                      │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔵 #GT-9156     Getir          ⏱️ 5 dk     🟢 NORMAL                 │  │
│  │    Ayşe K. - Fenerbahçe            2 ürün    ₺180                    │  │
│  │    Durum: ONAYLANDI      Bekliyor...                                 │  │
│  │    [🍳 Hazırla] [❌ İptal]                                           │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ 🟣 #TY-4412     Trendyol       ⏱️ 28 dk    🟢 NORMAL                 │  │
│  │    Mehmet B. - Suadiye             5 ürün    ₺420                    │  │
│  │    Durum: KURYEDE      👤 Ali K. - 🏍️ ABC-123                       │  │
│  │    Tahmini: 8 dk    [📍 Takip] [📞 Ara]                              │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 2. MENÜ YÖNETİMİ MODÜLÜ

### 2.1 Menü Yapısı

```typescript
interface MenuManagement {
  // Kategoriler
  categories: {
    id: string;
    name: string;
    description: string;
    sortOrder: number;
    image: string;
    isActive: boolean;
    availability: AvailabilitySchedule;
  }[];
  
  // Ürünler
  products: {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    basePrice: number;
    costPrice: number;        // Maliyet (kar hesabı için)
    images: string[];
    
    // Varyantlar (örn: Küçük/Orta/Büyük)
    variants: {
      id: string;
      name: string;
      priceModifier: number;  // +₺10 gibi
    }[];
    
    // Seçenekler (örn: Ekstra peynir, acılı)
    options: {
      id: string;
      name: string;
      type: 'SINGLE' | 'MULTIPLE';
      choices: {
        id: string;
        name: string;
        price: number;
      }[];
    }[];
    
    // Stok
    inventory: {
      trackStock: boolean;
      currentStock: number;
      lowStockAlert: number;
      unit: string;
    };
    
    // Görünürlük
    visibility: {
      isActive: boolean;
      platforms: {
        yemeksepeti: boolean;
        getir: boolean;
        trendyol: boolean;
        migros: boolean;
        manual: boolean;
      };
      schedule: AvailabilitySchedule;
    };
  }[];
}
```

### 2.2 Menü Yönetim Ekranı

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  📋 MENÜ YÖNETİMİ                                    [+ Kategori] [+ Ürün]  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐  ┌──────────────────────────────────────────────────────┐  │
│  │  KATEGORİLER│  │  ÜRÜNLER                                             │  │
│  │             │  │                                                      │  │
│  │ 🍔 Burger   │  │  ┌────────────────────────────────────────────────┐  │  │
│  │ 🍕 Pizza    │  │  │ 🍔 klasik Burger                    ₺85    [✏️]│  │  │
│  │ 🥗 Salata   │  │  │    Stok: 45 adet    Tüm platformlarda aktif    │  │  │
│  │ 🍟 Ara Sıcak│  │  │    Maliyet: ₺35    Kar marjı: %59              │  │  │
│  │ 🥤 İçecek   │  │  └────────────────────────────────────────────────┘  │  │
│  │             │  │                                                      │  │
│  │ [+ Yeni]    │  │  ┌────────────────────────────────────────────────┐  │  │
│  │             │  │  │ 🍔 Cheese Burger                    ₺95    [✏️]│  │  │
│  │             │  │  │    Stok: 32 adet    🔴 Getir'de pasif          │  │  │
│  │             │  │  │    ⚠️ Düşük stok uyarısı!                        │  │  │
│  │             │  │  └────────────────────────────────────────────────┘  │  │
│  │             │  │                                                      │  │
│  └─────────────┘  └──────────────────────────────────────────────────────┘  │
│                                                                               │
│  Platform Senkronizasyonu:                                                    │
│  🟢 Yemeksepeti: Senkronize    🔴 Getir: Senkronizasyon hatası              │
│  🟢 Trendyol: Senkronize       🟢 Migros: Senkronize                        │
│                                                                               │
│  [🔄 Tüm Platformlarla Senkronize Et]                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Ürün Düzenleme Modalı

```
┌───────────────────────────────────────────────────────────────┐
│  ✏️ Ürün Düzenle: Klasik Burger                    [X]        │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  📝 Temel Bilgiler                                            │
│  Ürün Adı: [Klasik Burger                      ]              │
│  Açıklama: [Dana eti, marul, domates, turşu... ]              │
│  Kategori: [🍔 Burgerler         ▼]                           │
│                                                                │
│  💰 Fiyatlandırma                                             │
│  Temel Fiyat:     [85      ] ₺                                │
│  Maliyet:         [35      ] ₺  (Kar: ₺50 / %59)              │
│                                                                │
│  📐 Varyantlar                                   [+ Varyant]  │
│  ○ Normal (varsayılan)    ₺85                                 │
│  ● Büyük                 ₺+15                                 │
│                                                                │
│  ➕ Seçenekler                                    [+ Seçek]  │
│  Ekstra Malzemeler (Çoklu seçim):                             │
│    [✓] Peynir          +₺10                                  │
│    [✓] Bacon           +₺15                                  │
│    [ ] Jalapeno        +₺5                                   │
│                                                                │
│  📦 Stok Yönetimi                                             │
│  [✓] Stok takibi aktif                                       │
│  Mevcut Stok:     [45      ] adet                             │
│  Kritik Stok:     [10      ] adet                             │
│                                                                │
│  🌐 Platform Görünürlüğü                                      │
│  [✓] Yemeksepeti  [✓] Getir  [✓] Trendyol  [✓] Migros        │
│                                                                │
│           [❌ İptal]          [💾 Kaydet]                      │
└───────────────────────────────────────────────────────────────┘
```

---

## 📊 3. RAPORLAR MODÜLÜ

### 3.1 Satış Raporları

```typescript
interface SalesReports {
  // Zaman bazlı
  timeBased: {
    hourly: HourlySales[];
    daily: DailySales[];
    weekly: WeeklySales[];
    monthly: MonthlySales[];
  };
  
  // Ürün bazlı
  productBased: {
    topSelling: TopProduct[];
    byCategory: CategorySales[];
    byPlatform: PlatformSales[];
  };
  
  // Müşteri bazlı
  customerBased: {
    topCustomers: TopCustomer[];
    newVsReturning: Ratio;
    averageOrderValue: number;
  };
}
```

### 3.2 Dashboard Widget'ları

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  📊 BUGÜN ÖZETİ                                          [📅 18 Mart 2026]  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   💰       │  │   📦       │  │   ⏱️       │  │   ⭐       │         │
│  │  ₺12,450   │  │   48      │  │  28 dk    │  │   4.8     │         │
│  │  Ciro      │  │  Sipariş  │  │Ort.Teslimat│  │Puanlama  │         │
│  │  +15%     │  │  +8%      │  │  -2 dk    │  │  +0.2    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                                               │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐           │
│  │  📈 SATIŞ GRAFİĞİ          │  │  📊 PLATFORM DAĞILIMI       │           │
│  │                            │  │                             │           │
│  │    ₺                       │  │    🟠 Yemeksepeti  45%      │           │
│  │ 12k ┤    ╱╲               │  │    🔵 Getir        30%      │           │
│  │ 10k ┤   ╱  ╲  ╱╲          │  │    🟣 Trendyol     15%      │           │
│  │  8k ┤  ╱    ╲╱  ╲         │  │    🟡 Migros       10%      │           │
│  │     └───────                │  │                             │           │
│  │     09 12 15 18 21         │  │    [🍕 Pasta Görünümü]      │           │
│  │                            │  │                             │           │
│  └─────────────────────────────┘  └─────────────────────────────┘           │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  🔥 EN ÇOK SATAN ÜRÜNLER                                               │ │
│  │                                                                        │ │
│  │  #1  🍔 Klasik Burger        45 adet    ₺3,825    %30                  │ │
│  │  #2  🍕 Margherita Pizza     32 adet    ₺2,880    %22                  │ │
│  │  #3  🥤 Coca Cola (33cl)     67 adet    ₺871      %7                   │ │
│  │                                                                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔔 4. BİLDİRİMLER MODÜLÜ

### 4.1 Gerçek Zamanlı Bildirimler

```typescript
interface NotificationSystem {
  channels: {
    browser: BrowserNotification;
    sms: SMSNotification;
    email: EmailNotification;
    push: PushNotification;
  };
  
  triggers: {
    newOrder: {
      enabled: boolean;
      sound: boolean;
      desktop: boolean;
      sms: boolean;
    };
    courierAssigned: {
      enabled: boolean;
      desktop: boolean;
    };
    lowStock: {
      enabled: boolean;
      threshold: number;
      email: boolean;
    };
    // ... diğer tetikleyiciler
  };
}
```

---

## ⚙️ 5. AYARLAR MODÜLÜ

### 5.1 Restoran Ayarları

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ⚙️ RESTORAN AYARLARI                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  [📋 Profil]  [💰 Çalışma Şekli]  [🔌 Entegrasyonlar]  [👥 Kullanıcılar]    │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  💰 ÇALIŞMA ŞEKLİ (Bayi tarafından atanır)                            │  │
│  │                                                                        │  │
│  │  Aktif Çalışma Şekli: Paket Başı                                       │  │
│  │  Paket Başı Ücret: ₺110                                                │  │
│  │                                                                        │  │
│  │  [Fiyatlandırma değişiklikleri için bayinizle iletişime geçin]        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  🔌 PLATFORM ENTEGRASYONLARI                                          │  │
│  │                                                                        │  │
│  │  🟠 Yemeksepeti                              [Bağlı ✓] [Yenile]       │  │
│  │     Son senkronizasyon: 2 dk önce                                      │  │
│  │                                                                        │  │
│  │  🔵 Getir                                     [Bağlı ✓] [Yenile]       │  │
│  │     Son senkronizasyon: 5 dk önce                                      │  │
│  │                                                                        │  │
│  │  🟣 Trendyol                                [Bağlan +]               │  │
│  │                                                                        │  │
│  │  🟡 Migros                                  [Bağlan +]               │  │
│  │                                                                        │  │
│  │  📱 Chrome Extension                        [Kurulum Talimatları]     │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛣️ IMPLEMENTASYON PLANI

### Faz 1: Platform Entegrasyonları (Öncelik: 1)

```
Hafta 1-2: Yemeksepeti Entegrasyonu
├── OAuth2 bağlantı akışı
├── Sipariş çekme (API polling + webhook)
├── Durum gönderme (Hazırlanıyor, Hazır, vs.)
└── Menü senkronizasyonu

Hafta 3-4: Getir Entegrasyonu
├── Benzer yapı
└── Getir özel alanları

Hafta 5-6: Trendyol + Migros
└── Paralel geliştirme
```

### Faz 2: Restoran Portalı Frontend (Öncelik: 1)

```
Hafta 1: Temel Yapı
├── Layout, Sidebar, Routing
├── Auth (JWT)
└── Tema (Tailwind)

Hafta 2: Sipariş Modülü
├── Sipariş listesi
├── Sipariş detay
├── Durum değiştirme
└── Kurye atama

Hafta 3: Menü Modülü
├── Kategori yönetimi
├── Ürün CRUD
├── Varyant/Seçenek
└── Stok takibi

Hafta 4: Raporlar + Bildirimler
├── Dashboard
├── Satış raporları
├── Gerçek zamanlı bildirimler
└── Ayarlar sayfası
```

### Faz 3: Kurye Mobil App Sonlandırma (Öncelik: 2)

```
Hafta 1: Temel Akış
├── Login/Auth
├── Sipariş listesi
└── Sipariş detay

Hafta 2: İleri Özellikler
├── GPS konum gönderme
├── Durum değiştirme
└── Navigasyon entegrasyonu

Hafta 3: Ek Modüller
├── Vardiya takibi
├── Mola sistemi
└── Kazanç görünümü

Hafta 4: Test + Build
├── Android APK build
├── iOS build
└── Beta test
```

---

## 🚀 BAŞLANGIÇ

**Şimdi ne yapalım?**

1. **Backend API entegrasyonları** mı başlasın?
   - Yemeksepeti OAuth2 ve sipariş çekme
   
2. **Frontend portal** mı başlasın?
   - React + Tailwind temel yapı
   
3. **Mobil app** mi devam etsin?
   - Flutter sonlandırma

**Sen ne diyorsun?** 🤔
