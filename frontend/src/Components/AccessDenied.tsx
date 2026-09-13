import React from 'react';
import {
  ShieldAlert,
  Lock,
  KeyRound,
  ShoppingBag,
  Sparkles,
  AlertOctagon,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

export interface AccessDeniedProps {
  pageTitle?: string;
  onNavigate?: (path: string) => void;
  onUnlockSuccess?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  pageTitle = 'Halaman Ini',
  onNavigate,
  onUnlockSuccess,
}) => {
  const { openPinModal } = useAuth();

  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 md:p-8 min-h-[calc(100vh-140px)] animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 h-3.5 w-full" />

        <div className="p-6 md:p-10 flex flex-col items-center text-center">
          {/* Visual Illustration / Badge */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-3xl bg-rose-50 border-2 border-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
              <ShieldAlert size={48} strokeWidth={1.8} className="animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <Lock size={18} strokeWidth={2.4} />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-bold uppercase tracking-wider mb-3">
            <AlertOctagon size={13} />
            <span>Hak Akses Terbatas (Kasir)</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Akses Ditolak
          </h2>

          {/* Explanation */}
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-md mb-6">
            Halaman <span className="font-bold text-slate-800">{pageTitle}</span> hanya dapat diakses oleh <span className="font-semibold text-emerald-700">Owner / Admin</span> toko.
          </p>

          {/* Permission Info Box */}
          <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200/70 mb-8 text-left">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/60">
              <UserCheck size={16} className="text-[#057A55]" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Kebijakan Akses WarungPintar
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-2 text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-700">Laporan & Pengaturan:</strong> Terkunci khusus Juragan Budi (Owner).</span>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-700">Kasir POS & Stok:</strong> Tersedia untuk staf Kasir Siti.</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3">
            {/* Primary Unlock Button */}
            <button
              type="button"
              onClick={() => openPinModal(onUnlockSuccess)}
              className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-[#057A55] hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-emerald-800/20 hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <KeyRound size={17} strokeWidth={2.4} />
              <span>Masukkan PIN Owner</span>
            </button>

            {/* Return to POS / Safe Page */}
            <button
              type="button"
              onClick={() => handleNav('/pos')}
              className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={17} />
              <span>Ke Kasir POS</span>
            </button>
          </div>

          {/* Quick Demo Switcher Hint */}
          <div className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-2 text-xs text-slate-400">
            <Sparkles size={13} className="text-amber-500" />
            <span>Ingin uji coba cepat? Beralih role di profil pojok kiri bawah.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
