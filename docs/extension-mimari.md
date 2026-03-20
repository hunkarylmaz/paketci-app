# Paketçi Browser Extension - Mimari Dokümantasyon

## 🎯 Proje Amacı

Restoranların Yemeksepeti, Getir, Trendyol Yemek, Migros Yemek panellerindeki siparişlerini **otomatik** veya **manuel buton** ile Paketçi sistemine aktaran Chrome/Firefox eklentisi.

---

## 🏗️ Mimari Yapı

```
┌─────────────────────────────────────────────────────────────────┐
│                    RESTORAN TARAYICI                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Yemeksepeti │  │    Getir    │  │  Trendyol   │  ...        │
│  │   (Sekme)   │  │   (Sekme)   │  │   (Sekme)   │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         └────────────────┴────────────────┘                     │
│                          │                                      │
│  ┌───────────────────────┴───────────────────────┐              │
│  │        CONTENT SCRIPTS (Her sekmede)          │              │
│  │  • DOM Observer (MutationObserver)            │              │
│  │  • Sipariş tespiti                            │              │
│  │  • "Kurye Çağır" butonu ekleme                │              │
│  └───────────────────────┬───────────────────────┘              │
│                          │                                      │
│  ┌───────────────────────┴───────────────────────┐              │
│  │      BACKGROUND SERVICE WORKER                │              │
│  │  • Sekme yönetimi                             │              │
│  │  • Otomatik/Manuel mod kontrolü               │              │
│  │  • Paketçi API iletişimi                      │              │
│  │  • Sipariş cache (tekrar gönderme önleme)     │              │
│  └───────────────────────┬───────────────────────┘              │
│                          │                                      │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PAKETÇİ BACKEND                            │
│         (https://api.paketci.app/v1/extension)                  │
│  • Sipariş oluşturma endpoint                                   │
│  • Restoran doğrulama (API Key)                                 │
│  • Sipariş durumu güncelleme                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Dosya Yapısı

```
extension/
├── manifest.json              # Eklenti manifest (v3)
├── popup.html                 # Popup arayüz
├── popup.js                   # Popup logic
├── popup.css                  # Popup stilleri
├── background.js              # Service worker (background)
├── content/
│   ├── content.js             # Ana content script
│   ├── detectors/
│   │   ├── yemeksepeti.js     # Yemeksepeti sipariş tespiti
│   │   ├── getir.js           # Getir sipariş tespiti
│   │   ├── trendyol.js        # Trendyol sipariş tespiti
│   │   └── migros.js          # Migros sipariş tespiti
│   └── injectors/
│       └── button-injector.js # Kurye Çağır butonu
├── shared/
│   ├── api.js                 # Paketçi API istemcisi
│   ├── storage.js             # Chrome storage yönetimi
│   └── constants.js           # Sabitler, selector'lar
├── assets/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── _locales/
    └── tr/
        └── messages.json      # Türkçe dil dosyası
```

---

## ⚙️ Çalışma Modları

### 1️⃣ OTOMATİK MOD
```
Eklenti sürekli açık sekmeleri tarar
→ Yeni sipariş tespit edildi
→ Otomatik Paketçi API'ye gönder
→ Bildirim göster
```

### 2️⃣ MANUEL MOD (Kurye Çağır Butonu)
```
Eklenti butonları platform arayüzüne enjekte eder
→ Restoran "Kurye Çağır" tıklar
→ Sipariş bilgileri toplanır
→ Paketçi API'ye gönderilir
→ Platform panelinde onay gösterilir
```

---

## 🔍 Platform Tespit Stratejileri

### Yemeksepeti
```javascript
// URL Pattern: *.yemeksepeti.com/restaurant/*/orders
// MutationObserver: .order-card, [data-testid="order"]
// API Endpoint interception (isteğe bağlı)
```

### Getir
```javascript
// URL Pattern: *.getir.com/restaurant/*/orders
// DOM Selector: sipariş kartları, müşteri bilgileri
```

### Trendyol
```javascript
// URL Pattern: *.trendyol.com/seller-center/orders
// DOM Selector: sipariş tablosu satırları
```

### Migros
```javascript
// URL Pattern: *.migros.com.tr/restaurant/orders
// DOM Selector: sipariş listesi
```

---

## 🔄 Sipariş Akış Diyagramı

```
┌──────────────────────────────────────────────────────────────┐
│  PLATFORM PANELİNDE YENİ SİPARİŞ GELDİ                       │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  CONTENT SCRIPT                                              │
│  • MutationObserver tetiklendi                               │
│  • Sipariş DOM elementi tespit edildi                        │
│  • Veri parse edildi (müşteri, adres, ürünler, tutar)        │
└────────────────────────────┬─────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                              ▼
┌────────────────────────┐      ┌──────────────────────────┐
│   OTOMATİK MOD         │      │   MANUEL MOD             │
│   (Ayarlar: Açık)      │      │   (Ayarlar: Kapalı)      │
│                        │      │                          │
│  → Otomatik gönder     │      │  → "Kurye Çağır" butonu  │
│  → Background'a mesaj  │      │    enjekte et            │
└───────────┬────────────┘      └───────────┬──────────────┘
            │                               │
            │         ┌─────────────────────┘
            │         │ Restoran butona tıklar
            │         ▼
            │   ┌──────────────────────────┐
            └──►│  BACKGROUND SERVICE      │
                │  • Sipariş verisi alındı │
                │  • API Key kontrolü      │
                │  • Duplicate kontrolü    │
                └───────────┬──────────────┘
                            │
                            ▼
                ┌──────────────────────────┐
                │   PAKETÇİ API            │
                │   POST /extension/order  │
                │   {                      │
                │     platform: "getir",   │
                │     orderId: "...",      │
                │     customer: {...},     │
                │     items: [...],        │
                │     total: 150.00,       │
                │     address: "..."       │
                │   }                      │
                └───────────┬──────────────┘
                            │
                            ▼
                ┌──────────────────────────┐
                │   PAKETÇİ BACKEND        │
                │   • Sipariş oluştur      │
                │   • Kurye ata            │
                │   • Restoran bildir      │
                └──────────────────────────┘
