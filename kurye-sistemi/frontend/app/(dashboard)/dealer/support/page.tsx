'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Send, X, Headphones, Clock, AlertCircle,
  CheckCircle, User, Bike, Package, RefreshCw, Bell,
  ChevronLeft, Filter, Search, Phone, MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  orderNumber?: string;
  orderId?: string;
  courierName: string;
  courierId: string;
  createdAt: string;
  lastMessageAt: string;
  messageCount: number;
  isUnreadByDealer: boolean;
  messages: SupportMessage[];
}

interface SupportMessage {
  id: string;
  content: string;
  senderType: 'courier' | 'dealer' | 'system';
  senderName: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
  attachments?: string[];
}

// Mock data
const mockTickets: SupportTicket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-ABC123',
    subject: 'Sipariş teslimat sorunu - Müşteri kapıyı açmıyor',
    description: 'Siparişi teslim edemedim, müşteri kapıyı açmadı. 3 kez aradım.',
    status: 'in_progress',
    priority: 'high',
    category: 'order_issue',
    orderNumber: 'ORD-2024-001',
    orderId: 'order-1',
    courierName: 'Ahmet Yılmaz',
    courierId: 'courier-1',
    createdAt: '2024-03-21 14:30',
    lastMessageAt: '2024-03-21 15:45',
    messageCount: 3,
    isUnreadByDealer: true,
    messages: [
      {
        id: '1',
        content: 'Siparişi teslim edemedim, müşteri kapıyı açmadı. 3 kez aradım. Ne yapmalıyım?',
        senderType: 'courier',
        senderName: 'Ahmet Yılmaz',
        senderId: 'courier-1',
        createdAt: '2024-03-21 14:30',
        isRead: true,
      },
      {
        id: '2',
        content: 'Anlaşıldı Ahmet Bey, müşteri ile iletişime geçiyorum. Lütfen bekleyin, 5 dakika içinde dönüş yapacağım.',
        senderType: 'dealer',
        senderName: 'Aydınlar Dağıtım',
        senderId: 'dealer-1',
        createdAt: '2024-03-21 15:20',
        isRead: true,
      },
      {
        id: '3',
        content: 'Müşteri ulaşıldı, kapıyı açacakmış. Teslimata devam edebilirsiniz. Teşekkürler.',
        senderType: 'dealer',
        senderName: 'Aydınlar Dağıtım',
        senderId: 'dealer-1',
        createdAt: '2024-03-21 15:45',
        isRead: false,
      },
    ],
  },
  {
    id: '2',
    ticketNumber: 'TKT-DEF456',
    subject: 'Uygulama çöktü - Sipariş kayboldu',
    description: 'Siparişi aldıktan sonra uygulama kapandı ve sipariş gözükmüyor',
    status: 'open',
    priority: 'critical',
    category: 'technical',
    orderNumber: 'ORD-2024-002',
    courierName: 'Mehmet Demir',
    courierId: 'courier-2',
    createdAt: '2024-03-21 16:15',
    lastMessageAt: '2024-03-21 16:15',
    messageCount: 1,
    isUnreadByDealer: true,
    messages: [
      {
        id: '1',
        content: 'Siparişi aldıktan sonra uygulama kapandı ve şimdi sipariş gözükmüyor. Ne yapmalıyım? Acil!',
        senderType: 'courier',
        senderName: 'Mehmet Demir',
        senderId: 'courier-2',
        createdAt: '2024-03-21 16:15',
        isRead: false,
      },
    ],
  },
  {
    id: '3',
    ticketNumber: 'TKT-GHI789',
    subject: 'Ödeme henüz yansımadı',
    description: 'Dünkü teslimatların ödemesi hesabıma geçmemiş',
    status: 'waiting_customer',
    priority: 'medium',
    category: 'payment',
    courierName: 'Ali Kaya',
    courierId: 'courier-3',
    createdAt: '2024-03-20 09:00',
    lastMessageAt: '2024-03-20 14:30',
    messageCount: 4,
    isUnreadByDealer: false,
    messages: [
      {
        id: '1',
        content: 'Dün 8 teslimat yaptım ama ödeme henüz hesabıma geçmemiş. Kontrol edebilir misiniz?',
        senderType: 'courier',
        senderName: 'Ali Kaya',
        senderId: 'courier-3',
        createdAt: '2024-03-20 09:00',
        isRead: true,
      },
      {
        id: '2',
        content: 'Merhaba Ali Bey, kontrol ediyorum.',
        senderType: 'dealer',
        senderName: 'Aydınlar Dağıtım',
        senderId: 'dealer-1',
        createdAt: '2024-03-20 10:15',
        isRead: true,
      },
    ],
  },
];

