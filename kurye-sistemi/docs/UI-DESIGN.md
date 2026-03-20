# 🎨 Kurye Yönetim Sistemi - UI/UX Tasarım Dokümanı

## 1. GENEL BAKIŞ

### Tasarım Felsefesi
Modern, profesyonel ve fonksiyonel bir B2B kurye operasyon arayüzü. Temel prensipler:
- **Netlik:** Bilgi hiyerarşisi açık
- **Erişilebilirlik:** Tek tıklamayla kritik işlemler
- **Performans:** Hızlı yüklenme, akıcı animasyonlar
- **Mobil Uyumlu:** Responsive tasarım

### Renk Paleti

```
Primary (Ana Renk):     #5B3FD9 (Mor)
Primary Light:          #7C5AE6
Primary Dark:           #4A32B3

Secondary:              #0EA5E9 (Mavi)
Success:                #22C55E (Yeşil)
Warning:                #F59E0B (Turuncu)
Danger:                 #EF4444 (Kırmızı)

Background:             #F8FAFC (Açık Gri)
Surface:                #FFFFFF (Beyaz)
Surface Dark:           #1E293B (Koyu Slate)

Text Primary:           #0F172A
Text Secondary:         #64748B
Text Muted:             #94A3B8

Border:                 #E2E8F0
```

### Tipografi
- **Font:** Inter (Google Fonts)
- **Heading:** 600 weight
- **Body:** 400 weight
- **Tablo/Data:** 500 weight

---

## 2. LAYOUT YAPISI

### Dashboard Layout (3 Kolonlu)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Sabit)                                              │
│  ├─ Logo + Şirket Adı          ├─ Kontör Bakiye             │
│  ├─ Global Arama               ├─ Bildirimler (🔔)           │
│  └─ Kullanıcı Profili          └─ Hızlı İşlemler             │
├────────┬────────────────────────────────────────────────────┤
│        │                                                    │
│  SIDEBAR    MAIN CONTENT (Scrollable)                       │
│  ┌─────┐   ┌────────────────────────────────────────────┐  │
│  │ 📦  │   │  Kurye Haritası (Tam Ekran)               │  │
│  │Sipariş  │  ┌──────────────────────────────────────┐  │  │
│  │     │   │  │                                      │  │  │
│  │ 🛵  │   │  │     [Leaflet Map - Interaktif]       │  │  │
│  │Kurye │   │  │                                      │  │  │
│  │     │   │  │  • Kurye konumları (Canlı)           │  │  │
│  │ 🍽️  │   │  │  • Restoran pinleri                  │  │  │
│  │Restoran│  │  │  • Aktif teslimat rotaları           │  │  │
│  │     │   │  │  • Isı haritası (yoğunluk)           │  │  │
│  │ 👥  │   │  │                                      │  │  │
│  │Kullanıcı│ │  └──────────────────────────────────────┘  │  │
│  │     │   └────────────────────────────────────────────┘  │
│  │ ⏰  │                                                  │
│  │Vardiya│   ┌──────────────┬──────────────┬───────────┐  │
│  │     │   │  Kurye Kartı  │ Kurye Kartı  │ Kurye K.  │  │
│  │ 📊  │   │  ┌──────────┐ │ ┌──────────┐ │ ┌───────┐ │  │
│  │Rapor│   │  │ 🟢 Online │ │ │ 🟡 Yolda │ │ │ ⚪ Pasif│ │  │
│  │     │   │  │ Ali K.    │ │ │ Mehmet Y.│ │ │ Hasan │ │  │
│  │ ⚙️  │   │  │ 3 sipariş │ │ │ 1 sipariş│ │ │ -     │ │  │
│  │Ayar │   │  │ 📍 0.8km  │ │ │ ETA: 5dk │ │ │       │ │  │
│  └─────┘   │  └──────────┘ │ └──────────┘ │ └───────┘ │  │
│            └──────────────┴──────────────┴───────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar Detayı

