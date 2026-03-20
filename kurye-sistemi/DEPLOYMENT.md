# Paketci App - Subdomain ve Sunucu Yapılandırması

## 🌐 Subdomain Yapısı

### Ana Domain
- **Domain**: `paketci.app`
- **Ana Panel**: `https://paketci.app` (Super Admin / Company Admin)

### Rol Bazlı Subdomainler

| Subdomain | Rol | Açıklama |
|-----------|-----|----------|
| `admin.paketci.app` | Super/Company Admin | Ana yönetim paneli |
| `api.paketci.app` | Backend API | REST API ve WebSocket |
| `bayi.paketci.app` | Dealer | Bayi yönetim paneli |
| `kurye.paketci.app` | Courier | Kurye mobil uygulama |
| `restoran.paketci.app` | Restaurant | Restoran sahibi paneli |
| `saha.paketci.app` | Field Sales | Saha satış ekibi |
| `muhasebe.paketci.app` | Accountant | Muhasebe paneli |
| `operasyon.paketci.app` | Operations | Operasyon merkezi |

### Dinamik Bayi Subdomainleri (Opsiyonel - Çoklu Kiracı)
```
{bayi-slug}.paketci.app

Örnekler:
- aydinlar.paketci.app → Aydınlar Dağıtım
- hizlitasima.paketci.app → Hızlı Taşıma Ltd.
- istanbulkurye.paketci.app → İstanbul Kurye
```

## 🖥️ Sunucu Gereksinimleri

### Minimum (Geliştirme)
- **CPU**: 2 vCPU
- **RAM**: 4 GB
- **Disk**: 40 GB SSD
- **OS**: Ubuntu 22.04 LTS

### Önerilen (Üretim)
- **CPU**: 4 vCPU
- **RAM**: 8 GB
- **Disk**: 100 GB SSD
- **OS**: Ubuntu 22.04 LTS

### Yüksek Trafik (Ölçeklendirme)
- **CPU**: 8+ vCPU
- **RAM**: 16+ GB
- **Disk**: 200 GB SSD
- **Load Balancer**: Nginx / HAProxy
- **Redis Cluster**: Cache için
- **PostgreSQL Cluster**: Master-Slave

## 📦 Kurulum Adımları

### 1. Sistem Paketleri
```bash
# Sunucu güncelleme
sudo apt update && sudo apt upgrade -y

# Gerekli paketler
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx \
    postgresql postgresql-contrib redis-server nodejs npm docker.io \
    docker-compose htop ufw fail2ban

# Docker'ı başlat
sudo systemctl enable docker
sudo systemctl start docker

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Kullanıcı Oluşturma
```bash
# Deploy kullanıcısı
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG sudo deploy
sudo usermod -aG docker deploy

# SSH key oluştur (deploy kullanıcısı için)
sudo su - deploy
ssh-keygen -t ed25519 -C "deploy@paketci.app"
```

### 3. Nginx Yapılandırması
```nginx
# /etc/nginx/sites-available/paketci.app
server {
    listen 80;
    server_name paketci.app www.paketci.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name paketci.app www.paketci.app;

    ssl_certificate /etc/letsencrypt/live/paketci.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paketci.app/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# API Subdomain
server {
    listen 443 ssl http2;
    server_name api.paketci.app;

    ssl_certificate /etc/letsencrypt/live/paketci.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paketci.app/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL Sertifikası
```bash
sudo certbot --nginx -d paketci.app -d www.paketci.app \
    -d api.paketci.app -d admin.paketci.app \
    -d bayi.paketci.app -d kurye.paketci.app \
    -d restoran.paketci.app -d saha.paketci.app \
    -d muhasebe.paketci.app -d operasyon.paketci.app
```

### 5. PostgreSQL Yapılandırması
```bash
# Veritabanı oluştur
sudo -u postgres psql -c "CREATE DATABASE kurye_db;"
sudo -u postgres psql -c "CREATE USER kurye_user WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kurye_db TO kurye_user;"

# .env dosyası için
DB_HOST=localhost
DB_PORT=5432
DB_USER=kurye_user
DB_PASS=secure_password
DB_NAME=kurye_db
```

### 6. Redis Yapılandırması
```bash
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Redis şifresi
sudo nano /etc/redis/redis.conf
# requirepass your_redis_password

sudo systemctl restart redis-server
```

### 7. PM2 Yapılandırması
```bash
# Global PM2 kurulumu
sudo npm install -g pm2

# Ecosystem dosyası
# ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'paketci-api',
      cwd: '/home/deploy/paketci-app/kurye-sistemi/backend',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'paketci-frontend',
      cwd: '/home/deploy/paketci-app/kurye-sistemi/frontend',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

### 8. Güvenlik Duvarı
```bash
# UFW yapılandırması
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 3000/tcp    # Next.js
sudo ufw allow 3001/tcp    # API
sudo ufw enable
```

## 👤 Varsayılan Kullanıcılar

### Super Admin
```json
{
  "email": "admin@paketci.app",
  "password": "Admin@2024!",
  "role": "super_admin",
  "name": "Sistem Yöneticisi"
}
```

### Company Admin
```json
{
  "email": "yonetici@paketci.app",
  "password": "Yonetici@2024!",
  "role": "company_admin",
  "name": "Şirket Yöneticisi"
}
```

### Test Bayisi
```json
{
  "email": "bayi@paketci.app",
  "password": "Bayi@2024!",
  "role": "dealer",
  "name": "Aydınlar Dağıtım",
  "companyName": "Aydınlar Lojistik Ltd."
}
```

### Test Kuryesi
```json
{
  "email": "kurye@paketci.app",
  "password": "Kurye@2024!",
  "role": "courier",
  "name": "Ahmet Yılmaz",
  "phone": "+90 555 123 4567"
}
```

### Test Restoranı
```json
{
  "email": "restoran@paketci.app",
  "password": "Restoran@2024!",
  "role": "restaurant",
  "name": "Burger King - Taksim",
  "address": "Taksim Meydanı No:1"
}
```

## 🚀 Deploy Script

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Paketci App Deploy Başlıyor..."

# 1. Kodu çek
cd /home/deploy/paketci-app
git pull origin master

# 2. Backend kurulum
cd kurye-sistemi/backend
npm install
npm run build

# 3. Frontend kurulum
cd ../frontend
npm install
npm run build

# 4. PM2 yeniden başlat
cd /home/deploy/paketci-app
pm2 restart ecosystem.config.js

# 5. Nginx yeniden yükle
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deploy tamamlandı!"
```

## 📋 Kontrol Listesi

- [ ] Domain DNS kayıtları (A kayıtları)
- [ ] SSL sertifikaları
- [ ] PostgreSQL veritabanı
- [ ] Redis cache
- [ ] Nginx yapılandırması
- [ ] PM2 process yönetimi
- [ ] Güvenlik duvarı (UFW)
- [ ] Fail2ban kurulumu
- [ ] Log rotasyonu
- [ ] Yedekleme stratejisi
- [ ] Monitoring (Prometheus/Grafana)
