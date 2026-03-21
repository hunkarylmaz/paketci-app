'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, Lock, Eye, EyeOff, ShoppingBag, FileText, BarChart3, 
  Calendar, DollarSign, LogOut, Plus, Phone, Search, Filter, FileText as FileIcon, Settings, X, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('restaurant_user', JSON.stringify({
        id: 1,
        name: 'ASMA DÖNER',
        dealerName: 'Paketçiniz Bodrum',
        username: username,
        token: 'mock_token'
      }));
      router.push('/restaurant/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-lg mb-4"
              >
                <ShoppingBag className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">İşletme paneline hoşgeldin</h1>
              <p className="text-gray-500">Hesabınıza giriş yapın</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Kullanıcı Adı</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
                    <User className="w-5 h-5" />
                  </div>
                  <Input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Kullanıcı adınızı giriniz"
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Şifre</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi giriniz"
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30"
                disabled={loading}
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">© 2026 Tüm hakları saklıdır.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