```
┌─────────────────┐
│  🏢 PAKETÇİNİZ  │  ← Şirket adı, slate-900 bg
├─────────────────┤
│  📦 Siparişler  │
│    ├─ Güncel    │
│    └─ Geçmiş    │
│  🛵 Kuryeler     │
│  🍽️ Restoranlar │
│  👥 Kullanıcılar│
│  ⏰ Vardiyalar  │
│  📊 Raporlar    │
│     ├─ Performans│
│     ├─ Finansal │
│     └─ Uyumluluk│
│  ⚙️ Ayarlar     │
├─────────────────┤
│  💳 Kontör:     │
│  948 TL (~379)  │  ← Mor gradient card
└─────────────────┘
```

---

## 3. SAYFALAR

### 3.1 Dashboard (Ana Sayfa)

#### Üst Bilgi Kartları (Stats Row)
```
┌────────────────────────────────────────────────────────────────┐
│ TESLİM EDİLEN  │ İŞLETME     │ YOLDA       │ İPTAL          │
│ ─────────────  │ ───────     │ ────        │ ────           │
│ 🟣 50          │ ⚪ 0        │ 🔵 1        │ 🔴 4           │
│    +12 bugün   │             │  ETA: 5dk   │    -1 bugün    │
└────────────────────────────────────────────────────────────────┘
```

#### Harita Bileşeni
- **Kütüphane:** Leaflet.js
- **Tile:** OpenStreetMap (ücretsiz)
- **Özellikler:**
  - Canlı kurye konumları (WebSocket)
  - Restoran pinleri (clustered)
  - Aktif teslimat rotaları (polyline)
  - Isı haritası (yoğunluk gösterimi)
  - Tıklayınca detay popup

#### Kurye Kartları
```
┌──────────────────────────┐
│ 🟢 ●  Ali Korkmaz        │  ← Status dot (online/offline/busy)
│    🛵 Motosiklet         │  ← Araç tipi
├──────────────────────────┤
│ 📦 Aktif: 3 sipariş      │
│ 📍 850m uzakta            │
│ ⭐ 4.8/5.0               │
│ ⏱️ Bugün: 12 teslimat    │
├──────────────────────────┤
│ [📍 Konum] [📞 Ara]      │
└──────────────────────────┘
```

---

### 3.2 Sipariş Listesi

#### Filtre Barı
```
┌────────────────────────────────────────────────────────────────┐
│ 🔍 [Ara...]    │ Durum ▼ │ Tarih ▼ │ Kurye ▼ │ [+ Yeni Sipariş]│
└────────────────────────────────────────────────────────────────┘
```

#### Sipariş Kartı
```
┌────────────────────────────────────────────────────────────────┐
│ #KRY-2025-001847              🟡 Yolda │ 📍 2.4km              │
├────────────────────────────────────────────────────────────────┤
│ 🏪 La Piazza Restaurant      📞 0532 111 22 33                 │
│    ⏱️ Hazırlık: 12 dk        💰 245.00 TL                      │
│ ────────────────────────────────────────────────────────────── │
│ 👤 Ahmet Yılmaz              📞 0533 444 55 66                 │
│    📍 Atatürk Mah. 123. Sok. No:5, Bodrum                     │
│    📝 Kapı zili çalma, bahçeden gir                           │
│ ────────────────────────────────────────────────────────────── │
│ 🛵 Mehmet K. (Kurye)         ⏱️ Tahmini: 18:45                 │
├────────────────────────────────────────────────────────────────┤
│ [📍 Takip] [✅ Teslim] [❌ İptal] [✏️ Düzenle]                │
└────────────────────────────────────────────────────────────────┘
```

#### Durum Badge'leri
| Durum | Renk | Icon |
|-------|------|------|
| Bekliyor | 🟡 Sarı | ⏳ |
| Hazırlanıyor | 🔵 Mavi | 👨‍🍳 |
| Yolda | 🟣 Mor | 🛵 |
| Teslim Edildi | 🟢 Yeşil | ✅ |
| İptal | 🔴 Kırmızı | ❌ |

---

### 3.3 Kurye Detay Sayfası

