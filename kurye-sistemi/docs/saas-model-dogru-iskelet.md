# 🚀 PAKETÇİ - SaaS (Yazılım Hizmeti) Modeli

## 💡 İŞ MODELİ

**Paketçi = Yazılım Platformu Sağlayıcısı**

Paketçi, bayilere **kurye yönetim yazılımı** kiralar. Bayiler kendi markalarıyla, kendi kuryeleriyle, kendi restoranlarıyla çalışırlar.

---

## 💰 GELİR MODELİ: Paket Kontör Sistemi

```
PAKETÇİ (Yazılım Şirketi)
         │
         │ 📦 "Paket Kontörü" satar
         │ (Örn: 1000 paket = ₺5000)
         ▼
    ┌────────────┐
    │    BAYİ    │  ← Kendi markasıyla çalışır
    │  (Dealer)  │    Örn: "Hızlı Kurye A.Ş."
    └─────┬──────┘
          │
          │ Bayi restoranlardan alır:
          │ • Paket başı ücret (₺35)
          │ • Restoran kendi kuryelerine öder
          │ • Aradaki fark = BAYİ KÂRI
          ▼
    ┌────────────┐     ┌────────────┐
    │ RESTORAN   │────▶│  KURYE     │
    │ (Müşteri)  │     │ (Çalışan)  │
    └────────────┘     └────────────┘
```

### Paket Kontör Örneği:
```
Paketçi Satış Fiyatı:     1000 paket = ₺5.000
                          (Paket başı ₺5)

Bayi Alış Fiyatı:         ₺5/paket
Bayi Satış Fiyatı:        ₺35/paket (Restorana)
─────────────────────────────────────────────
Bayi Kârı:                ₺30/paket

1000 paket satarsa:
  Gelir:  1000 × ₺35 = ₺35.000
  Maliyet:     ₺5.000 (Paketçi'ye)
  ─────────────────────────────────
  NET KÂR:              ₺30.000
```

---

## 👥 ROLLER ve YETKİLER (Güncel)

### 1️⃣ PAKETÇİ (SaaS Sağlayıcı)

**Kimdir?**
- Yazılım şirketi
- Platformu geliştirir ve işletir
- Teknik destek sağlar

**Ne Yapar?**
```
✅ BAYİ yönetimi (CRUD)
   • Bayi ekleme
   • Bayi düzenleme
   • Bayi silme/pasifleme
   
✅ RESTORAN yönetimi
   • Restoran ekleme (BAYİ'ye atama yaparak)
   • Restoran düzenleme
   • Restoran silme
   
✅ KURYE yönetimi
   • Kurye ekleme (BAYİ'ye atama yaparak)
   • Kurye düzenme
   • Kurye silme
   
✅ PAKET KONTÖR satışı
   • Kontör paketleri oluşturma
   • Bayi bakiyesi yükleme
   • Kontör kullanım raporları
   
✅ SİSTEM YÖNETİMİ (Süper Admin yetkileri)
   • Tüm operasyonu görme (izleme modu)
   • Gerekirse müdahale etme
   • Fiyatlandırma ayarları (kontör fiyatları)
   • Sistem ayarları
   • Global raporlar
   
✅ TEKNİK DESTEK
   • Yazılım güncellemeleri
   • Hata düzeltmeleri
   • Bayi eğitimleri
```

**Ne Yapmaz?**
```
❌ Kurye ücretlerine karışmaz
❌ Restoran ödemelerine karışmaz
❌ Bayi iç işleyişine karışmaz
❌ Komisyon almaz (sadece kontör satar)
```

---

### 2️⃣ BAYİ (Bağımsız Operatör)

**Kimdir?**
- Paketçi yazılımını kullanan bağımsız işletme
- Kendi markasıyla çalışır
- Örn: "Hızlı Kurye A.Ş.", "İstanbul Express"

