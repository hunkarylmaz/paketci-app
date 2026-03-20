"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, Coffee, Clock, Play, Square, History,
  AlertCircle, CheckCircle2, Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const breakTypes = [
  { id: "short", name: "Kısa Mola", duration: 15, icon: Coffee, color: "bg-blue-100 text-blue-700" },
  { id: "lunch", name: "Öğle Yemeği", duration: 30, icon: Coffee, color: "bg-green-100 text-green-700" },
  { id: "rest", name: "İhtiyaç Molası", duration: 10, icon: Coffee, color: "bg-orange-100 text-orange-700" },
  { id: "prayer", name: "Namaz Molası", duration: 20, icon: Coffee, color: "bg-purple-100 text-purple-700" },
];

const breakHistory = [
  { type: "Kısa Mola", startTime: "10:30", endTime: "10:45", duration: 15, date: "Bugün" },
  { type: "Öğle Yemeği", startTime: "13:00", endTime: "13:30", duration: 30, date: "Bugün" },
  { type: "Kısa Mola", startTime: "16:15", endTime: "16:30", duration: 15, date: "Dün" },
];

export default function CourierBreakPage() {
  const [activeBreak, setActiveBreak] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(45);

  useEffect(() => {
    if (activeBreak && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeBreak, timeLeft]);

  const startBreak = (breakType: any) => {
    setActiveBreak(breakType);
    setTimeLeft(breakType.duration * 60);
  };

  const endBreak = () => {
    if (activeBreak) {
      const usedTime = (activeBreak.duration * 60 - timeLeft) / 60;
      setTotalBreakTime((prev) => prev + usedTime);
    }
    setActiveBreak(null);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Mola Yönetimi</h1>
            <p className="text-sm text-blue-100">Toplam mola: {Math.floor(totalBreakTime)} dk</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Break Timer */}
        {activeBreak ? (
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Timer className="w-8 h-8" />
            </div>
            
            <p className="text-blue-100">{activeBreak.name} Devam Ediyor</p>
            <p className="text-5xl font-bold my-4">{formatTime(timeLeft)}</p>
            
            <div className="w-full bg-white/20 rounded-full h-2 mb-6">
              <div 
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${((activeBreak.duration * 60 - timeLeft) / (activeBreak.duration * 60)) * 100}%` }}
              />
            </div>

            {timeLeft === 0 && (
              <div className="bg-yellow-400 text-yellow-900 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Mola süreniz doldu!</span>
                </div>
              </div>
            )}

            <Button 
              className="w-full bg-white text-blue-600 hover:bg-blue-50 h-12"
              onClick={endBreak}
            >
              <Square className="w-5 h-5 mr-2" />
              Molayı Bitir
            </Button>
          </div>
        ) : (
          <>
            {/* Break Options */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Mola Seçenekleri</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {breakTypes.map((breakType) => (
                  <button
                    key={breakType.id}
                    onClick={() => startBreak(breakType)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:border-blue-300 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${breakType.color}`}>
                      <breakType.icon className="w-5 h-5" />
                    </div>
                    <p className="font-medium text-slate-900">{breakType.name}</p>
                    <p className="text-sm text-slate-500">{breakType.duration} dakika</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Limit */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-900">Günlük Mola Limiti</span>
                <Badge className="bg-green-100 text-green-700">Kalan: 75 dk</Badge>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div 
                  className="bg-blue-500 rounded-full h-3"
                  style={{ width: "38%" }}
                />
              </div>
              
              <p className="text-sm text-slate-500 mt-2">45 / 120 dakika kullanıldı</p>
            </div>
          </>
        )}

        {/* Break History */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Mola Geçmişi</h3>
          
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {breakHistory.map((breakItem, index) => (
              <div 
                key={index}
                className={`p-4 flex items-center justify-between ${
                  index !== breakHistory.length - 1 ? 'border-b border-slate-100' : ''
                }`}
003e
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{breakItem.type}</p>
                    <p className="text-sm text-slate-500">{breakItem.startTime} - {breakItem.endTime}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant="secondary">{breakItem.duration} dk</Badge>
                  <p className="text-xs text-slate-400 mt-1">{breakItem.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Mola Kuralları</p>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Günde maksimum 120 dakika mola</li>
                <li>• Aktif sipariş varsa mola başlatılamaz</li>
                <li>• Mola süresi aşılırsa uyarı gönderilir</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
