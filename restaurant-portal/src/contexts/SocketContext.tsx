import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  courierLocations: Map<string, CourierLocation>;
  joinOrderTracking: (orderId: string, courierId: string) => void;
  leaveOrderTracking: (orderId: string, courierId: string) => void;
}

interface CourierLocation {
  courierId: string;
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'wss://api.paketci.app';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [courierLocations, setCourierLocations] = useState<Map<string, CourierLocation>>(new Map());

  useEffect(() => {
    if (!token || !user) return;

    const socket = io(SOCKET_URL, {
      path: '/ws',
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);

      // Restoran odasına katıl
      if (user.restaurantId) {
        socket.emit('join', { room: `restaurant:${user.restaurantId}` });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Yeni sipariş bildirimi
    socket.on('new_order', (data) => {
      toast.success(
        <div>
          <strong>Yeni Sipariş!</strong>
          <div>#{data.orderId} - ₺{data.total}</div>
        </div>,
        { duration: 8000 }
      );
      // Play sound
      playNotificationSound('new_order');
    });

    // Sipariş iptali
    socket.on('order_cancelled', (data) => {
      toast.error(
        <div>
          <strong>Sipariş İptal Edildi</strong>
          <div>#{data.orderId} - {data.reason}</div>
        </div>,
        { duration: 6000 }
      );
      playNotificationSound('cancel');
    });

    // Kurye ataması
    socket.on('order_assigned', (data) => {
      toast.success(
        <div>
          <strong>Kurye Atandı</strong>
          <div>Sipariş #{data.orderId} - {data.courierName}</div>
        </div>
      );
    });

    // Kurye konum güncellemesi
    socket.on('courier:location', (data: CourierLocation) => {
      setCourierLocations(prev => {
        const next = new Map(prev);
        next.set(data.courierId, data);
        return next;
      });
    });

    // Kurye yaklaşıyor bildirimi
    socket.on('courier:nearby', (data) => {
      toast(
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏍️</span>
          <div>
            <strong>Kurye Yaklaşıyor</strong>
            <div>{data.distance} metre uzaklıkta</div>
          </div>
        </div>,
        { icon: ' ' }
      );
    });

    // Gelen arama (Caller ID)
    socket.on('incoming_call', (data) => {
      toast(
        <div className="flex items-center gap-2">
          <span className="text-2xl">📞</span>
          <div>
            <strong>Gelen Arama</strong>
            <div>{data.phoneNumber}</div>
          </div>
        </div>,
        { duration: 10000, icon: ' ' }
      );
      playNotificationSound('incoming_call');
    });

    // Müşteri popup (Caller ID)
    socket.on('customer:popup', (data) => {
      // Modal aç veya özel gösterim
      console.log('Customer popup:', data);
    });

    // Acil durum
    socket.on('emergency:alert', (data) => {
      toast.error(
        <div className="bg-red-100 p-2 rounded">
          <strong className="text-red-600">🚨 ACİL DURUM</strong>
          <div className="text-red-700">Kurye: {data.courierId}</div>
          <div className="text-red-700">{data.message}</div>
        </div>,
        { duration: 30000 }
      );
      playNotificationSound('emergency');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, user]);

  const joinOrderTracking = (orderId: string, courierId: string) => {
    socketRef.current?.emit('tracking:start', { orderId, courierId });
  };

  const leaveOrderTracking = (orderId: string, courierId: string) => {
    socketRef.current?.emit('tracking:stop', { orderId, courierId });
  };

  const playNotificationSound = (type: string) => {
    const sounds: Record<string, string> = {
      new_order: '/sounds/new_order.mp3',
      cancel: '/sounds/cancel.mp3',
      incoming_call: '/sounds/phone_ring.mp3',
      emergency: '/sounds/emergency.mp3',
    };

    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Autoplay blocked, ignore
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        courierLocations,
        joinOrderTracking,
        leaveOrderTracking,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
