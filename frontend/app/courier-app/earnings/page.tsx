"use client";

import { useState } from "react";
import { 
  ArrowLeft, DollarSign, Calendar, TrendingUp, TrendingDown, 
  Clock, Package, Star, Download, Filter, ChevronRight,
  Wallet, CreditCard, Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const earningsData = {
  today: 350,
  week: 2450,
  month: 9800,
  totalDeliveries: 312,
  totalHours: 186,
  averagePerDelivery: 31.4,
  tips: 425,
  bonuses: 200,
};

const transactions = [
  { id: 1, type: "delivery", amount: 29, tip: 5, customer: "Ali Veli", time: "14:30", date: "Bugün", status: "completed" },
  { id: 2, type: "delivery", amount: 29, tip: 0, customer: "Ayşe Yılmaz", time: "13:45", date: "Bugün", status: "completed" },
  { id: 3, type: "delivery", amount: 29, tip: 10, customer: "Mehmet Kaya", time: "12:20", date: "Bugün", status: "completed" },
  { id: 4, type: "bonus", amount: 50, description: "Haftasonu bonusu", date: "Dün", status: "completed" },
  { id: 5, type: "delivery", amount: 29, tip: 0, customer: "Fatma Şahin", time: "18:10", date: "Dün", status: "completed" },
  { id: 6, type: "delivery", amount: 29, tip: 15, customer: "Can Demir", time: "17:30", date: "Dün", status: "completed" },
];

const weeklyData = [
  { day: "Pzt", earnings: 320, deliveries: 11 },
  { day: "Sal", earnings: 280, deliveries: 9 },
  { day: "Çar", earnings: 350, deliveries: 12 },
  { day: "Per", earnings: 290, deliveries: 10 },
  { day: "Cum", earnings: 380, deliveries: 13 },
  { day: "Cmt", earnings: 420, deliveries: 15 },
  { day: "Paz", earnings: 410, deliveries: 14 },
];

export default function CourierEarningsPage() {
  const [period, setPeriod] = useState("today");

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Kazançlarım</h1>
        </div>
      </div>

      {/* Total Earnings Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <p className="text-blue-100 text-sm">Toplam Kazanç (Bu Ay)</p>
          <p className="text-4xl font-bold mt-1">{earningsData.month.toLocaleString()}₺</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="w-4 h-4 text-green-300" />
            <span className="text-green-300 text-sm">+12% geçen aya göre</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
              <p className="text-blue-200 text-xs">Teslimat</p>
              <p className="text-xl font-bold">{earningsData.totalDeliveries}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Saat</p>
              <p className="text-xl font-bold">{earningsData.totalHours}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Ortalama</p>
              <p className="text-xl font-bold">{earningsData.averagePerDelivery}₺</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Banknote className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-slate-600">Bahşiş</span>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">+{earningsData.tips}₺</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm text-slate-600">Bonus</span>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">+{earningsData.bonuses}₺</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Haftalık Performans</h3>
            <Badge variant="secondary">Bu Hafta</Badge>
          </div>

          <div className="flex items-end justify-between h-32 gap-2">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-100 rounded-t-lg relative overflow-hidden"
                  style={{ height: `${(day.earnings / 450) * 100}%` }}
                >
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all"
                    style={{ height: "100%" }}
                  />
                </div>
                <span className="text-xs text-slate-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">İşlem Geçmişi</h3>
          <Button variant="ghost" size="sm" className="text-blue-600">
            <Filter className="w-4 h-4 mr-1" />
            Filtrele
          </Button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'delivery' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {tx.type === 'delivery' ? (
                      <Package className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Star className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {tx.type === 'delivery' ? tx.customer : tx.description}
                    </p>
                    <p className="text-sm text-slate-500">{tx.date} • {tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">+{tx.amount}₺</p>
                  {tx.tip > 0 && (
                    <p className="text-xs text-green-600">+{tx.tip}₺ bahşiş</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 max-w-md mx-auto">
        <Button className="w-full bg-blue-600 h-12">
          <Download className="w-5 h-5 mr-2" />
          Kazanç Raporunu İndir
        </Button>
      </div>
    </div>
  );
}
