import React, { useState, useRef, useEffect } from 'react';
import {
  Store,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Sliders,
  LogOut,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  KeyRound,
  Check
} from 'lucide-react';
import { useAuth, type UserRole } from '../Context/AuthContext';

export interface NavItemConfig {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number | string; strokeWidth?: number | string }>;
  badge?: string;
  ownerOnly?: boolean;
}

export interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const navItems: NavItemConfig[] = [
  {
    name: 'Beranda',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Kasir POS',
    href: '/pos',
    icon: ShoppingBag,
  },
  {
    name: 'Inventaris Stok',
    href: '/inventory',
    icon: Package,
    badge: '4 Kritis',
  },
  {
    name: 'Pelanggan',
    href: '/customers',
    icon: Users,
  },
  {
    name: 'Laporan Keuangan',
    href: '/reports',
    icon: BarChart3,
    ownerOnly: true,
  },
  {
    name: 'Pengaturan Toko',
    href: '/settings',
    icon: Sliders,
    ownerOnly: true,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath = '/',
  onNavigate,
}) => {
  const {
    userRole,
    currentUser,
    isCashier,
    isManagerAuthorized,
    revokeManagerAuthorization,
    switchRole,
    openPinModal
  } = useAuth();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isLocked: boolean = false) => {
    e.preventDefault();
    if (isLocked) {
      // If cashier clicks locked item, open PIN modal to grant temporary authorization
      openPinModal(() => {
        if (onNavigate) {
          onNavigate(href);
        } else {
          window.history.pushState({}, '', href);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      });
      return;
    }

    if (onNavigate) {
      onNavigate(href);
    } else {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const isCurrentActive = (href: string) => {
    if (href === '/' || href === '/dashboard') {
      return currentPath === '/' || currentPath === '/dashboard';
    }
    return currentPath.startsWith(href);
  };

  const handleSelectRole = (role: UserRole) => {
    if (role === userRole) {
      setIsRoleDropdownOpen(false);
      return;
    }

    if (role === 'owner' && isCashier) {
      // Prompt for PIN when switching to full Owner profile
      setIsRoleDropdownOpen(false);
      openPinModal(() => {
        switchRole('owner');
      });
    } else {
      switchRole(role);
      setIsRoleDropdownOpen(false);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 h-screen overflow-y-auto bg-white border-r border-slate-200/80 z-30 justify-between shadow-xs select-none">
      {/* Top Logo & Brand */}
      <div>
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#057A55] text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
            <Store size={22} strokeWidth={2.3} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-900 tracking-tight">WarungPintar</span>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-[#057A55] text-[10px] font-bold rounded">POS</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Sistem Kasir & Inventaris</p>
          </div>
        </div>

        {/* Temporary Authorization Banner for Cashier */}
        {isCashier && isManagerAuthorized && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-600 text-white shrink-0">
                <Unlock size={12} strokeWidth={2.5} />
              </span>
              <div>
                <p className="text-[11px] font-bold text-emerald-900 leading-tight">Otorisasi Owner Aktif</p>
                <p className="text-[9px] text-emerald-700">Akan terkunci saat kembali ke POS</p>
              </div>
            </div>
            <button
              type="button"
              onClick={revokeManagerAuthorization}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Kunci Akses Sekarang"
            >
              <Lock size={12} />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5" aria-label="Desktop Sidebar Navigation">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama
            </span>
            {isCashier && (
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tight flex items-center gap-1 ${
                  isManagerAuthorized
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isManagerAuthorized ? (
                  <>
                    <Unlock size={9} />
                    <span>Otorisasi PIN</span>
                  </>
                ) : (
                  <span>Mode Kasir</span>
                )}
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const isLocked = item.ownerOnly && isCashier && !isManagerAuthorized;
            const isTempUnlocked = item.ownerOnly && isCashier && isManagerAuthorized;
            const active = !isLocked && isCurrentActive(item.href);
            const Icon = item.icon;

            // Optional badge text for cashier inventory
            const badgeText = (item.href === '/inventory' && isCashier) 
              ? 'Hanya Baca' 
              : item.badge;

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, isLocked)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group relative ${
                  active
                    ? 'bg-[#057A55] text-white shadow-md shadow-emerald-800/15'
                    : isLocked
                    ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/80 cursor-pointer'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={
                  isLocked
                    ? 'Halaman dilindungi PIN Owner. Klik untuk memasukkan PIN.'
                    : isTempUnlocked
                    ? 'Akses Sementara (Owner PIN Aktif)'
                    : undefined
                }
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Icon
                      size={19}
                      className={
                        active
                          ? 'text-white'
                          : isLocked
                          ? 'text-slate-300 group-hover:text-slate-400'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }
                    />
                    {isLocked && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xs">
                        <Lock size={9} strokeWidth={2.8} />
                      </span>
                    )}
                    {isTempUnlocked && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xs">
                        <Unlock size={8} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <span className={isLocked ? 'text-slate-400' : ''}>{item.name}</span>
                </div>

                {isLocked ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                    <Lock size={10} />
                    <span>PIN</span>
                  </span>
                ) : isTempUnlocked ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <span>Sementara</span>
                  </span>
                ) : badgeText ? (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      active
                        ? 'bg-emerald-800 text-emerald-100'
                        : item.href === '/inventory' && isCashier
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {badgeText}
                  </span>
                ) : active ? (
                  <ChevronRight size={15} className="text-emerald-200" />
                ) : null}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Info & Role Switcher */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70 relative" ref={dropdownRef}>
        {/* Quick Role Switcher Dropdown Menu (Pop-up) */}
        {isRoleDropdownOpen && (
          <div className="absolute bottom-[calc(100%-10px)] left-3 right-3 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Ganti Akun Pengguna
              </span>
            </div>

            {/* Owner Option */}
            <button
              type="button"
              onClick={() => handleSelectRole('owner')}
              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                userRole === 'owner'
                  ? 'bg-emerald-50 text-emerald-950 font-semibold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#057A55] font-bold flex items-center justify-center text-xs border border-emerald-300 shrink-0">
                  JB
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">Juragan Budi</span>
                    <span className="px-1.5 py-0.2 bg-emerald-100 text-[#057A55] text-[9px] font-bold rounded">
                      Owner
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Akses penuh semua fitur</p>
                </div>
              </div>
              {userRole === 'owner' && <Check size={16} className="text-[#057A55] stroke-[2.5]" />}
            </button>

            {/* Cashier Option */}
            <button
              type="button"
              onClick={() => handleSelectRole('cashier')}
              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer mt-1 ${
                userRole === 'cashier'
                  ? 'bg-indigo-50 text-indigo-950 font-semibold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-300 shrink-0">
                  KS
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">Kasir Siti</span>
                    <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 text-[9px] font-bold rounded">
                      Kasir
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Akses Kasir POS & Stok</p>
                </div>
              </div>
              {userRole === 'cashier' && <Check size={16} className="text-indigo-600 stroke-[2.5]" />}
            </button>

            {/* PIN Authorization button if in cashier mode */}
            {isCashier && !isManagerAuthorized && (
              <div className="pt-2 mt-1 border-t border-slate-100 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    openPinModal();
                  }}
                  className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <KeyRound size={13} />
                  <span>Input PIN Owner (123456)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile Card & Switch Trigger */}
        <div
          onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
          className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-xs mb-3 group ${
            isRoleDropdownOpen
              ? 'bg-white border-emerald-400 ring-2 ring-emerald-100'
              : 'bg-white hover:bg-emerald-50/40 border-slate-200/80 hover:border-emerald-200'
          }`}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isRoleDropdownOpen}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-full ${currentUser.avatarBg} ${currentUser.avatarText} font-bold flex items-center justify-center text-xs border border-current/20 group-hover:scale-105 transition-transform shrink-0`}
              >
                {currentUser.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 truncate group-hover:text-[#057A55] transition-colors">
                    {currentUser.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${currentUser.badgeBg} ${currentUser.badgeText}`}
                  >
                    {currentUser.roleLabel}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  {isCashier && isManagerAuthorized ? 'Otorisasi Sementara' : currentUser.storeName}
                </p>
              </div>
            </div>

            <div className="text-slate-400 group-hover:text-slate-600 pl-1 shrink-0">
              {isRoleDropdownOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <a
          href="/login"
          onClick={(e) => handleNavClick(e, '/login')}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <LogOut size={15} />
          <span>Keluar Sesi</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
