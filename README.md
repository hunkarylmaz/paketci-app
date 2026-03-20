# 🚚 Paketçi - Kurye Yönetim Sistemi

B2B Kurye Operasyon Platformu - Kontör Sistemli

## 🎯 Özellikler

- ✅ **Multi-tenant Bayi Sistemi** - Her kurye şirketi kendi panelini kullanır
- ✅ **Kontör Yönetimi** - Her teslimat başına 2.5 TL otomatik düşüm
- ✅ **Canlı Harita Takibi** - Kurye ve restoranların gerçek zamanlı konumu
- ✅ **Raporlama** - Detaylı teslimat ve hakediş raporları
- ✅ **Restoran Yönetimi** - Çalışma saatleri ve özel ayarlar
- ✅ **Kurye Uygulaması** - Mobil uyumlu kurye arayüzü
- ✅ **SSL + Güvenlik** - Otomatik Let's Encrypt entegrasyonu

## 🏗️ Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + TypeORM |
| Cache | Redis |
| Frontend | Next.js 14 + Tailwind CSS |
| Harita | Leaflet / OpenStreetMap |
| Server | Docker + Nginx |
| SSL | Let's Encrypt |

## 📁 Proje Yapısı

```
kurye-sistemi/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── companies/
│   │   │   ├── couriers/
│   │   │   ├── deliveries/
│   │   │   ├── credits/
│   │   │   └── ...
│   └── Dockerfile
├── frontend/         # Next.js App
│   ├── app/
│   ├── components/
│   └── Dockerfile
├── nginx/            # Reverse Proxy
├── docker-compose.yml
└── deploy.sh
```

## 🚀 Hızlı Başlangıç

```bash
# 1. Gerekli yazılımları kur
curl -fsSL https://get.docker.com | sh

# 2. Projeyi indir
git clone https://github.com/yourrepo/kurye-sistemi.git
cd kurye-sistemi

# 3. Deploy scriptini çalıştır
./deploy.sh bayi.sirketiniz.com admin@email.com
```

## 💳 Kontör Sistemi

```
Kontör Bakiyesi: 948 TL
Teslimat Ücreti: 2.5 TL/adet
Kalan Teslimat: 379 adet

Otomatik İşlemler:
- Yeni sipariş → -2.5 TL
- İptal edilen → +2.5 TL (iade)
- Bakiye < 2.5 → Sipariş oluşturulamaz
```

## 📊 API Endpoints

| Endpoint | Açıklama |
|----------|----------|
| `POST /auth/login` | Giriş yap |
| `GET /deliveries` | Teslimat listesi |
| `POST /deliveries` | Yeni teslimat (kontör düşer) |
| `GET /credits/balance` | Bakiye sorgula |
| `GET /couriers` | Kurye listesi |

## 📝 Lisans

MIT License - © 2026 Kurye Sistem
