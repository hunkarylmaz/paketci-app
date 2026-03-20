# 🚀 Kurye Yönetim Sistemi - Deployment Rehberi

## Sistem Gereksinimleri

- Ubuntu 20.04+ / Debian 11+
- 2 CPU Core
- 4GB RAM
- 20GB Disk
- Public IP
- Domain (örn: bayi.sirketiniz.com)

## Hızlı Kurulum (Tek Komut)

```bash
# Sunucunuza SSH ile bağlanın
curl -fsSL https://raw.githubusercontent.com/yourrepo/kurye-sistemi/main/deploy.sh | bash -s bayi.sirketiniz.com admin@email.com
```

## Manuel Kurulum

### 1. Sunucu Hazırlığı

```bash
# Sistemi güncelle
sudo apt update && sudo apt upgrade -y

# Docker kur
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker

# Firewall ayarları
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Proje Kurulumu

```bash
# Projeyi indir
git clone https://github.com/yourrepo/kurye-sistemi.git
cd kurye-sistemi

# Ortam değişkenlerini ayarla
cp .env.example .env
nano .env
```

`.env` dosyası:
```env
DB_USER=kurye_user
DB_PASS=guclu_sifre_123
DB_NAME=kurye_db
JWT_SECRET=cok_gizli_anahtar_123
```

### 3. SSL Sertifikası

```bash
# Certbot kur
sudo apt install -y certbot

# Sertifika al
sudo certbot certonly --standalone -d bayi.sirketiniz.com
```

### 4. Uygulamayı Başlat

```bash
# Container'ları derle ve başlat
docker-compose up -d --build

# Logları izle
docker-compose logs -f
```

### 5. İlk Kurulum

```bash
# Admin kullanıcısı oluştur
docker-compose exec backend npm run seed:admin
```

Varsayılan admin:
- Email: admin@paketci.app
- Şifre: admin123

## Güncelleme

```bash
cd kurye-sistemi
git pull
docker-compose down
docker-compose up -d --build
```

## Yedekleme

```bash
# Database yedekle
docker-compose exec postgres pg_dump -U kurye_user kurye_db > backup_$(date +%Y%m%d).sql

# Uploads klasörünü yedekle
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/
```

## Monitoring

```bash
# Container durumları
docker-compose ps

# Kaynak kullanımı
docker stats

# Log görüntüleme
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

## Sorun Giderme

### 502 Bad Gateway
```bash
# Backend'in çalıştığından emin olun
docker-compose restart backend
```

### SSL Hatası
```bash
# Sertifikayı yenile
sudo certbot renew
docker-compose restart nginx
```

### Database Bağlantı Hatası
```bash
# Database'i yeniden başlat
docker-compose restart postgres
```

## Domain DNS Ayarları

| Tip | Host | Değer |
|-----|------|-------|
| A | @ | Sunucu IP Adresi |
| A | www | Sunucu IP Adresi |

## 📞 Destek

Teknik destek için: destek@paketci.app
