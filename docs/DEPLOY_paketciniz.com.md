# 🚀 PAKETÇİ - paketciniz.com Deployment Rehberi

## 📋 DOMAIN YAPISI

| Subdomain | Amaç | Servis |
|-----------|------|--------|
| `api.paketciniz.com` | Backend API | NestJS (Port 4000) |
| `paketci.paketciniz.com` | Admin Panel | Next.js (Port 3000) |
| `partner.paketciniz.com` | Bayi/Partner Panel | Next.js (Port 3000) |
| `isletme.paketciniz.com` | Restoran Panel | React/Vite (Port 3001) |

---

## 🔧 DNS AYARLARI

Cloudflare veya DNS sağlayıcınızda şu A kayıtlarını ekleyin:

```
Type: A
Name: api
Content: SUNUCU_IP_ADRESI
Proxy: ON (Orange cloud)

Type: A
Name: paketci
Content: SUNUCU_IP_ADRESI
Proxy: ON (Orange cloud)

Type: A
Name: partner
Content: SUNUCU_IP_ADRESI
Proxy: ON (Orange cloud)

Type: A
Name: isletme
Content: SUNUCU_IP_ADRESI
Proxy: ON (Orange cloud)
```

---

## 📦 KURULUM ADIMLARI

### 1. Sunucuya Bağlan
```bash
ssh root@SUNUCU_IP
```

### 2. Proje Klasörüne Git
```bash
cd /root/.openclaw/workspace/kurye-sistemi
```

### 3. Environment Değişkenlerini Ayarla
```bash
cp .env.example .env
nano .env
```

`.env` dosyasına şunları gir:
```env
DOMAIN=paketciniz.com
ADMIN_DOMAIN=paketci.paketciniz.com
PARTNER_DOMAIN=partner.paketciniz.com
RESTAURANT_DOMAIN=isletme.paketciniz.com
API_DOMAIN=api.paketciniz.com

DB_PASS=GucluBirSifre123!
JWT_SECRET=$(openssl rand -base64 64)
ENCRYPTION_KEY=$(openssl rand -base64 32)
```

### 4. SSL Sertifikası Al (Let's Encrypt)
```bash
# Certbot kurulu değilse
apt update && apt install -y certbot

# Sertifika al
certbot certonly --standalone -d paketciniz.com \
  -d api.paketciniz.com \
  -d paketci.paketciniz.com \
  -d partner.paketciniz.com \
  -d isletme.paketciniz.com

# Sertifikalar şu konuma gelir:
# /etc/letsencrypt/live/paketciniz.com/
```

### 5. Sertifikaları Docker Volume'a Bağla
```bash
# Sertifika klasörünü oluştur
mkdir -p ./certbot/conf/live/paketciniz.com
mkdir -p ./certbot/conf/archive/paketciniz.com

# Sertifikaları kopyala
cp /etc/letsencrypt/live/paketciniz.com/* ./certbot/conf/live/paketciniz.com/
cp /etc/letsencrypt/archive/paketciniz.com/* ./certbot/conf/archive/paketciniz.com/

# Renew script oluştur
cat > /etc/cron.daily/renew-ssl << 'EOF'
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/paketciniz.com/* /root/.openclaw/workspace/kurye-sistemi/certbot/conf/live/paketciniz.com/
cd /root/.openclaw/workspace/kurye-sistemi && docker compose restart nginx
EOF

chmod +x /etc/cron.daily/renew-ssl
```

### 6. Docker Compose ile Başlat
```bash
# Tüm servisleri başlat
docker compose up -d --build

# Logları kontrol et
docker compose logs -f
```

---

## 🔍 SERVİS DURUMLARINI KONTROL ET

```bash
# Çalışan konteynerler
docker ps

# Her servisin durumu
docker compose ps

# Loglar
docker compose logs backend -f
docker compose logs frontend -f
docker compose logs nginx -f
```

---

## 🧪 TEST ADIMLARI

### 1. API Testi
```bash
curl https://api.paketciniz.com/api/health
```

### 2. Admin Panel Testi
Tarayıcıda aç:
```
https://paketci.paketciniz.com
```

### 3. Partner Panel Testi
```
https://partner.paketciniz.com
```

### 4. Restoran Panel Testi
```
https://isletme.paketciniz.com
```

---

## 🔄 GÜNCELLEME (Yeni Versiyon)

```bash
cd /root/.openclaw/workspace/kurye-sistemi

# Eski versiyonu durdur
docker compose down

# Yeni dosyaları çıkart
tar -xzf kurye-sistemi-v5.0-FINAL.tar.gz

# Tekrar başlat
docker compose up -d --build
```

---

## 🛠️ SORUN GİDERME

### 502 Bad Gateway
```bash
# Backend çalışıyor mu?
docker compose ps backend

# Backend logları
docker compose logs backend

# Port dinleniyor mu?
docker compose exec backend netstat -tlnp
```

### SSL Hatası
```bash
# Sertifika var mı?
ls -la certbot/conf/live/paketciniz.com/

# Nginx config test
docker compose exec nginx nginx -t

# Nginx reload
docker compose exec nginx nginx -s reload
```

### 403 Forbidden
```bash
# Nginx logları
docker compose logs nginx

# Dosya izinleri
docker compose exec nginx ls -la /usr/share/nginx/html
```

---

## 📊 MONITORING

### Disk Kullanımı
```bash
df -h
```

### Memory Kullanımı
```bash
free -h
```

### Docker Resource Usage
```bash
docker stats
```

---

## 🚨 YEDEKLEME

### Veritabanı Yedekleme
```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

docker compose exec postgres pg_dump -U postgres kurye_db > \
  $BACKUP_DIR/kurye_db_$DATE.sql

# 7 günden eski yedekleri sil
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

### Otomatik Yedekleme (Cron)
```bash
crontab -e

# Her gece 3'te yedekle
0 3 * * * /root/backup-script.sh
```

---

## 📞 DESTEK

Sorun yaşarsanız:
1. Logları kontrol edin: `docker compose logs -f`
2. Servis durumları: `docker compose ps`
3. Sistem kaynakları: `htop`

---

*Son Güncelleme: 19 Mart 2026*
