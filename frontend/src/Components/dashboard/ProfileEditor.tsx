import React, { useRef } from 'react';
import { useStore } from '../../Context/StoreContext';
import type { ThemeId } from '../../types/store';
import { THEME_PRESETS } from '../../types/store';
import {
  Store,
  AtSign,
  FileText,
  Phone,
  Palette,
  Image as ImageIcon,
  Upload,
  Check,
  Sparkles,
  HelpCircle,
  Sun,
  Moon,
  QrCode
} from 'lucide-react';

const SAMPLE_LOGOS = [
  { name: 'Kopi & Cafe', url: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=200' },
  { name: 'Kuliner Nusantara', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200' },
  { name: 'Bakery & Cake', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200' },
  { name: 'Fashion & Butik', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200' }
];

export const ProfileEditor: React.FC = () => {
  const { storeData, updateStoreInfo, setTheme, setThemeMode } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    storeName = '',
    username = '',
    bio = '',
    whatsappNumber = '',
    logoUrl = '',
    theme,
    themeMode = 'light',
    qrisAccountName = '',
    qrisImageUrl = ''
  } = storeData;

  const activeThemeId = (theme?.id || 'emerald') as ThemeId;

  // Handle local image file upload preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, atau WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        updateStoreInfo({ logoUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const isPhoneValid = cleanPhone.length >= 9 && (cleanPhone.startsWith('08') || cleanPhone.startsWith('628') || cleanPhone.startsWith('8'));
  const currentHost = typeof window !== 'undefined' ? window.location.host : 'lynk.id';

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Section Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-emerald-400" />
          Pengaturan Profil Toko & Tampilan
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Lengkapi identitas tokomu dan atur mode tampilan storefront publik (Light / Dark).
        </p>
      </div>

      {/* 1. Theme Mode Switcher (Light Mode vs Dark Mode) */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-emerald-400" />
            Mode Tampilan Storefront Publik
          </label>
          <p className="text-xs text-slate-400 mt-1">
            Pilih gaya dasar tampilan yang dilihat oleh pelangganmu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Light Mode Option */}
          <button
            type="button"
            onClick={() => setThemeMode('light')}
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition cursor-pointer text-left ${
              themeMode === 'light'
                ? 'bg-slate-950 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Light Mode</span>
                  {themeMode === 'light' && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.2 rounded-full border border-emerald-800">
                      Aktif
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Latar putih bersih, card terang & aksen hijau emerald.</p>
              </div>
            </div>
            {themeMode === 'light' && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          </button>

          {/* Dark Mode Option */}
          <button
            type="button"
            onClick={() => setThemeMode('dark')}
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition cursor-pointer text-left ${
              themeMode === 'dark'
                ? 'bg-slate-950 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Dark Mode</span>
                  {themeMode === 'dark' && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.2 rounded-full border border-emerald-800">
                      Aktif
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Latar charcoal slate gelap (#0F172A) elegan & modern.</p>
              </div>
            </div>
            {themeMode === 'dark' && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          </button>
        </div>
      </div>

      {/* 2. Avatar / Logo Upload Section */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          Logo / Foto Profil Toko
        </label>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar Preview */}
          <div className="relative group flex-shrink-0">
            <img
              src={logoUrl || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200'}
              alt={storeName || 'Store Logo'}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-700 shadow-md bg-slate-950"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200';
              }}
            />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-white flex items-center justify-center shadow ${theme?.bgClass || 'bg-emerald-600'}`}>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Upload Controls & URL Input */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="logo-file-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition hover:border-slate-600 shadow-sm active:scale-95 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload Foto dari Perangkat</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Atau masukkan URL gambar langsung:
              </label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => updateStoreInfo({ logoUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>

            {/* Quick Sample Presets */}
            <div>
              <span className="text-[10px] text-slate-500 font-medium">Contoh template logo:</span>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {SAMPLE_LOGOS.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => updateStoreInfo({ logoUrl: sample.url })}
                    className="px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Primary Information Form */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-5">
        <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-400" />
          Informasi Utama
        </label>

        {/* Store Name with character counter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Nama Toko / Usaha <span className="text-emerald-400">*</span>
            </label>
            <span className={`text-[11px] font-mono ${storeName.length > 50 ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
              {storeName.length}/50
            </span>
          </div>
          <input
            type="text"
            maxLength={50}
            value={storeName}
            onChange={(e) => updateStoreInfo({ storeName: e.target.value })}
            placeholder="e.g. Warung Bu Siti"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition font-medium"
          />
        </div>

        {/* Username with URL prefix */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
              <AtSign className="w-3.5 h-3.5 text-emerald-400" />
              Username / Tautan Kustom <span className="text-emerald-400">*</span>
            </label>
            <span className="text-[10px] text-slate-500">Tautan unik storefront tokomu</span>
          </div>
          <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition">
            <span className="px-3.5 text-xs text-slate-500 font-mono bg-slate-900/90 border-r border-slate-800 py-2.5 select-none">
              {currentHost}/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                updateStoreInfo({ username: sanitized });
              }}
              placeholder="warungbusiti"
              className="flex-1 bg-transparent px-3 py-2.5 text-xs text-white focus:outline-hidden font-mono"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Gunakan huruf kecil, angka, tanda strip (-) atau underscore (_).
          </p>
        </div>

        {/* Bio / Tagline with character counter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Bio / Deskripsi Singkat
            </label>
            <span className={`text-[11px] font-mono ${bio.length > 200 ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
              {bio.length}/200
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={200}
            value={bio}
            onChange={(e) => updateStoreInfo({ bio: e.target.value })}
            placeholder="Tuliskan cerita singkat tentang tokomu, jam operasional, atau keunggulan menu..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none leading-relaxed"
          />
        </div>

        {/* WhatsApp Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Nomor WhatsApp Toko <span className="text-emerald-400">*</span>
            </label>
            {whatsappNumber && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isPhoneValid ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                {isPhoneValid ? 'Format Valid' : 'Cek Nomor'}
              </span>
            )}
          </div>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => updateStoreInfo({ whatsappNumber: e.target.value })}
            placeholder="e.g. 081234567890 atau 6281234567890"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition font-mono"
          />
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-500" />
            Pesanan dari pelanggan di storefront publik akan otomatis dikirimkan ke nomor WhatsApp ini.
          </p>
        </div>
      </div>

      {/* 4. QRIS Payment Settings */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-emerald-400" />
            Pengaturan Pembayaran QRIS
          </label>
          <p className="text-xs text-slate-400 mt-1">
            Aktifkan opsi pembayaran QRIS instan bagi pelanggan toko online tokomu.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nama Merchant / Akun QRIS
            </label>
            <input
              type="text"
              value={qrisAccountName}
              onChange={(e) => updateStoreInfo({ qrisAccountName: e.target.value })}
              placeholder="e.g. WARUNG BU SITI (NMID: ID1020038921)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              URL Gambar QRIS Barcode (Opsional)
            </label>
            <input
              type="text"
              value={qrisImageUrl}
              onChange={(e) => updateStoreInfo({ qrisImageUrl: e.target.value })}
              placeholder="https://... (Kosongkan untuk memakai generator otomatis)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </div>

      {/* 5. Accent Theme Preset Selector */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-emerald-400" />
            Pilihan Warna Aksen Tombol
          </label>
          <p className="text-xs text-slate-400 mt-1">
            Pilih warna aksen tombol aksi dan badge tokomu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {(Object.keys(THEME_PRESETS) as ThemeId[]).map((themeKey) => {
            const preset = THEME_PRESETS[themeKey];
            const isSelected = activeThemeId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setTheme(preset.id)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition text-left cursor-pointer ${
                  isSelected
                    ? 'bg-slate-950 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl shadow-md ${preset.bgClass} flex items-center justify-center text-white flex-shrink-0`}>
                    {isSelected ? <Check className="w-4 h-4 text-white font-bold" /> : <Sparkles className="w-3.5 h-3.5 opacity-80" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{preset.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{preset.id}</p>
                  </div>
                </div>

                {isSelected && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-800">
                    Aktif
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
