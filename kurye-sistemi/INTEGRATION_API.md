# Platform API Entegrasyonları

## 🚀 Platformların API Bilgileri Nasıl Alınır

### 1. Yemeksepeti

**Başvuru:** https://partner.yemeksepeti.com

**Gerekli Bilgiler:**
- **API Key**: Partner panelinden alınır
- **API Secret**: Partner panelinden alınır  
- **Merchant ID**: Restoranınıza özel ID
- **Branch ID**: Şube ID'si

**Adımlar:**
1. Yemeksepeti Partner Portal'a başvurun
2. Entegrasyon bölümünden API erişimi talep edin
3. API Key ve Secret bilgilerini alın
4. Webhook URL'nizi bildirin

### 2. Getir Yemek / Getir Çarşı

**Başvuru:** https://partner.getir.com

**Gerekli Bilgiler:**
- **API Key**: Getir Partner API anahtarı
- **Restaurant ID**: Restoran ID'niz

**Adımlar:**
1. Getir Partner olmak için başvuru yapın
2. Onaylandıktan sonra API sekmesinden bilgileri alın
3. Webhook URL tanımlayın

### 3. Migros Yemek

**Başvuru:** https://migrosonline.com.tr/yemek/partner

**Gerekli Bilgiler:**
- **Client ID**: API istemci ID
- **Client Secret**: API gizli anahtar
- **Merchant ID**: Satıcı ID

### 4. Trendyol Yemek

**Başvuru:** https://trendyol.com/go/restoran-basvuru

**Gerekli Bilgiler:**
- **API Key**: Trendyol API anahtarı
- **API Secret**: Trendyol API şifresi
- **Seller ID**: Satıcı ID

---

## 🔌 API Endpoint'leri

### Platform Konfigürasyonu

```http
POST /api/integrations/restaurants/{restaurantId}/platforms
Content-Type: application/json

{
  "platformId": "uuid-of-platform",
  "apiKey": "your-api-key",
  "apiSecret": "your-api-secret",
  "merchantId": "merchant-id",
  "branchId": "branch-id",
  "webhookUrl": "https://your-domain.com/webhooks/yemeksepeti"
}
```

### Platform Aç/Kapa

```http
PUT /api/integrations/restaurants/{restaurantId}/platforms/{platformId}/status
Content-Type: application/json

{
  "isOpen": true,
  "autoAcceptOrders": false
}
```

### Siparişleri Senkronize Et

```http
POST /api/integrations/restaurants/{restaurantId}/platforms/{platformId}/sync
```

### Sipariş Kabul Et

```http
POST /api/integrations/restaurants/{restaurantId}/platforms/{platformId}/orders/{orderId}/accept
```

---

## 🔐 Güvenlik

- Tüm API anahtarları **şifrelenmiş** olarak saklanır
- Token'lar otomatik olarak yenilenir
- Webhook'lar imza doğrulaması ile korunur
- API çağrıları rate limiting ile sınırlıdır

---

## 📋 Veritabanı Yapısı

```sql
-- Platform Tanımları
CREATE TABLE platform_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_type VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  api_base_url VARCHAR(255),
  default_commission_rate DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restoran-Platform Konfigürasyonu
CREATE TABLE restaurant_platform_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  platform_id UUID REFERENCES platform_integrations(id),
  api_key TEXT,
  api_secret TEXT,
  merchant_id VARCHAR(100),
  branch_id VARCHAR(100),
  access_token TEXT,
  status VARCHAR(20) DEFAULT 'pending_setup',
  is_open BOOLEAN DEFAULT false,
  auto_accept_orders BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔄 Webhook Entegrasyonu

Platformlar webhook gönderdiğinde:

```typescript
// Webhook Handler
@Post('webhooks/:platformType')
async handleWebhook(
  @Param('platformType') platformType: string,
  @Body() payload: any,
  @Headers('x-signature') signature: string,
) {
  // 1. İmza doğrulama
  // 2. Sipariş oluştur/güncelle
  // 3. Bildirim gönder
}
```

Webhook URL formatı: `https://your-domain.com/api/webhooks/{platformType}`
