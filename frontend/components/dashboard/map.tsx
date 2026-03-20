"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const courierIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #5B3FD9, #7C5AE6);
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(91, 63, 217, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const restaurantIcon = new L.DivIcon({
  className: "custom-marker",
  html: `<div style="
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
        <path d="M7 2v20"/>
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
      </svg>
    </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const couriers = [
  { id: 1, name: "Ahmet Y.", lat: 37.0344, lng: 27.4305, status: "available" },
];

const restaurants = [
  { id: 1, name: "Burger King", lat: 37.036, lng: 27.428 },
  { id: 2, name: "McDonald's", lat: 37.032, lng: 27.433 },
];

export default function Map() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <MapContainer
      center={[37.0344, 27.4305]}
      zoom={14}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%" }}
      className="rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {couriers.map((courier) => (
        <Marker key={courier.id} position={[courier.lat, courier.lng]} icon={courierIcon}>
          <Popup>
            <div className="p-2">
              <p className="font-semibold">{courier.name}</p>
              <p className="text-sm text-gray-500">Kurye</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {restaurants.map((restaurant) => (
        <Marker key={restaurant.id} position={[restaurant.lat, restaurant.lng]} icon={restaurantIcon}>
          <Popup>
            <div className="p-2">
              <p className="font-semibold">{restaurant.name}</p>
              <p className="text-sm text-gray-500">Restoran</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
