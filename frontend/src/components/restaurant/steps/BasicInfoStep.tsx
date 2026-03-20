import React from 'react';

interface BasicInfoStepProps {
  data: {
    name: string;
    brandName: string;
    email: string;
    taxNumber: string;
  };
  onChange: (data: any) => void;
}

export function BasicInfoStep({ data, onChange }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800">Temel Bilgiler</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Restoran Adı */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Restoran Adı *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Örn: Ateş Döner"
          />
        </div>

        {/* Marka Adı */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marka Adı (Opsiyonel)
          </label>
          <input
            type="text"
            value={data.brandName}
            onChange={(e) => onChange({ brandName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Örn: Ateş Döner Şirketi"
          />
        </div>

        {/* E-posta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-posta *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="ornek@restoran.com"
          />
        </div>

        {/* Vergi Numarası */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vergi Numarası
          </label>
          <input
            type="text"
            value={data.taxNumber}
            onChange={(e) => onChange({ taxNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="1234567890"
          />
        </div>
      </div>
    </div>
  );
}
