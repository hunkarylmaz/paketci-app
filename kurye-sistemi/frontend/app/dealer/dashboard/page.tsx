'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';

// ==================== DYNAMIC IMPORTS ====================
const LiveMap = dynamic(() => import('./LiveMap'), { 
  ssr: false, 
  loading: () => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div>Harita yükleniyor...</div>
    </div>
  )
});

// ==================== ICONS ====================
const Icons = {
  menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  package: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  store: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  map: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  wallet: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>,
  chart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  x: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  chevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  bike: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>,
  coins: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6"/><path d="M18 8a6 6 0 0 1-6 6"/></svg>,
  edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
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
  lat?: number;
  lng?: number;
  courierId?: string;
  courierName?: string;
  paymentType?: string;
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

// ==================== COLORS ====================
const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
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
  yellow: '#F59E0B',
  yellowLight: '#FEF3C7',
  red: '#EF4444',
  redLight: '#FEE2E2',
};

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
  { id: 'R1', name: 'ASMA DÖNER', phone: '0252 316 1234', address: 'Cumhuriyet Cad. No:12, Bodrum', lat: 37.0344, lng: 27.4305, commission: 15, totalOrders: 1250, isActive: true },
  { id: 'R2', name: 'Burger King', phone: '0252 316 5678', address: 'Kıbrıs Şehitleri Cd. No:45, Bodrum', lat: 37.0360, lng: 27.4320, commission: 18, totalOrders: 890, isActive: true },
  { id: 'R3', name: 'Pizza Hut', phone: '0252 316 9012', address: 'Turgutreis Mah. No:78, Bodrum', lat: 37.0380, lng: 27.4280, commission: 20, totalOrders: 650, isActive: true },
  { id: 'R4', name: 'Dominos', phone: '0252 316 3456', address: 'Gümbet Mah. No:23, Bodrum', lat: 37.0320, lng: 27.4250, commission: 17, totalOrders: 420, isActive: false },
  { id: 'R5', name: 'McDonalds', phone: '0252 316 7890', address: 'Bitez Mah. No:56, Bodrum', lat: 37.0400, lng: 27.4350, commission: 16, totalOrders: 1100, isActive: true },
];

const orderStatusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  waiting: { label: 'Bekleyen', color: '#F59E0B', bgColor: '#FEF3C7' },
  ready: { label: 'Hazır', color: '#8B5CF6', bgColor: '#EDE9FE' },
  assigned: { label: 'Atandı', color: '#3B82F6', bgColor: '#DBEAFE' },
  onway: { label: 'Yolda', color: '#2563EB', bgColor: '#DBEAFE' },
  cancelled: { label: 'İptal', color: '#EF4444', bgColor: '#FEE2E2' },
  delivered: { label: 'Teslim', color: '#10B981', bgColor: '#D1FAE5' },
};

