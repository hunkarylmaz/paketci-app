'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

// ==================== ICONS ====================
const Icons = {
  menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  package: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="22.08" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  store: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  map: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="8" y1="2" x2="8" y2="18" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="6" x2="16" y2="22" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  wallet: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6" y1="20" x2="6" y2="14" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  fileText: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="10 9 9 9 8 9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  x: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  sync: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="1 20 1 14 7 14" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  location: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bike: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="5.5" cy="17.5" r="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18.5" cy="17.5" r="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  coins: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="8" r="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 8a6 6 0 0 1-6 6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// ==================== COLORS ====================
const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  sidebarBg: '#0F172A',
  sidebarHover: '#1E293B',
  white: '#FFFFFF',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  green: '#10B981',
  greenLight: '#D1FAE5',
  red: '#EF4444',
  redLight: '#FEE2E2',
  yellow: '#F59E0B',
  yellowLight: '#FEF3C7',
  orange: '#F97316',
  purple: '#8B5CF6',
  border: '#E2E8F0'
};

// ==================== TYPES ====================
type OrderStatus = 'waiting' | 'ready' | 'assigned' | 'onway' | 'cancelled' | 'delivered';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  restaurantName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  courierId?: string;
  courierName?: string;
  lat?: number;
  lng?: number;
}

interface Courier {
  id: string;
  name: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  vehicleType: 'motorcycle' | 'bicycle' | 'car';
  lat: number;
  lng: number;
  totalDeliveries: number;
  todayDeliveries: number;
}

interface Restaurant {
  id: string;
  name: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  commission: number;
  totalOrders: number;
  isActive: boolean;
}

// ==================== MOCK DATA ====================
const mockOrders: Order[] = [
  { id: 'P-1001', customerName: 'Ahmet Yılmaz', customerPhone: '0532 111 2233', address: 'Kıbrıs Şehitleri Cd. No:45, Bodrum', restaurantName: 'ASMA DÖNER', status: 'waiting', total: 145, createdAt: '2025-03-22 14:30', lat: 37.0344, lng: 27.4305 },
  { id: 'P-1002', customerName: 'Mehmet Kaya', customerPhone: '0533 222 3344', address: 'Cumhuriyet Cad. No:12, Bodrum', restaurantName: 'Burger King', status: 'ready', total: 89, createdAt: '2025-03-22 14:25', lat: 37.0360, lng: 27.4320 },
  { id: 'P-1003', customerName: 'Ayşe Demir', customerPhone: '0534 333 4455', address: 'Turgutreis Mah. No:78, Bodrum', restaurantName: 'ASMA DÖNER', status: 'assigned', total: 210, createdAt: '2025-03-22 14:20', courierId: 'C1', courierName: 'Ali Kurye', lat: 37.0200, lng: 27.4100 },
  { id: 'P-1004', customerName: 'Fatma Şahin', customerPhone: '0535 444 5566', address: 'Gümbet Mah. No:23, Bodrum', restaurantName: 'Pizza Hut', status: 'onway', total: 175, createdAt: '2025-03-22 14:15', courierId: 'C2', courierName: 'Veli Kurye', lat: 37.0400, lng: 27.4200 },
  { id: 'P-1005', customerName: 'Can Yıldız', customerPhone: '0536 555 6677', address: 'Bitez Mah. No:56, Bodrum', restaurantName: 'ASMA DÖNER', status: 'onway', total: 95, createdAt: '2025-03-22 14:10', courierId: 'C1', courierName: 'Ali Kurye', lat: 37.0250, lng: 27.4150 },
  { id: 'P-1006', customerName: 'Zeynep Aydın', customerPhone: '0537 666 7788', address: 'Ortakent Mah. No:34, Bodrum', restaurantName: 'Dominos', status: 'cancelled', total: 120, createdAt: '2025-03-22 14:05', lat: 37.0150, lng: 27.4050 },
  { id: 'P-1007', customerName: 'Burak Özdemir', customerPhone: '0538 777 8899', address: 'Yalıkavak Mah. No:89, Bodrum', restaurantName: 'ASMA DÖNER', status: 'delivered', total: 165, createdAt: '2025-03-22 13:45', courierId: 'C3', courierName: 'Hasan Kurye', lat: 37.0500, lng: 27.4400 },
  { id: 'P-1008', customerName: 'Elif Korkmaz', customerPhone: '0539 888 9900', address: 'Torba Mah. No:67, Bodrum', restaurantName: 'McDonalds', status: 'delivered', total: 78, createdAt: '2025-03-22 13:30', courierId: 'C2', courierName: 'Veli Kurye', lat: 37.0550, lng: 27.4500 },
];

const mockCouriers: Courier[] = [
  { id: 'C1', name: 'Ali Kurye', phone: '0541 111 2233', status: 'busy', vehicleType: 'motorcycle', lat: 37.0250, lng: 27.4150, totalDeliveries: 1250, todayDeliveries: 12 },
  { id: 'C2', name: 'Veli Kurye', phone: '0542 222 3344', status: 'busy', vehicleType: 'motorcycle', lat: 37.0400, lng: 27.4200, totalDeliveries: 980, todayDeliveries: 8 },
  { id: 'C3', name: 'Hasan Kurye', phone: '0543 333 4455', status: 'available', vehicleType: 'bicycle', lat: 37.0450, lng: 27.4350, totalDeliveries: 650, todayDeliveries: 5 },
  { id: 'C4', name: 'Mehmet Kurye', phone: '0544 444 5566', status: 'available', vehicleType: 'motorcycle', lat: 37.0300, lng: 27.4250, totalDeliveries: 1100, todayDeliveries: 0 },
  { id: 'C5', name: 'Osman Kurye', phone: '0545 555 6677', status: 'offline', vehicleType: 'car', lat: 37.0350, lng: 27.4400, totalDeliveries: 450, todayDeliveries: 0 },
];

