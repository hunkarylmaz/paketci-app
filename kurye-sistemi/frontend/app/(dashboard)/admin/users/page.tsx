'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreVertical,
  Shield,
  MapPin,
  Building2,
  Phone,
  Mail,
  Edit,
  Trash2,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Rol tanımları
const ROLES = [
  { value: 'super_admin', label: 'Sistem Yöneticisi', color: 'bg-red-100 text-red-800', level: 100 },
  { value: 'company_admin', label: 'Şirket Yöneticisi', color: 'bg-purple-100 text-purple-800', level: 90 },
  { value: 'regional_manager', label: 'Bölge Sorumlusu', color: 'bg-blue-100 text-blue-800', level: 80 },
  { value: 'manager', label: 'Yönetici', color: 'bg-green-100 text-green-800', level: 70 },
  { value: 'accountant', label: 'Muhasebe', color: 'bg-orange-100 text-orange-800', level: 60 },
  { value: 'field_sales', label: 'Saha Satış', color: 'bg-cyan-100 text-cyan-800', level: 60 },
  { value: 'operations_support', label: 'Operasyon Destek', color: 'bg-violet-100 text-violet-800', level: 60 },
  { value: 'dealer', label: 'Bayi', color: 'bg-pink-100 text-pink-800', level: 50 },
  { value: 'restaurant', label: 'Restoran', color: 'bg-indigo-100 text-indigo-800', level: 40 },
  { value: 'courier', label: 'Kurye', color: 'bg-teal-100 text-teal-800', level: 10 },
];

