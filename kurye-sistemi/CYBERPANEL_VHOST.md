# CyberPanel vHost Konfigürasyonları
# /usr/local/lsws/conf/vhosts/{domain}/vhost.conf

# ============================================
# 1. paketciniz.com (Ana Site - Frontend)
# ============================================
# Dosya: /usr/local/lsws/conf/vhosts/paketciniz.com/vhost.conf

extprocessor nodejs3000 {
  type                    proxy
  address                 127.0.0.1:3000
  maxConns                200
  initTimeout             60
  retryTimeout            0
  pcKeepAliveTimeout      60
}

context / {
  type                    proxy
  handler                 nodejs3000
  addDefaultCharset       off
}

# ============================================
# 2. api.paketciniz.com (Backend API)
# ============================================
# Dosya: /usr/local/lsws/conf/vhosts/api.paketciniz.com/vhost.conf

extprocessor nodejs3001 {
  type                    proxy
  address                 127.0.0.1:3001
  maxConns                300
  initTimeout             60
  retryTimeout            0
  pcKeepAliveTimeout      60
}

context / {
  type                    proxy
  handler                 nodejs3001
  addDefaultCharset       off
}

# WebSocket desteği için
context /socket.io/ {
  type                    proxy
  handler                 nodejs3001
  addDefaultCharset       off
}

# ============================================
# 3. portal.paketciniz.com (Admin)
# ============================================
extprocessor nodejs3000 {
  type                    proxy
  address                 127.0.0.1:3000
  maxConns                100
  initTimeout             60
}

context / {
  type                    proxy
  handler                 nodejs3000
}

# ============================================
# 4. paketci.paketciniz.com (Dealer/Bayi)
# ============================================
extprocessor nodejs3000 {
  type                    proxy
  address                 127.0.0.1:3000
  maxConns                100
  initTimeout             60
}

context / {
  type                    proxy
  handler                 nodejs3000
}

# ============================================
# 5. partner.paketciniz.com (Restaurant)
# ============================================
extprocessor nodejs3000 {
  type                    proxy
  address                 127.0.0.1:3000
  maxConns                100
  initTimeout             60
}

context / {
  type                    proxy
  handler                 nodejs3000
}

# ============================================
# 6. mobil.paketciniz.com (Courier)
# ============================================
extprocessor nodejs3000 {
  type                    proxy
  address                 127.0.0.1:3000
  maxConns                200
  initTimeout             60
}

context / {
  type                    proxy
  handler                 nodejs3000
}

# ============================================
# 7. Diğer Subdomainler (Aynı Yapı)
# ============================================
# saha.paketciniz.com
# muhasebe.paketciniz.com
# operasyon.paketciniz.com

# Hepsi için aynı nodejs3000 kullanılabilir

# ============================================
# SSL Ayarları (CyberPanel Otomatik Yapıyor)
# ============================================
# Let's Encrypt SSL otomatik kurulur

# ============================================
# Hızlı Kurulum Komutları
# ============================================

# CyberPanel'de manuel olarak yapılacaklar:

# 1. Websites > Create Website
#    - Domain: paketciniz.com
#    - Package: Default
#    - Owner: admin
#    - PHP: 8.1
#    - SSL: ✅
#    - Create

# 2. Her subdomain için tekrar:
#    - api.paketciniz.com
#    - portal.paketciniz.com
#    - paketci.paketciniz.com
#    - partner.paketciniz.com
#    - mobil.paketciniz.com
#    - saha.paketciniz.com
#    - muhasebe.paketciniz.com
#    - operasyon.paketciniz.com

# 3. SSH ile vhost düzenleme:
#    nano /usr/local/lsws/conf/vhosts/paketciniz.com/vhost.conf

# 4. Yukarıdaki context bloğunu ekle

# 5. LiteSpeed yeniden başlat:
#    systemctl restart lsws

# ============================================
# Alternatif: SSH ile Tümünü Otomatik Kur
# ============================================

# domain_ekle.sh scripti:
#!/bin/bash
# DOMAIN=$1
# cyberpanel createWebsite --package Default --owner admin --domainName $DOMAIN --email admin@$DOMAIN --php 8.1
