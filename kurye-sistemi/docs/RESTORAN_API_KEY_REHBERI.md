# 🚀 PAKETÇİ SİSTEMİ - RESTORAN API KEY YAPILANDIRMA REHBERİ

> **ÖNEMLİ:** Paketçi bir B2B kurye yönetim sistemidir. Siz satıcı değilsiniz. Restoranlar (müşterileriniz) kendi platform hesaplarından API key'lerini alıp size verir.

---

## 📋 NASIL ÇALIŞIR?

```
┌─────────────────────────────────────────────────────────────┐
│                     RESTORAN (Müşteriniz)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. Yemeksepeti/Getir paneline girer               │   │
│  │  2. API/Developer bölümünden key'leri kopyalar     │   │
│  │  3. Paketçi Restoran Portalına yapıştırır          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PAKETÇİ SİSTEMİ (Siz)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API key'leri şifreli olarak veritabanında saklar   │   │
│  │  Platformlara bağlanır, siparişleri çeker           │   │
│  │  Siparişleri kuryelere atar                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              PLATFORM (Yemeksepeti/Getir vb.)               │
│                    ↕ API üzerinden iletişim                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 RESTORAN NASIL API KEY ALIR?

Restoranlar kendi platform panellerinden API bilgilerini alır ve Paketçi paneline girer.

---

### 1️⃣ YEMEKSEPETİ

#### Restoran'ın Yapması Gerekenler:

1. **Yemeksepeti Partner Portalına Giriş**
   - URL: https://partner.yemeksepeti.com
   - Kullanıcı adı/şifre ile giriş yap

2. **API Bölümüne Git**
   - Sol menü: `Ayarlar` → `API Entegrasyonu`
   - veya `Geliştirici Araçları`

3. **API Key Oluştur**
   - `Yeni API Key Oluştur` butonuna tıkla
   - İzinleri seç:
     - ✅ Siparişleri Görüntüle
     - ✅ Siparişleri Kabul/Et
     - ✅ Restoran Durumunu Değiştir
     - ✅ Menü Yönetimi (opsiyonel)

4. **Bilgileri Kopyala**
   - API Key
   - API Secret
   - Merchant ID (Restoran ID)
   - Branch ID (Şube ID)

#### Paketçi Paneline Girilmesi Gerekenler:
```
API Key:     abc123xyz...
API Secret:  secret456...
Merchant ID: 12345
Branch ID:   67890
Webhook URL: (Paketçi otomatik oluşturur)
```

---

### 2️⃣ GETİR YEMEK / ÇARŞI

#### Restoran'ın Yapması Gerekenler:

1. **Getir Restoran Paneline Giriş**
   - URL: https://restoran.getir.com
   - Giriş yap

2. **Entegrasyonlar Bölümü**
   - `Ayarlar` → `Entegrasyonlar` → `API`

3. **API Key İsteği**
   - Getir'de API key otomatik oluşmaz, talep gerekir
   - `API Erişimi Talep Et` butonuna tıkla
   - veya mail at: entegrasyon@getir.com
   - Konu: "3. parti kurye yönetim sistemi entegrasyonu"

4. **Bilgileri Kopyala**
   - API Key
   - API Secret
   - Merchant ID
   - Store ID

#### Paketçi Paneline Girilmesi Gerekenler:
```
API Key:     getir_api_key_xxx
API Secret:  getir_secret_xxx
Merchant ID: MERCHANT_123
Store ID:    STORE_456
```

---

### 3️⃣ TRENDYOL YEMEK

#### Restoran'ın Yapması Gerekenler:

1. **Trendyol Satıcı Paneline Giriş**
   - URL: https://satici.trendyol.com.tr

2. **Entegrasyon Bölümü**
   - `Hesap` → `Api Entegrasyonu`

3. **API Key Oluştur**
   - `Yeni API Key` butonu
   - İzinleri seç

4. **Bilgileri Kopyala**
   - API Key
   - API Secret
   - Seller ID

#### Paketçi Paneline Girilmesi Gerekenler:
```
API Key:     ty_api_xxx
API Secret:  ty_secret_xxx
Seller ID:   123456
```

---

### 4️⃣ MİGROS YEMEK

#### Restoran'ın Yapması Gerekenler:

1. **Migros Yemek Restoran Paneli**
   - URL: https://restoran.migrosonline.com
   - veya migrosyemek@migros.com.tr adresine mail at

2. **API Talebi**
   - Migros'ta API key manuel verilir
   - Restoran adına talep oluşturulur
   - 1-3 gün içinde dönüş yapılır

#### Paketçi Paneline Girilmesi Gerekenler:
```
API Key:     migros_api_xxx
API Secret:  migros_secret_xxx
Restaurant ID: REST_123
```

---

## 🖥️ PAKETÇİ RESTORAN PORTALI - API GİRİŞİ

Restoran, kendi panelinden API bilgilerini girer:

### Giriş Adımları:

1. **Paketçi Restoran Portalına Giriş**
   - URL: `https://partner.paketci.app`
   - Kullanıcı adı/şifre ile giriş

