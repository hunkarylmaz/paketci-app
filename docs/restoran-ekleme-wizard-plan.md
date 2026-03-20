# 🍽️ Restoran Ekleme - Adım Adım İmplementasyon Planı

## 📱 Görseldeki Akış (6 Adım)

```
✅ ─── ✅ ─── ✅ ─── 🔘 ─── ⭕ ─── ⭕
Temel    İşletme  Çalışma  Kullanıcı Konum   Tamamla
Bilgiler Ayarları Tipi     lar
```

---

## 🔧 ADIM 1: Restaurant Entity Güncelleme

### Yeni Alanlar:
```typescript
// Temel Bilgiler
name: string;                    // Restoran adı
brandName?: string;              // Marka adı (opsiyonel)

// İşletme Ayarları
supportPhone: string;            // Destek telefonu
technicalContactName: string;    // Teknik sorumlu adı
creditCardCommission: number;    // Kredi kartı komisyonu (%)
pickupTimeMinutes: number;       // Teslim alma süresi (dk)

// Çalışma Tipi
pricingType: 'FIXED' | 'ZONE' | 'DISTANCE' | 'HOURLY';
pricingConfig: {
  basePrice: number;
  zones?: ZonePricing[];
  distanceTiers?: DistanceTier[];
  hourlyRates?: HourlyRate[];
};

// Kullanıcılar (RestaurantUser[])
users: {
  fullName: string;
  phone: string;
  role: 'MANAGER' | 'STAFF';
  username: string;
  password: string;
}[];

// Konum
address: {
  full: string;
  district: string;
  city: string;
  neighborhood?: string;
};
location: {
  latitude: number;
  longitude: number;
};

// Bayi İlişkisi
dealerId: string;
isActive: boolean;
```

---

## 📋 ADIM 2: Wizard Komponent Yapısı

### React + Next.js Implementation:
```tsx
// components/restaurant/RestaurantWizard.tsx

interface WizardStep {
  id: string;
  title: string;
  icon: string;
  component: React.ComponentType;
}

const steps: WizardStep[] = [
  { id: 'basic', title: 'Temel Bilgiler', icon: '✓', component: BasicInfoStep },
  { id: 'business', title: 'İşletme Ayarları', icon: '⚙️', component: BusinessSettingsStep },
  { id: 'pricing', title: 'Çalışma Tipi', icon: '💰', component: PricingTypeStep },
  { id: 'users', title: 'Kullanıcılar', icon: '👥', component: UsersStep },
  { id: 'location', title: 'Konum', icon: '📍', component: LocationStep },
  { id: 'complete', title: 'Tamamla', icon: '✅', component: CompleteStep },
];

export function RestaurantWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RestaurantFormData>({
    // Initial empty state
  });
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  
  const updateFormData = (data: Partial<RestaurantFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  return (
    <div className="wizard-container">
      {/* Stepper Header */}
      <StepperHeader steps={steps} currentStep={currentStep} />
      
      {/* Step Content */}
      <div className="step-content">
        {React.createElement(steps[currentStep].component, {
          formData,
          updateFormData,
          nextStep,
          prevStep,
        })}
      </div>
      
      {/* Navigation Buttons */}
      <WizardFooter 
        currentStep={currentStep} 
        totalSteps={steps.length}
        onNext={nextStep}
        onPrev={prevStep}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

---

## 📱 ADIM 3: Her Adımın Detaylı Tasarımı

### Adım 1: Temel Bilgiler ✓
```
┌─────────────────────────────────────────────┐
│ Temel Bilgiler                              │
├─────────────────────────────────────────────┤
│                                             │
│  Restoran Adı *                            │
│  [________________________]                │
│                                             │
│  Marka Adı (Opsiyonel)                     │
│  [________________________]                │
│                                             │
│  E-posta *                                 │
│  [________________________]                │
│                                             │
│  Vergi Numarası                            │
│  [________________________]                │
│                                             │
└─────────────────────────────────────────────┘
```

### Adım 2: İşletme Ayarları ⚙️
```
┌─────────────────────────────────────────────┐
│ İşletme Ayarları                            │
├─────────────────────────────────────────────┤
│                                             │
│  Destek Telefonu *           Teknik Destek │
│  [05XXXXXXXXXX    ]          [____________]│
│                               Teknik sorumlu│
│                                             │
│  Kredi Kartı Komisyonu (%)   Teslim Alma   │
│  [0               ]          [30          ]│
│                               Süresi (dk)  │
│                                             │
└─────────────────────────────────────────────┘
```

### Adım 3: Çalışma Tipi 💰
```
┌─────────────────────────────────────────────┐
│ Çalışma Tipi Seçimi                         │
├─────────────────────────────────────────────┤
│                                             │
│  ○ Sabit Paket Başı                        │
│    ₺[ 35 ] / paket                         │
│                                             │
│  ● Bölge Bazlı  ← Seçili                   │
│    🔵 Mavi Bölge:  ₺[ 35 ]                 │
│    🟡 Sarı Bölge:  ₺[ 45 ]                 │
│    🔴 Kırmızı Bölge: ₺[ 60 ]               │
│                                             │
│    Mahalle Listesi:                        │
│    [Caferağa, Osmanağa, Moda ▼]            │
│                                             │
│  ○ Mesafe Bazlı                            │
│  ○ Saatlik Farklı                          │
│                                             │
└─────────────────────────────────────────────┘
```

### Adım 4: Kullanıcılar 👥
```
┌─────────────────────────────────────────────┐
│ Kullanıcılar                                │
│ En az 1 kullanıcı gerekli                  │
├─────────────────────────────────────────────┤
│                                             │
│  Ad Soyad *           Telefon *            │
│  [____________]       [05XXXXXXXXXX]       │
│                                             │
│  Rol *                Kullanıcı Adı *      │
│  [Restoran Yön. ▼]    [____________]       │
│                                             │
│  Şifre *                                   │
│  [____________]                            │
│                                             │
│  [👤 Kullanıcı Ekle]                       │
│                                             │
│  ── Eklenen Kullanıcılar ──                │
│  👤 Ahmet Yılmaz - Yönetici  [🗑️]          │
│                                             │
└─────────────────────────────────────────────┘
```

### Adım 5: Konum 📍
```
┌─────────────────────────────────────────────┐
│ Restoran Konumu                             │
├─────────────────────────────────────────────┤
│                                             │
│  Adres ara                                  │
│  [Cudi Mah 3531 No 9        ] [🔍 Ara]     │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │         [HARITA LEAFLET]          │   │
│  │              📍                     │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Seçili Konum: 37.881200, 41.135100        │
│                                             │
│  Açık Adres:                               │
│  [________________________________]        │
│  [________________________________]        │
│                                             │
└─────────────────────────────────────────────┘
```

### Adım 6: Tamamla ✓
```
┌─────────────────────────────────────────────┐
│ Özet ve Onay                                │
├─────────────────────────────────────────────┤
│                                             │
│  🍽️ Ateş Döner                             │
│                                             │
│  📍 Kadıköy, Caferağa Mah.                 │
│  37.881200, 41.135100                      │
│                                             │
│  💰 Bölge Bazlı | 🔵₺35 🟡₺45 🔴₺60        │
│                                             │
│  👤 1 Kullanıcı                            │
│                                             │
│  🏪 Bayi: Hızlı Kurye A.Ş.                 │
│                                             │
│  [✓ RESTORANI OLUŞTUR]                     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔧 ADIM 4: Backend API'leri

