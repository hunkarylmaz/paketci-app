'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Send, X, Plus, Headphones, Clock, AlertCircle,
  CheckCircle, ChevronDown, ChevronUp, Paperclip, Phone, Package,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  orderNumber?: string;
  createdAt: string;
  lastMessageAt: string;
  messageCount: number;
  isUnread: boolean;
  messages: SupportMessage[];
}

interface SupportMessage {
  id: string;
  content: string;
  senderType: 'courier' | 'dealer' | 'system';
  senderName: string;
  createdAt: string;
  isRead: boolean;
}

// Mock data
const mockTickets: SupportTicket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-ABC123',
    subject: 'Sipariş teslimat sorunu',
    status: 'in_progress',
    priority: 'high',
    category: 'order_issue',
    orderNumber: 'ORD-2024-001',
    createdAt: '2024-03-21 14:30',
    lastMessageAt: '2024-03-21 15:45',
    messageCount: 3,
    isUnread: true,
    messages: [
      {
        id: '1',
        content: 'Siparişi teslim edemedim, müşteri kapıyı açmadı. 3 kez aradım.',
        senderType: 'courier',
        senderName: 'Ahmet Y.',
        createdAt: '2024-03-21 14:30',
        isRead: true,
      },
      {
        id: '2',
        content: 'Anlaşıldı, müşteri ile iletişime geçiyorum. Lütfen bekleyin.',
        senderType: 'dealer',
        senderName: 'Aydınlar Dağıtım',
        createdAt: '2024-03-21 15:20',
        isRead: true,
      },
      {
        id: '3',
        content: 'Müşteri ulaşıldı, kapıyı açacakmış. Teslimata devam edebilirsiniz.',
        senderType: 'dealer',
        senderName: 'Aydınlar Dağıtım',
        createdAt: '2024-03-21 15:45',
        isRead: false,
      },
    ],
  },
];

const categories = [
  { value: 'order_issue', label: 'Sipariş Sorunu' },
  { value: 'technical', label: 'Teknik Sorun' },
  { value: 'payment', label: 'Ödeme Sorunu' },
  { value: 'account', label: 'Hesap Sorunu' },
  { value: 'complaint', label: 'Şikayet' },
  { value: 'other', label: 'Diğer' },
];

const priorities = [
  { value: 'low', label: 'Düşük' },
  { value: 'medium', label: 'Orta' },
  { value: 'high', label: 'Yüksek' },
  { value: 'critical', label: 'Kritik' },
];

export default function CourierSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  
  // New ticket form
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('other');
  const [newTicketPriority, setNewTicketPriority] = useState('medium');
  const [newTicketOrderNumber, setNewTicketOrderNumber] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const message: SupportMessage = {
      id: Date.now().toString(),
      content: newMessage,
      senderType: 'courier',
      senderName: 'Ahmet Y.',
      createdAt: new Date().toISOString(),
      isRead: true,
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, message],
      lastMessageAt: new Date().toISOString(),
      messageCount: selectedTicket.messageCount + 1,
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    setNewMessage('');
  };

  const handleCreateTicket = () => {
    if (!newTicketSubject.trim() || !newTicketDescription.trim()) return;

    const ticket: SupportTicket = {
      id: Date.now().toString(),
      ticketNumber: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      subject: newTicketSubject,
      status: 'open',
      priority: newTicketPriority as any,
      category: newTicketCategory,
      orderNumber: newTicketOrderNumber || undefined,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      messageCount: 1,
      isUnread: false,
      messages: [
        {
          id: '1',
          content: newTicketDescription,
          senderType: 'courier',
          senderName: 'Ahmet Y.',
          createdAt: new Date().toISOString(),
          isRead: true,
        },
      ],
    };

    setTickets([ticket, ...tickets]);
    setShowNewTicket(false);
    setNewTicketSubject('');
    setNewTicketDescription('');
    setNewTicketOrderNumber('');
    setSelectedTicket(ticket);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-amber-100 text-amber-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700',
    };
    const labels: Record<string, string> = {
      open: 'Açık',
      in_progress: 'İşlemde',
      resolved: 'Çözüldü',
      closed: 'Kapalı',
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      critical: 'bg-red-100 text-red-600',
    };
    return <Badge variant="outline" className={styles[priority]}>{priority.toUpperCase()}</Badge>;
  };

  return (
    <>
      {/* Floating Support Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 z-50"
      >
        <div className="relative">
          <Headphones className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </Button>

      {/* Support Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <div className="flex h-full">
            {/* Tickets List */}
            <div className="w-80 border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <DialogTitle className="flex items-center gap-2">
                    <Headphones className="w-5 h-5" />
                    Destek
                  </DialogTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowNewTicket(true)}
                    className="bg-blue-500"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {showNewTicket ? (
                  <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                    <Input
                      placeholder="Konu..."
                      value={newTicketSubject}
                      onChange={(e) => setNewTicketSubject(e.target.value)}
                      className="text-sm"
                    />
                    <Textarea
                      placeholder="Sorununuzu açıklayın..."
                      value={newTicketDescription}
                      onChange={(e) => setNewTicketDescription(e.target.value)}
                      className="text-sm min-h-[60px]"
                    />
                    <Select value={newTicketCategory} onValueChange={setNewTicketCategory}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder="Sipariş No (opsiyonel)"
                      value={newTicketOrderNumber}
                      onChange={(e) => setNewTicketOrderNumber(e.target.value)}
                      className="text-sm"
                    />
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={handleCreateTicket}>
                        Gönder
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowNewTicket(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
              
              <ScrollArea className="flex-1">
                <div className="divide-y">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => {
                        setSelectedTicket(ticket);
                        if (ticket.isUnread) {
                          setUnreadCount(Math.max(0, unreadCount - 1));
                        }
                      }}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      } ${ticket.isUnread ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-mono text-gray-500">{ticket.ticketNumber}</span>
                        {ticket.isUnread && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                      
                      <p className="font-medium text-sm mb-1 line-clamp-1">{ticket.subject}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                      
                      {ticket.orderNumber && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 mb-1">
                          <Package className="w-3 h-3" />
                          {ticket.orderNumber}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /
                          {ticket.messageCount}
                        </span>
                        <span>{new Date(ticket.lastMessageAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedTicket ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{selectedTicket.subject}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(selectedTicket.status)}
                          {getPriorityBadge(selectedTicket.priority)}
                          <span className="text-xs text-gray-500">
                            {selectedTicket.ticketNumber}
                          </span>
                        </div>
                        
                        {selectedTicket.orderNumber && (
                          <div className="flex items-center gap-2 mt-2 text-sm">
                            <Package className="w-4 h-4 text-blue-500" />
                            <span>Sipariş: {selectedTicket.orderNumber}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedTicket.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderType === 'courier' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl ${
                              message.senderType === 'courier'
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : message.senderType === 'dealer'
                                ? 'bg-gray-100 text-gray-900 rounded-bl-none'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium opacity-75">
                                {message.senderName}
                              </span>
                              <span className="text-xs opacity-50">
                                {new Date(message.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Mesajınızı yazın..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[60px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="icon">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        
                        <Button onClick={handleSendMessage} className="bg-blue-500">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Bir destek talebi seçin veya yeni oluşturun</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
