# CyberPanel VDS - paketciniz.com Subdomain Kurulumu

## 🖥️ Sunucu Bilgileri
- **IP**: 185.153.220.170
- **Panel**: https://185.153.220.170:8090
- **Kullanıcı**: admin
- **Şifre**: wE%XrNSfb7
- **OS**: Alma Linux 9

## 🌐 Açılacak Subdomainler

| Subdomain | Rol | SSL |
|-----------|-----|-----|
| paketciniz.com | Ana Domain | ✅ |
| www.paketciniz.com | WWW Yönlendirme | ✅ |
| api.paketciniz.com | Backend API | ✅ |
| portal.paketciniz.com | Admin Portalı | ✅ |
| paketci.paketciniz.com | Paketçi/Bayi Paneli | ✅ |
| partner.paketciniz.com | Restoran/Partner Paneli | ✅ |
| mobil.paketciniz.com | Kurye Mobil Uygulama | ✅ |
| saha.paketciniz.com | Saha Satış Paneli | ✅ |
| muhasebe.paketciniz.com | Muhasebe Paneli | ✅ |
| operasyon.paketciniz.com | Operasyon Merkezi | ✅ |

## 📋 Adım Adım Kurulum

### 1. CyberPanel'e Giriş
```
https://185.153.220.170:8090
Kullanıcı: admin
Şifre: wE%XrNSfb7
```

### 2. Website Oluşturma (Ana Domain)
1. **Websites** → **Create Website**
2. **Package**: Default
3. **Owner**: admin
4. **Domain Name**: paketciniz.com
5. **Email**: admin@paketciniz.com
6. **PHP**: 8.1 (veya 8.2)
7. **SSL**: ✅ Check
8. **DKIM Support**: ✅ Check
9. **Create** butonuna tıkla

### 3. Alt Domain (Subdomain) Oluşturma
Her subdomain için tekrarla:

1. **Websites** → **Create Website** (aslında subdomain için aynı menü)
2. **Domain Name**: `api.paketciniz.com`
3. **SSL**: ✅ Check
4. **Create**

**Tüm Subdomainler İçin Tekrarla:**
- api.paketciniz.com
- portal.paketciniz.com
- paketci.paketciniz.com
- partner.paketciniz.com
- mobil.paketciniz.com
- saha.paketciniz.com
- muhasebe.paketciniz.com
- operasyon.paketciniz.com

### 4. SSL Sertifikaları (Let's Encrypt)
CyberPanel otomatik SSL kuruyor, ama kontrol et:

1. **SSL** → **Manage SSL**
2. Her domain için **Issue SSL** tıkla
3. Wildcard SSL için: `*.paketciniz.com` (opsiyonel)

### 5. DNS Ayarları (Domain Sağlayıcında)
Domain sağlayıcın (Namecheap, GoDaddy, vb.) DNS ayarlarına git:

```
A     paketciniz.com         → 185.153.220.170
A     api.paketciniz.com     → 185.153.220.170
A     portal.paketciniz.com  → 185.153.220.170
A     paketci.paketciniz.com → 185.153.220.170
A     partner.paketciniz.com → 185.153.220.170
A     mobil.paketciniz.com   → 185.153.220.170
A     saha.paketciniz.com    → 185.153.220.170
A     muhasebe.paketciniz.com → 185.153.220.170
A     operasyon.paketciniz.com → 185.153.220.170
```

### 6. Reverse Proxy Ayarları (Nginx)
CyberPanel'de her subdomain için reverse proxy ayarla:

**SSH ile sunucuya bağlan:**
```bash
ssh root@185.153.220.170
```

**Nginx config düzenle:**
```bash
# Ana domain için
cd /etc/nginx/conf.d/
```

**Veya CyberPanel üzerinden:**
1. **Websites** → **List Websites**
2. Domain seç → **Configurations** → **vHost Conf**

**Proxy ayarları ekle:**
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

