'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Package, Phone, Lock, Eye, EyeOff, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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
        id: 1, 
        name: 'Tatlı Köşe', 
        dealerName: 'Osmaniye Paketçiniz',
        phone: phone, 
        token: 'mock_token'
      }));
      router.push('/restaurant/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl mb-6 border border-white/30"
          >
            <Package className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Paketçiniz</h1>
          <p className="text-blue-100 text-lg">Restoran Partner Paneli</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {step === 'phone' ? 'Giriş Yap' : 'Doğrulama'}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {step === 'phone' ? 'Telefon numaranızı girin' : `${phone} numarasına kod gönderildi`}
              </p>
            </div>

            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                  <Input 
                    type="tel" 
                    placeholder="5XX XXX XX XX" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="pl-12 h-14 text-lg text-center tracking-wider border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" 
                    maxLength={11} 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                  disabled={phone.length < 10}
                >
                  Kod Gönder <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCodeSubmit} className="space-y-5">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                  <Input 
                    type={showCode ? 'text' : 'password'} 
                    placeholder="• • • • • •" 
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-12 pr-12 h-14 text-lg text-center tracking-[0.5em] border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl" 
                    maxLength={6} 
                    autoFocus 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                  disabled={code.length < 6 || loading}
                >
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Button>
                <button 
                  type="button" 
                  onClick={() => setStep('phone')}
                  className="w-full text-sm text-blue-600 hover:text-blue-700 py-2 font-medium"
                >
                  Numarayı değiştir
                </button>
              </form>
            )}

            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">veya</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-14 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-xl font-medium"
              onClick={() => {
                localStorage.setItem('restaurant_user', JSON.stringify({
                  id: 1, 
                  name: 'Tatlı Köşe', 
                  dealerName: 'Osmaniye Paketçiniz',
                  phone: '05551234567', 
                  token: 'demo_token'
                }));
                router.push('/restaurant/dashboard');
              }}
            >
              Demo Olarak Devam Et
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-white/60 text-sm mt-8">
          © 2024 Paketçiniz. Tüm hakları saklıdır.
        </p>
      </motion.div>
    </div>
  );
}
