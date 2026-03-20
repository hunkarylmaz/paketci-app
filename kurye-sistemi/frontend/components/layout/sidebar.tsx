"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Users,
  Utensils,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    icon: Package,
    label: "Siparişler",
    href: "/orders",
    subItems: [
      { label: "Güncel Siparişler", href: "/orders/current" },
      { label: "Geçmiş Siparişler", href: "/orders/history" },
    ],
  },
  { icon: Users, label: "Kuryeler", href: "/couriers" },
  { icon: Utensils, label: "Restoranlar", href: "/restaurants" },
  { icon: Users, label: "Kullanıcılar", href: "/users" },
  {
    icon: Clock,
    label: "Vardiya Yönetimi",
    href: "/admin/shifts",
    badge: "2",
  },
  {
    icon: BarChart3,
    label: "Raporlar",
    href: "/reports",
    subItems: [
      { label: "Teslimat Performans", href: "/reports/performance" },
      { label: "Kurye Hakediş", href: "/reports/courier" },
      { label: "Restoran Hakediş", href: "/reports/restaurant" },
      { label: "Ödeme Dağılım", href: "/reports/payment" },
      { label: "Firma Hakediş", href: "/reports/company" },
    ],
  },
  {
    icon: Settings,
    label: "Ayarlar",
    href: "/settings",
    subItems: [
      { label: "Genel Ayar", href: "/settings/general" },
      { label: "Atama & Havuz", href: "/settings/assignment" },
      { label: "Bölgelendirme", href: "/settings/zones" },
      { label: "Mola Yönetim", href: "/settings/breaks" },
      { label: "Bildirimler", href: "/settings/notifications" },
      { label: "Vardiyalar", href: "/settings/shifts" },
      { label: "Kontör Yönetim", href: "/settings/credits" },
    ],
  },
  { icon: HelpCircle, label: "Yardım / Destek", href: "/help" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(["Siparişler"]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleExpand = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white text-slate-700 rounded-xl shadow-lg border border-slate-200"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-40 shadow-2xl",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
          <div
            className={cn(
              "flex items-center gap-3 transition-all",
              collapsed && "opacity-0 w-0 overflow-hidden"
            )}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">KURYE YÖNETİM</h1>
              <p className="text-xs text-slate-400">Bayi Paneli</p>
            </div>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft
              className={cn(
                "w-5 h-5 text-slate-400 transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expanded.includes(item.label);
            const active = isActive(item.href);

            return (
              <div key={item.label}>
                <Link
                  href={hasSubItems ? "#" : item.href}
                  onClick={(e) => {
                    if (hasSubItems) {
                      e.preventDefault();
                      if (!collapsed) toggleExpand(item.label);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      active ? "text-white" : "text-slate-400 group-hover:text-white"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium flex-1 whitespace-nowrap transition-all",
                      collapsed && "opacity-0 w-0 overflow-hidden"
                    )}
                  >
                    {item.label}
                  </span>
                  {hasSubItems && !collapsed && (
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )}
                    />
                  )}
                </Link>

                {/* Submenu */}
                {hasSubItems && !collapsed && isExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-slate-800 pl-3">
                    {item.subItems?.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                          isActive(sub.href)
                            ? "bg-blue-600/20 text-blue-400 font-medium"
                            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                        )}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Credit Display */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900",
            collapsed && "hidden"
          )}
        >
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Kontör Bakiye
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              948{" "}
              <span className="text-sm font-normal text-slate-400">TL</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">~379 teslimat hakkı</p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Spacer */}
      <div className={cn("hidden lg:block transition-all", collapsed ? "w-20" : "w-64")} />
    </>
  );
}
