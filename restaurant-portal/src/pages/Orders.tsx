import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Phone, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

import { api } from '../services/api';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  courierName?: string;
  createdAt: string;
  estimatedDelivery: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

type OrderStatus = 'NEW' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

const statusLabels: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  NEW: { label: 'Yeni', color: 'text-blue-700', bg: 'bg-blue-100' },
  CONFIRMED: { label: 'Onaylandı', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  PREPARING: { label: 'Hazırlanıyor', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  READY: { label: 'Hazır', color: 'text-orange-700', bg: 'bg-orange-100' },
  ASSIGNED: { label: 'Atandı', color: 'text-purple-700', bg: 'bg-purple-100' },
  PICKED_UP: { label: 'Alındı', color: 'text-cyan-700', bg: 'bg-cyan-100' },
  IN_TRANSIT: { label: 'Yolda', color: 'text-sky-700', bg: 'bg-sky-100' },
  DELIVERED: { label: 'Teslim Edildi', color: 'text-green-700', bg: 'bg-green-100' },
  CANCELLED: { label: 'İptal', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState('today');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders', { searchTerm, statusFilter, dateFilter, page }],
    queryFn: async () => {
      const response = await api.get('/restaurant/orders', {
        params: {
          search: searchTerm,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          date: dateFilter,
          page,
          limit,
        },
      });
      return response.data;
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      await api.post(`/restaurant/orders/${orderId}/cancel`);
    },
    onSuccess: () => {
      toast.success('Sipariş iptal edildi');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'İptal edilemedi');
    },
  });

  const exportToExcel = () => {
    if (!data?.orders) return;

    const exportData = data.orders.map((order: Order) => ({
      'Sipariş No': order.orderNumber,
      'Tarih': format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm'),
      'Müşteri': order.customerName,
      'Telefon': order.customerPhone,
      'Adres': order.customerAddress,
      'Ürünler': order.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      'Toplam': order.total,
      'Ödeme': order.paymentMethod,
      'Durum': statusLabels[order.status].label,
      'Kurye': order.courierName || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Siparişler');
    
    const now = format(new Date(), 'yyyy-MM-dd');
    XLSX.writeFile(wb, `siparisler-${now}.xlsx`);
    
    toast.success('Excel dosyası indirildi');
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Bu siparişi iptal etmek istediğinize emin misiniz?')) {
      cancelOrderMutation.mutate(orderId);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Excel İndir
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sipariş no, müşteri adı veya telefon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tüm Durumlar</option>
              {Object.entries(statusLabels).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Bugün</option>
            <option value="yesterday">Dün</option>
            <option value="week">Son 7 Gün</option>
            <option value="month">Son 30 Gün</option>
          </select>

          <button
            onClick={() => refetch()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Yenile"
          >
            <RotateCcw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sipariş</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Müşteri</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ürünler</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tutar</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Durum</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kurye</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tarih</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {data?.orders?.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">#{order.orderNumber}</div>
                    <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">{order.customerName}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone className="w-3.5 h-3.5" />
                      {order.customerPhone}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[200px]">{order.customerAddress}</span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-sm text-gray-400">+{order.items.length - 2} daha</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-900">₺{order.total.toLocaleString('tr-TR')}</div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusLabels[order.status].bg} ${statusLabels[order.status].color}`}>
                      {statusLabels[order.status].label}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4">
                    {order.courierName ? (
                      <div className="text-sm text-gray-900">{order.courierName}</div>
                    ) : (
                      <span className="text-sm text-gray-400">Atanmadı</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {format(new Date(order.createdAt), 'dd.MM HH:mm')}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/orders/${order.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Detay"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      {['NEW', 'CONFIRMED', 'PREPARING'].includes(order.status) && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="İptal"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Toplam {data.total} sipariş
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-sm text-gray-600">Sayfa {page} / {data.totalPages}</span>
              
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
