# 🚀 PAKETÇİ SİSTEMİ - PRODUCTION KURULUM REHBERİ

**Versiyon:** 1.0.0  
**Tarih:** 19 Mart 2026  
**Hedef:** Tüm sistemi production sunucusuna kurmak

---

## 📋 GEREKSİNİMLER

### Sunucu (VPS/Cloud)
- **OS:** Ubuntu 22.04 LTS
- **CPU:** 2+ Core
- **RAM:** 4GB+ (8GB önerilir)
- **Disk:** 50GB SSD
- **Network:** Public IP, Domain

### Domainler
```
api.paketci.app      → Backend API
partner.paketci.app  → Restoran Portalı
socket.paketci.app   → WebSocket Gateway
```

---

## 🎯 KURULUM ADIMLARI

### ADIM 1: Sunucu Hazırlığı

```bash
# Sunucuya SSH ile bağlan
ssh root@SUNUCU_IP

# Sistemi güncelle
sudo apt update && sudo apt upgrade -y

# Gerekli paketleri kur
sudo apt install -y \
    curl wget git vim \
    docker.io docker-compose \
    nginx certbot python3-certbot-nginx \
    nodejs npm

# Docker'ı başlat
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# Node.js 20 kur
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 kur (global)
sudo npm install -g pm2
```

---

### ADIM 2: Proje İndirme

```bash
# Proje dizini oluştur
sudo mkdir -p /var/www/paketci
cd /var/www/paketci

# Projeyi klonla (veya upload et)
git clone https://github.com/seninrepo/paketci-sistem.git .
# VEYA: SCP/FTP ile dosyaları upload et

# Dizin yapısını kontrol et
ls -la
# Beklenen: backend/ restaurant-portal/ services/ docker-compose.yml
```

---

### ADIM 3: Environment Değişkenleri

```bash
# Ana .env dosyası
cd /var/www/paketci
sudo nano .env
```

**.env içeriği:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=paketci_user
DB_PASS=SIFRE_BURAYA_GIR
DB_NAME=paketci_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=UZUN_GIZLI_ANAHTAR_BURAYA_64_KARAKTER
JWT_EXPIRATION=7d

# API
API_PORT=4000
API_URL=https://api.paketci.app

# WebSocket
WS_PORT=4001
WS_URL=wss://socket.paketci.app

# FCM (Firebase)
FCM_SERVER_KEY=AAAAxxxxx:APA91bxxxxx

# SMS (Twilio)
TWILIO_SID=ACxxxxx
TWILIO_TOKEN=xxxxx
TWILIO_PHONE=+905xxxxxxxxx

# Platform API Keys
YEMEKSEPETI_API_KEY=xxx
GETIR_API_KEY=xxx
TRENDYOL_API_KEY=xxx
MIGROS_API_KEY=xxx

# Environment
NODE_ENV=production
```

```bash
# Backend .env
cd backend
sudo cp .env.example .env
sudo nano .env
# Üstteki değerleri buraya da kopyala
```

---

### ADIM 4: Docker Compose Başlatma

```bash
cd /var/www/paketci

# PostgreSQL ve Redis başlat
sudo docker-compose up -d postgres redis

# Logları kontrol et
sudo docker-compose logs -f postgres
sudo docker-compose logs -f redis
```

**docker-compose.yml içeriği:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: paketci-postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: paketci-redis
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "127.0.0.1:6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

---

### ADIM 5: Backend Kurulumu

```bash
cd /var/www/paketci/backend

# Bağımlılıkları kur
sudo npm ci --production

# Veritabanı migrasyonu
sudo npx typeorm migration:run

# Seed data (ilk admin kullanıcı)
sudo npm run seed

# Production build
sudo npm run build

# PM2 ile başlat
sudo pm2 start dist/main.js --name "paketci-api" \
    --env production \
    --instances max \
    --exec-mode cluster

# PM2 startup ayarı
sudo pm2 startup systemd
sudo pm2 save
```

**PM2 ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'paketci-api',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: '/var/log/paketci/err.log',
    out_file: '/var/log/paketci/out.log',
    log_file: '/var/log/paketci/combined.log',
    time: true
  }]
};
```

---