// ==================== MAIN COMPONENT ====================
export default function DealerDashboard() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['orders']);
  
  // Data state
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [couriers, setCouriers] = useState<Courier[]>(mockCouriers);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  
  // Modal states
  const [showAddCourierModal, setShowAddCourierModal] = useState(false);
  const [showAddRestaurantModal, setShowAddRestaurantModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showOrderActionModal, setShowOrderActionModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Form states
  const [courierForm, setCourierForm] = useState({ name: '', phone: '', vehicleType: 'motorcycle' as const });
  const [restaurantForm, setRestaurantForm] = useState({
    name: '', phone: '', email: '', address: '', commission: '15',
    workType: 'full_time', openingTime: '09:00', closingTime: '23:00',
    paymentMethods: [] as string[], integrations: {} as Record<string, boolean>,
    yemeksepetiId: '', yemeksepetiKey: '', getirId: '', trendyolId: '', migrosId: ''
  });
  const [creditAmount, setCreditAmount] = useState('');
  const [creditPaymentMethod, setCreditPaymentMethod] = useState('credit_card');
  const [dealerCredits, setDealerCredits] = useState({ current: 26722, pending: 0, total: 125000 });
  
  const [dealerSettings, setDealerSettings] = useState({
    name: 'ASMA DÖNER Bayi', address: 'Bodrum, Muğla', lat: 37.0344, lng: 27.4305,
    workingHoursStart: '09:00', workingHoursEnd: '23:00', autoAssignEnabled: true,
    maxAssignmentDistance: 5, defaultCommission: 15, paymentTypes: ['Nakit', 'Kredi Kartı', 'Online Ödeme'],
  });

  // Derived state
  const filteredOrders = useMemo(() => {
    return activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);
  }, [orders, activeTab]);

  const orderCounts = useMemo(() => ({
    all: orders.length,
    waiting: orders.filter(o => o.status === 'waiting').length,
    ready: orders.filter(o => o.status === 'ready').length,
    assigned: orders.filter(o => o.status === 'assigned').length,
    onway: orders.filter(o => o.status === 'onway').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }), [orders]);

  const courierStats = useMemo(() => ({
    available: couriers.filter(c => c.status === 'available').length,
    busy: couriers.filter(c => c.status === 'busy').length,
    offline: couriers.filter(c => c.status === 'offline').length,
  }), [couriers]);

  // Handlers
  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]);
  };

  const handleLogout = () => {
    localStorage.removeItem('dealer_user');
    window.location.href = '/login.html';
  };

  const handleAddCourier = () => {
    if (!courierForm.name || !courierForm.phone) return;
    const newCourier: Courier = {
      id: `C${Date.now()}`, name: courierForm.name, phone: courierForm.phone,
      status: 'available', vehicleType: courierForm.vehicleType,
      lat: 37.0344 + (Math.random() - 0.5) * 0.02, lng: 27.4305 + (Math.random() - 0.5) * 0.02,
      totalDeliveries: 0, todayDeliveries: 0,
    };
    setCouriers([...couriers, newCourier]);
    setCourierForm({ name: '', phone: '', vehicleType: 'motorcycle' });
    setShowAddCourierModal(false);
  };

  const handleAddRestaurant = () => {
    if (!restaurantForm.name || !restaurantForm.phone || !restaurantForm.address) return;
    const newRestaurant: Restaurant = {
      id: `R${Date.now()}`, name: restaurantForm.name, phone: restaurantForm.phone,
      address: restaurantForm.address, lat: 37.0344 + (Math.random() - 0.5) * 0.03,
      lng: 27.4305 + (Math.random() - 0.5) * 0.03, commission: parseInt(restaurantForm.commission) || 15,
      totalOrders: 0, isActive: true,
    };
    setRestaurants([...restaurants, newRestaurant]);
    setRestaurantForm({
      name: '', phone: '', email: '', address: '', commission: '15', workType: 'full_time',
      openingTime: '09:00', closingTime: '23:00', paymentMethods: [], integrations: {},
      yemeksepetiId: '', yemeksepetiKey: '', getirId: '', trendyolId: '', migrosId: ''
    });
    setShowAddRestaurantModal(false);
  };

  const handleCreditLoad = () => {
    const amount = parseInt(creditAmount);
    if (!amount || amount <= 0) return;
    setDealerCredits(prev => ({ ...prev, current: prev.current + amount, total: prev.total + amount }));
    setCreditAmount('');
    setShowCreditModal(false);
  };

  // Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Icons.dashboard /> },
    { id: 'orders', label: 'Siparişler', icon: <Icons.package />, count: orderCounts.waiting + orderCounts.ready, children: [
      { id: 'orders-all', label: 'Tümü', count: orderCounts.all },
      { id: 'orders-waiting', label: 'Bekleyen', count: orderCounts.waiting },
      { id: 'orders-ready', label: 'Hazır', count: orderCounts.ready },
      { id: 'orders-assigned', label: 'Atama', count: orderCounts.assigned },
      { id: 'orders-onway', label: 'Yolda', count: orderCounts.onway },
      { id: 'orders-delivered', label: 'Teslim', count: orderCounts.delivered },
      { id: 'orders-cancelled', label: 'İptal', count: orderCounts.cancelled },
    ]},
    { id: 'restaurants', label: 'Restoranlar', icon: <Icons.store />, count: restaurants.length },
    { id: 'couriers', label: 'Kuryeler', icon: <Icons.users />, count: couriers.length },
    { id: 'map', label: 'Harita', icon: <Icons.map /> },
    { id: 'credits', label: 'Kontör Yükle', icon: <Icons.wallet />, onClick: () => setShowCreditModal(true) },
    { id: 'reports', label: 'Raporlar', icon: <Icons.chart />, onClick: () => setActiveMenu('reports') },
    { id: 'settings', label: 'Ayarlar', icon: <Icons.settings />, onClick: () => setActiveMenu('settings') },
  ];

  // Effects
  useEffect(() => {
    const user = localStorage.getItem('dealer_user');
    if (!user) window.location.href = '/login.html';
  }, []);

  // Render
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.gray50, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 260 : 70,
        background: colors.gray900,
        color: colors.white,
        transition: 'width 0.3s',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100,
      }}>
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${colors.gray800}` }}>
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
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  marginBottom: 4, borderRadius: 8, border: 'none',
                  background: activeMenu === item.id ? colors.primary : 'transparent',
                  color: colors.white, cursor: 'pointer', fontSize: 14, fontWeight: 500, textAlign: 'left',
                }}
              >
                <span style={{ opacity: 0.9 }}>{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.children && <Icons.chevronDown />}
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
                        if (child.id.startsWith('orders-')) setActiveTab(child.id.replace('orders-', '') as OrderStatus);
                      }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px', border: 'none', background: 'transparent', color: colors.gray300,
                        cursor: 'pointer', fontSize: 13, textAlign: 'left', borderRadius: 6,
                      }}
                    >
                      <span>{child.label}</span>
                      {child.count !== undefined && (
                        <span style={{ background: colors.gray700, color: colors.white, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{child.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div style={{ padding: 16, borderTop: `1px solid ${colors.gray700}` }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: colors.white, cursor: 'pointer', fontSize: 14 }}>
            <Icons.logout />
            {sidebarOpen && <span>Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 70, transition: 'margin-left 0.3s' }}>
        <div style={{ padding: 24 }}>
          {/* DASHBOARD VIEW */}
          {activeMenu === 'dashboard' && (
            <DashboardView 
              orders={orders} 
              couriers={couriers} 
              restaurants={restaurants}
              orderCounts={orderCounts}
              courierStats={courierStats}
              dealerCredits={dealerCredits}
              onTabChange={setActiveTab}
              onMenuChange={setActiveMenu}
            />
          )}

          {/* ORDERS VIEW */}
          {(activeMenu === 'orders' || activeMenu.startsWith('orders-')) && (
            <OrdersView 
              orders={filteredOrders}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOrderAction={(order: Order) => { setSelectedOrder(order); setShowOrderActionModal(true); }}
            />
          )}

          {/* COURIERS VIEW */}
          {activeMenu === 'couriers' && (
            <CouriersView 
              couriers={couriers}
              stats={courierStats}
              onAdd={() => setShowAddCourierModal(true)}
              onSelect={setSelectedCourier}
            />
          )}

          {/* RESTAURANTS VIEW */}
          {activeMenu === 'restaurants' && (
            <RestaurantsView 
              restaurants={restaurants}
              onAdd={() => setShowAddRestaurantModal(true)}
            />
          )}

          {/* MAP VIEW */}
          {activeMenu === 'map' && (
            <div style={{ background: colors.white, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'calc(100vh - 140px)' }}>
              <LiveMap couriers={couriers} orders={orders} restaurants={restaurants} selectedCourier={selectedCourier} />
            </div>
          )}

          {/* REPORTS VIEW */}
          {activeMenu === 'reports' && <ReportsView orders={orders} couriers={couriers} restaurants={restaurants} />}

          {/* SETTINGS VIEW */}
          {activeMenu === 'settings' && <SettingsView dealerSettings={dealerSettings} onSave={setDealerSettings} />}
        </div>
      </main>

      {/* MODALS */}
      <AddCourierModal 
        isOpen={showAddCourierModal}
        onClose={() => setShowAddCourierModal(false)}
        form={courierForm}
        setForm={setCourierForm}
        onSubmit={handleAddCourier}
      />

      <AddRestaurantModal
        isOpen={showAddRestaurantModal}
        onClose={() => setShowAddRestaurantModal(false)}
        form={restaurantForm}
        setForm={setRestaurantForm}
        onSubmit={handleAddRestaurant}
      />

      <CreditModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        credits={dealerCredits}
        amount={creditAmount}
        setAmount={setCreditAmount}
        paymentMethod={creditPaymentMethod}
        setPaymentMethod={setCreditPaymentMethod}
        onSubmit={handleCreditLoad}
      />

      <OrderActionModal
        isOpen={showOrderActionModal}
        onClose={() => { setShowOrderActionModal(false); setSelectedOrder(null); }}
        order={selectedOrder}
        couriers={couriers}
        onAssign={(orderId: string, courierId: string) => {
          const courier = couriers.find(c => c.id === courierId);
          setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'assigned' as OrderStatus, courierId, courierName: courier?.name } : o));
          setShowOrderActionModal(false); setSelectedOrder(null);
        }}
        onStatusChange={(orderId: string, status: OrderStatus) => {
          setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
          setShowOrderActionModal(false); setSelectedOrder(null);
        }}
      />
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

function DashboardView({ orders, couriers, restaurants, orderCounts, courierStats, dealerCredits, onTabChange, onMenuChange }: any) {
  return (
    <>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard title="Toplam Sipariş" value={orders.length} color={colors.primary} icon="📦" />
        <StatCard title="Aktif Kurye" value={courierStats.available + courierStats.busy} color={colors.green} icon="🛵" />
        <StatCard title="Restoran" value={restaurants.length} color={colors.yellow} icon="🏪" />
        <StatCard title="Bakiye" value={`${dealerCredits.current.toLocaleString()} TL`} color={colors.red} icon="💰" />
      </div>

      {/* Order Status Tabs */}
      <div style={{ background: colors.white, borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Sipariş Durumları</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(orderStatusConfig).map(([status, config]) => (
            <button
              key={status}
              onClick={() => { onTabChange(status); onMenuChange('orders'); }}
              style={{
                padding: '12px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: config.bgColor, color: config.color, fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span>{config.label}</span>
              <span style={{ background: colors.white, padding: '2px 8px', borderRadius: 10, fontSize: 12 }}>
                {orderCounts[status as OrderStatus]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background: colors.white, borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Son Siparişler</h3>
        <OrdersTable orders={orders.slice(0, 5)} compact />
      </div>
    </>
  );
}

function StatCard({ title, value, color, icon }: any) {
  return (
    <div style={{ background: colors.white, borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: colors.gray500, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: colors.gray800 }}>{value}</div>
        </div>
        <div style={{ fontSize: 32 }}>{icon}</div>
      </div>
    </div>
  );
}

function OrdersView({ orders, activeTab, onTabChange, onOrderAction }: any) {
  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <OrderTabButton label="Tümü" count={orders.length} active={activeTab === 'all'} onClick={() => onTabChange('all')} />
        {Object.entries(orderStatusConfig).map(([status, config]) => (
          <OrderTabButton
            key={status}
            label={config.label}
            count={orders.filter((o: Order) => o.status === status).length}
            active={activeTab === status}
            onClick={() => onTabChange(status)}
            color={config.color}
            bgColor={config.bgColor}
          />
        ))}
      </div>
      <div style={{ background: colors.white, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <OrdersTable orders={orders} onAction={onOrderAction} />
      </div>
    </>
  );
}

function OrderTabButton({ label, count, active, onClick, color, bgColor }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
        background: active ? (bgColor || colors.primary) : colors.gray100,
        color: active ? (color || colors.white) : colors.gray600,
        fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
      }}
    >
      {label}
      <span style={{ background: active ? colors.white : colors.gray200, padding: '2px 6px', borderRadius: 8, fontSize: 11 }}>{count}</span>
    </button>
  );
}

function OrdersTable({ orders, onAction, compact }: any) {
  if (orders.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', color: colors.gray500 }}>Sipariş bulunamadı</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: colors.gray50 }}>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Paket</th>
            {!compact && <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Müşteri</th>}
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Restoran</th>
            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Durum</th>
            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>Tutar</th>
            {onAction && <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: colors.gray500 }}>İşlem</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr key={order.id} style={{ borderTop: `1px solid ${colors.gray100}` }}>
              <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: colors.gray800 }}>{order.id}</td>
              {!compact && (
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: colors.gray800 }}>{order.customerName}</div>
                  <div style={{ fontSize: 12, color: colors.gray500 }}>{order.customerPhone}</div>
                </td>
              )}
              <td style={{ padding: '14px 16px', fontSize: 14, color: colors.gray700 }}>{order.restaurantName}</td>
              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                <span style={{
                  padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: orderStatusConfig[order.status].bgColor, color: orderStatusConfig[order.status].color,
                }}>
                  {orderStatusConfig[order.status].label}
                </span>
              </td>
              <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, color: colors.gray800 }}>{order.total} TL</td>
              {onAction && (
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => onAction(order)}
                    style={{ padding: '6px 12px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                  >
                    İşlem
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CouriersView({ couriers, stats, onAdd, onSelect }: any) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard title="Boşta" value={stats.available} color={colors.green} icon="🟢" />
        <StatCard title="Meşgul" value={stats.busy} color={colors.yellow} icon="🟡" />
        <StatCard title="Çevrimdışı" value={stats.offline} color={colors.gray400} icon="⚪" />
      </div>

      <div style={{ background: colors.white, borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Kuryeler</h2>
          <button onClick={onAdd} style={{ padding: '10px 20px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icons.plus /> Kurye Ekle
          </button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {couriers.map((courier: Courier) => (
            <div key={courier.id} onClick={() => onSelect(courier.id)} style={{
              padding: 16, borderRadius: 12, border: `1px solid ${colors.gray200}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: colors.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: colors.gray800 }}>{courier.name}</div>
                  <div style={{ fontSize: 13, color: colors.gray500 }}>{courier.phone}</div>
                  <span style={{
                    display: 'inline-block', marginTop: 4, padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function RestaurantsView({ restaurants, onAdd }: any) {
  return (
    <div style={{ background: colors.white, borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Restoranlar</h2>
        <button onClick={onAdd} style={{ padding: '10px 20px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icons.plus /> Restoran Ekle
        </button>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {restaurants.map((restaurant: Restaurant) => (
          <div key={restaurant.id} style={{ padding: 16, borderRadius: 12, border: `1px solid ${colors.gray200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: colors.gray800 }}>{restaurant.name}</div>
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
  );
}

// ==================== MODAL COMPONENTS ====================

function ModalOverlay({ isOpen, onClose, children }: any) {
  if (!isOpen) return null;
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: 20, overflow: 'auto',
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{ background: colors.white, borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto' }}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${colors.gray200}` }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h3>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: colors.gray500 }}><Icons.x /></button>
    </div>
  );
}

function ModalFooter({ onCancel, onSubmit, submitLabel = 'Kaydet', disabled = false }: any) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '16px 24px', borderTop: `1px solid ${colors.gray200}` }}>
      <button onClick={onCancel} style={{ flex: 1, padding: 12, background: colors.gray100, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: colors.gray700, cursor: 'pointer' }}>İptal</button>
      <button onClick={onSubmit} disabled={disabled} style={{ flex: 1, padding: 12, background: colors.primary, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: colors.white, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.7 : 1 }}>{submitLabel}</button>
    </div>
  );
}

function AddCourierModal({ isOpen, onClose, form, setForm, onSubmit }: any) {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Yeni Kurye Ekle" onClose={onClose} />
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Ad Soyad</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Telefon</label>
          <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Araç Tipi</label>
          <select value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}>
            <option value="motorcycle">Motosiklet</option>
            <option value="bicycle">Bisiklet</option>
            <option value="car">Araba</option>
          </select>
        </div>
      </div>
      <ModalFooter onCancel={onClose} onSubmit={onSubmit} />
    </ModalOverlay>
  );
}

function AddRestaurantModal({ isOpen, onClose, form, setForm, onSubmit }: any) {
  if (!isOpen) return null;
  
  const Section = ({ title, children }: any) => (
    <div style={{ marginBottom: 20, padding: 16, background: colors.gray50, borderRadius: 12 }}>
      <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: colors.gray700 }}>{title}</h4>
      {children}
    </div>
  );

  const Input = ({ label, type = 'text', value, onChange, placeholder }: any) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }} />
    </div>
  );

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div style={{ background: colors.white, borderRadius: 16, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto' }}>
        <ModalHeader title="Yeni Restoran Ekle" onClose={onClose} />
        <div style={{ padding: 24 }}>
          <Section title="📋 Temel Bilgiler">
            <Input label="Restoran Adı *" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="Telefon *" value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} />
              <Input label="E-posta" type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} />
            </div>
            <Input label="Adres *" value={form.address} onChange={(e: any) => setForm({ ...form, address: e.target.value })} />
          </Section>

          <Section title="⏰ Çalışma Bilgileri">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Çalışma Tipi</label>
                <select value={form.workType} onChange={(e) => setForm({ ...form, workType: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}>
                  <option value="full_time">Tam Zamanlı</option>
                  <option value="part_time">Yarı Zamanlı</option>
                  <option value="seasonal">Sezonluk</option>
                </select>
              </div>
              <Input label="Komisyon (%)" type="number" value={form.commission} onChange={(e: any) => setForm({ ...form, commission: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <Input label="Açılış Saati" type="time" value={form.openingTime} onChange={(e: any) => setForm({ ...form, openingTime: e.target.value })} />
              <Input label="Kapanış Saati" type="time" value={form.closingTime} onChange={(e: any) => setForm({ ...form, closingTime: e.target.value })} />
            </div>
          </Section>

          <Section title="💳 Ödeme Şekilleri">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Nakit', 'Kredi Kartı', 'Debit Kart', 'Online Ödeme', 'Sodexo', 'Multinet'].map((method) => (
                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: (form.paymentMethods || []).includes(method) ? colors.primaryLight : colors.white, border: `1px solid ${(form.paymentMethods || []).includes(method) ? colors.primary : colors.gray300}`, borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={(form.paymentMethods || []).includes(method)} onChange={(e) => {
                    const current = form.paymentMethods || [];
                    setForm({ ...form, paymentMethods: e.target.checked ? [...current, method] : current.filter((m: string) => m !== method) });
                  }} style={{ margin: 0 }} />
                  {method}
                </label>
              ))}
            </div>
          </Section>

          <Section title="🔗 Entegrasyonlar">
            {[
              { key: 'yemeksepeti', label: '🍔 Yemeksepeti', idField: 'yemeksepetiId' },
              { key: 'getir', label: '🚀 Getir', idField: 'getirId' },
              { key: 'trendyol', label: '🟠 Trendyol', idField: 'trendyolId' },
              { key: 'migros', label: '🟡 Migros', idField: 'migrosId' },
            ].map(({ key, label, idField }) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.integrations?.[key] || false} onChange={(e) => setForm({ ...form, integrations: { ...form.integrations, [key]: e.target.checked } })} />
                  {label}
                </label>
                {form.integrations?.[key] && (
                  <input type="text" placeholder="Restaurant ID" value={(form as any)[idField] || ''} onChange={(e) => setForm({ ...form, [idField]: e.target.value })} style={{ width: '100%', marginTop: 8, marginLeft: 24, padding: '8px 12px', border: `1px solid ${colors.gray300}`, borderRadius: 6, fontSize: 13 }} />
                )}
              </div>
            ))}
          </Section>
        </div>
        <ModalFooter onCancel={onClose} onSubmit={onSubmit} />
      </div>
    </ModalOverlay>
  );
}

