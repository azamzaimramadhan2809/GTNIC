import React, { useState } from 'react';
import { useStore } from '../../Context/StoreContext';
import { MobilePreviewFrame } from '../../Components/MobilePreviewFrame';
import { ProfileEditor } from '../../Components/dashboard/ProfileEditor';
import { ProductEditor } from '../../Components/dashboard/ProductEditor';
import { LinksEditor } from '../../Components/dashboard/LinksEditor';
import {
  Store,
  Layers,
  Link2,
  Share2,
  ExternalLink,
  Check,
  Copy,
  Sparkles,
  Smartphone,
  Eye,
  RotateCcw
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { storeData, resetToDefault } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'products' | 'links'>('profile');
  const [showMobilePreviewModal, setShowMobilePreviewModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  const host = typeof window === 'undefined' ? 'nexasmart.id' : window.location.host;
  const publicUrl = `${origin}/${storeData.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header Navigation */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${storeData.theme?.bgClass || 'bg-emerald-600'}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg text-white leading-tight">LynkStore UMKM</h1>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                Builder
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Digital Storefront & Link-in-Bio Platform</p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {resetToDefault && (
            <button
              onClick={() => {
                if (confirm('Reset form ke contoh template "Warung Bu Siti"?')) {
                  resetToDefault();
                }
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-slate-300 border border-slate-800 transition cursor-pointer"
              title="Reset ke Contoh Toko"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Contoh</span>
            </button>
          )}

          {/* Copy URL Pill */}
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-slate-200 flex items-center gap-1.5 border border-slate-800 transition cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Link Tersalin!' : 'Salin URL'}</span>
          </button>

          {/* View Public Storefront */}
          <button
            onClick={() => onNavigate(`/${storeData.username}`)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition hover:opacity-95 active:scale-95 cursor-pointer ${storeData.theme?.buttonClass || 'bg-emerald-600 text-white'}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Toko Publik</span>
          </button>

          {/* Mobile Preview Toggle for small screens */}
          <button
            onClick={() => setShowMobilePreviewModal(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 cursor-pointer"
            title="Buka Preview Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column (Editor Area): 60% width on desktop */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6">
          {/* Quick Public Link Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-medium">Link Publik Storefront Anda:</p>
                <p className="text-sm font-bold text-white font-mono truncate mt-0.5">
                  <span className="text-slate-500">{host}/</span>
                  <span className="text-emerald-400">{storeData.username}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyLink}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Tersalin' : 'Copy'}
              </button>
              <button
                onClick={() => onNavigate(`/${storeData.username}`)}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Buka
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Profil Toko</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Katalog Produk</span>
              <span className="text-[10px] bg-slate-700/80 text-slate-300 px-1.5 py-0.2 rounded-full font-mono">
                {storeData.products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('links')}
              className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'links'
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Link2 className="w-4 h-4 text-emerald-400" />
              <span>Tautan & Sosmed</span>
            </button>
          </div>

          {/* Active Tab Form Content */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-7 shadow-xl">
            {activeTab === 'profile' && <ProfileEditor />}
            {activeTab === 'products' && <ProductEditor />}
            {activeTab === 'links' && <LinksEditor />}
          </div>
        </div>

        {/* Right Column (Live Preview Area): 40% width on desktop, Sticky positioning */}
        <div className="hidden lg:flex lg:w-2/5 flex-col items-center sticky top-22 self-start">
          <div className="mb-3 flex items-center justify-between w-full max-w-[360px] px-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-300">Live Preview Mobile</span>
            </div>
            <span className="text-[10px] bg-slate-900 border border-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real-Time Sync
            </span>
          </div>

          <MobilePreviewFrame storeData={storeData} />
        </div>
      </main>

      {/* Mobile Preview Modal Drawer for small screens */}
      {showMobilePreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm flex items-center justify-between mb-3 text-white">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" /> Preview Storefront
            </span>
            <button
              onClick={() => setShowMobilePreviewModal(false)}
              className="p-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
          <MobilePreviewFrame storeData={storeData} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
