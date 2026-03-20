import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  Clock, 
  TrendingUp, 
  Users, 
  MapPin, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { api } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import StatCard from '../components/StatCard';
import ActiveOrders from '../components/ActiveOrders';
import CourierStatus from '../components/CourierStatus';

interface DashboardStats {
  todayOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  activeCouriers: number;
  totalRevenue: number;
  avgDeliveryTime: number;
}

export default function Dashboard() {
  const { isConnected } = useSocket();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/restaurant/dashboard/stats');
      return response.data;
    },
    refetchInterval: 30000, // 30 saniyede bir güncelle
  });

  const { data: chartData } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: async () => {
      const response = await api.get('/restaurant/dashboard/chart');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Günaydın! 👋</h1>
          <p className="text-gray-500">
            {format(new Date(), 'd MMMM yyyy, EEEE', { locale: tr })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Canlı' : 'Bağlantı Yok'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Bugünkü Siparişler"
          value={stats?.todayOrders || 0}
          icon={Package}
          trend="+12%"
          trendUp={true}
          color="blue"
        />
        
        <StatCard
          title="Bekleyen Siparişler"
          value={stats?.pendingOrders || 0}
          icon={Clock}
          subtitle="Hazırlanmayı bekliyor"
          color="yellow"
        />
        
        <StatCard
          title="Toplam Gelir"
          value={`₺${(stats?.totalRevenue || 0).toLocaleString('tr-TR')}`}
          icon={TrendingUp}
          trend="+8%"
          trendUp={true}
          color="green"
        />
        
        <StatCard
          title="Aktif Kuryeler"
          value={stats?.activeCouriers || 0}
          icon={Users}
          subtitle="Görev başında"
          color="purple"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Aktif Siparişler</h2>
              <a 
                href="/orders" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Tümünü Gör →
              </a>
            </div>
            <div className="p-6">
              <ActiveOrders limit={5} />
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Haftalık Gelir</h2>
            </div>
            <div className="p-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => format(new Date(value), 'dd MMM', { locale: tr })}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => `₺${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`₺${value.toLocaleString('tr-TR')}`, 'Gelir']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1E40AF" 
                    strokeWidth={2}
                    dot={{ fill: '#1E40AF', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Courier Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Kurye Durumu</h2>
            </div>
            <div className="p-6">
              <CourierStatus />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h2>
            </div>
            <div className="p-4 space-y-2">
              <a 
                href="/orders/new"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Yeni Sipariş</div>
                  <div className="text-sm text-gray-500">Manuel sipariş oluştur</div>
                </div>
              </a>

              <a 
                href="/tracking"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Canlı Takip</div>
                  <div className="text-sm text-gray-500">Kuryeleri haritada gör</div>
                </div>
              </a>

              <a 
                href="/reports"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Raporlar</div>
                  <div className="text-sm text-gray-500">Excel olarak indir</div>
                </div>
              </a>
            </div>
          </div>

          {/* Order Status Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Sipariş Özeti</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Teslim Edilen</span>
                </div>
                <span className="font-semibold text-gray-900">{stats?.deliveredOrders || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Bekleyen</span>
                </div>
                <span className="font-semibold text-gray-900">{stats?.pendingOrders || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">İptal</span>
                </div>
                <span className="font-semibold text-gray-900">{stats?.cancelledOrders || 0}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Ort. Teslimat</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats?.avgDeliveryTime || 0} dk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
