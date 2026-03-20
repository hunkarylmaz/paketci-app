# Paketçi Browser Extension

Paketçi Kurye Yönetim Sistemi için Chrome/Firefox eklentisi. Yemeksepeti, Getir, Trendyol ve Migros siparişlerini otomatik veya manuel olarak Paketçi'ye aktarır.

## 🚀 Özellikler

- ✅ **Otomatik Yansıtma**: Siparişler anında Paketçi'ye düşer
- ✅ **Manuel Mod**: "Kurye Çağır" butonu ile kontrollü gönderim
- ✅ **Çoklu Platform**: Yemeksepeti, Getir, Trendyol, Migros desteği
- ✅ **Master Kontrol**: Tüm platformları tek tıkla açıp kapatma
- ✅ **Platform Bazlı Ayar**: Her platformu ayrı yönetme
- ✅ **Bildirimler**: Gönderim başarısı anında bildirilir

## 📦 Kurulum

### 1. ZIP Dosyası ile (Hızlı Başlangıç)

```bash
# 1. extension klasörünü zip'le
zip -r paketci-extension.zip extension/

# 2. Chrome'da yükle
Chrome → Uzantılar → Geliştirici modu AÇIK
→ "Paketlenmemiş öğe yükle" → extension/ klasörünü seç
```

### 2. Geliştirme Modu

```bash
cd extension/

# Chrome'da yükle:
# 1. chrome://extensions/ adresine git
# 2. Geliştirici modunu aç
# 3. "Paketlenmemiş öğe yükle" butonuna tıkla
# 4. extension/ klasörünü seç
```

## 🔧 Kullanım

### İlk Kurulum

1. **Giriş Yapın**
   - Paketçi Paneli → Ayarlar → API Bilgileri
   - API Key'i kopyala
   - Eklentiye yapıştır ve giriş yap

2. **Platformları Seçin**
   - Tüm platformlar veya istediğiniz platformları açın
   - Otomatik veya Manuel mod seçin

3. **Hazır!**
   - Platform sekmeleri arkaplanda açık kalsın
   - Siparişler otomatik veya buton ile Paketçi'ye düşer

### Çalışma Modları

| Mod | Açıklama |
|-----|----------|
| **Otomatik** | Sipariş geldiği an Paketçi'ye otomatik gönderilir |
| **Manuel** | Platformda "Kurye Çağır" butonu belirir, tıklayınca gönderilir |

## 🛠️ Dosya Yapısı

```
extension/
├── manifest.json              # Eklenti manifest
├── background.js              # Service worker
├── content.js                 # Ana içerik scripti
├── popup.html                 # Popup arayüz
├── popup.js                   # Popup logic
├── shared/
│   ├── constants.js           # Sabitler
│   ├── storage.js             # Chrome storage
│   ├── api.js                 # Paketçi API client
│   └── button-injector.js     # Kurye Çağır butonu
├── detectors/
│   ├── yemeksepeti.js         # Yemeksepeti tespitçisi
│   ├── getir.js               # Getir tespitçisi
│   ├── trendyol.js            # Trendyol tespitçisi
│   └── migros.js              # Migros tespitçisi
├── assets/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── _locales/tr/
    └── messages.json          # Türkçe dil dosyası
```

## 🔌 API Endpoint'leri

Eklenti şu endpoint'leri kullanır:

```
POST /extension/validate      # API Key doğrulama
POST /extension/order         # Sipariş gönderme
GET  /extension/health        # Health check
```

## ⚙️ Geliştirme

### Gereksinimler

- Chrome 88+ (Manifest V3 desteği)
- Paketçi Backend çalışıyor olmalı

### Geliştirme Adımları

1. Backend'i başlat:
```bash
cd backend/
npm run start:dev
```

2. Extension'ı yükle (Geliştirici modu)

3. Değişiklikleri test et

### Debug

- Chrome DevTools → Console (Content Script)
- chrome://extensions/ → Service Worker (Background)

## 📝 Changelog

### v1.0.0
- İlk sürüm
- 4 platform desteği
- Otomatik ve manuel mod
- Master ve platform bazlı kontrol

## 📞 Destek

Sorun yaşarsanız:
- Paketçi Paneli → Destek
- Email: destek@paketci.app

---

**Paketçi** - Kurye Yönetim Sistemi © 2024
