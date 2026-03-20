'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  ChevronRight,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { menuItems, getMenuForRole, MenuItem } from '@/config/menu.config';
import { UserRole, RoleDescriptions, RoleColors, User } from '@/types/user';

interface SidebarProps {
  user: User;
  onLogout?: () => void;
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Kullanıcının rolüne göre menüyü filtrele
  const filteredMenu = getMenuForRole(user.role);

  // Menü öğesini genişlet/daralt
  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  // Aktif sayfa kontrolü
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobil Menü Butonu */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay (mobil) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-lg text-gray-900">Paketim</span>
          </Link>
        </div>

        {/* Kullanıcı Bilgisi */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <Badge className={cn("text-xs", RoleColors[user.role])}>
                {RoleDescriptions[user.role]}
              </Badge>
            </div>
          </div>
          
          {/* Bölge/Bayi Bilgisi */}
          {(user.regionName || user.dealerName) && (
            <div className="mt-2 text-xs text-gray-500">
              {user.regionName && <span>📍 {user.regionName}</span>}
              {user.dealerName && <span>🏢 {user.dealerName}</span>}
            </div>
          )}
        </div>

        {/* Menü */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {filteredMenu.map((item) => (
              <MenuItemComponent
                key={item.label}
                item={item}
                isActive={isActive}
                expandedItems={expandedItems}
                toggleExpand={toggleExpand}
              />
            ))}
          </ul>
        </nav>

        {/* Alt Bilgiler */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-600"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış Yap
          </Button>
          
          <p className="text-xs text-gray-400 text-center">
            Paketim v1.0
          </p>
        </div>
      </aside>
    </>
  );
}

// Menü Öğesi Bileşeni
function MenuItemComponent({
  item,
  isActive,
  expandedItems,
  toggleExpand,
  depth = 0,
}: {
  item: MenuItem;
  isActive: (href: string) => boolean;
  expandedItems: string[];
  toggleExpand: (label: string) => void;
  depth?: number;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.label);
  const active = isActive(item.href);
  const Icon = item.icon;

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
          active 
            ? "bg-blue-50 text-blue-700" 
            : "text-gray-700 hover:bg-gray-100",
          depth > 0 && "ml-4"
        )}
        onClick={() => hasChildren && toggleExpand(item.label)}
      >
        {hasChildren ? (
          <>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">{item.badge}</Badge>
            )}
            <button className="p-1 hover:bg-gray-200 rounded">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </>
        ) : (
          <Link href={item.href} className="flex items-center gap-2 flex-1">
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">{item.badge}</Badge>
            )}
          </Link>
        )}
      </div>

      {/* Alt Menü */}
      {hasChildren && isExpanded && (
        <ul className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <MenuItemComponent
              key={child.label}
              item={child}
              isActive={isActive}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
