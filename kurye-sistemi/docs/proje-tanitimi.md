# 🚀 PAKETÇİ - Kurye Yönetim Sistemi
## Proje Tanıtımı ve Mevcut Durum

---

## 📌 PROJE NEDİR?

**Paketçi**, restoranlar için geliştirilmiş kapsamlı bir kurye yönetim sistemidir. Yemeksepeti, Getir, Trendyol ve Migros gibi platformlardan gelen siparişleri otomatik olarak kuryelere atar, kuryelerin çalışma süreçlerini yönetir ve tüm operasyonu dijitalleştirir.

---

## 🏗️ SİSTEM MİMARİSİ

### 1. BACKEND (NestJS - Port 4000)
**Teknoloji:** Node.js + NestJS + TypeScript + PostgreSQL + Redis

**Modüller:**
- **Auth Modülü:** JWT tabanlı kimlik doğrulama (Kurye, Restoran, Admin)
- **Courier Modülü:** Kurye kayıt, profil, durum yönetimi
- **Restaurant Modülü:** Restoran kayıt, ayarlar, API key yönetimi
- **Delivery Modülü:** Sipariş oluşturma, atama, takip, tamamlama
- **Shift Modülü:** Vardiya planlama ve takip
- **Extension Modülü:** Browser extension ile otomatik sipariş çekme
- **Payments Modülü:** Iyzico entegrasyonu, bakiye yükleme
- **Reports Modülü:** Excel export, raporlama

**Veritabanı Tabloları:**
- users, couriers, restaurants, companies
- deliveries (PKT-XXXX formatlı takip numaraları)
- shifts, credits, payments
- extension_api_keys

---

### 2. FRONTEND (Next.js - Port 3000)
**Teknoloji:** React + Next.js + TypeScript

**Ekranlar:**
- **Login:** Kurye ve Restoran giriş ekranı
- **Dashboard:** Admin paneli - tüm siparişler, kuryeler, istatistikler
- **Courier Panel:** Kurye listesi, durumları, performansları
- **Restaurant Panel:** Restoran yönetimi, fiyatlandırma ayarları
- **Delivery Tracking:** Canlı sipariş takibi
- **Reports:** Raporlar ve Excel export

