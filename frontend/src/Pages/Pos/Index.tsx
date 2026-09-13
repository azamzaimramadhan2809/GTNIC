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
  Volume2,
  UserCheck,
  UserPlus,
  Crown,
  Award,
  Medal,
  Phone,
  ChevronDown,
  FileText,
  WifiOff,
  RefreshCw
} from 'lucide-react';

export interface PosProps {
  onNavigate?: (path: string) => void;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  category: 'Sembako' | 'Minuman' | 'Makanan' | 'Rokok' | 'Snack';
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

// Lightweight customer type for POS lookup
export interface PosCustomer {
  id: string;
  name: string;
  phone: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  points: number;
  avatarBg: string;
  avatarText: string;
  unpaidDebt?: number;
}

const POS_CUSTOMERS_INIT: PosCustomer[] = [
  { id: 'CUST-001', name: 'Ibu Ratna Sari',       phone: '0812-3456-7890', tier: 'Gold',   points: 380, avatarBg: 'bg-amber-100',   avatarText: 'text-amber-800',   unpaidDebt: 0 },
  { id: 'CUST-002', name: 'Pak Hendra Gunawan',    phone: '0813-8899-2211', tier: 'Gold',   points: 295, avatarBg: 'bg-emerald-100', avatarText: 'text-emerald-800', unpaidDebt: 35000 },
  { id: 'CUST-003', name: 'Mbak Dewi Anggraini',   phone: '0856-1122-3344', tier: 'Silver', points: 160, avatarBg: 'bg-indigo-100',  avatarText: 'text-indigo-800',  unpaidDebt: 0 },
  { id: 'CUST-004', name: 'Pak Bambang Santoso',   phone: '0818-5544-3322', tier: 'Silver', points: 145, avatarBg: 'bg-blue-100',    avatarText: 'text-blue-800',    unpaidDebt: 20000 },
  { id: 'CUST-005', name: 'Hj. Fatimah Zahra',     phone: '0821-9988-7766', tier: 'Gold',   points: 520, avatarBg: 'bg-rose-100',    avatarText: 'text-rose-800',    unpaidDebt: 0 },
  { id: 'CUST-006', name: 'Bu Sari Wahyuni',        phone: '0857-1234-5678', tier: 'Bronze', points: 75,  avatarBg: 'bg-orange-100',  avatarText: 'text-orange-800',  unpaidDebt: 15000 },
  { id: 'CUST-007', name: 'Mas Riko Pratama',       phone: '0878-4444-5555', tier: 'Bronze', points: 40,  avatarBg: 'bg-purple-100',  avatarText: 'text-purple-800',  unpaidDebt: 0 },
];

const TIER_ICON = {
  Gold:   Crown,
  Silver: Award,
  Bronze: Medal,
};

const TIER_COLOR: Record<'Gold' | 'Silver' | 'Bronze', string> = {
  Gold:   'bg-amber-100 text-amber-700 border-amber-300',
  Silver: 'bg-slate-100 text-slate-600 border-slate-300',
  Bronze: 'bg-orange-100 text-orange-700 border-orange-300',
};

const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    code: 'KOP-001',
    name: 'Kopi Susu Gula Aren',
    category: 'Minuman',
    price: 15000,
    stock: 45,
    unit: 'cup',
    imageIcon: '☕',
    badge: 'Best Seller',
  },
  {
    id: 2,
    code: 'MIN-002',
    name: 'Minyak Goreng Sania 2L',
    category: 'Sembako',
    price: 36500,
    stock: 2, // Low stock
    unit: 'pouch',
    imageIcon: '🌻',
    badge: 'Stok Kritis',
  },
  {
    id: 3,
    code: 'BER-003',
    name: 'Beras Ramos Super 5kg',
    category: 'Sembako',
    price: 75000,
    stock: 3, // Low stock
    unit: 'karung',
    imageIcon: '🌾',
  },
  {
    id: 4,
    code: 'IND-004',
    name: 'Indomie Goreng + Telur',
    category: 'Makanan',
    price: 15000,
    stock: 60,
    unit: 'porsi',
    imageIcon: '🍜',
    badge: 'Favorit',
  },
  {
    id: 5,
    code: 'TEL-005',
    name: 'Telur Ayam Negeri 1kg',
    category: 'Sembako',
    price: 29000,
    stock: 4, // Low stock
    unit: 'kg',
    imageIcon: '🥚',
  },
  {
    id: 6,
    code: 'ROK-006',
    name: 'Rokok Gudang Garam Surya 16',
    category: 'Rokok',
    price: 35000,
    stock: 24,
    unit: 'bungkus',
    imageIcon: '🚬',
  },
  {
    id: 7,
    code: 'TEH-007',
    name: 'Es Teh Manis Jumbo',
    category: 'Minuman',
    price: 6000,
    stock: 80,
    unit: 'cup',
    imageIcon: '🧊',
  },
  {
    id: 8,
    code: 'ROT-008',
    name: 'Roti Bakar Coklat Keju',
    category: 'Makanan',
    price: 18000,
    stock: 20,
    unit: 'porsi',
    imageIcon: '🍞',
  },
  {
    id: 9,
    code: 'GUL-009',
    name: 'Gula Pasir Gulaku 1kg',
    category: 'Sembako',
    price: 18500,
    stock: 5,
    unit: 'pack',
    imageIcon: '🍬',
  },
  {
    id: 10,
    code: 'MIN-010',
    name: 'Air Mineral Le Minerale 600ml',
    category: 'Minuman',
    price: 4000,
    stock: 96,
    unit: 'botol',
    imageIcon: '💧',
  },
  {
    id: 11,
    code: 'SNK-011',
    name: 'Chitato Sapi Panggang 68g',
    category: 'Snack',
    price: 11500,
    stock: 18,
    unit: 'bungkus',
    imageIcon: '🥔',
  },
  {
    id: 12,
    code: 'ROK-012',
    name: 'Sampoerna A Mild 16',
    category: 'Rokok',
    price: 36000,
    stock: 30,
    unit: 'bungkus',
    imageIcon: '🚬',
  },
];

