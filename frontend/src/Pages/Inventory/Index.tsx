import React, { useState, useMemo, useRef, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import {
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Package,
  PackagePlus,
  Edit3,
  Trash2,
  X,
  ChevronDown,
  Filter,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  Save,
  RefreshCw,
  ArrowUpDown,
  MoreVertical,
  ClipboardList,
  Truck,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type StockStatus = 'safe' | 'low' | 'critical' | 'out';
export type ProductCategory = 'Sembako' | 'Minuman' | 'Makanan' | 'Rokok' | 'Snack' | 'Lainnya';

export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  category: ProductCategory;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  unit: string;
  minStock: number;
  status: StockStatus;
  lastRestocked?: string;
}

export interface NewItemForm {
  name: string;
  category: ProductCategory;
  sku: string;
  unit: string;
  buyPrice: string;
  sellPrice: string;
  minStock: string;
  initialStock: string;
}

export interface RestockForm {
  quantity: string;
  supplierNote: string;
  date: string;
}

export interface InventoryProps {
  onNavigate?: (path: string) => void;
}

// ─────────────────────────────────────────────
// Initial Dummy Data
// ─────────────────────────────────────────────
const deriveStatus = (stock: number, minStock: number): StockStatus => {
  if (stock === 0) return 'out';
  if (stock <= minStock * 0.3) return 'critical';
  if (stock <= minStock) return 'low';
  return 'safe';
};

// Helper to build a seed item — status is always computed, never hardcoded
const makeItem = (
  id: number, sku: string, name: string, category: ProductCategory,
  buyPrice: number, sellPrice: number, stock: number, unit: string,
  minStock: number, lastRestocked: string
): InventoryItem => ({
  id, sku, name, category, buyPrice, sellPrice, stock, unit, minStock, lastRestocked,
  status: deriveStatus(stock, minStock), // ← always computed, never a stale string
});

const INITIAL_ITEMS: InventoryItem[] = [
  makeItem(1,  'SKU-001', 'Minyak Goreng Sania 2L',        'Sembako', 32000,  36500,  2,  'pouch',   10, '5 Sep 2026'),
  makeItem(2,  'SKU-002', 'Telur Ayam Negeri 1kg',          'Sembako', 26000,  29000,  4,  'kg',      15, '6 Sep 2026'),
  makeItem(3,  'SKU-003', 'Beras Ramos Super 5kg',          'Sembako', 68000,  75000,  1,  'karung',  8,  '4 Sep 2026'),
  makeItem(4,  'SKU-004', 'Gula Pasir Gulaku 1kg',          'Sembako', 16500,  18500,  4,  'pack',    12, '7 Sep 2026'),
  makeItem(5,  'SKU-005', 'Kopi Kapal Api Special 165g',    'Minuman', 12000,  14500,  28, 'pcs',     10, '8 Sep 2026'),
  makeItem(6,  'SKU-006', 'Indomie Goreng Original',        'Makanan', 2900,   3500,   85, 'bungkus', 40, '9 Sep 2026'),
  makeItem(7,  'SKU-007', 'Susu Kental Manis Frisian Flag', 'Makanan', 11500,  13500,  19, 'kaleng',  10, '7 Sep 2026'),
  makeItem(8,  'SKU-008', 'Rokok Gudang Garam Surya 16',    'Rokok',   30000,  35000,  24, 'bungkus', 15, '9 Sep 2026'),
  makeItem(9,  'SKU-009', 'Es Teh Manis Jumbo',             'Minuman', 4500,   6000,   80, 'cup',     30, '10 Sep 2026'),
  makeItem(10, 'SKU-010', 'Air Mineral Le Minerale 600ml',  'Minuman', 2800,   4000,   96, 'botol',   24, '10 Sep 2026'),
  makeItem(11, 'SKU-011', 'Chitato Sapi Panggang 68g',      'Snack',   9500,   11500,  18, 'bungkus', 20, '8 Sep 2026'),
  makeItem(12, 'SKU-012', 'Sampoerna A Mild 16',            'Rokok',   31000,  36000,  30, 'bungkus', 15, '9 Sep 2026'),
  makeItem(13, 'SKU-013', 'Mie Sedaap Goreng',              'Makanan', 2800,   3500,   0,  'bungkus', 30, '2 Sep 2026'),
  makeItem(14, 'SKU-014', 'Kopi Nescafe 3in1',              'Minuman', 3200,   4000,   45, 'sachet',  20, '11 Sep 2026'),
  makeItem(15, 'SKU-015', 'Sabun Lifebuoy 75g',             'Lainnya', 4500,   6000,   12, 'pcs',     10, '10 Sep 2026'),
];

const CATEGORIES: ProductCategory[] = ['Sembako', 'Minuman', 'Makanan', 'Rokok', 'Snack', 'Lainnya'];
const CATEGORY_FILTERS = ['Semua', ...CATEGORIES];

const EMPTY_NEW_ITEM: NewItemForm = {
  name: '', category: 'Sembako', sku: '', unit: 'pcs',
  buyPrice: '', sellPrice: '', minStock: '', initialStock: '',
};

const EMPTY_RESTOCK: RestockForm = {
  quantity: '', supplierNote: '',
  date: new Date().toISOString().split('T')[0],
};

const formatRp = (n: number) =>
  `Rp ${n.toLocaleString('id-ID')}`;

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
const StatusBadge: React.FC<{ status: StockStatus; stock: number; unit: string }> = ({ status, stock, unit }) => {
  const cfg = {
    safe:     { label: 'Aman',       cls: 'bg-emerald-100 text-emerald-800' },
    low:      { label: 'Menipis',    cls: 'bg-amber-100 text-amber-800'     },
    critical: { label: 'Kritis!',    cls: 'bg-rose-100 text-rose-700'       },
    out:      { label: 'Habis',      cls: 'bg-slate-200 text-slate-600'     },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.cls}`}>
      {status === 'safe'     && <CheckCircle2 size={10} />}
      {status === 'low'      && <AlertTriangle size={10} />}
      {status === 'critical' && <ShieldAlert size={10} />}
      {cfg.label} • {stock} {unit}
    </span>
  );
};

// Modal backdrop wrapper
const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode; title: string; subtitle?: string }> = ({
  open, onClose, children, title, subtitle,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] z-10 animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Input field helper
const Field: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, required, children, hint }) => (
  <div>
    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
      {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

const inputCls = 'w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all';

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export const Inventory: React.FC<InventoryProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);

  // Filters
  const [search, setSearch]             = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [sortField, setSortField]       = useState<'name' | 'stock' | 'sellPrice'>('name');
  const [sortAsc, setSortAsc]           = useState(true);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [addModalOpen, setAddModalOpen]         = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen]       = useState(false);
  const [deleteConfirmId, setDeleteConfirmId]   = useState<number | null>(null);
  const [restockTargetId, setRestockTargetId]   = useState<number | null>(null);

  // Form states
  const [newItemForm, setNewItemForm]   = useState<NewItemForm>(EMPTY_NEW_ITEM);
  const [restockForm, setRestockForm]   = useState<RestockForm>(EMPTY_RESTOCK);
  const [editItem, setEditItem]         = useState<InventoryItem | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  // Close status dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Stats — computed live from stock/minStock, NOT from cached status strings ──
  // This guarantees cards update instantly after any restock, edit, or add.
  const stats = useMemo(() => {
    let total = 0, safe = 0, alert = 0, assetValue = 0;
    for (const i of items) {
      total++;
      const liveStatus = deriveStatus(i.stock, i.minStock); // always fresh
      if (liveStatus === 'safe') safe++;
      else alert++; // critical | low | out all count as "perlu perhatian"
      assetValue += i.buyPrice * i.stock;
    }
    return { total, safe, alert, assetValue };
  }, [items]);

  // ── Filtered & sorted list ──
  const displayItems = useMemo(() => {
    let list = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'Semua') {
      list = list.filter(i => i.category === categoryFilter);
    }

    // Filter uses deriveStatus() for same live-computed logic as the stats cards
    if (statusFilter === 'Stok Aman')    list = list.filter(i => deriveStatus(i.stock, i.minStock) === 'safe');
    if (statusFilter === 'Stok Menipis') list = list.filter(i => { const s = deriveStatus(i.stock, i.minStock); return s === 'low' || s === 'critical'; });
    if (statusFilter === 'Habis')        list = list.filter(i => deriveStatus(i.stock, i.minStock) === 'out');

    list.sort((a, b) => {
      let av = sortField === 'name' ? a.name : sortField === 'stock' ? a.stock : a.sellPrice;
      let bv = sortField === 'name' ? b.name : sortField === 'stock' ? b.stock : b.sellPrice;
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [items, search, categoryFilter, statusFilter, sortField, sortAsc]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(p => !p);
    else { setSortField(field); setSortAsc(true); }
  };

  // ── Handlers ──
  const handleAddItem = () => {
    const { name, category, sku, unit, buyPrice, sellPrice, minStock, initialStock } = newItemForm;
    if (!name.trim() || !buyPrice || !sellPrice || !minStock) {
      showToast('Harap lengkapi semua kolom wajib!', 'error');
      return;
    }

    const stock = parseInt(initialStock) || 0;
    const min   = parseInt(minStock)    || 1;
    const newItem: InventoryItem = {
      id:   Date.now(),
      sku:  sku.trim() || `SKU-${String(items.length + 1).padStart(3, '0')}`,
      name: name.trim(),
      category,
      unit,
      buyPrice:  parseInt(buyPrice.replace(/\D/g, '')) || 0,
      sellPrice: parseInt(sellPrice.replace(/\D/g, '')) || 0,
      stock,
      minStock:  min,
      status:    deriveStatus(stock, min),
      lastRestocked: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    setItems(prev => [newItem, ...prev]);
    setNewItemForm(EMPTY_NEW_ITEM);
    setAddModalOpen(false);
    showToast(`✅ "${name}" berhasil ditambahkan ke inventaris!`);
  };

  const handleQuickRestock = () => {
    if (!restockTargetId) return;
    const qty = parseInt(restockForm.quantity);
    if (!qty || qty <= 0) { showToast('Masukkan jumlah restok yang valid!', 'error'); return; }

    setItems(prev => prev.map(item => {
      if (item.id !== restockTargetId) return item;
      const newStock = item.stock + qty;
      return {
        ...item,
        stock: newStock,
        status: deriveStatus(newStock, item.minStock),
        lastRestocked: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      };
    }));

    const itemName = items.find(i => i.id === restockTargetId)?.name;
    setRestockForm(EMPTY_RESTOCK);
    setRestockModalOpen(false);
    setRestockTargetId(null);
    showToast(`📦 Stok "${itemName}" berhasil ditambah +${qty}!`);
  };

  const openRestock = (id: number) => {
    setRestockTargetId(id);
    setRestockForm(EMPTY_RESTOCK);
    setRestockModalOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditItem({ ...item });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editItem) return;
    if (!editItem.name.trim()) { showToast('Nama barang tidak boleh kosong!', 'error'); return; }
    setItems(prev => prev.map(i =>
      i.id === editItem.id
        ? { ...editItem, status: deriveStatus(editItem.stock, editItem.minStock) }
        : i
    ));
    setEditModalOpen(false);
    showToast(`✏️ Data "${editItem.name}" berhasil diperbarui!`);
  };

  const handleDelete = (id: number) => {
    const name = items.find(i => i.id === id)?.name;
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteConfirmId(null);
    showToast(`🗑️ "${name}" dihapus dari inventaris.`, 'info');
  };

  const restockTarget = items.find(i => i.id === restockTargetId);

  return (
    <AppLayout title="Manajemen Stok" currentPath="/inventory" onNavigate={onNavigate}>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200`}>
          <div className={`px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold text-white flex items-center gap-2.5 ${
            toast.type === 'error' ? 'bg-rose-600' : toast.type === 'info' ? 'bg-slate-700' : 'bg-[#057A55]'
          }`}>
            {toast.msg}
          </div>
        </div>
      )}

      {/* ── Delete Confirm Overlay ── */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm z-10 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-rose-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center">Hapus Barang?</h3>
            <p className="text-xs text-slate-500 text-center mt-1 mb-5">
              "<span className="font-semibold text-slate-700">{items.find(i => i.id === deleteConfirmId)?.name}</span>" akan dihapus permanen dari inventaris.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirmId!)} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-sm font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          HEADER SECTION
      ════════════════════════════════════════ */}
      <div className="bg-[#057A55] text-white pt-6 pb-5 px-5 rounded-b-[24px] md:rounded-2xl md:p-6 shadow-md shadow-emerald-950/15 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <ClipboardList size={20} className="text-emerald-200" />
              <h1 className="text-lg md:text-2xl font-bold text-white leading-tight">Manajemen Inventaris</h1>
            </div>
            <p className="text-xs md:text-sm text-emerald-100/90 mt-0.5">
              Kelola stok barang, pantau ketersediaan, dan atur harga jual toko
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => { setRestockTargetId(null); setRestockForm(EMPTY_RESTOCK); setRestockModalOpen(true); }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 rounded-xl text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <Truck size={15} />
              <span>Restok Cepat</span>
            </button>

            <button
              type="button"
              onClick={() => { setNewItemForm(EMPTY_NEW_ITEM); setAddModalOpen(true); }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#057A55] hover:bg-emerald-50 rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              <span>Tambah Barang Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          STATS CARDS
      ════════════════════════════════════════ */}
      <div className="px-4 md:px-0 -mt-3 md:mt-4 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {/* Total Barang */}
          <div className="bg-white rounded-2xl p-3.5 md:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Jenis</span>
              <div className="p-1.5 rounded-xl bg-slate-100 text-slate-500">
                <Package size={15} />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{stats.total}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">jenis barang</div>
          </div>

          {/* Stok Aman */}
          <div className="bg-white rounded-2xl p-3.5 md:p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Stok Aman</span>
              <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck size={15} />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-700">{stats.safe}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">item tersedia</div>
          </div>

          {/* Stok Kritis */}
          <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl p-3.5 md:p-5 border border-rose-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] md:text-xs font-semibold text-rose-600 uppercase tracking-wider">Stok Kritis</span>
              <div className="p-1.5 rounded-xl bg-rose-100 text-rose-600">
                <ShieldAlert size={15} />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-rose-700">{stats.alert}</div>
            <div className="text-[11px] text-rose-500 font-semibold mt-0.5">perlu restok segera</div>
          </div>

          {/* Nilai Aset */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-3.5 md:p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Nilai Aset</span>
              <div className="p-1.5 rounded-xl bg-blue-100 text-blue-600">
                <DollarSign size={15} />
              </div>
            </div>
            <div className="text-base md:text-xl font-extrabold text-blue-700 leading-tight">{formatRp(stats.assetValue)}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">total stok × harga beli</div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          SEARCH, FILTER, CATEGORY
      ════════════════════════════════════════ */}
      <div className="px-4 md:px-0 mt-4 space-y-3">
        {/* Row 1: Search + Status Dropdown */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 shadow-xs focus-within:ring-2 focus-within:ring-[#057A55]/20 focus-within:border-[#057A55] transition-all">
            <Search size={15} className="text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama barang atau kode SKU..."
              className="bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400 w-full"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 ml-1 cursor-pointer">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative shrink-0" ref={statusDropdownRef}>
            <button
              type="button"
              onClick={() => setShowStatusDropdown(p => !p)}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-xs transition-all cursor-pointer"
            >
              <Filter size={13} />
              <span className="hidden sm:inline">{statusFilter}</span>
              <ChevronDown size={13} className={`transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-40 min-w-[160px] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {['Semua Status', 'Stok Aman', 'Stok Menipis', 'Habis'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setStatusFilter(opt); setShowStatusDropdown(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      statusFilter === opt
                        ? 'bg-emerald-50 text-[#057A55]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#057A55] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
              {cat !== 'Semua' && (
                <span className="ml-1.5 opacity-60">
                  ({items.filter(i => i.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-slate-700">{displayItems.length}</span> dari {items.length} barang
          </span>
          {(search || categoryFilter !== 'Semua' || statusFilter !== 'Semua Status') && (
            <button
              onClick={() => { setSearch(''); setCategoryFilter('Semua'); setStatusFilter('Semua Status'); }}
              className="text-[11px] text-[#057A55] font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <RefreshCw size={11} /> Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          DESKTOP TABLE VIEW (md+)
      ════════════════════════════════════════ */}
      <div className="hidden md:block px-0 mt-3">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2.5fr_1fr_1fr_1.5fr_1.2fr] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span>Kode SKU</span>
            <button onClick={() => toggleSort('name')} className="flex items-center gap-1 cursor-pointer hover:text-slate-800 transition-colors text-left">
              Nama Barang <ArrowUpDown size={11} className="opacity-60" />
            </button>
            <span>Harga Beli</span>
            <button onClick={() => toggleSort('sellPrice')} className="flex items-center gap-1 cursor-pointer hover:text-slate-800 transition-colors">
              Harga Jual <ArrowUpDown size={11} className="opacity-60" />
            </button>
            <button onClick={() => toggleSort('stock')} className="flex items-center gap-1 cursor-pointer hover:text-slate-800 transition-colors">
              Stok & Status <ArrowUpDown size={11} className="opacity-60" />
            </button>
            <span className="text-right">Aksi</span>
          </div>

          {/* Table Rows */}
          {displayItems.length === 0 ? (
            <div className="py-16 text-center">
              <Package size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-600">Tidak ada barang ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba ubah filter pencarian atau tambah barang baru</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {displayItems.map(item => {
                const needsRestock = item.status === 'critical' || item.status === 'low' || item.status === 'out';
                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-[1fr_2.5fr_1fr_1fr_1.5fr_1.2fr] gap-4 px-5 py-3.5 items-center text-sm transition-colors hover:bg-slate-50/80 ${
                      needsRestock ? 'bg-rose-50/30 hover:bg-rose-50/50' : ''
                    }`}
                  >
                    {/* SKU */}
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">{item.sku}</span>
                    </div>

                    {/* Name + Category */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800 text-sm truncate">{item.name}</span>
                        {needsRestock && (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap">
                            ⚠ Perlu Restok
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{item.category} • Min {item.minStock} {item.unit}</span>
                    </div>

                    {/* Buy Price */}
                    <div className="text-xs font-semibold text-slate-600">{formatRp(item.buyPrice)}</div>

                    {/* Sell Price */}
                    <div className="text-xs font-bold text-[#057A55]">{formatRp(item.sellPrice)}</div>

                    {/* Stock + Status */}
                    <div>
                      <StatusBadge status={item.status} stock={item.stock} unit={item.unit} />
                      {item.lastRestocked && (
                        <div className="text-[10px] text-slate-400 mt-0.5">Restok: {item.lastRestocked}</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition-colors cursor-pointer"
                        title="Edit barang"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openRestock(item.id)}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                        title="Tambah stok"
                      >
                        <PackagePlus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors cursor-pointer"
                        title="Hapus barang"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          MOBILE CARD LIST VIEW (< md)
      ════════════════════════════════════════ */}
      <div className="md:hidden px-4 mt-3 space-y-2.5 pb-2">
        {displayItems.length === 0 ? (
          <div className="bg-white rounded-2xl py-14 text-center border border-slate-100 shadow-xs">
            <Package size={36} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-600">Tidak ada barang</p>
            <p className="text-xs text-slate-400 mt-1">Ubah filter atau tambah barang baru</p>
          </div>
        ) : (
          displayItems.map(item => {
            const needsRestock = item.status === 'critical' || item.status === 'low' || item.status === 'out';
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col gap-3 ${
                  needsRestock ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100'
                }`}
              >
                {/* Top row: name, SKU, restock badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="text-sm font-bold text-slate-800 leading-tight">{item.name}</h3>
                      {needsRestock && (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">⚠ Perlu Restok</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">{item.sku}</span>
                      <span className="text-[11px] text-slate-400">{item.category} • Min {item.minStock} {item.unit}</span>
                    </div>
                  </div>
                  {/* Kebab menu placeholder */}
                  <button className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Price row */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Harga Beli</span>
                    <span className="text-xs font-bold text-slate-700">{formatRp(item.buyPrice)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Harga Jual</span>
                    <span className="text-xs font-bold text-[#057A55]">{formatRp(item.sellPrice)}</span>
                  </div>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <StatusBadge status={item.status} stock={item.stock} unit={item.unit} />

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition-colors cursor-pointer"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openRestock(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <PackagePlus size={13} />
                      Tambah Stok
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ════════════════════════════════════════
          MODAL: TAMBAH BARANG BARU
      ════════════════════════════════════════ */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Tambah Barang Baru"
        subtitle="Isi detail produk untuk menambahkan ke inventaris toko"
      >
        <Field label="Nama Barang" required>
          <input
            type="text"
            value={newItemForm.name}
            onChange={e => setNewItemForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Contoh: Minyak Goreng Sania 2L"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Kategori" required>
            <select
              value={newItemForm.category}
              onChange={e => setNewItemForm(p => ({ ...p, category: e.target.value as ProductCategory }))}
              className={inputCls}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Satuan" required>
            <select
              value={newItemForm.unit}
              onChange={e => setNewItemForm(p => ({ ...p, unit: e.target.value }))}
              className={inputCls}
            >
              {['pcs', 'kg', 'gram', 'liter', 'ml', 'bungkus', 'karung', 'botol', 'kaleng', 'pouch', 'sachet', 'pack', 'cup', 'porsi'].map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Kode SKU" hint="Kosongkan untuk generate otomatis">
          <input
            type="text"
            value={newItemForm.sku}
            onChange={e => setNewItemForm(p => ({ ...p, sku: e.target.value.toUpperCase() }))}
            placeholder="Contoh: SKU-016"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Harga Beli (Rp)" required>
            <input
              type="number"
              value={newItemForm.buyPrice}
              onChange={e => setNewItemForm(p => ({ ...p, buyPrice: e.target.value }))}
              placeholder="32000"
              min={0}
              className={inputCls}
            />
          </Field>
          <Field label="Harga Jual (Rp)" required>
            <input
              type="number"
              value={newItemForm.sellPrice}
              onChange={e => setNewItemForm(p => ({ ...p, sellPrice: e.target.value }))}
              placeholder="36500"
              min={0}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Stok Minimal" required hint="Batas peringatan restok">
            <input
              type="number"
              value={newItemForm.minStock}
              onChange={e => setNewItemForm(p => ({ ...p, minStock: e.target.value }))}
              placeholder="10"
              min={1}
              className={inputCls}
            />
          </Field>
          <Field label="Stok Awal" hint="Jumlah stok saat ini">
            <input
              type="number"
              value={newItemForm.initialStock}
              onChange={e => setNewItemForm(p => ({ ...p, initialStock: e.target.value }))}
              placeholder="0"
              min={0}
              className={inputCls}
            />
          </Field>
        </div>

        {/* Margin preview */}
        {newItemForm.buyPrice && newItemForm.sellPrice && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-800">Estimasi Margin Laba</span>
            <span className="font-extrabold text-emerald-700">
              {(() => {
                const buy  = parseInt(newItemForm.buyPrice)  || 0;
                const sell = parseInt(newItemForm.sellPrice) || 0;
                if (!buy || !sell) return '-';
                const margin = ((sell - buy) / sell * 100).toFixed(1);
                return `${formatRp(sell - buy)} (${margin}%)`;
              })()}
            </span>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => setAddModalOpen(false)}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex-1 py-3 rounded-xl bg-[#057A55] text-white text-sm font-bold hover:bg-[#046c4e] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Save size={16} />
            Simpan Barang
          </button>
        </div>
      </Modal>

      {/* ════════════════════════════════════════
          MODAL: QUICK RESTOCK
      ════════════════════════════════════════ */}
      <Modal
        open={restockModalOpen}
        onClose={() => { setRestockModalOpen(false); setRestockTargetId(null); }}
        title={restockTarget ? `Restok: ${restockTarget.name}` : 'Restok Cepat'}
        subtitle="Masukkan jumlah barang masuk dari supplier"
      >
        {/* If no specific target (bulk restock entry), show item selector */}
        {!restockTargetId && (
          <Field label="Pilih Barang" required>
            <select
              className={inputCls}
              onChange={e => setRestockTargetId(Number(e.target.value))}
              defaultValue=""
            >
              <option value="" disabled>-- Pilih barang yang akan direstok --</option>
              {items
                .filter(i => i.status !== 'safe' || true) // show all
                .sort((a, b) => {
                  const order = { out: 0, critical: 1, low: 2, safe: 3 };
                  return order[a.status] - order[b.status];
                })
                .map(i => (
                  <option key={i.id} value={i.id}>
                    {i.name} — Sisa: {i.stock} {i.unit}
                    {i.status !== 'safe' ? ' ⚠' : ''}
                  </option>
                ))}
            </select>
          </Field>
        )}

        {/* Current stock info */}
        {restockTarget && (
          <div className={`p-4 rounded-xl border ${
            restockTarget.status === 'safe'
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-rose-50 border-rose-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Info Stok Sekarang</span>
              <StatusBadge status={restockTarget.status} stock={restockTarget.stock} unit={restockTarget.unit} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-slate-500">Stok Saat Ini</div>
                <div className="text-lg font-extrabold text-slate-800">{restockTarget.stock}</div>
                <div className="text-[10px] text-slate-400">{restockTarget.unit}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Stok Minimum</div>
                <div className="text-lg font-extrabold text-slate-800">{restockTarget.minStock}</div>
                <div className="text-[10px] text-slate-400">{restockTarget.unit}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Kekurangan</div>
                <div className={`text-lg font-extrabold ${Math.max(0, restockTarget.minStock - restockTarget.stock) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {Math.max(0, restockTarget.minStock - restockTarget.stock)}
                </div>
                <div className="text-[10px] text-slate-400">{restockTarget.unit}</div>
              </div>
            </div>
          </div>
        )}

        <Field label="Jumlah Barang Masuk" required>
          <div className="relative">
            <input
              type="number"
              value={restockForm.quantity}
              onChange={e => setRestockForm(p => ({ ...p, quantity: e.target.value }))}
              placeholder="Contoh: 50"
              min={1}
              className={`${inputCls} pr-16`}
            />
            {restockTarget && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                {restockTarget.unit}
              </span>
            )}
          </div>
          {/* Quick amount buttons */}
          {restockTarget && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {[restockTarget.minStock, restockTarget.minStock * 2, restockTarget.minStock * 3].map(qty => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setRestockForm(p => ({ ...p, quantity: String(qty) }))}
                  className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-[#057A55] border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                >
                  +{qty} {restockTarget.unit}
                </button>
              ))}
            </div>
          )}
        </Field>

        <Field label="Tanggal Restok">
          <input
            type="date"
            value={restockForm.date}
            onChange={e => setRestockForm(p => ({ ...p, date: e.target.value }))}
            className={inputCls}
          />
        </Field>

        <Field label="Catatan Supplier (Opsional)">
          <textarea
            value={restockForm.supplierNote}
            onChange={e => setRestockForm(p => ({ ...p, supplierNote: e.target.value }))}
            placeholder="Contoh: Barang dari CV Jaya Mandiri, Batch #A12..."
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </Field>

        {/* Stock after restock preview */}
        {restockTarget && restockForm.quantity && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-800">Stok setelah restok</span>
            <span className="font-extrabold text-emerald-700 text-base">
              {restockTarget.stock + (parseInt(restockForm.quantity) || 0)} {restockTarget.unit}
            </span>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => { setRestockModalOpen(false); setRestockTargetId(null); }}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleQuickRestock}
            disabled={!restockTargetId}
            className="flex-1 py-3 rounded-xl bg-[#057A55] text-white text-sm font-bold hover:bg-[#046c4e] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp size={16} />
            Konfirmasi Restok
          </button>
        </div>
      </Modal>

      {/* ════════════════════════════════════════
          MODAL: EDIT BARANG
      ════════════════════════════════════════ */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Data Barang"
        subtitle="Perbarui informasi produk"
      >
        {editItem && (
          <>
            <Field label="Nama Barang" required>
              <input
                type="text"
                value={editItem.name}
                onChange={e => setEditItem(p => p ? { ...p, name: e.target.value } : p)}
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Kategori">
                <select
                  value={editItem.category}
                  onChange={e => setEditItem(p => p ? { ...p, category: e.target.value as ProductCategory } : p)}
                  className={inputCls}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Satuan">
                <select
                  value={editItem.unit}
                  onChange={e => setEditItem(p => p ? { ...p, unit: e.target.value } : p)}
                  className={inputCls}
                >
                  {['pcs', 'kg', 'gram', 'liter', 'ml', 'bungkus', 'karung', 'botol', 'kaleng', 'pouch', 'sachet', 'pack', 'cup', 'porsi'].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Harga Beli (Rp)" required>
                <input
                  type="number"
                  value={editItem.buyPrice}
                  onChange={e => setEditItem(p => p ? { ...p, buyPrice: Number(e.target.value) } : p)}
                  min={0}
                  className={inputCls}
                />
              </Field>
              <Field label="Harga Jual (Rp)" required>
                <input
                  type="number"
                  value={editItem.sellPrice}
                  onChange={e => setEditItem(p => p ? { ...p, sellPrice: Number(e.target.value) } : p)}
                  min={0}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Stok Saat Ini">
                <input
                  type="number"
                  value={editItem.stock}
                  onChange={e => setEditItem(p => p ? { ...p, stock: Number(e.target.value) } : p)}
                  min={0}
                  className={inputCls}
                />
              </Field>
              <Field label="Stok Minimum">
                <input
                  type="number"
                  value={editItem.minStock}
                  onChange={e => setEditItem(p => p ? { ...p, minStock: Number(e.target.value) } : p)}
                  min={1}
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Margin preview */}
            {editItem.buyPrice > 0 && editItem.sellPrice > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-800">Margin Laba</span>
                <span className="font-extrabold text-emerald-700">
                  {formatRp(editItem.sellPrice - editItem.buyPrice)} (
                  {((editItem.sellPrice - editItem.buyPrice) / editItem.sellPrice * 100).toFixed(1)}%)
                </span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 py-3 rounded-xl bg-[#057A55] text-white text-sm font-bold hover:bg-[#046c4e] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Save size={16} />
                Simpan Perubahan
              </button>
            </div>
          </>
        )}
      </Modal>

    </AppLayout>
  );
};

export default Inventory;
