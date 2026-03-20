# Paketçi - Kurye & Restoran Yeni Özellikler

## 🚴 KURYE ÖZELLİKLERİ

### 1. MOLA YÖNETİMİ

#### Mola Tipleri
```typescript
enum BreakType {
  REQUESTED = 'requested',    // Talep üzerine (onay bekler)
  AUTO_APPROVED = 'auto',     // Direkt onaylı (kontenjanlı)
  EMERGENCY = 'emergency'     // Acil (direkt onay)
}
```

#### Mola Ayarları (Admin Panel)
```typescript
interface BreakSettings {
  // Talepli Mola
  requestedBreak: {
    enabled: boolean;
    maxDuration: number;        // Dakika (örn: 30)
    dailyLimit: number;         // Günlük limit (örn: 2)
    approvalTimeout: number;    // Onay bekleme süresi (dakika)
  };
  
  // Direkt Onaylı Mola
  autoBreak: {
    enabled: boolean;
    maxDuration: number;
    weeklyQuota: number;        // Haftalık kotası
    usedQuota: number;          // Kullanılan
  };
  
  // Yasaklı Saatler
  restrictedHours: {
    enabled: boolean;
    timeRanges: [               // Yasaklı aralıklar
      { start: '12:00', end: '14:00' },  // Öğle yoğunluğu
      { start: '19:00', end: '21:00' }   // Akşam yoğunluğu
    ];
  };
}
```

#### Kurye Mola Ekranı
```
┌─────────────────────────────┐
│  🕐 MOLA YÖNETİMİ           │
├─────────────────────────────┤
│                             │
│  [🟢 Aktif] Vardiya: 08:00  │
│                             │
│  ─── MOLA AL ───            │
│                             │
│  ┌─────────────────────┐    │
│  │ ⏸️ Talepli Mola      │    │
│  │    Süre: 30 dk      │    │
│  │    Onay bekleniyor  │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ ⚡ Direkt Onaylı     │    │
│  │    Kalan: 2/3       │    │
│  │    Max: 15 dk       │    │
│  └─────────────────────┘    │
│                             │
│  ─── YASAKLI SAATLER ───    │
│                             │
│  ⚠️ 12:00-14:00 Yasak       │
│  ⚠️ 19:00-21:00 Yasak       │
│                             │
└─────────────────────────────┘
```

---

### 2. KAZA/ACİL DURUM BUTONU

#### Panik Butonu
```typescript
interface EmergencyReport {
  type: 'ACCIDENT' | 'BREAKDOWN' | 'HEALTH' | 'OTHER';
  courierId: string;
  location: { lat: number; lng: number };
  timestamp: Date;
  status: 'PENDING' | 'HELP_SENT' | 'RESOLVED';
  
  // Kaza detayları
  accidentDetails?: {
    hasInjury: boolean;
    injuryLevel: 'NONE' | 'MINOR' | 'MAJOR';
    vehicleDamage: boolean;
    otherPartyInvolved: boolean;
    policeReportNumber?: string;
    photos?: string[];
  };
  
  // Aksaklık detayları
  breakdownDetails?: {
    vehicleType: 'MOTORCYCLE' | 'BICYCLE' | 'CAR';
    issueType: string;
    canContinue: boolean;
  };
}
```

#### Acil Durum Ekranı
```
┌─────────────────────────────┐
│  🚨 ACİL DURUM              │
├─────────────────────────────┤
│                             │
│  ⚠️ Dikkat! Bu buton sadece │
│     acil durumlar içindir   │
│                             │
│  ┌─────────────────────┐    │
│  │  💥 KAZA YAPTIM      │    │
│  │                     │    │
│  │  Yaralanma varsa    │    │
│  │  112'yi arayın!     │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │  🔧 ARAÇ ARIZASI     │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │  🏥 SAĞLIK PROBLEMİ  │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │  📞 YÖNETİMİ ARA     │    │
│  │     0850 XXX XX XX   │    │
│  └─────────────────────┘    │
│                             │
└─────────────────────────────┘
```

