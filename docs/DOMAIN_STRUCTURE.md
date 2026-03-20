# 🚀 PAKETÇİ - paketciniz.com Domain Yapılandırması

## 📋 SUBDOMAIN LİSTESİ

| Subdomain | Hizmet | Kullanıcı | Amaç |
|-----------|--------|-----------|------|
| **api.paketciniz.com** | NestJS Backend | Sistem | API Gateway + WebSocket |
| **paketci.paketciniz.com** | Next.js Admin | Sistem Admin | Sistem yönetimi, tüm bayiler ve restoranları görme |
| **partner.paketciniz.com** | Next.js Partner | Bayi/Firma Sahibi | Kendi kuryeleri ve restoranlarını yönetme |
| **isletme.paketciniz.com** | React Portal | Restoran | Sipariş takibi, raporlar, platform entegrasyonu |

---

## 🏗️ MİMARİ

```
┌─────────────────────────────────────────────────────────────────────┐
│                           KULLANICILAR                              │
├─────────────────┬──────────────────┬────────────────────────────────┤
│  Sistem Admin   │   Bayi/Partner   │        Restoran                │
│                 │                  │                                │
│ paketci.        │  partner.        │     isletme.                   │
│ paketciniz.com  │  paketciniz.com  │     paketciniz.com             │
└────────┬────────┴────────┬─────────┴────────┬───────────────────────┘
         │                 │                  │
         └─────────────────┴──────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NGINX REVERSE PROXY                              │
│                     (SSL Termination)                               │
└────────┬────────────────────────────────────────────────────────────┘
         │
         ├──▶ api.paketciniz.com ──────▶ NestJS (Port 4000)
         │
         ├──▶ paketci.paketciniz.com ──▶ Next.js (Port 3000)
         │
         ├──▶ partner.paketciniz.com ──▶ Next.js (Port 3000)
         │
         └──▶ isletme.paketciniz.com ──▶ React/Vite (Port 3001)

                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DOCKER KONTEYNERLER                              │
├─────────────┬─────────────┬─────────────────┬───────────────────────┤
│  Backend    │  Frontend   │   Partner       │    Veritabanı         │
│  (NestJS)   │  (Next.js)  │   (React)       │                       │
├─────────────┼─────────────┼─────────────────┼───────────────────────┤
│ Port: 4000  │ Port: 3000  │  Port: 3001     │ PostgreSQL: 5432      │
│             │             │                 │ Redis: 6379           │
└─────────────┴─────────────┴─────────────────┴───────────────────────┘
```

---

## 🔐 ROL TABLOSU

| Rol | Erişim | Yetkiler |
|-----|--------|----------|
| **Super Admin** | paketci.paketciniz.com | Tüm bayiler, restoranlar, ayarlar |
| **Bayi (Firma)** | partner.paketciniz.com | Kendi kuryeleri, restoranları, raporları |
| **Restoran** | isletme.paketciniz.com | Kendi siparişleri, entegrasyonlar, raporlar |
| **Kurye** | Mobile App | Sipariş alma, teslimat, konum paylaşma |

---

## 🌐 DNS YAPILANDIRMASI

### Cloudflare (Önerilen)

```
Type    Name        Content                Proxy Status
─────────────────────────────────────────────────────────
A       api         SUNUCU_IP             🟠 Proxied
A       paketci     SUNUCU_IP             🟠 Proxied
A       partner     SUNUCU_IP             🟠 Proxied
A       isletme     SUNUCU_IP             🟠 Proxied
A       @           SUNUCU_IP             🟠 Proxied
```

### SSL/TLS Ayarları
- **Mode:** Full (strict)
- **Always Use HTTPS:** ON
- **Minimum TLS Version:** 1.2

---

## 🔧 NGİNX YAPILANDIRMASI

Dosya: `nginx/conf.d/paketciniz.com.conf`

Her subdomain için ayrı server bloğu:
- SSL sertifikası (Let's Encrypt)
- WebSocket desteği
- CORS headers
- Rate limiting

---

## 🚀 HIZLI BAŞLANGIÇ

### 1. DNS Kayıtları Oluştur
Cloudflare'da 4 A kaydı ekle:
- `api.paketciniz.com`
- `paketci.paketciniz.com`
- `partner.paketciniz.com`
- `isletme.paketciniz.com`

### 2. Sertifika Al
```bash
certbot certonly --standalone \
  -d api.paketciniz.com \
  -d paketci.paketciniz.com \
  -d partner.paketciniz.com \
  -d isletme.paketciniz.com
```

### 3. Çevre Değişkenlerini Ayarla
```bash
DOMAIN=paketciniz.com
ADMIN_DOMAIN=paketci.paketciniz.com
PARTNER_DOMAIN=partner.paketciniz.com
RESTAURANT_DOMAIN=isletme.paketciniz.com
API_DOMAIN=api.paketciniz.com
```

### 4. Başlat
```bash
docker compose up -d --build
```

---

## 📊 PORT KULLANIMI

| Servis | Port | Dışarı Açık | Açıklama |
|--------|------|-------------|----------|
| Nginx | 80, 443 | ✅ | Tüm trafik buradan geçer |
| Backend | 4000 | ❌ | Sadece iç ağ |
| Frontend | 3000 | ❌ | Sadece iç ağ |
| Partner | 3001 | ❌ | Sadece iç ağ |
| PostgreSQL | 5432 | ❌ | Sadece iç ağ |
| Redis | 6379 | ❌ | Sadece iç ağ |

---

## 🧪 TEST

Her subdomain için:
```bash
# API
curl https://api.paketciniz.com/api/health

# Admin
curl -I https://paketci.paketciniz.com

# Partner
curl -I https://partner.paketciniz.com

# İşletme
curl -I https://isletme.paketciniz.com
```

---

## 📁 DOSYA YAPISI

```
kurye-sistemi/
├── nginx/
│   └── conf.d/
│       └── paketciniz.com.conf    # Tüm subdomain yapılandırması
├── backend/                        # api.paketciniz.com
├── frontend/                       # paketci.paketciniz.com + partner.paketciniz.com
├── restaurant-portal/              # isletme.paketciniz.com
├── docker-compose.yml
└── .env
```

---

## 🆘 SORUN GİDERME

### DNS Çözümlenmiyor
```bash
# DNS yayılımını kontrol et
nslookup paketci.paketciniz.com
nslookup partner.paketciniz.com
nslookup isletme.paketciniz.com
nslookup api.paketciniz.com
```

### Sertifika Hatası
```bash
# Sertifika kontrol
openssl s_client -connect paketci.paketciniz.com:443 -servername paketci.paketciniz.com

# Nginx config test
docker compose exec nginx nginx -t
```

### 502 Bad Gateway
```bash
# Backend sağlık kontrolü
docker compose ps backend
docker compose logs backend
```

---

## 📝 GÜNCELLEME GEÇMİŞİ

| Versiyon | Tarih | Değişiklik |
|----------|-------|------------|
| v5.0 | 2026-03-19 | paketciniz.com domain yapılandırması |

---

*Paketçi - B2B Kurye Yönetim Sistemi*
*https://paketciniz.com*
