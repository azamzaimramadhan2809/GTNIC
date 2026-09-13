import React from 'react';
import { LayoutDashboard, Package, ShoppingBag, BarChart3 } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number | string; strokeWidth?: number | string }>;
  badge?: string | number;
  ownerOnly?: boolean;
}

export interface BottomNavigationProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  className?: string;
}

const allNavItems: NavItem[] = [
  {
    name: 'Beranda',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Stok',
    href: '/inventory',
    icon: Package,
    badge: '4',
  },
  {
    name: 'Kasir',
    href: '/pos',
    icon: ShoppingBag,
  },
  {
    name: 'Laporan',
    href: '/reports',
    icon: BarChart3,
    ownerOnly: true,
  },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentPath = '/',
  onNavigate,
  className = '',
}) => {
  const { isCashier, isManagerAuthorized, switchRole, isOwner, openPinModal } = useAuth();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isLocked: boolean = false) => {
    e.preventDefault();
    if (isLocked) {
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

  // When cashier, show reports only if temporary authorization is active or as locked trigger
  const visibleNavItems = allNavItems.filter((item) => {
    if (item.ownerOnly && isCashier && !isManagerAuthorized) {
      return false;
    }
    return true;
  });

  return (
    <nav
      aria-label="Bottom Navigation"
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 pointer-events-none md:hidden ${className}`}
    >
      <div className="w-full pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 py-1.5 safe-area-pb">
          {/* Mobile Role Indicator & Switch Pill */}
          <div className="flex items-center justify-between px-2 pb-1.5 mb-1 border-b border-slate-100 text-[10px]">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className={`w-2 h-2 rounded-full ${isOwner ? 'bg-emerald-500' : isManagerAuthorized ? 'bg-amber-500 animate-pulse' : 'bg-indigo-500'}`} />
              <span>
                Role: <strong className={isOwner ? 'text-emerald-700' : 'text-indigo-700'}>
                  {isOwner ? 'Juragan Budi (Owner)' : isManagerAuthorized ? 'Kasir Siti (Otorisasi PIN)' : 'Kasir Siti (Kasir)'}
                </strong>
              </span>
            </div>
            <button
              onClick={() => switchRole(isOwner ? 'cashier' : 'owner')}
              className="text-[10px] font-semibold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
            >
              Ganti ke {isOwner ? 'Kasir' : 'Owner'}
            </button>
          </div>

          <div className="flex items-center justify-around">
            {visibleNavItems.map((item) => {
              const active = isCurrentActive(item.href);
              const Icon = item.icon;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 group relative select-none ${
                    active
                      ? 'text-[#057A55] font-semibold'
                      : 'text-slate-400 hover:text-slate-600 font-medium'
                  }`}
                >
                  <div
                    className={`relative p-1.5 rounded-xl transition-all duration-200 group-active:scale-90 ${
                      active
                        ? 'bg-emerald-50 text-[#057A55]'
                        : 'text-slate-400 group-hover:text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.4 : 1.8}
                      className="transition-colors duration-200"
                    />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] leading-tight tracking-tight mt-0.5 ${active ? 'font-semibold text-[#057A55]' : 'text-slate-500'}`}>
                    {item.name}
                  </span>
                  {active && (
                    <span className="absolute bottom-0 w-6 h-0.5 bg-[#057A55] rounded-full" />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