```
┌────────────────────────────────────────────────────────────────┐
│ ← Kuryeler                    [✏️ Düzenle] [🗑️ Sil]           │
├──────────────────────┬─────────────────────────────────────────┤
│                      │                                         │
│  ┌────────────────┐  │  📊 PERFORMANS METRİKLERİ              │
│  │                │  │  ┌─────────┬─────────┬─────────┐       │
│  │    [FOTO]      │  │  │ Bugün   │ Bu Hafta│ Bu Ay   │       │
│  │                │  │  ├─────────┼─────────┼─────────┤       │
│  │   Ali Korkmaz  │  │  │ 12      │ 89      │ 412     │       │
│  │   🟢 Aktif     │  │  │ teslimat│ teslimat│ teslimat│       │
│  └────────────────┘  │  └─────────┴─────────┴─────────┘       │
│                      │                                         │
│  📞 0532 123 45 67   │  ⏱️ ORTALAMA SÜRELER                   │
│  ✉️ ali@email.com    │  ┌─────────────────────────────────┐   │
│  📍 Bodrum Merkez    │  │ Teslimat süresi: 28 dk          │   │
│                      │  │ Müşteri mesafesi: 3.2 km        │   │
│  🛵 Motosiklet       │  │ Değerlendirme: 4.8/5.0 ⭐⭐⭐⭐⭐   │   │
│  🔢 Plaka: 48 AB 123 │  └─────────────────────────────────┘   │
│                      │                                         │
│  ⏰ Çalışma Saatleri │  📍 GÜNCEL KONUM                       │
│  09:00 - 18:00       │  [Mini Harita - Son konum]             │
│                      │                                         │
├──────────────────────┴─────────────────────────────────────────┤
│ 📋 SON TESLİMATLAR                                            │
│ ─────────────────────────────────────────────────────────────  │
│ #KRY-001 │ 18:30 │ La Piazza │ ✅ Teslim │ 245 TL             │
│ #KRY-002 │ 17:45 │ Burger King│ ✅ Teslim │ 189 TL             │
│ #KRY-003 │ 16:20 │ Dönerci │ ❌ İptal │ -                      │
└────────────────────────────────────────────────────────────────┘
```

---

### 3.4 Vardiya Yönetimi (Yeni!)

#### Haftalık Vardiya Görünümü
```
┌────────────────────────────────────────────────────────────────┐
│ Vardiya Takvimi                    [◀] 11-17 Mart 2025 [▶]     │
├──────┬────────┬────────┬────────┬────────┬────────┬────────────┤
│ PAZ  │ PTS    │ SAL    │ ÇAR    │ PER    │ CUM    │ CMT        │
│ 11   │ 12     │ 13     │ 14     │ 15     │ 16     │ 17         │
├──────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│      │👤 Ali  │👤 Ali  │        │👤 Ali  │        │            │
│      │09-18   │09-18   │        │09-18   │        │            │
│      │🟢      │🟢      │        │🟡      │        │            │
├──────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│      │👤 Mehmet      │👤 Mehmet      │👤 Mehmet              │
│      │18-02   │        │18-02   │        │18-02   │            │
│      │⚪      │        │🟢      │        │⚪      │            │
└──────┴────────┴────────┴────────┴────────┴────────┴────────────┘

🟢 Zamanında  🟡 Geç kaldı  ⚪ Henüz başlamadı  🔴 No-show
```

#### Vardiya Kartı (Detaylı)
```
┌────────────────────────────────┐
│ 🕐 09:00 - 18:00 (9 saat)      │
├────────────────────────────────┤
│ 👤 Ali Korkmaz                 │
│ 🗓️ 12 Mart 2025 Salı           │
├────────────────────────────────┤
│ ✅ Başlangıç: 09:03 (3 dk geç) │
│ ⏸️ Mola: 12:00 - 12:30 (30dk) │
│ ✅ Bitiş: 18:00 (zamanında)    │
├────────────────────────────────┤
│ 📊 Uyumluluk: 85%              │
│ 💰 Prim: +25 TL                │
└────────────────────────────────┘
```

---

### 3.5 Raporlar Sayfası

