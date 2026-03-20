'use client';

import React from 'react';

interface CompleteStepProps {
  formData: any;
}

export function CompleteStep({ formData }: CompleteStepProps) {
  const getPricingSummary = () => {
    const { pricingType, pricingConfig } = formData.pricing;

    switch (pricingType) {
      case 'PER_PACKAGE':
        return `Paket Başı - ₺${pricingConfig?.pricePerPackage || 110}/paket`;
      case 'PER_KM':
        return `Kilometre Başı - ₺${pricingConfig?.pricePerKm || 10}/km`;
      case 'KM_RANGE':
        return 'Kilometre Aralığı';
      case 'PACKAGE_PLUS_KM':
        return `Paket + Km - ₺${pricingConfig?.basePrice || 30} + ₺${pricingConfig?.pricePerKm || 8}/km`;
      case 'FIXED_KM_PLUS_KM':
        return `Sabit Km + Km - İlk ${pricingConfig?.fixedKm || 3}km ₺${pricingConfig?.fixedPrice || 35}`;
      case 'COMMISSION':
        return `Komisyon - %${pricingConfig?.percentage || 15}`;
      case 'FIXED_PRICE':
        return `Sabit Ücret - ₺${pricingConfig?.fixedAmount || 5000}/${pricingConfig?.billingPeriod === 'YEARLY' ? 'yıl' : 'ay'}`;
      case 'HOURLY':
        return `Saatlik Ücret - Normal: ₺${pricingConfig?.normal?.price || 35}`;
      case 'ZONE_BASED':
        return `Bölge Bazlı - 🔵₺${pricingConfig?.zones?.blue?.price || 35} 🟡₺${pricingConfig?.zones?.yellow?.price || 45} 🔴₺${pricingConfig?.zones?.red?.price || 60}`;
      default:
        return 'Belirtilmemiş';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-lg font-medium text-gray-800">Özet ve Onay</h3>
        <p className="text-sm text-gray-500 mt-1">
          Restoran bilgilerini kontrol edin ve oluşturun
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        {/* Restaurant Info */}
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="text-2xl">🍽️</div>
          <div className="flex-1">
            <div className="font-medium">{formData.basicInfo.name}</div>
            {formData.basicInfo.brandName && (
              <div className="text-sm text-gray-500">{formData.basicInfo.brandName}</div>
            )}
            <div className="text-sm text-gray-500">{formData.basicInfo.email}</div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="text-2xl">📍</div>
          <div className="flex-1">
            <div className="text-sm">{formData.locationData.address.full || 'Adres belirtilmedi'}</div>
            <div className="text-xs text-gray-500 mt-1">
              {formData.locationData.address.district}, {formData.locationData.address.city}
            </div>
            {formData.locationData.location.latitude !== 0 && (
              <div className="text-xs text-gray-400">
                {formData.locationData.location.latitude.toFixed(6)},{' '}
                {formData.locationData.location.longitude.toFixed(6)}
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="text-2xl">💰</div>
          <div className="flex-1">
            <div className="font-medium text-sm">{getPricingSummary()}</div>
          </div>
        </div>

        {/* Users */}
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="text-2xl">👥</div>
          <div className="flex-1">
            <div className="font-medium text-sm">{formData.users.length} Kullanıcı</div>
            <div className="text-xs text-gray-500">
              {formData.users.map((u: any) => u.fullName).join(', ')}
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="flex items-start gap-3">
          <div className="text-2xl">⚙️</div>
          <div className="flex-1">
            <div className="text-sm">
              📞 {formData.businessSettings.supportPhone || 'Telefon yok'}
            </div>
            <div className="text-sm">
              ⏱️ Teslim süresi: {formData.businessSettings.pickupTimeMinutes} dk
            </div>
            {formData.businessSettings.creditCardCommission > 0 && (
              <div className="text-sm">
                💳 Komisyon: %{formData.businessSettings.creditCardCommission}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <span className="text-blue-500">ℹ️</span>
          <p className="text-sm text-blue-700">
            Restoran oluşturulduğunda otomatik olarak bir API Key oluşturulacak ve
            Extension kullanımı aktif edilecektir.
          </p>
        </div>
      </div>
    </div>
  );
}
