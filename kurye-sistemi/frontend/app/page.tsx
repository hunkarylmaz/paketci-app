'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, History, TrendingUp, 
  DollarSign, CreditCard, Utensils, Users, LogOut,
  Phone, Lock, Eye, EyeOff, ArrowRight, Package,
  ChevronRight, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setStep('code');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('restaurant_user', JSON.stringify({
        id: 1, name: 'Lezzet Restoran', phone: phone, token: 'mock_token'
      }));
      router.push('/restaurant/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#6B4EE6] rounded-2xl shadow-xl mb-4">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Paketçiniz</h1>
          <p className="text-gray-500">Restoran Partner Paneli</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{step === 'phone' ? 'Giriş Yap' : 'Doğrulama'}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {step === 'phone' ? 'Telefon numaranızı girin' : `${phone} numarasına kod gönderildi`}
              </p>
            </div>

            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input type="tel" placeholder="5XX XXX XX XX" value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="pl-10 h-12 text-lg text-center tracking-wider border-gray-300 focus:border-[#6B4EE6] focus:ring-[#6B4EE6]" maxLength={11} />
                </div>
                <Button type="submit" 
                  className="w-full h-12 bg-[#6B4EE6] hover:bg-[#5a41d1] text-white font-semibold rounded-lg"
                  disabled={phone.length < 10}>
                  Kod Gönder <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input type={showCode ? 'text' : 'password'} placeholder="• • • • • •" value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-10 pr-10 h-12 text-lg text-center tracking-[0.5em] border-gray-300 focus:border-[#6B4EE6] focus:ring-[#6B4EE6]" maxLength={6} autoFocus />
                  <button type="button" onClick={() => setShowCode(!showCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <Button type="submit" 
                  className="w-full h-12 bg-[#6B4EE6] hover:bg-[#5a41d1] text-white font-semibold rounded-lg"
                  disabled={code.length < 6 || loading}>
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Button>
                <button type="button" onClick={() => setStep('phone')}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 py-2">Numarayı değiştir</button>
              </form>
            )}

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">veya</span></div>
            </div>

            <Button variant="outline" className="w-full h-12 border-2 border-gray-300 hover:border-[#6B4EE6] hover:text-[#6B4EE6]"
              onClick={() => router.push('/restaurant/dashboard')}>
              Demo Olarak Devam Et
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-gray-400 text-sm mt-6">© 2024 Paketçiniz. Tüm hakları saklıdır.</p>
      </motion.div>
    </div>
  );
}
