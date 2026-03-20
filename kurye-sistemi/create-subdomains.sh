#!/bin/bash
# Subdomain oluşturma scripti - CyberPanel
# Alma Linux 9 / CyberPanel VDS

echo "🚀 Paketci App Subdomain Kurulumu Başlıyor..."
echo ""

# Ana domain
echo "📦 paketciniz.com oluşturuluyor..."
cyberpanel createWebsite --package Default --owner admin --domainName paketciniz.com --email admin@paketciniz.com --php 8.1

# Subdomainler
echo "📦 api.paketciniz.com oluşturuluyor..."
cyberpanel createWebsite --package Default --owner admin --domainName api.paketciniz.com --email admin@paketciniz.com --php 8.1

echo "📦 portal.paketciniz.com oluşturuluyor..."
cyberpanel createWebsite --package Default --owner admin --domainName portal.paketciniz.com --email admin@paketciniz.com --php 8.1

echo "📦 paketci.paketciniz.com oluşturuluyor..."
cyberpanel createWebsite --package Default --owner admin --domainName paketci.paketciniz.com --email admin@paketciniz.com --php 8.1

echo "📦 partner.paketciniz.com oluşturuluyor..."
cyberpanel createWebsite --package Default --owner admin --domainName partner.paketciniz.com --email admin@paketciniz.com --php 8.1

echo "📦 mobil.paketciniz.com oluşturuluyor..."
cyberpanel createWebsite --package Default --owner admin --domainName mobil.paketciniz.com --email admin@paketciniz.com --php 8.1

echo "📦 saha.paketciniz.com oluşturuluyor..."
cyberpanel createWebsite --package Default --owner admin --domainName saha.paketciniz.com --email admin@paketciniz.com --php 8.1

echo "📦 muhasebe.paketciniz.com oluşturuluyor..."
cyberpanel createWebsite --package Default --owner admin --domainName muhasebe.paketciniz.com --email admin@paketciniz.com --php 8.1

echo "📦 operasyon.paketciniz.com oluşturuluyor..."
cyberpanel createWebsite --package Default --owner admin --domainName operasyon.paketciniz.com --email admin@paketciniz.com --php 8.1

echo ""
echo "🔒 SSL Sertifikaları alınıyor..."
cyberpanel issueSSL --domainName paketciniz.com
cyberpanel issueSSL --domainName api.paketciniz.com
cyberpanel issueSSL --domainName portal.paketciniz.com
cyberpanel issueSSL --domainName paketci.paketciniz.com
cyberpanel issueSSL --domainName partner.paketciniz.com
cyberpanel issueSSL --domainName mobil.paketciniz.com
cyberpanel issueSSL --domainName saha.paketciniz.com
cyberpanel issueSSL --domainName muhasebe.paketciniz.com
cyberpanel issueSSL --domainName operasyon.paketciniz.com

echo ""
echo "🔄 LiteSpeed yeniden başlatılıyor..."
systemctl restart lsws

echo ""
echo "✅ Tüm subdomainler oluşturuldu!"
echo ""
echo "📋 Oluşturulan Domainler:"
echo "  - paketciniz.com"
echo "  - api.paketciniz.com"
echo "  - portal.paketciniz.com"
echo "  - paketci.paketciniz.com"
echo "  - partner.paketciniz.com"
echo "  - mobil.paketciniz.com"
echo "  - saha.paketciniz.com"
echo "  - muhasebe.paketciniz.com"
echo "  - operasyon.paketciniz.com"
echo ""
echo "➡️ Şimdi DNS A kayıtlarını ekle:"
echo "   A paketciniz.com → 185.153.220.170"
echo "   A api → 185.153.220.170"
echo "   ... (diğerleri için alan adı yönetiminden CNAME veya A kaydı)"
