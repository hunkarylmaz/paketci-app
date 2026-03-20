# 🚀 PAKETÇİ EKOSİSTEMİ - GÜNCEL DURUM RAPORU

## 📅 Tarih: 18 Mart 2026

---

## 🏢 İŞ MODELİ: SaaS (Software as a Service)

```
┌─────────────────────────────────────────────────────────────┐
│                    PAKETÇİ (SaaS)                          │
│                   paketci.app                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💰 KONTÖR SATIŞI                                   │   │
│  │  • 1.000 paket = 2.000 TL (KDV hariç)              │   │
│  │  • 5.000 paket = 9.500 TL (%5 indirim)             │   │
│  │  • 10.000 paket = 18.000 TL (%10 indirim)          │   │
│  │  • 50.000 paket = 85.000 TL (%15 indirim)          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ kontör satın alır
┌─────────────────────────────────────────────────────────────┐
│  🏪 BAYİLER (Dealer/Independent Operator)                  │
│  • Kendi markası altında çalışır                           │
│  • Kendi kuryeleri ve restoranları                         │
│  • Kendi fiyatlandırmasını yapar                           │
│  • Veri izolasyonu (sandbox)                               │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│  🍽️ RESTORANLAR         │    │  🏍️ KURYELER            │
│  • Sipariş oluşturur    │    │  • Paket dağıtır        │
│  • Extension kullanır   │    │  • Mobilden takip       │
│  • Ödeme yapar          │    │  • Kazanç alır          │
└─────────────────────────┘    └─────────────────────────┘
```

---

## 👥 4 KATMANLI KULLANICI HİYERARŞİSİ

| Seviye | Rol | Yetkiler |
|--------|-----|----------|
| **1** | **Paketçi Admin** | Kontör paketi tanımlama, Bayi ekleme, Sistem yönetimi |
| **2** | **Bayi** | Restoran ekleme, Kurye ekleme, Fiyatlandırma ayarlama, Raporlar |
| **3** | **Restoran** | Sipariş oluşturma, Kurye çağırma, Ödeme takibi |
| **4** | **Kurye** | Sipariş alma, Teslimat tamamlama, Kazanç görüntüleme |

---

## 💻 TEKNİK ALTYAPI

### 1️⃣ Backend (NestJS + TypeScript)
```yaml
Port: 4000
Database: PostgreSQL (localhost:5432)
Cache: Redis (localhost:6379)

Modüller:
  ✓ Auth (JWT Bearer Token)
  ✓ Users (4 rol: Admin, Dealer, Restaurant, Courier)
  ✓ Restaurants (9 çalışma şekli ile birlikte)
  ✓ Couriers (Çalışma modları: Sabit maaş, Paket başı, vs.)
  ✓ Deliveries (Teslimat yönetimi)
  ✓ Shifts (Vardiya takibi)
  ✓ Payments (Iyzico + Banka transferi)
  ✓ Credits (Kontör sistemi)
  ✓ Extension (Chrome Extension API)
  ✓ Reports (Excel export)
  ✓ Notifications (SMS/Push)
  ✓ Maps (Konum servisleri)
```

### 2️⃣ Frontend (Next.js + React + TypeScript)
```yaml
Port: 3000
Styling: Tailwind CSS

Ekranlar:
  ✓ Login / Auth
  ✓ Admin Dashboard (Bayi yönetimi, Kontör yükleme)
  ✓ Bayi Paneli (Restoran/Kurye yönetimi, Raporlar)
  ✓ Restoran Paneli (Siparişler, Ödemeler)
  🔄 Restoran Ekleme Wizard (6 adım - YENİ!)
    - Adım 1: Temel Bilgiler
    - Adım 2: İşletme Ayarları  
    - Adım 3: Çalışma Tipi (9 seçenek)
    - Adım 4: Kullanıcılar
    - Adım 5: Konum (Harita)
    - Adım 6: Özet ve Onay
```

### 3️⃣ Mobile App (Flutter)
```yaml
Platform: iOS + Android
Language: Dart

Özellikler:
  ✓ Kurye Login
  ✓ Sipariş Listesi (Modern kart tasarımı)
  ✓ Sipariş Detayı (Navigasyon, Arama butonları)
  ✓ Vardiya Takibi
  ✓ Bakiye Yükleme (Iyzico + Banka)
  🔄 Profil ve Ayarlar
```

