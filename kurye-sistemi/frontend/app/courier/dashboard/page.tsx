'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import for the entire map component (client-side only)
const LiveMap = dynamic(() => import('./LiveMap'), { 
  ssr: false,
  loading: () => <div style={{ height: '100%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>Harita yükleniyor...</div>
});

// Bodrum center coordinates
const BODRUM_CENTER: [number, number] = [37.0344, 27.4305];

// ==================== COLORS ====================
const colors = {
  primary: '#6B46C1', primaryDark: '#5c3cbb', primaryLight: '#7C3AED',
  sidebarBg: '#4c1d95', white: '#FFFFFF', yellow: '#FCD34D',
  gray50: '#F9FAFB', gray100: '#F3F4F6', gray200: '#E5E7EB',
  gray300: '#D1D5DB', gray400: '#9CA3AF', gray500: '#6B7280',
  gray600: '#4B5563', gray700: '#374151', gray800: '#1F2937',
  green: '#10B981', red: '#EF4444', orange: '#F97316', blue: '#3B82F6'
};

// ==================== TYPES ====================
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

// ==================== INITIAL DATA ====================
const initialCouriers: Courier[] = [
  { id: 1, name: 'Furkan Nam', phone: '0555 111 2233', email: 'furkan@paketciniz.com', status: 'active', deliveries: 47, rating: 4.8, location: { lat: 37.0344, lng: 27.4305 }, vehicleType: 'motorcycle', joinDate: '2024-01-15' },
  { id: 2, name: 'Ahmet Yılmaz', phone: '0555 222 3344', email: 'ahmet@paketciniz.com', status: 'passive', deliveries: 32, rating: 4.5, location: null, vehicleType: 'bicycle', joinDate: '2024-02-20' },
  { id: 3, name: 'Mehmet Kaya', phone: '0555 333 4455', email: 'mehmet@paketciniz.com', status: 'passive', deliveries: 28, rating: 4.2, location: null, vehicleType: 'motorcycle', joinDate: '2024-03-10' },
  { id: 4, name: 'Ali Demir', phone: '0555 444 5566', email: 'ali@paketciniz.com', status: 'offline', deliveries: 41, rating: 4.9, location: null, vehicleType: 'car', joinDate: '2024-01-05' },
  { id: 5, name: 'Can Özdemir', phone: '0555 555 6677', email: 'can@paketciniz.com', status: 'passive', deliveries: 19, rating: 4.0, location: null, vehicleType: 'motorcycle', joinDate: '2024-04-01' },
  { id: 6, name: 'Emre Şahin', phone: '0555 666 7788', email: 'emre@paketciniz.com', status: 'passive', deliveries: 35, rating: 4.6, location: null, vehicleType: 'bicycle', joinDate: '2024-02-15' },
  { id: 7, name: 'Burak Yıldız', phone: '0555 777 8899', email: 'burak@paketciniz.com', status: 'passive', deliveries: 23, rating: 4.3, location: null, vehicleType: 'motorcycle', joinDate: '2024-03-25' }
];

const initialRestaurants: Restaurant[] = [
  { id: 1, name: 'ASMA DÖNER', phone: '0252 316 48 48', address: 'Bahçelievler Mah. No:15 Bodrum', status: 'active', orders: 47, rating: 4.7, commission: 15, location: { lat: 37.0344, lng: 27.4305 } },
  { id: 2, name: 'Bodrum Lokantası', phone: '0252 313 12 34', address: 'Cumhuriyet Cad. No:28 Bodrum', status: 'active', orders: 23, rating: 4.5, commission: 12, location: { lat: 37.0365, lng: 27.4280 } },
  { id: 3, name: 'Ege Balık Evi', phone: '0252 316 56 78', address: 'Kumbahçe Mah. No:42 Bodrum', status: 'inactive', orders: 0, rating: 4.2, commission: 18, location: { lat: 37.0320, lng: 27.4350 } },
  { id: 4, name: 'Limon Cafe', phone: '0252 318 90 12', address: 'Yalıkavak Mah. No:8 Bodrum', status: 'active', orders: 31, rating: 4.6, commission: 10, location: { lat: 37.1050, lng: 27.2600 } },
  { id: 5, name: 'Gümbet Burger', phone: '0252 319 34 56', address: 'Gümbet Mah. No:25 Bodrum', status: 'active', orders: 52, rating: 4.4, commission: 14, location: { lat: 37.0250, lng: 27.4200 } }
];

// ==================== MAIN COMPONENT ====================
export default function CourierDashboard() {
  const router = useRouter();
  const [activeView, setActiveView] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Hünkar Yılmaz', company: 'Paketçiniz Bodrum' });
  const [orders, setOrders] = useState<any[]>([]);
  const [credits, setCredits] = useState(678);
  
  // Data states
  const [couriers, setCouriers] = useState<Courier[]>(initialCouriers);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  
  // Modal states
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  
  // Form states
  const [courierForm, setCourierForm] = useState<{ name: string; phone: string; email: string; vehicleType: 'motorcycle' | 'bicycle' | 'car' }>({ name: '', phone: '', email: '', vehicleType: 'motorcycle' });
  const [restaurantForm, setRestaurantForm] = useState({ name: '', phone: '', address: '', commission: '15' });

  useEffect(() => {
    const stored = localStorage.getItem('courier_user');
    if (!stored) { window.location.href = '/login.html'; return; }
    setUser(JSON.parse(stored));
    const restaurantOrders = localStorage.getItem('restaurant_orders');
    if (restaurantOrders) setOrders(JSON.parse(restaurantOrders));
    
    const savedCouriers = localStorage.getItem('courier_data');
    const savedRestaurants = localStorage.getItem('restaurant_data');
    if (savedCouriers) setCouriers(JSON.parse(savedCouriers));
    if (savedRestaurants) setRestaurants(JSON.parse(savedRestaurants));
  }, [router]);

  useEffect(() => { localStorage.setItem('courier_data', JSON.stringify(couriers)); }, [couriers]);
  useEffect(() => { localStorage.setItem('restaurant_data', JSON.stringify(restaurants)); }, [restaurants]);

  const handleLogout = () => { localStorage.removeItem('courier_user'); window.location.href = '/login.html'; };
  
  const syncWithRestaurant = () => {
    const restaurantOrders = localStorage.getItem('restaurant_orders');
    if (restaurantOrders) { 
      setOrders(JSON.parse(restaurantOrders)); 
      alert(`${JSON.parse(restaurantOrders).length} sipariş senkronize edildi!`);
    }
  };

  // Courier CRUD
  const openAddCourier = () => {
    setEditingCourier(null);
    setCourierForm({ name: '', phone: '', email: '', vehicleType: 'motorcycle' });
    setShowCourierModal(true);
  };

  const openEditCourier = (courier: Courier) => {
    setEditingCourier(courier);
    setCourierForm({ name: courier.name, phone: courier.phone, email: courier.email, vehicleType: courier.vehicleType });
    setShowCourierModal(true);
  };

  const handleSaveCourier = () => {
    if (!courierForm.name || !courierForm.phone) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }
    if (editingCourier) {
      setCouriers(couriers.map(c => c.id === editingCourier.id ? { ...c, ...courierForm } : c));
      alert(`${courierForm.name} güncellendi!`);
    } else {
      const newCourier: Courier = {
        id: Date.now(), name: courierForm.name, phone: courierForm.phone, email: courierForm.email,
        status: 'passive', deliveries: 0, rating: 5.0, location: null,
        vehicleType: courierForm.vehicleType, joinDate: new Date().toISOString().split('T')[0]
      };
      setCouriers([...couriers, newCourier]);
      alert(`${newCourier.name} başarıyla eklendi!`);
    }
    setShowCourierModal(false);
  };

  const handleDeleteCourier = (id: number) => {
    if (confirm('Bu kuryeyi silmek istediğinize emin misiniz?')) {
      setCouriers(couriers.filter(c => c.id !== id));
    }
  };

  // Restaurant CRUD
  const openAddRestaurant = () => {
    setEditingRestaurant(null);
    setRestaurantForm({ name: '', phone: '', address: '', commission: '15' });
    setShowRestaurantModal(true);
  };

  const openEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setRestaurantForm({ name: restaurant.name, phone: restaurant.phone, address: restaurant.address, commission: restaurant.commission.toString() });
    setShowRestaurantModal(true);
  };

  const handleSaveRestaurant = () => {
    if (!restaurantForm.name || !restaurantForm.phone || !restaurantForm.address) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }
    if (editingRestaurant) {
      setRestaurants(restaurants.map(r => r.id === editingRestaurant.id ? { 
        ...r, name: restaurantForm.name, phone: restaurantForm.phone, 
        address: restaurantForm.address, commission: parseInt(restaurantForm.commission) || 15 
      } : r));
      alert(`${restaurantForm.name} güncellendi!`);
    } else {
      const newRestaurant: Restaurant = {
        id: Date.now(), name: restaurantForm.name, phone: restaurantForm.phone, address: restaurantForm.address,
        status: 'active', orders: 0, rating: 5.0, commission: parseInt(restaurantForm.commission) || 15,
        location: { lat: 37.0344 + (Math.random() - 0.5) * 0.02, lng: 27.4305 + (Math.random() - 0.5) * 0.02 }
      };
      setRestaurants([...restaurants, newRestaurant]);
      alert(`${newRestaurant.name} başarıyla eklendi!`);
    }
    setShowRestaurantModal(false);
  };

  const handleDeleteRestaurant = (id: number) => {
    if (confirm('Bu restoranı silmek istediğinize emin misiniz?')) {
      setRestaurants(restaurants.filter(r => r.id !== id));
    }
  };

  const stats = { 
    delivered: orders.filter(o => o.status === 'delivered').length, 
    processing: orders.filter(o => o.status === 'onway').length, 
    cancelled: orders.filter(o => o.status === 'cancelled').length, 
    pending: orders.filter(o => o.status === 'pending').length,
    totalCouriers: couriers.length, activeCouriers: couriers.filter(c => c.status === 'active').length,
    totalRestaurants: restaurants.length, activeRestaurants: restaurants.filter(r => r.status === 'active').length
  };

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'map', icon: '🗺️', label: 'Harita' },
    { id: 'restaurant', icon: '🏪', label: 'Restoranlar' },
    { id: 'courier', icon: '🚴', label: 'Kuryeler' },
    { id: 'report', icon: '📈', label: 'Raporlar' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.gray50 }}>
      {/* Sidebar */}
      <aside style={{ width: 80, background: colors.sidebarBg, color: colors.white, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div style={{ marginBottom: 32, fontSize: 28, fontWeight: 800 }}>P</div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveView(item.id)} title={item.label}
              style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, border: 'none', background: activeView === item.id ? colors.white : 'transparent', color: activeView === item.id ? colors.primary : colors.white, cursor: 'pointer', fontSize: 24, transition: 'all 0.2s', boxShadow: activeView === item.id ? '0 4px 12px rgba(0,0,0,0.15)' : 'none' }}>
              {item.icon}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, border: 'none', background: 'transparent', color: colors.white, cursor: 'pointer', fontSize: 20, opacity: 0.7 }}>🚪</button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 80, minHeight: '100vh' }}>
        {/* Header */}
        <header style={{ background: colors.white, padding: '16px 32px', borderBottom: `1px solid ${colors.gray200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.gray800, margin: 0 }}>Paketçiniz</h1>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: colors.gray500 }}>{user.company}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8, background: colors.gray50, padding: '6px', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: colors.primary, borderRadius: 10, color: colors.white }}>
                <span>✓</span>
                <div>
                  <div style={{ fontSize: 10, opacity: 0.9 }}>TESLİM</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{stats.delivered}</div>
                </div>
              </div>
              {['Bekleyen', 'Yolda', 'İptal'].map((label, idx) => {
                const values = [stats.pending, stats.processing, stats.cancelled];
                return (
                  <div key={label} style={{ textAlign: 'center', padding: '8px 16px' }}>
                    <div style={{ fontSize: 10, color: colors.gray400 }}>{label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: values[idx] > 0 ? colors.gray800 : colors.gray300 }}>{values[idx]}</div>
                  </div>
                );
              })}
            </div>
            <div onClick={syncWithRestaurant} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: colors.primary, borderRadius: 10, color: colors.white, cursor: 'pointer', boxShadow: '0 4px 12px rgba(107, 70, 193, 0.25)' }}>
              <span>⏱</span>
              <div>
                <div style={{ fontSize: 10, opacity: 0.9 }}>Kontör</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{credits}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 16, borderLeft: `1px solid ${colors.gray200}` }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: colors.gray500 }}>Yönetici</div>
              </div>
              <div style={{ width: 44, height: 44, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontWeight: 700 }}>{user.name.charAt(0)}</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: 32 }}>
          {activeView === 'dashboard' && <DashboardView stats={stats} orders={orders} couriers={couriers} restaurants={restaurants} setActiveView={setActiveView} />}
          {activeView === 'map' && <MapView couriers={couriers} restaurants={restaurants} />}
          {activeView === 'courier' && <CouriersView couriers={couriers} onAdd={openAddCourier} onEdit={openEditCourier} onDelete={handleDeleteCourier} />}
          {activeView === 'restaurant' && <RestaurantsView restaurants={restaurants} onAdd={openAddRestaurant} onEdit={openEditRestaurant} onDelete={handleDeleteRestaurant} />}
          {activeView === 'report' && <ReportsView stats={stats} couriers={couriers} restaurants={restaurants} orders={orders} />}
        </div>
      </main>

      {/* Courier Modal */}
      {showCourierModal && (
        <Modal title={editingCourier ? 'Kurye Düzenle' : 'Yeni Kurye Ekle'} onClose={() => setShowCourierModal(false)}>
          <FormInput label="Ad Soyad" value={courierForm.name} onChange={(v: string) => setCourierForm({...courierForm, name: v})} placeholder="örn: Ahmet Yılmaz" required />
          <FormInput label="Telefon" value={courierForm.phone} onChange={(v: string) => setCourierForm({...courierForm, phone: v})} placeholder="örn: 0555 123 4567" required />
          <FormInput label="E-posta" value={courierForm.email} onChange={(v: string) => setCourierForm({...courierForm, email: v})} placeholder="örn: ahmet@email.com" />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.gray700, marginBottom: 6 }}>Araç Tipi</label>
            <select value={courierForm.vehicleType} onChange={(e) => setCourierForm({...courierForm, vehicleType: e.target.value as any})} style={{ width: '100%', padding: '12px 16px', border: `2px solid ${colors.gray200}`, borderRadius: 10, fontSize: 15 }}>
              <option value="motorcycle">🏍️ Motorsiklet</option>
              <option value="bicycle">🚲 Bisiklet</option>
              <option value="car">🚗 Araba</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={() => setShowCourierModal(false)} style={{ flex: 1, padding: '14px', background: colors.gray100, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: colors.gray700, cursor: 'pointer' }}>İptal</button>
            <button onClick={handleSaveCourier} style={{ flex: 1, padding: '14px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{editingCourier ? 'Güncelle' : 'Kurye Ekle'}</button>
          </div>
        </Modal>
      )}

      {/* Restaurant Modal */}
      {showRestaurantModal && (
        <Modal title={editingRestaurant ? 'Restoran Düzenle' : 'Yeni Restoran Ekle'} onClose={() => setShowRestaurantModal(false)}>
          <FormInput label="Restoran Adı" value={restaurantForm.name} onChange={(v: string) => setRestaurantForm({...restaurantForm, name: v})} placeholder="örn: Lezzet Döner" required />
          <FormInput label="Telefon" value={restaurantForm.phone} onChange={(v: string) => setRestaurantForm({...restaurantForm, phone: v})} placeholder="örn: 0252 123 4567" required />
          <FormInput label="Adres" value={restaurantForm.address} onChange={(v: string) => setRestaurantForm({...restaurantForm, address: v})} placeholder="örn: Bahçelievler Mah. No:15 Bodrum" required />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.gray700, marginBottom: 6 }}>Komisyon Oranı (%)</label>
            <input type="number" value={restaurantForm.commission} onChange={(e) => setRestaurantForm({...restaurantForm, commission: e.target.value})} min="5" max="30" style={{ width: '100%', padding: '12px 16px', border: `2px solid ${colors.gray200}`, borderRadius: 10, fontSize: 15 }} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={() => setShowRestaurantModal(false)} style={{ flex: 1, padding: '14px', background: colors.gray100, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: colors.gray700, cursor: 'pointer' }}>İptal</button>
            <button onClick={handleSaveRestaurant} style={{ flex: 1, padding: '14px', background: colors.green, color: colors.white, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{editingRestaurant ? 'Güncelle' : 'Restoran Ekle'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ==================== SUB VIEWS ====================

function DashboardView({ stats, orders, couriers, restaurants, setActiveView }: any) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '🚴', label: 'Toplam Kurye', value: stats.totalCouriers, sub: `${stats.activeCouriers} aktif`, color: colors.primary },
          { icon: '🏪', label: 'Restoran', value: stats.totalRestaurants, sub: `${stats.activeRestaurants} aktif`, color: colors.green },
          { icon: '✓', label: 'Teslim Edilen', value: stats.delivered, sub: 'Bugün', color: colors.orange },
          { icon: '⏱', label: 'Bekleyen', value: stats.pending, sub: 'Sipariş', color: colors.red }
        ].map((s, i) => (
          <div key={i} style={{ background: colors.white, borderRadius: 16, padding: 20, border: `1px solid ${colors.gray200}`, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 13, color: colors.gray500, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: colors.gray800 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ background: colors.white, borderRadius: 16, border: `1px solid ${colors.gray200}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', background: colors.primary, color: colors.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Canlı Konumlar</div>
            <button onClick={() => setActiveView('map')} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, color: colors.white, fontSize: 12, cursor: 'pointer' }}>Tümünü Gör →</button>
          </div>
          <div style={{ height: 300 }}>
            <LiveMap couriers={couriers} restaurants={restaurants} />
          </div>
        </div>
        
        <div style={{ background: colors.white, borderRadius: 16, border: `1px solid ${colors.gray200}`, padding: 24 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 18, color: colors.gray800 }}>Son Aktiviteler</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { time: '14:32', text: 'Furkan Nam sipariş #1243 teslim etti' },
              { time: '14:28', text: 'Yeni sipariş alındı - ASMA DÖNER' },
              { time: '14:15', text: 'Ahmet Yılmaz aktif duruma geçti' },
              { time: '14:05', text: 'Sipariş #1239 iptal edildi' }
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, background: colors.gray50, borderRadius: 10 }}>
                <span style={{ fontSize: 12, color: colors.gray400, minWidth: 45 }}>{a.time}</span>
                <span style={{ fontSize: 14, color: colors.gray700 }}>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <OrdersTable orders={orders} />
    </>
  );
}

