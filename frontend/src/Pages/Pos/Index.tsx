import { api, allPages, useSession, message, type Menu, type Sale } from '../../api';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  QrCode,
  Banknote,
  Building2,
  CheckCircle2,
  Printer,
  Share2,
  RotateCcw,
  X,
  ShoppingBag,
  Store,
  ArrowRight,
  Camera,
  Volume2
} from 'lucide-react';

export interface PosProps {
  onNavigate?: (path: string) => void;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  imageIcon: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

const playBeep = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1950, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch {
    // AudioContext fallback
  }
};

export const Pos: React.FC<PosProps> = ({ onNavigate }) => {
  const {warung} = useSession();
  const base = '/warungs/' + warung.id;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);
  const refreshProducts = () => allPages<Menu>(base+'/menus','menus').then(menus=>setProducts(menus.map(m=>({id:m.id,code:'MENU-'+m.id,name:m.name,category:m.category?.name??'Tanpa kategori',price:Number(m.price),stock:m.available_stock,unit:'porsi',imageIcon:'🍽️'}))));
  useEffect(()=>{let active=true;allPages<Menu>(base+'/menus','menus').then(menus=>{if(active){setProducts(menus.map(m=>({id:m.id,code:'MENU-'+m.id,name:m.name,category:m.category?.name??'Tanpa kategori',price:Number(m.price),stock:m.available_stock,unit:'porsi',imageIcon:'🍽️'})));setLoading(false);}}).catch(e=>{if(active){setLoadError(message(e));setLoading(false);}});return()=>{active=false;};},[base]);
  const CATEGORIES = ['Semua', ...new Set(products.map(p=>p.category))];
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<Record<number, CartItem>>({});

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'transfer'>('cash');
  const [cashGiven, setCashGiven] = useState<string>('50000');
  const [applyTax, setApplyTax] = useState<boolean>(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  
  // Barcode Scanner Modal State
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [manualCodeInput, setManualCodeInput] = useState<string>('');
  const [scanFlash, setScanFlash] = useState<boolean>(false);
  const [scannedCountSession, setScannedCountSession] = useState<number>(0);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; icon: string } | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (text: string, icon: string = '✅') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage({ text, icon });
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const [lastTransaction, setLastTransaction] = useState<{
    id: string;
    date: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: string;
    cashGiven: number;
    change: number;
  } | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery, products]);

  // Cart calculations
  const cartList = useMemo(() => Object.values(cart), [cart]);
  const totalItemsCount = useMemo(
    () => cartList.reduce((sum, item) => sum + item.quantity, 0),
    [cartList]
  );
  const subtotal = useMemo(
    () => cartList.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartList]
  );
  const taxAmount = useMemo(() => (applyTax ? Math.round(subtotal * 0.11) : 0), [subtotal, applyTax]);
  const totalAmount = useMemo(
    () => Math.max(0, subtotal + taxAmount - discountAmount),
    [subtotal, taxAmount, discountAmount]
  );

  const numericCashGiven = parseFloat(cashGiven.replace(/[^0-9]/g, '')) || 0;
  const changeAmount = Math.max(0, numericCashGiven - totalAmount);
  const isCashSufficient = paymentMethod !== 'cash' || numericCashGiven >= totalAmount;

  // Add item to cart with feedback
  const handleAddToCart = (product: Product, isFromScanner: boolean = false) => {
    const currentQty = cart[product.id]?.quantity || 0;
    if (currentQty >= product.stock) {
      showToast(`Stok ${product.name} habis/maksimum (${product.stock})`, '⚠️');
      return;
    }

    setCart((prev) => ({
      ...prev,
      [product.id]: {
        product,
        quantity: Math.min((prev[product.id]?.quantity || 0) + 1, product.stock),
      },
    }));

    playBeep();
    showToast(`+1 ${product.name} dimasukkan ke keranjang`, product.imageIcon);

    if (isFromScanner) {
      setScanFlash(true);
      setTimeout(() => setScanFlash(false), 250);
      setScannedCountSession((c) => c + 1);
    }
  };
  // Scan SKU code
  const handleScanCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const product = products.find(
      (p) => p.code.toUpperCase() === trimmed || p.name.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (product) {
      handleAddToCart(product, true);
      setManualCodeInput('');
    } else {
      showToast(`Kode "${code}" tidak terdaftar dalam katalog!`, '❌');
    }
  };

  // Decrease quantity or remove item
  const handleDecreaseQty = (productId: number) => {
    setCart((prev) => {
      const current = prev[productId];
      if (!current) return prev;
      if (current.quantity > 1) {
        return {
          ...prev,
          [productId]: {
            ...current,
            quantity: current.quantity - 1,
          },
        };
      }
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  // Remove completely from cart
  const handleRemoveItem = (productId: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  // Clear entire cart
  const handleClearCart = () => {
    if (window.confirm('Kosongkan semua item di keranjang transaksi?')) {
      setCart({});
      showToast('Keranjang transaksi berhasil dikosongkan', '🗑️');
    }
  };

  // Quick cash buttons generator based on total
  const quickCashOptions = useMemo(() => {
    if (totalAmount === 0) return [];
    const options = new Set<number>();
    options.add(totalAmount); // Exact amount (Uang Pas)

    const denominations = [10000, 20000, 50000, 100000, 200000, 500000];
    for (const d of denominations) {
      if (d >= totalAmount) {
        options.add(d);
      }
    }
    const nextHigher = Math.ceil(totalAmount / 50000) * 50000;
    if (nextHigher > totalAmount) options.add(nextHigher);

    return Array.from(options).sort((a, b) => a - b).slice(0, 4);
  }, [totalAmount]);

  // Process checkout & open receipt modal
  const handleProcessPayment = async () => {
    if(processingRef.current || showReceiptModal || cartList.length===0)return;
    if(paymentMethod!=='cash' && !window.confirm('Konfirmasi pembayaran '+paymentMethod.toUpperCase()+' sudah diterima? Status ini dicatat manual, tanpa deteksi otomatis.'))return;
    processingRef.current=true;setProcessing(true);
    try {
      const result=await api<{sale:Sale}>(base+'/sales',{method:'POST',body:JSON.stringify({items:cartList.map(i=>({menu_id:i.product.id,quantity:i.quantity})),discount:discountAmount,tax:taxAmount,payment:{method:paymentMethod,received_amount:numericCashGiven}})});
      const sale=result.sale;
      setLastTransaction({id:'TRX-'+sale.id,date:new Date(sale.created_at).toLocaleString('id-ID'),items:[...cartList],subtotal:Number(sale.subtotal),tax:Number(sale.tax),discount:Number(sale.discount),total:Number(sale.total),paymentMethod:sale.payment.method,cashGiven:Number(sale.payment.received_amount),change:Number(sale.payment.change_amount)});
      setCart({});setShowReceiptModal(true);setIsMobileCartOpen(false);
      await refreshProducts().catch(()=>showToast('Transaksi tersimpan. Muat ulang halaman untuk memperbarui stok.','⚠️'));
    } catch(e){showToast(message(e),'⚠️');}finally{processingRef.current=false;setProcessing(false);}
  };

  // Reset after transaction complete
  const handleNewTransaction = () => {
    setCart({});
    setShowReceiptModal(false);
    setCashGiven('50000');
    setDiscountAmount(0);
    setApplyTax(false);
    showToast('Siap untuk transaksi pelanggan baru!', '✨');
  };

  return (
    <AppLayout title="Kasir POS" currentPath="/pos" onNavigate={onNavigate}>
      <div className="w-full space-y-4 relative">
        
        {/* Toast Notification Banner */}
        {loading && <p className="p-3">Memuat menu...</p>}
        {loadError && <p role="alert" className="p-3 text-red-600">{loadError}</p>}
        {!loading && !loadError && products.length===0 && <p className="p-3">Belum ada menu. Tambahkan menu dan resep melalui backend.</p>}
        {processing && <p role="status" className="p-3">Menyimpan transaksi...</p>}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none">
            <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700/70 flex items-center gap-2.5 text-xs font-semibold">
              <span className="text-base">{toastMessage.icon}</span>
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Top Header & Search Bar */}
        <div className="bg-[#057A55] text-white p-4 md:p-6 rounded-b-[24px] md:rounded-2xl shadow-md shadow-emerald-950/15">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-2xl font-extrabold tracking-tight text-white">
                  Kasir POS Digital
                </h1>
                <span className="px-2 py-0.5 bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-[10px] font-bold rounded-full">
                  ONLINE
                </span>
              </div>
              <p className="text-xs md:text-sm text-emerald-100/90 mt-0.5">
                Pilih menu cepat, scan barcode kamera, hitung kembalian, & cetak struk kasir
              </p>
            </div>

            {/* Search & Scanner Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex-1 md:w-72 flex items-center bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 text-white placeholder-emerald-200 text-xs md:text-sm">
                <Search size={16} className="text-emerald-200 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama barang atau kode SKU..."
                  className="bg-transparent border-none outline-none text-xs md:text-sm text-white placeholder-emerald-200/70 w-full"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-emerald-200 hover:text-white cursor-pointer">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Barcode Scanner Trigger Button -> Opens Barcode Scanner Modal */}
              <button
                type="button"
                onClick={() => {
                  setIsScanModalOpen(true);
                  setScannedCountSession(0);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-emerald-50 text-[#057A55] font-bold text-xs md:text-sm rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
                title="Buka Kamera Barcode Scanner"
              >
                <Barcode size={18} />
                <span className="hidden sm:inline">Scan Barcode</span>
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 no-scrollbar text-xs md:text-sm">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-white text-[#057A55] shadow-sm font-bold'
                    : 'bg-emerald-700/60 hover:bg-emerald-600/80 text-emerald-100 border border-emerald-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Left Products vs Right Cart Panel */}
        <div className="px-4 md:px-0 md:grid md:grid-cols-12 md:gap-6 pb-24 md:pb-6">
          
          {/* 1. LEFT PRODUCT GRID */}
          <div className="md:col-span-7 lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider">
                Katalog Produk ({filteredProducts.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Klik kartu untuk menambahkan ke struk
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs">
                <Store size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">Produk Tidak Ditemukan</p>
                <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian atau kategori lain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredProducts.map((product) => {
                  const inCartQty = cart[product.id]?.quantity || 0;
                  const isLowStock = product.stock <= 5;
                  const isOutOfStock = product.stock === 0;

                  return (
                    <div
                      key={product.id}
                      onClick={() => !isOutOfStock && handleAddToCart(product)}
                      className={`bg-white rounded-2xl p-3 md:p-4 border transition-all flex flex-col justify-between group relative select-none cursor-pointer ${
                        inCartQty > 0
                          ? 'border-[#057A55] ring-2 ring-[#057A55]/15 shadow-md'
                          : 'border-slate-100 hover:border-slate-300 shadow-xs hover:shadow-md'
                      } ${isOutOfStock ? 'opacity-60 bg-slate-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                    >
                      {/* Top Header Badge */}
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <span className="text-2xl md:text-3xl p-1.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                          {product.imageIcon}
                        </span>
                        <div className="flex flex-col items-end gap-1">
                          {product.badge && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                              {product.badge}
                            </span>
                          )}
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              isOutOfStock
                                ? 'bg-rose-100 text-rose-700'
                                : isLowStock
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isOutOfStock ? 'Habis' : `Sisa ${product.stock}`}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                          {product.category} • {product.code}
                        </span>
                        <h3 className="text-xs md:text-sm font-bold text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                          {product.name}
                        </h3>
                        <div className="text-xs md:text-sm font-extrabold text-[#057A55] mt-1.5">
                          Rp {product.price.toLocaleString('id-ID')}
                          <span className="text-[10px] font-normal text-slate-400 ml-1">/{product.unit}</span>
                        </div>
                      </div>

                      {/* Add or Adjust Quantity Button */}
                      <div className="mt-3 pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                        {inCartQty > 0 ? (
                          <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => handleDecreaseQty(product.id)}
                              className="w-7 h-7 rounded-lg bg-white text-[#057A55] shadow-xs flex items-center justify-center font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer active:scale-90"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-xs font-extrabold text-[#057A55]">
                              {inCartQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product)}
                              disabled={inCartQty >= product.stock}
                              className="w-7 h-7 rounded-lg bg-[#057A55] text-white shadow-xs flex items-center justify-center font-bold hover:bg-[#046c4e] transition-colors cursor-pointer active:scale-90 disabled:opacity-50"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            disabled={isOutOfStock}
                            className="w-full py-2 px-2.5 bg-slate-100 hover:bg-[#057A55] hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={14} />
                            <span>Tambah</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. RIGHT CART & CHECKOUT PANEL (Always visible on Desktop) */}
          <div className="hidden md:block md:col-span-5 lg:col-span-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm sticky top-4 space-y-4">
              
              {/* Cart Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#057A55] flex items-center justify-center">
                    <ShoppingBag size={17} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Keranjang Kasir</h2>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {totalItemsCount} item dipilih
                    </span>
                  </div>
                </div>

                {cartList.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Hapus Semua</span>
                  </button>
                )}
              </div>

              {/* Cart Items Scrollable List */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {cartList.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <ShoppingBag size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-medium">Keranjang transaksi kosong</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Pilih produk dari katalog atau scan barcode</p>
                  </div>
                ) : (
                  cartList.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                          {product.name}
                        </h4>
                        <span className="text-[11px] font-semibold text-[#057A55]">
                          Rp {(product.price * quantity).toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          (@Rp {product.price.toLocaleString('id-ID')})
                        </span>
                      </div>

                      {/* Qty controller */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleDecreaseQty(product.id)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-bold text-slate-800 px-1">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          disabled={quantity >= product.stock}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#057A55] hover:bg-emerald-50 font-bold cursor-pointer disabled:opacity-40"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(product.id)}
                          className="w-6 h-6 rounded flex items-center justify-center text-rose-500 hover:bg-rose-50 ml-0.5 cursor-pointer"
                          title="Hapus item"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Transaction Calculation Summary */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Tax & Discount Quick Toggles */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyTax}
                      onChange={(e) => setApplyTax(e.target.checked)}
                      className="w-3.5 h-3.5 text-[#057A55] rounded cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-500">PPN 11%</span>
                  </label>
                  {applyTax && (
                    <span className="font-semibold text-slate-800">
                      +Rp {taxAmount.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>

                {/* Total Payment Highlight */}
                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Total Bayar
                    </span>
                    <span className="text-[10px] text-slate-400">Sudah termasuk diskon & pajak</span>
                  </div>
                  <span className="text-xl font-extrabold text-[#057A55]">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-50 border-[#057A55] text-[#057A55] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote size={16} />
                    <span className="text-[11px]">Tunai</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'bg-emerald-50 border-[#057A55] text-[#057A55] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode size={16} />
                    <span className="text-[11px]">QRIS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'transfer'
                        ? 'bg-emerald-50 border-[#057A55] text-[#057A55] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 size={16} />
                    <span className="text-[11px]">Transfer</span>
                  </button>
                </div>

                {/* Cash Options if Cash Selected */}
                {paymentMethod === 'cash' && totalAmount > 0 && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Uang Diterima:</span>
                      <div className="relative w-36">
                        <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">Rp</span>
                        <input
                          type="text"
                          value={cashGiven}
                          onChange={(e) => setCashGiven(e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 text-right focus:ring-1 focus:ring-[#057A55] focus:border-[#057A55] outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Denominations */}
                    <div className="flex items-center gap-1 overflow-x-auto pt-1">
                      {quickCashOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setCashGiven(String(opt))}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors shrink-0 cursor-pointer ${
                            numericCashGiven === opt
                              ? 'bg-[#057A55] text-white border-[#057A55]'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {opt === totalAmount ? 'Uang Pas' : `Rp ${opt.toLocaleString('id-ID')}`}
                        </button>
                      ))}
                    </div>

                    {/* Change Calculation */}
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">Kembalian:</span>
                      <span
                        className={`font-extrabold ${
                          isCashSufficient ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {isCashSufficient
                          ? `Rp ${changeAmount.toLocaleString('id-ID')}`
                          : 'Uang Kurang!'}
                      </span>
                    </div>
                  </div>
                )}

                {/* QRIS / Transfer Preview */}
                {paymentMethod === 'qris' && totalAmount > 0 && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1 mt-2">
                    <QrCode size={36} className="mx-auto text-[#057A55]" />
                    <p className="text-xs font-bold text-[#057A55]">QRIS — Konfirmasi Manual</p>
                    <p className="text-[10px] text-emerald-700">Gunakan QRIS toko Anda; aplikasi belum mendeteksi pembayaran otomatis.</p>
                  </div>
                )}
              </div>

              {/* Checkout Submit Button */}
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={processing || cartList.length === 0 || !isCashSufficient}
                className="w-full py-3.5 px-4 bg-[#057A55] hover:bg-[#046c4e] active:bg-[#03543f] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <CheckCircle2 size={18} />
                <span>Bayar Sekarang & Cetak Struk</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. MOBILE FLOATING CART BAR (< md) */}
        {totalItemsCount > 0 && (
          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-40 md:hidden">
            <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl flex items-center justify-between border border-slate-700/80">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                  {totalItemsCount} item dipilih
                </span>
                <span className="text-base font-extrabold text-emerald-400 truncate block">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileCartOpen(true)}
                className="px-4 py-2 bg-[#057A55] hover:bg-[#046c4e] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
              >
                <span>Lihat Keranjang</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* 4. MOBILE SLIDE-OVER CART DRAWER (< md) */}
        {isMobileCartOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end md:hidden">
            <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#057A55]" />
                  <h3 className="font-bold text-base text-slate-900">Keranjang Kasir</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    {totalItemsCount}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileCartOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 bg-slate-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {cartList.map(({ product, quantity }) => (
                  <div key={product.id} className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-800 truncate">{product.name}</div>
                      <div className="text-emerald-700 font-bold">
                        Rp {(product.price * quantity).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDecreaseQty(product.id)} className="w-6 h-6 rounded bg-white font-bold flex items-center justify-center border text-slate-700 cursor-pointer">
                        <Minus size={11} />
                      </button>
                      <span className="font-bold">{quantity}</span>
                      <button onClick={() => handleAddToCart(product)} className="w-6 h-6 rounded bg-[#057A55] text-white font-bold flex items-center justify-center cursor-pointer">
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculation & Payment method */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500 font-bold uppercase">Total Tagihan</span>
                  <span className="text-lg font-extrabold text-[#057A55]">Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>

                {/* Quick Payment Mode Selector */}
                <div className="grid grid-cols-3 gap-1.5 text-xs font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 rounded-xl border flex items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'cash' ? 'bg-emerald-50 border-[#057A55] text-[#057A55]' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Banknote size={14} />
                    <span>Tunai</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`py-2 rounded-xl border flex items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'qris' ? 'bg-emerald-50 border-[#057A55] text-[#057A55]' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <QrCode size={14} />
                    <span>QRIS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`py-2 rounded-xl border flex items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'transfer' ? 'bg-emerald-50 border-[#057A55] text-[#057A55]' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Building2 size={14} />
                    <span>Bank</span>
                  </button>
                </div>
              </div>

              {/* Mobile Checkout Button */}
              <button
                type="button"
                onClick={handleProcessPayment}
                className="w-full py-3 bg-[#057A55] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <CheckCircle2 size={17} />
                <span>Bayar Sekarang & Cetak Struk</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. BARCODE SCANNER MODAL (Camera Viewfinder + Manual Input + Rapid Multi-Scan Simulation) */}
        {isScanModalOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6 relative">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Camera size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-tight">Kamera Barcode Scanner</h3>
                    <p className="text-[11px] text-slate-400">Arahkan barcode produk ke dalam kotak target</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsScanModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Simulated Camera Viewfinder */}
              <div
                className={`relative w-full h-52 bg-slate-950 rounded-2xl border-2 overflow-hidden flex flex-col items-center justify-center transition-all duration-300 ${
                  scanFlash
                    ? 'border-emerald-400 bg-emerald-950/40 ring-4 ring-emerald-500/30'
                    : 'border-slate-700/80'
                }`}
              >
                {/* 4 Camera Corner Brackets */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-md" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-md" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-md" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-md" />

                {/* Laser Scanning Line Animation */}
                <div
                  className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse"
                  style={{
                    animation: 'scanLaser 2s ease-in-out infinite alternate',
                  }}
                />

                {/* Mockup Barcode Graphics in Viewfinder */}
                <div className="flex flex-col items-center gap-2 opacity-80 select-none pointer-events-none">
                  <div className="flex items-center gap-1 py-1 px-3 bg-white/10 rounded-lg backdrop-blur-xs">
                    <Barcode size={36} className="text-emerald-300" />
                    <span className="text-xs font-mono font-bold tracking-widest text-emerald-200">
                      |||||| |||| ||
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Volume2 size={11} className="text-emerald-400" />
                    Auto-beep aktif saat scan berhasil
                  </span>
                </div>

                {/* Session Scanned Items Counter Tag */}
                {scannedCountSession > 0 && (
                  <div className="absolute top-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                    ⚡ {scannedCountSession} item berhasil di-scan
                  </div>
                )}
              </div>

              {/* Manual Barcode / SKU Code Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>Input Kode Barcode / SKU Manual:</span>
                  <span className="text-slate-500">Contoh: KOP-001</span>
                </label>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (manualCodeInput) handleScanCode(manualCodeInput);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={manualCodeInput}
                    onChange={(e) => setManualCodeInput(e.target.value)}
                    placeholder="Ketik kode (misal: MIN-002)..."
                    className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-xs uppercase font-mono tracking-wider placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    + Input
                  </button>
                </form>
              </div>

              {/* Rapid Multi-Scan Simulated Barcode Buttons */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Simulasi Cepat Scan Barcode Produk (Multi-Scan):
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {products.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddToCart(item, true)}
                      className="p-2 bg-slate-800/90 hover:bg-emerald-900/40 hover:border-emerald-500 border border-slate-700/80 rounded-xl text-left transition-all flex items-center gap-2 group cursor-pointer active:scale-95"
                    >
                      <span className="text-lg shrink-0 p-1 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform">
                        {item.imageIcon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-200 group-hover:text-emerald-300 truncate text-[11px]">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.code} • Rp {item.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Total Keranjang: <strong className="text-emerald-400">{totalItemsCount} item</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsScanModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. SUCCESS RECEIPT POPUP MODAL */}
        {showReceiptModal && lastTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
              
              {/* Modal Top Notification */}
              <div className="bg-[#057A55] text-white p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-white text-[#057A55] mx-auto flex items-center justify-center shadow-md mb-2">
                  <CheckCircle2 size={28} className="text-[#057A55]" />
                </div>
                <h3 className="text-base font-bold">Pembayaran Berhasil!</h3>
                <p className="text-xs text-emerald-100/90 mt-0.5">Transaksi telah tercatat di sistem POS</p>
              </div>

              {/* Thermal Paper Receipt Look */}
              <div className="p-5 font-mono text-xs bg-slate-50 space-y-3 border-y border-dashed border-slate-200">
                <div className="text-center border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-sm text-slate-800">WARUNG BERKAH JAYA</h4>
                  <p className="text-[10px] text-slate-500">Jl. Melati No. 42, Jakarta</p>
                  <p className="text-[10px] text-slate-500">WA: 0812-3456-7890</p>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                    <span>{lastTransaction.id}</span>
                    <span>{lastTransaction.date}</span>
                  </div>
                </div>

                {/* Itemized list */}
                <div className="space-y-1.5 border-b border-slate-200 pb-2">
                  {lastTransaction.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between items-start text-[11px]">
                      <div className="pr-2">
                        <div className="font-semibold text-slate-800">{product.name}</div>
                        <div className="text-slate-400 text-[10px]">
                          {quantity} x Rp {product.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="font-bold text-slate-800">
                        Rp {(product.price * quantity).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-1 text-[11px] pt-1 border-b border-slate-200 pb-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>Rp {lastTransaction.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  {lastTransaction.tax > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>PPN (11%):</span>
                      <span>Rp {lastTransaction.tax.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 text-xs pt-1 border-t border-slate-200">
                    <span>TOTAL:</span>
                    <span className="text-[#057A55]">Rp {lastTransaction.total.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-1 text-[10px]">
                    <span>Metode:</span>
                    <span>{lastTransaction.paymentMethod}</span>
                  </div>
                  {lastTransaction.cashGiven > 0 && (
                    <>
                      <div className="flex justify-between text-slate-600 text-[10px]">
                        <span>Bayar:</span>
                        <span>Rp {lastTransaction.cashGiven.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                        <span>Kembalian:</span>
                        <span>Rp {lastTransaction.change.toLocaleString('id-ID')}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-center text-[10px] text-slate-400 pt-1">
                  *** Terima Kasih Telah Berbelanja! ***
                </div>
              </div>

              {/* Receipt Modal Footer Actions */}
              <div className="p-4 bg-white space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer size={15} />
                    <span>Cetak Struk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { const text = [lastTransaction.id, ...lastTransaction.items.map(i=>i.product.name+' x'+i.quantity), 'Total: Rp '+lastTransaction.total, 'Metode: '+lastTransaction.paymentMethod].join('\n'); if(navigator.share) void navigator.share({title:'Struk',text}).catch(()=>{}); else void navigator.clipboard.writeText(text).then(()=>showToast('Struk disalin.')).catch(()=>showToast('Tidak dapat menyalin struk.')); }}
                    className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#057A55] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 size={15} />
                    <span>Kirim WA</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleNewTransaction}
                  className="w-full py-3 bg-[#057A55] hover:bg-[#046c4e] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <RotateCcw size={15} />
                  <span>Transaksi Baru</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default Pos;
