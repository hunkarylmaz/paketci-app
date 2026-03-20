"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, Clock, LogOut, AlertCircle, CheckCircle2, 
  XCircle, Calendar, Timer, MapPin, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock shift data - Gerçek uygulamada API'den gelecek
const shiftData = {
  id: "SHIFT-240318-001",
  startTime: "09:00",
  scheduledEndTime: "18:00",
  actualStartTime: "09:05",
  status: "active", // active, ending_requested, ended, approved_early_exit
  canExitWithoutApproval: false,
  minWorkingHours: 8,
  currentWorkingHours: 6.5,
  remainingMinutes: 90, // 1.5 saat = 90 dakika
  exitRequestStatus: null, // pending, approved, rejected
  exitRequestReason: "",
};

const shiftHistory = [
  { date: "17 Mart 2026", start: "09:00", end: "18:05", duration: "9s 5d", status: "Tamamlandı" },
  { date: "16 Mart 2026", start: "09:00", end: "17:30", duration: "8s 30d", status: "Erken Çıkış (Onaylı)" },
  { date: "15 Mart 2026", start: "09:00", end: "18:00", duration: "9s", status: "Tamamlandı" },
];

export default function CourierShiftPage() {
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitReason, setExitReason] = useState("");
  const [shift, setShift] = useState(shiftData);
  const [timeLeft, setTimeLeft] = useState(shiftData.remainingMinutes * 60); // saniye

  // Geri sayım
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const requestEarlyExit = () => {
    // API çağrısı yapılacak
    setShift({
      ...shift,
      status: "ending_requested",
      exitRequestStatus: "pending",
      exitRequestReason: exitReason,
    });
    setShowExitModal(false);
  };

  const canExitFreely = shift.canExitWithoutApproval || timeLeft <= 0;
  const isPendingApproval = shift.exitRequestStatus === "pending";

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Vardiya Yönetimi</h1>
            <p className="text-sm text-blue-100">#{shift.id}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Shift Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Aktif Vardiya</p>
                <p className="text-sm text-slate-500">{shift.startTime} - {shift.scheduledEndTime}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
              Devam Ediyor
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">İlerleme</span>
              <span className="font-medium text-slate-900"
                >%{Math.round((shift.currentWorkingHours / shift.minWorkingHours) * 100)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-3 transition-all"
                style={{ width: `${Math.min((shift.currentWorkingHours / shift.minWorkingHours) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Time Stats */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Çalışılan Süre</p>
              <p className="text-xl font-bold text-slate-900">{shift.currentWorkingHours}s</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Kalan Süre</p>
              <p className="text-xl font-bold text-blue-600">{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>

        {/* Exit Rules */}
        {!canExitFreely && !isPendingApproval && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Erken Çıkış Kısıtlaması</p>
                <p className="text-sm text-amber-700 mt-1">
                  Vardiyanız bitmeden çıkış yapmak için yönetici onayı gereklidir. 
                  Kalan süre: <strong>{formatTime(timeLeft)}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Approval Status */}
        {isPendingApproval && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Onay Bekleniyor</p>
                <p className="text-sm text-blue-700 mt-1">
                  Erken çıkış talebiniz yöneticiye iletildi. Onaylandığında bildirim alacaksınız.
                </p>
                <p className="text-sm text-blue-600 mt-2 italic">
                  📝 {shift.exitRequestReason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Exit Buttons */}
        <div className="space-y-3">
          {canExitFreely ? (
            <Button 
              className="w-full h-14 bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (confirm("Vardiyayı sonlandırmak istediğinize emin misiniz?")) {
                  // API call
                  alert("Vardiya başarıyla sonlandırıldı!");
                }
              }}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Vardiyayı Sonlandır
            </Button>
          ) : isPendingApproval ? (
            <Button 
              variant="outline"
              className="w-full h-14"
              disabled
            >
              <Clock className="w-5 h-5 mr-2" />
              Onay Bekleniyor...
            </Button>
          ) : (
            <>
              <Button 
                variant="outline"
                className="w-full h-14 border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => setShowExitModal(true)}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Erken Çıkış Talebi Gönder
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  veya <strong>{formatTime(timeLeft)}</strong> sonra serbest çıkış
                </p>
              </div>
            </>
          )}
        </div>

        {/* Shift History */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Vardiya Geçmişi</h3>
          
          <div className="space-y-3">
            {shiftHistory.map((record, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <History className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{record.date}</p>
                      <p className="text-sm text-slate-500">{record.start} - {record.end}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={record.status.includes("Erken") ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}>
                      {record.status}
                    </Badge>
                    <p className="text-sm text-slate-500 mt-1">{record.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Early Exit Request Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-amber-600" />
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-2">Erken Çıkış Talebi</h2>
              <p className="text-slate-500 mb-6">
                Vardiyanızdan erken çıkmak için bir neden belirtin. Talebiniz yöneticiye iletilecektir.
              </p>

              <textarea
                value={exitReason}
                onChange={(e) => setExitReason(e.target.value)}
                placeholder="Erken çıkış nedeninizi yazın..."
                className="w-full p-3 border border-slate-200 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowExitModal(false)}
                >
                  İptal
                </Button>
                <Button 
                  className="flex-1 bg-amber-600"
                  disabled={!exitReason.trim()}
                  onClick={requestEarlyExit}
                >
                  Talep Gönder
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
