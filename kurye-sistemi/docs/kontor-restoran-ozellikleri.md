# PAKETÇİ - Kontör Sistemi ve Restoran Yönetimi Planı

## 💰 KONTÖR SİSTEMİ (Güncel)

### Fiyatlandırma
```yaml
Minimum kontör: 2 TL (KDV hariç) / paket

Kontör Paketleri:
  - Başlangıç:    1.000 paket = 2.000 TL (KDV hariç)
  - Standart:     5.000 paket = 9.500 TL (KDV hariç)  (%5 indirim)
  - Profesyonel: 10.000 paket = 18.000 TL (KDV hariç) (%10 indirim)
  - Kurumsal:    50.000 paket = 85.000 TL (KDV hariç) (%15 indirim)
```

### Kontör Akışı
```
1. Paketçi Admin → Bayi seç → Kontör yükle
2. Bayi bakiyesi artar (örn: +1000 paket)
3. Restoran sipariş oluşturur
4. Sistem kontrol eder: Bayi bakiyesi > 0?
5. Evet → Kurye ata, kontör düş (1000 → 999)
6. Hayır → "Kontör yetersiz" uyarısı
```

---

## 🍽️ RESTORAN EKLEME ÖZELLİKLERİ

### Şu An Yapılanlar
Henüz implemente edilmedi, plan aşağıda:

### 1. Restoran Entity (Güncellenecek)
```typescript
@Entity('restaurants')
class Restaurant {
  // Mevcut alanlar
  id: string;
  name: string;
  email: string;
  phone: string;
  
  // YENİ EKLENECEK
  
  // 📍 Konum Bilgileri
  address: {
    full: string;           // Açık adres (örn: "Kadıköy, Caferağa Mah. X Sok. No:5")
    district: string;       // İlçe
    city: string;          // Şehir
    postalCode: string;    // Posta kodu
  };
  
  location: {
    latitude: number;      // 40.9823
    longitude: number;     // 29.0254
  };
  
  // 📞 İletişim
  contactPhone: string;    // Restoran telefonu
  contactName: string;     // Yetkili kişi adı
  
  // 🏢 Bayi İlişkisi
  dealerId: string;        // Hangi bayiye bağlı
  
  // ⚙️ Çalışma Şekli
  pricingType: PricingType;
  pricingConfig: PricingConfig;
  
  // 🔌 Extension
  apiKey: string;          // Otomatik sipariş için
  extensionEnabled: boolean;
  
  // 💰 Kontör/Bakiye (Bayi'den kontrol)
  
  // 📊 Durum
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

enum PricingType {
  FIXED_PER_PACKAGE = 'fixed',      // Sabit paket başı
  DISTANCE_BASED = 'distance',      // Mesafe bazlı
  ZONE_BASED = 'zone',              // Bölge bazlı
  HOURLY = 'hourly'                 // Saatlik farklı
}

interface PricingConfig {
  basePrice: number;               // Temel fiyat (₺35)
  
  // Bölge bazlı için
  zones?: {
    zone1: { price: number; neighborhoods: string[] };  // Mavi bölge
    zone2: { price: number; neighborhoods: string[] };  // Sarı bölge
    zone3: { price: number; neighborhoods: string[] };  // Kırmızı bölge
  };
  
  // Mesafe bazlı için
  distanceTiers?: {
    tier1: { maxKm: number; price: number };
    tier2: { maxKm: number; price: number };
    tier3: { maxKm: number; price: number };
  };
  
  // Saatlik için
  hourlyRates?: {
    normal: { start: '09:00'; end: '17:00'; price: number };
    peak: { start: '17:00'; end: '22:00'; price: number };
    night: { start: '22:00'; end: '09:00'; price: number };
  };
}
```

---

### 2. Restoran Ekleme Formu (Admin/Bayi Paneli)

