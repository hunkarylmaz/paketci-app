'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Utensils, Phone, Lock, Eye, EyeOff, ArrowRight, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('code');
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock login
    setTimeout(() => {
      localStorage.setItem('restaurant_user', JSON.stringify({
        id: 1,
        name: 'Lezzet Restoran',
        phone: phone,
        token: 'mock_token'
      }));
      router.push('/restaurant/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-black/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-4">
            <ChefHat className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Paketçiniz</h1>
          <p className="text-white/80">Restoran Partner Paneli</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">
              {step === 'phone' ? 'Giriş Yapın' : 'Doğrulama Kodu'}
            </CardTitle>
            <CardDescription>
              {step === 'phone' 
                ? 'Telefon numaranızı girin' 
                : `${phone} numarasına gönderilen kodu girin`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="5XX XXX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="pl-10 h-12 text-lg"
                    maxLength={11}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700"
                  disabled={phone.length < 10}
                >
                  Kod Gönder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type={showCode ? 'text' : 'password'}
                    placeholder="6 haneli kod"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-10 pr-10 h-12 text-lg text-center tracking-widest"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700"
                  disabled={code.length < 6 || loading}
                >
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full text-sm text-gray-500 hover:text-gray-700"
                >
                  Numarayı değiştir
                </button>
              </form>
            )}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-12" onClick={() => router.push('/restaurant/dashboard')}>
              <Utensils className="mr-2 h-4 w-4" />
              Demo Olarak Devam Et
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-white/60 text-sm mt-6">
          © 2024 Paketçiniz. Tüm hakları saklıdır.
        </p>
      </motion.div>
    </div>
  );
}
