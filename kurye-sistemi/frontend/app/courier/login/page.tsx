'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CourierLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('courier_user');
    if (stored) {
      window.location.href = '/dashboard.html';
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (username === 'paketciniz' && password === '12345678') {
        localStorage.setItem('courier_user', JSON.stringify({
          id: 1,
          name: 'Hünkar Yılmaz',
          company: 'Paketçiniz Bodrum',
          username: username,
          role: 'courier_admin',
          token: 'mock_courier_token'
        }));
        window.location.href = '/dashboard.html';
      } else {
        setError('Yanlış kullanıcı adı veya şifre');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6B46C1 0%, #5c3cbb 50%, #4c1d95 100%)'
    }}>
      <div style={{
        width: '90%',
        maxWidth: 420,
        padding: 48,
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(0,0,0,.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#6B46C1',
            margin: '0 0 8px'
          }}>
            Yönetici paneline hoşgeldin
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Hesabınıza giriş yapın
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 20,
            color: '#DC2626',
            fontSize: 14
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 8
            }}>
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı giriniz"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: 12,
                fontSize: 15,
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 8
            }}>
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi giriniz"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: 12,
                fontSize: 15,
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #6B46C1, #5c3cbb)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: 32,
          paddingTop: 24,
          borderTop: '1px solid #e5e7eb',
          color: '#9ca3af',
          fontSize: 13
        }}
        >
          © 2026 Tüm hakları saklıdır.
        </div>
      </div>
    </div>
  );
}