#### Kaza Detay Formu
```
┌─────────────────────────────┐
│  💥 KAZA RAPORU             │
├─────────────────────────────┤
│                             │
│  📍 Konum: Atatürk Cad.     │
│  🕐 Saat: 14:30             │
│                             │
│  ─── DETAYLAR ───           │
│                             │
│  Yaralanma var mı?          │
│  [ ] Hayır  [✓] Evet        │
│                             │
│  Yaralanma derecesi:        │
│  [Hafif] [Orta] [Ağır]      │
│                             │
│  Araç hasarlı mı?           │
│  [ ] Hayır  [✓] Evet        │
│                             │
│  Karşı taraf var mı?        │
│  [✓] Hayır  [ ] Evet        │
│                             │
│  [📷 Fotoğraf Ekle]         │
│                             │
│  Not:                       │
│  [________________]         │
│                             │
│  [🚨 RAPOR GÖNDER]          │
│                             │
└─────────────────────────────┘
```

---

### 3. KURYE RAPOR EKRANI

#### Kazanç Raporları
```
┌─────────────────────────────┐
│  📊 RAPORLARIM              │
├─────────────────────────────┤
│  [Günlük] [Haftalık] [Aylık]│
├─────────────────────────────┤
│                             │
│  ─── ÖZET (Ekim 2024) ───   │
│                             │
│  💰 Toplam Kazanç           │
│     ₺24,850                 │
│                             │
│  📦 Toplam Paket            │
│     342 sipariş             │
│                             │
│  ⏱️ Çalışma Saati           │
│     186 saat                │
│                             │
│  ─── DETAYLAR ───           │
│                             │
│  Paket Başı Kazanç    ₺X    │
│  Mesai Ücreti         ₺X    │
│  Prim                 ₺X    │
│  İptal Kesintisi     -₺X    │
│  ───────────────────────    │
│  NET                 ₺X     │
│                             │
│  [📥 Excel İndir]           │
│                             │
└─────────────────────────────┘
```

#### Vardiya Raporu
```
┌─────────────────────────────┐
│  📅 VARDİYALARIM            │
├─────────────────────────────┤
│                             │
│  [◀] Ekim 2024 [▶]          │
│                             │
│  ┌─────────────────────┐    │
│  │ 📅 15 Ekim Salı      │    │
│  │                      │    │
│  │ 🕐 08:00 - 20:00     │    │
│  │ 📦 12 paket          │    │
│  │ 💰 ₺850              │    │
│  │ ✅ Tamamlandı        │    │
│  │ [📋 Detay]           │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 📅 16 Ekim Çarşamba  │    │
│  │                      │    │
│  │ 🕐 09:00 - 18:00     │    │
│  │ 📦 8 paket           │    │
│  │ 💰 ₺620              │    │
│  │ ⚠️ Mola: 30 dk       │    │
│  │ [📋 Detay]           │    │
│  └─────────────────────┘    │
│                             │
└─────────────────────────────┘
```

#### Mutabakat / İptal / Kesinti
```
┌─────────────────────────────┐
│  📋 MUTABAKATLARIM          │
├─────────────────────────────┤
│                             │
│  ─── BEKLEYENLER ───        │
│                             │
│  📅 15 Ekim                 │
│  💰 ₺850                    │
│  ⏳ Mutabakat Bekliyor      │
│                             │
│  ─── TAMAMLANANLAR ───      │
│                             │
│  📅 14 Ekim                 │
│  💰 ₺920                    │
│  ✅ Mutabakat Yapıldı       │
│  [📄 Görüntüle]             │
│                             │
│  ─── İPTALLER / KESİNTİLER ─│
│                             │
│  📅 14 Ekim - Sipariş #123  │
│  ❌ İptal: Müşteri reddi    │
│  -₺50 Kesinti               │
│  [📄 İtiraz Et]             │
│                             │
│  📅 12 Ekim - Sipariş #118  │
│  ⚠️ Geç Teslimat            │
│  -₺25 Kesinti               │
│                             │
└─────────────────────────────┘
```

