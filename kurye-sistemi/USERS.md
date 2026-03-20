# 👤 Varsayılan Kullanıcı Hesapları

Paketci App kurulumu sonrası bu hesaplar otomatik olarak oluşturulur.

## 🔐 Giriş Bilgileri

| Rol | E-posta | Şifre | Erişim Paneli |
|-----|---------|-------|---------------|
| **Super Admin** | `admin@paketci.app` | `Admin@2024!` | admin.paketci.app |
| **Company Admin** | `yonetici@paketci.app` | `Yonetici@2024!` | paketci.app |
| **Regional Manager** | `bolge@paketci.app` | `Bolge@2024!` | paketci.app |
| **Manager** | `mudur@paketci.app` | `Mudur@2024!` | paketci.app |
| **Accountant** | `muhasebe@paketci.app` | `Muhasebe@2024!` | muhasebe.paketci.app |
| **Field Sales** | `satis@paketci.app` | `Satis@2024!` | saha.paketci.app |
| **Operations** | `operasyon@paketci.app` | `Operasyon@2024!` | operasyon.paketci.app |
| **Dealer** | `bayi@paketci.app` | `Bayi@2024!` | bayi.paketci.app |
| **Restaurant** | `restoran@paketci.app` | `Restoran@2024!` | restoran.paketci.app |
| **Courier 1** | `kurye@paketci.app` | `Kurye@2024!` | kurye.paketci.app |
| **Courier 2** | `kurye2@paketci.app` | `Kurye@2024!` | kurye.paketci.app |

## 🌐 Subdomain Erişimleri

| Subdomain | Rol | Açıklama |
|-----------|-----|----------|
| `https://paketci.app` | Super/Company Admin | Ana yönetim paneli |
| `https://admin.paketci.app` | Super Admin | Detaylı admin paneli |
| `https://api.paketci.app` | API | Backend API erişimi |
| `https://bayi.paketci.app` | Dealer | Bayi yönetim paneli |
| `https://kurye.paketci.app` | Courier | Kurye mobil uygulama |
| `https://restoran.paketci.app` | Restaurant | Restoran sahibi paneli |
| `https://saha.paketci.app` | Field Sales | Saha satış paneli |
| `https://muhasebe.paketci.app` | Accountant | Muhasebe paneli |
| `https://operasyon.ppaketci.app` | Operations | Operasyon merkezi |

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
npm run seed:reset-password -- -e kurye@paketci.app -p YeniSifre123!
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

### Dealer (Bayi)
- Kurye yönetimi
- Restoran ilişkileri
- Komisyon takibi
- Destek talepleri

### Courier (Kurye)
- Sipariş alma/teslimat
- Kazanç takibi
- Navigasyon
- Bayi ile mesajlaşma

### Restaurant
- Sipariş oluşturma
- Kurye takibi
- Raporlar
- Fatura görüntüleme

## 🔧 API Erişimi

```bash
# Token alma
curl -X POST https://api.paketci.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@paketci.app","password":"Admin@2024!"}'

# API kullanımı
curl https://api.paketci.app/users/me \
  -H "Authorization: Bearer TOKEN"
```
