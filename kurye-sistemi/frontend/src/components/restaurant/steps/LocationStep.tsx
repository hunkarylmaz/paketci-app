'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LocationStepProps {
  data: {
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
  };
  onChange: (data: any) => void;
}

export function LocationStep({ data, onChange }: LocationStepProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Default to Istanbul coordinates
  const defaultLat = 41.0082;
  const defaultLng = 28.9784;

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // Check if already loaded
      if ((window as any).L) {
        initMap();
        return;
      }

      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    };

    loadLeaflet();
  }, []);

  const initMap = () => {
    if (!mapRef.current || !(window as any).L) return;

    const L = (window as any).L;
    const initialLat = data.location.latitude || defaultLat;
    const initialLng = data.location.longitude || defaultLng;

    const newMap = L.map(mapRef.current).setView([initialLat, initialLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(newMap);

    const newMarker = L.marker([initialLat, initialLng], {
      draggable: true,
    }).addTo(newMap);

    newMarker.on('dragend', (e: any) => {
      const pos = e.target.getLatLng();
      updateLocation(pos.lat, pos.lng);
    });

    newMap.on('click', (e: any) => {
      newMarker.setLatLng(e.latlng);
      updateLocation(e.latlng.lat, e.latlng.lng);
    });

    setMap(newMap);
    setMarker(newMarker);
  };

  const updateLocation = (lat: number, lng: number) => {
    onChange({
      location: { latitude: lat, longitude: lng },
    });

    // Reverse geocoding (mock - should call API)
    // In real implementation, this would call your backend API
    // to get address from coordinates
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // Call your backend API for geocoding
      const response = await fetch(`/api/restaurants/geocode/search?query=${encodeURIComponent(searchQuery)}`);
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        const location = result.data[0];
        const lat = location.lat;
        const lng = location.lng;

        if (map && marker) {
          map.setView([lat, lng], 16);
          marker.setLatLng([lat, lng]);
        }

        onChange({
          address: {
            full: location.address,
            district: location.district,
            city: location.city,
          },
          location: {
            latitude: lat,
            longitude: lng,
          },
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-800">Restoran Konumu</h3>
        <p className="text-sm text-gray-500 mt-1">
          Harita üzerinden restoranın konumunu belirleyiniz
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Adres ara (örn: Cudi Mah 3531 No 9)"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? '...' : '🔍 Ara'}
        </button>
      </div>

      {/* Map */}
      <div className="border rounded-lg overflow-hidden">
        <div ref={mapRef} className="w-full h-80" />
      </div>

      {/* Selected Location */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm">
          <span className="font-medium">Seçili Konum:</span>{' '}
          {data.location.latitude.toFixed(6)}, {data.location.longitude.toFixed(6)}
        </p>
      </div>

      {/* Address Fields */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açık Adres
          </label>
          <textarea
            value={data.address.full}
            onChange={(e) =>
              onChange({
                address: { ...data.address, full: e.target.value },
              })
            }
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Tam adres bilgisi"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İlçe
            </label>
            <input
              type="text"
              value={data.address.district}
              onChange={(e) =>
                onChange({
                  address: { ...data.address, district: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="İlçe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şehir
            </label>
            <input
              type="text"
              value={data.address.city}
              onChange={(e) =>
                onChange({
                  address: { ...data.address, city: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Şehir"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
