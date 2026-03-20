import React from 'react';

interface BusinessSettingsStepProps {
  data: {
    supportPhone: string;
    technicalContactName: string;
    creditCardCommission: number;
    pickupTimeMinutes: number;
  };
  onChange: (data: any) => void;
}

export function BusinessSettingsStep({ data, onChange }: BusinessSettingsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800">İşletme Ayarları</h3>
        <p className="text-sm text-gray-500 mt-1">
          Restoranın operasyonel ayarlarını yapınız
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destek Telefonu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destek Telefonu
          </label>
          <input
            type="tel"
            value={data.supportPhone}
            onChange={(e) => onChange({ supportPhone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="05XXXXXXXXX"
          />
        </div>

        {/* Teknik Destek */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teknik Destek
          </label>
          <input
            type="text"
            value={data.technicalContactName}
            onChange={(e) => onChange({ technicalContactName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Teknik sorumlu adı"
          />
        </div>

        {/* Kredi Kartı Komisyonu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kredi Kartı Komisyonu (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.creditCardCommission}
            onChange={(e) => onChange({ creditCardCommission: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Teslim Alma Süresi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teslim Alma Süresi (dakika)
          </label>
          <input
            type="number"
            min="5"
            max="120"
            value={data.pickupTimeMinutes}
            onChange={(e) => onChange({ pickupTimeMinutes: parseInt(e.target.value) || 30 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
