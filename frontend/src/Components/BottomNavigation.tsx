import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, ShoppingCart, BarChart3 } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number | string; strokeWidth?: number | string }>;
}

export interface BottomNavigationProps {
  className?: string;
}

const navItems: NavItem[] = [
  {
    name: 'Beranda',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Stok',
    href: '/inventory',
    icon: Package,
  },
  {
    name: 'Kasir',
    href: '/pos',
    icon: ShoppingCart,
  },
  {
    name: 'Laporan',
    href: '/reports',
    icon: BarChart3,
  },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ className = '' }) => {
  const { url } = usePage();

  const isActivePath = (href: string) => {
    // Exact match or prefix match for sub-routes
    return url === href || url.startsWith(`${href}/`);
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
    >
      <div className="max-w-[430px] mx-auto w-full bg-white border-t border-slate-100 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
          {navItems.map((item) => {
            const active = isActivePath(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? 'text-[#057A55] font-semibold'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-transform duration-200 group-active:scale-90 ${
                    active ? 'bg-emerald-50 text-[#057A55]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.3 : 1.8}
                    className="transition-colors duration-200"
                  />
                </div>
                <span className="text-[11px] leading-tight tracking-tight mt-0.5">
                  {item.name}
                </span>
                {active && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-[#057A55] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