### ADIM 6: Restoran Portalı Kurulumu

```bash
cd /var/www/paketci/restaurant-portal

# Bağımlılıkları kur
sudo npm ci

# Environment
sudo cp .env.example .env
sudo nano .env
```

**restaurant-portal .env:**
```env
VITE_API_URL=https://api.paketci.app
VITE_WS_URL=wss://socket.paketci.app
VITE_FCM_VAPID_KEY=BNxxxxx
```

```bash
# Build al
sudo npm run build

# Build çıktısını nginx dizinine kopyala
sudo mkdir -p /var/www/partner.paketci.app
sudo cp -r dist/* /var/www/partner.paketci.app/
sudo chown -R www-data:www-data /var/www/partner.paketci.app
```

---

### ADIM 7: Nginx Konfigürasyonu

```bash
# Nginx yapılandırması
sudo nano /etc/nginx/sites-available/paketci
```

**Nginx config:**
```nginx
# Backend API
server {
    listen 80;
    server_name api.paketci.app;
    
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# WebSocket Gateway
server {
    listen 80;
    server_name socket.paketci.app;
    
    location / {
        proxy_pass http://127.0.0.1:4001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }
}

# Restoran Portalı
server {
    listen 80;
    server_name partner.paketci.app;
    root /var/www/partner.paketci.app;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

```bash
# Siteyi etkinleştir
sudo ln -s /etc/nginx/sites-available/paketci /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Nginx test et
sudo nginx -t

# Nginx yeniden başlat
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

### ADIM 8: SSL Sertifikası (HTTPS)

```bash
# Certbot ile SSL kur
sudo certbot --nginx \
    -d api.paketci.app \
    -d socket.paketci.app \
    -d partner.paketci.app \
    --email admin@paketci.app \
    --agree-tos \
    --non-interactive

# Otomatik yenileme testi
sudo certbot renew --dry-run
```

---

### ADIM 9: Firewall Ayarları

```bash
# UFW yapılandırması
sudo ufw default deny incoming
sudo ufw default allow outgoing

# İzin verilen portlar
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# UFW'yi etkinleştir
sudo ufw enable
sudo ufw status
```

---

### ADIM 10: Log ve Monitoring

```bash
# Log dizini oluştur
sudo mkdir -p /var/log/paketci
sudo chown $USER:$USER /var/log/paketci

# PM2 log rotasyonu
sudo pm2 install pm2-logrotate
sudo pm2 set pm2-logrotate:max_size 100M
sudo pm2 set pm2-logrotate:retain 10

# Basit monitoring scripti
cat > /usr/local/bin/paketci-status << 'EOF'
#!/bin/bash
echo "=== Paketçi Sistem Durumu ==="
echo ""
echo "Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}"
echo ""
echo "PM2 Processes:"
pm2 list
echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager | head -5
echo ""
echo "Disk Usage:"
df -h /var/www
echo ""
echo "Memory Usage:"
free -h
EOF

sudo chmod +x /usr/local/bin/paketci-status
```

---

## 🪟 WINDOWS SERVİS KURULUMU

### Build ve Hazırlık

```bash
# Windows makinede (Development)
cd services/windows/PaketciWindowsService

# Release build
dotnet publish -c Release -r win-x64 --self-contained true \
    -p:PublishSingleFile=true \
    -p:TrimUnusedDependencies=true

# Çıktıyı kopyala
xcopy bin\Release\net8.0\win-x64\publish \
    C:\Paketci\WindowsService\ /E /I
```

### Hedef Bilgisayarda Kurulum

```powershell
# Administrator PowerShell
cd C:\Paketci\WindowsService

# Konfigürasyonu düzenle
notepad appsettings.json

# Servisi kur
.\install.bat

# Servisi başlat
sc start PaketciWindowsService

# Logları kontrol et
cat logs\paketci-$(Get-Date -Format "yyyy-MM-dd").log
```

---

## 🤖 ANDROID SERVİS KURULUMU

### APK Build

```bash
cd services/android

# Release build
./gradlew assembleRelease

# İmzala
jarsigner -keystore mykeystore.jks \
    app/build/outputs/apk/release/app-release-unsigned.apk \
    alias_name

# Zipalign
zipalign -v 4 \
    app-release-unsigned.apk \
    paketci-android-service.apk
```