---

## 🏪 RESTORAN ÖZELLİKLERİ

### 4. ÖDEME DÜZENLEME (Yetki Kontrollü)

#### Yetki Sistemi
```typescript
interface RestaurantPermissions {
  canEditPayment: boolean;      // Ödeme düzenleme yetkisi
  canEditBeforePickup: boolean; // Teslimat öncesi düzenleme
  editTimeLimit: number;        // Dakika cinsinden limit
  maxEditAmount: number;        // Max düzenlenebilir tutar
  requiresApproval: boolean;    // Onay gerekiyor mu?
}
```

#### Ödeme Düzenleme Ekranı
```
┌─────────────────────────────┐
│  💳 ÖDEME DÜZENLE           │
├─────────────────────────────┤
│                             │
│  Sipariş #PKT-240115-001    │
│  Ahmet Yılmaz               │
│                             │
│  ─── MEVCUT ÖDEME ───       │
│                             │
│  Tip: Online                │
│  Tutar: ₺150.00             │
│                             │
│  ─── YENİ ÖDEME ───         │
│                             │
│  Ödeme Tipi:                │
│  [Nakit] [Online] [Kart]    │
│                             │
│  Tutar:                     │
│  ₺[  150.00    ]            │
│                             │
│  Düzenleme Nedeni:          │
│  [Ürün eksikliği___]        │
│                             │
│  [✓ Onay Talep Et]          │
│  [💾 Kaydet]                │
│                             │
│  ⚠️ Yetki: Sadece teslimat  │
│     öncesi düzenlenebilir   │
│                             │
└─────────────────────────────┘
```

#### Onay Akışı
```
1. Restoran düzenleme yapar
   ↓
2. Sistem yetki kontrolü yapar
   ↓
3. Eğer yetki varsa → Direkt kaydet
   Eğer yetki yoksa → Onay'a gönder
   ↓
4. Admin/Yönetici onaylar/reddeder
   ↓
5. Sonuç restorana bildirilir
```

---

### 5. İPTAL ONAY SÜRECİ

#### İptal Nedenleri
```typescript
enum CancelReason {
  // Müşteri kaynaklı
  CUSTOMER_NOT_ANSWERING = 'Müşteri ulaşılamıyor',
  CUSTOMER_WRONG_ADDRESS = 'Yanlış adres',
  CUSTOMER_CANCELLED = 'Müşteri iptal etti',
  
  // Restoran kaynaklı
  RESTAURANT_OUT_OF_STOCK = 'Stokta yok',
  RESTAURANT_KITCHEN_CLOSED = 'Mutfak kapalı',
  RESTAURANT_TECHNICAL_ISSUE = 'Teknik arıza',
  
  // Kurye kaynaklı
  COURIER_DELAYED = 'Kurye gecikmesi',
  COURIER_CANT_DELIVER = 'Teslimat yapılamıyor',
  
  // Diğer
  WEATHER_CONDITION = 'Hava koşulları',
  FORCE_MAJEURE = 'Mücbir sebep',
  OTHER = 'Diğer'
}
```

#### İptal Formu
```
┌─────────────────────────────┐
│  ❌ SİPARİŞ İPTAL           │
├─────────────────────────────┤
│                             │
│  Sipariş #PKT-240115-001    │
│  Ahmet Yılmaz - ₺150        │
│                             │
│  ─── İPTAL NEDENİ ───       │
│                             │
│  Neden seçin:               │
│                             │
│  ○ Müşteri ulaşılamıyor     │
│  ○ Yanlış adres             │
│  ○ Stokta yok               │
│  ● Müşteri iptal etti       │
│  ○ Teknik arıza             │
│  ○ Diğer                    │
│                             │
│  Açıklama:                  │
│  [________________]         │
│                             │
│  📎 Fotoğraf/Ek:            │
│  [📷 Ekle]                  │
│                             │
│  ─── ONAY SÜRECİ ───        │
│                             │
│  ⚠️ Bu iptal için onay      │
│     gerekmektedir           │
│                             │
│  [📤 ONAYA GÖNDER]          │
│                             │
│  [İptal]                    │
│                             │
└─────────────────────────────┘
```

