'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DealerLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  // Check if already logged in
  useEffect(() => {
    const stored = localStorage.getItem('dealer_user');
    if (stored) {
      router.push('/dealer/dashboard');
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      // Demo credentials check
      if (username === 'paketciniz' && password === '12345678') {
        localStorage.setItem('dealer_user', JSON.stringify({
          id: 1,
          name: 'PAKETCINIZ',
          company: 'Paketçiniz Bayi',
          username: username,
          role: 'dealer',
          token: 'mock_dealer_token'
        }));
        router.push('/dealer/dashboard');
      } else {
        setError('Yanlış kullanıcı adı veya şifre');
        setLoading(false);
      }
    }, 1000);
  };

  if (checking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #2563EB',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b7280' }}>Yükleniyor...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: '#f3f4f6'
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute',
        top: -20,
        left: -20,
        right: -20,
        bottom: -20,
        zIndex: 1,
        filter: 'blur(20px)',
        WebkitFilter: 'blur(20px)',
        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%)'
      }} />
      
      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '90%',
          maxWidth: 460,
          padding: '48px 44px',
          background: '#ffffff',
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,.25), 0 0 0 1px rgba(0,0,0,.05)'
        }}
      >
        <div style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#2563EB',
              margin: '0 0 8px',
              letterSpacing: -0.3,
              lineHeight: 1.3
            }}>
              Yönetici paneline hoşgeldin
            </h1>
            <p style={{
              fontSize: 16,
              color: '#6b7280',
              margin: 0,
              fontWeight: 400
            }}>
              Hesabınıza giriş yapın
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#DC2626',
              fontSize: 14
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24
          }}>
            {/* Username */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#374151',
                letterSpacing: 0.2
              }}>
                Kullanıcı Adı
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  pointerEvents: 'none',
                  zIndex: 2,
                  transition: 'color .3s ease'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı giriniz"
                  style={{
                    width: '100%',
                    padding: '14px 48px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 12,
                    fontSize: 15,
                    background: '#ffffff',
                    transition: 'all .3s ease',
                    boxSizing: 'border-box',
                    fontWeight: 400,
                    color: '#374151',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563EB';
                    e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#374151',
                letterSpacing: 0.2
              }}>
                Şifre
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  pointerEvents: 'none',
                  zIndex: 2,
                  transition: 'color .3s ease'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="16" r="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi giriniz"
                  style={{
                    width: '100%',
                    padding: '14px 48px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 12,
                    fontSize: 15,
                    background: '#ffffff',
                    transition: 'all .3s ease',
                    boxSizing: 'border-box',
                    fontWeight: 400,
                    color: '#374151',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563EB';
                    e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    zIndex: 2,
                    transition: 'color .3s ease',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all .3s ease',
                marginTop: 8,
                boxShadow: '0 4px 12px rgba(37,99,235,.3)',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,.3)';
              }}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid #e5e7eb'
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: 13,
              margin: 0,
              fontWeight: 400
            }}>
              © 2026 Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}