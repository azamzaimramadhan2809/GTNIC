import React, { useState } from 'react';
import {
  Store,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Package,
  CreditCard
} from 'lucide-react';

export interface LoginProps {
  onLoginSuccess?: () => void;
  onNavigate?: (path: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('081234567890');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (onNavigate) {
        onNavigate('/');
      }
    }, 600);
  };

  const handleSendOtp = () => {
    if (!identifier) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 700);
  };

  return (
    <div className="h-screen w-full max-h-screen overflow-hidden bg-white flex flex-col md:flex-row font-sans antialiased text-slate-800 select-none">
      
      {/* 1. LEFT HERO PANEL (Desktop Only) - 100% Fixed and Contained */}
      <div className="hidden md:flex md:w-1/2 h-full bg-gradient-to-br from-emerald-900 via-[#057A55] to-emerald-950 text-white p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative background ambient glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#def7ec_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top: Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#057A55] flex items-center justify-center shadow-lg shadow-emerald-950/20">
              <Store size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">WarungPintar</span>
                <span className="px-2 py-0.5 bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-[10px] font-bold rounded-full">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/80 font-medium">Digital POS & Inventory</p>
            </div>
          </div>
        </div>

        {/* Center: Hero Headline & Features */}
        <div className="relative z-10 my-auto py-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-400/30 text-emerald-100 text-[11px] font-semibold mb-4 backdrop-blur-md shadow-xs">
            <Sparkles size={13} className="text-amber-300" />
            <span>Platform POS #1 untuk UMKM & Toko Kelontong</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight mb-3">
            Kelola Warung Pintar Dalam Satu Genggaman
          </h2>

          <p className="text-xs lg:text-sm text-emerald-100/90 leading-relaxed mb-6 font-normal">
            Otomatisasi stok bahan baku, kasir POS cepat, dan laporan omset real-time untuk memajukan usaha UMKM Indonesia.
          </p>

          {/* Key Value Cards */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 rounded-lg bg-emerald-400/20 text-emerald-200">
                  <CreditCard size={15} />
                </div>
                <span className="text-xs font-bold text-white">Kasir QRIS Cepat</span>
              </div>
              <p className="text-[10px] text-emerald-100/80 leading-snug">
                Proses pembayaran instan & cetak struk tanpa ribet.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 rounded-lg bg-amber-400/20 text-amber-200">
                  <Package size={15} />
                </div>
                <span className="text-xs font-bold text-white">Peringatan Stok</span>
              </div>
              <p className="text-[10px] text-emerald-100/80 leading-snug">
                Notifikasi otomatis saat stok barang mulai kritis.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: Social Proof & Security */}
        <div className="relative z-10 pt-3 border-t border-emerald-700/50 flex items-center justify-between text-[11px] text-emerald-100/80">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-300" />
            <span>Dipercaya 10.000+ Juragan Warung</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-200">
            <ShieldCheck size={14} />
            <span>256-bit SSL Security</span>
          </div>
        </div>
      </div>

      {/* 2. RIGHT FORM PANEL (Mobile & Desktop) - 100% Centered and Non-Scrollable */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-4 sm:p-8 lg:p-10 bg-slate-50 md:bg-white overflow-hidden">
        <div className="w-full max-w-sm space-y-4">
          
          {/* Mobile Top Brand (Visible on mobile only < md) */}
          <div className="md:hidden text-center pb-1">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-[#057A55] text-white items-center justify-center shadow-lg shadow-emerald-800/20 mb-2">
              <Store size={24} strokeWidth={2.3} />
            </div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">WarungPintar</h1>
            <p className="text-[11px] text-slate-500">Sistem Kasir POS & Inventaris</p>
          </div>

          {/* Form Header */}
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {authMode === 'password' ? 'Masuk ke Akun' : 'Masuk via WhatsApp'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {authMode === 'password'
                    ? 'Masukkan WhatsApp atau Email terdaftar'
                    : 'Kami akan kirim kode OTP 6 digit'}
                </p>
              </div>

              {/* Mode Toggle Switch */}
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'password' ? 'otp' : 'password');
                  setOtpSent(false);
                }}
                className="text-xs font-semibold text-[#057A55] hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {authMode === 'password' ? 'Opsi OTP' : 'Gunakan Sandi'}
              </button>
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            {/* WhatsApp / Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone size={15} />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="08123456789 atau nama@warung.com"
                  required
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Mode Input */}
            {authMode === 'password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Kata Sandi
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Silakan gunakan opsi Masuk via WhatsApp OTP.');
                    }}
                    className="text-[11px] font-semibold text-[#057A55] hover:underline"
                  >
                    Lupa Sandi?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    required
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Mode Input */}
            {authMode === 'otp' && (
              <div>
                {otpSent ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Kode Verifikasi OTP
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-xs font-semibold text-[#057A55] hover:underline cursor-pointer"
                      >
                        Kirim Ulang
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Contoh: 849201"
                      className="w-full text-center tracking-[0.35em] font-mono text-lg py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] focus:bg-white"
                      autoFocus
                    />
                    <p className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg mt-1.5 flex items-center gap-1">
                      <ShieldCheck size={12} className="shrink-0" />
                      Kode 6 digit telah dikirim ke WhatsApp Anda.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading || !identifier}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 border border-emerald-300 text-[#057A55] font-bold text-xs rounded-xl hover:bg-emerald-100 transition-colors active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    <MessageSquare size={15} className="text-[#057A55]" />
                    <span>Kirim Kode OTP WhatsApp</span>
                  </button>
                )}
              </div>
            )}

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 text-[#057A55] focus:ring-[#057A55] border-slate-300 rounded cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 font-medium">
                  Ingat saya di perangkat ini
                </span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1.5 py-2.5 px-4 bg-[#057A55] hover:bg-[#046c4e] active:bg-[#03543f] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (onLoginSuccess) onLoginSuccess();
                else if (onNavigate) onNavigate('/');
              }}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>⚡ Cepat Masuk sebagai Demo Juragan</span>
            </button>
          </div>

          {/* Footer Registration and Security */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-1">
            <p className="text-[11px] text-slate-500">
              Belum punya akun warung?{' '}
              <a
                href="#register"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Pendaftaran warung baru dibuka. Silakan hubungi tim sales WarungPintar.');
                }}
                className="font-bold text-[#057A55] hover:underline"
              >
                Daftar Warung Baru
              </a>
            </p>
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck size={11} className="text-emerald-600" />
              <span>Sistem keamanan data 256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
