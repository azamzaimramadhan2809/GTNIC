import React, { useState, useMemo, useRef, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import {
  Users,
  Search,
  Plus,
  Crown,
  Award,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Edit3,
  X,
  CheckCircle2,
  ArrowUpDown,
  Coins,
  Star,
  Receipt,
  MessageSquare,
  Gift,
  Copy,
  Check,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export type CustomerPeriod = 'Pekanan' | 'Bulanan' | 'Tahunan';

export interface CustomerPeriodStats {
  totalSpend: number;
  totalOrders: number;
}

// Period-aware analytics snapshots (mock data per period)
const PERIOD_METRICS: Record<CustomerPeriod, {
  activeCount: number;
  activeLabel: string;
  activeDelta: number;
  activeDeltaDir: 'up' | 'down';
  totalPoints: number;
  pointsDelta: string;
  pointsDeltaDir: 'up' | 'down';
  avgSpend: number;
  avgSpendLabel: string;
  avgSpendDeltaDir: 'up' | 'down';
  avgSpendDelta: string;
  periodNote: string;
}> = {
  Pekanan: {
    activeCount: 18,
    activeLabel: 'Transaksi Minggu Ini',
    activeDelta: 3,
    activeDeltaDir: 'up',
    totalPoints: 620,
    pointsDelta: '+15%',
    pointsDeltaDir: 'up',
    avgSpend: 87500,
    avgSpendLabel: 'Rata-rata / Kunjungan (7 Hari)',
    avgSpendDelta: '+Rp 4.200',
    avgSpendDeltaDir: 'up',
    periodNote: '7 hari terakhir',
  },
  Bulanan: {
    activeCount: 47,
    activeLabel: 'Pelanggan Aktif Bulan Ini',
    activeDelta: 6,
    activeDeltaDir: 'up',
    totalPoints: 4820,
    pointsDelta: '+8%',
    pointsDeltaDir: 'up',
    avgSpend: 215000,
    avgSpendLabel: 'Rata-rata Belanja Bulanan',
    avgSpendDelta: '+Rp 12.500',
    avgSpendDeltaDir: 'up',
    periodNote: 'September 2026',
  },
  Tahunan: {
    activeCount: 134,
    activeLabel: 'Pelanggan Aktif Tahun Ini',
    activeDelta: 28,
    activeDeltaDir: 'up',
    totalPoints: 42750,
    pointsDelta: '+22%',
    pointsDeltaDir: 'up',
    avgSpend: 1840000,
    avgSpendLabel: 'Rata-rata Belanja per Tahun',
    avgSpendDelta: '+Rp 245.000',
    avgSpendDeltaDir: 'up',
    periodNote: 'Tahun 2026',
  },
};

export type CustomerTier = 'Gold' | 'Silver' | 'Bronze';

export interface CustomerTransaction {
  id: string;
  date: string;
  items: string;
  total: number;
  pointsEarned: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: CustomerTier;
  points: number;
  totalSpend: number;
  totalOrders: number;
  periodStats?: Record<CustomerPeriod, CustomerPeriodStats>;
  lastVisit: string;
  joinedDate: string;
  address: string;
  notes: string;
  avatarBg: string;
  avatarText: string;
  transactions: CustomerTransaction[];
}

export interface CustomersProps {
  onNavigate?: (path: string) => void;
}

/**
 * Helper to retrieve dynamic period-based spend and order count for a customer.
 * Uses explicit periodStats if provided, or scales dynamically from base monthly figures.
 */
export const getCustomerPeriodStats = (
  customer: Customer,
  period: CustomerPeriod
): CustomerPeriodStats => {
  if (customer.periodStats && customer.periodStats[period]) {
    return customer.periodStats[period];
  }

  // Dynamic fallback scaling based on standard (Bulanan) figures
  if (period === 'Pekanan') {
    return {
      totalSpend: Math.round((customer.totalSpend * 0.13) / 1000) * 1000,
      totalOrders: Math.max(customer.totalOrders > 0 ? 1 : 0, Math.round(customer.totalOrders * 0.12)),
    };
  }

  if (period === 'Tahunan') {
    return {
      totalSpend: Math.round((customer.totalSpend * 11.08) / 1000) * 1000,
      totalOrders: Math.max(customer.totalOrders, Math.round(customer.totalOrders * 9.76)),
    };
  }

  return {
    totalSpend: customer.totalSpend,
    totalOrders: customer.totalOrders,
  };
};

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Ibu Ratna Sari',
    phone: '0812-3456-7890',
    email: 'ratna.sari@gmail.com',
    tier: 'Gold',
    points: 380,
    totalSpend: 3450000,
    totalOrders: 42,
    periodStats: {
      Pekanan: { totalSpend: 450000, totalOrders: 5 },
      Bulanan: { totalSpend: 3450000, totalOrders: 42 },
      Tahunan: { totalSpend: 38200000, totalOrders: 410 },
    },
    lastVisit: 'Hari ini, 08:30 WIB',
    joinedDate: '12 Jan 2026',
    address: 'Jl. Melati No. 12, RT 02/04, Kebayoran Baru',
    notes: 'Langganan beras Ramos 5kg & sembako bulanan',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-800',
    transactions: [
      { id: 'TRX-9821', date: 'Hari ini, 08:30 WIB', items: 'Beras Ramos 5kg, Minyak Sania 2L', total: 111500, pointsEarned: 11 },
      { id: 'TRX-9750', date: '10 Sep 2026', items: 'Telur 1kg, Gula Pasir 1kg, Indomie 10x', total: 82500, pointsEarned: 8 },
      { id: 'TRX-9602', date: '05 Sep 2026', items: 'Belanja Sembako Mingguan Lengkap', total: 245000, pointsEarned: 25 },
    ],
  },
  {
    id: 'CUST-002',
    name: 'Pak Hendra Gunawan',
    phone: '0813-8899-2211',
    email: 'hendra.gunawan@yahoo.com',
    tier: 'Gold',
    points: 295,
    totalSpend: 2890000,
    totalOrders: 35,
    periodStats: {
      Pekanan: { totalSpend: 380000, totalOrders: 4 },
      Bulanan: { totalSpend: 2890000, totalOrders: 35 },
      Tahunan: { totalSpend: 31800000, totalOrders: 360 },
    },
    lastVisit: 'Kemarin, 17:15 WIB',
    joinedDate: '05 Feb 2026',
    address: 'Komp. Polri Blok B5 No. 8',
    notes: 'Sering pesan rokok Surya & kopi aren tiap sore',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-800',
    transactions: [
      { id: 'TRX-9788', date: 'Kemarin, 17:15 WIB', items: 'Rokok Surya 16 x2, Kopi Susu Aren x2', total: 100000, pointsEarned: 10 },
      { id: 'TRX-9690', date: '08 Sep 2026', items: 'Kopi Kapal Api x3, Snack Chitato x4', total: 89500, pointsEarned: 9 },
    ],
  },
  {
    id: 'CUST-003',
    name: 'Mbak Dewi Anggraini',
    phone: '0856-1122-3344',
    email: 'dewi.ang@gmail.com',
    tier: 'Silver',
    points: 160,
    totalSpend: 1420000,
    totalOrders: 19,
    periodStats: {
      Pekanan: { totalSpend: 190000, totalOrders: 3 },
      Bulanan: { totalSpend: 1420000, totalOrders: 19 },
      Tahunan: { totalSpend: 15600000, totalOrders: 195 },
    },
    lastVisit: '11 Sep 2026',
    joinedDate: '20 Mar 2026',
    address: 'Kost Melati Indah Kamar 04',
    notes: 'Pelanggan snack & mie instan',
    avatarBg: 'bg-indigo-100',
    avatarText: 'text-indigo-800',
    transactions: [
      { id: 'TRX-9712', date: '11 Sep 2026', items: 'Indomie Goreng + Telur Kornet x2, Es Teh Jumbo x2', total: 42000, pointsEarned: 4 },
      { id: 'TRX-9540', date: '02 Sep 2026', items: 'Sabun Lifebuoy x2, Air Le Minerale x6', total: 36000, pointsEarned: 4 },
    ],
  },
  {
    id: 'CUST-004',
    name: 'Pak Bambang Santoso',
    phone: '0818-5544-3322',
    email: 'bambang.s@outlook.com',
    tier: 'Silver',
    points: 145,
    totalSpend: 1250000,
    totalOrders: 16,
    periodStats: {
      Pekanan: { totalSpend: 165000, totalOrders: 2 },
      Bulanan: { totalSpend: 1250000, totalOrders: 16 },
      Tahunan: { totalSpend: 13900000, totalOrders: 168 },
    },
    lastVisit: '10 Sep 2026',
    joinedDate: '15 Apr 2026',
    address: 'Jl. Kemang Timur No. 3A',
    notes: 'Pembayaran rutin via QRIS',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-800',
    transactions: [
      { id: 'TRX-9685', date: '10 Sep 2026', items: 'Minyak Goreng Sania 2L, Telur 1kg', total: 65500, pointsEarned: 7 },
    ],
  },
  {
    id: 'CUST-005',
    name: 'Ibu Linda Susanti',
    phone: '0878-9988-7766',
    email: 'linda.susanti@gmail.com',
    tier: 'Bronze',
    points: 85,
    totalSpend: 780000,
    totalOrders: 11,
    periodStats: {
      Pekanan: { totalSpend: 95000, totalOrders: 2 },
      Bulanan: { totalSpend: 780000, totalOrders: 11 },
      Tahunan: { totalSpend: 8600000, totalOrders: 115 },
    },
    lastVisit: '09 Sep 2026',
    joinedDate: '01 Mei 2026',
    address: 'Jl. Gandaria No. 18',
    notes: 'Member baru program poin',
    avatarBg: 'bg-orange-100',
    avatarText: 'text-orange-800',
    transactions: [
      { id: 'TRX-9610', date: '09 Sep 2026', items: 'Beras Ramos 5kg', total: 75000, pointsEarned: 8 },
    ],
  },
  {
    id: 'CUST-006',
    name: 'Mas Rizky Pratama',
    phone: '0896-3344-5566',
    email: 'rizky.pratama@gmail.com',
    tier: 'Bronze',
    points: 60,
    totalSpend: 540000,
    totalOrders: 8,
    periodStats: {
      Pekanan: { totalSpend: 70000, totalOrders: 1 },
      Bulanan: { totalSpend: 540000, totalOrders: 8 },
      Tahunan: { totalSpend: 6100000, totalOrders: 84 },
    },
    lastVisit: '08 Sep 2026',
    joinedDate: '10 Jun 2026',
    address: 'Jl. Radio Dalam No. 44',
    notes: 'Langganan es kopi & rokok Sampoerna',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-purple-800',
    transactions: [
      { id: 'TRX-9590', date: '08 Sep 2026', items: 'Sampoerna Mild 16, Es Kopi Susu', total: 51000, pointsEarned: 5 },
    ],
  },
  {
    id: 'CUST-007',
    name: 'Ibu Sri Wahyuni',
    phone: '0812-7766-5544',
    email: 'sri.wahyuni@yahoo.co.id',
    tier: 'Gold',
    points: 310,
    totalSpend: 3120000,
    totalOrders: 38,
    periodStats: {
      Pekanan: { totalSpend: 410000, totalOrders: 4 },
      Bulanan: { totalSpend: 3120000, totalOrders: 38 },
      Tahunan: { totalSpend: 34500000, totalOrders: 395 },
    },
    lastVisit: '07 Sep 2026',
    joinedDate: '18 Jan 2026',
    address: 'Komp. Deplu Kav. 12',
    notes: 'Ketua RT 03 - Pesanan snack rapat rutin',
    avatarBg: 'bg-rose-100',
    avatarText: 'text-rose-800',
    transactions: [
      { id: 'TRX-9545', date: '07 Sep 2026', items: 'Snack Box Rapat (Chitato 20x, Le Minerale 20x)', total: 310000, pointsEarned: 31 },
    ],
  },
];

