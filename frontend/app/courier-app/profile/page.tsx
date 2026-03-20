"use client";

import { useState } from "react";
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Star, Clock,
  Package, DollarSign, TrendingUp, Camera, Edit,
  FileText, Shield, Bell, Moon, LogOut, ChevronRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const profileData = {
  name: "Ahmet Yılmaz",
  phone: "0555 123 4567",
  email: "ahmet@example.com",
  rating: 4.8,
  totalDeliveries: 1250,
  memberSince: "2023",
  vehicle: "Honda PCX 125",
  plate: "48 AB 123",
  license: "B Sınıfı",
};

const documents = [
  { name: "Kimlik Ön Yüz", status: "verified", icon: FileText },
  { name: "Kimlik Arka Yüz", status: "verified", icon: FileText },
  { name: "Ehliyet", status: "verified", icon: FileText },
  { name: "Ruhsat", status: "pending", icon: FileText },
  { name: "Sigorta", status: "verified", icon: Shield },
];

const settings = [
  { icon: Bell, label: "Bildirimler", value: "Açık" },
  { icon: Moon, label: "Karanlık Mod", value: "Kapalı" },
  { icon: MapPin, label: "Konum Paylaşımı", value: "Açık" },
];

export default function CourierProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">Profilim</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl font-bold text-white">{profileData.name.charAt(0)}</span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white">
              <Camera className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-4">{profileData.name}</h2>
          
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge className="bg-yellow-100 text-yellow-700">
              <Star className="w-3 h-3 mr-1" />
              {profileData.rating}
            </Badge>
            <Badge className="bg-blue-100 text-blue-700">
              {profileData.totalDeliveries} Teslimat
            </Badge>
          </div>

          <p className="text-sm text-slate-500 mt-2">Üye since {profileData.memberSince}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{profileData.totalDeliveries}</p>
          <p className="text-xs text-slate-500">Teslimat</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">45K</p>
          <p className="text-xs text-slate-500">Kazanç</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">%98</p>
          <p className="text-xs text-slate-500">Başarı</p>
        </div>
      </div>

      {/* Personal Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 mb-3">Kişisel Bilgiler</h3>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <Phone className="w-5 h-5 text-slate-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-500">Telefon</p>
              <p className="text-slate-900">{profileData.phone}</p>
            </div>
          </div>
          
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <Mail className="w-5 h-5 text-slate-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-500">E-posta</p>
              <p className="text-slate-900">{profileData.email}</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-slate-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-500">Araç</p>
              <p className="text-slate-900">{profileData.vehicle} • {profileData.plate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="px-4">
        <h3 className="font-semibold text-slate-900 mb-3">Belgelerim</h3>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {documents.map((doc, index) => (
            <div 
              key={doc.name}
              className={`p-4 flex items-center justify-between ${
                index !== documents.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  doc.status === 'verified' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <doc.icon className={`w-5 h-5 ${
                    doc.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                  }`} />
                </div>
                <span className="text-slate-900">{doc.name}</span>
              </div>
              
              <Badge className={doc.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                {doc.status === 'verified' ? (
                  <><CheckCircle2 className="w-3 h-3 mr-1" /> Doğrulandı</>
                ) : 'Beklemede'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 mb-3">Ayarlar</h3>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {settings.map((setting, index) => (
            <button 
              key={setting.label}
              className={`w-full p-4 flex items-center justify-between ${
                index !== settings.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <setting.icon className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">{setting.label}</span>
              </div>
              <span className="text-sm text-slate-500">{setting.value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="p-4">
        <Button variant="outline" className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50">
          <LogOut className="w-5 h-5 mr-2" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  );
}