**Ne Yapar?**
```
✅ KENDİ MARKASIYLA çalışır
   • Kendi logosu
   • Kendi domaini (opsiyonel)
   • Kendi sözleşmeleri
   
✅ RESTORAN yönetimi
   • Restoran sözleşmeleri yapar
   • Restoran fiyatlandırması belirler (₺35/paket vb.)
   • Restoran ekler/çıkarır
   
✅ KURYE yönetimi
   • Kurye istihdam eder
   • Kurye maaş/ücretini belirler
   • Kurye vardiyalarını yönetir
   
✅ FİYATLANDIRMA
   • Restorana satış fiyatı: ₺X (örn: 35₺)
   • Kurye maliyeti: ₺Y (örn: 25₺)
   • ARA KÂR: ₺X - ₺Y = Bayi kârı
   
✅ ÖDEME YÖNETİMİ
   • Restoranlardan tahsilat yapar
   • Kuryelere ödeme yapar
   • Paketçi'ye kontör ücreti öder
   
✅ OPERASYONEL KARARLAR
   • Hangi restoranla çalışılacak?
   • Hangi kurye ne kadar alacak?
   • Bölge/strateji kararları
```

**Paketçi ile İlişkisi:**
```
Paketçi'den aldığı:         Yazılım hizmeti
Paketçi'ye ödediği:         Paket kontör bedeli
Bağımsızlığı:               TAM BAĞIMSIZ
Markası:                    KENDİ MARKASI
```

---

### 3️⃣ RESTORAN (Bayi'nin Müşterisi)

**Kimdir?**
- Bayi'nin kurye hizmeti aldığı işletme
- Örn: "Ateş Döner", "Burger King"

**Ne Yapar?**
```
✅ BAYİ ile sözleşme yapar
✅ Paket başı ücret öder (örn: ₺35)
   • Haftalık/aylık ödeme
   • Veya kontör sistemi
✅ Siparişlerini sisteme girer
✅ Kurye performansını değerlendirir
```

**Kime Bağlı?** SADECE BAYİ'ye

---

### 4️⃣ KURYE (Bayi'nin Çalışanı)

**Kimdir?**
- Bayi bünyesinde çalışan teslimat personeli
- Bayi ile çalışma sözleşmesi vardır

**Ne Yapar?**
```
✅ BAYİ için çalışır
✅ Paket teslimatı yapar
✅ Bayi'den ücret alır (₺X/paket veya maaş)
✅ Sistem üzerinden sipariş görür/takip eder
```

**Kime Bağlı?** SADECE BAYİ'ye (işveren)

---

## 🗄️ VERİTABANI YAPISI (Güncel)

```
┌─────────────────────────────────────────────────────┐
│              PAKETÇİ PLATFORMU                      │
│  (SaaS Provider - Yazılım Şirketi)                 │
│                                                     │
│  • Admin kullanıcıları                             │
│  • Kontör paket tanımları                          │
│  • Sistem ayarları                                 │
│  • LOGS (Tüm operasyon izleme)                     │
└─────────────────────────────────────────────────────┘
                          │
           ┌──────────────┼──────────────┐
           │              │              │
           ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │  BAYİ A  │   │  BAYİ B  │   │  BAYİ C  │
    │  (ID:1)  │   │  (ID:2)  │   │  (ID:3)  │
    │          │   │          │   │          │
    │ • Bakiye │   │ • Bakiye │   │ • Bakiye │
    │ • Marka  │   │ • Marka  │   │ • Marka  │
    │ • Ayarlar│   │ • Ayarlar│   │ • Ayarlar│
    └────┬─────┘   └────┬─────┘   └────┬─────┘
         │              │              │
    ┌────┴────┐    ┌────┴────┐    ┌────┴────┐
    │         │    │         │    │         │
    ▼         ▼    ▼         ▼    ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│RESTORAN│ │RESTORAN│ │RESTORAN│ │RESTORAN│
│(Bayi A)│ │(Bayi A)│ │(Bayi B)│ │(Bayi C)│
└───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    │          │          │          │
    └────┬─────┘          └────┬─────┘
         │                     │
    ┌────┴────┐           ┌────┴────┐
    ▼         ▼           ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ KURYE  │ │ KURYE  │ │ KURYE  │ │ KURYE  │
│(Bayi A)│ │(Bayi A)│ │(Bayi B)│ │(Bayi C)│
└────────┘ └────────┘ └────────┘ └────────┘
```

