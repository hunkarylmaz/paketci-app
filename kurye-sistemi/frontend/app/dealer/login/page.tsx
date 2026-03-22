'use client';

import { useState } from 'react';

// ==================== ICONS ====================
const Icons = {
  user: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  lock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  eye: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  eyeOff: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  ),
  package: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
};

// ==================== COLORS ====================
const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  white: '#FFFFFF',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',
};

// ==================== MAIN COMPONENT ====================
export default function DealerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === 'paketciniz' && password === '12345678') {
      setIsSuccess(true);
      const user = {
        id: '1',
        username: 'paketciniz',
        name: 'Paketçiniz Bayi',
        role: 'dealer',
        token: 'fake-jwt-token'
      };
      localStorage.setItem('dealer_user', JSON.stringify(user));
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 800);
    } else {
      setError('Kullanıcı adı veya şifre hatalı');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 50%, #1E3A8A 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.5,
      }} />

      {/* Floating Circles Decoration */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        top: '-100px',
        right: '-100px',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        bottom: '-50px',
        left: '-50px',
        filter: 'blur(30px)',
      }} />

      {/* Main Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '48px 40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}>
        {/* Success Overlay */}
        {isSuccess && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.98)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.success}, #059669)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.white,
              marginBottom: '20px',
              animation: 'scaleIn 0.4s ease',
            }}>
              <Icons.check />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: colors.gray800,
              margin: '0 0 8px 0',
            }}>Giriş Başarılı</h3>
            <p style={{
              fontSize: '14px',
              color: colors.gray500,
              margin: 0,
            }}>Yönlendiriliyorsunuz...</p>
          </div>
        )}

        {/* Logo Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.white,
            marginBottom: '20px',
            boxShadow: `0 10px 30px -5px ${colors.primary}50`,
          }}>
            <Icons.package />
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: colors.gray800,
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
          }}>
            Bayi Girişi
          </h1>
          <p style={{
            fontSize: '15px',
            color: colors.gray500,
            margin: 0,
            textAlign: 'center',
          }}>
            Yönetici paneline erişmek için giriş yapın
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: colors.errorLight,
            border: `1px solid ${colors.error}30`,
            color: colors.error,
            padding: '14px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'shake 0.5s ease',
          }}>
            <span style={{ fontSize: '16px' }}>⚠️</span>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Username Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: colors.gray700,
              marginBottom: '8px',
            }}>
              Kullanıcı Adı
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: focusedField === 'username' ? colors.primary : colors.gray400,
                transition: 'color 0.2s ease',
                display: 'flex',
              }}>
                <Icons.user />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                placeholder="Kullanıcı adınızı girin"
                style={{
                  width: '100%',
                  padding: '15px 16px 15px 48px',
                  border: `2px solid ${focusedField === 'username' ? colors.primary : colors.gray200}`,
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: colors.gray800,
                  backgroundColor: focusedField === 'username' ? colors.white : colors.gray50,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: colors.gray700,
              marginBottom: '8px',
            }}>
              Şifre
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: focusedField === 'password' ? colors.primary : colors.gray400,
                transition: 'color 0.2s ease',
                display: 'flex',
              }}>
                <Icons.lock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Şifrenizi girin"
                style={{
                  width: '100%',
                  padding: '15px 48px 15px 48px',
                  border: `2px solid ${focusedField === 'password' ? colors.primary : colors.gray200}`,
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: colors.gray800,
                  backgroundColor: focusedField === 'password' ? colors.white : colors.gray50,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors.gray400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.gray600}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.gray400}
              >
                {showPassword ? <Icons.eyeOff /> : <Icons.eye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !username || !password}
            style={{
              width: '100%',
              padding: '16px',
              background: (!username || !password) 
                ? colors.gray300 
                : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
              color: colors.white,
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: (!username || !password) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: (!username || !password)
                ? 'none'
                : `0 4px 14px 0 ${colors.primary}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (username && password && !isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 25px -5px ${colors.primary}60`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              if (username && password) {
                e.currentTarget.style.boxShadow = `0 4px 14px 0 ${colors.primary}40`;
              }
            }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: colors.white,
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Giriş yapılıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '28px 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: colors.gray200 }} />
          <span style={{ fontSize: '13px', color: colors.gray400, fontWeight: 500 }}>veya</span>
          <div style={{ flex: 1, height: '1px', background: colors.gray200 }} />
        </div>

        {/* Demo Credentials */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.gray50}, ${colors.gray100})`,
          border: `1px solid ${colors.gray200}`,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '12px',
            color: colors.gray500,
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: 600,
          }}>
            Demo Giriş Bilgileri
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
          }}>
            <button
              type="button"
              onClick={() => { setUsername('paketciniz'); setPassword('12345678'); }}
              style={{
                padding: '8px 16px',
                background: colors.white,
                border: `1px solid ${colors.gray200}`,
                borderRadius: '8px',
                fontSize: '13px',
                color: colors.gray600,
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.gray200;
                e.currentTarget.style.color = colors.gray600;
              }}
            >
              Bilgileri Doldur
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: `1px solid ${colors.gray200}`,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '13px',
            color: colors.gray400,
            margin: 0,
          }}>
            © 2026 Paketçiniz. Tüm hakları saklıdır.
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
