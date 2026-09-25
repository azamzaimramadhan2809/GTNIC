import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  MessageSquare,
  Zap,
  Link2,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Star,
  Plus,
  Menu,
  X,
  Globe,
  TrendingUp
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [usernameInput, setUsernameInput] = useState('kopi-senja');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Phone Mockup interactive state
  const [activeCategory, setActiveCategory] = useState<'all' | 'kopi' | 'non-kopi'>('all');
  const [cartCount, setCartCount] = useState(2);
  const [cartTotal, setCartTotal] = useState(42000);

  const handleStartStore = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || 'toko-saya';
    onNavigate(`/dashboard?username=${encodeURIComponent(cleanUsername)}`);
  };

  const handleAddToCart = (price: number) => {
    setCartCount(prev => prev + 1);
    setCartTotal(prev => prev + price);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white antialiased">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-50/80 border-b border-zinc-200/60 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group active:scale-[0.98] transition-transform duration-150"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white shadow-xs group-hover:bg-zinc-800 transition-colors">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-zinc-950">
                Lynk<span className="text-zinc-500 font-medium">Store</span>
              </span>
              <span className="bg-zinc-100 text-zinc-700 border border-zinc-200 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
                UMKM
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#fitur" className="hover:text-zinc-950 transition-colors">Fitur Utama</a>
            <a href="#cara-kerja" className="hover:text-zinc-950 transition-colors">Cara Kerja</a>
            <a href="#demo" className="hover:text-zinc-950 transition-colors">Demo Mockup</a>
            <a href="#testimoni" className="hover:text-zinc-950 transition-colors">Testimoni</a>
            <a href="#faq" className="hover:text-zinc-950 transition-colors">FAQ</a>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="text-zinc-600 hover:text-zinc-950 text-sm font-medium px-4 py-2 hover:bg-zinc-100 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
            >
              Masuk
            </button>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="bg-zinc-950 hover:bg-zinc-800 active:scale-[0.98] text-white font-medium text-sm px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              Buat Toko Gratis
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 focus:outline-none active:scale-[0.98]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-zinc-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Fitur Utama
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cara Kerja
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Demo Mockup
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-50"
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/dashboard'); }}
                className="w-full text-center py-2.5 rounded-xl text-zinc-800 font-medium border border-zinc-200 hover:bg-zinc-50 active:scale-[0.98]"
              >
                Masuk
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/dashboard'); }}
                className="w-full text-center py-2.5 rounded-xl bg-zinc-950 text-white font-medium shadow-sm active:scale-[0.98]"
              >
                Buat Toko Gratis
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Clean Vercel-like Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-700 text-xs sm:text-sm font-medium shadow-xs mb-8 cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>🚀 Platform Catalog & Link-in-Bio UMKM Indonesia</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>

              {/* Headline - Typography Contrast with Serif Italic Emphasis */}
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 leading-[1.15] mb-6">
                Ubah Chat WhatsApp <br />
                Jadi <span className="font-serif italic font-normal text-zinc-400">toko online</span> <br />
                impian <span className="font-serif italic font-normal text-zinc-400">dalam 2 menit.</span>
              </h1>

              {/* Sub-headline - Muted Zinc 500 */}
              <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl leading-relaxed mb-10 font-normal">
                Tampilkan menu & produkmu secara profesional. Pembeli tinggal pilih, klik, dan langsung terhubung ke WhatsApp toko kamu.
              </p>

              {/* Primary CTA Username Input Form */}
              <form onSubmit={handleStartStore} className="w-full max-w-xl mb-6">
                <div className="bg-white p-2 rounded-2xl shadow-lg shadow-zinc-200/50 border border-zinc-200 focus-within:border-zinc-950 transition-all flex flex-col sm:flex-row gap-2">
                  <div className="bg-zinc-100 text-zinc-500 font-mono text-sm px-3.5 py-3 rounded-xl flex items-center font-medium select-none border border-zinc-200/60">
                    lynkstore.id/
                  </div>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="nama-toko-kamu"
                    className="flex-1 bg-transparent px-3 py-2 text-zinc-950 font-medium placeholder:text-zinc-400 focus:outline-none text-base"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-zinc-950 hover:bg-zinc-800 active:scale-[0.98] text-white font-medium px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-base cursor-pointer shrink-0"
                  >
                    <span>Mulai Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Trust Micro Badges */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-zinc-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Gratis Selamanya</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Komisi 0%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Setup 2 Menit</span>
                </div>
              </div>
            </div>

            {/* Right Column: Vercel-like Smartphone Mockup Preview */}
            <div id="demo" className="lg:col-span-5 flex justify-center items-center relative mt-6 lg:mt-0">
              {/* Floating Feature Badges with 3D Float & Hover Physics */}
              <div className="hidden sm:flex absolute -top-5 -left-8 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl shadow-zinc-200/80 border border-zinc-200/80 items-center gap-3 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100 shadow-xs">
                  <Zap className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-950">Checkout WA Instan</p>
                  <p className="text-[11px] text-zinc-500">Format Order Otomatis</p>
                </div>
              </div>

              <div className="hidden sm:flex absolute -bottom-6 -right-8 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl shadow-zinc-200/80 border border-zinc-200/80 items-center gap-3 transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold border border-zinc-200 shadow-xs">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-950">Penjualan Naik 3x</p>
                  <p className="text-[11px] text-zinc-500">Katalog Rapi & Estetik</p>
                </div>
              </div>

              {/* Smartphone Frame Container */}
              <div className="w-full max-w-[340px] sm:max-w-[360px] bg-zinc-900 p-3.5 rounded-[44px] shadow-2xl shadow-zinc-300/80 border-4 border-zinc-800 relative transform hover:scale-[1.01] transition-transform duration-300">
                {/* Phone Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-5 bg-zinc-950 rounded-full z-30 flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <div className="w-10 h-1.5 rounded-full bg-zinc-800" />
                </div>

                {/* Smartphone Screen Inner */}
                <div className="bg-zinc-50 rounded-[34px] overflow-hidden border border-zinc-200 text-zinc-950 pt-8 pb-4 px-3.5 relative min-h-[580px] flex flex-col">
                  
                  {/* Clean White Store Header Inside Phone */}
                  <div className="bg-white -mx-3.5 -mt-8 p-4 pt-8 border-b border-zinc-100 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full border border-zinc-200 bg-zinc-100 text-zinc-900 font-bold flex items-center justify-center text-base shadow-xs shrink-0">
                        ☕
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-zinc-950 truncate">Kopi Senja Utama</h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate">lynkstore.id/kopi-senja</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-1">
                          <span className="bg-zinc-100 border border-zinc-200/60 px-2 py-0.5 rounded-md font-medium text-zinc-700">⭐ 4.9 (120+)</span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded-md font-semibold">Buka • Jakarta</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex gap-1.5 my-3 overflow-x-auto no-scrollbar py-1">
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        activeCategory === 'all'
                          ? 'bg-zinc-950 text-white shadow-xs'
                          : 'bg-white text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      Semua (4)
                    </button>
                    <button
                      onClick={() => setActiveCategory('kopi')}
                      className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        activeCategory === 'kopi'
                          ? 'bg-zinc-950 text-white shadow-xs'
                          : 'bg-white text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      ☕ Kopi
                    </button>
                    <button
                      onClick={() => setActiveCategory('non-kopi')}
                      className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        activeCategory === 'non-kopi'
                          ? 'bg-zinc-950 text-white shadow-xs'
                          : 'bg-white text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      🥐 Pastry
                    </button>
                  </div>

                  {/* Product Cards Inside Phone (White cards border border-zinc-100) */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[340px] pr-0.5">
                    {/* Item 1 */}
                    {(activeCategory === 'all' || activeCategory === 'kopi') && (
                      <div className="bg-white p-2.5 rounded-xl border border-zinc-100 shadow-xs flex items-center justify-between gap-2.5 hover:border-zinc-300 transition-colors">
                        <div className="w-11 h-11 rounded-lg bg-zinc-100 text-xl flex items-center justify-center shrink-0">
                          🥤
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs font-semibold text-zinc-900 truncate">Es Kopi Susu Aren</h4>
                            <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-200/60">BEST</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 truncate">Kopi espresso murni + gula aren</p>
                          <p className="text-xs font-bold text-zinc-950 mt-0.5">Rp 18.000</p>
                        </div>
                        <button
                          onClick={() => handleAddToCart(18000)}
                          className="bg-zinc-950 hover:bg-zinc-800 active:scale-95 text-white p-1.5 rounded-lg text-xs font-semibold shadow-xs transition-transform cursor-pointer"
                          title="Tambah ke Keranjang"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Item 2 */}
                    {(activeCategory === 'all' || activeCategory === 'non-kopi') && (
                      <div className="bg-white p-2.5 rounded-xl border border-zinc-100 shadow-xs flex items-center justify-between gap-2.5 hover:border-zinc-300 transition-colors">
                        <div className="w-11 h-11 rounded-lg bg-zinc-100 text-xl flex items-center justify-center shrink-0">
                          🍵
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-900 truncate">Matcha Oat Latte</h4>
                          <p className="text-[10px] text-zinc-500 truncate">Uji Matcha + Susu Oat Premium</p>
                          <p className="text-xs font-bold text-zinc-950 mt-0.5">Rp 24.000</p>
                        </div>
                        <button
                          onClick={() => handleAddToCart(24000)}
                          className="bg-zinc-950 hover:bg-zinc-800 active:scale-95 text-white p-1.5 rounded-lg text-xs font-semibold shadow-xs transition-transform cursor-pointer"
                          title="Tambah ke Keranjang"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Item 3 */}
                    {(activeCategory === 'all' || activeCategory === 'non-kopi') && (
                      <div className="bg-white p-2.5 rounded-xl border border-zinc-100 shadow-xs flex items-center justify-between gap-2.5 hover:border-zinc-300 transition-colors">
                        <div className="w-11 h-11 rounded-lg bg-zinc-100 text-xl flex items-center justify-center shrink-0">
                          🥐
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-900 truncate">Butter Croissant</h4>
                          <p className="text-[10px] text-zinc-500 truncate">Renyah & mentega murni</p>
                          <p className="text-xs font-bold text-zinc-950 mt-0.5">Rp 22.000</p>
                        </div>
                        <button
                          onClick={() => handleAddToCart(22000)}
                          className="bg-zinc-950 hover:bg-zinc-800 active:scale-95 text-white p-1.5 rounded-lg text-xs font-semibold shadow-xs transition-transform cursor-pointer"
                          title="Tambah ke Keranjang"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Item 4 */}
                    {(activeCategory === 'all' || activeCategory === 'kopi') && (
                      <div className="bg-white p-2.5 rounded-xl border border-zinc-100 shadow-xs flex items-center justify-between gap-2.5 hover:border-zinc-300 transition-colors">
                        <div className="w-11 h-11 rounded-lg bg-zinc-100 text-xl flex items-center justify-center shrink-0">
                          ☕
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-900 truncate">Americano Ice</h4>
                          <p className="text-[10px] text-zinc-500 truncate">Arabica Blend segar</p>
                          <p className="text-xs font-bold text-zinc-950 mt-0.5">Rp 16.000</p>
                        </div>
                        <button
                          onClick={() => handleAddToCart(16000)}
                          className="bg-zinc-950 hover:bg-zinc-800 active:scale-95 text-white p-1.5 rounded-lg text-xs font-semibold shadow-xs transition-transform cursor-pointer"
                          title="Tambah ke Keranjang"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Primary WhatsApp Button at Bottom of Phone */}
                  <div className="mt-auto pt-2">
                    <div className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-2.5 shadow-md flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all">
                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-700 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs">
                          {cartCount}
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold leading-tight">Order via WhatsApp</p>
                          <p className="text-[10px] text-emerald-100 font-mono font-bold">Rp {cartTotal.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                      <div className="bg-white text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-xs">
                        <span>Checkout</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITION / FEATURES GRID (3 Cards) */}
      <section id="fitur" className="py-24 bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
              Solusi Utama UMKM
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight mt-4 mb-4">
              Kenapa Ribuan UMKM Memilih LynkStore?
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 font-normal">
              Desain modern & super praktis untuk bantu jualan makin laris tanpa potongan komisi sepeserpun.
            </p>
          </div>

          {/* 3 Main Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Katalog Digital Rapi */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200 shadow-xs hover:border-zinc-400 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-200 flex flex-col justify-between group active:scale-[0.99]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-zinc-800 transition-colors">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 mb-3">
                  Katalog Digital Rapi
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-normal">
                  Susun produk, foto, varian rasa/ukuran, dan harga tanpa pusing. Pelanggan bisa melihat daftar menu toko kamu dengan jernih & tanpa ribet.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-zinc-200 text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <span className="font-semibold text-zinc-800">✓ Kategori Terstruktur</span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 rounded">Aktif</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                  <span>Foto High Quality</span>
                  <span>Unlimited Upload</span>
                </div>
              </div>
            </div>

            {/* Card 2: Checkout WhatsApp Instan */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200 shadow-xs hover:border-zinc-400 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-200 flex flex-col justify-between group active:scale-[0.99]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-zinc-800 transition-colors">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 mb-3">
                  Checkout WhatsApp Instan
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-normal">
                  Rincian pesanan langsung terformat rapi di chat WA. Tidak ada lagi typo pesanan, pesan tidak jelas, atau tanya-tanya total bayar berkali-kali.
                </p>
              </div>

              <div className="bg-zinc-950 text-zinc-100 p-3.5 rounded-xl border border-zinc-800 text-[11px] font-mono space-y-1 shadow-inner">
                <p className="text-emerald-400 font-bold">💬 Format Chat Otomatis:</p>
                <p className="truncate">"Halo, saya mau pesan:"</p>
                <p className="text-zinc-400 truncate">1x Es Kopi Aren (Rp18k)</p>
                <p className="text-emerald-300 font-bold truncate">Total: Rp 18.000</p>
              </div>
            </div>

            {/* Card 3: Siap Kirim Link-in-Bio */}
            <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200 shadow-xs hover:border-zinc-400 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-200 flex flex-col justify-between group active:scale-[0.99]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-zinc-800 transition-colors">
                  <Link2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 mb-3">
                  Siap Kirim Link-in-Bio
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-normal">
                  Satu link serbaguna untuk ditaruh di bio Instagram, TikTok, WhatsApp Business, dan Google Maps toko kamu. Siap dibagikan kapan saja.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-zinc-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-zinc-800 truncate">
                    lynkstore.id/toko-kamu
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200 px-2 py-1 rounded-md shrink-0">
                  Ready
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (3 Steps) */}
      <section id="cara-kerja" className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 bg-white px-3 py-1 rounded-full border border-zinc-200">
              Langkah Mudah
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight mt-4 mb-4">
              Mulai Jualan Hanyalah 3 Langkah Mudah
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 font-normal">
              Tidak perlu mengerti coding atau desain mahal. Semuanya bisa kamu atur langsung dari HP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white font-bold text-base flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-zinc-950 mb-2">Buat Profil Toko</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-normal">
                Tentukan nama toko, upload logo, serta nomor WhatsApp tempat pesanan masuk.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white font-bold text-base flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-zinc-950 mb-2">Tambah Produk & Harga</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-normal">
                Masukkan daftar makanan, minuman, atau produk jualanmu lengkap dengan foto menarik.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white font-bold text-base flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-zinc-950 mb-2">Sebar Link & Terima Pesanan</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-normal">
                Salin link toko kamu ke Instagram Bio/WA Story dan terima orderan siap santap!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS / SOCIAL PROOF */}
      <section id="testimoni" className="py-24 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
              Kata Pemilik Toko
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight mt-4 mb-4">
              Dipercaya oleh Ratusan Pelaku Usaha
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 font-normal">
              Lihat bagaimana LynkStore membantu efisiensi bisnis harian pemilik usaha mikro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-zinc-700 text-sm leading-relaxed italic mb-6 font-normal">
                  "Dulu sering banget pembeli bingung milih menu di WA. Sekarang tinggal kirim link LynkStore, pesanan masuk udah rapi totalannya."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200/80">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                  BS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">Budi Santoso</h4>
                  <p className="text-xs text-zinc-500">Owner Kopi Senja - Jakarta</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-zinc-700 text-sm leading-relaxed italic mb-6 font-normal">
                  "Tampilannya super bersih & profesional! Pembeli ngira saya bikin website mahal puluhan juta, padahal tinggal buat di LynkStore gratis."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200/80">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                  SA
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">Siti Aminah</h4>
                  <p className="text-xs text-zinc-500">Dapur Mom's Catering - Bandung</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-zinc-700 text-sm leading-relaxed italic mb-6 font-normal">
                  "Checkout ke WhatsApp beneran bikin alur jualan baju olshop aku makin efektif. Tanpa perlu biaya admin per transaksi lagi."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200/80">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                  RH
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">Rina Handayani</h4>
                  <p className="text-xs text-zinc-500">Rina Hijab Official - Surabaya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-24 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 bg-white px-3 py-1 rounded-full border border-zinc-200">
              Pertanyaan Umum
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight mt-4 mb-4">
              Ada Pertanyaan? Kami Punya Jawabannya
            </h2>
            <p className="text-base text-zinc-500 font-normal">
              Informasi singkat mengenai layanan LynkStore UMKM.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Apakah LynkStore benar-benar gratis dipakai?',
                a: 'Ya, LynkStore 100% gratis untuk membuat katalog produk dan menerima pesanan via WhatsApp tanpa komisi transaksi.'
              },
              {
                q: 'Bagaimana pembeli membayar pesanan mereka?',
                a: 'Pembeli memilih produk di web toko kamu, lalu saat checkout format pesanan otomatis terkirim ke WhatsApp kamu. Kamu bisa memberikan instruksi transfer bank / QRIS secara langsung.'
              },
              {
                q: 'Apakah saya perlu menginstal aplikasi tambahan?',
                a: 'Tidak perlu! LynkStore berbasis web (Web App) sehingga bisa diakses dari browser HP Android, iPhone, maupun Laptop secara fleksibel.'
              },
              {
                q: 'Berapa lama proses pembuatan toko online?',
                a: 'Hanya butuh 2 menit! Masukkan nama toko, tambahkan nomor WhatsApp, upload produk pertama kamu, dan toko langsung aktif.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden transition-all duration-150"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left font-semibold text-zinc-950 flex justify-between items-center gap-4 hover:text-zinc-700 focus:outline-none cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${openFaqIndex === idx ? 'rotate-180 bg-zinc-200 text-zinc-900' : ''}`}>
                    <ChevronRight className="w-4 h-4 rotate-90 text-zinc-600" />
                  </div>
                </button>
                {openFaqIndex === idx && (
                  <div className="px-6 pb-6 text-zinc-500 text-sm leading-relaxed border-t border-zinc-100 pt-4 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-zinc-950/10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl relative z-10 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                Siap Mengubah Chat WhatsApp Jadi Toko Online?
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg font-normal">
                Bergabunglah bersama ribuan UMKM Indonesia lainnya. Buat toko kamu gratis sekarang juga tanpa ribet.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="bg-white hover:bg-zinc-100 active:scale-[0.98] text-zinc-950 font-semibold px-8 py-4 rounded-xl shadow-lg transition-all flex items-center gap-3 text-base cursor-pointer"
              >
                <Store className="w-5 h-5 text-zinc-950" />
                <span>Buat Toko Sekarang - Gratis</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-white border-t border-zinc-200 py-12 text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-zinc-100 pb-8">
            
            {/* Logo Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-zinc-950 tracking-tight">
                Lynk<span className="text-zinc-500 font-medium">Store</span>
              </span>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-zinc-500">
              <a href="#fitur" className="hover:text-zinc-950 transition-colors">Fitur</a>
              <a href="#cara-kerja" className="hover:text-zinc-950 transition-colors">Cara Kerja</a>
              <a href="#demo" className="hover:text-zinc-950 transition-colors">Demo</a>
              <a href="#faq" className="hover:text-zinc-950 transition-colors">FAQ</a>
              <button onClick={() => onNavigate('/dashboard')} className="hover:text-zinc-950 transition-colors cursor-pointer">
                Dashboard
              </button>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-400">
            <p>© 2026 LynkStore UMKM Indonesia. Hak Cipta Dilindungi.</p>
            <p className="flex items-center gap-1">
              Dibuat dengan <span className="text-emerald-600 font-bold">♥</span> untuk kemajuan UMKM Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
