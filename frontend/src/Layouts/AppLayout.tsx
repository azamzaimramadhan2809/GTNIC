import React, { useEffect } from 'react';
import BottomNavigation from '../Components/BottomNavigation';
import {
  Store,
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  LogOut,
  ChevronRight
} from 'lucide-react';

export interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  showBottomNav?: boolean;
}

const navItems = [
  {
    name: 'Beranda',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Inventaris Stok',
    href: '/inventory',
    icon: Package,
    badge: '4 Kritis',
  },
  {
    name: 'Kasir POS',
    href: '/pos',
    icon: ShoppingBag,
  },
  {
    name: 'Laporan Keuangan',
    href: '/reports',
    icon: BarChart3,
  },
];

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  currentPath = '/',
  onNavigate,
  showBottomNav = true,
}) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} - WarungPintar`;
    } else {
      document.title = 'WarungPintar - Solusi Digital Kelola Warung & POS';
    }
  }, [title]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-100 md:bg-slate-100/90 flex flex-col md:flex-row font-sans antialiased text-slate-800">
      {/* Desktop Sidebar (hidden on mobile, fixed on md screens and above) */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 h-screen overflow-y-auto bg-white border-r border-slate-200/80 z-30 justify-between shadow-xs">
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

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Desktop Sidebar Navigation">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Menu Utama
            </span>
            {navItems.map((item) => {
              const active = isCurrentActive(item.href);
              const Icon = item.icon;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    active
                      ? 'bg-[#057A55] text-white shadow-md shadow-emerald-800/15'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={19}
                      className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge ? (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        active
                          ? 'bg-emerald-800 text-emerald-100'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : active ? (
                    <ChevronRight size={15} className="text-emerald-200" />
                  ) : null}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Info & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#057A55] font-bold flex items-center justify-center text-xs border border-emerald-300">
                JB
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800 truncate">Juragan Budi</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
                </div>
                <p className="text-[11px] text-slate-500 truncate">Warung Berkah Jaya</p>
              </div>
            </div>
          </div>

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

      {/* Main Scrollable Content Container */}
      <div className="flex-1 min-w-0 w-full overflow-x-hidden overflow-y-auto md:pl-64">
        {/* Strictly bounded inner container */}
        <div className="relative w-full max-w-7xl mx-auto min-h-full bg-slate-50 md:bg-transparent flex flex-col justify-between shadow-2xl md:shadow-none shadow-slate-400/30 md:p-6 lg:p-8">
          <main className={`flex-1 min-w-0 w-full overflow-x-hidden ${showBottomNav ? 'pb-24 md:pb-6' : 'pb-6'}`}>
            {children}
          </main>

          {/* Bottom Navigation for Mobile (< md) */}
          {showBottomNav && (
            <BottomNavigation currentPath={currentPath} onNavigate={onNavigate} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
