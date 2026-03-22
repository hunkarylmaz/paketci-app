'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  )
};

// ==================== STYLES ====================
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>'), linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
    backgroundSize: 'cover, cover',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  } as React.CSSProperties,
  card: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  } as React.CSSProperties,
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#2563EB',
    textAlign: 'center' as const,
    marginBottom: '8px',
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '8px',
  },
  inputWrapper: {
    position: 'relative' as const,
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    fontSize: '15px',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    transition: 'all 0.2s ease',
    outline: 'none',
  } as React.CSSProperties,
  inputFocus: {
    borderColor: '#2563EB',
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    position: 'absolute' as const,
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9CA3AF',
    display: 'flex',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute' as const,
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9CA3AF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    padding: 0,
  },
  button: {
    width: '100%',
    padding: '16px',
    background: '#2563EB',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '8px',
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
  },
  buttonHover: {
    background: '#1D4ED8',
    transform: 'translateY(-1px)',
    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
  },
  footer: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #E5E7EB',
    textAlign: 'center' as const,
    fontSize: '13px',
    color: '#9CA3AF',
  },
  error: {
    background: '#FEE2E2',
    color: '#DC2626',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center' as const,
  }
};

// ==================== MAIN COMPONENT ====================
export default function DealerLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check credentials
    if (username === 'paketciniz' && password === '12345678') {
      const user = {
        id: '1',
        username: 'paketciniz',
        name: 'Paketçiniz Bayi',
        role: 'dealer',
        token: 'fake-jwt-token'
      };
      localStorage.setItem('dealer_user', JSON.stringify(user));
      window.location.href = '/dashboard.html';
    } else {
      setError('Kullanıcı adı veya şifre hatalı');
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Yönetici paneline<br />hoşgeldin
        </h1>
        <p style={styles.subtitle}>Hesabınıza giriş yapın</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Kullanıcı Adı</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}><Icons.user /></span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                placeholder="Kullanıcı adınızı giriniz"
                style={{
                  ...styles.input,
                  ...(focusedField === 'username' ? styles.inputFocus : {}),
                }}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Şifre</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}><Icons.lock /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Şifrenizi giriniz"
                style={{
                  ...styles.input,
                  ...(focusedField === 'password' ? styles.inputFocus : {}),
                  paddingRight: '48px',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? <Icons.eyeOff /> : <Icons.eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                Object.assign(e.currentTarget.style, styles.buttonHover);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = styles.button.background as string;
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = styles.button.boxShadow as string;
            }}
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div style={styles.footer}>
          © 2026 Tüm hakları saklıdır.
        </div>
      </div>
    </div>
  );
}
