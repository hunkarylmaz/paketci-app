import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { 
  Navigation, 
  Phone, 
  User, 
  Clock, 
  MapPin,
  Truck,
  RotateCcw
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import { api } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import toast from 'react-hot-toast';

// Kurye ikonu
const courierIcon = new Icon({
  iconUrl: '/images/marker-courier.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Restoran ikonu
const restaurantIcon = new Icon({
  iconUrl: '/images/marker-restaurant.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Müşteri ikonu
const customerIcon = new Icon({
  iconUrl: '/images/marker-customer.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Courier {
  id: string;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  currentOrder?: {
    id: string;
    customerName: string;
    customerPhone: string;
    address: string;
    status: string;
  };
  lastSeen: string;
}

interface ActiveOrder {
  id: string;
  courierId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLatitude: number;
  customerLongitude: number;
  restaurantLatitude: number;
  restaurantLongitude: number;
  status: string;
  estimatedDelivery: string;
}

// Harita merkezini kuryelere göre ayarla
function MapController({ couriers }: { couriers: Courier[] }) {
  const map = useMap();

  useEffect(() => {
    if (couriers.length > 0) {
      const bounds = couriers.map(c => [c.latitude, c.longitude]);
      if (bounds.length > 0) {
        map.fitBounds(bounds as any, { padding: [50, 50] });
      }
    }
  }, [couriers, map]);

  return null;
}

export default function LiveTracking() {
  const { courierLocations, joinOrderTracking, leaveOrderTracking } = useSocket();
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [mapCenter] = useState<[number, number]>([41.0082, 28.9784]); // İstanbul

  // Aktif kuryeleri getir
  const { data: couriers = [], refetch } = useQuery<Courier[]>({
    queryKey: ['couriers'],
    queryFn: async () => {
      const response = await api.get('/restaurant/couriers/active');
      return response.data;
    },
    refetchInterval: 10000, // 10 saniyede bir
  });

  // Aktif siparişleri getir
  const { data: activeOrders = [] } = useQuery<ActiveOrder[]>({
    queryKey: ['active-orders'],
    queryFn: async () => {
      const response = await api.get('/restaurant/orders/active');
      return response.data;
    },
    refetchInterval: 10000,
  });

  // WebSocket konum güncellemelerini uygula
  const getCourierPosition = useCallback((courier: Courier): [number, number] => {
    const wsLocation = courierLocations.get(courier.id);
    if (wsLocation) {
      return [wsLocation.latitude, wsLocation.longitude];
    }
    return [courier.latitude, courier.longitude];
  }, [courierLocations]);

  // Kurye takibi başlat
  useEffect(() => {
    activeOrders.forEach(order => {
      if (order.courierId) {
        joinOrderTracking(order.id, order.courierId);
      }
    });

    return () => {
      activeOrders.forEach(order => {
        if (order.courierId) {
          leaveOrderTracking(order.id, order.courierId);
        }
      });
    };
  }, [activeOrders, joinOrderTracking, leaveOrderTracking]);

  // Kuryeyi ara
  const callCourier = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  // Navigasyon başlat
  const startNavigation = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Canlı Takip</h1>
            <button
              onClick={() => refetch()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Yenile"
            >
              <RotateCcw className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="mt-4 flex gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Müsait ({couriers.filter(c => c.status === 'AVAILABLE').length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600">Görevde ({couriers.filter(c => c.status === 'BUSY').length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-600">Çevrimdışı ({couriers.filter(c => c.status === 'OFFLINE').length})</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {couriers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Truck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aktif kurye bulunmuyor</p>
              </div>
            ) : (
              couriers.map((courier) => (
                <button
                  key={courier.id}
                  onClick={() => setSelectedCourier(courier)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedCourier?.id === courier.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {courier.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                          courier.status === 'AVAILABLE' ? 'bg-green-500' :
                          courier.status === 'BUSY' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-900">{courier.name}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(courier.lastSeen).toLocaleTimeString('tr-TR')}
                        </div>
                      </div>
                    </div>

                    {courier.currentOrder && (
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        Görevde
                      </div>
                    )}
                  </div>

                  {courier.currentOrder && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        #{courier.currentOrder.id}
                      </div>
                      <div className="text-sm text-gray-500">{courier.currentOrder.customerName}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            callCourier(courier.phone);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Ara
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigasyon başlat
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Navigasyon
                        </button>
                      </div>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController couriers={couriers} />

          {/* Kurye markerları */}
          {couriers.map((courier) => {
            const position = getCourierPosition(courier);
            return (
              <Marker
                key={courier.id}
                position={position}
                icon={courierIcon}
                eventHandlers={{
                  click: () => setSelectedCourier(courier),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <div className="font-semibold">{courier.name}</div>
                    <div className="text-sm text-gray-500">{courier.phone}</div>
                    {courier.currentOrder && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="text-sm font-medium">#{courier.currentOrder.id}</div>
                        <div className="text-sm">{courier.currentOrder.customerName}</div>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Aktif sipariş rotaları */}
          {activeOrders.map((order) => {
            if (!order.courierId) return null;
            
            const courier = couriers.find(c => c.id === order.courierId);
            if (!courier) return null;

            const courierPos = getCourierPosition(courier);
            
            return (
              <Polyline
                key={order.id}
                positions={[
                  courierPos,
                  [order.customerLatitude, order.customerLongitude],
                ]}
                color="#1E40AF"
                weight={3}
                dashArray="5, 10"
                opacity={0.7}
              />
            );
          })}

          {/* Müşteri konumları */}
          {activeOrders.map((order) => (
            <Marker
              key={`customer-${order.id}`}
              position={[order.customerLatitude, order.customerLongitude]}
              icon={customerIcon}
            >
              <Popup>
                <div className="p-2">
                  <div className="font-semibold">{order.customerName}</div>
                  <div className="text-sm text-gray-500">{order.customerAddress}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Info Card */}
        {selectedCourier && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold"
                >
                  {selectedCourier.name.charAt(0).toUpperCase()}
                </div>
                
                <div>
                  <div className="text-lg font-bold text-gray-900">{selectedCourier.name}</div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {selectedCourier.phone}
                  </div>
                  
                  {selectedCourier.currentOrder && (
                    <div className="mt-1 text-sm text-blue-600">
                      #{selectedCourier.currentOrder.id} - {selectedCourier.currentOrder.customerName}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => callCourier(selectedCourier.phone)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Ara
                </button>
                
                <button
                  onClick={() => setSelectedCourier(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