```

---

## 🛡️ Güvenlik Önlemleri

1. **API Key Doğrulama**: Her istekte Restoran API Key kontrolü
2. **Sipariş Hash**: Aynı siparişin tekrar gönderilmesini önleme
3. **HTTPS Zorunlu**: Tüm API iletişimleri şifreli
4. **Origin Kontrolü**: Sadece izin verilen domain'lerden kabul
5. **Rate Limiting**: Dakikada max X istek

---

## 📦 Sipariş Veri Formatı

```json
{
  "platform": "getir|yemeksepeti|trendyol|migros",
  "platformOrderId": "ORD-12345678",
  "restaurantId": "PKT-REST-89234",
  "restaurantApiKey": "pk_live_xxxxxxxx",
  
  "customer": {
    "name": "Ahmet Yılmaz",
    "phone": "+90 555 123 4567",
    "note": "Kapı zili çalmasın"
  },
  
  "address": {
    "full": "Atatürk Mah. Cumhuriyet Cad. No:15 D:3",
    "city": "İstanbul",
    "district": "Kadıköy",
    "latitude": 41.0082,
    "longitude": 28.9784
  },
  
  "items": [
    {
      "name": "Tavuk Döner",
      "quantity": 2,
      "price": 45.00,
      "options": ["Acılı", "Püreli"]
    }
  ],
  
  "payment": {
    "method": "online|cash",
    "total": 150.00,
    "deliveryFee": 15.00,
    "discount": 10.00
  },
  
  "timing": {
    "orderTime": "2024-01-15T14:30:00Z",
    "prepTime": 15,
    "estimatedDelivery": "2024-01-15T15:00:00Z"
  },
  
  "metadata": {
    "sourceUrl": "https://...",
    "capturedAt": "2024-01-15T14:30:05Z",
    "autoSubmitted": false
  }
}
```

---

## 🚀 Kurulum Adımları

### 1. Eklenti Geliştirme
```bash
cd extension/
# manifest.json oluştur
# content scripts yaz
# background service worker yaz
# popup UI tasarımı
```

### 2. Chrome'a Yükleme (Developer Mode)
```
1. Chrome → Extensions → Developer mode ON
2. "Load unpacked" → extension/ klasörünü seç
3. Eklenti aktif!
```

### 3. Restoran Konfigürasyonu
```
1. Restoran Paketçi panelinden API Key alır
2. Eklentiye giriş yapar
3. Platform sekmelerini açar
4. Otomatik/Manuel mod seçer
```

---

## 🎨 UI Mockup

### Popup Arayüzü
```
┌─────────────────────────────┐
│  🔵 PAKETÇİ                 │
│                             │
│  ✅ Restoran: Ateş Döner    │
│                             │
│  [🟢 Aktif]  [⚙️ Ayarlar]   │
│                             │
│  ─── Çalışma Modu ───       │
│                             │
│  ○ Otomatik Yansıtma        │
│  ● Manuel (Kurye Çağır)     │
│                             │
│  ─── Bağlı Platformlar ───  │
│                             │
│  🛵 Getir        [✓ Açık]  │
│  🍕 Yemeksepeti  [✓ Açık]  │
│  🍔 Trendyol     [✗ Kapalı]│
│                             │
│  [📋 API Bilgileri]         │
└─────────────────────────────┘
```

### Platformdaki "Kurye Çağır" Butonu
```
┌──────────────────────────────────────────────┐
│  🛵 Yeni Sipariş #12345          [Kurye Çağır ▼] │  ← Eklenti enjekte eder
│  Ahmet Yılmaz - ₺150                         │
└──────────────────────────────────────────────┘
```

---

## 📋 Backend Endpoint Gereksinimleri

### POST /api/v1/extension/order
```javascript
// Request Headers
{
  "Authorization": "Bearer pk_live_xxxxxxxx",
  "X-Extension-Version": "1.0.0",
  "Content-Type": "application/json"
}

// Response 201 Created
{
  "success": true,
  "data": {
    "paketciOrderId": "PKT-240115-001",
    "status": "pending_assignment",
    "estimatedPickup": "15:00",
    "courier": null
  }
}

// Response 409 Conflict (Duplicate)
{
  "success": false,
  "error": "ORDER_ALREADY_EXISTS",
  "message": "Bu sipariş zaten kayıtlı"
}
```

### GET /api/v1/extension/status
```javascript
// Eklenti health check ve versiyon kontrolü
```

---

Bu mimariyle çalışmaya başlayalım mı? Önce extension klasörünü oluşturup temel dosyaları yazayım mı?