```
┌─────────────────────────────────────────────┐
│  🍽️ YENİ RESTORAN EKLE                     │
├─────────────────────────────────────────────┤
│                                             │
│  🏢 TEMEL BİLGİLER                         │
│  ┌─────────────────────────────────────┐   │
│  │ Restoran Adı: [________________]   │   │
│  │ Yetkili Adı:  [________________]   │   │
│  │ Email:        [________________]   │   │
│  │ Telefon:      [________________]   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  📍 KONUM BİLGİLERİ                        │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │ [HARİTA: Pin seçilebilir]          │   │
│  │                                     │   │
│  │ Açık Adres:                        │   │
│  │ [____________________________]     │   │
│  │ [____________________________]     │   │
│  │                                    │   │
│  │ İlçe: [Kadıköy        ▼]          │   │
│  │ Şehir: [İstanbul      ▼]          │   │
│  │                                    │   │
│  │ 📍 Lat: 40.9823  Lng: 29.0254     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  🏪 BAYİ ATAMASI                           │
│  ┌─────────────────────────────────────┐   │
│  │ Bayi: [Hızlı Kurye A.Ş.    ▼]     │   │
│  │                                     │   │
│  │ Yeni bayi ise: [+ Bayi Ekle]       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ⚙️ ÇALIŞMA ŞEKLİ SEÇİMİ                   │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │ ○ Sabit Paket Başı                 │   │
│  │   ₺[ 35 ] / paket                  │   │
│  │                                    │   │
│  │ ● Bölge Bazlı                      │   │
│  │   🔵 Mavi Bölge:  ₺[ 35 ]          │   │
│  │   🟡 Sarı Bölge:  ₺[ 45 ]          │   │
│  │   🔴 Kırmızı Bölge: ₺[ 60 ]        │   │
│  │                                    │   │
│  │   Mahalle Listesi:                 │   │
│  │   [Caferağa, Osmanağa, Moda...]   │   │
│  │                                    │   │
│  │ ○ Mesafe Bazlı                     │   │
│  │   0-3 km:  ₺[ 35 ]                 │   │
│  │   3-5 km:  ₺[ 45 ]                 │   │
│  │   5+ km:   ₺[ 60 ]                 │   │
│  │                                    │   │
│  │ ○ Saatlik Farklı                   │   │
│  │   Normal (09-17): ₺[ 35 ]          │   │
│  │   Yoğun (17-22):  ₺[ 45 ]          │   │
│  │   Gece (22-09):   ₺[ 60 ]          │   │
│  │                                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  🔌 EXTENSION AYARLARI                     │
│  ┌─────────────────────────────────────┐   │
│  │ [✓] Otomatik sipariş aktif         │   │
│  │                                    │   │
│  │ API Key: pk_live_xxxxxxxxxxxx      │   │
│  │ [Yenile] [Kopyala]                 │   │
│  │                                    │   │
│  │ Platformlar:                       │   │
│  │ [✓] Yemeksepeti  [✓] Getir       │   │
│  │ [ ] Trendyol     [ ] Migros       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [❌ İptal]        [✓ RESTORANI KAYDET]   │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 3. Backend API Endpoint'leri

```typescript
// Restoran CRUD
POST   /admin/restaurants              // Yeni restoran ekle
GET    /admin/restaurants              // Tüm restoranları listele
GET    /admin/restaurants/:id          // Restoran detayı
PUT    /admin/restaurants/:id          // Restoran güncelle
DELETE /admin/restaurants/:id          // Restoran sil

// Bayi bazlı listeleme
GET    /dealers/:dealerId/restaurants  // Bayi'nin restoranları

// Konum bazlı arama
GET    /restaurants/nearby?lat=40.98&lng=29.02&radius=5

// Çalışma şekli güncelleme
PUT    /restaurants/:id/pricing        // Fiyatlandırma ayarları
```

---

### 4. Frontend Ekranları

#### Admin Panel - Restoran Listesi
```
┌─────────────────────────────────────────────┐
│  🍽️ RESTORANLAR                            │
├─────────────────────────────────────────────┤
│                                             │
│  [🔍 Ara...] [🏪 Filtrele] [+ Yeni Ekle]   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🍕 Ateş Döner                       │   │
│  │ 📍 Kadıköy, İstanbul               │   │
│  │ 🏪 Hızlı Kurye A.Ş. (Bayi)         │   │
│  │ 💰 Bölge Bazlı | 🔵₺35 🟡₺45 🔴₺60 │   │
│  │ ● Aktif  |  156 paket/ay           │   │
│  │                                     │   │
│  │ [👁️ Gör] [✏️ Düzenle] [🗑️ Sil]    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🍔 Burger King - Acıbadem          │   │
│  │ 📍 Kadıköy, İstanbul               │   │
│  │ 🏪 Hızlı Kurye A.Ş.                │   │
│  │ 💰 Sabit | ₺35/paket               │   │
│  │ ● Aktif  |  243 paket/ay           │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 IMPLEMENTASYON PLANI

### Faz 1: Kontör Sistemi
- [ ] Dealer entity'sine `credits` alanı ekle
- [ ] Kontör paket tanımları (Admin panel)
- [ ] Kontör yükleme API'si
- [ ] Sipariş oluşturma kontrolü (kontör var mı?)
- [ ] Kontör harcama logları

### Faz 2: Restoran Konum
- [ ] Restaurant entity güncelleme (adres, lat/lng)
- [ ] Harita entegrasyonu (Google Maps/Leaflet)
- [ ] Adres autocomplete (Google Places)
- [ ] Konum doğrulama

### Faz 3: Çalışma Şekli
- [ ] PricingConfig interface
- [ ] 4 farklı pricing type implementasyonu
- [ ] Bölge tanımlama (mahalle listesi)
- [ ] Fiyat hesaplama servisi

### Faz 4: Admin Panel
- [ ] Restoran listesi ekranı
- [ ] Restoran ekleme formu
- [ ] Çalışma şekli seçimi modalı
- [ ] Harita seçici komponent

---

**Not:** Bu özellikler henüz kodlanmadı. Sırayla implemente edilecek.
