import React, { useState } from 'react';
import type { StoreData, Product } from '../types/store';
import { ProductDetailModal } from './public/ProductDetailModal';
import { QrisPaymentModal } from './public/QrisPaymentModal';
import {
  MessageCircle,
  MapPin,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface MobilePreviewFrameProps {
  storeData: StoreData;
}

export const MobilePreviewFrame: React.FC<MobilePreviewFrameProps> = ({ storeData }) => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qrisModalData, setQrisModalData] = useState<{ product: Product; quantity: number; notes: string } | null>(null);

  const {
    username,
    storeName,
    bio,
    logoUrl,
    whatsappNumber,
    instagramUrl,
    mapsUrl,
    theme,
    themeMode = 'light',
    products = []
  } = storeData;

  const isDarkMode = themeMode === 'dark';

  const cartTotalQty = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotalPrice = Object.entries(cart).reduce((total, [prodId, qty]) => {
    const p = products.find((prod) => prod.id === prodId);
    return total + (p ? p.price * qty : 0);
  }, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

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

  const cleanPhone = whatsappNumber?.replace(/[^0-9]/g, '') || '';

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-[360px] h-[720px] max-h-[85vh] rounded-[40px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col relative select-none transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Phone Notch / Dynamic Island */}
      <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-50 flex items-center justify-center">
        <div className="w-24 h-3.5 bg-black rounded-b-xl flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
        </div>
      </div>

      {/* Screen Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pt-6 pb-20 relative no-scrollbar">
        {/* Store Header Banner */}
        <div className={`h-28 w-full relative ${theme?.bgClass || 'bg-emerald-600'}`}>
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]" />
        </div>

        {/* Profile Info Overlay */}
        <div className="px-4 -mt-12 relative z-10 flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={logoUrl || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200'}
              alt={storeName}
              className={`w-20 h-20 rounded-full border-4 shadow-md object-cover ${
                isDarkMode ? 'border-slate-900 bg-slate-800' : 'border-white bg-white'
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200';
              }}
            />
            <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full text-white flex items-center justify-center shadow ${theme?.bgClass || 'bg-emerald-600'}`}>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <h3 className={`font-bold text-lg mt-2 leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {storeName || 'Nama Toko Anda'}
          </h3>
          <p className="text-xs text-slate-400 font-medium">@{username || 'username'}</p>

          {bio && (
            <p className={`text-xs mt-2 leading-relaxed px-2 line-clamp-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {bio}
            </p>
          )}

          {/* Social / Direct Action Links */}
          <div className="flex items-center justify-center gap-2 mt-3.5 w-full px-2">
            {whatsappNumber && (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className={`flex-1 py-1.5 px-3 rounded-full text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition ${theme?.buttonClass || 'bg-emerald-600 text-white'}`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}

            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={`p-1.5 rounded-full border shadow-xs transition ${
                  isDarkMode
                    ? 'bg-slate-900 text-pink-400 border-slate-800 hover:bg-slate-800'
                    : 'bg-white text-pink-600 border-slate-200 hover:bg-pink-50'
                }`}
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            )}

            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={`p-1.5 rounded-full border shadow-xs transition ${
                  isDarkMode
                    ? 'bg-slate-900 text-blue-400 border-slate-800 hover:bg-slate-800'
                    : 'bg-white text-blue-600 border-slate-200 hover:bg-blue-50'
                }`}
                title="Google Maps"
              >
                <MapPin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="px-4 mt-4">
          <div className={`relative flex items-center rounded-xl border transition ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu & produk..."
              className="w-full bg-transparent pl-8 pr-3 py-1.5 text-xs focus:outline-hidden"
            />
          </div>
        </div>

        {/* Product Catalog Cards */}
        <div className="px-4 mt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-70">Katalog Produk</h4>
            <span className="text-[11px] text-slate-400 font-medium">{filteredProducts.length} Item</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className={`py-8 text-center text-xs rounded-xl border border-dashed p-4 ${
              isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
            }`}>
              Belum ada produk yang cocok.
            </div>
          ) : (
            filteredProducts.map((p: Product) => {
              const qty = cart[p.id] || 0;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`rounded-2xl p-2.5 border shadow-xs flex items-center gap-3 transition cursor-pointer hover:shadow-md ${
                    isDarkMode
                      ? 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700'
                      : 'bg-white border-slate-200/90 hover:border-slate-300'
                  } ${!p.isAvailable ? 'opacity-60' : ''}`}
                >
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120'}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-slate-950"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="font-bold text-xs line-clamp-1">{p.name}</h5>
                      {!p.isAvailable && (
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-medium">
                          Habis
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`font-extrabold text-xs ${theme?.textClass || 'text-emerald-600'}`}>
                        {formatPrice(p.price)}
                      </span>

                      {p.isAvailable && (
                        qty === 0 ? (
                          <button
                            onClick={(e) => handleAddToCart(p.id, e)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 shadow-xs transition active:scale-95 cursor-pointer ${theme?.buttonClass || 'bg-emerald-600 text-white'}`}
                          >
                            <Plus className="w-3 h-3" /> Tambah
                          </button>
                        ) : (
                          <div className={`flex items-center gap-1 rounded-lg p-0.5 border ${
                            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                          }`}>
                            <button
                              onClick={(e) => handleUpdateQty(p.id, -1, e)}
                              className={`w-5 h-5 rounded flex items-center justify-center shadow-xs cursor-pointer ${
                                isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700'
                              }`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-4 text-center text-xs font-bold font-mono">{qty}</span>
                            <button
                              onClick={(e) => handleUpdateQty(p.id, 1, e)}
                              className={`w-5 h-5 rounded flex items-center justify-center text-white shadow-xs cursor-pointer ${theme?.bgClass || 'bg-emerald-600'}`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Mini Cart Bar */}
      {cartTotalQty > 0 && (
        <div className="absolute bottom-3 inset-x-3 bg-slate-900 text-white rounded-2xl p-2.5 shadow-xl flex items-center justify-between z-30 animate-in slide-in-from-bottom-2 border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-300 font-medium">{cartTotalQty} Item Dipilih</p>
              <p className="text-xs font-bold text-white">{formatPrice(cartTotalPrice)}</p>
            </div>
          </div>
          <button
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer ${theme?.buttonClass || 'bg-emerald-600 text-white'}`}
            onClick={() => alert('Mode Preview: Pada link storefront publik, tombol ini akan langsung menghubungkan pesanan ke WhatsApp!')}
          >
            <span>Order WA</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Product Detail Modal Preview */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          storeData={storeData}
          onClose={() => setSelectedProduct(null)}
          onOpenQris={(prod, qty, n) => {
            setSelectedProduct(null);
            setQrisModalData({ product: prod, quantity: qty, notes: n });
          }}
        />
      )}

      {/* QRIS Modal Preview */}
      {qrisModalData && (
        <QrisPaymentModal
          product={qrisModalData.product}
          quantity={qrisModalData.quantity}
          notes={qrisModalData.notes}
          storeData={storeData}
          onClose={() => setQrisModalData(null)}
        />
      )}

      {/* Home Indicator Bar */}
      <div className="absolute bottom-1 inset-x-0 h-3 flex items-center justify-center pointer-events-none z-40">
        <div className="w-28 h-1 bg-slate-400 rounded-full" />
      </div>
    </div>
  );
};

export default MobilePreviewFrame;