function MapView({ couriers, restaurants }: { couriers: Courier[], restaurants: Restaurant[] }) {
  return (
    <div style={{ background: colors.white, borderRadius: 16, border: `1px solid ${colors.gray200}`, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, color: colors.gray800 }}>Bodrum Canlı Harita</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: colors.gray500 }}>OpenStreetMap • Gerçek zamanlı kurye ve restoran takibi</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ padding: '8px 16px', background: `${colors.green}15`, borderRadius: 8, color: colors.green, fontWeight: 600, fontSize: 13 }}>🟢 Aktif: {couriers.filter(c => c.status === 'active').length}</span>
          <span style={{ padding: '8px 16px', background: `${colors.primary}15`, borderRadius: 8, color: colors.primary, fontWeight: 600, fontSize: 13 }}>🏪 Restoran: {restaurants.length}</span>
        </div>
      </div>
      <div style={{ height: 500, borderRadius: 12, overflow: 'hidden' }}>
        <LiveMap couriers={couriers} restaurants={restaurants} />
      </div>
    </div>
  );
}

function CouriersView({ couriers, onAdd, onEdit, onDelete }: { couriers: Courier[], onAdd: () => void, onEdit: (c: Courier) => void, onDelete: (id: number) => void }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, color: colors.gray800 }}>Kurye Yönetimi</h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: colors.gray500 }}>{couriers.length} kurye kayıtlı</p>
        </div>
        <button onClick={onAdd} style={{ padding: '12px 24px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Yeni Kurye Ekle</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {couriers.map(c => (
          <div key={c.id} style={{ background: colors.white, borderRadius: 16, border: `1px solid ${colors.gray200}`, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 50, height: 50, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontSize: 18, fontWeight: 700 }}>{c.name.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: colors.gray500 }}>{c.phone}</div>
                </div>
              </div>
              <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 700, background: c.status === 'active' ? '#D1FAE5' : c.status === 'onway' ? '#DBEAFE' : colors.gray100, color: c.status === 'active' ? '#059669' : c.status === 'onway' ? '#2563EB' : colors.gray600 }}>
                {c.status === 'active' ? 'Aktif' : c.status === 'onway' ? 'Yolda' : 'Pasif'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, padding: 10, background: colors.gray50, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: colors.primary }}>{c.deliveries}</div>
                <div style={{ fontSize: 11, color: colors.gray500 }}>Teslimat</div>
              </div>
              <div style={{ flex: 1, padding: 10, background: colors.gray50, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#D97706' }}>⭐{c.rating}</div>
                <div style={{ fontSize: 11, color: colors.gray500 }}>Puan</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onEdit(c)} style={{ flex: 1, padding: '10px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Düzenle</button>
              <button onClick={() => onDelete(c.id)} style={{ padding: '10px', background: colors.gray100, border: 'none', borderRadius: 8, cursor: 'pointer', color: colors.red }}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function RestaurantsView({ restaurants, onAdd, onEdit, onDelete }: { restaurants: Restaurant[], onAdd: () => void, onEdit: (r: Restaurant) => void, onDelete: (id: number) => void }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, color: colors.gray800 }}>Restoran Yönetimi</h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: colors.gray500 }}>{restaurants.length} restoran kayıtlı</p>
        </div>
        <button onClick={onAdd} style={{ padding: '12px 24px', background: colors.green, color: colors.white, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Yeni Restoran Ekle</button>
      </div>
      <div style={{ background: colors.white, borderRadius: 16, border: `1px solid ${colors.gray200}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: colors.gray50 }}>
              {['Restoran', 'Telefon', 'Adres', 'Durum', 'Sipariş', 'Puan', 'Komisyon', 'İşlemler'].map(h => 
                <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: colors.gray500 }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {restaurants.map(r => (
              <tr key={r.id} style={{ borderTop: `1px solid ${colors.gray100}` }}>
                <td style={{ padding: '16px 20px', fontWeight: 700 }}>🏪 {r.name}</td>
                <td style={{ padding: '16px 20px', color: colors.gray600 }}>{r.phone}</td>
                <td style={{ padding: '16px 20px', color: colors.gray600 }}>{r.address}</td>
                <td style={{ padding: '16px 20px' }}><span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: r.status === 'active' ? '#D1FAE5' : colors.gray100, color: r.status === 'active' ? '#059669' : colors.gray600 }}>{r.status === 'active' ? 'Aktif' : 'Pasif'}</span></td>
                <td style={{ padding: '16px 20px', fontWeight: 700, color: colors.primary }}>{r.orders}</td>
                <td style={{ padding: '16px 20px', color: '#D97706' }}>⭐ {r.rating}</td>
                <td style={{ padding: '16px 20px' }}>%{r.commission}</td>
                <td style={{ padding: '16px 20px' }}>
                  <button onClick={() => onEdit(r)} style={{ padding: '6px 12px', background: colors.primary, color: colors.white, border: 'none', borderRadius: 6, cursor: 'pointer', marginRight: 8 }}>Düzenle</button>
                  <button onClick={() => onDelete(r.id)} style={{ padding: '6px 12px', background: colors.gray100, border: 'none', borderRadius: 6, cursor: 'pointer', color: colors.red }}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ReportsView({ stats, couriers, restaurants, orders }: any) {
  return (
    <>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, color: colors.gray800 }}>Detaylı Raporlar</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Günlük Sipariş', value: orders.filter((o: any) => o.status).length || 47, color: colors.primary },
          { label: 'Aktif Kurye', value: stats.activeCouriers, color: colors.green },
          { label: 'Toplam Gelir', value: '₺45,320', color: colors.orange },
          { label: 'Ort. Teslimat', value: '18 dk', color: colors.blue }
        ].map((s, i) => (
          <div key={i} style={{ background: colors.white, borderRadius: 16, padding: 24, border: `1px solid ${colors.gray200}` }}>
            <div style={{ fontSize: 13, color: colors.gray500, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: colors.white, borderRadius: 16, border: `1px solid ${colors.gray200}`, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', color: colors.gray800 }}>Performans Özeti</h3>
        <p style={{ color: colors.gray500 }}>📊 Detaylı grafik ve istatistikler burada gösterilecek...</p>
      </div>
    </>
  );
}

function OrdersTable({ orders }: { orders: any[] }) {
  const [filter, setFilter] = useState('pending');
  const filtered = orders.filter(o => filter === 'all' ? true : o.status === filter);
  
  return (
    <div style={{ background: colors.white, borderRadius: 16, border: `1px solid ${colors.gray200}`, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.gray200}`, display: 'flex', gap: 10 }}>
        {[{k:'pending',l:'Bekleyen'},{k:'onway',l:'Yolda'},{k:'delivered',l:'Teslim'},{k:'cancelled',l:'İptal'}].map((f: any) => (
          <button key={f.k} onClick={() => setFilter(f.k)} style={{ padding: '10px 20px', background: filter === f.k ? colors.primary : colors.gray50, border: 'none', borderRadius: 10, color: filter === f.k ? colors.white : colors.gray600, fontWeight: 600, cursor: 'pointer' }}>{f.l}</button>
        ))}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: colors.gray50 }}>
            {['Sipariş', 'Müşteri', 'Restoran', 'Durum', 'Tutar'].map(h => <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: colors.gray500 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={5} style={{ padding: 60, textAlign: 'center', color: colors.gray400 }}>📭 Bu kategoride sipariş bulunmamaktadır</td></tr>
          ) : (
            filtered.map((o: any) => (
              <tr key={o.id} style={{ borderTop: `1px solid ${colors.gray100}` }}>
                <td style={{ padding: '16px 20px', fontWeight: 700, color: colors.primary }}>#{o.id}</td>
                <td style={{ padding: '16px 20px' }}>{o.customerName}</td>
                <td style={{ padding: '16px 20px' }}>ASMA DÖNER</td>
                <td style={{ padding: '16px 20px' }}><span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: o.status === 'pending' ? '#FEF3C7' : o.status === 'onway' ? '#DBEAFE' : '#D1FAE5', color: o.status === 'pending' ? '#D97706' : o.status === 'onway' ? '#2563EB' : '#059669' }}>{o.status === 'pending' ? 'Bekliyor' : o.status === 'onway' ? 'Yolda' : 'Teslim'}</span></td>
                <td style={{ padding: '16px 20px', fontWeight: 700 }}>{o.total?.toFixed(2)} ₺</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ==================== UI COMPONENTS ====================

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: colors.white, borderRadius: 16, width: '100%', maxWidth: 450, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.gray200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colors.gray800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.gray700, marginBottom: 6 }}>{label} {required && <span style={{ color: colors.red }}>*</span>}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} style={{ width: '100%', padding: '12px 16px', border: `2px solid ${colors.gray200}`, borderRadius: 10, fontSize: 15, boxSizing: 'border-box' }} />
    </div>
  );
}
