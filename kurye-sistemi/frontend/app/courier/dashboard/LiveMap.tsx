'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Courier {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  vehicleType: string;
  lat: number;
  lng: number;
  totalDeliveries: number;
  todayDeliveries: number;
}

interface Order {
  id: string;
  customerName: string;
  status: string;
  lat?: number;
  lng?: number;
  restaurantName: string;
}

interface Restaurant {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface LiveMapProps {
  couriers: Courier[];
  orders: Order[];
  restaurants: Restaurant[];
  selectedCourier?: string | null;
}

// Custom marker icons
const createCourierIcon = (status: string) => {
  const color = status === 'available' ? '#10B981' : status === 'busy' ? '#F59E0B' : '#6B7280';
  return L.divIcon({
    className: 'custom-courier-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
      ">🛵</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const createRestaurantIcon = () => {
  return L.divIcon({
    className: 'custom-restaurant-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: #EF4444;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
      ">🏪</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createOrderIcon = (status: string) => {
  const color = status === 'onway' ? '#2563EB' : '#8B5CF6';
  return L.divIcon({
    className: 'custom-order-marker',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
      ">📦</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export default function LiveMap({ couriers, orders, restaurants, selectedCourier }: LiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      center: [37.0344, 27.4305],
      zoom: 14,
      zoomControl: false,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Create layer group for markers
    const markers = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersRef.current = markers;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    // Clear existing markers
    markersRef.current.clearLayers();

    // Add restaurant markers
    restaurants.forEach((restaurant) => {
      const marker = L.marker([restaurant.lat, restaurant.lng], {
        icon: createRestaurantIcon(),
      }).addTo(markersRef.current!);

      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <div style="font-weight: 600; font-size: 14px;">🏪 ${restaurant.name}</div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">Restoran</div>
        </div>
      `);
    });

    // Add order markers
    orders.filter(o => o.lat && o.lng).forEach((order) => {
      const marker = L.marker([order.lat!, order.lng!], {
        icon: createOrderIcon(order.status),
      }).addTo(markersRef.current!);

      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <div style="font-weight: 600; font-size: 14px;">📦 ${order.id}</div>
          <div style="font-size: 13px; margin-top: 4px;">${order.customerName}</div>
          <div style="font-size: 12px; color: #666; margin-top: 2px;">${order.restaurantName}</div>
          <div style="font-size: 12px; color: #2563EB; margin-top: 4px; font-weight: 500;">${order.status === 'onway' ? 'Yolda' : 'Atandı'}</div>
        </div>
      `);
    });

    // Add courier markers
    couriers.forEach((courier) => {
      const marker = L.marker([courier.lat, courier.lng], {
        icon: createCourierIcon(courier.status),
        zIndexOffset: 1000, // Couriers on top
      }).addTo(markersRef.current!);

      const statusText = courier.status === 'available' ? 'Boşta' : courier.status === 'busy' ? 'Meşgul' : 'Çevrimdışı';
      
      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <div style="font-weight: 600; font-size: 14px;">🛵 ${courier.name}</div>
          <div style="font-size: 13px; color: #666; margin-top: 4px;">${courier.phone}</div>
          <div style="font-size: 12px; margin-top: 4px; padding: 2px 8px; background: ${courier.status === 'available' ? '#D1FAE5' : courier.status === 'busy' ? '#FEF3C7' : '#F3F4F6'}; border-radius: 12px; display: inline-block;">${statusText}</div>
          <div style="font-size: 12px; color: #2563EB; margin-top: 4px;">📦 Bugün: ${courier.todayDeliveries} paket</div>
        </div>
      `);

      // Open popup if this courier is selected
      if (selectedCourier === courier.id) {
        marker.openPopup();
        mapRef.current?.panTo([courier.lat, courier.lng]);
      }
    });

    // Fit bounds to show all markers if we have any
    const allMarkers: L.LatLngExpression[] = [
      ...restaurants.map(r => [r.lat, r.lng]),
      ...couriers.map(c => [c.lat, c.lng]),
      ...orders.filter(o => o.lat && o.lng).map(o => [o.lat!, o.lng!]),
    ];

    if (allMarkers.length > 0 && !selectedCourier) {
      const bounds = L.latLngBounds(allMarkers);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [couriers, orders, restaurants, selectedCourier]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%',
        borderRadius: 'inherit',
      }} 
    />
  );
}