**API için (3001 portu):**
```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

### 7. Node.js Kurulumu
```bash
# SSH ile bağlan
ssh root@185.153.220.170

# Node.js 20 LTS kur
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
# Alma Linux için farklı:
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -

# Node.js ve npm kur
yum install -y nodejs

# PM2 kur
npm install -g pm2

# Versiyon kontrol
node -v  # v20.x.x
npm -v
```

### 8. PostgreSQL ve Redis Kurulumu (Alma Linux)
```bash
# PostgreSQL 15
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Redis
sudo dnf install -y redis
sudo systemctl enable redis
sudo systemctl start redis

# Veritabanı oluştur
sudo -u postgres psql -c "CREATE DATABASE kurye_db;"
sudo -u postgres psql -c "CREATE USER kurye_user WITH PASSWORD 'KuryeDB_2024!';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kurye_db TO kurye_user;"
```

### 9. Firewall Ayarları
```bash
# Firewalld (Alma Linux default)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --permanent --add-port=8090/tcp
sudo firewall-cmd --reload
```

### 10. Kodu Sunucuya Çekme
```bash
# Deploy kullanıcısı oluştur
useradd -m -s /bin/bash deploy
usermod -aG wheel deploy

# Deploy kullanıcısına geç
su - deploy

# Git kurulumu (root olarak önce yap)
# sudo dnf install -y git

# Kodu çek
cd ~
git clone https://github.com/hunkarylmaz/paketci-app.git
cd paketci-app/kurye-sistemi/backend

# .env dosyası oluştur
cp .env.example .env
nano .env
```

**.env içeriği:**
```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://paketciniz.com

DB_HOST=localhost
DB_PORT=5432
DB_USER=kurye_user
DB_PASS=KuryeDB_2024!
DB_NAME=kurye_db

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=paketciniz-super-secret-$(openssl rand -base64 32)
JWT_EXPIRATION=7d
```

### 11. Uygulamayı Başlatma
```bash
cd ~/paketci-app/kurye-sistemi/backend

# Bağımlılıkları kur
npm install

# Build
npm run build

# Veritabanı migrasyonu (varsa)
npm run migration:run

# Kullanıcıları oluştur
npm run seed:users

# PM2 ile başlat
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 12. Frontend Kurulumu
```bash
cd ~/paketci-app/kurye-sistemi/frontend

# Bağımlılıkları kur
npm install

# Build
npm run build

# PM2 ile başlat
pm2 start npm --name "paketci-frontend" -- start
```

## 🔍 Kontrol Listesi

- [ ] CyberPanel'e giriş yapıldı
- [ ] Ana domain (paketciniz.com) oluşturuldu
- [ ] Tüm subdomainler oluşturuldu
- [ ] SSL sertifikaları aktif
- [ ] DNS A kayıtları yapıldı
- [ ] Nginx reverse proxy ayarlandı
- [ ] Node.js 20 kuruldu
- [ ] PostgreSQL kuruldu
- [ ] Redis kuruldu
- [ ] Firewall portları açıldı
- [ ] Kod sunucuya çekildi
- [ ] .env dosyası yapılandırıldı
- [ ] Backend build edildi
- [ ] Kullanıcılar oluşturuldu
- [ ] PM2 ile başlatıldı
- [ ] Frontend build edildi
- [ ] Test: https://api.paketciniz.com/health

## 🆘 Hata Ayıklama

**Port kullanımdaysa:**
```bash
sudo lsof -i :3000
sudo kill -9 PID
```

**Nginx yeniden yükle:**
```bash
sudo systemctl restart nginx
# veya CyberPanel üzerinden restart
```

**Logları kontrol et:**
```bash
# Backend logs
pm2 logs paketci-api

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 📞 Önemli Bağlantılar

- **CyberPanel**: https://185.153.220.170:8090
- **Ana Site**: https://paketciniz.com
- **API**: https://api.paketciniz.com
- **Admin**: https://portal.paketciniz.com
