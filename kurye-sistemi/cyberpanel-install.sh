#!/bin/bash
# CyberPanel VDS - Hızlı Kurulum Scripti
# Alma Linux 9 için

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║     🚀 Paketci App - Alma Linux 9 Kurulumu             ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Root kontrol
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Root yetkisi gerekli${NC}"
    exit 1
fi

IP_ADDRESS=$(curl -s ifconfig.me)
echo -e "${GREEN}Sunucu IP: $IP_ADDRESS${NC}"
echo ""

echo -e "${BLUE}1. Sistem güncelleniyor...${NC}"
dnf update -y

echo -e "${BLUE}2. Gerekli paketler kuruluyor...${NC}"
dnf install -y git wget curl vim htop

echo -e "${BLUE}3. Node.js 20 LTS kuruluyor...${NC}"
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

echo -e "${GREEN}✓ Node.js $(node -v) kuruldu${NC}"

echo -e "${BLUE}4. PM2 kuruluyor...${NC}"
npm install -g pm2
echo -e "${GREEN}✓ PM2 kuruldu${NC}"

echo -e "${BLUE}5. PostgreSQL kuruluyor...${NC}"
dnf install -y postgresql-server postgresql-contrib
postgresql-setup --initdb
systemctl enable postgresql
systemctl start postgresql

echo -e "${BLUE}6. Redis kuruluyor...${NC}"
dnf install -y redis
systemctl enable redis
systemctl start redis
echo -e "${GREEN}✓ Redis kuruldu${NC}"

echo -e "${BLUE}7. Veritabanı oluşturuluyor...${NC}"
sudo -u postgres psql -c "CREATE DATABASE kurye_db;" 2>/dev/null || echo -e "${YELLOW}⚠ Veritabanı zaten var${NC}"
sudo -u postgres psql -c "CREATE USER kurye_user WITH PASSWORD 'KuryeDB_2024!';" 2>/dev/null || echo -e "${YELLOW}⚠ Kullanıcı zaten var${NC}"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kurye_db TO kurye_user;"
sudo -u postgres psql -c "ALTER USER kurye_user WITH SUPERUSER;"
echo -e "${GREEN}✓ PostgreSQL yapılandırıldı${NC}"

echo -e "${BLUE}8. Deploy kullanıcısı oluşturuluyor...${NC}"
useradd -m -s /bin/bash deploy 2>/dev/null || echo -e "${YELLOW}⚠ Kullanıcı zaten var${NC}"
usermod -aG wheel deploy
echo -e "${GREEN}✓ Deploy kullanıcısı hazır${NC}"

echo -e "${BLUE}9. Firewall ayarları yapılıyor...${NC}"
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=3001/tcp
firewall-cmd --reload
echo -e "${GREEN}✓ Firewall yapılandırıldı${NC}"

echo -e "${BLUE}10. Upload dizini oluşturuluyor...${NC}"
mkdir -p /home/deploy/uploads
chown deploy:deploy /home/deploy/uploads
chmod 755 /home/deploy/uploads

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║           ✅ Sistem Hazır!                             ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Sonraki Adımlar:${NC}"
echo "─────────────────────────────────────────────────────────"
echo ""
echo "1️⃣  Deploy kullanıcısına geç:"
echo "    su - deploy"
echo ""
echo "2️⃣  Kodu çek:"
echo "    git clone https://github.com/hunkarylmaz/paketci-app.git"
echo "    cd paketci-app/kurye-sistemi/backend"
echo ""
echo "3️⃣  .env dosyası oluştur:"
echo "    cp .env.example .env"
echo "    nano .env"
echo ""
echo "4️⃣  Backend'i kur:"
echo "    npm install"
echo "    npm run build"
echo "    npm run seed:users"
echo "    pm2 start ecosystem.config.js"
echo ""
echo "5️⃣  Frontend'i kur:"
echo "    cd ../frontend"
echo "    npm install"
echo "    npm run build"
echo "    pm2 start npm --name paketci-frontend -- start"
echo ""
echo "─────────────────────────────────────────────────────────"
echo ""
echo -e "${BLUE}CyberPanel:${NC} https://$IP_ADDRESS:8090"
echo -e "${BLUE}Kullanıcı:${NC} admin"
echo -e "${BLUE}Şifre:${NC} wE%XrNSfb7"
echo ""
echo -e "${YELLOW}DNS Ayarlarını Domain Sağlayıcınızda Yapın:${NC}"
echo "A     paketciniz.com         → $IP_ADDRESS"
echo "A     api.paketciniz.com     → $IP_ADDRESS"
echo "A     portal.paketciniz.com  → $IP_ADDRESS"
echo "A     paketci.paketciniz.com → $IP_ADDRESS"
echo "A     partner.paketciniz.com → $IP_ADDRESS"
echo "A     mobil.paketciniz.com   → $IP_ADDRESS"
echo ""
