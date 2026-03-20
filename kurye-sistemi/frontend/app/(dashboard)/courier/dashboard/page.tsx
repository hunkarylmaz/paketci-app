'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bike, MapPin, Phone, DollarSign, Star, Clock, CheckCircle,
  X, Navigation, User, History, Wallet, Settings, LogOut,
  ChevronRight, Package, TrendingUp, Timer, Home, Briefcase,
  AlertCircle, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

// Mock data
const weeklyEarnings = [
  { day: 'Pzt', earnings: 320 },
  { day: 'Sal', earnings: 450 },
  { day: 'Çar', earnings: 380 },
  { day: 'Per', earnings: 520 },
  { day: 'Cum', earnings: 480 },
  { day: 'Cmt', earnings: 650 },
  { day: 'Paz', earnings: 290 },
];

const availableOrders = [
  {
    id: 1,
    restaurant: 'Burger King - Taksim',
    items: '2x Whopper Menü',
    address: 'Cihangir Mah. No:15',
    distance: '1.2 km',
    estimatedTime: '15 dk',
    earnings: 45,
  },
  {
    id: 2,
    restaurant: 'McDonald\'s - Şişli',
    items: '1x Big Mac Menü, 2x Nugget',
    address: 'Şişli Merkez Mah. No:42',
    distance: '2.1 km',
    estimatedTime: '22 dk',
    earnings: 52,
  },
  {
    id: 3,
    restaurant: 'KFC - Harbiye',
    items: '3x Tavuk Burger, 1x Kova',
    address: 'Harbiye Cad. No:8',
    distance: '1.8 km',
    estimatedTime: '18 dk',
    earnings: 48,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function CourierDashboardPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [hasActiveDelivery, setHasActiveDelivery] = useState(false);
  const [shiftStarted, setShiftStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const totalEarnings = weeklyEarnings.reduce((acc, curr) => acc + curr.earnings, 0);
  const todayEarnings = 450;
  const completedDeliveries = 12;
  const rating = 4.9;
  const activeHours = 6.5;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-white/30">
              <AvatarFallback className="bg-white/20 text-white">AY</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-lg">Ahmet Yılmaz</h1>
              <div className="flex items-center gap-1 text-sm text-white/80">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{rating}</span>
                <span className="mx-1">•</span>
                <span>856 teslimat</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}</span>
            <Switch 
              checked={isOnline} 
              onCheckedChange={setIsOnline}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="container mx-auto p-4 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Offline State */}
        {!isOnline && (
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bike className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Şu Anda Çevrimdışısın</h2>
                <p className="text-gray-500 mb-6">Sipariş almak için çevrimiçi olmalısın</p>
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-600">Bugünkü Potansiyel Kazanç</p>
                  <p className="text-2xl font-bold text-blue-700">₺450 - ₺650</p>
                  <p className="text-xs text-blue-500">8-12 sipariş tahmini</p>
                </div>
                <Button 
                  size="lg" 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => setIsOnline(true)}
                >
                  <Bike className="w-5 h-5 mr-2" />
                  Çevrimiçi Ol
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Online State */}
        <AnimatePresence>
          {isOnline && (
            <>
              {/* Active Delivery Card */}
              {hasActiveDelivery ? (
                <motion.div variants={itemVariants}>
                  <Card className="border-2 border-green-500 bg-green-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-green-500 animate-pulse">AKTİF GÖREV</Badge>
                        <span className="text-sm text-gray-500">#ORD-2024-001</span>
                      </div>
                      <h3 className="font-bold text-lg mb-1">Burger King - Taksim</h3>
                      <p className="text-sm text-gray-600 mb-4">2x Whopper Menü, 1x Cola</p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Teslimat Adresi</p>
                            <p className="text-sm text-gray-600">Cihangir Mah. Sıraselviler Cad. No:15</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">Müşteri</p>
                            <p className="text-sm text-gray-600">Mehmet K. • 0555 123 4567</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button className="bg-blue-500 hover:bg-blue-600">
                          <Navigation className="w-4 h-4 mr-2" />
                          Navigasyon
                        </Button>
                        <Button 
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => setHasActiveDelivery(false)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Teslim Et
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                /* Available Orders */
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-500" />
                        Mevcut Siparişler
                        <Badge className="ml-auto">{availableOrders.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {availableOrders.map((order) => (
                        <div key={order.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{order.restaurant}</p>
                              <p className="text-xs text-gray-500">{order.items}</p>
                            </div>
                            <Badge variant="outline" className="text-green-600">
                              ₺{order.earnings}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Navigation className="w-3 h-3" />
                              {order.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {order.estimatedTime}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-green-500 hover:bg-green-600"
                              onClick={() => setHasActiveDelivery(true)}
                            >
                              Kabul Et
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              Reddet
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-xl font-bold">₺{todayEarnings}</p>
                <p className="text-xs text-gray-500">Bugünkü Kazanç</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <p className="text-xl font-bold">{completedDeliveries}</p>
                <p className="text-xs text-gray-500">Tamamlanan</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <p className="text-xl font-bold">{rating}</p>
                <p className="text-xs text-gray-500">Puanım</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <p className="text-xl font-bold">{activeHours}s</p>
                <p className="text-xs text-gray-500">Aktif Saat</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Weekly Earnings Chart */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Haftalık Kazanç
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyEarnings}>
                    <XAxis dataKey="day" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₺${v}`} />
                    <Tooltip formatter={(value: number) => `₺${value}`} />
                    <Bar dataKey="earnings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-500">Toplam Haftalık</p>
                <p className="text-2xl font-bold text-blue-600">₺{totalEarnings}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shift Management */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    shiftStarted ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Briefcase className={`w-6 h-6 ${shiftStarted ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium">{shiftStarted ? 'Vardiya Devam Ediyor' : 'Vardiya Başlatılmadı'}</p>
                    <p className="text-sm text-gray-500">
                      {shiftStarted ? 'Başlangıç: 09:00' : 'Çalışmaya başlamak için vardiya başlat'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant={shiftStarted ? "outline" : "default"}
                  onClick={() => setShiftStarted(!shiftStarted)}
                >
                  {shiftStarted ? 'Vardiya Bitir' : 'Vardiya Başlat'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:max-w-lg md:mx-auto md:rounded-t-2xl">
        <div className="flex justify-around items-center">
          <button 
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('home')}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Ana Sayfa</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'orders' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs">Siparişler</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'earnings' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('earnings')}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Kazanç</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
