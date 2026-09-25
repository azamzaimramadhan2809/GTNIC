import React, { useState } from 'react';
import type { Product, StoreData } from '../../types/store';
import {
  X,
  MessageCircle,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

interface QrisPaymentModalProps {
  product: Product;
  quantity: number;
  notes?: string;
  storeData: StoreData;
  onClose: () => void;
}

export const QrisPaymentModal: React.FC<QrisPaymentModalProps> = ({
  product,
  quantity,
  notes = '',
  storeData,
  onClose
}) => {
  const [copiedAmount, setCopiedAmount] = useState(false);

  const isDarkMode = storeData.themeMode === 'dark';
  const totalPrice = product.price * quantity;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(totalPrice.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleConfirmPaymentViaWhatsApp = () => {
    let cleanPhone = (storeData.whatsappNumber || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }

    let message = `Halo Kak *${storeData.storeName}*, saya sudah melakukan pembayaran via *QRIS*:\n\n`;
    message += `📋 *RINCIAN PEMBAYARAN:*\n`;
    message += `• Menu: *${product.name}* (${quantity}x)\n`;
    message += `• Total Nominal: *${formatPrice(totalPrice)}*\n`;
    if (notes.trim()) {
      message += `• Catatan: _${notes.trim()}_\n`;
    }
    message += `\nBerikut bukti transfer / screenshot QRIS saya lampirkan di chat ini. Mohon segera diproses ya kak! Terima kasih. 🙏`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const qrImage = storeData.qrisImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS_${encodeURIComponent(storeData.storeName)}_${totalPrice}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border animate-in zoom-in-95 duration-250 ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Pembayaran QRIS</h3>
              <p className="text-[10px] text-slate-400 font-medium">Scan & Bayar Instan via Semua E-Wallet</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* QRIS Card with Official Styling */}
          <div className="bg-white text-slate-900 rounded-2xl p-5 border-2 border-slate-200 shadow-md flex flex-col items-center text-center">
            {/* National QRIS Header Badge */}
            <div className="w-full flex items-center justify-between border-b pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-widest text-slate-900">QRIS</span>
                <span className="text-[9px] bg-red-600 text-white font-bold px-1 rounded-sm">GPN</span>
              </div>
              <span className="text-[9px] text-slate-500 font-mono font-medium">National Standard</span>
            </div>

            <p className="font-bold text-xs text-slate-900 leading-snug">{storeData.storeName}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{storeData.qrisAccountName || 'NMID: ID1020038921'}</p>

            {/* QR Code Container */}
            <div className="my-3 p-2 bg-white rounded-xl border border-slate-200 shadow-inner">
              <img
                src={qrImage}
                alt="QRIS Store Code"
                className="w-44 h-44 object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mendukung BCA, GoPay, OVO, Dana, ShopeePay dll.</span>
            </div>
          </div>

          {/* Transaction Summary Breakdown */}
          <div className={`p-4 rounded-2xl border space-y-2.5 ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rincian Pembayaran:</h4>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{product.name} (x{quantity})</span>
              <span className="font-medium font-mono">{formatPrice(totalPrice)}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Biaya Layanan</span>
              <span className="font-medium text-emerald-500 font-mono">Rp 0 (Gratis)</span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold">Total Pembayaran:</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-emerald-500 font-mono">{formatPrice(totalPrice)}</span>
                <button
                  onClick={handleCopyAmount}
                  className={`p-1 px-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer ${
                    isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white border border-slate-300 text-slate-700'
                  }`}
                  title="Salin Nominal"
                >
                  {copiedAmount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAmount ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* How to pay steps */}
          <div className={`p-3.5 rounded-2xl border text-[11px] space-y-1.5 ${
            isDarkMode ? 'bg-slate-950/40 border-slate-800/70 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <p className="font-bold text-slate-300 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              Langkah Pembayaran:
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-1 leading-relaxed">
              <li>Buka aplikasi m-Banking atau E-Wallet pilihanmu.</li>
              <li>Pilih menu <strong>Scan / Bayar QRIS</strong> dan arahkan kamera ke barcode di atas.</li>
              <li>Periksa nama toko <strong>{storeData.storeName}</strong> dan masukkan nominal <strong>{formatPrice(totalPrice)}</strong>.</li>
              <li>Simpan bukti transfer dan klik tombol konfirmasi di bawah.</li>
            </ol>
          </div>
        </div>

        {/* Footer Action */}
        <div className={`p-4 border-t ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <button
            onClick={handleConfirmPaymentViaWhatsApp}
            className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konfirmasi Pembayaran via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrisPaymentModal;
