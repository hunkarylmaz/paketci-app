# Paketçi Browser Extension - Dağıtım ve Kimlik Doğrulama

## 📦 DAĞITIM SEÇENEKLERİ

### Seçenek 1: ZIP Dosyası (Developer Mode) - HIZLI BAŞLANGIÇ
```
Paketçi Paneli → Eklenti İndir → extension.zip
↓
Restoran:
1. Chrome → Ayarlar → Uzantılar
2. Geliştirici modu AÇIK
3. "Paketlenmemiş öğe yükle" → zip klasörünü seç
4. Hazır!
```

**Avantajlar:**
- ✅ Anında kullanım
- ✅ Google onayı beklemez
- ✅ Kendi hosting'imizde

**Dezavantajlar:**
- ❌ Chrome uyarı verir ("Geliştirici modu açık")
- ❌ Manuel güncelleme gerekir
- ❌ Teknik bilgi gerektirir

---

### Seçenek 2: Chrome Web Store (ÖNERİLEN)
```
Chrome Web Store → "Paketçi Kurye Eklentisi"
↓
Restoran:
1. Store'da arat
2. "Chrome'a ekle" butonu
3. Otomatik kurulum
4. Otomatik güncelleme
```

**Avantajlar:**
- ✅ Güvenilir (Chrome onaylı)
- ✅ Otomatik güncelleme
- ✅ Kolay kurulum
- ✅ Profesyonel görünüm

**Dezavantajlar:**
- ⏱️ Google onayı: 1-7 gün
- 💰 Geliştirici ücreti: $5 (tek seferlik)
- 📋 Policy uygunluğu gerekli

---

### Seçenek 3: Her İkisi Birlikte (ÖNERİLEN STRATEJİ)
```
AŞAMA 1: ZIP (Beta Test)
├── İlk müşterilere ZIP ver
├── Geri bildirim topla
└── Hataları düzelt

AŞAMA 2: Chrome Web Store
├── Store'a yükle
├── Genel kullanıma aç
└── Otomatik güncelleme aktif
```

---

## 🔐 KİMLİK DOĞRULAMA (Giriş)

### ÖNERİLEN: API Key ile Giriş (En Güvenli)

```
┌─────────────────────────────────────────────────────┐
│  🔵 PAKETÇİ EKLENTİ                                 │
│                                                     │
│  Eklentiyi kullanmak için API Key'inizi girin:      │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ pk_live_xxxxxxxxxxxxxxxxxxxxxxxx             │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  [?] API Key nerede?                               │
│      Paketçi Paneli → Ayarlar → API Bilgileri       │
│                                                     │
│           [Giriş Yap]                               │
└─────────────────────────────────────────────────────┘
```

**Neden API Key?**
- ✅ Basit (tek alan)
- ✅ Güvenli (revoke edilebilir)
- ✅ Restoran girişiyle aynı yetki
- ✅ Kolay kopyala-yapıştır
- ❌ Şifre unutma riski yok

---

### ALTERNATİF: Kullanıcı Adı + Şifre

```
┌─────────────────────────────────────────────────────┐
│  🔵 PAKETÇİ EKLENTİ                                 │
│                                                     │
│  E-posta:    [restoran@mail.com        ]           │
│  Şifre:      [••••••••                 ]           │
│                                                     │
│  [✓] Beni hatırla                                  │
│                                                     │
│           [Giriş Yap]                               │
│                                                     │
│  [Şifremi unuttum]                                  │
└─────────────────────────────────────────────────────┘
```

**Karşılaştırma:**

| Özellik | API Key | Kullanıcı Adı/Şifre |
|---------|---------|---------------------|
| Giriş hızı | ⚡ Tek tık | ⌨️ Yazma gerekir |
| Güvenlik | 🔐 Token bazlı | 🔐 Session bazlı |
| Şifre sıfırlama | Gerekmez | Gerekir |
| Çoklu cihaz | ✅ Kolay | ✅ Kolay |
| Revoke | ✅ Anında | ❌ Şifre değiştirme |

---

## 🏆 ÖNERİLEN SENARYO

### Giriş Akışı:
```
1. Restoran Paketçi Paneli'ne giriş yapar
   (email + şifre ile)
   ↓
2. Ayarlar → Eklenti bölümü
   ↓
3. API Key görür + "Eklentiyi İndir" butonu
   ↓
4. API Key'i kopyalar
   ↓
5. Chrome Extension'a yapıştırır
   ↓
6. ✅ Hazır! Artık siparişler otomatik gelir
```

### Session Yönetimi:
```javascript
// Eklenti API Key'i Chrome storage'a kaydeder
chrome.storage.local.set({
  'paketci_api_key': 'pk_live_...',
  'paketci_restaurant_id': 'PKT-REST-123',
  'paketci_restaurant_name': 'Ateş Döner'
});

// Sonraki açılışlarda otomatik giriş
// Restoran çıkış yapana kadar aktif
```

---

## 🔄 ÇIKIŞ / TOKEN SIFIRLAMA

```
Eklenti Popup → Ayarlar → [Çıkış Yap]
↓
- API Key silinir
- Tüm cache temizlenir
- Yeniden giriş gerekir
```

---

## 📋 ÖZET KARARLAR

| Konu | Karar | Neden |
|------|-------|-------|
| **Dağıtım** | Önce ZIP, sonra Store | Hızlı başlangıç + profesyonel sonuç |
| **Giriş** | API Key | Basit, güvenli, teknik destek az |
| **Session** | Chrome Storage | Kalıcı, güvenli, kullanıcı dostu |
| **Yetki** | Restoran paneliyle aynı | Tek kaynak doğrulama |

---

Bu yapıyla extension'ı hazırlayayım mı? 🚀
