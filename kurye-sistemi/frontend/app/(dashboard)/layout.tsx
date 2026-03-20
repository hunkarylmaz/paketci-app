import { Sidebar } from '@/components/layout/Sidebar';
import { UserRole } from '@/types/user';

// Örnek kullanıcı (gerçekte API/auth'dan gelecek)
const MOCK_USER = {
  id: '1',
  email: 'admin@paketci.com',
  firstName: 'Ahmet',
  lastName: 'Yılmaz',
  role: UserRole.COMPANY_ADMIN,
  status: 'active' as const,
  companyName: 'Paketim Dağıtım',
  regionName: 'İstanbul',
  createdAt: '2026-01-01T00:00:00Z',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={MOCK_USER} />
      
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