const statusOptions = [
  { value: 'all', label: 'Tümü' },
  { value: 'open', label: 'Açık' },
  { value: 'in_progress', label: 'İşlemde' },
  { value: 'waiting_customer', label: 'Kurye Yanıtı Bekliyor' },
  { value: 'resolved', label: 'Çözüldü' },
  { value: 'closed', label: 'Kapalı' },
];

const priorityOptions = [
  { value: 'all', label: 'Tüm Öncelikler' },
  { value: 'critical', label: 'Kritik' },
  { value: 'high', label: 'Yüksek' },
  { value: 'medium', label: 'Orta' },
  { value: 'low', label: 'Düşük' },
];

export default function DealerSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedTicket) {
      scrollToBottom();
    }
  }, [selectedTicket?.messages]);

  // Filtreleme
  const filteredTickets = tickets.filter((ticket) => {
    const matchStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.courierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  // Okunmamış sayısı
  const unreadCount = tickets.filter(t => t.isUnreadByDealer).length;

  // Durum sayıları
  const statusCounts = {
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    waiting: tickets.filter(t => t.status === 'waiting_customer').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const message: SupportMessage = {
      id: Date.now().toString(),
      content: newMessage,
      senderType: 'dealer',
      senderName: 'Aydınlar Dağıtım',
      senderId: 'dealer-1',
      createdAt: new Date().toISOString(),
      isRead: true,
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, message],
      lastMessageAt: new Date().toISOString(),
      messageCount: selectedTicket.messageCount + 1,
      isUnreadByDealer: false,
      status: selectedTicket.status === 'open' ? 'in_progress' : selectedTicket.status,
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    setNewMessage('');
  };

  const handleStatusChange = (newStatus: string) => {
    if (!selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      status: newStatus as any,
    };

    if (newStatus === 'resolved') {
      // Çözüldü mesajı ekle
      const systemMessage: SupportMessage = {
        id: Date.now().toString(),
        content: `Talep çözüldü olarak işaretlendi.`,
        senderType: 'system',
        senderName: 'Sistem',
        senderId: 'system',
        createdAt: new Date().toISOString(),
        isRead: true,
      };
      updatedTicket.messages = [...updatedTicket.messages, systemMessage];
    }

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // API çağrısı simülasyonu
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleTicketSelect = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketDetail(true);
    
    // Okundu olarak işaretle
    if (ticket.isUnreadByDealer) {
      const updated = tickets.map(t => 
        t.id === ticket.id ? { ...t, isUnreadByDealer: false } : t
      );
      setTickets(updated);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: 'bg-blue-100 text-blue-700 border-blue-200',
      in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
      waiting_customer: 'bg-purple-100 text-purple-700 border-purple-200',
      resolved: 'bg-green-100 text-green-700 border-green-200',
      closed: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    const labels: Record<string, string> = {
      open: 'Açık',
      in_progress: 'İşlemde',
      waiting_customer: 'Yanıt Bekleniyor',
      resolved: 'Çözüldü',
      closed: 'Kapalı',
    };
    return <Badge variant="outline" className={styles[status]}>{labels[status]}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      critical: 'bg-red-100 text-red-600 animate-pulse',
    };
    const labels: Record<string, string> = {
      low: 'DÜŞÜK',
      medium: 'ORTA',
      high: 'YÜKSEK',
      critical: 'KRİTİK',
    };
    return <Badge className={styles[priority]}>{labels[priority]}</Badge>;
  };

  return (
    <motion.div 
      className="container mx-auto p-4 md:p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Kurye Destek</h1>
            <p className="text-gray-500">Gelen talepler ve mesajlar</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
          
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white px-3 py-1">
              <Bell className="w-4 h-4 mr-1" />
              {unreadCount} Yeni Mesaj
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Açık Talepler</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.open}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">İşlemde</p>
                <p className="text-2xl font-bold text-amber-600">{statusCounts.in_progress}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Yanıt Bekleniyor</p>
                <p className="text-2xl font-bold text-purple-600">{statusCounts.waiting}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Çözülen</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.resolved}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-300px)]">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Destek Talepleri</CardTitle>
                  <span className="text-sm text-gray-500">{filteredTickets.length} talep</span>
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Ara (kurye, sipariş no, konu...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="w-4 h-4 mr-2" />
                      Durum
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[140px]">
                      Öncelik
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100%-140px)]">
                <div className="divide-y">
                  {filteredTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => handleTicketSelect(ticket)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-all ${
                        selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                      } ${ticket.isUnreadByDealer ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-500">{ticket.ticketNumber}</span>
                          {getPriorityBadge(ticket.priority)}
                          {ticket.isUnreadByDealer && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(ticket.lastMessageAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>

                      <h4 className={`font-medium mb-2 line-clamp-1 ${ticket.isUnreadByDealer ? 'text-blue-900' : ''}`}>
                        {ticket.subject}
                      </h4>

                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs bg-gray-200">
                              {ticket.courierName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{ticket.courierName}</span>
                        </div>

                        {ticket.orderNumber && (
                          <div className="flex items-center gap-1 text-sm text-blue-600">
                            <Package className="w-4 h-4" />
                            {ticket.orderNumber}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {getStatusBadge(ticket.status)}
                        
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {ticket.messageCount}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Detail / Chat */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <Card className="h-[calc(100vh-300px)] flex flex-col">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between mb-3">
                  <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSelectedTicket(null)}>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Geri
                  </Button>
                  <span className="font-mono text-sm text-gray-500">{selectedTicket.ticketNumber}</span>
                </div>

                <h3 className="font-semibold mb-2">{selectedTicket.subject}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {selectedTicket.courierName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{selectedTicket.courierName}</p>
                    <p className="text-xs text-gray-500">Kurye</p>
                  </div>
                </div>

                {selectedTicket.orderNumber && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg mb-3">
                    <Package className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">İlgili Sipariş</p>
                      <p className="font-mono text-sm font-medium">{selectedTicket.orderNumber}</p>
                    </div>
                  </div>
                )}

                <Select value={selectedTicket.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    Durum: {statusOptions.find(s => s.value === selectedTicket.status)?.label}
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.filter(s => s.value !== 'all').map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>

              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-[calc(100%-80px)] p-4">
                  <div className="space-y-4">
                    {selectedTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderType === 'dealer' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[90%] p-3 rounded-2xl text-sm ${
                            message.senderType === 'dealer'
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : message.senderType === 'courier'
                              ? 'bg-gray-100 text-gray-900 rounded-bl-none'
                              : 'bg-amber-100 text-amber-900 text-center'
                          }`}
                        >
                          {message.senderType !== 'system' && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium opacity-75">
                                {message.senderName}
                              </span>
                              <span className="text-xs opacity-50">
                                {new Date(message.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          )}
                          
                          <p>{message.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Mesajınızı yazın..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[60px] resize-none text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-300px)] flex items-center justify-center">
              <CardContent className="text-center text-gray-400">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Bir destek talebi seçin</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
