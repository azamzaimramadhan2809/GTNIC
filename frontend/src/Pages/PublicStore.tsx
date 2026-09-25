import React, { useState } from 'react';
import { useStore } from '../Context/StoreContext';
import type { Product, StoreData } from '../types/store';
import { MOCK_STORES } from '../data/mockStores';
import { buildWhatsAppUrl, formatRupiah, sanitizeWhatsAppNumber } from '../utils/whatsapp';
import { ProductDetailModal } from '../Components/public/ProductDetailModal';
import { QrisPaymentModal } from '../Components/public/QrisPaymentModal';
import {
  MessageCircle,
  MapPin,
  Search,
  ShoppingBag,
  Plus,
  Minus,
  X,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Sun,
  Moon,
  BadgeCheck,
  Clock,
  Share2,
  Check
} from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface PublicStoreProps {
  username: string;
  onNavigate: (path: string) => void;
}

export const PublicStore: React.FC<PublicStoreProps> = ({ username, onNavigate }) => {
  const { storeData: activeContextStore, setThemeMode } = useStore();

  const [cart, setCart] = useState<Record<string, number>>({});
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Local theme toggle for previewing light vs dark mode
  const [localThemeMode, setLocalThemeMode] = useState<'light' | 'dark' | null>(null);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qrisModalData, setQrisModalData] = useState<{ product: Product; quantity: number; notes: string } | null>(null);

  // Retrieve store data matching username
  const targetUsername = (username || 'warungbusiti').toLowerCase();
  let currentStoreData: StoreData | null = null;

  if (activeContextStore.username.toLowerCase() === targetUsername || targetUsername === 'demo' || !targetUsername) {
    currentStoreData = activeContextStore;
  } else if (MOCK_STORES[targetUsername]) {
    currentStoreData = MOCK_STORES[targetUsername];
  } else {
    currentStoreData = null;
  }

  if (!currentStoreData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-slate-400 mb-4 border border-slate-800 shadow-xl">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Toko Tidak Ditemukan</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Toko dengan tautan <span className="font-mono text-emerald-400">/{username}</span> belum terdaftar. Kamu dapat membuka toko aktif <span className="font-mono text-emerald-400">/{activeContextStore.username}</span>.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onNavigate(`/${activeContextStore.username}`)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition cursor-pointer"
          >
            Lihat Toko @{activeContextStore.username}
          </button>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition cursor-pointer"
          >
            Buka Dashboard Builder
          </button>
        </div>
      </div>
    );
  }

  const {
    storeName,
    bio,
    logoUrl,
    whatsappNumber,
    instagramUrl,
    mapsUrl,
    theme,
    openingHours = 'Setiap Hari: 08:00 - 21:00 WIB',
    address = 'Jl. Raya Tebet Barat No. 45, Jakarta Selatan',
    products = []
  } = currentStoreData;

  const currentThemeMode = localThemeMode ?? currentStoreData.themeMode ?? 'light';
  const isDarkMode = currentThemeMode === 'dark';

  const toggleThemeMode = () => {
    const nextMode = isDarkMode ? 'light' : 'dark';
    setLocalThemeMode(nextMode);
    if (activeContextStore.username.toLowerCase() === targetUsername) {
      setThemeMode(nextMode);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredProducts = products.filter((p: Product) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartItemsList = Object.entries(cart)
    .filter(([_, qty]) => qty > 0)
    .map(([prodId, qty]) => {
      const product = products.find((p: Product) => p.id === prodId)!;
      return {
        product,
        quantity: qty,
        notes: itemNotes[prodId] || ''
      };
    })
    .filter((item) => Boolean(item.product));

  const totalQuantity = cartItemsList.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItemsList.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleAddToCart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleUpdateQty = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCart((prev) => {
      const next = (prev[id] || 0) + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleCheckoutViaWhatsApp = () => {
    if (cartItemsList.length === 0) return;

    const url = buildWhatsAppUrl(
      whatsappNumber,
      storeName,
      cartItemsList,
      {
        name: customerName,
        address: customerAddress,
        notes: customerNotes
      }
    );

    window.open(url, '_blank');
  };

  const cleanPhone = sanitizeWhatsAppNumber(whatsappNumber);

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-emerald-500/20 transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      {/* Top Bar Navigation */}
      <header className={`w-full sticky top-0 z-30 backdrop-blur-md transition-colors border-b ${
        isDarkMode
          ? 'bg-slate-950/80 border-slate-850 text-slate-300'
          : 'bg-white/80 border-slate-200 text-slate-700'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-xs sm:text-sm tracking-tight text-emerald-500">LynkStore</span>
            <span className="text-slate-400 font-medium text-xs">/@{targetUsername}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Link Button */}
            <button
              onClick={handleCopyLink}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300 hover:text-white'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Salin Link Toko"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Tersalin!' : 'Bagikan'}</span>
            </button>

            {/* Light/Dark Mode Toggle Button */}
            <button
              onClick={toggleThemeMode}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300 hover:text-white'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Toggle Light / Dark Mode"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              <span className="hidden sm:inline">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Back to Dashboard Button */}
            <button
              onClick={() => onNavigate('/dashboard')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Responsive Width for Mobile & Desktop */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-32">
        {/* Top Cover Banner */}
        <div className={`h-40 sm:h-52 lg:h-60 w-full rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-lg border ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        } ${theme?.bgClass || 'bg-emerald-600'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-white/90 border border-white/10 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Toko Digital Resmi</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout (Mobile: Single Stack, Desktop >= 1024px: 2-Column Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-[-3rem] sm:mt-[-4rem] relative z-10">
          
          {/* LEFT COLUMN: Store Profile Sidebar (Desktop 4/12, Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 lg:h-fit space-y-5">
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 border shadow-xl flex flex-col items-center text-center lg:items-start lg:text-left transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* Avatar Logo */}
              <div className="relative mb-3">
                <img
                  src={logoUrl || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300'}
                  alt={storeName}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 shadow-xl object-cover ${
                    isDarkMode ? 'border-slate-900 bg-slate-950' : 'border-white bg-white'
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300';
                  }}
                />
                <div className={`absolute bottom-1 right-1 w-7 h-7 rounded-full text-white flex items-center justify-center shadow-md border-2 ${
                  isDarkMode ? 'border-slate-900' : 'border-white'
                } ${theme?.bgClass || 'bg-emerald-600'}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Store Name & Verification Badge */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center lg:justify-start">
                <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight leading-snug">{storeName}</h1>
                <span title="Terverifikasi UMKM">
                  <BadgeCheck className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                </span>
              </div>

              <p className="text-xs text-slate-400 font-semibold mt-0.5">@{username}</p>

              {/* Bio */}
              {bio && (
                <p className={`text-xs mt-3 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {bio}
                </p>
              )}

              {/* Social & Contact Actions */}
              <div className="flex items-center gap-2 mt-5 w-full">
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition hover:opacity-90 active:scale-95 cursor-pointer ${
                      theme?.buttonClass || 'bg-emerald-600 text-white'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat WhatsApp</span>
                  </a>
                )}

                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2.5 rounded-xl border shadow-xs transition cursor-pointer ${
                      isDarkMode
                        ? 'bg-slate-950 text-pink-400 border-slate-800 hover:bg-slate-850'
                        : 'bg-slate-50 text-pink-600 border-slate-200 hover:bg-pink-50'
                    }`}
                    title="Instagram Toko"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}

                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2.5 rounded-xl border shadow-xs transition cursor-pointer ${
                      isDarkMode
                        ? 'bg-slate-950 text-blue-400 border-slate-800 hover:bg-slate-850'
                        : 'bg-slate-50 text-blue-600 border-slate-200 hover:bg-blue-50'
                    }`}
                    title="Google Maps"
                  >
                    <MapPin className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Operational Info Card */}
              <div className={`w-full mt-5 pt-4 border-t space-y-2.5 text-xs text-left ${
                isDarkMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="line-clamp-1">{openingHours}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Search & Product Catalog (Desktop 8/12) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Search Bar & Header Toolbar */}
            <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 border shadow-md flex flex-col sm:flex-row items-center gap-3 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`relative flex-1 flex items-center rounded-xl border w-full transition ${
                isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari menu favorit atau produk pilihan..."
                  className="w-full bg-transparent pl-9 pr-4 py-2.5 text-xs placeholder:text-slate-400 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-2 px-1">
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                  {filteredProducts.length} Produk
                </span>
              </div>
            </div>

            {/* Product Catalog Grid (1 Column on Mobile, 2 Columns on Tablet/Desktop) */}
            <div className="space-y-4">
              {filteredProducts.length === 0 ? (
                <div className={`py-16 text-center text-xs rounded-3xl border border-dashed p-8 ${
                  isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40 text-slate-400" />
                  <p className="font-semibold text-sm">Tidak Ada Produk Ditemukan</p>
                  <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian lain atau tampilkan seluruh menu.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {filteredProducts.map((p: Product) => {
                    const qty = cart[p.id] || 0;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className={`group rounded-2xl p-3.5 border shadow-xs transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${
                          isDarkMode
                            ? 'bg-slate-900 border-slate-800/90 hover:border-slate-700'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        } ${!p.isAvailable ? 'opacity-60' : ''}`}
                      >
                        <div>
                          {/* Image Thumbnail */}
                          <div className="relative mb-3 overflow-hidden rounded-xl bg-slate-950 h-40 w-full">
                            <img
                              src={p.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                              alt={p.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                              }}
                            />
                            {!p.isAvailable && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                                <span className="text-xs font-bold bg-slate-900 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                                  Stok Habis
                                </span>
                              </div>
                            )}
                          </div>

                          <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-1">{p.name}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed min-h-[2.25rem]">
                            {p.description}
                          </p>
                        </div>

                        {/* Price & Action Row */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/20">
                          <span className={`font-extrabold text-sm sm:text-base ${theme?.textClass || 'text-emerald-600'}`}>
                            {formatRupiah(p.price)}
                          </span>

                          {p.isAvailable && (
                            qty === 0 ? (
                              <button
                                onClick={(e) => handleAddToCart(p.id, e)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition hover:opacity-90 active:scale-95 cursor-pointer ${
                                  theme?.buttonClass || 'bg-emerald-600 text-white'
                                }`}
                              >
                                <Plus className="w-3.5 h-3.5" /> Pesan
                              </button>
                            ) : (
                              <div className={`flex items-center gap-1.5 rounded-xl p-1 border ${
                                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                              }`}>
                                <button
                                  onClick={(e) => handleUpdateQty(p.id, -1, e)}
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-xs cursor-pointer active:scale-90 ${
                                    isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700'
                                  }`}
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold font-mono">{qty}</span>
                                <button
                                  onClick={(e) => handleUpdateQty(p.id, 1, e)}
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-xs active:scale-90 text-white cursor-pointer ${
                                    theme?.bgClass || 'bg-emerald-600'
                                  }`}
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Platform Branding Footer */}
            <div className="pt-8 text-center">
              <p className="text-xs text-slate-400">
                Dibuat dengan <span className="text-emerald-500 font-bold">LynkStore UMKM</span> • Platform Link-in-Bio & Toko Digital Direct WhatsApp
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Floating Bottom Cart Bar */}
      {totalQuantity > 0 && !isCheckoutOpen && (
        <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-40 animate-in slide-in-from-bottom-4">
          <div className="bg-slate-950/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-300 font-medium">{totalQuantity} Item Dipilih</p>
                <p className="text-sm font-bold text-white">{formatRupiah(totalPrice)}</p>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 text-white shadow-lg transition active:scale-95 cursor-pointer ${
                theme?.buttonClass || 'bg-emerald-600'
              }`}
            >
              <span>Lihat Pesanan</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-Up Checkout Drawer Overlay */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4">
          <div className={`w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-200 border-t sm:border ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Drawer Header */}
            <div className={`px-5 py-4 border-b flex items-center justify-between rounded-t-3xl ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                <ShoppingBag className={`w-5 h-5 ${theme?.textClass || 'text-emerald-500'}`} />
                <h3 className="font-bold text-sm">Rincian & Checkout Pesanan</h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Cart Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Pesanan:</h4>
                {cartItemsList.map(({ product: p, quantity }) => (
                  <div key={p.id} className={`p-3 rounded-2xl border space-y-2 ${
                    isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <h5 className="font-semibold text-xs truncate">{p.name}</h5>
                        <p className="text-xs font-bold text-emerald-500">{formatRupiah(p.price * quantity)}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 rounded-lg p-1 border ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}>
                        <button
                          onClick={(e) => handleUpdateQty(p.id, -1, e)}
                          className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer ${
                            isDarkMode ? 'bg-slate-800 text-slate-200' : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold font-mono">{quantity}</span>
                        <button
                          onClick={(e) => handleUpdateQty(p.id, 1, e)}
                          className={`w-5 h-5 rounded flex items-center justify-center text-white cursor-pointer ${theme?.bgClass || 'bg-emerald-600'}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={itemNotes[p.id] || ''}
                      onChange={(e) => setItemNotes({ ...itemNotes, [p.id]: e.target.value })}
                      placeholder="Catatan menu (opsional)..."
                      className={`w-full rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-hidden ${
                        isDarkMode
                          ? 'bg-slate-900 border border-slate-800 text-slate-200'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Customer Details Form */}
              <div className={`space-y-3 pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informasi Pemesan:</h4>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Nama Kamu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Budi Santoso"
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-hidden ${
                      isDarkMode
                        ? 'bg-slate-950 border border-slate-800 text-white focus:border-emerald-500'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 focus:border-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Alamat Pengiriman / No. Meja (Opsional)
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="e.g. Jl. Melati No. 10 atau Meja 3"
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-hidden ${
                      isDarkMode
                        ? 'bg-slate-950 border border-slate-800 text-white focus:border-emerald-500'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 focus:border-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Catatan Tambahan untuk Penjual
                  </label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="e.g. Tolong siapkan sebelum jam 1 siang ya kak..."
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-hidden resize-none ${
                      isDarkMode
                        ? 'bg-slate-950 border border-slate-800 text-white focus:border-emerald-500'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 focus:border-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Order Summary Total */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-xs font-semibold text-slate-400">Total Pembayaran:</span>
                <span className="text-base font-extrabold text-emerald-500 font-mono">{formatRupiah(totalPrice)}</span>
              </div>
            </div>

            {/* Drawer Footer Action Button */}
            <div className={`p-4 border-t space-y-2 rounded-b-3xl ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}>
              <button
                onClick={handleCheckoutViaWhatsApp}
                disabled={!customerName.trim()}
                className={`w-full py-3 px-4 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer ${
                  customerName.trim() ? (theme?.buttonClass || 'bg-emerald-600 hover:bg-emerald-500 text-white') : 'opacity-60 cursor-not-allowed bg-slate-500'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Pesanan ke WhatsApp Toko</span>
              </button>
              {!customerName.trim() && (
                <p className="text-[10px] text-rose-500 text-center mt-1 font-medium">
                  *Mohon isi nama kamu terlebih dahulu
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          storeData={currentStoreData}
          onClose={() => setSelectedProduct(null)}
          onOpenQris={(prod, qty, n) => {
            setSelectedProduct(null);
            setQrisModalData({ product: prod, quantity: qty, notes: n });
          }}
        />
      )}

      {/* QRIS Payment Modal */}
      {qrisModalData && (
        <QrisPaymentModal
          product={qrisModalData.product}
          quantity={qrisModalData.quantity}
          notes={qrisModalData.notes}
          storeData={currentStoreData}
          onClose={() => setQrisModalData(null)}
        />
      )}
    </div>
  );
};

export default PublicStore;
