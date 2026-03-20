#!/bin/bash

# Paketci App - Sunucu Kurulum Scripti
# Kullanım: ./install.sh

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║           🚀 Paketci App Kurulum Scripti                   ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Domain
DOMAIN="paketciniz.com"

echo -e "${BLUE}1. Sistem güncelleniyor...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${BLUE}2. Gerekli paketler kuruluyor...${NC}"
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx \
    postgresql postgresql-contrib redis-server htop ufw fail2ban

# Node.js 20 LTS
echo -e "${BLUE}3. Node.js 20 LTS kuruluyor...${NC}"
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" != "20" ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo -e "${GREEN}✓ Node.js $(node -v) kuruldu${NC}"

# Docker
echo -e "${BLUE}4. Docker kuruluyor...${NC}"
if ! command -v docker &> /dev/null; then
    sudo apt install -y docker.io docker-compose
    sudo systemctl enable docker
    sudo systemctl start docker
fi
echo -e "${GREEN}✓ Docker kuruldu${NC}"

# PM2
echo -e "${BLUE}5. PM2 kuruluyor...${NC}"
sudo npm install -g pm2
echo -e "${GREEN}✓ PM2 kuruldu${NC}"

# Deploy kullanıcısı
echo -e "${BLUE}6. Deploy kullanıcısı oluşturuluyor...${NC}"
if ! id "deploy" &>/dev/null; then
    sudo useradd -m -s /bin/bash deploy
    sudo usermod -aG sudo deploy
    sudo usermod -aG docker deploy
    echo -e "${GREEN}✓ Deploy kullanıcısı oluşturuldu${NC}"
else
    echo -e "${YELLOW}⚠ Deploy kullanıcısı zaten var${NC}"
fi

# PostgreSQL
echo -e "${BLUE}7. PostgreSQL yapılandırılıyor...${NC}"
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Veritabanı oluştur
sudo -u postgres psql -c "CREATE DATABASE kurye_db;" 2>/dev/null || echo -e "${YELLOW}⚠ Veritabanı zaten var${NC}"
sudo -u postgres psql -c "CREATE USER kurye_user WITH PASSWORD 'KuryeDB_2024!';" 2>/dev/null || echo -e "${YELLOW}⚠ Kullanıcı zaten var${NC}"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kurye_db TO kurye_user;"

echo -e "${GREEN}✓ PostgreSQL yapılandırıldı${NC}"

# Redis
echo -e "${BLUE}8. Redis yapılandırılıyor...${NC}"
sudo systemctl enable redis-server
sudo systemctl start redis-server
echo -e "${GREEN}✓ Redis yapılandırıldı${NC}"

# Nginx
echo -e "${BLUE}9. Nginx yapılandırılıyor...${NC}"
sudo systemctl enable nginx
sudo systemctl start nginx

# Nginx yapılandırma dosyası
sudo tee /etc/nginx/sites-available/paketciniz.com > /dev/null <<EOF
server {
    listen 80;
    server_name paketciniz.com www.paketciniz.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name paketciniz.com www.paketciniz.com;

    ssl_certificate /etc/letsencrypt/live/paketciniz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paketciniz.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# API
server {
    listen 443 ssl http2;
    server_name api.paketciniz.com;

    ssl_certificate /etc/letsencrypt/live/paketciniz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paketciniz.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# Admin Portal
server {
    listen 443 ssl http2;
    server_name portal.paketciniz.com;

    ssl_certificate /etc/letsencrypt/live/paketciniz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paketciniz.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}

# Paketci (Bayi)
server {
    listen 443 ssl http2;
    server_name paketci.paketciniz.com;

    ssl_certificate /etc/letsencrypt/live/paketciniz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paketciniz.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}

# Partner (Restoran)
server {
    listen 443 ssl http2;
    server_name partner.paketciniz.com;

    ssl_certificate /etc/letsencrypt/live/paketciniz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paketciniz.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}

# Mobil (Kurye)
server {
    listen 443 ssl http2;
    server_name mobil.paketciniz.com;

    ssl_certificate /etc/letsencrypt/live/paketciniz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paketciniz.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}

# Saha Satış
server {
    listen 443 ssl http2;
    server_name saha.paketciniz.com;

    ssl_certificate /etc/letsencrypt/live/paketciniz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paketciniz.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}

# Muhasebe
server {
    listen 443 ssl http2;
    server_name muhasebe.paketciniz.com;

    ssl_certificate /etc/letsencrypt/live/paketciniz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paketciniz.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}

# Operasyon
server {
    listen 443 ssl http2;
    server_name operasyon.paketciniz.com;

    ssl_certificate /etc/letsencrypt/live/paketciniz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paketciniz.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/paketciniz.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo -e "${GREEN}✓ Nginx yapılandırıldı${NC}"

# Güvenlik duvarı
echo -e "${BLUE}10. Güvenlik duvarı yapılandırılıyor...${NC}"
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw --force enable
echo -e "${GREEN}✓ UFW etkinleştirildi${NC}"

# Fail2ban
echo -e "${BLUE}11. Fail2ban yapılandırılıyor...${NC}"
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
echo -e "${GREEN}✓ Fail2ban etkinleştirildi${NC}"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║           ✅ Kurulum Tamamlandı!                           ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Sistem Hazır!${NC}"
echo ""
echo "📋 Sonraki Adımlar:"
echo "─────────────────────────────────────────────────────────────"
echo "1. SSL Sertifikası alın:"
echo "   sudo certbot --nginx -d paketciniz.com -d api.paketciniz.com \\"
echo "       -d portal.paketciniz.com -d paketci.paketciniz.com \\"
echo "       -d partner.paketciniz.com -d mobil.paketciniz.com \\"
echo "       -d saha.paketciniz.com -d muhasebe.paketciniz.com \\"
echo "       -d operasyon.paketciniz.com"
echo ""
echo "2. Kodu deploy kullanıcısı ile çekin:"
echo "   sudo su - deploy"
echo "   git clone https://github.com/hunkarylmaz/paketci-app.git"
echo ""
echo "3. .env dosyasını oluşturun ve veritabanı bilgilerini girin"
echo ""
echo "4. Uygulamayı başlatın:"
echo "   cd paketci-app/kurye-sistemi/backend"
echo "   npm install"
echo "   npm run build"
echo "   npm run seed:users  # Varsayılan kullanıcıları oluştur"
echo "   pm2 start ecosystem.config.js"
echo ""
echo "5. DNS Kayıtlarını ekleyin:"
echo "   A paketciniz.com     → SUNUCU_IP"
echo "   A api.paketciniz.com → SUNUCU_IP"
echo "   A portal.paketciniz.com → SUNUCU_IP"
echo "   A paketci.paketciniz.com → SUNUCU_IP"
echo "   A partner.paketciniz.com → SUNUCU_IP"
echo "   A mobil.paketciniz.com → SUNUCU_IP"
echo "   ..."
echo "─────────────────────────────────────────────────────────────"
echo ""
