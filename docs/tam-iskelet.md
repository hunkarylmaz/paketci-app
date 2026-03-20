# 🏗️ PAKETÇİ - Tam Organizasyon İskeleti

## 📊 Kullanıcı Hiyerarşisi (Roller)

```
                    ┌─────────────────┐
                    │   🏢 SİSTEM     │
                    │   YÖNETİCİSİ    │
                    │  (Super Admin)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │   🏪 BAYİ   │  │   🏪 BAYİ   │  │   🏪 BAYİ   │
    │  (Dealer)   │  │  (Dealer)   │  │  (Dealer)   │
    └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
           │                │                │
     ┌─────┴─────┐    ┌─────┴─────┐    ┌─────┴─────┐
     │           │    │           │    │           │
     ▼           ▼    ▼           ▼    ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│RESTORAN│ │RESTORAN│ │RESTORAN│ │RESTORAN│ │RESTORAN│
└───┬────┘ └────┬───┘ └───┬────┘ └───┬────┘ └───┬────┘
    │           │         │          │          │
    └─────┬─────┘         └────┬─────┘        │
          │                    │              │
    ┌─────┴─────┐         ┌────┴────┐   ┌────┴────┐
    │           │         │         │   │         │
    ▼           ▼         ▼         ▼   ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ KURYE  │ │ KURYE  │ │ KURYE  │ │ KURYE  │
└────────┘ └────────┘ └────────┘ └────────┘
```

---

## 👤 1. SİSTEM YÖNETİCİSİ (Super Admin)

### Kimdir?
- Paketçi platformunun sahibi/operatörü
- Teknik ekip veya işletme sahibi

### Yetkileri:
```
✅ Tüm bayileri yönetme (CRUD)
✅ Tüm restoranları görme/düzenleme
✅ Tüm kuryeleri görme/düzenleme
✅ Sistem ayarları:
   • Paket başı varsayılan ücretler
   • Komisyon oranları
   • Ödeme kuralları
   • Bildirim şablonları
✅ Finansal raporlar:
   • Toplam cirolar
   • Bayi bazlı kazançlar
   • Komisyon gelirleri
✅ Onay bekleyen işlemler:
   • İptal talepleri onayı
   • Ödeme düzenleme onayları
   • Kaza/ acil durum bildirimleri
✅ Kullanıcı yetkilendirme
✅ API yönetimi
```

### Panel Erişimi:
- URL: `admin.paketci.app`
- Email/şifre ile giriş
- 2FA (İki faktörlü doğrulama) opsiyonel

---

## 🏪 2. BAYİ (Dealer / Franchise)

### Kimdir?
- Bölge bazlı işletmeciler
- Örneğin: "İstanbul Avrupa Yakası Bayii", "Ankara Bayii"
- Restoranları sisteme dahil eden aracılar

### Yetkileri:
```
✅ Kendi bölgesindeki restoranları yönetme
✅ Restoran ekleme/çıkarma/düzenleme
✅ Restoran fiyatlandırma ayarları:
   • Paket başı ücret
   • Mesafe bazlı fiyatlandırma
   • Bölge bazlı fiyatlandırma
✅ Kurye atamalarını görme
✅ Bölgesel raporlar:
   • Toplam sipariş sayısı
   • Toplam kurye geliri
   • Restoran performansları
✅ Ödeme takibi:
   • Restoran ödemeleri
   • Kurye ödemeleri
   • Komisyon gelirleri
✅ İptal/şikayet yönetimi
```

### Sınırlamaları:
```
❌ Diğer bayilerin verilerini göremez
❌ Sistem ayarlarını değiştiremez
❌ Komisyon oranlarını değiştiremez
```

### Panel Erişimi:
- URL: `dealer.paketci.app`
- Bayi yetkilisi girişi

---

## 🍽️ 3. RESTORAN (Restaurant)

