# 👤 Varsayılan Kullanıcı Hesapları

Paketci App kurulumu sonrası bu hesaplar otomatik olarak oluşturulur.

## 🔐 Giriş Bilgileri

| Rol | E-posta | Şifre | Erişim Paneli |
|-----|---------|-------|---------------|
| **Super Admin** | `admin@paketciniz.com` | `Admin@2024!` | portal.paketciniz.com |
| **Company Admin** | `yonetici@paketciniz.com` | `Yonetici@2024!` | paketciniz.com |
| **Regional Manager** | `bolge@paketciniz.com` | `Bolge@2024!` | paketciniz.com |
| **Manager** | `mudur@paketciniz.com` | `Mudur@2024!` | paketciniz.com |
| **Accountant** | `muhasebe@paketciniz.com` | `Muhasebe@2024!` | muhasebe.paketciniz.com |
| **Field Sales** | `satis@paketciniz.com` | `Satis@2024!` | saha.paketciniz.com |
| **Operations** | `operasyon@paketciniz.com` | `Operasyon@2024!` | operasyon.paketciniz.com |
| **Dealer** | `bayi@paketciniz.com` | `Bayi@2024!` | paketci.paketciniz.com |
| **Restaurant** | `partner@paketciniz.com` | `Partner@2024!` | partner.paketciniz.com |
| **Courier 1** | `kurye@paketciniz.com` | `Kurye@2024!` | mobil.paketciniz.com |
| **Courier 2** | `kurye2@paketciniz.com` | `Kurye@2024!` | mobil.paketciniz.com |

## 🌐 Subdomain Erişimleri

| Subdomain | Rol | Açıklama |
|-----------|-----|----------|
| `https://paketciniz.com` | Super/Company Admin | Ana yönetim paneli |
| `https://portal.paketciniz.com` | Super Admin | Detaylı admin portalı |
| `https://api.paketciniz.com` | API | Backend API erişimi |
| `https://paketci.paketciniz.com` | Dealer | Paketçi/Bayi paneli |
| `https://mobil.paketciniz.com` | Courier | Kurye mobil uygulama |
| `https://partner.paketciniz.com` | Restaurant | Partner/Restoran paneli |
| `https://saha.paketciniz.com` | Field Sales | Saha satış paneli |
| `https://muhasebe.paketciniz.com` | Accountant | Muhasebe paneli |
| `https://operasyon.paketciniz.com` | Operations | Operasyon merkezi |

## 🚀 Kullanıcıları Oluşturma

### 1. Otomatik Oluşturma
```bash
cd /home/deploy/paketci-app/kurye-sistemi/backend
npm run seed:users
```

### 2. Kullanıcıları Listeleme
```bash
npm run seed:list
```

### 3. Şifre Sıfırlama
```bash
npm run seed:reset-password -- -e kurye@paketciniz.com -p YeniSifre123!
```

## ⚠️ Güvenlik Uyarısı

**Üretim ortamında şunları yapın:**

1. Varsayılan şifreleri değiştirin
2. Güçlü şifreler kullanın (en az 12 karakter, büyük/küçük harf, sayı, özel karakter)
3. 2FA (İki Faktörlü Doğrulama) etkinleştirin
4. Düzenli olarak şifreleri güncelleyin
5. Kullanıcı aktivitelerini izleyin

## 📋 Kullanıcı Özellikleri

### Super Admin
- Tüm sistem yönetimi
- Şirket oluşturma/silme
- Kullanıcı yönetimi
- Sistem ayarları

### Company Admin  
- Şirket içi kullanıcı yönetimi
- Bölge/bayi atamaları
- Finansal raporlar
- Sistem konfigürasyonu

### Dealer (Paketçi)
- Kurye yönetimi
- Restoran ilişkileri
- Komisyon takibi
- Destek talepleri

### Courier (Kurye)
- Sipariş alma/teslimat
- Kazanç takibi
- Navigasyon
- Bayi ile mesajlaşma

### Partner (Restoran)
- Sipariş oluşturma
- Kurye takibi
- Raporlar
- Fatura görüntüleme

## 🔧 API Erişimi

```bash
# Token alma
curl -X POST https://api.paketciniz.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@paketciniz.com","password":"Admin@2024!"}'

# API kullanımı
curl https://api.paketciniz.com/users/me \
  -H "Authorization: Bearer TOKEN"
```
