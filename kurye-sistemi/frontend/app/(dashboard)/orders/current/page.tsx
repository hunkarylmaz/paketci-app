'use client';

import { useState } from 'react';
import { Package, Clock, CheckCircle, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mockOrders = [
  { id: 'ORD-001', customer: 'Ali Veli', status: 'pending', address: 'Atatürk Cad. No:15', time: '10:30' },
  { id: 'ORD-002', customer: 'Ayşe Yılmaz', status: 'delivering', address: 'Cumhuriyet Mah. 23', time: '10:45' },
  { id: 'ORD-003', customer: 'Mehmet Kaya', status: 'delivered', address: 'İstiklal Sok. 8', time: '09:15' },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('current');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Siparişler</h1>
        <Button>Yeni Sipariş</Button>
      </div>

      <div className="flex gap-2">
        <Button variant={activeTab === 'current' ? 'default' : 'outline'} onClick={() => setActiveTab('current')}>
          Aktif
        </Button>
        <Button variant={activeTab === 'completed' ? 'default' : 'outline'} onClick={() => setActiveTab('completed')}>
          Tamamlanan
        </Button>
      </div>

      <div className="grid gap-4">
        {mockOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="font-semibold">{order.id}</span>
                    <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'delivering' ? 'secondary' : 'outline'}>
                      {order.status === 'delivered' ? 'Teslim Edildi' : order.status === 'delivering' ? 'Yolda' : 'Bekliyor'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{order.customer}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {order.address}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  {order.time}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
