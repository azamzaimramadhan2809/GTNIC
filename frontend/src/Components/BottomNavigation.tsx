import React from 'react';
import { LayoutDashboard, Package, ShoppingBag, BarChart3 } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number | string; strokeWidth?: number | string }>;
  badge?: string | number;
}

export interface BottomNavigationProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  className?: string;
}

const navItems: NavItem[] = [
  {
    name: 'Beranda',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Stok',
    href: '/inventory',
    icon: Package,
    badge: '4', // Critical stock alert count
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
  },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentPath = '/',
  onNavigate,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
    <nav
      aria-label="Bottom Navigation"
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 pointer-events-none md:hidden ${className}`}
    >
      <div className="w-full pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-2 safe-area-pb">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
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
                      size={22}
                      strokeWidth={active ? 2.4 : 1.8}
                      className="transition-colors duration-200"
                    />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
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