**Tasarım:** Mavi gradient tema (#1E40AF → #3B82F6), modern kart bazlı UI

---

### 3. MOBİL UYGULAMA (Flutter - iOS/Android)
**Teknoloji:** Flutter + Dart

**Ekranlar:**
- **Login Screen:** Telefon numarası ile giriş
- **Home Screen:** Aktif siparişler listesi (kart bazlı modern tasarım)
  - Her kartta: Müşteri adı, adres özeti, tutar, durum
  - Durum renkleri: Bekliyor (sarı), Yolda (mavi), Teslim edildi (yeşil)
- **Delivery Detail Screen:** 
  - Sipariş detayları (ürünler, notlar)
  - Müşteri telefonu (doğrudan arama butonu)
  - Navigasyon butonu (Google Maps/Google Haritalar)
  - Durum güncelleme butonları
- **Balance Load Screen:** Bakiye yükleme (Iyzico kart ödemesi veya Havale)
- **Profile Screen:** Kurye profili, çalışma istatistikleri

**Tasarım Özellikleri:**
- Mavi gradient AppBar ve butonlar
- Yuvarlak köşeli kartlar (16-20px border radius)
- Gölge efektleri
- Bottom navigation bar

---

### 4. BROWSER EXTENSION (Chrome/Firefox/Edge)
**Teknoloji:** Vanilla JavaScript + Manifest V3

**Özellikler:**
- **Platform Desteği:** Yemeksepeti, Getir, Trendyol, Migros
- **Otomatik Mod:** Sipariş geldiği an otomatik Paketçi'ye gönderir
- **Manuel Mod:** Platform sayfasına "Kurye Çağır" butonu enjekte eder
- **Gerçek Logolar:** Her platform kendi marka rengi ve logosuyla gösterilir
  - Getir: Mor (#5D3EBC) + 🛵
  - Yemeksepeti: Kırmızı (#E31837) + 🍕
  - Trendyol: Turuncu (#F27A1A) + 🍔
  - Migros: Sarı (#FFC72C) + 🥘

**Popup UI:**
- Üst kısımda: Paketçi logosu + bağlantı durumu
- Master toggle: Tüm platformları tek tuşla aç/kapat
- Mod seçimi: "Otomatik" veya "Manuel"
- Platform listesi: Her platformun logosu, adı, son aktivite ve toggle'ı
- İstatistikler: Günlük sipariş, kuryede olan, tamamlanan sayıları

---

## 🎯 ANA ÖZELLİKLER

### Sipariş Yönetimi
1. **Otomatik Çekme:** Extension sayesinde platformlar siparişleri otomatik çeker
2. **Akıllı Atama:** En yakın, müsait kuryeye otomatik atama
3. **Takip:** PKT-XXXX formatlı takip numarası ile sipariş takibi
4. **Durumlar:** Hazırlanıyor → Kurye Atandı → Yolda → Teslim Edildi

### Kurye Yönetimi
1. **Çalışma Modelleri:**
   - Sabit maaş + prim
   - Paket başı ücret
   - Çoklu paket kademeli (100→60→60→40₺)
   - Saatlik ücret

2. **Vardiya Sistemi:**
   - Günlük/haftalık vardiya planlama
   - Giriş/çıkış saat takibi
   - Otomatik hesaplama

3. **Ödeme Sistemi:**
   - Bakiye yükleme (Kart veya Havale)
   - Günlük/haftalık/aylık mutabakat
   - Excel export

### Restoran Yönetimi
1. **Fiyatlandırma Modelleri:**
   - Sabit paket başı ücret
   - Mesafe bazlı
   - Bölge bazlı (Mavi/Sarı/Kırmızı bölgeler)
   - Saatlik farklı ücretler

2. **Özellikler:**
   - API Key yönetimi (Extension için)
   - Sipariş geçmişi
   - Kurye performans raporları

---

## 📊 ŞU ANKİ GÖRÜNÜM

### Backend Çalışıyor (Port 4000)
```
✅ NestJS sunucu çalışıyor
✅ PostgreSQL bağlantısı aktif
✅ Redis bağlantısı aktif
✅ API endpoint'leri erişilebilir:
   - POST /auth/login
   - POST /deliveries
   - GET /couriers
   - POST /extension/order (Extension'dan sipariş alır)
```

### Frontend Çalışıyor (Port 3000)
```
✅ Next.js sunucu çalışıyor
✅ Admin paneli görünür
✅ Kurye ve Restoran login ekranları
✅ Dashboard aktif
```

### Mobil (Flutter)
```
✅ Kod tamamlandı
⏳ Android SDK kurulumu bekliyor (APK build için)
⏳ iOS build için Xcode gerekli (macOS)
```

### Extension (Chrome)
```
✅ Kod tamamlandı
✅ Manifest V3 yapılandırması
✅ Popup UI hazır
✅ Content script hazır
⏳ Gerçek platformlarda test edilecek
⏳ Chrome Web Store'a yüklenecek
```

---

## 🔮 GELECEK ÖZELLİKLER (Sırada)

1. **🕐 Kurye Mola Sistemi** - Talepli/onaylı mola, yasaklı saatler
2. **🚨 Kurye Kaza Butonu** - Acil durum bildirimi ve takibi
3. **📊 Kurye Raporları** - Detaylı kazanç/vardiya raporları
4. **💳 Restoran Ödeme Düzenleme** - Yetki kontrollü ödeme değişikliği
5. **❌ İptal Onay Süreci** - Nedenli iptal ve admin onayı

---

## 🖼️ EKRAN TASARIMLARI (HTML Mockup'lar)

Proje klasöründe `docs/` altında şu mockup'lar var:
- `login-preview.html` - Giriş ekranı
- `mobile-app-preview.html` - Mobil ana ekran
- `delivery-detail-preview.html` - Sipariş detay
- `reports-preview.html` - Raporlar ekranı
- `calisma-sekli-modal.html` - Çalışma modelleri
- `restoran-calisma-sekli.html` - Restoran fiyatlandırma

Tümü mavi gradient tema ile tutarlı, profesyonel tasarım.

---

**Özetle:** Paketçi, restoranların kurye operasyonlarını tamamen dijitalleştiren, çok platformlu (Web + Mobil + Extension) kapsamlı bir yönetim sistemidir. Şu an temel altyapı tamamlandı, kullanıma hazır durumda, ek özellikler sırayla ekleniyor.