const CATEGORIES = ['Semua', 'Sembako', 'Minuman', 'Makanan', 'Rokok', 'Snack'];

// Web Audio API Beep Synthesizer for POS feedback
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
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<Record<number, CartItem>>({
    1: { product: PRODUCTS_DATA[0], quantity: 2 },
    4: { product: PRODUCTS_DATA[3], quantity: 1 },
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'transfer' | 'kasbon'>('cash');
  const [cashGiven, setCashGiven] = useState<string>('50000');
  const [applyTax, setApplyTax] = useState<boolean>(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // ── Offline-Ready State & Sync Queue ───────────────────────────────────────
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return !navigator.onLine;
    }
    return false;
  });

  const [pendingOfflineQueue, setPendingOfflineQueue] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('warung_offline_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  // Barcode Scanner Modal State
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [manualCodeInput, setManualCodeInput] = useState<string>('');
  const [scanFlash, setScanFlash] = useState<boolean>(false);
  const [scannedCountSession, setScannedCountSession] = useState<number>(0);

  // ── Customer Lookup & Quick Add State ──────────────────────────────────────
  const [posCustomers, setPosCustomers] = useState<PosCustomer[]>(POS_CUSTOMERS_INIT);
  const [customerQuery, setCustomerQuery] = useState<string>('');
  const [showCustomerDrop, setShowCustomerDrop] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<PosCustomer | null>(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState<boolean>(false);
  const [qaName, setQaName] = useState<string>('');
  const [qaPhone, setQaPhone] = useState<string>('');
  const [qaSubmitting, setQaSubmitting] = useState<boolean>(false);
  const customerInputRef = useRef<HTMLInputElement>(null);
  const customerDropRef  = useRef<HTMLDivElement>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; icon: string; id: number } | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (text: string, icon: string = '✅') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage({ text, icon, id: Date.now() });
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Listen to browser network changes for Offline-Ready feature
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      showToast('Koneksi internet pulih: Sistem Online', '🌐');
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast('Koneksi terputus: Beralih ke Mode Offline (Tersimpan Lokal)', '⚠️');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Toggle offline mode simulation
  const toggleOfflineMode = () => {
    setIsOffline(prev => {
      const next = !prev;
      if (next) {
        showToast('Mode Offline diaktifkan (Simulasi: Transaksi tersimpan lokal)', '⚡');
      } else {
        showToast('Mode Online diaktifkan (Sistem terhubung)', '🌐');
      }
      return next;
    });
  };

  // Sync offline queue
  const handleSyncOfflineQueue = () => {
    if (pendingOfflineQueue.length === 0) {
      showToast('Tidak ada antrean transaksi offline untuk disinkronkan', 'ℹ️');
      return;
    }

    setIsSyncing(true);
    showToast(`Menyinkronkan ${pendingOfflineQueue.length} transaksi offline ke server...`, '🔄');

    setTimeout(() => {
      const count = pendingOfflineQueue.length;
      localStorage.removeItem('warung_offline_queue');
      setPendingOfflineQueue([]);
      setIsSyncing(false);
      showToast(`Sukses! ${count} transaksi offline berhasil disinkronkan ke server.`, '✅');
    }, 850);
  };

  // Payment Method selector with Kas Bon validation
  const handleSelectPaymentMethod = (method: 'cash' | 'qris' | 'transfer' | 'kasbon') => {
    if (method === 'kasbon' && !selectedCustomer) {
      showToast('Pilih pelanggan terlebih dahulu untuk transaksi Kas Bon', '⚠️');
      customerInputRef.current?.focus();
      setShowCustomerDrop(true);
      return;
    }
    setPaymentMethod(method);
  };

  // Close customer dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        customerDropRef.current && !customerDropRef.current.contains(e.target as Node) &&
        customerInputRef.current && !customerInputRef.current.contains(e.target as Node)
      ) {
        setShowCustomerDrop(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Derived customer search results
  const customerResults = useMemo(() => {
    const q = customerQuery.trim().toLowerCase();
    if (!q) return posCustomers.slice(0, 5);
    return posCustomers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.replace(/-/g, '').includes(q.replace(/-/g, ''))
    );
  }, [customerQuery, posCustomers]);

  const handleSelectCustomer = (c: PosCustomer) => {
    setSelectedCustomer(c);
    setCustomerQuery(c.name);
    setShowCustomerDrop(false);
    const debtInfo = c.unpaidDebt ? ` • Utang: Rp ${c.unpaidDebt.toLocaleString('id-ID')}` : '';
    showToast(`Pelanggan "${c.name}" (${c.points} Poin${debtInfo}) dipilih`, '👤');
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setCustomerQuery('');
    if (paymentMethod === 'kasbon') {
      setPaymentMethod('cash');
      showToast('Metode bayar dialihkan ke Tunai karena pelanggan dihapus', 'ℹ️');
    }
    customerInputRef.current?.focus();
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaName.trim() || !qaPhone.trim()) return;
    setQaSubmitting(true);
    setTimeout(() => {
      const colors = [
        { bg: 'bg-emerald-100', text: 'text-emerald-800' },
        { bg: 'bg-indigo-100',  text: 'text-indigo-800'  },
        { bg: 'bg-blue-100',    text: 'text-blue-800'    },
        { bg: 'bg-purple-100',  text: 'text-purple-800'  },
      ];
      const clr = colors[Math.floor(Math.random() * colors.length)];
      const newC: PosCustomer = {
        id: `CUST-${String(posCustomers.length + 1).padStart(3, '0')}`,
        name:      qaName.trim(),
        phone:     qaPhone.trim(),
        tier:      'Bronze',
        points:    25,
        avatarBg:  clr.bg,
        avatarText: clr.text,
        unpaidDebt: 0,
      };
      setPosCustomers(prev => [newC, ...prev]);
      handleSelectCustomer(newC);
      setShowQuickAddModal(false);
      setQaName('');
      setQaPhone('');
      setQaSubmitting(false);
      showToast(`Pelanggan baru "${newC.name}" berhasil didaftarkan! (+25 Poin)`, '🎉');
    }, 600);
  };

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
    customer?: PosCustomer | null;
    isKasBon?: boolean;
    isOffline?: boolean;
    prevDebt?: number;
    newDebt?: number;
  } | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((item) => {
      const matchCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

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
    setCart((prev) => {
      const currentQty = prev[product.id]?.quantity || 0;
      if (currentQty >= product.stock) {
        showToast(`Stok ${product.name} habis/maksimum (${product.stock})`, '⚠️');
        return prev;
      }

      playBeep();
      showToast(`+1 ${product.name} dimasukkan ke keranjang`, product.imageIcon);

      if (isFromScanner) {
        setScanFlash(true);
        setTimeout(() => setScanFlash(false), 250);
        setScannedCountSession((c) => c + 1);
      }

      return {
        ...prev,
        [product.id]: {
          product,
          quantity: currentQty + 1,
        },
      };
    });
  };

  // Scan SKU code
  const handleScanCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const product = PRODUCTS_DATA.find(
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
  const handleProcessPayment = () => {
    if (cartList.length === 0) {
      alert('Keranjang belanja masih kosong!');
      return;
    }
    if (paymentMethod === 'cash' && numericCashGiven < totalAmount) {
      alert('Uang tunai yang diterima kurang dari total tagihan!');
      return;
    }
    if (paymentMethod === 'kasbon' && !selectedCustomer) {
      showToast('Pilih pelanggan terlebih dahulu untuk transaksi Kas Bon', '⚠️');
      customerInputRef.current?.focus();
      setShowCustomerDrop(true);
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const trxId = `TRX-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    let prevDebt = 0;
    let newDebt = 0;
    if (paymentMethod === 'kasbon' && selectedCustomer) {
      prevDebt = selectedCustomer.unpaidDebt || 0;
      newDebt = prevDebt + totalAmount;
      // Record purchase total into customer's unpaid balance
      setPosCustomers(prev =>
        prev.map(c => (c.id === selectedCustomer.id ? { ...c, unpaidDebt: newDebt } : c))
      );
      setSelectedCustomer(prev => (prev ? { ...prev, unpaidDebt: newDebt } : null));
    }

    const transaction = {
      id: trxId,
      date: dateStr,
      items: [...cartList],
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total: totalAmount,
      paymentMethod:
        paymentMethod === 'cash'
          ? 'Tunai (Cash)'
          : paymentMethod === 'qris'
          ? 'QRIS GoPay / OVO'
          : paymentMethod === 'transfer'
          ? 'Transfer Bank'
          : 'Kas Bon / Utang',
      cashGiven: paymentMethod === 'cash' ? numericCashGiven : totalAmount,
      change: paymentMethod === 'cash' ? changeAmount : 0,
      customer: selectedCustomer,
      isKasBon: paymentMethod === 'kasbon',
      isOffline,
      prevDebt,
      newDebt,
    };

    if (isOffline) {
      const updatedQueue = [...pendingOfflineQueue, transaction];
      setPendingOfflineQueue(updatedQueue);
      try {
        localStorage.setItem('warung_offline_queue', JSON.stringify(updatedQueue));
      } catch (err) {
        console.error('Failed to save offline queue', err);
      }
      showToast(`Mode Offline: Transaksi tersimpan lokal (Antrean #${updatedQueue.length})`, '💾');
    } else if (paymentMethod === 'kasbon') {
      showToast(`Kas Bon Rp ${totalAmount.toLocaleString('id-ID')} dicatat ke utang ${selectedCustomer?.name}`, '📋');
    }

    setLastTransaction(transaction);
    setShowReceiptModal(true);
    setIsMobileCartOpen(false);
  };

  // Generate WhatsApp formatted plain text receipt
  const generateWhatsAppReceiptText = (trx: typeof lastTransaction) => {
    if (!trx) return '';
    const divider = '━━━━━━━━━━━━━━━━━━━━━━━━';
    const storeName = 'WARUNG BERKAH JAYA';
    const customerInfo = trx.customer
      ? `Pelanggan: ${trx.customer.name} (${trx.customer.tier} Member)`
      : 'Pelanggan: Pembeli Umum';

    const itemsText = trx.items
      .map(
        it =>
          `• ${it.quantity}x ${it.product.name}\n  @ Rp ${it.product.price.toLocaleString('id-ID')} = Rp ${(
            it.product.price * it.quantity
          ).toLocaleString('id-ID')}`
      )
      .join('\n');

    let paymentInfo = `Metode Bayar: *${trx.paymentMethod}*`;
    if (trx.isKasBon && trx.customer) {
      paymentInfo += `\n*STATUS: DICATAT SEBAGAI KAS BON / UTANG*\nUtang Sebelumnya: Rp ${(trx.prevDebt || 0).toLocaleString('id-ID')}\nTotal Utang Akumulasi: Rp ${(trx.newDebt || 0).toLocaleString('id-ID')}`;
    } else if (trx.cashGiven > 0 && trx.paymentMethod.includes('Tunai')) {
      paymentInfo += `\nUang Diterima: Rp ${trx.cashGiven.toLocaleString('id-ID')}\nKembalian: Rp ${trx.change.toLocaleString('id-ID')}`;
    }

    const offlineNote = trx.isOffline ? '\n[Status: Tersimpan Lokal / Mode Offline]' : '';

    return `🧾 *STRUK BELANJA - ${storeName}*${offlineNote}
${divider}
No. Transaksi : ${trx.id}
Waktu         : ${trx.date}
${customerInfo}
${divider}
*Daftar Belanja:*
${itemsText}
${divider}
Subtotal      : Rp ${trx.subtotal.toLocaleString('id-ID')}${
      trx.tax > 0 ? `\nPPN (11%)     : Rp ${trx.tax.toLocaleString('id-ID')}` : ''
    }${
      trx.discount > 0 ? `\nDiskon        : -Rp ${trx.discount.toLocaleString('id-ID')}` : ''
    }
*TOTAL BAYAR   : Rp ${trx.total.toLocaleString('id-ID')}*

${paymentInfo}
${divider}
Terima kasih telah berbelanja di Warung Berkah Jaya! 🙏✨
Simpan struk digital ini sebagai bukti transaksi Anda.`;
  };

  const handleSendWhatsAppReceipt = () => {
    if (!lastTransaction) return;
    const text = generateWhatsAppReceiptText(lastTransaction);
    let phone = '';
    if (lastTransaction.customer?.phone) {
      phone = lastTransaction.customer.phone.replace(/[^0-9]/g, '');
      if (phone.startsWith('0')) {
        phone = '62' + phone.substring(1);
      }
    }

    const waUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(waUrl, '_blank');
    showToast('Membuka WhatsApp untuk mengirim struk digital...', '💬');
  };

  const handlePrintReceipt = () => {
    showToast('Membuka dialog cetak struk kasir...', '🖨️');
    window.print();
  };

  // Reset after transaction complete
  const handleNewTransaction = () => {
    setCart({});
    setShowReceiptModal(false);
    setCashGiven('50000');
    setDiscountAmount(0);
    setApplyTax(false);
    setSelectedCustomer(null);
    setCustomerQuery('');
    showToast('Siap untuk transaksi pelanggan baru!', '✨');
  };

  // Helper: get initials from full name
  const getInitials = (name: string) =>
    name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';

  return (
    <AppLayout title="Kasir POS" currentPath="/pos" onNavigate={onNavigate}>
      <div className="w-full space-y-4 relative">
        
        {/* Toast Notification Banner */}
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
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-2xl font-extrabold tracking-tight text-white">
                  Kasir POS Digital
                </h1>

                {/* Offline-Ready Status Indicator */}
                <button
                  type="button"
                  onClick={toggleOfflineMode}
                  title="Klik untuk mengubah simulasi status online / offline"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border cursor-pointer ${
                    isOffline
                      ? 'bg-amber-400/25 border-amber-300/60 text-amber-200 hover:bg-amber-400/35'
                      : 'bg-emerald-400/20 border-emerald-300/40 text-emerald-100 hover:bg-emerald-400/30'
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isOffline ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        isOffline ? 'bg-amber-400' : 'bg-emerald-300'
                      }`}
                    />
                  </span>
                  <span>{isOffline ? 'Mode Offline (Tersimpan Lokal)' : 'Sistem Online'}</span>
                </button>

                {/* Pending Sync Count Badge */}
                {pendingOfflineQueue.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSyncOfflineQueue}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-[#057A55] border border-white/70 shadow-xs hover:bg-emerald-50 transition-all cursor-pointer animate-pulse"
                    title="Klik untuk sinkronisasi antrean offline ke server"
                  >
                    <RefreshCw size={11} className={isSyncing ? 'animate-spin' : ''} />
                    <span>Pending Sync ({pendingOfflineQueue.length})</span>
                  </button>
                )}
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

              {/* ── Customer Search Input ────────────────────────────── */}
              <div className="relative">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Pelanggan
                </label>

                {selectedCustomer ? (
                  /* Selected Customer Chip */
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${selectedCustomer.avatarBg} ${selectedCustomer.avatarText}`}>
                      {getInitials(selectedCustomer.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{selectedCustomer.name}</div>
                      <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                        {(() => { const TierIcon = TIER_ICON[selectedCustomer.tier]; return <TierIcon size={10} className="shrink-0" />; })()}
                        <span className={`text-[10px] font-bold px-1.5 py-0 rounded-full border ${TIER_COLOR[selectedCustomer.tier]}`}>
                          {selectedCustomer.tier}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold">{selectedCustomer.points} Poin</span>
                        {selectedCustomer.unpaidDebt ? (
                          <span className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-200 px-1.5 py-0 rounded-md">
                            Utang: Rp {selectedCustomer.unpaidDebt.toLocaleString('id-ID')}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <button type="button" onClick={handleClearCustomer} className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  /* Search Input */
                  <div className="relative">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 gap-2 focus-within:border-[#057A55] focus-within:ring-1 focus-within:ring-[#057A55]/30 transition-all">
                      <UserCheck size={14} className="text-slate-400 shrink-0" />
                      <input
                        ref={customerInputRef}
                        type="text"
                        value={customerQuery}
                        onChange={e => { setCustomerQuery(e.target.value); setShowCustomerDrop(true); }}
                        onFocus={() => setShowCustomerDrop(true)}
                        placeholder="Cari nama / no. WhatsApp..."
                        className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none min-w-0"
                      />
                      {customerQuery && (
                        <button type="button" onClick={() => setCustomerQuery('')} className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0">
                          <X size={12} />
                        </button>
                      )}
                      <ChevronDown size={13} className="text-slate-300 shrink-0" />
                    </div>

                    {/* Dropdown */}
                    {showCustomerDrop && (
                      <div ref={customerDropRef} className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
                        {customerResults.length > 0 ? (
                          <ul className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                            {customerResults.map(c => (
                              <li key={c.id}>
                                <button
                                  type="button"
                                  onMouseDown={() => handleSelectCustomer(c)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-emerald-50 transition-colors text-left cursor-pointer"
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${c.avatarBg} ${c.avatarText}`}>
                                    {getInitials(c.name)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-slate-900 truncate">{c.name}</div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <Phone size={9} className="text-slate-400" />
                                      <span className="text-[10px] text-slate-500">{c.phone}</span>
                                      <span className={`text-[9px] font-bold px-1 rounded-full border ${TIER_COLOR[c.tier]}`}>{c.tier}</span>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-700 shrink-0">{c.points} Poin</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          /* No Results — Quick Add trigger */
                          <div className="p-3 text-center space-y-2">
                            <p className="text-xs text-slate-500">Pelanggan <strong className="text-slate-700">"{customerQuery}"</strong> belum terdaftar.</p>
                            <button
                              type="button"
                              onMouseDown={() => { setShowCustomerDrop(false); setQaName(customerQuery); setShowQuickAddModal(true); }}
                              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              <UserPlus size={13} />
                              <span>+ Tambah Pelanggan Baru</span>
                            </button>
                          </div>
                        )}

                        {/* Bottom action — add new even when results exist */}
                        {customerResults.length > 0 && (
                          <div className="border-t border-slate-100 p-2">
                            <button
                              type="button"
                              onMouseDown={() => { setShowCustomerDrop(false); setQaName(customerQuery); setShowQuickAddModal(true); }}
                              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-emerald-50 text-[#057A55] hover:text-emerald-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer border border-slate-100 hover:border-emerald-200"
                            >
                              <UserPlus size={12} />
                              <span>+ Daftarkan Pelanggan Baru</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
                <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('cash')}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-50 border-[#057A55] text-[#057A55] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote size={15} />
                    <span className="text-[10px] md:text-[11px] truncate">Tunai</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('qris')}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'bg-emerald-50 border-[#057A55] text-[#057A55] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode size={15} />
                    <span className="text-[10px] md:text-[11px] truncate">QRIS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('transfer')}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'transfer'
                        ? 'bg-emerald-50 border-[#057A55] text-[#057A55] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 size={15} />
                    <span className="text-[10px] md:text-[11px] truncate">Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('kasbon')}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'kasbon'
                        ? 'bg-amber-50 border-amber-600 text-amber-700 shadow-xs ring-1 ring-amber-500/30'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileText size={15} />
                    <span className="text-[10px] md:text-[11px] truncate">Kas Bon</span>
                  </button>
                </div>

                {/* Kas Bon / Utang Notice Card */}
                {paymentMethod === 'kasbon' && (
                  <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-xl border border-amber-200 space-y-1.5 mt-2 animate-in fade-in duration-150">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                      <FileText size={14} className="text-amber-600" />
                      <span>Pencatatan Kas Bon / Utang Pelanggan</span>
                    </div>
                    {selectedCustomer ? (
                      <div className="text-[11px] text-amber-950 space-y-1">
                        <p>
                          Tagihan <strong className="text-slate-900">Rp {totalAmount.toLocaleString('id-ID')}</strong> akan dicatat ke akun utang <strong>{selectedCustomer.name}</strong>.
                        </p>
                        <div className="pt-1 border-t border-amber-200/80 flex items-center justify-between text-[10px]">
                          <span className="text-slate-600">Utang Saat Ini:</span>
                          <span className="text-rose-600 font-bold">
                            Rp {(selectedCustomer.unpaidDebt || 0).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-xs text-amber-900">
                          <span>Total Utang Baru:</span>
                          <span className="text-rose-700">
                            Rp {((selectedCustomer.unpaidDebt || 0) + totalAmount).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-rose-600 font-medium">
                        ⚠️ Wajib memilih pelanggan terlebih dahulu untuk transaksi Kas Bon.
                      </div>
                    )}
                  </div>
                )}

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
                    <p className="text-xs font-bold text-[#057A55]">Scan QRIS Dinamis Warung</p>
                    <p className="text-[10px] text-emerald-700">Mendukung GoPay, OVO, ShopeePay, DANA, BCA Mobile</p>
                  </div>
                )}
              </div>

              {/* Checkout Submit Button */}
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={cartList.length === 0 || (paymentMethod === 'cash' && !isCashSufficient) || (paymentMethod === 'kasbon' && !selectedCustomer)}
                className={`w-full py-3.5 px-4 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 ${
                  paymentMethod === 'kasbon'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20'
                    : 'bg-[#057A55] hover:bg-[#046c4e] active:bg-[#03543f] shadow-emerald-700/20'
                }`}
              >
                <CheckCircle2 size={18} />
                <span>
                  {paymentMethod === 'kasbon' ? 'Catat Kas Bon & Cetak Struk' : 'Bayar Sekarang & Cetak Struk'}
                </span>
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end md:hidden animate-in fade-in duration-200">
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

              {/* Mobile Customer Search */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pelanggan</label>
                {selectedCustomer ? (
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${selectedCustomer.avatarBg} ${selectedCustomer.avatarText}`}>
                      {getInitials(selectedCustomer.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{selectedCustomer.name}</div>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {selectedCustomer.points} Poin • {selectedCustomer.tier}
                        {selectedCustomer.unpaidDebt ? (
                          <span className="text-rose-600 font-bold ml-1">
                            • Utang: Rp {selectedCustomer.unpaidDebt.toLocaleString('id-ID')}
                          </span>
                        ) : null}
                      </span>
                    </div>
                    <button type="button" onClick={handleClearCustomer} className="p-1 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setIsMobileCartOpen(false); setShowQuickAddModal(true); }}
                    className="w-full flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-[#057A55] transition-colors cursor-pointer"
                  >
                    <UserPlus size={14} className="shrink-0" />
                    <span>Pilih / Tambah Pelanggan</span>
                  </button>
                )}
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
                <div className="grid grid-cols-4 gap-1.5 text-xs font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('cash')}
                    className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'cash' ? 'bg-emerald-50 border-[#057A55] text-[#057A55]' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Banknote size={14} />
                    <span className="text-[10px]">Tunai</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('qris')}
                    className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'qris' ? 'bg-emerald-50 border-[#057A55] text-[#057A55]' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <QrCode size={14} />
                    <span className="text-[10px]">QRIS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('transfer')}
                    className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'transfer' ? 'bg-emerald-50 border-[#057A55] text-[#057A55]' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Building2 size={14} />
                    <span className="text-[10px]">Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('kasbon')}
                    className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === 'kasbon' ? 'bg-amber-50 border-amber-600 text-amber-700' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <FileText size={14} />
                    <span className="text-[10px]">Kas Bon</span>
                  </button>
                </div>

                {/* Kas Bon Notice in Mobile Drawer */}
                {paymentMethod === 'kasbon' && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-xs">
                      <FileText size={13} className="text-amber-600" />
                      <span>Kas Bon / Utang Pelanggan</span>
                    </div>
                    {selectedCustomer ? (
                      <div>
                        Tagihan <strong>Rp {totalAmount.toLocaleString('id-ID')}</strong> akan dicatat ke <strong>{selectedCustomer.name}</strong>.
                      </div>
                    ) : (
                      <div className="text-rose-600">
                        ⚠️ Pilih pelanggan terlebih dahulu di atas.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Checkout Button */}
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={cartList.length === 0 || (paymentMethod === 'cash' && !isCashSufficient) || (paymentMethod === 'kasbon' && !selectedCustomer)}
                className={`w-full py-3 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50 ${
                  paymentMethod === 'kasbon'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-[#057A55] hover:bg-[#046c4e]'
                }`}
              >
                <CheckCircle2 size={17} />
                <span>
                  {paymentMethod === 'kasbon' ? 'Catat Kas Bon & Cetak Struk' : 'Bayar Sekarang & Cetak Struk'}
                </span>
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
                  {PRODUCTS_DATA.slice(0, 4).map((item) => (
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

        {/* 6. QUICK ADD CUSTOMER MODAL */}
        {showQuickAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">

              {/* Header */}
              <div className="bg-gradient-to-r from-[#057A55] to-emerald-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <UserPlus size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Daftarkan Pelanggan Baru</h3>
                    <p className="text-[10px] text-emerald-100/90">Langsung aktif di transaksi ini</p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowQuickAddModal(false)} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleQuickAddSubmit} className="p-5 space-y-4">

                {/* Bonus info banner */}
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-lg">🎁</span>
                  <p className="text-[11px] text-emerald-800 font-medium">Pelanggan baru mendapatkan <strong>+25 Poin Bonus</strong> dan tier <strong>Bronze</strong> secara otomatis.</p>
                </div>

                {/* Nama */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Nama Lengkap <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={qaName}
                    onChange={e => setQaName(e.target.value)}
                    placeholder="Contoh: Ibu Sari"
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#057A55] focus:ring-1 focus:ring-[#057A55]/30 transition-all"
                    autoFocus
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Nomor WhatsApp <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={qaPhone}
                      onChange={e => setQaPhone(e.target.value)}
                      placeholder="0812-3456-7890"
                      required
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#057A55] focus:ring-1 focus:ring-[#057A55]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowQuickAddModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!qaName.trim() || !qaPhone.trim() || qaSubmitting}
                    className="flex-1 py-2.5 bg-[#057A55] hover:bg-[#046c4e] disabled:opacity-60 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
                  >
                    {qaSubmitting ? (
                      <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full" />
                    ) : (
                      <UserPlus size={13} />
                    )}
                    <span>{qaSubmitting ? 'Mendaftarkan...' : 'Daftarkan & Pilih'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 7. SUCCESS RECEIPT POPUP MODAL */}
        {showReceiptModal && lastTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
              
              {/* Modal Top Notification */}
              <div className={`${lastTransaction.isKasBon ? 'bg-amber-600' : 'bg-[#057A55]'} text-white p-4 text-center transition-colors`}>
                <div className={`w-12 h-12 rounded-full bg-white ${lastTransaction.isKasBon ? 'text-amber-600' : 'text-[#057A55]'} mx-auto flex items-center justify-center shadow-md mb-2`}>
                  {lastTransaction.isKasBon ? (
                    <FileText size={26} className="text-amber-600" />
                  ) : (
                    <CheckCircle2 size={28} className="text-[#057A55]" />
                  )}
                </div>
                <h3 className="text-base font-bold">
                  {lastTransaction.isKasBon ? 'Kas Bon Berhasil Dicatat!' : 'Pembayaran Berhasil!'}
                </h3>
                <p className="text-xs text-white/90 mt-0.5">
                  {lastTransaction.isOffline
                    ? 'Transaksi tersimpan di penyimpanan lokal perangkat'
                    : lastTransaction.isKasBon
                    ? `Dicatat ke akun utang ${lastTransaction.customer?.name || 'Pelanggan'}`
                    : 'Transaksi telah tercatat di sistem POS'}
                </p>
                {lastTransaction.isOffline && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/25 text-amber-200 text-[10px] font-bold mt-1.5 border border-white/20">
                    <WifiOff size={10} />
                    <span>Mode Offline • Siap Disinkronkan</span>
                  </div>
                )}
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
                  {/* Customer info on receipt */}
                  {selectedCustomer && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex flex-col items-center justify-center gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <UserCheck size={11} className="text-emerald-600" />
                        <span className="text-[11px] text-emerald-700 font-bold">{selectedCustomer.name}</span>
                        <span className="text-[10px] text-slate-400">• +{Math.max(1, Math.round(lastTransaction.total / 10000))} Poin</span>
                      </div>
                      {lastTransaction.isKasBon && (
                        <div className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md mt-0.5">
                          Akumulasi Utang: Rp {(lastTransaction.newDebt || 0).toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                  )}
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
                  {lastTransaction.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Diskon:</span>
                      <span>-Rp {lastTransaction.discount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 text-xs pt-1 border-t border-slate-200">
                    <span>TOTAL:</span>
                    <span className="text-[#057A55]">Rp {lastTransaction.total.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-1 text-[10px]">
                    <span>Metode:</span>
                    <span className="font-bold text-slate-800">{lastTransaction.paymentMethod}</span>
                  </div>
                  {!lastTransaction.isKasBon && lastTransaction.cashGiven > 0 && lastTransaction.paymentMethod.includes('Tunai') && (
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
                    onClick={handlePrintReceipt}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    title="Cetak struk fisik thermal kasir"
                  >
                    <Printer size={15} />
                    <span>Cetak Struk Physical</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendWhatsAppReceipt}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-emerald-700/20"
                    title="Kirim salinan struk digital ke WhatsApp pelanggan"
                  >
                    <Share2 size={15} />
                    <span>Kirim Struk via WA</span>
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
