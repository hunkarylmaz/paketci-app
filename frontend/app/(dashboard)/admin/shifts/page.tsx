"use client";

import { useState } from "react";
import { 
  CheckCircle2, XCircle, Clock, User, MapPin, LogOut, 
  AlertCircle, Filter, Search, ChevronDown, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - Gerçek uygulamada API'den gelecek
const pendingRequests = [
  {
    id: "REQ-240318-001",
    courierId: "KRY-001",
    courierName: "Ahmet Yılmaz",
    courierPhone: "0555 123 4567",
    shiftId: "SHIFT-240318-001",
    shiftStart: "09:00",
    scheduledEnd: "18:00",
    currentTime: "16:30",
    remainingTime: "1s 30d",
    requestTime: "16:25",
    reason: "Ailem acil bir durum nedeniyle aradı, hastaneye gitmem gerekiyor.",
    status: "pending",
  },
  {
    id: "REQ-240318-002",
    courierId: "KRY-003",
    courierName: "Mehmet Kaya",
    courierPhone: "0555 345 6789",
    shiftId: "SHIFT-240318-003",
    shiftStart: "10:00",
    scheduledEnd: "19:00",
    currentTime: "17:15",
    remainingTime: "1s 45d",
    requestTime: "17:10",
    reason: "Kendimi çok kötü hissediyorum, ateşim var.",
    status: "pending",
  },
];

const approvedRequests = [
  {
    id: "REQ-240317-005",
    courierName: "Ali Demir",
    shiftDate: "17 Mart 2026",
    approvedBy: "Admin",
    approvedTime: "15:30",
    reason: "Araba arızası",
  },
];

const activeShifts = [
  {
    courierId: "KRY-002",
    courierName: "Ayşe Şahin",
    startTime: "09:00",
    scheduledEnd: "18:00",
    currentLocation: "Kadıköy, İstanbul",
    deliveriesCompleted: 12,
    status: "active",
  },
  {
    courierId: "KRY-004",
    courierName: "Fatma Yıldız",
    startTime: "10:00",
    scheduledEnd: "19:00",
    currentLocation: "Beşiktaş, İstanbul",
    deliveriesCompleted: 8,
    status: "active",
  },
];

export default function AdminShiftApprovalsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");

  const handleApprove = (requestId: string) => {
    // API çağrısı
    alert(`Talep ${requestId} onaylandı!`);
    setShowDetailModal(false);
  };

  const handleReject = (requestId: string) => {
    // API çağrısı
    alert(`Talep ${requestId} reddedildi!`);
    setShowDetailModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vardiya Yönetimi</h1>
          <p className="text-slate-500">Kurye vardiyalarını ve erken çıkış taleplerini yönetin</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Tarih Seç
          </Button>
          <Button className="bg-blue-600">
            <LogOut className="w-4 h-4 mr-2" />
            Toplu Çıkış
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Aktif Vardiya</p>
                <p className="text-2xl font-bold">{activeShifts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Bekleyen Talep</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Bugün Onaylanan</p>
                <p className="text-2xl font-bold">{approvedRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Toplam Kurye</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="pending" className="data-[state=active]:bg-white">
            Bekleyen Talepler ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-white">
            Aktif Vardiyalar ({activeShifts.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-white">
            Onaylananlar
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-white">
            Geçmiş
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <CheckCircle2 className="w-16 h-16 text-green-200 mx-auto mb-4" />
              <p className="text-slate-500">Bekleyen erken çıkış talebi bulunmuyor</p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <Card key={request.id} className="border-amber-200 bg-amber-50/30">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <LogOut className="w-6 h-6 text-amber-600" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg">{request.courierName}</p>
                          <Badge className="bg-amber-100 text-amber-700">Onay Bekliyor</Badge>
                        </div>
                        <p className="text-sm text-slate-500">{request.courierPhone}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <span>Vardiya: {request.shiftStart} - {request.scheduledEnd}</span>
                          <span className="text-amber-600">Kalan: {request.remainingTime}</span>
                        </div>

                        <div className="mt-3 p-3 bg-white rounded-lg border border-amber-200">
                          <p className="text-sm text-slate-700">📝 {request.reason}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleReject(request.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reddet
                      </Button>
                      <Button 
                        className="bg-green-600"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailModal(true);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Onayla
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeShifts.map((shift) => (
              <Card key={shift.courierId}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{shift.courierName}</p>
                        <p className="text-sm text-slate-500">{shift.courierId}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                      Aktif
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-sm text-slate-500">Başlangıç</p>
                      <p className="font-medium">{shift.startTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Bitiş (Planlanan)</p>
                      <p className="font-medium">{shift.scheduledEnd}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Konum</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" /
                        {shift.currentLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Teslimat</p>
                      <p className="font-medium">{shift.deliveriesCompleted} sipariş</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      Konum Gör
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-red-200 text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{request.courierName}</p>
                      <p className="text-sm text-slate-500">{request.shiftDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-700">Onaylandı</Badge>
                    <p className="text-sm text-slate-500 mt-1">{request.approvedBy} • {request.approvedTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history">
          <div className="text-center py-12 bg-white rounded-2xl">
            <History className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">Geçmiş vardiya kayıtları için tarih seçin</p>
            <Button variant="outline" className="mt-4">
              <Calendar className="w-4 h-4 mr-2" />
              Tarih Seç
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Approval Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Erken Çıkış Onayı</h2>
            
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Kurye</p>
                <p className="font-semibold">{selectedRequest.courierName}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Kalan Süre</p>
                <p className="font-semibold text-amber-600">{selectedRequest.remainingTime}</p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-sm text-slate-500">Sebep</p>
                <p className="text-slate-700 mt-1">{selectedRequest.reason}</p>
              </div>

              <textarea
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="Onay notu (opsiyonel)..."
                className="w-full p-3 border border-slate-200 rounded-xl resize-none h-20"
              />

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDetailModal(false)}
                >
                  İptal
                </Button>
                <Button 
                  className="flex-1 bg-green-600"
                  onClick={() => handleApprove(selectedRequest.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Onayla
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
