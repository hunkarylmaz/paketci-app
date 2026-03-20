'use client';

import React, { useState } from 'react';

interface UsersStepProps {
  users: Array<{
    fullName: string;
    phone: string;
    role: 'MANAGER' | 'STAFF';
    username: string;
    password: string;
  }>;
  onChange: (users: any[]) => void;
}

export function UsersStep({ users, onChange }: UsersStepProps) {
  const [newUser, setNewUser] = useState({
    fullName: '',
    phone: '',
    role: 'MANAGER' as 'MANAGER' | 'STAFF',
    username: '',
    password: '',
  });

  const handleAddUser = () => {
    if (newUser.fullName && newUser.phone && newUser.username && newUser.password) {
      onChange([...users, newUser]);
      setNewUser({
        fullName: '',
        phone: '',
        role: 'MANAGER',
        username: '',
        password: '',
      });
    }
  };

  const handleRemoveUser = (index: number) => {
    onChange(users.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800">Kullanıcılar</h3>
        <p className="text-sm text-gray-500 mt-1">
          Restoran yöneticileri ve çalışanlarını ekleyiniz (En az 1 kullanıcı gerekli)
        </p>
      </div>

      {/* Add User Form */}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad Soyad
            </label>
            <input
              type="text"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Ad Soyad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="05XXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'MANAGER' | 'STAFF' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="MANAGER">Restoran Yöneticisi</option>
              <option value="STAFF">Personel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Kullanıcı adı"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Şifre"
              />
              <button
                onClick={handleAddUser}
                disabled={!newUser.fullName || !newUser.phone || !newUser.username || !newUser.password}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                👤 Kullanıcı Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Added Users List */}
      {users.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Eklenen Kullanıcılar</h4>
          <div className="space-y-2">
            {users.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm">
                    👤
                  </div>
                  <div>
                    <div className="font-medium text-sm">{user.fullName}</div>
                    <div className="text-xs text-gray-500">
                      {user.role === 'MANAGER' ? 'Yönetici' : 'Personel'} • {user.phone}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveUser(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">👥</div>
          <p>Henüz kullanıcı eklenmedi</p>
        </div>
      )}
    </div>
  );
}
