# 🚀 PAKETÇİ SİSTEMİ - API KEY YAPILANDIRMA REHBERİ

## 📋 GEREKLİ API KEY'LER

Aşağıdaki platformlar için API key'leri almanız gerekiyor:

---

## 1️⃣ YEMEKSEPETİ

### Başvuru Adresi:
https://partner.yemeksepeti.com/tr/developer

### Gerekli Bilgiler:
- `YEMEKSEPETI_API_KEY`
- `YEMEKSEPETI_API_SECRET`
- `YEMEKSEPETI_MERCHANT_ID` (Restoran ID)
- `YEMEKSEPETI_BRANCH_ID` (Şube ID)

### API Dokümantasyonu:
https://developer.yemeksepeti.com/docs

### Webhook URL:
```
POST https://api.senindomain.com/api/webhooks/yemeksepeti
```

---

## 2️⃣ GETİR YEMEK / ÇARŞI

### Başvuru Adresi:
https://getir.com/restoran/isbirligi
veya partner@getir.com

### Gerekli Bilgiler:
- `GETIR_API_KEY`
- `GETIR_API_SECRET`
- `GETIR_MERCHANT_ID`
- `GETIR_STORE_ID`

### API Dokümantasyonu:
Getir ile doğrudan iletişime geçmeniz gerekiyor.

### Webhook URL:
```
POST https://api.senindomain.com/api/webhooks/getir
```

---

## 3️⃣ TRENDYOL YEMEK

### Başvuru Adresi:
https://www.trendyol.com/s/satici-olun

### Gerekli Bilgiler:
- `TRENDYOL_API_KEY`
- `TRENDYOL_API_SECRET`
- `TRENDYOL_SELLER_ID`

### API Dokümantasyonu:
https://developers.trendyol.com/tr/marketplace-siparis-entegrasyonu

### Webhook URL:
```
POST https://api.senindomain.com/api/webhooks/trendyol
```

---

## 4️⃣ MİGROS YEMEK

### Başvuru Adresi:
https://www.migrosonline.com/restoran-basvuru
veya migrosyemek@migros.com.tr

### Gerekli Bilgiler:
- `MIGROS_API_KEY`
- `MIGROS_API_SECRET`
- `MIGROS_RESTAURANT_ID`

### API Dokümantasyonu:
Migros ile doğrudan iletişime geçmeniz gerekiyor.

### Webhook URL:
```
POST https://api.senindomain.com/api/webhooks/migros
```

---

## 5️⃣ FUUDY

### Başvuru Adresi:
https://fuudy.com.tr/restoran-basvuru

### Gerekli Bilgiler:
- `FUUDY_API_KEY`
- `FUUDY_API_SECRET`
- `FUUDY_RESTAURANT_ID`

---

## 🔧 POS SİSTEM ENTEGRASYONLARI

### Adisyo
- `ADISYO_API_URL` (yerel ağ IP'si)
- `ADISYO_API_KEY`

### Şefim
- `SEFIM_API_URL`
- `SEFIM_API_KEY`

### Sepet Takip
- `SEPET_TAKIP_API_URL`
- `SEPET_TAKIP_API_KEY`

---

## 🗺️ HARİTA SERVİSLERİ

### OpenStreetMap (Ücretsiz)
- Kullanım: Sınırsız (adil kullanım politikası)
- Rate Limit: 1 istek/saniye (Nominatim)
- Kayıt Gerektirmez

### OpenRouteService (Opsiyonel - Ücretsiz)
- https://openrouteservice.org/dev/#/signup
- Günlük 2000 istek ücretsiz
- `ORS_API_KEY` (opsiyonel)

---

## 📱 BİLDİRİM SERVİSLERİ

### Firebase Cloud Messaging (FCM)
1. https://console.firebase.google.com/ adresine gidin
2. Yeni proje oluşturun
3. Project Settings → Cloud Messaging
4. Server key kopyalayın

```env
FIREBASE_SERVER_KEY=your-firebase-server-key
```

### Twilio (SMS - Opsiyonel)
```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-twilio-number
```

---

## 💳 ÖDEME SİSTEMİ (Opsiyonel)

### İyzico
```env
IYZICO_API_KEY=your-api-key
IYZICO_SECRET_KEY=your-secret-key
IYZICO_BASE_URL=https://api.iyzipay.com
```

### Stripe
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🔐 GÜVENLİK

### JWT Secret
```bash
# Güçlü bir JWT secret oluşturun:
openssl rand -base64 64
```

### API Key Şifreleme
- Tüm API key'ler veritabanında AES-256 ile şifrelenir
- Master key: `ENCRYPTION_KEY` environment variable'ında saklanır

---

## 📋 YAPILANDIRMA ADIMLARI

### 1. .env Dosyasını Oluştur
```bash
cp .env.example .env
```

### 2. API Key'leri Doldur
```bash
nano .env
```

### 3. Webhook URL'lerini Platformlara Kaydet
Her platformun developer panelinden webhook URL'lerini ekleyin.

### 4. IP Whitelist
Platformların IP kısıtlaması varsa sunucu IP'nizi whitelist'e ekleyin:
```
Sunucu IP: YOUR_SERVER_IP
```

### 5. SSL Sertifikası
Webhook'ların çalışması için SSL sertifikası zorunludur.
```bash
# Let's Encrypt ile ücretsiz SSL
certbot --nginx -d api.senindomain.com
```

---

## ✅ TEST ADIMLARI

### 1. API Bağlantı Testi
```bash
curl -X GET https://api.senindomain.com/api/integrations/health
```

### 2. Platform Testi
Admin panelden her platform için "Bağlantı Testi" butonuna tıklayın.

### 3. Webhook Testi
```bash
# Yemeksepeti webhook testi
curl -X POST https://api.senindomain.com/api/webhooks/yemeksepeti \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

---

## 🆘 DESTEK

Sorun yaşarsanız:
- Yemeksepeti: partner@yemeksepeti.com
- Getir: partner@getir.com
- Trendyol: seller.support@trendyol.com
- Migros: migrosyemek@migros.com.tr

---

*Son Güncelleme: 19 Mart 2026*