const formatRp = (num: number): string => {
  return `Rp ${num.toLocaleString('id-ID')}`;
};

export const Customers: React.FC<CustomersProps> = ({ onNavigate }) => {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'points' | 'spend' | 'name'>('points');
  const [sortAsc, setSortAsc] = useState(false);

  // Period filter
  const [customerPeriod, setCustomerPeriod] = useState<CustomerPeriod>('Bulanan');
  const [periodTransitioning, setPeriodTransitioning] = useState(false);

  const handlePeriodChange = (p: CustomerPeriod) => {
    if (p === customerPeriod) return;
    setPeriodTransitioning(true);
    setTimeout(() => {
      setCustomerPeriod(p);
      setPeriodTransitioning(false);
    }, 160);
  };

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTier, setFormTier] = useState<CustomerTier>('Bronze');
  const [formPoints, setFormPoints] = useState('0');
  const [formAddress, setFormAddress] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  // Period-aware summary metrics (snapshot data)
  const periodData = PERIOD_METRICS[customerPeriod];

  // Dynamic top spender calculated from customers list for current period
  const topSpender = useMemo(() => {
    if (customers.length === 0) return null;
    let top = customers[0];
    let topStats = getCustomerPeriodStats(customers[0], customerPeriod);

    for (let i = 1; i < customers.length; i++) {
      const stats = getCustomerPeriodStats(customers[i], customerPeriod);
      if (stats.totalSpend > topStats.totalSpend) {
        top = customers[i];
        topStats = stats;
      }
    }

    return {
      customer: top,
      spend: topStats.totalSpend,
      orders: topStats.totalOrders,
    };
  }, [customers, customerPeriod]);

  // Filtered & Sorted Customer List
  const filteredCustomers = useMemo(() => {
    return customers
      .filter(c => {
        const matchesTier = selectedTier === 'all' || c.tier.toLowerCase() === selectedTier.toLowerCase();
        const matchesSearch = !search.trim() ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.address.toLowerCase().includes(search.toLowerCase());
        return matchesTier && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'points') {
          return sortAsc ? a.points - b.points : b.points - a.points;
        }
        if (sortBy === 'spend') {
          const spendA = getCustomerPeriodStats(a, customerPeriod).totalSpend;
          const spendB = getCustomerPeriodStats(b, customerPeriod).totalSpend;
          return sortAsc ? spendA - spendB : spendB - spendA;
        }
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      });
  }, [customers, search, selectedTier, sortBy, sortAsc, customerPeriod]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormTier('Bronze');
    setFormPoints('25'); // Welcome bonus points
    setFormAddress('');
    setFormNotes('');
    setAddModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormName(c.name);
    setFormPhone(c.phone);
    setFormEmail(c.email);
    setFormTier(c.tier);
    setFormPoints(String(c.points));
    setFormAddress(c.address);
    setFormNotes(c.notes);
    setAddModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      showToast('Nama dan nomor WhatsApp wajib diisi!', 'info');
      return;
    }

    if (editingCustomer) {
      // Edit existing
      setCustomers(prev =>
        prev.map(c => {
          if (c.id === editingCustomer.id) {
            return {
              ...c,
              name: formName.trim(),
              phone: formPhone.trim(),
              email: formEmail.trim(),
              tier: formTier,
              points: parseInt(formPoints) || 0,
              address: formAddress.trim(),
              notes: formNotes.trim(),
              periodStats: c.periodStats,
            };
          }
          return c;
        })
      );
      showToast(`Data pelanggan "${formName}" berhasil diperbarui!`, 'success');
    } else {
      // Add new
      const colors = [
        { bg: 'bg-emerald-100', text: 'text-emerald-800' },
        { bg: 'bg-indigo-100', text: 'text-indigo-800' },
        { bg: 'bg-amber-100', text: 'text-amber-800' },
        { bg: 'bg-blue-100', text: 'text-blue-800' },
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newCust: Customer = {
        id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        tier: formTier,
        points: parseInt(formPoints) || 25,
        totalSpend: 0,
        totalOrders: 0,
        periodStats: {
          Pekanan: { totalSpend: 0, totalOrders: 0 },
          Bulanan: { totalSpend: 0, totalOrders: 0 },
          Tahunan: { totalSpend: 0, totalOrders: 0 },
        },
        lastVisit: 'Baru mendaftar',
        joinedDate: 'Hari ini',
        address: formAddress.trim(),
        notes: formNotes.trim(),
        avatarBg: randomColor.bg,
        avatarText: randomColor.text,
        transactions: [],
      };

      setCustomers(prev => [newCust, ...prev]);
      showToast(`Pelanggan baru "${formName}" berhasil didaftarkan! (+${newCust.points} Poin Bonus)`, 'success');
    }

    setAddModalOpen(false);
  };

  const handleCopyPhone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    showToast('Nomor WhatsApp disalin!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTierBadge = (tier: CustomerTier) => {
    if (tier === 'Gold') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
          <Crown size={12} className="text-amber-600 fill-amber-500" />
          <span>Gold Member</span>
        </span>
      );
    }
    if (tier === 'Silver') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
          <Star size={12} className="text-slate-500 fill-slate-400" />
          <span>Silver Member</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
        <Award size={12} className="text-orange-600" />
        <span>Bronze Member</span>
      </span>
    );
  };

  return (
    <AppLayout title="Manajemen Pelanggan & Loyalty" currentPath="/customers" onNavigate={onNavigate}>
      
      {/* ── Toast Notification ── */}
      {toast && (
        <div className="fixed top-4 right-4 z-[200] pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-[#057A55] text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center gap-2.5 text-xs md:text-sm font-semibold max-w-sm">
            <CheckCircle2 size={16} />
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          HEADER SECTION
      ════════════════════════════════════════ */}
      <div className="bg-[#057A55] text-white pt-6 pb-5 px-5 rounded-b-[24px] md:rounded-2xl md:p-6 shadow-md shadow-emerald-950/15 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <Users size={22} className="text-emerald-200" />
              <h1 className="text-lg md:text-2xl font-bold text-white leading-tight">
                Pelanggan & Program Loyalitas
              </h1>
            </div>
            <p className="text-xs md:text-sm text-emerald-100/90 mt-0.5">
              Kelola data member warung, akumulasi poin belanja, dan reward loyalitas pelanggan setia
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 flex-wrap">
            {/* Period Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
              <Calendar size={13} className="text-emerald-200 ml-1 shrink-0" />
              {(['Pekanan', 'Bulanan', 'Tahunan'] as CustomerPeriod[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePeriodChange(p)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] md:text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    customerPeriod === p
                      ? 'bg-white text-[#057A55] shadow-sm'
                      : 'text-emerald-100 hover:bg-white/15'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#057A55] hover:bg-emerald-50 rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Tambah Pelanggan</span>
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          1. 3 CUSTOMER METRICS SUMMARY CARDS
      ════════════════════════════════════════ */}
      <div className="px-4 md:px-0 -mt-3 md:mt-4 relative z-20">

        {/* Period badge label */}
        <div className="flex items-center gap-1.5 mb-2.5 ml-0.5">
          <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Periode:</span>
          <span className="text-[10px] md:text-[11px] font-bold text-[#057A55] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            {customerPeriod === 'Pekanan' ? '7 Hari Terakhir' : customerPeriod === 'Bulanan' ? 'September 2026' : 'Tahun 2026'}
          </span>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 transition-opacity duration-150 ${
            periodTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          
          {/* Card 1: Pelanggan Aktif */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
                {periodData.activeLabel}
              </span>
              <div className="p-2 rounded-xl bg-emerald-100 text-[#057A55]">
                <Users size={16} />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              {periodData.activeCount}
              <span className="text-sm font-semibold text-slate-500 ml-1">Orang</span>
            </div>
            <div className={`flex items-center gap-1.5 mt-1 text-[11px] font-semibold ${
              periodData.activeDeltaDir === 'up' ? 'text-emerald-700' : 'text-rose-600'
            }`}>
              {periodData.activeDeltaDir === 'up'
                ? <TrendingUp size={13} />
                : <TrendingDown size={13} />}
              <span>
                {periodData.activeDeltaDir === 'up' ? '+' : '-'}{periodData.activeDelta} pelanggan vs periode lalu
              </span>
            </div>
          </div>

          {/* Card 2: Total Poin Diberikan */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Poin Diberikan
              </span>
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Coins size={16} />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-amber-600 leading-tight">
              {periodData.totalPoints.toLocaleString('id-ID')}
              <span className="text-sm font-semibold text-slate-500 ml-1">Poin</span>
            </div>
            <div className={`flex items-center gap-1.5 mt-1 text-[11px] font-semibold ${
              periodData.pointsDeltaDir === 'up' ? 'text-emerald-700' : 'text-rose-600'
            }`}>
              {periodData.pointsDeltaDir === 'up'
                ? <TrendingUp size={13} />
                : <TrendingDown size={13} />}
              <span>{periodData.pointsDelta} vs periode lalu</span>
              <Gift size={12} className="text-amber-500 ml-0.5" />
            </div>
          </div>

          {/* Card 3: Rata-rata Belanja + Top Spender */}
          <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-white rounded-2xl p-4 md:p-5 border border-emerald-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] md:text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                <Crown size={14} className="text-amber-500 fill-amber-400" />
                <span>Top Spender {customerPeriod}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                customerPeriod === 'Tahunan'
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : customerPeriod === 'Pekanan'
                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {customerPeriod}
              </span>
            </div>
            <div className="text-base md:text-lg font-extrabold text-slate-900 truncate">
              {topSpender ? topSpender.customer.name : 'Belum Ada'}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {topSpender && (
                <>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    {topSpender.customer.tier} Member
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] font-semibold text-amber-700">{topSpender.orders}x transaksi</span>
                </>
              )}
            </div>
            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-emerald-100">
              <span className="text-xs font-bold text-emerald-800">
                {topSpender ? formatRp(topSpender.spend) : 'Rp 0'}
              </span>
              <div className="flex items-center gap-0.5 text-[10px] text-emerald-700 font-semibold">
                <Sparkles size={11} />
                <span>Top {customerPeriod}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════
          2. FILTER, SEARCH & CUSTOMER LIST
      ════════════════════════════════════════ */}
      <div className="px-4 md:px-0 mt-5 pb-20 md:pb-6 space-y-4">
        
        {/* Controls Container */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama pelanggan, nomor WhatsApp, atau alamat..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tier Pills & Sort */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {(['all', 'Gold', 'Silver', 'Bronze'] as const).map(tier => (
              <button
                key={tier}
                type="button"
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedTier === tier
                    ? 'bg-[#057A55] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier === 'all' ? `Semua (${customers.length})` : `${tier} (${customers.filter(c => c.tier === tier).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* ── DESKTOP TABLE VIEW (md+) ── */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[2fr_1.4fr_1fr_1.2fr_1.2fr_1.4fr] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <button
              onClick={() => { setSortBy('name'); setSortAsc(prev => !prev); }}
              className="flex items-center gap-1 hover:text-slate-900 transition-colors text-left cursor-pointer"
            >
              <span>Pelanggan</span>
              <ArrowUpDown size={11} className="opacity-60" />
            </button>
            <span>WhatsApp / Kontak</span>
            <span>Status Member</span>
            <button
              onClick={() => { setSortBy('points'); setSortAsc(prev => !prev); }}
              className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <span>Poin Reward</span>
              <ArrowUpDown size={11} className="opacity-60" />
            </button>
            <button
              onClick={() => { setSortBy('spend'); setSortAsc(prev => !prev); }}
              className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <span>Total Belanja ({customerPeriod})</span>
              <ArrowUpDown size={11} className="opacity-60" />
            </button>
            <span className="text-right">Aksi</span>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="py-16 text-center">
              <Users size={40} className="mx-auto text-slate-300 mb-2.5" />
              <p className="text-sm font-bold text-slate-700">Tidak ada data pelanggan ditemukan</p>
              <p className="text-xs text-slate-400 mt-0.5">Coba ubah kata kunci pencarian atau daftarkan pelanggan baru</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredCustomers.map(customer => {
                const initials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                const periodStats = getCustomerPeriodStats(customer, customerPeriod);
                return (
                  <div
                    key={customer.id}
                    className="grid grid-cols-[2fr_1.4fr_1fr_1.2fr_1.2fr_1.4fr] gap-4 px-5 py-4 items-center hover:bg-slate-50/80 transition-colors text-xs"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl ${customer.avatarBg} ${customer.avatarText} font-bold flex items-center justify-center text-xs shrink-0 border border-current/20 shadow-xs`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate text-sm">{customer.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{customer.notes || customer.address || 'Member WarungPintar'}</div>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Phone size={13} className="text-emerald-600 shrink-0" />
                        <span>{customer.phone}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyPhone(customer.phone, customer.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Salin nomor"
                        >
                          {copiedId === customer.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Kunjungan: {customer.lastVisit}</div>
                    </div>

                    {/* Tier */}
                    <div>
                      {getTierBadge(customer.tier)}
                    </div>

                    {/* Points */}
                    <div>
                      <div className="font-extrabold text-amber-600 text-sm flex items-center gap-1">
                        <Coins size={14} />
                        <span>{customer.points} Poin</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Nilai Rp {(customer.points * 10).toLocaleString('id-ID')}</div>
                    </div>

                    {/* Total Spend */}
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {formatRp(periodStats.totalSpend)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{periodStats.totalOrders}x transaksi</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDetailCustomer(customer)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Lihat riwayat transaksi dan poin"
                      >
                        <Receipt size={13} />
                        <span>Detail</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(customer)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        title="Edit Data Pelanggan"
                      >
                        <Edit3 size={14} />
                      </button>

                      <a
                        href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(customer.name)},%20terima%20kasih%20telah%20menjadi%20pelanggan%20setia%20WarungPintar.%20Poin%20kamu%20saat%20ini:%20${customer.points}%20Poin.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                        title="Kirim pesan WhatsApp"
                      >
                        <MessageSquare size={14} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── MOBILE CARDS VIEW (< md) ── */}
        <div className="md:hidden space-y-3">
          {filteredCustomers.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
              <Users size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">Tidak ada pelanggan</p>
              <p className="text-xs text-slate-400 mt-0.5">Ubah filter pencarian atau tambah pelanggan baru</p>
            </div>
          ) : (
            filteredCustomers.map(customer => {
              const initials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              const periodStats = getCustomerPeriodStats(customer, customerPeriod);
              return (
                <div
                  key={customer.id}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3"
                >
                  {/* Top card header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${customer.avatarBg} ${customer.avatarText} font-bold flex items-center justify-center text-xs shrink-0 border border-current/20`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate">{customer.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone size={11} className="text-emerald-600" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {getTierBadge(customer.tier)}
                    </div>
                  </div>

                  {/* Points & Total Spend Stats */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Poin Reward</span>
                      <span className="font-extrabold text-amber-600 text-sm flex items-center gap-1 mt-0.5">
                        <Coins size={13} />
                        <span>{customer.points} Poin</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Belanja ({customerPeriod})</span>
                      <span className="font-extrabold text-slate-900 text-sm block mt-0.5">
                        {formatRp(periodStats.totalSpend)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {periodStats.totalOrders}x transaksi
                      </span>
                    </div>
                  </div>

                  {/* Action buttons on card footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailCustomer(customer)}
                      className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#057A55] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Receipt size={14} />
                      <span>Detail & Riwayat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(customer)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>

                    <a
                      href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(customer.name)},%20terima%20kasih%20telah%20menjadi%20pelanggan%20setia%20WarungPintar.`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                      title="WhatsApp"
                    >
                      <MessageSquare size={15} />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ════════════════════════════════════════
          3. MODAL: TAMBAH / EDIT PELANGGAN
      ════════════════════════════════════════ */}
      {addModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setAddModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-[#057A55]">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingCustomer ? 'Edit Data Pelanggan' : 'Daftar Pelanggan Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {editingCustomer ? 'Perbarui nomor WhatsApp & loyalty tier' : 'Tambahkan member baru untuk mengumpulkan poin'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCustomer} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Nama Lengkap Pelanggan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Ibu Ratna Sari"
                  className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Loyalty Tier
                  </label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as CustomerTier)}
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55]"
                  >
                    <option value="Bronze">Bronze Member</option>
                    <option value="Silver">Silver Member</option>
                    <option value="Gold">Gold Member</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Email Pelanggan (Opsional)
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="email@pelanggan.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Saldo Poin
                  </label>
                  <div className="relative">
                    <Coins size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={formPoints}
                      onChange={(e) => setFormPoints(e.target.value)}
                      placeholder="25"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Alamat Rumah / Catatan Khusus
                </label>
                <textarea
                  rows={2}
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Contoh: Jl. Melati No. 12 RT 02 (Suka pesan beras diantar)"
                  className="w-full px-3.5 py-2 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#057A55] hover:bg-[#046c4e] text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 cursor-pointer active:scale-95"
                >
                  {editingCustomer ? 'Simpan Perubahan' : 'Daftarkan Pelanggan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          4. MODAL: DETAIL PELANGGAN & RIWAYAT TRANSAKSI
      ════════════════════════════════════════ */}
      {detailCustomer && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setDetailCustomer(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl ${detailCustomer.avatarBg} ${detailCustomer.avatarText} font-bold flex items-center justify-center text-sm border border-current/20 shadow-xs`}>
                  {detailCustomer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{detailCustomer.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {getTierBadge(detailCustomer.tier)}
                    <span className="text-[11px] text-slate-400">ID: {detailCustomer.id}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailCustomer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Loyalty Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Coins size={20} className="text-amber-500" />
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Saldo Poin WarungPintar
                  </span>
                </div>
                <span className="text-xl font-extrabold text-emerald-800">
                  {detailCustomer.points} Poin
                </span>
              </div>
              {(() => {
                const detailStats = getCustomerPeriodStats(detailCustomer, customerPeriod);
                return (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Total Pengeluaran ({customerPeriod})</span>
                      <span className="font-bold text-slate-900">{formatRp(detailStats.totalSpend)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Frekuensi Belanja ({customerPeriod})</span>
                      <span className="font-bold text-slate-900">{detailStats.totalOrders} Kali</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone size={14} className="text-emerald-600" />
                  <span className="font-semibold">{detailCustomer.phone}</span>
                </div>
                <a
                  href={`https://wa.me/${detailCustomer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  Buka WhatsApp
                </a>
              </div>

              {detailCustomer.address && (
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                  <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>{detailCustomer.address}</span>
                </div>
              )}
            </div>

            {/* Recent Transactions List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Riwayat Transaksi Terakhir
              </span>
              {detailCustomer.transactions.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-400">
                  Belum ada riwayat transaksi tercatat untuk member ini.
                </div>
              ) : (
                <div className="space-y-2">
                  {detailCustomer.transactions.map((trx, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{trx.id}</span>
                          <span className="text-[10px] text-slate-400">{trx.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[220px]">{trx.items}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-slate-900">{formatRp(trx.total)}</div>
                        <span className="text-[10px] font-bold text-emerald-700">+{trx.pointsEarned} Poin</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = detailCustomer;
                  setDetailCustomer(null);
                  handleOpenEdit(target);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Edit Profil Pelanggan
              </button>
              <button
                type="button"
                onClick={() => setDetailCustomer(null)}
                className="px-5 py-2.5 rounded-xl bg-[#057A55] hover:bg-[#046c4e] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  );
};

export default Customers;