### 4️⃣ Browser Extension (Chrome)
```yaml
Manifest: v3
Desteklenen Platformlar:
  ✓ Yemeksepeti (kırmızı #E31837)
  ✓ Getir (mor #5D3EBC)
  ✓ Trendyol (turuncu #F27A1A)
  ✓ Migros (sarı #FFC72C)

Özellikler:
  ✓ Otomatik sipariş algılama
  ✓ "Kurye Çağır" butonu enjeksiyonu
  ✓ Paketçi API entegrasyonu
  ✓ API Key ile kimlik doğrulama
```

---

## 🍽️ RESTORAN ÇALIŞMA ŞEKİLLERİ (9 TİP)

| # | Tip | Mantık | Örnek |
|---|-----|--------|-------|
| 1 | **Paket Başı** | Her paket sabit ücret | ₺110/paket |
| 2 | **Kilometre Başı** | Her km sabit ücret | ₺10/km |
| 3 | **Kilometre Aralığı** | Mesafeye göre kademeli | 0-3km:₺35, 3-5km:₺45, 5+km:₺60 |
| 4 | **Paket + Km** | İkisi birlikte | ₺30 + ₺8/km |
| 5 | **Sabit Km + Km** | İlk X km sabit | İlk 3km ₺35, sonrası ₺10/km |
| 6 | **Komisyon** | Sipariş tutarından % | %15 komisyon |
| 7 | **Sabit Ücret** | Aylık/Yıllık üyelik | ₺5.000/ay |
| 8 | **Saatlik Ücret** | Günün saatine göre | Normal:₺35, Yoğun:₺45, Gece:₺60 |
| 9 | **Bölge Bazlı** | Mahalle bazlı bölgeler | 🔵Mavi:₺35, 🟡Sarı:₺45, 🔴Kırmızı:₺60 |

---

## 💰 KONTÖR (PAKET KREDİ) SİSTEMİ

```
Akış:
1. Paketçi → Bayi'ye kontör satar (örn: 1.000 paket = 2.000 TL)
2. Bayi → Restoran siparişi oluşturur
3. Sistem kontrol eder: Bayi'nin kontörü var mı?
   ✓ EVET → Kurye atanır, kontör düşülür (1.000 → 999)
   ✗ HAYIR → "Kontör yetersiz" hatası
```

---

## 📊 TAMAMLANAN ÖZELLİKLER

### ✅ Backend
- [x] PostgreSQL + Redis altyapısı
- [x] JWT Authentication
- [x] 4 rol bazlı yetkilendirme
- [x] Restaurant entity (9 çalışma şekli)
- [x] RestaurantUser entity (çoklu kullanıcı)
- [x] Wizard API endpoint'leri
- [x] Geocoding (adres arama)
- [x] Extension modülü (API Key)
- [x] Payment entegrasyonu (Iyzico)
- [x] Excel export servisi

### ✅ Frontend  
- [x] 6 adımlı Restoran Wizard
- [x] Stepper komponenti
- [x] 9 çalışma şekli form'ları
- [x] Harita entegrasyonu (Leaflet)
- [x] Kullanıcı ekleme/çıkarma
- [x] Özet ekranı

### ✅ Mobile (Flutter)
- [x] Login screen
- [x] Home screen (modern kartlar)
- [x] Delivery detail (arama/navigasyon)
- [x] Balance load (ödeme ekranı)

### ✅ Extension
- [x] Manifest v3
- [x] 4 platform detektörü
- [x] Buton enjeksiyonu
- [x] API entegrasyonu

---

## 🔄 DEVAM EDEN / BEKLEYEN İŞLER

### Yakında Eklenecek
1. **Kurye Mola Sistemi** (Break entity + onay akışı)
2. **Kurye Kaza/Acil Butonu** (Panik butonu)
3. **Kurye Raporları** (Kazanç/vardiya özetleri)
4. **Restoran Ödeme Düzenleme** (Yetki bazlı)
5. **İptal Onay Süreci** (Workflow)

### Teknik Borç
- [ ] Android SDK kurulumu (APK build için)
- [ ] iOS build (Xcode gerekli)
- [ ] Gerçek Iyzico API key'leri
- [ ] Production deployment

---

## 🎯 SONUÇ

**Paketçi**, Türkiye'deki restoranlar için **kapsamlı bir kurye yönetim SaaS'ı** olarak konumlanıyor:

- ✅ **4 katmanlı** kullanıcı yapısı
- ✅ **9 farklı** fiyatlandırma modeli
- ✅ **6 adımlı** restoran onboarding
- ✅ **4 platformu** destekleyen Extension
- ✅ **Kontör bazlı** ödeme sistemi
- ✅ **Tam entegre** mobil uygulama

**Paketçi'nin hedefi:** Her ölçekten restorana uyan esnek bir kurye yönetim sistemi sunmak.

---

*Bir sonraki adım ne olsun?* 🤔
