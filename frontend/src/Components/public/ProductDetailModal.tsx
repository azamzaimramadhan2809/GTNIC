import React, { useState } from 'react';
import type { Product, StoreData } from '../../types/store';
import {
  X,
  MessageCircle,
  Plus,
  Minus,
  QrCode,
  ShoppingBag,
  FileText
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  storeData: StoreData;
  onClose: () => void;
  onOpenQris?: (product: Product, quantity: number, notes: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  storeData,
  onClose,
  onOpenQris
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const isDarkMode = storeData.themeMode === 'dark';
  const theme = storeData.theme;
  const totalPrice = product.price * quantity;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handleOrderViaWhatsApp = () => {
    let cleanPhone = (storeData.whatsappNumber || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }

    let message = `Halo Kak *${storeData.storeName}*, saya ingin memesan menu ini:\n\n`;
    message += `🍽️ *${product.name}*\n`;
    message += `📦 Jumlah: *${quantity}x*\n`;
    message += `💵 Total: *${formatPrice(totalPrice)}*\n`;
    if (notes.trim()) {
      message += `📝 Catatan: _${notes.trim()}_\n`;
    }
    message += `\nMohon konfirmasi ketersediaan & alamat pengiriman ya kak. Terima kasih! 🙏`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border animate-in slide-in-from-bottom duration-250 ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Product Image Header with Close Button */}
        <div className="relative h-60 w-full bg-slate-950 flex-shrink-0">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close Floating Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Price & Availability Pill on Image */}
          <div className="absolute bottom-4 inset-x-4 flex items-end justify-between">
            <span className="text-2xl font-black text-white drop-shadow-md">
              {formatPrice(product.price)}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md ${
              product.isAvailable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {product.isAvailable ? 'Stok Tersedia' : 'Habis'}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title & Description */}
          <div>
            <h3 className="text-lg font-bold leading-snug">{product.name}</h3>
            <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {product.description || 'Deskripsi menu khas dari toko kami, disajikan segar dengan bahan-bahan pilihan.'}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-xs font-bold flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              Jumlah Pesanan
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer active:scale-90 ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs'
                }`}
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-8 text-center font-bold text-sm font-mono">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity(prev => prev + 1)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white transition cursor-pointer active:scale-90 ${theme?.bgClass || 'bg-emerald-600'}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Special Notes for seller */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 flex items-center gap-1.5 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              Catatan Khusus (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Jangan terlalu pedas, bumbu dipisah..."
              className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 transition ${
                isDarkMode
                  ? 'bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:border-emerald-500'
                  : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
              }`}
            />
          </div>

          {/* Subtotal Calculation */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isDarkMode ? 'bg-slate-950/40 border-slate-800/80' : 'bg-emerald-50/50 border-emerald-100'
          }`}>
            <div>
              <span className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Harga ({quantity} item)</span>
              <p className="text-base font-extrabold text-emerald-500">{formatPrice(totalPrice)}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-medium bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Checkout Cepat
            </span>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className={`p-4 sm:p-5 border-t space-y-2.5 ${
          isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          {/* Primary Action Button: WhatsApp */}
          <button
            onClick={handleOrderViaWhatsApp}
            disabled={!product.isAvailable}
            className={`w-full py-3 px-4 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer ${
              product.isAvailable
                ? (theme?.buttonClass || 'bg-emerald-600 hover:bg-emerald-500')
                : 'bg-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Pesan via WhatsApp ({formatPrice(totalPrice)})</span>
          </button>

          {/* Secondary Action Button: QRIS Payment */}
          {onOpenQris && product.isAvailable && (
            <button
              onClick={() => onOpenQris(product, quantity, notes)}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer active:scale-98 ${
                isDarkMode
                  ? 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-xs'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-500" />
              <span>Bayar Langsung via QRIS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
