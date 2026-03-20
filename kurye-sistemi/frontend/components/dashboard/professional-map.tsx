"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap, ZoomControl } from "react-leaflet";
import { Icon, LatLngTuple, DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Navigation, Phone, Clock, Package, User, MapPin, TrendingUp, 
  Zap, Shield, AlertTriangle, ChevronRight, X, Route, Battery,
  Thermometer, DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";

// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Enhanced Type Definitions
interface Courier {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'idle' | 'offline' | 'busy' | 'break';
  position: LatLngTuple;
  heading?: number;
  speed?: number;
  batteryLevel?: number;
  temperature?: number;
  earnings?: number;
  rating?: number;
  completedDeliveries?: number;
  currentOrder?: {
    id: string;
    restaurant: string;
    customer: string;
    destination: LatLngTuple;
    estimatedTime: string;
    items: string[];
    totalAmount: number;
  };
}

interface Restaurant {
  id: string;
  name: string;
  position: LatLngTuple;
  address: string;
  cuisine?: string;
  rating?: number;
  orderCount?: number;
  status: 'open' | 'closed' | 'busy';
  phone?: string;
}

interface Zone {
  id: string;
  name: string;
  center: LatLngTuple;
  radius: number;
  courierCount: number;
  orderDensity: 'low' | 'medium' | 'high';
  color: string;
}

// Professional Custom Icons
const createCourierIcon = (status: Courier['status'], heading: number = 0, isSelected: boolean = false) => {
  const colors = {
    active: '#10b981',    // emerald-500
    idle: '#f59e0b',      // amber-500
    offline: '#6b7280',   // gray-500
    busy: '#3b82f6',      // blue-500
    break: '#8b5cf6',     // violet-500
  };

  const pulseAnimation = status === 'active' ? 'animate-pulse' : '';
  const scale = isSelected ? 'scale-125' : 'scale-100';

  return new DivIcon({
    className: 'custom-courier-marker',
    html: `
      <div class="relative ${scale} transition-transform duration-300">
        <div class="absolute -inset-2 rounded-full ${pulseAnimation}" style="background: ${colors[status]}20;"></div>
        <div class="relative w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center"
             style="background: ${colors[status]}; transform: rotate(${heading}deg);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M12 2L4 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-8-5z"/>
            <path d="M12 7v10"/>
          </svg>
        </div>
        <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow">
          <div class="w-2.5 h-2.5 rounded-full" style="background: ${colors[status]}"></div>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const restaurantIcons: Record<Restaurant['status'], DivIcon> = {
  open: new DivIcon({
    className: 'custom-restaurant-marker',
    html: `
      <div class="relative group">
        <div class="absolute -inset-1 rounded-full opacity-75 animate-ping" style="background: #22c55e30;"></div>
        <div class="relative w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-600 border-2 border-white shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
            <path d="M7 2v20"/>
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  }),
  closed: new DivIcon({
    className: 'custom-restaurant-marker',
    html: `
      <div class="relative w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-white shadow-lg flex items-center justify-center opacity-70">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
          <path d="M7 2v20"/>
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  }),
  busy: new DivIcon({
    className: 'custom-restaurant-marker',
    html: `
      <div class="relative">
        <div class="absolute -inset-1 rounded-full opacity-75 animate-pulse" style="background: #f59e0b30;"></div>
        <div class="relative w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 border-2 border-white shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
            <path d="M7 2v20"/>
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  }),
};

const destinationIcon = new DivIcon({
  className: 'custom-destination-marker',
  html: `
    <div class="relative">
      <div class="absolute -inset-2 rounded-full animate-pulse" style="background: #3b82f620;"></div>
      <div class="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-3 border-white shadow-xl flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-blue-500"></div>
    </div>
  `,
  iconSize: [40, 48],
  iconAnchor: [20, 48],
});

// Map Controller Component
function MapController({ center, zoom }: { center: LatLngTuple; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  
  return null;
}

// Heatmap Layer Component (Simulated with Circles)
function HeatmapLayer({ zones }: { zones: Zone[] }) {
  return (
    <>
      {zones.map((zone) => (
        <Circle
          key={zone.id}
          center={zone.center}
          radius={zone.radius}
          pathOptions={{
            fillColor: zone.color,
            fillOpacity: zone.orderDensity === 'high' ? 0.3 : zone.orderDensity === 'medium' ? 0.2 : 0.1,
            color: zone.color,
            weight: 2,
            dashArray: '5, 5',
          }}
        />
      ))}
    </>
  );
}

// Status Badge Component
const StatusBadge = ({ status }: { status: Courier['status'] }) => {
  const config = {
    active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Aktif', icon: Zap },
    idle: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Bekliyor', icon: Clock },
    offline: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Çevrimdışı', icon: X },
    busy: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Meşgul', icon: Package },
    break: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'Mola', icon: Coffee },
  };

  const { bg, text, label, icon: Icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

// Import Coffee icon
import { Coffee } from "lucide-react";

// Main Professional Map Component
interface ProfessionalMapProps {
  couriers?: Courier[];
  restaurants?: Restaurant[];
  zones?: Zone[];
  height?: string;
  showHeatmap?: boolean;
  showRoutes?: boolean;
  className?: string;
}

export default function ProfessionalMap({
  couriers: propCouriers,
  restaurants: propRestaurants,
  zones: propZones,
  height = '600px',
  showHeatmap = true,
  showRoutes = true,
  className = '',
}: ProfessionalMapProps) {
  // Default mock data
  const [couriers, setCouriers] = useState<Courier[]>(propCouriers || [
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      phone: '0555 123 4567',
      avatar: 'https://i.pravatar.cc/150?u=1',
      status: 'active',
      position: [41.0082, 28.9784],
      heading: 45,
      speed: 25,
      batteryLevel: 85,
      temperature: 18,
      earnings: 456,
      rating: 4.9,
      completedDeliveries: 23,
      currentOrder: {
        id: 'ORD-001',
        restaurant: 'Burger King - Taksim',
        customer: 'Mehmet Kaya',
        destination: [41.015, 28.985],
        estimatedTime: '12 dk',
        items: ['Whopper Menü', 'Patates Kızartması', 'Kola'],
        totalAmount: 189.50,
      },
    },
    {
      id: '2',
      name: 'Mehmet Demir',
      phone: '0555 987 6543',
      avatar: 'https://i.pravatar.cc/150?u=2',
      status: 'idle',
      position: [41.012, 28.975],
      heading: 90,
      speed: 0,
      batteryLevel: 92,
      temperature: 20,
      earnings: 234,
      rating: 4.8,
      completedDeliveries: 15,
    },
    {
      id: '3',
      name: 'Ali Kaya',
      phone: '0555 456 7890',
      avatar: 'https://i.pravatar.cc/150?u=3',
      status: 'busy',
      position: [41.005, 28.97],
      heading: 180,
      speed: 15,
      batteryLevel: 67,
      temperature: 19,
      earnings: 567,
      rating: 4.7,
      completedDeliveries: 31,
      currentOrder: {
        id: 'ORD-002',
        restaurant: 'McDonald\'s - Şişli',
        customer: 'Ayşe Yıldız',
        destination: [41.02, 28.98],
        estimatedTime: '8 dk',
        items: ['Big Mac Menü', 'Nugget 6\'lı'],
        totalAmount: 245.00,
      },
    },
  ]);

  const [restaurants] = useState<Restaurant[]>(propRestaurants || [
    { id: '1', name: 'Burger King - Taksim', position: [41.01, 28.98], address: 'Taksim Meydanı No:1', cuisine: 'Fast Food', rating: 4.5, orderCount: 234, status: 'open', phone: '0212 123 4567' },
    { id: '2', name: 'McDonald\'s - Şişli', position: [41.06, 28.99], address: 'Şişli Merkez', cuisine: 'Fast Food', rating: 4.3, orderCount: 189, status: 'busy', phone: '0212 987 6543' },
    { id: '3', name: 'KFC - Beşiktaş', position: [41.042, 28.99], address: 'Beşiktaş Meydanı', cuisine: 'Fast Food', rating: 4.4, orderCount: 156, status: 'open', phone: '0212 456 7890' },
    { id: '4', name: 'Domino\'s Pizza - Kadıköy', position: [40.99, 29.03], address: 'Caferağa Mah.', cuisine: 'Pizza', rating: 4.6, orderCount: 312, status: 'closed', phone: '0216 111 2233' },
  ]);

  const [zones] = useState<Zone[]>(propZones || [
    { id: '1', name: 'Taksim Bölgesi', center: [41.0082, 28.9784], radius: 2000, courierCount: 8, orderDensity: 'high', color: '#ef4444' },
    { id: '2', name: 'Şişli Bölgesi', center: [41.06, 28.99], radius: 1500, courierCount: 5, orderDensity: 'medium', color: '#f59e0b' },
    { id: '3', name: 'Kadıköy Bölgesi', center: [40.99, 29.03], radius: 1800, courierCount: 6, orderDensity: 'high', color: '#ef4444' },
  ]);

  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([41.0082, 28.9784]);
  const [mapZoom, setMapZoom] = useState(13);
  const [tileLayer, setTileLayer] = useState<'standard' | 'dark' | 'satellite'>('standard');
  const [activeFilters, setActiveFilters] = useState({
    couriers: true,
    restaurants: true,
    heatmap: showHeatmap,
    routes: showRoutes,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCouriers(prev => prev.map(courier => {
        if (courier.status !== 'active') return courier;
        
        const newLat = courier.position[0] + (Math.random() - 0.5) * 0.002;
        const newLng = courier.position[1] + (Math.random() - 0.5) * 0.002;
        
        return {
          ...courier,
          position: [newLat, newLng] as LatLngTuple,
          heading: (courier.heading || 0) + (Math.random() - 0.5) * 15,
          speed: Math.max(0, Math.min(40, (courier.speed || 20) + (Math.random() - 0.5) * 5)),
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const tileUrls = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  const activeCouriers = useMemo(() => couriers.filter(c => c.status === 'active' || c.status === 'busy'), [couriers]);
  const idleCouriers = useMemo(() => couriers.filter(c => c.status === 'idle'), [couriers]);

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${className}`} style={{ height }}>
      {/* Map Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between gap-4">
        {/* Stats Cards */}
        <div className="flex gap-3">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Aktif Kurye</p>
              <p className="text-lg font-bold text-gray-900">{activeCouriers.length}</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-200">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Bekleyen</p>
              <p className="text-lg font-bold text-gray-900">{idleCouriers.length}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Aktif Sipariş</p>
              <p className="text-lg font-bold text-gray-900">{couriers.filter(c => c.currentOrder).length}</p>
            </div>
          </motion.div>
        </div>

        {/* Tile Layer Toggle */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-1.5 flex gap-1">
          {(['standard', 'dark', 'satellite'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setTileLayer(layer)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tileLayer === layer 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {layer === 'standard' ? 'Standart' : layer === 'dark' ? 'Karanlık' : 'Uydu'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="absolute top-24 left-4 z-[400] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-2 space-y-2">
        <button
          onClick={() => setActiveFilters(p => ({ ...p, couriers: !p.couriers }))}
          className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
            activeFilters.couriers ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${activeFilters.couriers ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          Kuryeler
        </button>
        <button
          onClick={() => setActiveFilters(p => ({ ...p, restaurants: !p.restaurants }))}
          className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
            activeFilters.restaurants ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${activeFilters.restaurants ? 'bg-red-500' : 'bg-gray-400'}`} />
          Restoranlar
        </button>
        <button
          onClick={() => setActiveFilters(p => ({ ...p, heatmap: !p.heatmap }))}
          className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
            activeFilters.heatmap ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${activeFilters.heatmap ? 'bg-orange-500' : 'bg-gray-400'}`} />
          Isı Haritası
        </button>
        <button
          onClick={() => setActiveFilters(p => ({ ...p, routes: !p.routes }))}
          className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
            activeFilters.routes ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${activeFilters.routes ? 'bg-blue-500' : 'bg-gray-400'}`} />
          Rotalar
        </button>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <ZoomControl position="bottomright" />
        <MapController center={mapCenter} zoom={mapZoom} />
        
        {/* Tile Layer */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url={tileUrls[tileLayer]}
        />

        {/* Heatmap */}
        {activeFilters.heatmap && <HeatmapLayer zones={zones} />}

        {/* Courier Markers */}
        {activeFilters.couriers && couriers.map((courier) => (
          <Marker
            key={courier.id}
            position={courier.position}
            icon={createCourierIcon(courier.status, courier.heading, selectedCourier?.id === courier.id)}
            eventHandlers={{
              click: () => setSelectedCourier(courier),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-3 min-w-[280px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    courier.status === 'active' ? 'bg-emerald-500' :
                    courier.status === 'idle' ? 'bg-amber-500' :
                    courier.status === 'busy' ? 'bg-blue-500' :
                    courier.status === 'break' ? 'bg-violet-500' : 'bg-gray-500'
                  }`}>
                    {courier.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{courier.name}</p>
                    <StatusBadge status={courier.status} />
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    {courier.phone}
                  </div>
                  
                  {courier.speed !== undefined && courier.speed > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Navigation className="w-4 h-4" />
                      {courier.speed.toFixed(1)} km/s
                    </div>
                  )}

                  {courier.batteryLevel !== undefined && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Battery className="w-4 h-4" />
                      %{courier.batteryLevel}
                    </div>
                  )}
                  
                  {courier.currentOrder ? (
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Aktif Sipariş #{courier.currentOrder.id}
                      </div>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><span className="text-blue-600">Restoran:</span> {courier.currentOrder.restaurant}</p>
                        <p><span className="text-blue-600">Müşteri:</span> {courier.currentOrder.customer}</p>
                        <p><span className="text-blue-600">Tahmini:</span> {courier.currentOrder.estimatedTime}</p>
                        <p><span className="text-blue-600">Tutar:</span> ₺{courier.currentOrder.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-2 text-center">
                      Aktif sipariş bulunmuyor
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Restaurant Markers */}
        {activeFilters.restaurants && restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={restaurant.position}
            icon={restaurantIcons[restaurant.status]}
          >
            <Popup>
              <div className="p-3 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    restaurant.status === 'open' ? 'bg-green-500' :
                    restaurant.status === 'busy' ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                  <span className={`text-xs font-medium uppercase ${
                    restaurant.status === 'open' ? 'text-green-600' :
                    restaurant.status === 'busy' ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                    {restaurant.status === 'open' ? 'Açık' : restaurant.status === 'busy' ? 'Meşgul' : 'Kapalı'}
                  </span>
                </div>
                <p className="font-semibold text-gray-900">{restaurant.name}</p>
                <p className="text-sm text-gray-600 mt-1">{restaurant.address}</p>
                {restaurant.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                    <span className="text-xs text-gray-500">({restaurant.orderCount} sipariş)</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Delivery Routes */}
        {activeFilters.routes && couriers
          .filter(c => c.currentOrder && (c.status === 'active' || c.status === 'busy'))
          .map(courier => (
            <Polyline
              key={`route-${courier.id}`}
              positions={[courier.position, courier.currentOrder!.destination]}
              color="#3b82f6"
              weight={4}
              opacity={0.8}
              dashArray="8, 8"
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
                  <div className="text-xs text-blue-600 mt-1">Tahmini: {courier.currentOrder!.estimatedTime}</div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Selected Courier Info Panel */}
      <AnimatePresence>
        {selectedCourier && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="absolute bottom-4 left-4 z-[400] bg-white rounded-2xl shadow-2xl p-5 min-w-[320px] max-w-[360px]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl ${
                  selectedCourier.status === 'active' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                  selectedCourier.status === 'idle' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                  selectedCourier.status === 'busy' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                  selectedCourier.status === 'break' ? 'bg-gradient-to-br from-violet-500 to-violet-600' : 'bg-gray-500'
                }`}>
                  {selectedCourier.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selectedCourier.name}</h3>
                  <StatusBadge status={selectedCourier.status} />
                </div>
              </div>
              <button 
                onClick={() => setSelectedCourier(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 text-center">
                <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-700">{selectedCourier.rating}</p>
                <p className="text-xs text-emerald-600">Puan</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center">
                <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-700">{selectedCourier.completedDeliveries}</p>
                <p className="text-xs text-blue-600">Teslimat</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 text-center">
                <DollarSign className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-amber-700">₺{selectedCourier.earnings}</p>
                <p className="text-xs text-amber-600">Kazanç</p>
              </div>
            </div>
            
            {/* Contact & Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{selectedCourier.phone}</span>
              </div>
              
              {selectedCourier.speed !== undefined && selectedCourier.speed > 0 && (
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                  <Navigation className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{selectedCourier.speed.toFixed(1)} km/s</span>
                </div>
              )}
            </div>
            
            {/* Current Order */}
            {selectedCourier.currentOrder ? (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">Aktif Sipariş</p>
                    <p className="text-xs text-blue-600">#{selectedCourier.currentOrder.id}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">{selectedCourier.currentOrder.restaurant}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">{selectedCourier.currentOrder.customer}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                    <span className="text-blue-600">Tahmini: {selectedCourier.currentOrder.estimatedTime}</span>
                    <span className="font-semibold text-blue-700">₺{selectedCourier.currentOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <button className="mt-3 w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                  <Route className="w-4 h-4" />
                  Rotayı Gör
                </button>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-sm text-gray-500">Aktif sipariş bulunmuyor</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
