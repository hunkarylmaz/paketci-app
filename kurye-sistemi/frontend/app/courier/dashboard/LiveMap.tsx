'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const BODRUM_CENTER: [number, number] = [37.0344, 27.4305];

const colors = {
  primary: '#6B46C1', primaryDark: '#5c3cbb', primaryLight: '#7C3AED',
  sidebarBg: '#4c1d95', white: '#FFFFFF', yellow: '#FCD34D',
  gray50: '#F9FAFB', gray100: '#F3F4F6', gray200: '#E5E7EB',
  gray300: '#D1D5DB', gray400: '#9CA3AF', gray500: '#6B7280',
  gray600: '#4B5563', gray700: '#374151', gray800: '#1F2937',
  green: '#10B981', red: '#EF4444', orange: '#F97316', blue: '#3B82F6'
};

interface Courier {
  id: number; name: string; phone: string; email: string;
  status: 'active' | 'onway' | 'passive' | 'offline';
  deliveries: number; rating: number;
  location: { lat: number; lng: number } | null;
  vehicleType: 'motorcycle' | 'bicycle' | 'car';
  joinDate: string;
}

interface Restaurant {
  id: number; name: string; phone: string; address: string;
  status: 'active' | 'inactive'; orders: number; rating: number;
  commission: number; location: { lat: number; lng: number };
}

export default function LiveMap({ couriers, restaurants }: { couriers: Courier[], restaurants: Restaurant[] }) {
  return (
    <MapContainer center={BODRUM_CENTER} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
      />
      {restaurants.map((r) => (
        <Marker key={`r-${r.id}`} position={[r.location.lat, r.location.lng]}>
          <Popup>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>🏪 {r.name}</div>
              <div style={{ fontSize: 12, color: colors.gray600, marginTop: 4 }}>{r.address}</div>
              <div style={{ marginTop: 8, fontSize: 12 }}>⭐ {r.rating} • 📦 {r.orders} • %{r.commission}</div>
            </div>
          </Popup>
        </Marker>
      ))}
      {couriers.filter(c => c.location).map((c) => (
        <Marker key={`c-${c.id}`} position={[c.location!.lat, c.location!.lng]}>
          <Popup>
            <div style={{ minWidth: 150 }}>
              <div style={{ fontWeight: 700 }}>🚴 {c.name}</div>
              <div style={{ fontSize: 12, color: colors.gray600 }}>{c.phone}</div>
              <div style={{ marginTop: 4, fontSize: 12 }}>⭐ {c.rating} • {c.deliveries} teslimat</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