### Dağıtım
- Play Store yükleme
- Veya doğrudan APK kurulumu

---

## 📱 FLUTTER MOBILE APP

### Build

```bash
cd mobile

# Bağımlılıklar
flutter pub get

# Android APK
flutter build apk --release

# iOS (Mac gerektirir)
flutter build ios --release

# Çıktılar:
# build/app/outputs/flutter-apk/app-release.apk
```

---

## 🔄 GÜNCELLEME PROSEDÜRÜ

### Backend Güncelleme

```bash
cd /var/www/paketci

# Son kodları çek
git pull origin main

# Backend güncelle
cd backend
sudo npm ci --production
sudo npm run build

# PM2 yeniden başlat
sudo pm2 restart paketci-api

# Migrasyon (gerekirse)
sudo npx typeorm migration:run
```

### Portal Güncelleme

```bash
cd /var/www/paketci/restaurant-portal

# Kodları çek
git pull

# Build al
sudo npm ci
sudo npm run build

# Nginx dizinine kopyala
sudo rm -rf /var/www/partner.paketci.app/*
sudo cp -r dist/* /var/www/partner.paketci.app/
```

---

## 💾 YEDEKLEME STRATEJİSİ

### Otomatik Yedekleme Scripti

```bash
sudo nano /usr/local/bin/paketci-backup
```

```bash
#!/bin/bash

BACKUP_DIR="/backup/paketci"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Database yedekle
docker exec paketci-postgres pg_dump -U paketci_user paketci_db \
    | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Uploads yedekle
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/paketci/backend/uploads/

# 7 günden eski yedekleri sil
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Yedekleme tamamlandı: $DATE"
```

```bash
sudo chmod +x /usr/local/bin/paketci-backup

# Cron job ekle (her gün gece 3'te)
(sudo crontab -l 2>/dev/null; echo "0 3 * * * /usr/local/bin/paketci-backup") | sudo crontab -
```

---

## 🐛 SORUN GİDERME

### Backend Çalışmıyor
```bash
# Logları kontrol et
sudo pm2 logs paketci-api

# Port kullanımı kontrol et
sudo netstat -tlnp | grep 4000

# PM2 restart
sudo pm2 restart paketci-api
```

### Database Bağlantı Hatası
```bash
# Container durumu
docker ps | grep postgres

# Database logları
docker logs paketci-postgres

# Container yeniden başlat
docker restart paketci-postgres
```

### 502 Bad Gateway
```bash
# Backend çalışıyor mu?
curl http://localhost:4000/health

# Nginx yapılandırması
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Hatası
```bash
# Sertifika yenileme
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

---

## 📊 PERFORMANS AYARLARI

### PostgreSQL Optimizasyonu
```sql
-- postgresql.conf
max_connections = 200
shared_buffers = 1GB
effective_cache_size = 3GB
maintenance_work_mem = 256MB
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 5242kB
min_wal_size = 1GB
max_wal_size = 4GB
```

### Nginx Optimizasyonu
```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 4096;
client_max_body_size 50M;
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

---

## ✅ KURULUM SONRASI KONTROL LİSTESİ

- [ ] Backend API erişilebilir: `https://api.paketci.app/health`
- [ ] WebSocket çalışıyor: `wss://socket.paketci.app`
- [ ] Portal yüklü: `https://partner.paketci.app`
- [ ] SSL sertifikası geçerli
- [ ] Database bağlantısı aktif
- [ ] Redis çalışıyor
- [ ] Admin kullanıcı oluşturuldu
- [ ] Log rotasyonu aktif
- [ ] Yedekleme scripti çalışıyor
- [ ] Firewall yapılandırıldı

---

## 📞 DESTEK

Sorun yaşarsanız:
1. Log dosyalarını kontrol edin: `/var/log/paketci/`
2. PM2 status: `sudo pm2 status`
3. Docker durumu: `sudo docker-compose ps`
4. Nginx test: `sudo nginx -t`

**Hazırlayan:** Kimi Claw  
**Son Güncelleme:** 19 Mart 2026
