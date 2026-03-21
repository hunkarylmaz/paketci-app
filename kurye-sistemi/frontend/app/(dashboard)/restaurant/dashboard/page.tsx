'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Icons as SVG components for exact styling
const Icons = {
  menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shoppingBag: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 6h18M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  fileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  barChart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dollar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  mapPin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  list: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  x: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const menuItems = [
  { id: 'orders', icon: Icons.shoppingBag, label: 'Siparişler', active: true },
  { id: 'reports', icon: Icons.fileText, label: 'Raporlar' },
  { id: 'stats', icon: Icons.barChart, label: 'İstatistik' },
  { id: 'calendar', icon: Icons.calendar, label: 'Takvim' },
  { id: 'finance', icon: Icons.dollar, label: 'Finans' },
];

export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [user, setUser] = useState({ name: 'ASMA DÖNER', dealerName: 'Paketçiniz Bodrum' });
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    totalAmount: '',
    paymentMethod: 'Nakit',
    notes: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('restaurant_user');
    if (stored) setUser(JSON.parse(stored));
    
    // Load orders from localStorage
    const storedOrders = localStorage.getItem('restaurant_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('restaurant_user');
    router.push('/');
  };

  const handleNewOrder = () => {
    setShowNewOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowNewOrderModal(false);
    setNewOrder({
      customerName: '',
      customerPhone: '',
      deliveryAddress: '',
      totalAmount: '',
      paymentMethod: 'Nakit',
      notes: ''
    });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order = {
      id: 'ORD-' + Date.now(),
      ...newOrder,
      totalAmount: parseFloat(newOrder.totalAmount) || 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      distance: '1.2 km',
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      courier: 'Atanmadı'
    };
    
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('restaurant_orders', JSON.stringify(updatedOrders));
    
    handleCloseModal();
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'onway') return order.status === 'onway';
    return true;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const onwayCount = orders.filter(o => o.status === 'onway').length;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', position: 'relative' }}>
      {/* Fixed Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 65,
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        zIndex: 101,
        boxShadow: '0 2px 8px rgba(0,0,0,.04)'
      }}>
        <div style={{
          width: '100%',
          padding: '0 25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Left Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button 
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              style={{
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                color: '#5c3cbb',
                padding: 10,
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all .3s cubic-bezier(.4,0,.2,1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ede9fe';
                e.currentTarget.style.borderColor = '#5c3cbb';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(92,60,187,.15)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Icons.menu />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: -0.5,
                color: '#5c3cbb'
              }}>
                Paketçiniz
              </span>
              <span style={{ color: '#9ca3af', fontWeight: 400 }}>Bodrum</span>
            </div>
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* User Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: 20,
              color: '#5c3cbb'
            }}>
              <Icons.mapPin />
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#5c3cbb',
                whiteSpace: 'nowrap'
              }}>
                {user?.name || 'ASMA DÖNER'}
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 500,
                color: '#6b7280'
              }}>
                {user?.dealerName || 'Paketçiniz Bodrum'}
              </span>
              <Icons.chevronDown />
            </div>

            {/* Divider */}
            <div style={{
              width: 1,
              height: 40,
              background: 'linear-gradient(180deg,transparent 0,#e5e7eb 10%,#d1d5db 50%,#e5e7eb 90%,transparent)'
            }} />

            {/* Calls Toggle */}
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              color: '#6b7280',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              transition: 'all .3s cubic-bezier(.4,0,.2,1)'
            }}>
              <Icons.phone />
              <span>Aramalar</span>
              <div style={{
                position: 'relative',
                width: 44,
                height: 24,
                background: '#cbd5e1',
                borderRadius: 24,
                transition: 'all .3s cubic-bezier(.4,0,.2,1)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 3,
                  left: 3,
                  width: 18,
                  height: 18,
                  background: 'white',
                  borderRadius: '50%',
                  transition: 'all .3s cubic-bezier(.4,0,.2,1)',
                  boxShadow: '0 2px 4px rgba(0,0,0,.2)'
                }} />
              </div>
            </button>

            {/* New Order Button */}
            <button 
              onClick={handleNewOrder}
              style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              background: '#5c3cbb',
              border: 'none',
              borderRadius: 10,
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              boxShadow: '0 4px 12px rgba(92,60,187,.2)',
              transition: 'all .3s cubic-bezier(.4,0,.2,1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4a2d99';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(92,60,187,.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#5c3cbb';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(92,60,187,.2)';
            }}>
              <Icons.plus />
              <span>Yeni Sipariş</span>
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 10,
                color: '#ef4444',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                transition: 'all .3s cubic-bezier(.4,0,.2,1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fee2e2';
                e.currentTarget.style.borderColor = '#fca5a5';
                e.currentTarget.style.color = '#dc2626';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fef2f2';
                e.currentTarget.style.borderColor = '#fecaca';
                e.currentTarget.style.color = '#ef4444';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Icons.logout />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 65,
        height: 'calc(100vh - 65px)',
        width: sidebarExpanded ? 280 : 70,
        background: '#5c3cbb',
        zIndex: 1999,
        boxShadow: '4px 0 20px rgba(0,0,0,.1)',
        overflow: 'hidden',
        transition: 'width .3s cubic-bezier(.4,0,.2,1)'
      }}>
        <div style={{
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingTop: 20
        }}>
          <nav style={{ width: '100%' }}>
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}>
              {menuItems.map((item, index) => (
                <li 
                  key={item.id}
                  style={{
                    animation: `menuSlideIn .4s cubic-bezier(.4,0,.2,1) ${index * 0.1}s backwards`
                  }}
                >
                  <button style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 20px',
                    background: 'transparent',
                    border: 'none',
                    color: item.active ? '#fbd30c' : 'rgba(255,255,255,.8)',
                    fontSize: 14,
                    cursor: 'pointer',
                    gap: 14,
                    fontWeight: item.active ? 700 : 500,
                    transition: 'all .3s cubic-bezier(.4,0,.2,1)',
                    justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                    paddingLeft: sidebarExpanded ? 20 : 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateX(6px)';
                    const icon = e.currentTarget.querySelector('.menu-icon');
                    if (icon) {
                      (icon as HTMLElement).style.background = item.active ? '#fbd30c' : 'rgba(251,211,12,.25)';
                      (icon as HTMLElement).style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = item.active ? '#fbd30c' : 'rgba(255,255,255,.8)';
                    e.currentTarget.style.transform = 'translateX(0)';
                    const icon = e.currentTarget.querySelector('.menu-icon');
                    if (icon) {
                      (icon as HTMLElement).style.background = item.active ? '#fbd30c' : 'rgba(255,255,255,.1)';
                      (icon as HTMLElement).style.transform = 'scale(1)';
                    }
                  }}
                  >
                    <div 
                      className="menu-icon"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: item.active ? '#fbd30c' : 'rgba(255,255,255,.1)',
                        color: item.active ? '#5c3cbb' : 'currentColor',
                        flexShrink: 0,
                        transition: 'all .3s cubic-bezier(.4,0,.2,1)',
                        boxShadow: item.active ? '0 4px 12px rgba(251,211,12,.4)' : 'none'
                      }}
                    >
                      <item.icon />
                    </div>
                    {sidebarExpanded && (
                      <span style={{
                        flex: 1,
                        textAlign: 'left',
                        fontWeight: 'inherit',
                        whiteSpace: 'nowrap',
                        letterSpacing: 0.3
                      }}>
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: sidebarExpanded ? 280 : 70,
        marginTop: 65,
        padding: '25px 35px',
        maxWidth: `calc(100vw - ${sidebarExpanded ? 280 : 70}px)`,
        minHeight: 'calc(100vh - 65px)',
        transition: 'all .3s cubic-bezier(.4,0,.2,1)'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: '100%' }}
        >
          {/* Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24
          }}>
            <button
              onClick={() => setActiveTab('pending')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: activeTab === 'pending' ? '#5c3cbb' : 'white',
                border: activeTab === 'pending' ? '1px solid #5c3cbb' : '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: activeTab === 'pending' ? 'white' : '#6b7280',
                cursor: 'pointer',
                transition: 'all .2s'
              }}
            >
              <span>Bekleyen Siparişler</span>
              <span style={{
                background: activeTab === 'pending' ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.1)',
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                color: activeTab === 'pending' ? 'white' : '#374151'
              }}>
                {pendingCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('onway')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: activeTab === 'onway' ? '#5c3cbb' : 'white',
                border: activeTab === 'onway' ? '1px solid #5c3cbb' : '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: activeTab === 'onway' ? 'white' : '#6b7280',
                cursor: 'pointer',
                transition: 'all .2s'
              }}
            >
              <span>Yoldaki Siparişler</span>
              <span style={{
                background: activeTab === 'onway' ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.1)',
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                color: activeTab === 'onway' ? 'white' : '#374151'
              }}>
                {onwayCount}
              </span>
            </button>

            <div style={{ flex: 1 }} />

            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{
                position: 'relative',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all .2s'
              }}>
                <Icons.search />
              </button>
              <button style={{
                position: 'relative',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all .2s'
              }}>
                <Icons.list />
              </button>
              <button style={{
                position: 'relative',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all .2s'
              }}>
                <Icons.settings />
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div style={{
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,.1)',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead style={{
                  background: '#f9fafb',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  <tr>
                    {['Sipariş', 'Müşteri', 'Adres', 'Mesafe', 'Saat', 'Durum', 'Ödeme', 'Kurye'].map((header) => (
                      <th 
                        key={header}
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td 
                        colSpan={8} 
                        style={{
                          padding: '60px 20px',
                          textAlign: 'center',
                          color: '#9ca3af',
                          fontSize: 14
                        }}
                      >
                        Bu kategoride sipariş bulunmamaktadır
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '16px', fontSize: 14, fontWeight: 600, color: '#111827' }}>
                          {order.id}
                        </td>
                        <td style={{ padding: '16px', fontSize: 14, color: '#374151' }}>
                          <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>{order.customerPhone}</div>
                        </td>
                        <td style={{ padding: '16px', fontSize: 14, color: '#374151', maxWidth: 200 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {order.deliveryAddress}
                          </div>
                        </td>
                        <td style={{ padding: '16px', fontSize: 14, color: '#374151' }}>
                          {order.distance}
                        </td>
                        <td style={{ padding: '16px', fontSize: 14, color: '#374151' }}>
                          {order.time}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            background: order.status === 'pending' ? '#fef3c7' : '#dbeafe',
                            color: order.status === 'pending' ? '#92400e' : '#1e40af'
                          }}>
                            {order.status === 'pending' ? 'Bekliyor' : 'Yolda'}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: 14, fontWeight: 600, color: '#111827' }}>
                          {order.totalAmount.toFixed(2)} TL
                        </td>
                        <td style={{ padding: '16px', fontSize: 14, color: '#374151' }}>
                          {order.courier}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>

      <style jsx global>{`
        @keyframes menuSlideIn {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
          }}
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              background: 'white',
              borderRadius: 16,
              width: '100%',
              maxWidth: 500,
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmitOrder}>
              {/* Modal Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h2 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#111827',
                  margin: 0
                }}>
                  Yeni Sipariş
                </h2>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 8,
                    borderRadius: 8,
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icons.x />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 6
                  }}>
                    Müşteri Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      outline: 'none',
                      transition: 'all .2s'
                    }}
                    placeholder="Müşteri adını girin"
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 6
                  }}>
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({...newOrder, customerPhone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      outline: 'none',
                      transition: 'all .2s'
                    }}
                    placeholder="05XX XXX XX XX"
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 6
                  }}>
                    Teslimat Adresi *
                  </label>
                  <textarea
                    required
                    value={newOrder.deliveryAddress}
                    onChange={(e) => setNewOrder({...newOrder, deliveryAddress: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      outline: 'none',
                      transition: 'all .2s',
                      minHeight: 80,
                      resize: 'vertical'
                    }}
                    placeholder="Teslimat adresini girin"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: 6
                    }}>
                      Tutar (TL) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newOrder.totalAmount}
                      onChange={(e) => setNewOrder({...newOrder, totalAmount: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #d1d5db',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none'
                      }}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: 6
                    }}>
                      Ödeme Şekli
                    </label>
                    <select
                      value={newOrder.paymentMethod}
                      onChange={(e) => setNewOrder({...newOrder, paymentMethod: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #d1d5db',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="Nakit">Nakit</option>
                      <option value="Kredi Kartı">Kredi Kartı</option>
                      <option value="Online">Online Ödeme</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 6
                  }}>
                    Notlar
                  </label>
                  <textarea
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      outline: 'none',
                      minHeight: 60,
                      resize: 'vertical'
                    }}
                    placeholder="Sipariş notları (isteğe bağlı)"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12
              }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '10px 20px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all .2s'
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    background: '#5c3cbb',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all .2s',
                    boxShadow: '0 4px 12px rgba(92,60,187,.3)'
                  }}
                >
                  Siparişi Kaydet
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