#### Admin Onay Paneli
```
┌─────────────────────────────┐
│  ✅ İPTAL ONAYLARI          │
├─────────────────────────────┤
│                             │
│  🔔 3 Bekleyen Onay Var     │
│                             │
│  ┌─────────────────────┐    │
│  │ Ateş Döner          │    │
│  │ Sipariş #PKT-123    │    │
│  │ ❌ İptal Talebi      │    │
│  │                     │    │
│  │ Neden: Stokta yok   │    │
│  │ Tutar: ₺150         │    │
│  │                     │    │
│  │ [✓ Onayla] [✗ Reddet]│   │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ Lezzet Sofrası      │    │
│  │ Sipariş #PKT-124    │    │
│  │ ❌ İptal Talebi      │    │
│  │                     │    │
│  │ Neden: Müşteri iptal│    │
│  │ Tutar: ₺89          │    │
│  │                     │    │
│  │ [✓ Onayla] [✗ Reddet]│   │
│  └─────────────────────┘    │
│                             │
└─────────────────────────────┘
```

---

## 🔧 VERİTABANI GÜNCELLEMELERİ

### Yeni Entity'ler

```typescript
// Break (Mola)
@Entity('breaks')
class Break {
  id: string;
  courierId: string;
  type: 'REQUESTED' | 'AUTO' | 'EMERGENCY';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
  startTime: Date;
  endTime: Date;
  duration: number;
  reason?: string;
  approvedBy?: string;
  approvedAt?: Date;
}

// Emergency (Acil Durum)
@Entity('emergencies')
class Emergency {
  id: string;
  courierId: string;
  type: 'ACCIDENT' | 'BREAKDOWN' | 'HEALTH' | 'OTHER';
  status: 'PENDING' | 'HELP_SENT' | 'RESOLVED';
  location: { lat: number; lng: number };
  details: object;
  photos: string[];
  createdAt: Date;
  resolvedAt?: Date;
}

// PaymentEdit (Ödeme Düzenleme)
@Entity('payment_edits')
class PaymentEdit {
  id: string;
  deliveryId: string;
  restaurantId: string;
  originalPayment: object;
  newPayment: object;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedBy: string;
  approvedBy?: string;
  createdAt: Date;
}

// Cancellation (İptal)
@Entity('cancellations')
class Cancellation {
  id: string;
  deliveryId: string;
  reason: string;
  reasonType: CancelReason;
  description?: string;
  photos?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedBy: string;
  approvedBy?: string;
  penaltyAmount?: number;
  createdAt: Date;
}
```

---

## 📱 EKRAN ÖZETİ

### Kurye Ekranları
1. ✅ **Mola Yönetimi** - Talepli/Direkt/Yasaklı saatler
2. ✅ **Kaza/Acil Butonu** - Panik butonu + detay formu
3. ✅ **Raporlarım** - Günlük/Haftalık/Aylık kazanç
4. ✅ **Vardiyalarım** - Geçmiş vardiya listesi
5. ✅ **Mutabakatlar** - Onay bekleyen/tamamlanan
6. ✅ **İptal/Kesintiler** - İtiraz edilebilir liste

### Restoran Ekranları
1. ✅ **Ödeme Düzenleme** - Yetki kontrollü değişiklik
2. ✅ **İptal Talebi** - Nedenli iptal + onay süreci

### Admin Ekranları
1. ✅ **İptal Onayları** - Bekleyen iptalleri yönet
2. ✅ **Mola Onayları** - Kurye mola istekleri
3. ✅ **Ödeme Düzenleme Onayları** - Tutar değişiklikleri
4. ✅ **Acil Durumlar** - Kaza/bozulma bildirimleri

---

Bu özellikleri implemente etmeye başlayalım mı? 🚀
