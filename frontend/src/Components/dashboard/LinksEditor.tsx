import React from 'react';
import { useStore } from '../../Context/StoreContext';
import {
  Link2,
  Phone,
  MapPin,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

// Custom Instagram SVG Icon
const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const LinksEditor: React.FC = () => {
  const { storeData, updateStoreInfo } = useStore();
  const {
    whatsappNumber = '',
    instagramUrl = '',
    mapsUrl = ''
  } = storeData;

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Link2 className="w-5 h-5 text-emerald-400" />
          Tautan & Media Sosial
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Hubungkan akun media sosial dan lokasi tokomu agar mudah ditemukan pelanggan.
        </p>
      </div>

      {/* WhatsApp Link Box */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-400" />
            Integrasi Nomor WhatsApp
          </label>
          {cleanPhone && (
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              <span>Tes Tautan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => updateStoreInfo({ whatsappNumber: e.target.value })}
            placeholder="e.g. 081234567890"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono"
          />
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-500" />
            Nomor ini menjadi tujuan utama penerimaan pesanan otomatis melalui WhatsApp.
          </p>
        </div>
      </div>

      {/* Instagram Box */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <InstagramIcon className="w-4 h-4 text-pink-400" />
            Profil Instagram
          </label>
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 font-semibold"
            >
              <span>Kunjungi Profil</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div>
          <input
            type="text"
            value={instagramUrl}
            onChange={(e) => updateStoreInfo({ instagramUrl: e.target.value })}
            placeholder="https://instagram.com/namatokomu"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Contoh: https://instagram.com/warungbusiti
          </p>
        </div>
      </div>

      {/* Google Maps Box */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-400" />
            Tautan Google Maps Lokasi
          </label>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              <span>Buka Peta</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div>
          <input
            type="text"
            value={mapsUrl}
            onChange={(e) => updateStoreInfo({ mapsUrl: e.target.value })}
            placeholder="https://maps.google.com/?q=..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Salin tautan bagikan dari Google Maps untuk mengarahkan pelanggan ke lokasi fisik tokomu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinksEditor;