const mockRestaurants: Restaurant[] = [
  { id: 'R1', name: 'ASMA DÖNER', phone: '0252 316 1234', address: 'Kumbahçe Mah. No:15, Bodrum', lat: 37.0344, lng: 27.4305, commission: 15, totalOrders: 1250, isActive: true },
  { id: 'R2', name: 'Burger King', phone: '0252 316 5678', address: 'Cumhuriyet Cad. No:45, Bodrum', lat: 37.0360, lng: 27.4320, commission: 18, totalOrders: 890, isActive: true },
  { id: 'R3', name: 'Pizza Hut', phone: '0252 316 9012', address: 'Gümbet Mah. No:78, Bodrum', lat: 37.0400, lng: 27.4200, commission: 20, totalOrders: 650, isActive: true },
];

// ==================== ORDER STATUS CONFIG ====================
const orderStatusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  waiting: { label: 'Bekleyen', color: colors.gray600, bgColor: colors.gray100 },
  ready: { label: 'Hazır', color: colors.yellow, bgColor: colors.yellowLight },
  assigned: { label: 'Atama', color: colors.purple, bgColor: '#EDE9FE' },
  onway: { label: 'Yolda', color: colors.primary, bgColor: '#DBEAFE' },
  cancelled: { label: 'İptal', color: colors.red, bgColor: colors.redLight },
  delivered: { label: 'Teslim', color: colors.green, bgColor: colors.greenLight },
};

// ==================== DYNAMIC MAP IMPORT ====================
const LiveMap = dynamic(() => import('./LiveMap'), { ssr: false, loading: () => (
  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.gray100 }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #E2E8F0', borderTopColor: colors.primary, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }}></div>
      <p style={{ color: colors.gray500, fontSize: 14 }}>Harita yükleniyor...</p>
    </div>
  </div>
)});