**Veri İzolasyonu:**
- Bayi A, Bayi B'nin verilerini göremez
- Paketçi TÜM verileri görebilir (izleme yetkisi)
- Her bayi kendi sandbox'ında çalışır

---

## 💳 KONTÖR SİSTEMİ (Paketçi-Bayi Arası)

### Kontör Paketleri:
```
┌────────────────────────────────────────────┐
│         PAKETÇİ KONTÖR FİYATLARI          │
├────────────────────────────────────────────┤
│                                            │
│  🥉 BAŞLANGIÇ                              │
│     1.000 paket = ₺5.000                   │
│     (Paket başı ₺5)                        │
│                                            │
│  🥈 GELİŞMİŞ                                │
│     5.000 paket = ₺22.500 (%10 indirim)    │
│     (Paket başı ₺4.5)                      │
│                                            │
│  🥇 KURUMSAL                                │
│     10.000 paket = ₺40.000 (%20 indirim)   │
│     (Paket başı ₺4)                        │
│                                            │
│  💎 ÖZEL (50.000+ paket)                   │
│     Bayi ile özel anlaşma                  │
│                                            │
└────────────────────────────────────────────┘
```

### Kontör Akışı:
```
1. Bayi Paketçi'den kontör satın alır
   (Örn: 5.000 paket = ₺22.500 öder)
   
2. Bayi'nin bakiyesine 5.000 paket eklenir

3. Bayi'nin restoranı sipariş oluşturur
   → Sistem otomatik kurye atar
   → Bayi'nin kontör bakiyesinden 1 düşer
   
4. Bayi kontörü bittiğinde:
   → Yeni kontör satın almalı
   → VEYA otomatik yenileme (kredi kartından çekim)
```

---

## 📊 RAPORLAMA HİYERARŞİSİ

### Paketçi Görebilir:
```
✅ Tüm Bayiler listesi
✅ Her bayinin:
   • Kontör bakiyesi
   • Kalan paket sayısı
   • Harcama hızı
   • Ödeme geçmişi
   
✅ Tüm Restoranlar (izleme modu)
✅ Tüm Kuryeler (izleme modu)
✅ Tüm Siparişler (izleme modu)
✅ Global istatistikler:
   • Toplam kontör satışı
   • Toplam paket teslimatı
   • Platform kullanım istatistikleri
```

### Bayi Görebilir:
```
✅ Sadece KENDİ verileri:
   • Kendi restoranları
   • Kendi kuryeleri
   • Kendi siparişleri
   • Kendi kontör bakiyesi
   • Kendi finansal raporları
```

---

## 🔐 ERİŞİM KONTROL MATRİSİ

| Veri | Paketçi | Bayi A | Bayi B | Restoran (A) | Kurye (A) |
|------|---------|--------|--------|--------------|-----------|
| Bayi A verileri | ✅ | ✅ | ❌ | (Sadece kendi) | (Sadece kendi) |
| Bayi B verileri | ✅ | ❌ | ✅ | ❌ | ❌ |
| Restoran A verileri | ✅ | ✅ | ❌ | ✅ | ❌ |
| Kurye A verileri | ✅ | ✅ | ❌ | ❌ | ✅ |
| Siparişler | ✅ | ✅ | ❌ | (Kendi) | (Kendi) |
| Finansal (kontör) | ✅ | (Kendi) | ❌ | ❌ | ❌ |
| Sistem ayarları | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🎯 ÖZET

| Katman | Rol | Bağımsızlık | Marka | Ödeme |
|--------|-----|-------------|-------|-------|
| **Paketçi** | Yazılım sağlayıcı | Bağımsız | Paketçi | Kontör satışı |
| **Bayi** | Operatör | Bağımsız | **Kendi markası** | Restoran geliri |
| **Restoran** | Müşteri | Bayi'ye bağlı | - | Paket başı ücret |
| **Kurye** | Çalışan | Bayi'ye bağlı | - | Maaş/Ücret |

**Paketçi sadece yazılım satar, operasyonun içinde değildir!** 🚀