#### Tab Navigation
```
┌────────────────────────────────────────────────────────────────┐
│ [Genel Bakış] [Performans] [Finansal] [Uyumluluk] [Export ⬇️] │
└────────────────────────────────────────────────────────────────┘
```

#### Finansal Rapor Kartı
```
┌────────────────────────────────────────────────────────────────┐
│ 💰 FİNANSAL ÖZET - Mart 2025                                   │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GELİR (Kontör)          GİDER (Kurye)          NET           │
│  ───────────────         ─────────────         ─────          │
│  15,420 TL              -8,500 TL             6,920 TL        │
│  ↗️ +12% geçen ay        ↘️ -5% geçen ay       ↗️ +28%        │
│                                                                  │
├────────────────────────────────────────────────────────────────┤
│ [📊 Excel İndir] [📈 Grafik Görünüm]                          │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. BİLEŞENLER

### 4.1 Butonlar

| Tip | Stil | Kullanım |
|-----|------|----------|
| Primary | Mor gradient | Ana aksiyonlar |
| Secondary | Gri outline | İkincil aksiyonlar |
| Danger | Kırmızı | Silme, iptal |
| Ghost | Şeffaf | Toolbar |
| Icon | Yuvarlak | Hızlı aksiyonlar |

### 4.2 Form Elemanları

```
Input:
┌─────────────────────────────┐
│ 📧 Email Adresi *           │
│ ┌─────────────────────────┐ │
│ │ admin@paketciniz.com    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘

Select (Dropdown):
┌─────────────────────────────┐
│ 🛵 Araç Tipi                │
│ ┌─────────────────────────┐ │
│ │ Motosiklet ▼            │ │
│ └─────────────────────────┘ │
│   ┌───────────────────┐     │
│   │ 🛵 Motosiklet     │     │
│   │ 🚗 Otomobil       │     │
│   │ 🚐 Kamyonet       │     │
│   └───────────────────┘     │
└─────────────────────────────┘
```

### 4.3 Toast Bildirimler

```
┌─────────────────────────────────┐
│ ✅ Teslimat başarıyla oluşturuldu│
│    #KRY-2025-001847             │
│                      [Kapat] ✕  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ ⚠️ Kontör bakiyeniz azalıyor    │
│    Mevcut: 45 TL (~18 teslimat) │
│                      [Yükle] 💳 │
└─────────────────────────────────┘
```

---

## 5. MOBİL UYUM

### Breakpoints
- **Desktop:** > 1024px (Sidebar açık)
- **Tablet:** 768-1024px (Sidebar collapsible)
- **Mobile:** < 768px (Bottom navigation)

### Mobile Navigasyon
```
┌─────────────────────────────────┐
│          [Content]              │
│                                 │
├─────────┬─────────┬─────────────┤
│  📦     │  🛵     │      ⚙️     │
│ Sipariş │ Kurye   │   Ayarlar   │
└─────────┴─────────┴─────────────┘
```

---

## 6. ANİMASYONLAR

### Geçiş Süreleri
- **Micro:** 150ms (hover, focus)
- **Standard:** 300ms (sayfa geçişleri)
- **Macro:** 500ms (modal açılışları)

### Easing
- **Default:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Bounce:** `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

---

## 7. İKONOGRAFİ

**Kütüphane:** Lucide React

| Kullanım | İkon |
|----------|------|
| Sipariş | Package |
| Kurye | Bike / User |
| Restoran | Utensils |
| Lokasyon | MapPin |
| Telefon | Phone |
| Saat | Clock |
| Para | Wallet / CreditCard |
| Excel | FileSpreadsheet |
| Başarılı | CheckCircle |
| Hata | XCircle |

---

## 8. KARANLIK MOD (Dark Mode)

```
Background:        #0F172A
Surface:           #1E293B
Surface Elevated:  #334155
Text Primary:      #F8FAFC
Text Secondary:    #94A3B8
Border:            #334155
Primary:           #7C5AE6
```

---

*Doküman Versiyon: 1.0*
*Son Güncelleme: Mart 2025*