2. **Entegrasyonlar Menüsü**
   - Sol sidebar: `Entegrasyonlar`

3. **Platform Seçimi**
   ```
   ┌─────────────────────────────────────┐
   │  🍽️ Platform Entegrasyonları        │
   ├─────────────────────────────────────┤
   │                                     │
   │  ☑️ Yemeksepeti     [Ayarla →]     │
   │  ☑️ Getir Yemek     [Ayarla →]     │
   │  ☐ Trendyol         [Ayarla →]     │
   │  ☐ Migros           [Ayarla →]     │
   │                                     │
   └─────────────────────────────────────┘
   ```

4. **API Bilgilerini Gir**
   ```
   Yemeksepeti API Yapılandırması
   ───────────────────────────────
   
   API Key:     [________________]
   API Secret:  [________________]
   Merchant ID: [________________]
   Branch ID:   [________________]
   
   [✓] Siparişleri otomatik kabul et
   [✓] Açılış/kapanış saatlerini senkronize et
   
   [Bağlantıyı Test Et]  [Kaydet]
   ```

5. **Webhook URL Otomatik Oluşur**
   - Restoran kaydettikten sonra Paketçi otomatik webhook URL oluşturur
   - Restoran bu URL'i platform paneline girer
   - Örnek: `https://api.paketci.app/api/webhooks/yemeksepeti/r_12345`

---

## 🔐 GÜVENLİK

### API Key'ler Nasıl Saklanır?

```
Restoran Paneli → Paketçi Backend
         │
         ▼
   ┌─────────────┐
   │ AES-256     │  ← Şifreleme
   │ Encryption  │
   └─────────────┘
         │
         ▼
   PostgreSQL (encrypted)
```

- API key'ler hiçbir zaman plaintext olarak saklanmaz
- Master key `ENCRYPTION_KEY` environment variable'ında tutulur
- Sadece backend API çağrısı yaparken geçici olarak çözülür

### Yetkilendirme Seviyeleri

| Rol | API Key Görme | API Key Düzenleme |
|-----|--------------|-------------------|
| Restoran Sahibi | ✅ | ✅ |
| Restoran Yöneticisi | ✅ | ✅ |
| Personel | ❌ | ❌ |

---

## ⚠️ SIK KARŞILAŞILAN SORUNLAR

### 1. "API Key bulunamadı" Hatası

**Neden:** Restoran henüz platform panelinden API key almamış.

**Çözüm:**
1. Restorana platform adım adım anlatılır
2. Ekran görüntülü rehber gönderilir
3. Gerekirse uzaktan bağlanıp yardım edilir

### 2. "Yetkisiz erişim" Hatası

**Neden:** API key'in yetkileri eksik.

**Çözüm:**
- Platform panelinden yetkiler güncellenir
- Sipariş okuma + yazma yetkisi verilmeli

### 3. Webhook çalışmıyor

**Neden:** Webhook URL platforma girilmemiş.

**Çözüm:**
1. Paketçi panelinden webhook URL kopyalanır
2. Platform paneline yapıştırılır
3. SSL sertifikası kontrol edilir (zorunlu)

---

## 📞 RESTORAN DESTEK ŞABLONLARI

Restoranlara göndereceğiniz mail şablonları:

### Yemeksepeti API Key Talebi

```
Konu: Yemeksepeti API Entegrasyonu - Paketçi Kurye Sistemi

Sayın [Restoran Adı],

Paketçi kurye yönetim sistemi ile siparişlerinizi otomatik 
yönetebilmeniz için Yemeksepeti API key'lerinize ihtiyacımız var.

Adım adım yapmanız gerekenler:

1. https://partner.yemeksepeti.com adresine giriş yapın
2. Sol menüden Ayarlar → API Entegrasyonu'na tıklayın
3. "Yeni API Key Oluştur" butonuna basın
4. Aşağıdaki bilgileri kopyalayıp bize gönderin:

   - API Key: _______________
   - API Secret: _______________
   - Merchant ID: _______________
   - Branch ID: _______________

5. İzinler olarak şunları işaretleyin:
   ☑ Siparişleri görüntüle
   ☑ Siparişleri kabul/red et
   ☑ Restoran durumunu değiştir

Yardıma ihtiyacınız olursa bizi arayabilirsiniz: 0850 XXX XX XX

Saygılarımızla,
Paketçi Ekibi
```

---

## ✅ KONTROL LİSTESİ (Restoran Onboarding)

Her yeni restoran için:

- [ ] Paketçi hesabı oluşturuldu
- [ ] Yemeksepeti API key alındı
- [ ] Getir API key alındı (varsa)
- [ ] Diğer platformlar (varsa)
- [ ] Webhook URL'leri platformlara girildi
- [ ] Test siparişi oluşturuldu
- [ ] Kurye atama test edildi
- [ ] Restoran eğitimi verildi

---

*Son Güncelleme: 19 Mart 2026*
