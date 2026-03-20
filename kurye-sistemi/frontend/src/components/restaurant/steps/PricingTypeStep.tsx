'use client';

import React, { useState } from 'react';

interface PricingTypeStepProps {
  data: {
    pricingType: string;
    pricingConfig: any;
  };
  onChange: (data: any) => void;
}

// 📊 9 ÇALIŞMA ŞEKLİ (6 görseldeki + 3 yeni)
const PRICING_TYPES = [
  {
    id: 'PER_PACKAGE',
    title: 'Paket Başı',
    description: 'Her paket için sabit ücret alınır',
    icon: '📦',
  },
  {
    id: 'PER_KM',
    title: 'Kilometre Başı',
    description: 'Her kilometre için sabit ücret alınır',
    icon: '🛣️',
  },
  {
    id: 'KM_RANGE',
    title: 'Kilometre Aralığı',
    description: 'Mesafe aralıklarına göre farklı ücretler',
    icon: '📊',
  },
  {
    id: 'PACKAGE_PLUS_KM',
    title: 'Paket + Km',
    description: 'Paket ücreti + kilometre ücreti birlikte',
    icon: '🎯',
  },
  {
    id: 'FIXED_KM_PLUS_KM',
    title: 'Sabit Km + Km',
    description: "Belirli km'ye kadar sabit, sonrası km başı",
    icon: '⚡',
  },
  {
    id: 'COMMISSION',
    title: 'Komisyon',
    description: 'Sipariş tutarından yüzdelik ücret',
    icon: '💰',
  },
  // YENİ 3 ÇALIŞMA ŞEKLİ
  {
    id: 'FIXED_PRICE',
    title: 'Sabit Ücret',
    description: 'Restoran başına sabit aylık/yıllık ücret',
    icon: '🔒',
  },
  {
    id: 'HOURLY',
    title: 'Saatlik Ücret',
    description: 'Günün saatlerine göre farklı ücretler',
    icon: '⏰',
  },
  {
    id: 'ZONE_BASED',
    title: 'Bölge Bazlı',
    description: 'Mavi/Sarı/Kırmızı bölgelere göre ücret',
    icon: '🗺️',
  },
];