function CreditModal({ isOpen, onClose, credits, amount, setAmount, paymentMethod, setPaymentMethod, onSubmit }: any) {
  const transactions = [
    { date: '22.03.2025', desc: 'Kontör Yükleme', amount: 5000, status: 'Tamamlandı' },
    { date: '21.03.2025', desc: 'Sipariş Kesintisi', amount: -125, status: 'Tamamlandı' },
    { date: '20.03.2025', desc: 'Kontör Yükleme', amount: 10000, status: 'Tamamlandı' },
  ];

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Kontör Yükle" onClose={onClose} />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          <CreditCard label="Mevcut Bakiye" value={`${credits.current.toLocaleString()} TL`} color={colors.primary} />
          <CreditCard label="Bekleyen" value={`${credits.pending.toLocaleString()} TL`} color={colors.yellow} />
          <CreditCard label="Toplam Yüklenen" value={`${credits.total.toLocaleString()} TL`} color={colors.green} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Yüklenecek Tutar</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="örn: 1000" style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Ödeme Yöntemi</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}>
            <option value="credit_card">Kredi Kartı</option>
            <option value="bank_transfer">Banka Havalesi</option>
            <option value="eft">EFT</option>
          </select>
        </div>

        <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>Son İşlemler</h4>
        <div style={{ display: 'grid', gap: 8 }}>
          {transactions.map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: colors.gray50, borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t.desc}</div>
                <div style={{ fontSize: 12, color: colors.gray500 }}>{t.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.amount > 0 ? colors.green : colors.red }}>{t.amount > 0 ? '+' : ''}{t.amount} TL</div>
                <div style={{ fontSize: 11, color: colors.gray400 }}>{t.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ModalFooter onCancel={onClose} onSubmit={onSubmit} submitLabel="Yükle" />
    </ModalOverlay>
  );
}

