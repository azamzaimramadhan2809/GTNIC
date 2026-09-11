import React from 'react';
import { Head } from '@inertiajs/react';
import BottomNavigation from '../Components/BottomNavigation';

export interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const pageTitle = title ? `${title} - WarungPintar` : 'WarungPintar';

  return (
    <>
      <Head title={pageTitle} />
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between font-sans">
        <div className="w-full max-w-[430px] min-h-screen bg-slate-50 relative flex flex-col justify-between overflow-x-hidden shadow-2xl shadow-slate-300/50">
          <main className="flex-1 pb-24">{children}</main>
          <BottomNavigation />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