export function PricingTypeStep({ data, onChange }: PricingTypeStepProps) {
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<Record<string, string[]>>({
    blue: [],
    yellow: [],
    red: [],
  });
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [selectedZone, setSelectedZone] = useState<'blue' | 'yellow' | 'red'>('blue');

  const handleTypeSelect = (typeId: string) => {
    const defaultConfigs: Record<string, any> = {
      PER_PACKAGE: { pricePerPackage: 110 },
      PER_KM: { pricePerKm: 10 },
      KM_RANGE: {
        ranges: [
          { maxKm: 3, price: 35 },
          { maxKm: 5, price: 45 },
          { maxKm: 999, price: 60 },
        ],
      },
      PACKAGE_PLUS_KM: {
        basePrice: 30,
        pricePerKm: 8,
      },
      FIXED_KM_PLUS_KM: {
        fixedKm: 3,
        fixedPrice: 35,
        extraPricePerKm: 10,
      },
      COMMISSION: {
        percentage: 15,
      },
      // YENİLER
      FIXED_PRICE: {
        fixedAmount: 5000,
        billingPeriod: 'MONTHLY', // MONTHLY veya YEARLY
      },
      HOURLY: {
        normal: { start: '09:00', end: '17:00', price: 35 },
        peak: { start: '17:00', end: '22:00', price: 45 },
        night: { start: '22:00', end: '09:00', price: 60 },
      },
      ZONE_BASED: {
        zones: {
          blue: { price: 35, neighborhoods: [] },
          yellow: { price: 45, neighborhoods: [] },
          red: { price: 60, neighborhoods: [] },
        },
      },
    };

    onChange({
      pricingType: typeId,
      pricingConfig: defaultConfigs[typeId],
    });
  };

  const updateConfig = (key: string, value: any) => {
    onChange({
      pricingConfig: { ...data.pricingConfig, [key]: value },
    });
  };

  const updateRange = (index: number, field: string, value: number) => {
    const newRanges = [...(data.pricingConfig.ranges || [])];
    newRanges[index] = { ...newRanges[index], [field]: value };
    updateConfig('ranges', newRanges);
  };

  const addNeighborhood = () => {
    if (!newNeighborhood.trim()) return;
    
    const currentZones = data.pricingConfig?.zones || {
      blue: { price: 35, neighborhoods: [] },
      yellow: { price: 45, neighborhoods: [] },
      red: { price: 60, neighborhoods: [] },
    };

    const updatedZones = {
      ...currentZones,
      [selectedZone]: {
        ...currentZones[selectedZone],
        neighborhoods: [...currentZones[selectedZone].neighborhoods, newNeighborhood],
      },
    };

    updateConfig('zones', updatedZones);
    setNewNeighborhood('');
  };

  const removeNeighborhood = (zone: string, index: number) => {
    const currentZones = data.pricingConfig?.zones;
    if (!currentZones) return;

    const updatedZones = {
      ...currentZones,
      [zone]: {
        ...currentZones[zone],
        neighborhoods: currentZones[zone].neighborhoods.filter((_: any, i: number) => i !== index),
      },
    };

    updateConfig('zones', updatedZones);
  };

  const renderConfigFields = () => {
    switch (data.pricingType) {
      case 'PER_PACKAGE':
        return (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-4">
              ℹ️ Restoran her paket için aşağıdaki sabit ücreti ödeyecektir.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paket Başı Ücret (₺)</label>
            <input
              type="number"
              value={data.pricingConfig?.pricePerPackage || 110}
              onChange={(e) => updateConfig('pricePerPackage', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        );

      case 'PER_KM':
        return (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-4">ℹ️ Her kilometre için sabit ücret alınacaktır.</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilometre Başı Ücret (₺)</label>
            <input
              type="number"
              value={data.pricingConfig?.pricePerKm || 10}
              onChange={(e) => updateConfig('pricePerKm', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        );

      case 'KM_RANGE':
        return (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-4">ℹ️ Mesafe aralıklarına göre farklı ücretler uygulanacaktır.</p>
            <div className="space-y-3">
              {data.pricingConfig?.ranges?.map((range: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24">
                    {index === 0 ? '0' : data.pricingConfig.ranges[index - 1].maxKm}-{range.maxKm === 999 ? '∞' : range.maxKm} km
                  </span>
                  <input
                    type="number"
                    value={range.price}
                    onChange={(e) => updateRange(index, 'price', parseFloat(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ücret"
                  />
                  <span className="text-sm text-gray-500">₺</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const ranges = data.pricingConfig?.ranges || [];
                const lastMax = ranges[ranges.length - 1]?.maxKm || 5;
                updateConfig('ranges', [...ranges, { maxKm: lastMax + 2, price: 60 }]);
              }}
              className="mt-3 text-sm text-purple-600 hover:text-purple-700"
            >
              + Aralık Ekle
            </button>
          </div>
        );

      case 'PACKAGE_PLUS_KM':
        return (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-4">ℹ️ Paket başı ücret + kilometre başı ücret toplanarak hesaplanır.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paket Ücreti (₺)</label>
                <input
                  type="number"
                  value={data.pricingConfig?.basePrice || 30}
                  onChange={(e) => updateConfig('basePrice', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Km Ücreti (₺)</label>
                <input
                  type="number"
                  value={data.pricingConfig?.pricePerKm || 8}
                  onChange={(e) => updateConfig('pricePerKm', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        );

      case 'FIXED_KM_PLUS_KM':
        return (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-4">ℹ️ Belirli km'ye kadar sabit ücret, sonrası km başı ücret.</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sabit Km</label>
                <input
                  type="number"
                  value={data.pricingConfig?.fixedKm || 3}
                  onChange={(e) => updateConfig('fixedKm', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sabit Ücret (₺)</label>
                <input
                  type="number"
                  value={data.pricingConfig?.fixedPrice || 35}
                  onChange={(e) => updateConfig('fixedPrice', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ek Km Ücreti (₺)</label>
                <input
                  type="number"
                  value={data.pricingConfig?.extraPricePerKm || 10}
                  onChange={(e) => updateConfig('extraPricePerKm', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        );

      case 'COMMISSION':
        return (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-4">ℹ️ Sipariş tutarının belirli yüzdesi komisyon olarak alınır.</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Komisyon Oranı (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={data.pricingConfig?.percentage || 15}
              onChange={(e) => updateConfig('percentage', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-2">Örnek: 100₺ sipariş için {data.pricingConfig?.percentage || 15}₺ komisyon alınır</p>
          </div>
        );

      // ==================== YENİ ÇALIŞMA ŞEKİLLERİ ====================

      case 'FIXED_PRICE':
        return (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-4">ℹ️ Restoran başına sabit periyodik ücret alınır.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sabit Ücret (₺)</label>
                <input
                  type="number"
                  value={data.pricingConfig?.fixedAmount || 5000}
                  onChange={(e) => updateConfig('fixedAmount', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fatura Periyodu</label>
                <select
                  value={data.pricingConfig?.billingPeriod || 'MONTHLY'}
                  onChange={(e) => updateConfig('billingPeriod', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="MONTHLY">Aylık</option>
                  <option value="YEARLY">Yıllık</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'HOURLY':
        return (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-4">ℹ️ Günün saatlerine göre farklı paket başı ücretleri uygulanır.</p>
            <div className="space-y-4">
              {/* Normal Saatler */}
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">🌅</span>
                  <span className="font-medium">Normal Saatler</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="time"
                    value={data.pricingConfig?.normal?.start || '09:00'}
                    onChange={(e) => updateConfig('normal', { ...data.pricingConfig?.normal, start: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="time"
                    value={data.pricingConfig?.normal?.end || '17:00'}
                    onChange={(e) => updateConfig('normal', { ...data.pricingConfig?.normal, end: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    value={data.pricingConfig?.normal?.price || 35}
                    onChange={(e) => updateConfig('normal', { ...data.pricingConfig?.normal, price: parseFloat(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="₺"
                  />
                </div>
              </div>

              {/* Yoğun Saatler */}
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-orange-500">🔥</span>
                  <span className="font-medium">Yoğun Saatler</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="time"
                    value={data.pricingConfig?.peak?.start || '17:00'}
                    onChange={(e) => updateConfig('peak', { ...data.pricingConfig?.peak, start: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="time"
                    value={data.pricingConfig?.peak?.end || '22:00'}
                    onChange={(e) => updateConfig('peak', { ...data.pricingConfig?.peak, end: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    value={data.pricingConfig?.peak?.price || 45}
                    onChange={(e) => updateConfig('peak', { ...data.pricingConfig?.peak, price: parseFloat(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="₺"
                  />
                </div>
              </div>

              {/* Gece Saatleri */}
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-500">🌙</span>
                  <span className="font-medium">Gece Saatleri</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="time"
                    value={data.pricingConfig?.night?.start || '22:00'}
                    onChange={(e) => updateConfig('night', { ...data.pricingConfig?.night, start: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="time"
                    value={data.pricingConfig?.night?.end || '09:00'}
                    onChange={(e) => updateConfig('night', { ...data.pricingConfig?.night, end: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    value={data.pricingConfig?.night?.price || 60}
                    onChange={(e) => updateConfig('night', { ...data.pricingConfig?.night, price: parseFloat(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="₺"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'ZONE_BASED':
        return (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-4">ℹ️ Bölgelere (Mavi/Sarı/Kırmızı) göre farklı ücretler uygulanır.</p>
            <div className="space-y-4">
              {/* Mavi Bölge */}
              <div className="p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-800">🔵 Mavi Bölge (Yakın)</span>
                  <input
                    type="number"
                    value={data.pricingConfig?.zones?.blue?.price || 35}
                    onChange={(e) => {
                      const zones = data.pricingConfig?.zones || {};
                      updateConfig('zones', {
                        ...zones,
                        blue: { ...zones.blue, price: parseFloat(e.target.value) },
                      });
                    }}
                    className="w-24 px-3 py-1 border border-blue-300 rounded text-right"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNeighborhood}
                    onChange={(e) => setNewNeighborhood(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && selectedZone === 'blue' && addNeighborhood()}
                    placeholder="Mahalle ekle..."
                    className="flex-1 px-3 py-1 border border-blue-300 rounded text-sm"
                  />
                  <button
                    onClick={() => { setSelectedZone('blue'); addNeighborhood(); }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.pricingConfig?.zones?.blue?.neighborhoods?.map((n: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-blue-200 rounded text-xs flex items-center gap-1">
                      {n}
                      <button onClick={() => removeNeighborhood('blue', i)} className="text-blue-700">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sarı Bölge */}
              <div className="p-3 bg-yellow-100 rounded-lg border-2 border-yellow-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-yellow-800">🟡 Sarı Bölge (Orta)</span>
                  <input
                    type="number"
                    value={data.pricingConfig?.zones?.yellow?.price || 45}
                    onChange={(e) => {
                      const zones = data.pricingConfig?.zones || {};
                      updateConfig('zones', {
                        ...zones,
                        yellow: { ...zones.yellow, price: parseFloat(e.target.value) },
                      });
                    }}
                    className="w-24 px-3 py-1 border border-yellow-300 rounded text-right"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNeighborhood}
                    onChange={(e) => setNewNeighborhood(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && selectedZone === 'yellow' && addNeighborhood()}
                    placeholder="Mahalle ekle..."
                    className="flex-1 px-3 py-1 border border-yellow-300 rounded text-sm"
                  />
                  <button
                    onClick={() => { setSelectedZone('yellow'); addNeighborhood(); }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.pricingConfig?.zones?.yellow?.neighborhoods?.map((n: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-yellow-200 rounded text-xs flex items-center gap-1">
                      {n}
                      <button onClick={() => removeNeighborhood('yellow', i)} className="text-yellow-700">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Kırmızı Bölge */}
              <div className="p-3 bg-red-100 rounded-lg border-2 border-red-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-800">🔴 Kırmızı Bölge (Uzak)</span>
                  <input
                    type="number"
                    value={data.pricingConfig?.zones?.red?.price || 60}
                    onChange={(e) => {
                      const zones = data.pricingConfig?.zones || {};
                      updateConfig('zones', {
                        ...zones,
                        red: { ...zones.red, price: parseFloat(e.target.value) },
                      });
                    }}
                    className="w-24 px-3 py-1 border border-red-300 rounded text-right"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNeighborhood}
                    onChange={(e) => setNewNeighborhood(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && selectedZone === 'red' && addNeighborhood()}
                    placeholder="Mahalle ekle..."
                    className="flex-1 px-3 py-1 border border-red-300 rounded text-sm"
                  />
                  <button
                    onClick={() => { setSelectedZone('red'); addNeighborhood(); }}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.pricingConfig?.zones?.red?.neighborhoods?.map((n: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-red-200 rounded text-xs flex items-center gap-1">
                      {n}
                      <button onClick={() => removeNeighborhood('red', i)} className="text-red-700">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-800">Çalışma Tipi Seçimi</h3>
        <p className="text-sm text-gray-500 mt-1">Restoran için uygulanacak fiyatlandırma modelini seçin</p>
      </div>

      {/* Grid of 9 pricing types */}
      <div className="grid grid-cols-3 gap-3">
        {PRICING_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => handleTypeSelect(type.id)}
            className={`
              p-3 rounded-xl border-2 text-left transition-all
              ${data.pricingType === type.id
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="text-xl mb-1">{type.icon}</div>
            <div className="font-medium text-xs text-gray-800">{type.title}</div>
            <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{type.description}</div>
          </button>
        ))}
      </div>

      {/* Dynamic config fields */}
      {renderConfigFields()}
    </div>
  );
}