### Kimdir?
- Yemek satışı yapan işletmeler
- Restoran sahibi veya yöneticisi
- Örneğin: "Ateş Döner", "Burger King Şube X"

### Yetkileri:
```
✅ Kendi siparişlerini görme/takip etme
✅ Sipariş durumu güncelleme:
   • Hazırlanıyor
   • Kuryeye teslim edildi
   • İptal
✅ Kurye takibi (GPS konum)
✅ Kendi kurye havuzunu görme
✅ Raporlar:
   • Günlük/haftalık/aylık siparişler
   • Toplam ciro
   • Ortalama teslimat süresi
✅ Ödeme yönetimi (varsa yetki):
   • Sipariş ödeme tipi düzenleme
   • Tutar düzenleme (onaylı)
✅ Menü/ürün yönetimi (opsiyonel)
✅ Extension API Key yönetimi:
   • Chrome extension bağlantısı
   • Otomatik sipariş çekme ayarları
✅ İptal talebi oluşturma (neden belirtme)
```

### Sınırlamaları:
```
❌ Başka restoranın verilerini göremez
❌ Kurye bilgilerini (tel no vb.) göremez
❌ Fiyatlandırma ayarlarını değiştiremez (bayi ayarlar)
❌ Sistem genel ayarlarına erişemez
```

### Giriş Yöntemleri:
1. **Web Panel:** `panel.paketci.app`
2. **Extension:** Chrome'a yüklenir, API key ile bağlanır

### Ekranları:
```
┌─────────────────────────────────────┐
│ 🍽️ RESTORAN PANELİ                 │
├─────────────────────────────────────┤
│                                     │
│ 📋 GÜNCEL SİPARİŞLER               │
│ ┌─────────────────────────────┐    │
│ │ #PKT-001 - Ahmet Y.         │    │
│ │ 🛵 Kuryede - Tah: 15 dk     │    │
│ │ [Takip Et] [İptal Et]       │    │
│ └─────────────────────────────┘    │
│                                     │
│ 📊 BUGÜN                           │
│ • 12 Sipariş | ₺2,450 Ciro         │
│ • Ort. Teslimat: 28 dk             │
│                                     │
│ 🔧 AYARLAR                         │
│ • Extension API Key: pk_live_xxx   │
│ • Fiyatlandırma: ₺35/paket         │
│                                     │
└─────────────────────────────────────┘
```

---

## 🚴 4. KURYE (Courier)

### Kimdir?
- Siparişleri teslim eden çalışanlar
- Restoran veya bayi bünyesinde

### Yetkileri:
```
✅ Kendi siparişlerini görme
✅ Sipariş durumu güncelleme:
   • Yolda (Restorandan çıktı)
   • Teslim edildi
   • Teslim edilemedi + neden
✅ Navigasyon (Google Maps/Haritalar)
✅ Müşteri arama (sistemden maskeli numara)
✅ Günlük kazanç görüntüleme
✅ Vardiya başlatma/bitirme
✅ Mola alma/bırakma (talepli/onaylı)
✅ Kaza/Acil durum bildirimi (🚨 PANİK butonu)
✅ Bakiye yükleme (Kart/Havale)
✅ Raporlar:
   • Günlük/haftalık/aylık kazanç
   • Teslimat istatistikleri
   • Vardiya geçmişi
   • Mutabakatlar
   • İptal/kesinti görüntüleme
```

### Sınırlamaları:
```
❌ Başka kuryenin siparişini göremez
❌ Müşteri telefonunu doğrudan göremez (maskeleme)
❌ Fiyatlandırmayı değiştiremez
❌ İptal yetkisi yok (restoran/bayi yapar)
```

### Giriş Yöntemi:
- **Mobil App:** iOS/Android Flutter uygulaması
- Telefon numarası + SMS kodu ile giriş