### Endpoint'ler:
```typescript
// Restaurant oluşturma (Wizard tamamlandığında)
POST /api/restaurants
Body: {
  // Tüm wizard adımlarının verisi
}

// Adres arama (Konum adımı için)
GET /api/geocode/search?query=Kadıköy+Caferağa
Response: {
  address: string;
  lat: number;
  lng: number;
  district: string;
  city: string;
}

// Mahalle listesi (Bölge bazlı için)
GET /api/neighborhoods?district=Kadıköy
Response: string[]
```

---

## 🎨 ADIM 5: CSS Stilleri (Tailwind)

```css
/* Stepper */
.stepper-container {
  @apply flex items-center justify-between mb-8;
}

.step-item {
  @apply flex flex-col items-center;
}

.step-circle {
  @apply w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium;
}

.step-circle.completed {
  @apply bg-green-500 text-white;
}

.step-circle.active {
  @apply bg-purple-600 text-white;
}

.step-circle.pending {
  @apply bg-gray-200 text-gray-400;
}

.step-title {
  @apply text-xs mt-2 text-gray-600;
}

.step-title.active {
  @apply text-purple-600 font-medium;
}

/* Form Inputs */
.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

/* Navigation Buttons */
.btn-primary {
  @apply px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors;
}

.btn-secondary {
  @apply px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors;
}
```

---

## 🚀 IMPLEMENTASYON SIRASI

### Phase 1: Backend
1. [ ] Restaurant entity güncelleme
2. [ ] DTO'lar oluşturma
3. [ ] Service metodları
4. [ ] Controller endpoint'leri

### Phase 2: Frontend (Admin Panel)
1. [ ] Wizard komponenti
2. [ ] Stepper header
3. [ ] Adım 1: Temel Bilgiler
4. [ ] Adım 2: İşletme Ayarları
5. [ ] Adım 3: Çalışma Tipi
6. [ ] Adım 4: Kullanıcılar
7. [ ] Adım 5: Konum (Harita)
8. [ ] Adım 6: Tamamla

### Phase 3: Frontend (Bayi Paneli)
1. [ ] Aynı wizard bayi paneline entegre et
2. [ ] Bayi ID otomatik ata
3. [ ] Yetki kontrolü

### Phase 4: Test
1. [ ] Wizard akış testi
2. [ ] Validasyon testi
3. [ ] API entegrasyon testi

---

**Başlıyor muyum?** Önce Backend entity'sini mi, yoksa Frontend wizard'ını mı? 🚀
