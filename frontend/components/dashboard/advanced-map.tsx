"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import { Icon, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Phone, Clock, Package, User } from "lucide-react";

// Leaflet icon fix
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const createCourierIcon = (status: 'active' | 'idle' | 'offline') => {
  const colors = {
    active: '#22c55e',   // green-500
    idle: '#f97316',     // orange-500
    offline: '#6b7280',  // gray-500
  };

  return new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="${colors[status]}" stroke="white" stroke-width="3"/>
        <text x="20" y="25" text-anchor="middle" fill="white" font-size="16">🛵</text>
      </svg>
    `)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const restaurantIcon = new Icon({
  iconUrl: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="#dc2626" stroke="white" stroke-width="2"/>
      <text x="18" y="24" text-anchor="middle" fill="white" font-size="14">🍔</text>
    </svg>
  `)}`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const destinationIcon = new Icon({
  iconUrl: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="#2563eb" stroke="white" stroke-width="2"/>
      <text x="18" y="24" text-anchor="middle" fill="white" font-size="14">🏠</text>
    </svg>
  `)}`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Types
interface Courier {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'idle' | 'offline';
  position: LatLngTuple;
  heading?: number;
  speed?: number;
  currentOrder?: {
    id: string;
    restaurant: string;
    customer: string;
    destination: LatLngTuple;
  };
}

interface Restaurant {
  id: string;
  name: string;
  position: LatLngTuple;
  address: string;
}

// Map Controller Component
function MapController({ center }: { center: LatLngTuple }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  
  return null;
}

// Main Map Component
export default function AdvancedMap() {
  const [couriers, setCouriers] = useState<Courier[]>([
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      phone: '0555 123 4567',
      status: 'active',
      position: [41.0082, 28.9784],
      heading: 45,
      speed: 25,
      currentOrder: {
        id: 'ORD-001',
        restaurant: 'Burger King - Taksim',
        customer: 'Mehmet Kaya',
        destination: [41.015, 28.985],
      },
    },
    {
      id: '2',
      name: 'Mehmet Demir',
      phone: '0555 987 6543',
      status: 'idle',
      position: [41.012, 28.975],
      heading: 90,
    },
    {
      id: '3',
      name: 'Ali Kaya',
      phone: '0555 456 7890',
      status: 'offline',
      position: [41.005, 28.97],
    },
  ]);

  const [restaurants] = useState<Restaurant[]>([
    { id: '1', name: 'Burger King - Taksim', position: [41.01, 28.98], address: 'Taksim Meydanı No:1' },
    { id: '2', name: 'McDonald\'s - Şişli', position: [41.06, 28.99], address: 'Şişli Merkez' },
    { id: '3', name: 'KFC - Beşiktaş', position: [41.042, 28.99], address: 'Beşiktaş Meydanı' },
  ]);

  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [mapCenter] = useState<LatLngTuple>([41.0082, 28.9784]);
  const [tileLayer, setTileLayer] = useState<'standard' | 'dark'>('standard');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCouriers(prev => prev.map(courier => {
        if (courier.status !== 'active') return courier;
        
        // Simulate small movement
        const newLat = courier.position[0] + (Math.random() - 0.5) * 0.001;
        const newLng = courier.position[1] + (Math.random() - 0.5) * 0.001;
        
        return {
          ...courier,
          position: [newLat, newLng] as LatLngTuple,
          heading: (courier.heading || 0) + (Math.random() - 0.5) * 10,
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const tileUrls = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  };

  return (
    <div className="relative">
      {/* Tile Layer Toggle */}
      <div className="absolute bottom-4 right-4 z-[400] bg-white rounded-lg shadow-lg p-2 flex gap-2">
        <button
          onClick={() => setTileLayer('standard')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            tileLayer === 'standard' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Standart
        </button>
        <button
          onClick={() => setTileLayer('dark')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            tileLayer === 'dark' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Karanlık
        </button>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '500px', width: '100%', borderRadius: '0 0 0.75rem 0.75rem' }}
      >
        <MapController center={mapCenter} />
        
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={tileUrls[tileLayer]}
        />

        {/* Courier Markers */}
        {couriers.map(courier => (
          <Marker
            key={courier.id}
            position={courier.position}
            icon={createCourierIcon(courier.status)}
            eventHandlers={{
              click: () => setSelectedCourier(courier),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${
                    courier.status === 'active' ? 'bg-green-500 animate-pulse' :
                    courier.status === 'idle' ? 'bg-orange-500' : 'bg-gray-500'
                  }`} />
                  <span className="font-semibold text-gray-900">{courier.name}</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    {courier.phone}
                  </div>
                  
                  {courier.speed && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Navigation className="w-4 h-4" />
                      {courier.speed} km/s
                    </div>
                  )}
                  
                  {courier.currentOrder ? (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900 mb-1 flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        Aktif Sipariş
                      </div>
                      <div className="text-blue-700 text-xs">
                        {courier.currentOrder.restaurant}
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        → {courier.currentOrder.customer}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-gray-500">
                      Aktif sipariş yok
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Restaurant Markers */}
        {restaurants.map(restaurant => (
          <Marker
            key={restaurant.id}
            position={restaurant.position}
            icon={restaurantIcon}
          >
            <Popup>
              <div className="p-2">
                <div className="font-semibold text-gray-900 mb-1">{restaurant.name}</div>
                <div className="text-sm text-gray-600">{restaurant.address}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Active Delivery Routes */}
        {couriers
          .filter(c => c.currentOrder && c.status === 'active')
          .map(courier => (
            <Polyline
              key={`route-${courier.id}`}
              positions={[courier.position, courier.currentOrder!.destination]}
              color="#2563eb"
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          ))}

        {/* Delivery Destinations */}
        {couriers
          .filter(c => c.currentOrder)
          .map(courier => (
            <Marker
              key={`dest-${courier.id}`}
              position={courier.currentOrder!.destination}
              icon={destinationIcon}
            >
              <Popup>
                <div className="p-2">
                  <div className="font-semibold text-gray-900">Teslimat Noktası</div>
                  <div className="text-sm text-gray-600">{courier.currentOrder!.customer}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Coverage Area */}
        <Circle
          center={mapCenter}
          radius={5000}
          pathOptions={{ 
            fillColor: '#3b82f6', 
            fillOpacity: 0.05, 
            color: '#3b82f6', 
            weight: 1,
            dashArray: '5, 5'
          }}
        />
      </MapContainer>

      {/* Selected Courier Info Panel */}
      {selectedCourier && (
        <div className="absolute bottom-4 left-4 z-[400] bg-white rounded-xl shadow-lg p-4 min-w-[280px] max-w-[320px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                selectedCourier.status === 'active' ? 'bg-green-500' :
                selectedCourier.status === 'idle' ? 'bg-orange-500' : 'bg-gray-500'
              }`} />
              <span className="font-semibold text-gray-900">{selectedCourier.name}</span>
            </div>
            <button 
              onClick={() => setSelectedCourier(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              {selectedCourier.phone}
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Navigation className="w-4 h-4" />
              {selectedCourier.speed || 0} km/s
            </div>
            
            {selectedCourier.currentOrder ? (
              <>
                <div className="mt-3 pt-3 border-t">
                  <div className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                    <Package className="w-4 h-4 text-blue-600" />
                    Aktif Sipariş
                  </div>
                  <div className="text-sm text-gray-700">
                    <div className="mb-1">
                      <span className="text-gray-500">Restoran:</span> {selectedCourier.currentOrder.restaurant}
                    </div>
                    <div>
                      <span className="text-gray-500">Müşteri:</span> {selectedCourier.currentOrder.customer}
                    </div>
                  </div>
                  
                  <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Rotayı Gör
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 pt-3 border-t text-center text-gray-500 text-sm">
                Aktif sipariş bulunmuyor
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