### Ekranları:
```
┌─────────────────────────────────────┐
│ 🚴 KURYE MOBİL UYGULAMASI          │
├─────────────────────────────────────┤
│                                     │
│ ⏱️ VARDİYA: 08:00 - AKTİF          │
│ 💰 Bugün: ₺850 (12 paket)          │
│                                     │
│ 📦 AKTİF SİPARİŞ                   │
│ ┌─────────────────────────────┐    │
│ │ Ateş Döner                  │    │
│ │ Ahmet Yılmaz                │    │
│ │ 📍 Kadıköy, Caferağa Sk.    │    │
│ │ 💵 ₺150 - 💳 Online Ödeme   │    │
│ │                             │    │
│ │ [📍Navigasyon] [📞Ara]      │    │
│ │                             │    │
│ │ [✅ Teslim Edildi]          │    │
│ └─────────────────────────────┘    │
│                                     │
│ [🏠] [📋] [⏸️] [💰] [👤]          │
│ Ana  Sip. Mola  Kaz. Profil        │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔐 Kullanıcı Tipleri Özeti

| Rol | Adet | Giriş | Ana İşlevi | Gelir Modeli |
|-----|------|-------|-----------|--------------|
| **Sistem Yöneticisi** | 1-5 | Web | Tüm sistemi yönetir | Platform komisyonu |
| **Bayi** | 10-50 | Web | Bölge yönetimi | Restoran komisyonu |
| **Restoran** | 1000+ | Web/Ext | Sipariş yönetimi | Satış geliri |
| **Kurye** | 5000+ | Mobil | Teslimat | Paket başı ücret |

---

## 💰 Gelir/Gider Akışı

```
MÜŞTERİ
   │
   │ Ödeme (₺100)
   ▼
PLATFORM (Yemeksepeti/Getir vb.)
   │
   │ Komisyon kesintisi (%20) → ₺80
   ▼
RESTORAN
   │
   │ Paketçi ücreti (₺35) + Komisyon
   ▼
PAKETÇİ SİSTEMİ
   │
   ├─────────────────┬─────────────────┐
   │                 │                 │
   ▼                 ▼                 ▼
KURYE (₺25)      BAYİ (₺5)      SİSTEM (₺5)
```

---

## 🗄️ Veritabanı İlişkileri

```
system_admins
    │
    ├── dealers (1:N)
    │       │
    │       ├── restaurants (1:N)
    │       │       │
    │       │       ├── couriers (1:N)
    │       │       │       │
    │       │       │       └── deliveries (1:N)
    │       │       │
    │       │       └── deliveries (1:N)
    │       │
    │       └── couriers (bayiye bağlı, N:M restoran)
    │
    └── settings (global)
```

---

## 📱 Erişim Matrix

| Veri | Admin | Bayi | Restoran | Kurye |
|------|-------|------|----------|-------|
| Tüm bayiler | ✅ | ❌ | ❌ | ❌ |
| Kendi bayisi | ✅ | ✅ | ❌ | ❌ |
| Tüm restoranlar | ✅ | (Bölgesel) | ❌ | ❌ |
| Kendi restoranı | ✅ | ✅ | ✅ | ❌ |
| Tüm kuryeler | ✅ | (Bölgesel) | ❌ | ❌ |
| Restoran kuryeleri | ✅ | ✅ | ✅ | ❌ |
| Kendi kurye verisi | ✅ | ✅ | ✅ | ✅ |
| Tüm siparişler | ✅ | (Bölgesel) | ❌ | ❌ |
| Restoran siparişleri | ✅ | ✅ | ✅ | ❌ |
| Kendi siparişleri | ✅ | ✅ | ✅ | ✅ |
| Finansal raporlar | ✅ | (Bölgesel) | (Kendi) | (Kendi) |

---

**Özet:** 4 katmanlı bir yapı: Sistem yöneticisi → Bayi → Restoran → Kurye. Her katman sadece kendi verilerini görür/yönetir, üst katmanlar tüm alt kademeleri görebilir.
