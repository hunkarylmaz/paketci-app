#!/bin/bash

# Deployment script for Kurye Management System
# Usage: ./deploy.sh your-domain.com

DOMAIN=${1:-"bayi.yourdomain.com"}
EMAIL=${2:-"admin@yourdomain.com"}

echo "🚀 Kurye Yönetim Sistemi Deployment"
echo "=================================="
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""

# Update system
echo "📦 Updating system..."
apt-get update && apt-get upgrade -y

# Install Docker if not exists
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Create environment file
echo "⚙️  Creating environment file..."
cat > .env << EOF
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=kurye_user
DB_PASS=$(openssl rand -base64 32)
DB_NAME=kurye_db

# JWT
JWT_SECRET=$(openssl rand -base64 64)

# App
API_URL=https://$DOMAIN/api
NODE_ENV=production
EOF

echo "✅ Environment file created!"
echo ""

# Update nginx config with domain
echo "🔧 Updating nginx configuration..."
sed -i "s/bayi.yourdomain.com/$DOMAIN/g" nginx/conf.d/default.conf

# Build and start services
echo "🏗️  Building services..."
docker-compose build --no-cache

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 30

# Install Certbot for SSL
echo "🔒 Setting up SSL certificate..."
apt-get install -y certbot

# Get SSL certificate
docker run -it --rm \
    -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
    -v "$(pwd)/certbot/www:/var/www/certbot" \
    -p 80:80 \
    certbot/certbot certonly \
    --standalone \
    --preferred-challenges http \
    --agree-tos \
    --email $EMAIL \
    -d $DOMAIN

# Reload nginx
docker-compose exec nginx nginx -s reload

# Create admin user
echo "👤 Creating admin user..."
docker-compose exec backend npm run seed:admin

echo ""
echo "✅ Deployment completed!"
echo "=================================="
echo "🌐 Website: https://$DOMAIN"
echo "🔑 Admin Panel: https://$DOMAIN"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Restart: docker-compose restart"
echo "   Update: docker-compose pull && docker-compose up -d"
echo ""
echo "⚠️  Don't forget to:"
echo "   1. Update DNS A record to point to this server"
echo "   2. Configure firewall (ufw allow 80,443)"
echo "   3. Set up automated backups"
