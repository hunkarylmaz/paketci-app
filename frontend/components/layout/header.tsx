"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Truck, XCircle, Wallet, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "TESLİM EDİLEN", value: 50, icon: CheckCircle2, color: "bg-emerald-500", active: true },
  { label: "İŞLETME", value: 0, icon: Clock, color: "bg-gray-400", active: false },
  { label: "YOLDA", value: 1, icon: Truck, color: "bg-blue-500", active: false },
  { label: "İPTAL", value: 4, icon: XCircle, color: "bg-red-500", active: false },
];

export function Header() {
  const [activeStat, setActiveStat] = useState("TESLİM EDİLEN");
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left - Company Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B3FD9] to-[#7C5AE6] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Paketçiniz</h2>
            <p className="text-sm text-gray-500">Bodrum</p>
          </div>
        </div>

        {/* Center - Stats */}
        <div className="hidden md:flex items-center gap-2">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isActive = activeStat === stat.label;
            return (
              <button
                key={stat.label}
                onClick={() => setActiveStat(stat.label)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#5B3FD9] to-[#7C5AE6] text-white shadow-lg shadow-purple-500/25 scale-105"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isActive ? "bg-white" : stat.color
                  )}
                />
                <span className="text-xs font-medium">{stat.label}</span>
                <span
                  className={cn(
                    "text-lg font-bold",
                    isActive ? "text-white" : "text-gray-900"
                  )}
                >
                  {stat.value}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right - Credits & Profile */}
        <div className="flex items-center gap-4">
          {/* Credit Card */}
          <div className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-[#5B3FD9] to-[#7C5AE6] text-white px-4 py-2 rounded-xl shadow-lg shadow-purple-500/20">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-white/70">KONTÖR</p>
              <p className="text-lg font-bold">948</p>
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-[10px]">
              3
            </Badge>
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", profileOpen && "rotate-180")} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 animate-in fade-in slide-in-from-top-2">
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4" />
                  Profilim
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