function CreditCard({ label, value, color }: any) {
  return (
    <div style={{ padding: 16, background: colors.gray50, borderRadius: 12, textAlign: 'center', borderLeft: `3px solid ${color}` }}>
      <div style={{ fontSize: 12, color: colors.gray500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function OrderActionModal({ isOpen, onClose, order, couriers, onAssign, onStatusChange }: any) {
  const [action, setAction] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('');

  if (!isOpen || !order) return null;

  const availableCouriers = couriers.filter((c: Courier) => c.status === 'available');

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <ModalHeader title={`Sipariş İşlemleri - ${order.id}`} onClose={onClose} />
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 16, padding: 12, background: colors.gray50, borderRadius: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{order.customerName}</div>
          <div style={{ fontSize: 13, color: colors.gray500 }}>{order.restaurantName}</div>
          <div style={{ fontSize: 13, color: colors.gray600 }}>{order.address}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: colors.primary, marginTop: 8 }}>{order.total} TL</div>
        </div>

        <div style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
          {order.status === 'waiting' && <ActionButton label="🛵 Kurye Ata" onClick={() => setAction('assign')} active={action === 'assign'} />}
          {(order.status === 'assigned' || order.status === 'onway') && (
            <>
              <ActionButton label="🔄 Kurye Değiştir" onClick={() => setAction('change')} active={action === 'change'} />
              <ActionButton label="🚚 Yola Çıkar" onClick={() => onStatusChange(order.id, 'onway')} active={action === 'onway'} />
            </>
          )}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <>
              <ActionButton label="✅ Teslim Et" onClick={() => onStatusChange(order.id, 'delivered')} active={action === 'deliver'} color={colors.green} />
              <ActionButton label="❌ İptal Et" onClick={() => onStatusChange(order.id, 'cancelled')} active={action === 'cancel'} color={colors.red} bgColor={colors.redLight} />
            </>
          )}
        </div>

        {(action === 'assign' || action === 'change') && (
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Kurye Seç</label>
            <select value={selectedCourier} onChange={(e) => setSelectedCourier(e.target.value)} style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}>
              <option value="">Kurye seçin</option>
              {availableCouriers.map((c: Courier) => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
            </select>
            <button
              onClick={() => selectedCourier && onAssign(order.id, selectedCourier)}
              disabled={!selectedCourier}
              style={{ width: '100%', marginTop: 12, padding: 12, background: selectedCourier ? colors.primary : colors.gray300, color: colors.white, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: selectedCourier ? 'pointer' : 'not-allowed' }}
            >
              {action === 'assign' ? 'Ata' : 'Değiştir'}
            </button>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

function ActionButton({ label, onClick, active, color, bgColor }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: '12px 16px', background: active ? (bgColor || colors.primary) : colors.gray100,
        color: active ? (color || colors.white) : colors.gray700, border: 'none', borderRadius: 8,
        fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
      }}
    >
      {label}
    </button>
  );
}

function ReportsView({ orders, couriers, restaurants }: any) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportType, setReportType] = useState('orders');

  const filteredOrders = useMemo(() => {
    if (!dateFrom && !dateTo) return orders;
    return orders.filter((o: Order) => {
      const orderDate = new Date(o.createdAt);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      if (from && orderDate < from) return false;
      if (to && orderDate > to) return false;
      return true;
    });
  }, [orders, dateFrom, dateTo]);

  const exportToExcel = () => {
    let csv = 'Paket ID,Müşteri,Telefon,Restoran,Adres,Durum,Tutar,Tariş\n';
    filteredOrders.forEach((o: Order) => {
      csv += `${o.id},${o.customerName},${o.customerPhone},${o.restaurantName},"${o.address}",${o.status},${o.total},${o.createdAt}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rapor_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const stats = {
    total: filteredOrders.length,
    delivered: filteredOrders.filter((o: Order) => o.status === 'delivered').length,
    cancelled: filteredOrders.filter((o: Order) => o.status === 'cancelled').length,
    revenue: filteredOrders.filter((o: Order) => o.status === 'delivered').reduce((sum: number, o: Order) => sum + o.total, 0),
  };

  return (
    <div style={{ background: colors.white, borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Raporlar</h2>
        <button onClick={exportToExcel} style={{ padding: '10px 20px', background: colors.green, color: colors.white, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icons.download /> Excel'e Aktar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Rapor Tipi</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} style={{ width: '100%', padding: 10, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }}>
            <option value="orders">Sipariş Raporu</option>
            <option value="couriers">Kurye Raporu</option>
            <option value="restaurants">Restoran Raporu</option>
          </select>
        </div>
        <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Başlangıç</label><input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ width: '100%', padding: 10, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }} /></div>
        <div><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Bitiş</label><input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ width: '100%', padding: 10, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }} /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 20 }}>
        <StatCard title="Toplam" value={stats.total} color={colors.primary} icon="📊" />
        <StatCard title="Teslim" value={stats.delivered} color={colors.green} icon="✅" />
        <StatCard title="İptal" value={stats.cancelled} color={colors.red} icon="❌" />
        <StatCard title="Ciro" value={`${stats.revenue} TL`} color={colors.primary} icon="💰" />
      </div>

      <OrdersTable orders={filteredOrders} />
    </div>
  );
}

function SettingsView({ dealerSettings, onSave }: any) {
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
        {saved && <span style={{ color: colors.green, fontSize: 14, fontWeight: 500 }}>✓ Kaydedildi</span>}
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Bayi Adı</label>
          <input type="text" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }} />
        </div>
        <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Adres</label>
          <input type="text" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Çalışma Saati (Başlangıç)</label>
            <input type="time" value={settings.workingHoursStart} onChange={(e) => setSettings({ ...settings, workingHoursStart: e.target.value })} style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }} />
          </div>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Çalışma Saati (Bitiş)</label>
            <input type="time" value={settings.workingHoursEnd} onChange={(e) => setSettings({ ...settings, workingHoursEnd: e.target.value })} style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }} />
          </div>
        </div>
        <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Maksimum Atama Mesafesi (km)</label>
          <input type="number" value={settings.maxAssignmentDistance} onChange={(e) => setSettings({ ...settings, maxAssignmentDistance: parseInt(e.target.value) })} style={{ width: '100%', padding: 12, border: `1px solid ${colors.gray300}`, borderRadius: 8, fontSize: 14 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: colors.gray50, borderRadius: 8 }}>
          <input type="checkbox" id="autoAssign" checked={settings.autoAssignEnabled} onChange={(e) => setSettings({ ...settings, autoAssignEnabled: e.target.checked })} style={{ width: 20, height: 20 }} />
          <label htmlFor="autoAssign" style={{ fontSize: 14, cursor: 'pointer' }}>Otomatik Kurye Atama Aktif</label>
        </div>
        <button onClick={handleSave} style={{ padding: '14px 24px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Kaydet</button>
      </div>
    </div>
  );
}