// ==================== MAIN COMPONENT ====================
export default function DealerDashboard() {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [couriers, setCouriers] = useState<Courier[]>(mockCouriers);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [showAddCourierModal, setShowAddCourierModal] = useState(false);
  const [showAddRestaurantModal, setShowAddRestaurantModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showOrderActionModal, setShowOrderActionModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['orders']);
  
  const [dealerSettings, setDealerSettings] = useState({
    name: 'ASMA DÖNER Bayi',
    address: 'Bodrum, Muğla',
    lat: 37.0344,
    lng: 27.4305,
    workingHoursStart: '09:00',
    workingHoursEnd: '23:00',
    autoAssignEnabled: true,
    maxAssignmentDistance: 5,
    defaultCommission: 15,
    paymentTypes: ['Nakit', 'Kredi Kartı', 'Online Ödeme'],
  });
  
  // Credit state
  const [dealerCredits, setDealerCredits] = useState({ current: 26722, pending: 0, total: 125000 });
  const [creditAmount, setCreditAmount] = useState('');
  const [creditPaymentMethod, setCreditPaymentMethod] = useState('bank');
  
  // Forms
  const [courierForm, setCourierForm] = useState({ name: '', phone: '', vehicleType: 'motorcycle' as 'motorcycle' | 'bicycle' | 'car' });
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    commission: '15',
    workType: 'full_time',
    openingTime: '09:00',
    closingTime: '23:00',
    paymentMethods: [] as string[],
    integrations: {} as Record<string, boolean>,
    yemeksepetiId: '',
    yemeksepetiKey: '',
    getirId: '',
    trendyolId: '',
    migrosId: '',
  });

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => 
      prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
    );
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const orderCounts = {
    waiting: orders.filter(o => o.status === 'waiting').length,
    ready: orders.filter(o => o.status === 'ready').length,
    assigned: orders.filter(o => o.status === 'assigned').length,
    onway: orders.filter(o => o.status === 'onway').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  const courierCounts = {
    available: couriers.filter(c => c.status === 'available').length,
    busy: couriers.filter(c => c.status === 'busy').length,
    offline: couriers.filter(c => c.status === 'offline').length,
  };

  const handleAddCourier = () => {
    if (!courierForm.name || !courierForm.phone) return;
    const newCourier: Courier = {
      id: `C${Date.now()}`,
      name: courierForm.name,
      phone: courierForm.phone,
      status: 'available',
      vehicleType: courierForm.vehicleType,
      lat: 37.0344 + (Math.random() - 0.5) * 0.02,
      lng: 27.4305 + (Math.random() - 0.5) * 0.02,
      totalDeliveries: 0,
      todayDeliveries: 0,
    };
    setCouriers([...couriers, newCourier]);
    setCourierForm({ name: '', phone: '', vehicleType: 'motorcycle' });
    setShowAddCourierModal(false);
  };

  const handleAddRestaurant = () => {
    if (!restaurantForm.name || !restaurantForm.phone || !restaurantForm.address) return;
    const newRestaurant: Restaurant = {
      id: `R${Date.now()}`,
      name: restaurantForm.name,
      phone: restaurantForm.phone,
      address: restaurantForm.address,
      lat: 37.0344 + (Math.random() - 0.5) * 0.03,
      lng: 27.4305 + (Math.random() - 0.5) * 0.03,
      commission: parseInt(restaurantForm.commission),
      totalOrders: 0,
      isActive: true,
    };
    setRestaurants([...restaurants, newRestaurant]);
    setRestaurantForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      commission: '15',
      workType: 'full_time',
      openingTime: '09:00',
      closingTime: '23:00',
      paymentMethods: [],
      integrations: {},
      yemeksepetiId: '',
      yemeksepetiKey: '',
      getirId: '',
      trendyolId: '',
      migrosId: '',
    });
    setShowAddRestaurantModal(false);
  };

  const handleCreditLoad = () => {
    const amount = parseInt(creditAmount);
    if (!amount || amount <= 0) return;
    
    setDealerCredits(prev => ({
      ...prev,
      current: prev.current + amount,
      total: prev.total + amount
    }));
    setCreditAmount('');
    setShowCreditModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('dealer_user');
    window.location.href = '/login.html';
  };

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: 'Güncel Durum', icon: <Icons.dashboard /> },
    { 
      id: 'orders', 
      label: 'Siparişler', 
      icon: <Icons.package />,
      children: [
        { id: 'orders-waiting', label: 'Bekleyen', count: orderCounts.waiting },
        { id: 'orders-ready', label: 'Hazır', count: orderCounts.ready },
        { id: 'orders-assigned', label: 'Atama', count: orderCounts.assigned },
        { id: 'orders-onway', label: 'Yolda', count: orderCounts.onway },
        { id: 'orders-cancelled', label: 'İptal', count: orderCounts.cancelled },
        { id: 'orders-delivered', label: 'Teslim', count: orderCounts.delivered },
      ]
    },
    { id: 'restaurants', label: 'Restoranlar', icon: <Icons.store />, onClick: () => setActiveMenu('restaurants') },
    { id: 'couriers', label: 'Kuryeler', icon: <Icons.users />, onClick: () => setActiveMenu('couriers') },
    { id: 'map', label: 'Harita', icon: <Icons.map />, onClick: () => setActiveMenu('map') },
    { id: 'wallet', label: 'Kontör Yükle', icon: <Icons.wallet />, onClick: () => setShowCreditModal(true) },
    { id: 'reports', label: 'Raporlar', icon: <Icons.chart />, onClick: () => setActiveMenu('reports') },
    { id: 'settings', label: 'Ayarlar', icon: <Icons.settings />, onClick: () => setActiveMenu('settings') },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.gray50 }}>
      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 260 : 70,
        background: colors.sidebarBg,
        color: colors.white,
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${colors.gray700}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: colors.white, cursor: 'pointer', padding: 4 }}>
            <Icons.menu />
          </button>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>PAKETÇİ</div>
              <div style={{ fontSize: 10, color: colors.gray400, letterSpacing: 1 }}>BAYİ PANELİ</div>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.children) toggleMenu(item.id);
                  else if (item.onClick) item.onClick();
                  else setActiveMenu(item.id);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  marginBottom: 4,
                  borderRadius: 8,
                  border: 'none',
                  background: activeMenu === item.id ? colors.primary : 'transparent',
                  color: colors.white,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  textAlign: 'left',
                }}
              >
                <span style={{ opacity: 0.9 }}>{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.children && (
                      <Icons.chevronDown />
                    )}
                  </>
                )}
              </button>
              
              {sidebarOpen && item.children && expandedMenus.includes(item.id) && (
                <div style={{ marginLeft: 32, marginBottom: 8 }}>
                  {item.children.map((child: any) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        setActiveMenu(child.id);
                        if (child.id.startsWith('orders-')) {
                          const status = child.id.replace('orders-', '') as OrderStatus;
                          setActiveTab(status);
                        }
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        border: 'none',
                        background: 'transparent',
                        color: colors.gray300,
                        cursor: 'pointer',
                        fontSize: 13,
                        textAlign: 'left',
                        borderRadius: 6,
                      }}
                    >
                      <span>{child.label}</span>
                      {child.count !== undefined && (
                        <span style={{
                          background: colors.gray700,
                          color: colors.white,
                          padding: '2px 8px',
                          borderRadius: 10,
                          fontSize: 11,
                          fontWeight: 600,
                        }}>{child.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px', borderTop: `1px solid ${colors.gray700}` }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: colors.gray400,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            <Icons.logout />
            {sidebarOpen && <span>Çıkış</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? 260 : 70,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <header style={{
          background: colors.white,
          borderBottom: `1px solid ${colors.gray200}`,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.gray800, margin: 0 }}>
              Güncel Durum / Siparişler
            </h1>
            <p style={{ fontSize: 13, color: colors.gray500, margin: '4px 0 0' }}>
              Son güncelleme: {new Date().toLocaleString('tr-TR')}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              background: colors.primaryLight,
              color: colors.white,
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <Icons.coins />
              <span>Kontör</span>
              <span style={{ fontSize: 16 }}>{dealerCredits.current.toLocaleString('tr-TR')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: colors.gray600 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: colors.gray200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.users />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Bayi</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div style={{ padding: 24 }}>
          
          {/* DASHBOARD VIEW */}
          {activeMenu === 'dashboard' && (
            <>
              {/* Order Status Tabs */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                {(['waiting', 'ready', 'assigned', 'onway', 'cancelled', 'delivered'] as OrderStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveTab(status)}
                    style={{
                      padding: '16px 24px',
                      borderRadius: 12,
                      border: 'none',
                      background: activeTab === status ? orderStatusConfig[status].bgColor : colors.white,
                      boxShadow: activeTab === status ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      minWidth: 100,
                      textAlign: 'center' as const,
                    }}
                  >
                    <div style={{ fontSize: 12, color: colors.gray500, marginBottom: 4 }}>{orderStatusConfig[status].label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: orderStatusConfig[status].color }}>
                      {orderCounts[status]}
                    </div>
                  </button>
                ))}
              </div>

              {/* Map and Couriers Side by Side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 20, marginBottom: 24 }}>
                {/* Map */}
                <div style={{
                  background: colors.white,
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  height: 600,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <LiveMap 
                    couriers={couriers} 
                    orders={orders.filter(o => o.status === 'onway' || o.status === 'assigned')}
                    restaurants={restaurants}
                    selectedCourier={selectedCourier}
                  />
                </div>

                {/* Couriers Panel */}
                <div style={{
                  background: colors.sidebarBg,
                  borderRadius: 16,
                  padding: 20,
                  color: colors.white,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Kuryeler</h3>
                    <div style={{ display: 'flex', gap: 4, fontSize: 11 }}>
                      <span style={{ color: '#10B981' }}>● Açık</span>
                      <span style={{ color: '#EF4444' }}>● Kapalı</span>
                    </div>
                  </div>

                  {/* Courier Tabs */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: `1px solid ${colors.gray700}`, paddingBottom: 12 }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#10B981' }}>{courierCounts.available}</div>
                      <div style={{ fontSize: 11, color: colors.gray400 }}>Boşta</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: colors.yellow }}>{courierCounts.busy}</div>
                      <div style={{ fontSize: 11, color: colors.gray400 }}>Meşgul</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: colors.gray400 }}>{courierCounts.offline}</div>
                      <div style={{ fontSize: 11, color: colors.gray400 }}>Çevrimdışı</div>
                    </div>
                  </div>

                  {/* Courier List */}
                  <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                    {couriers.map((courier) => (
                      <div
                        key={courier.id}
                        onClick={() => setSelectedCourier(selectedCourier === courier.id ? null : courier.id)}
                        style={{
                          padding: '12px',
                          borderRadius: 8,
                          background: selectedCourier === courier.id ? colors.gray700 : 'transparent',
                          cursor: 'pointer',
                          marginBottom: 8,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: courier.status === 'available' ? '#10B981' : courier.status === 'busy' ? colors.yellow : colors.gray500,
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{courier.name}</div>
                            <div style={{ fontSize: 11, color: colors.gray400 }}>
                              {courier.status === 'available' ? 'Boşta' : courier.status === 'busy' ? 'Meşgul' : 'Çevrimdışı'} • 
                              {' '}{courier.todayDeliveries} paket
                            </div>
                          </div>
                          <Icons.bike />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAddCourierModal(true)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginTop: 12,
                      background: colors.primary,
                      color: colors.white,
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Icons.plus />
                    Kurye Ekle
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div style={{
                background: colors.white,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colors.gray200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: colors.gray800 }}>
                    {activeTab === 'all' ? 'Tüm Siparişler' : `${orderStatusConfig[activeTab as OrderStatus]?.label} Siparişler`}
                  </h3>
                  <button style={{
                    padding: '8px 16px',
                    background: colors.gray100,
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    color: colors.gray600,
                    cursor: 'pointer',
                  }}>Süz</button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: colors.gray50 }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Paket</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Müşteri</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Restoran</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Adres</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Durum</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Tutar</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: colors.gray500 }}>
                            Sipariş bulunamadı
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} style={{ borderTop: `1px solid ${colors.gray100}` }}>
                            <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: colors.gray800 }}>
                              {order.id}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontSize: 14, fontWeight: 500, color: colors.gray800 }}>{order.customerName}</div>
                              <div style={{ fontSize: 12, color: colors.gray500 }}>{order.customerPhone}</div>
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: 14, color: colors.gray700 }}>
                              {order.restaurantName}
                            </td>
                            <td style={{ padding: '14px 16px', fontSize: 13, color: colors.gray600, maxWidth: 200 }}>
                              {order.address}
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <span style={{
                                padding: '6px 12px',
                                borderRadius: 20,
                                fontSize: 12,
                                fontWeight: 600,
                                background: orderStatusConfig[order.status].bgColor,
                                color: orderStatusConfig[order.status].color,
                              }}>
                                {orderStatusConfig[order.status].label}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, color: colors.gray800 }}>
                              {order.total} TL
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <button
                                onClick={() => { setSelectedOrder(order); setShowOrderActionModal(true); }}
                                style={{
                                  padding: '6px 12px',
                                  background: colors.primary,
                                  color: colors.white,
                                  border: 'none',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                }}
                              >
                                İşlem
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* RESTAURANTS VIEW */}
          {activeMenu === 'restaurants' && (
            <div style={{ background: colors.white, borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Restoranlar</h2>
                <button
                  onClick={() => setShowAddRestaurantModal(true)}
                  style={{
                    padding: '10px 20px',
                    background: colors.primary,
                    color: colors.white,
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Icons.plus />
                  Restoran Ekle
                </button>
              </div>
              
              <div style={{ display: 'grid', gap: 16 }}>
                {restaurants.map((restaurant) => (
                  <div key={restaurant.id} style={{
                    padding: 20,
                    borderRadius: 12,
                    border: `1px solid ${colors.gray200}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: colors.gray800, marginBottom: 4 }}>{restaurant.name}</div>
                      <div style={{ fontSize: 13, color: colors.gray500 }}>{restaurant.address}</div>
                      <div style={{ fontSize: 13, color: colors.gray400, marginTop: 4 }}>{restaurant.phone}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: colors.primary }}>%{restaurant.commission} Komisyon</div>
                      <div style={{ fontSize: 13, color: colors.gray500 }}>{restaurant.totalOrders} sipariş</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COURIERS VIEW */}
          {activeMenu === 'couriers' && (
            <div style={{ background: colors.white, borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Kuryeler</h2>
                <button
                  onClick={() => setShowAddCourierModal(true)}
                  style={{
                    padding: '10px 20px',
                    background: colors.primary,
                    color: colors.white,
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Icons.plus />
                  Kurye Ekle
                </button>
              </div>
              
              <div style={{ display: 'grid', gap: 16 }}>
                {couriers.map((courier) => (
                  <div key={courier.id} style={{
                    padding: 20,
                    borderRadius: 12,
                    border: `1px solid ${colors.gray200}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: colors.gray100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                      }}>👤</div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: colors.gray800 }}>{courier.name}</div>
                        <div style={{ fontSize: 13, color: colors.gray500 }}>{courier.phone}</div>
                        <span style={{
                          display: 'inline-block',
                          marginTop: 4,
                          padding: '4px 10px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 600,
                          background: courier.status === 'available' ? colors.greenLight : courier.status === 'busy' ? colors.yellowLight : colors.gray100,
                          color: courier.status === 'available' ? colors.green : courier.status === 'busy' ? colors.yellow : colors.gray500,
                        }}>
                          {courier.status === 'available' ? 'Boşta' : courier.status === 'busy' ? 'Meşgul' : 'Çevrimdışı'}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: colors.primary }}>{courier.todayDeliveries} paket</div>
                      <div style={{ fontSize: 13, color: colors.gray500 }}>Bugün</div>
                      <div style={{ fontSize: 13, color: colors.gray400, marginTop: 4 }}>Toplam: {courier.totalDeliveries}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAP VIEW */}
          {activeMenu === 'map' && (
            <div style={{ background: colors.white, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'calc(100vh - 140px)', position: 'relative', zIndex: 1 }}>
              <LiveMap 
                couriers={couriers} 
                orders={orders}
                restaurants={restaurants}
                selectedCourier={selectedCourier}
              />
            </div>
          )}

          {/* REPORTS VIEW */}
          {activeMenu === 'reports' && (
            <ReportsView 
              orders={orders} 
              couriers={couriers}
              restaurants={restaurants}
            />
          )}

          {/* SETTINGS VIEW */}
          {activeMenu === 'settings' && (
            <SettingsView 
              dealerSettings={dealerSettings}
              onSave={setDealerSettings}
            />
          )}
        </div>
      </main>

      {/* ADD COURIER MODAL */}
      {showAddCourierModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: colors.white,
            borderRadius: 16,
            width: '90%',
            maxWidth: 420,
            padding: 24,
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Yeni Kurye Ekle</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Ad Soyad</label>
              <input
                type="text"
                value={courierForm.name}
                onChange={(e) => setCourierForm({ ...courierForm, name: e.target.value })}
                placeholder="örn: Ahmet Yılmaz"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${colors.gray300}`,
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Telefon</label>
              <input
                type="text"
                value={courierForm.phone}
                onChange={(e) => setCourierForm({ ...courierForm, phone: e.target.value })}
                placeholder="örn: 0532 123 4567"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${colors.gray300}`,
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Araç Tipi</label>
              <select
                value={courierForm.vehicleType}
                onChange={(e) => setCourierForm({ ...courierForm, vehicleType: e.target.value as 'motorcycle' | 'bicycle' | 'car' })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${colors.gray300}`,
                  borderRadius: 8,
                  fontSize: 14,
                }}
              >
                <option value="motorcycle">Motosiklet</option>
                <option value="bicycle">Bisiklet</option>
                <option value="car">Araba</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowAddCourierModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: colors.gray100,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.gray700,
                  cursor: 'pointer',
                }}
              >
                İptal
              </button>
              <button
                onClick={handleAddCourier}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: colors.primary,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.white,
                  cursor: 'pointer',
                }}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD RESTAURANT MODAL */}
      {showAddRestaurantModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflow: 'auto',
          padding: '20px',
        }}>
          <div style={{
            background: colors.white,
            borderRadius: 16,
            width: '100%',
            maxWidth: 600,
            maxHeight: '90vh',
            overflow: 'auto',
            padding: 24,
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Yeni Restoran Ekle</h3>
            
            {/* Temel Bilgiler */}
            <div style={{ marginBottom: 20, padding: 16, background: colors.gray50, borderRadius: 12 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: colors.gray700 }}>📋 Temel Bilgiler</h4>
              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Restoran Adı *</label>
                  <input
                    type="text"
                    value={restaurantForm.name || ''}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                    placeholder="örn: Burger King"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${colors.gray300}`,
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Telefon *</label>
                    <input
                      type="text"
                      value={restaurantForm.phone || ''}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, phone: e.target.value })}
                      placeholder="örn: 0252 316 1234"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>E-posta</label>
                    <input
                      type="email"
                      value={restaurantForm.email || ''}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, email: e.target.value })}
                      placeholder="örn: info@restoran.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Adres *</label>
                  <textarea
                    value={restaurantForm.address || ''}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                    placeholder="örn: Cumhuriyet Cad. No:45, Bodrum"
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${colors.gray300}`,
                      borderRadius: 8,
                      fontSize: 14,
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Çalışma Bilgileri */}
            <div style={{ marginBottom: 20, padding: 16, background: colors.gray50, borderRadius: 12 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: colors.gray700 }}>⏰ Çalışma Bilgileri</h4>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Çalışma Tipi</label>
                    <select
                      value={restaurantForm.workType || 'full_time'}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, workType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    >
                      <option value="full_time">Tam Zamanlı</option>
                      <option value="part_time">Yarı Zamanlı</option>
                      <option value="seasonal">Sezonluk</option>
                      <option value="temporary">Geçici</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Komisyon (%)</label>
                    <input
                      type="number"
                      value={restaurantForm.commission || 15}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, commission: e.target.value })}
                      min="0"
                      max="50"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Açılış Saati</label>
                    <input
                      type="time"
                      value={restaurantForm.openingTime || '09:00'}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, openingTime: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Kapanış Saati</label>
                    <input
                      type="time"
                      value={restaurantForm.closingTime || '23:00'}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, closingTime: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${colors.gray300}`,
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ödeme Şekilleri */}
            <div style={{ marginBottom: 20, padding: 16, background: colors.gray50, borderRadius: 12 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: colors.gray700 }}>💳 Ödeme Şekilleri</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Nakit', 'Kredi Kartı', 'Debit Kart', 'Online Ödeme', 'Sodexo', 'Multinet', 'Edenred'].map((method) => (
                  <label
                    key={method}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 12px',
                      background: (restaurantForm.paymentMethods || []).includes(method) ? colors.primaryLight : colors.white,
                      border: `1px solid ${(restaurantForm.paymentMethods || []).includes(method) ? colors.primary : colors.gray300}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: 13,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={(restaurantForm.paymentMethods || []).includes(method)}
                      onChange={(e) => {
                        const current = restaurantForm.paymentMethods || [];
                        if (e.target.checked) {
                          setRestaurantForm({ ...restaurantForm, paymentMethods: [...current, method] });
                        } else {
                          setRestaurantForm({ ...restaurantForm, paymentMethods: current.filter(m => m !== method) });
                        }
                      }}
                      style={{ margin: 0 }}
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            {/* Entegrasyon Bilgileri */}
            <div style={{ marginBottom: 20, padding: 16, background: colors.gray50, borderRadius: 12 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: colors.gray700 }}>🔗 Entegrasyon Bilgileri</h4>
              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, marginBottom: 4, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={restaurantForm.integrations?.yemeksepeti || false}
                      onChange={(e) => setRestaurantForm({
                        ...restaurantForm,
                        integrations: { ...restaurantForm.integrations, yemeksepeti: e.target.checked }
                      })}
                    />
                    🍔 Yemeksepeti Entegrasyonu
                  </label>
                  {restaurantForm.integrations?.yemeksepeti && (
                    <div style={{ marginTop: 8, marginLeft: 24, display: 'grid', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Restaurant ID"
                        value={restaurantForm.yemeksepetiId || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, yemeksepetiId: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: `1px solid ${colors.gray300}`,
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                      />
                      <input
                        type="text"
                        placeholder="API Key"
                        value={restaurantForm.yemeksepetiKey || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, yemeksepetiKey: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: `1px solid ${colors.gray300}`,
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, marginBottom: 4, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={restaurantForm.integrations?.getir || false}
                      onChange={(e) => setRestaurantForm({
                        ...restaurantForm,
                        integrations: { ...restaurantForm.integrations, getir: e.target.checked }
                      })}
                    />
                    🚀 Getir Entegrasyonu
                  </label>
                  {restaurantForm.integrations?.getir && (
                    <div style={{ marginTop: 8, marginLeft: 24 }}>
                      <input
                        type="text"
                        placeholder="Getir Merchant ID"
                        value={restaurantForm.getirId || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, getirId: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: `1px solid ${colors.gray300}`,
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, marginBottom: 4, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={restaurantForm.integrations?.trendyol || false}
                      onChange={(e) => setRestaurantForm({
                        ...restaurantForm,
                        integrations: { ...restaurantForm.integrations, trendyol: e.target.checked }
                      })}
                    />
                    🟠 Trendyol Yemek Entegrasyonu
                  </label>
                  {restaurantForm.integrations?.trendyol && (
                    <div style={{ marginTop: 8, marginLeft: 24 }}>
                      <input
                        type="text"
                        placeholder="Trendyol Restaurant ID"
                        value={restaurantForm.trendyolId || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, trendyolId: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: `1px solid ${colors.gray300}`,
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, marginBottom: 4, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={restaurantForm.integrations?.migros || false}
                      onChange={(e) => setRestaurantForm({
                        ...restaurantForm,
                        integrations: { ...restaurantForm.integrations, migros: e.target.checked }
                      })}
                    />
                    🟡 Migros Yemek Entegrasyonu
                  </label>
                  {restaurantForm.integrations?.migros && (
                    <div style={{ marginTop: 8, marginLeft: 24 }}>
                      <input
                        type="text"
                        placeholder="Migros Store ID"
                        value={restaurantForm.migrosId || ''}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, migrosId: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: `1px solid ${colors.gray300}`,
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowAddRestaurantModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: colors.gray100,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.gray700,
                  cursor: 'pointer',
                }}
              >
                İptal
              </button>
              <button
                onClick={handleAddRestaurant}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: colors.primary,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.white,
                  cursor: 'pointer',
                }}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREDIT LOAD MODAL */}
      {showCreditModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: colors.white,
            borderRadius: 16,
            width: '90%',
            maxWidth: 420,
            padding: 24,
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Kontör Yükle</h3>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Yüklenecek Tutar</label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="örn: 5000"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${colors.gray300}`,
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Ödeme Yöntemi</label>
              <select
                value={creditPaymentMethod}
                onChange={(e) => setCreditPaymentMethod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${colors.gray300}`,
                  borderRadius: 8,
                  fontSize: 14,
                }}
              >
                <option value="bank">Banka Havalesi</option>
                <option value="creditCard">Kredi Kartı</option>
                <option value="eft">EFT</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowCreditModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: colors.gray100,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.gray700,
                  cursor: 'pointer',
                }}
              >
                İptal
              </button>
              <button
                onClick={handleCreditLoad}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: colors.primary,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.white,
                  cursor: 'pointer',
                }}
              >
                Yükle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER ACTION MODAL */}
      {showOrderActionModal && selectedOrder && (
        <OrderActionModal
          order={selectedOrder}
          couriers={couriers}
          onClose={() => { setShowOrderActionModal(false); setSelectedOrder(null); }}
          onAssign={(orderId, courierId) => {
            const courier = couriers.find(c => c.id === courierId);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'assigned' as OrderStatus, courierId, courierName: courier?.name } : o));
            setShowOrderActionModal(false);
            setSelectedOrder(null);
          }}
          onChangeCourier={(orderId, courierId) => {
            const courier = couriers.find(c => c.id === courierId);
            setOrders(orders.map(o => o.id === orderId ? { ...o, courierId, courierName: courier?.name } : o));
            setShowOrderActionModal(false);
            setSelectedOrder(null);
          }}
          onCancel={(orderId) => {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o));
            setShowOrderActionModal(false);
            setSelectedOrder(null);
          }}
          onDeliver={(orderId) => {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'delivered' as OrderStatus } : o));
            setShowOrderActionModal(false);
            setSelectedOrder(null);
          }}
          onOnway={(orderId) => {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'onway' as OrderStatus } : o));
            setShowOrderActionModal(false);
            setSelectedOrder(null);
          }}
          onEditPayment={(orderId, paymentType) => {
            setOrders(orders.map(o => o.id === orderId ? { ...o, paymentType } : o));
          }}
        />
      )}
    </div>
  );
}

// ==================== ORDER ACTION MODAL COMPONENT ====================
function OrderActionModal({ order, couriers, onClose, onAssign, onChangeCourier, onCancel, onDeliver, onOnway, onEditPayment }: {
  order: Order;
  couriers: Courier[];
  onClose: () => void;
  onAssign: (orderId: string, courierId: string) => void;
  onChangeCourier: (orderId: string, courierId: string) => void;
  onCancel: (orderId: string) => void;
  onDeliver: (orderId: string) => void;
  onOnway: (orderId: string) => void;
  onEditPayment?: (orderId: string, paymentType: string) => void;
}) {
  const [action, setAction] = useState<string>('');
  const [selectedCourier, setSelectedCourier] = useState<string>('');

  const availableCouriers = couriers.filter(c => c.status === 'available');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: colors.white,
        borderRadius: 16,
        width: '90%',
        maxWidth: 480,
        maxHeight: '80vh',
        overflow: 'auto',
        padding: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Sipariş İşlemleri - {order.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Icons.x />
          </button>
        </div>

        <div style={{ marginBottom: 16, padding: 12, background: colors.gray50, borderRadius: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{order.customerName}</div>
          <div style={{ fontSize: 13, color: colors.gray500 }}>{order.restaurantName}</div>
          <div style={{ fontSize: 13, color: colors.gray600 }}>{order.address}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: colors.primary, marginTop: 8 }}>{order.total} TL</div>
        </div>

        <div style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
          {order.status === 'waiting' && (
            <button onClick={() => setAction('assign')} style={actionButtonStyle(action === 'assign')}>
              🛵 Kurye Ata
            </button>
          )}
          {(order.status === 'assigned' || order.status === 'onway') && (
            <>
              <button onClick={() => setAction('change')} style={actionButtonStyle(action === 'change')}>
                🔄 Kurye Değiştir
              </button>
              <button onClick={() => setAction('onway')} style={actionButtonStyle(action === 'onway')}>
                🚚 Yola Çıkar
              </button>
            </>
          )}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <>
              <button onClick={() => setAction('deliver')} style={actionButtonStyle(action === 'deliver')}>
                ✅ Teslim Et
              </button>
              <button onClick={() => setAction('cancel')} style={{ ...actionButtonStyle(action === 'cancel'), background: colors.redLight, color: colors.red }}>
                ❌ İptal Et
              </button>
            </>
          )}
        </div>

        {action === 'assign' && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Kurye Seç</label>
            <select
              value={selectedCourier}
              onChange={(e) => setSelectedCourier(e.target.value)}
              style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}
            >
              <option value="">Kurye seçin</option>
              {availableCouriers.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
              ))}
            </select>
            <button
              onClick={() => selectedCourier && onAssign(order.id, selectedCourier)}
              disabled={!selectedCourier}
              style={{
                width: '100%',
                marginTop: 12,
                padding: 12,
                background: selectedCourier ? colors.primary : colors.gray300,
                color: colors.white,
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: selectedCourier ? 'pointer' : 'not-allowed',
              }}
            >
              Ata
            </button>
          </div>
        )}

        {action === 'change' && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Yeni Kurye Seç</label>
            <select
              value={selectedCourier}
              onChange={(e) => setSelectedCourier(e.target.value)}
              style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}
            >
              <option value="">Kurye seçin</option>
              {availableCouriers.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
              ))}
            </select>
            <button
              onClick={() => selectedCourier && onChangeCourier(order.id, selectedCourier)}
              disabled={!selectedCourier}
              style={{
                width: '100%',
                marginTop: 12,
                padding: 12,
                background: selectedCourier ? colors.primary : colors.gray300,
                color: colors.white,
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: selectedCourier ? 'pointer' : 'not-allowed',
              }}
            >
              Değiştir
            </button>
          </div>
        )}

        {action === 'cancel' && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: colors.red, fontSize: 14 }}>Bu siparişi iptal etmek istediğinize emin misiniz?</p>
            <button
              onClick={() => onCancel(order.id)}
              style={{
                width: '100%',
                padding: 12,
                background: colors.red,
                color: colors.white,
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Evet, İptal Et
            </button>
          </div>
        )}

        {action === 'deliver' && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: colors.green, fontSize: 14 }}>Bu siparişi teslim edildi olarak işaretlemek istediğinize emin misiniz?</p>
            <button
              onClick={() => onDeliver(order.id)}
              style={{
                width: '100%',
                padding: 12,
                background: colors.green,
                color: colors.white,
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Evet, Teslim Edildi
            </button>
          </div>
        )}

        {action === 'onway' && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: colors.primary, fontSize: 14 }}>Kuryeyi yola çıkarıyorsunuz.</p>
            <button
              onClick={() => onOnway(order.id)}
              style={{
                width: '100%',
                padding: 12,
                background: colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Yola Çıkar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function actionButtonStyle(isActive: boolean) {
  return {
    width: '100%',
    padding: '12px 16px',
    background: isActive ? colors.primary : colors.gray100,
    color: isActive ? colors.white : colors.gray700,
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left' as const,
  };
}

// ==================== REPORTS VIEW COMPONENT ====================
function ReportsView({ orders, couriers, restaurants }: { orders: Order[], couriers: Courier[], restaurants: Restaurant[] }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportType, setReportType] = useState('orders');

  const filteredOrders = useMemo(() => {
    if (!dateFrom && !dateTo) return orders;
    return orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      if (from && orderDate < from) return false;
      if (to && orderDate > to) return false;
      return true;
    });
  }, [orders, dateFrom, dateTo]);

  const exportToExcel = () => {
    let csv = '';
    if (reportType === 'orders') {
      csv = 'Paket ID,Müşteri,Telefon,Restoran,Adres,Durum,Tutar,Tarih\\n';
      filteredOrders.forEach(o => {
        csv += `${o.id},${o.customerName},${o.customerPhone},${o.restaurantName},"${o.address}",${o.status},${o.total},${o.createdAt}\\n`;
      });
    } else if (reportType === 'couriers') {
      csv = 'Kurye,Telefon,Durum,Toplam Teslimat,Bugün\\n';
      couriers.forEach(c => {
        csv += `${c.name},${c.phone},${c.status},${c.totalDeliveries},${c.todayDeliveries}\\n`;
      });
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${reportType}_rapor_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const stats = {
    total: filteredOrders.length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
    revenue: filteredOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: colors.white, borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Raporlar</h2>
          <button
            onClick={exportToExcel}
            style={{
              padding: '10px 20px',
              background: colors.green,
              color: colors.white,
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icons.download />
            Excel'e Aktar
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Rapor Tipi</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ width: '100%', padding: 10, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}
            >
              <option value="orders">Sipariş Raporu</option>
              <option value="couriers">Kurye Raporu</option>
              <option value="restaurants">Restoran Raporu</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Başlangıç Tarihi</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{ width: '100%', padding: 10, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Bitiş Tarihi</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{ width: '100%', padding: 10, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div style={{ padding: 16, background: colors.gray50, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.primary }}>{stats.total}</div>
            <div style={{ fontSize: 13, color: colors.gray500 }}>Toplam Sipariş</div>
          </div>
          <div style={{ padding: 16, background: colors.greenLight, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.green }}>{stats.delivered}</div>
            <div style={{ fontSize: 13, color: colors.gray500 }}>Teslim Edilen</div>
          </div>
          <div style={{ padding: 16, background: colors.redLight, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.red }}>{stats.cancelled}</div>
            <div style={{ fontSize: 13, color: colors.gray500 }}>İptal</div>
          </div>
          <div style={{ padding: 16, background: colors.primaryLight, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.primary }}>{stats.revenue} TL</div>
            <div style={{ fontSize: 13, color: colors.gray500 }}>Ciro</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: colors.gray50 }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Paket</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Müşteri</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Restoran</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Durum</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Tutar</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderTop: `1px solid ${colors.gray100}` }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>{order.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>{order.customerName}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>{order.restaurantName}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      background: orderStatusConfig[order.status].bgColor,
                      color: orderStatusConfig[order.status].color,
                    }}>
                      {orderStatusConfig[order.status].label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>{order.total} TL</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: colors.gray500 }}>{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== SETTINGS VIEW COMPONENT ====================
function SettingsView({ dealerSettings, onSave }: { dealerSettings: any, onSave: (s: any) => void }) {
  const [settings, setSettings] = useState(dealerSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: colors.white, borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Bayi Ayarları</h2>
        {saved && (
          <span style={{ color: colors.green, fontSize: 14, fontWeight: 500 }}>✓ Kaydedildi</span>
        )}
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Bayi Adı</label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Adres</label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Çalışma Saati (Başlangıç)</label>
            <input
              type="time"
              value={settings.workingHoursStart}
              onChange={(e) => setSettings({ ...settings, workingHoursStart: e.target.value })}
              style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Çalışma Saati (Bitiş)</label>
            <input
              type="time"
              value={settings.workingHoursEnd}
              onChange={(e) => setSettings({ ...settings, workingHoursEnd: e.target.value })}
              style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Maksimum Atama Mesafesi (km)</label>
          <input
            type="number"
            value={settings.maxAssignmentDistance}
            onChange={(e) => setSettings({ ...settings, maxAssignmentDistance: parseInt(e.target.value) })}
            style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Varsayılan Komisyon (%)</label>
          <input
            type="number"
            value={settings.defaultCommission}
            onChange={(e) => setSettings({ ...settings, defaultCommission: parseInt(e.target.value) })}
            style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: colors.gray50, borderRadius: 8 }}>
          <input
            type="checkbox"
            id="autoAssign"
            checked={settings.autoAssignEnabled}
            onChange={(e) => setSettings({ ...settings, autoAssignEnabled: e.target.checked })}
            style={{ width: 20, height: 20 }}
          />
          <label htmlFor="autoAssign" style={{ fontSize: 14, cursor: 'pointer' }}>Otomatik Kurye Atama Aktif</label>
        </div>

        <button
          onClick={handleSave}
          style={{
            padding: '14px 24px',
            background: colors.primary,
            color: colors.white,
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Kaydet
        </button>
      </div>
    </div>
  );
}