// Örnek kullanıcı verileri
const MOCK_USERS = [
  { id: '1', firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet@paketci.com', role: 'company_admin', phone: '5551234567', status: 'active', regionName: 'İstanbul', department: 'Yönetim' },
  { id: '2', firstName: 'Ayşe', lastName: 'Kaya', email: 'ayse@paketci.com', role: 'accountant', phone: '5551234568', status: 'active', regionName: 'İstanbul', department: 'Muhasebe' },
  { id: '3', firstName: 'Mehmet', lastName: 'Demir', email: 'mehmet@paketci.com', role: 'field_sales', phone: '5551234569', status: 'active', regionName: 'Ankara', territoryName: 'Ankara-1', monthlyTarget: 10, monthlyVisitsTarget: 20 },
  { id: '4', firstName: 'Fatma', lastName: 'Şahin', email: 'fatma@paketci.com', role: 'operations_support', phone: '5551234570', status: 'active', regionName: 'İzmir' },
  { id: '5', firstName: 'Ali', lastName: 'Öztürk', email: 'ali@paketci.com', role: 'regional_manager', phone: '5551234571', status: 'active', regionName: 'Marmara Bölgesi' },
  { id: '6', firstName: 'Zeynep', lastName: 'Aydın', email: 'zeynep@paketci.com', role: 'dealer', phone: '5551234572', status: 'active', dealerName: 'Aydınlar Dağıtım' },
];

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Rol adını getir
  const getRoleLabel = (roleValue: string) => {
    const role = ROLES.find(r => r.value === roleValue);
    return role?.label || roleValue;
  };

  // Rol rengini getir
  const getRoleColor = (roleValue: string) => {
    const role = ROLES.find(r => r.value === roleValue);
    return role?.color || 'bg-gray-100 text-gray-800';
  };

  // Filtrelenmiş kullanıcılar
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  // Rol bazlı istatistikler
  const roleStats = ROLES.map(role => ({
    ...role,
    count: users.filter(u => u.role === role.value).length
  })).filter(stat => stat.count > 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Başlık */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-500 mt-1">Tüm kullanıcıları ve yetkilerini yönetin</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Yeni Kullanıcı
        </Button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Toplam Kullanıcı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        {roleStats.slice(0, 4).map(stat => (
          <Card key={stat.value}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtreler */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="İsim, email veya telefon ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Roller</option>
                {ROLES.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sekmeler */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tümü</TabsTrigger>
          <TabsTrigger value="management">Yönetim</TabsTrigger>
          <TabsTrigger value="finance">Finans</TabsTrigger>
          <TabsTrigger value="operations">Operasyon</TabsTrigger>
          <TabsTrigger value="sales">Satış</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <UserTable 
            users={filteredUsers} 
            getRoleLabel={getRoleLabel} 
            getRoleColor={getRoleColor}
          />
        </TabsContent>

        <TabsContent value="management">
          <UserTable 
            users={filteredUsers.filter(u => ['super_admin', 'company_admin', 'regional_manager', 'manager'].includes(u.role))}
            getRoleLabel={getRoleLabel}
            getRoleColor={getRoleColor}
          />
        </TabsContent>

        <TabsContent value="finance">
          <UserTable 
            users={filteredUsers.filter(u => u.role === 'accountant')}
            getRoleLabel={getRoleLabel}
            getRoleColor={getRoleColor}
          />
        </TabsContent>

        <TabsContent value="operations">
          <UserTable 
            users={filteredUsers.filter(u => ['operations_support', 'courier'].includes(u.role))}
            getRoleLabel={getRoleLabel}
            getRoleColor={getRoleColor}
          />
        </TabsContent>

        <TabsContent value="sales">
          <UserTable 
            users={filteredUsers.filter(u => ['field_sales', 'dealer'].includes(u.role))}
            getRoleLabel={getRoleLabel}
            getRoleColor={getRoleColor}
          />
        </TabsContent>
      </Tabs>

      {/* Yeni Kullanıcı Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Kullanıcı Oluştur</DialogTitle>
          </DialogHeader>
          <CreateUserForm roles={ROLES} onClose={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Kullanıcı Tablosu Bileşeni
function UserTable({ 
  users, 
  getRoleLabel, 
  getRoleColor 
}: { 
  users: any[]; 
  getRoleLabel: (role: string) => string;
  getRoleColor: (role: string) => string;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bölge/Bayi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Kullanıcı bulunamadı
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <Phone className="w-3 h-3 mr-1" />
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                      {user.department && (
                        <div className="text-xs text-gray-500 mt-1">{user.department}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {user.regionName && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {user.regionName}
                          </div>
                        )}
                        {user.dealerName && (
                          <div className="flex items-center mt-1">
                            <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                            {user.dealerName}
                          </div>
                        )}
                        {user.territoryName && (
                          <div className="text-xs text-gray-500 mt-1">
                            {user.territoryName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }>
                        {user.status === 'active' ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Atamaları Yönet
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Kullanıcı Oluşturma Formu
function CreateUserForm({ roles, onClose }: { roles: any[], onClose: () => void }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    regionId: '',
    dealerId: '',
    territoryId: '',
    department: '',
  });

  const [selectedRole, setSelectedRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API çağrısı yapılacak
    console.log('Form data:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
          <Input 
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            placeholder="Ad"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
          <Input 
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            placeholder="Soyad"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input 
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="ornek@paketci.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
        <Input 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="5551234567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setFormData({...formData, role: e.target.value});
          }}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Rol seçin</option>
          {roles.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
      </div>

      {/* Rol bazlı ek alanlar */}
      {selectedRole === 'regional_manager' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bölge</label>
          <Input 
            value={formData.regionId}
            onChange={(e) => setFormData({...formData, regionId: e.target.value})}
            placeholder="Bölge seçin"
          />
        </div>
      )}

      {selectedRole === 'field_sales' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Territory</label>
            <Input 
              value={formData.territoryId}
              onChange={(e) => setFormData({...formData, territoryId: e.target.value})}
              placeholder="Territory seçin"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aylık Hedef (Restoran)</label>
              <Input type="number" placeholder="10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aylık Ziyaret Hedefi</label>
              <Input type="number" placeholder="20" />
            </div>
          </div>
        </>
      )}

      {selectedRole === 'accountant' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departman</label>
          <Input 
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            placeholder="Muhasebe departmanı"
          />
        </div>
      )}

      {selectedRole === 'dealer' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bayi</label>
          <Input 
            value={formData.dealerId}
            onChange={(e) => setFormData({...formData, dealerId: e.target.value})}
            placeholder="Bayi seçin"
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          İptal
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Kullanıcı Oluştur
        </Button>
      </div>
    </form>
  );
}
