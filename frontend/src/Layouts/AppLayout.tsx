import React, { useEffect } from 'react';
import BottomNavigation from '../Components/BottomNavigation';
import Sidebar from '../Components/Sidebar';
import PinModal from '../Components/PinModal';

export interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  showBottomNav?: boolean;
}

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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-100 md:bg-slate-100/90 flex flex-col md:flex-row font-sans antialiased text-slate-800">
      {/* Desktop Sidebar (hidden on mobile, fixed on md screens and above) */}
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />

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

      {/* Global PIN Modal for unlocking Owner features */}
      <PinModal />
    </div>
  );
};

export default AppLayout;
