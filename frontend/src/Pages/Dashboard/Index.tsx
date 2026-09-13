import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { useAuth } from '../../Context/AuthContext';
import {
  Store,
  Bell,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  PlusCircle,
  History,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Receipt,
  Search,
  Clock,
  ArrowRight
} from 'lucide-react';

export interface DashboardProps {
  onNavigate?: (path: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { currentUser, isOwner } = useAuth();
  const [storeOpen, setStoreOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'hari_ini' | 'minggu_ini'>('hari_ini');

  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const periodData = {
    hari_ini: {
      omset: 'Rp 1.450.000',
      omsetTrend: '+12.5% vs kemarin',
      transaksi: '48 Struk',
      transaksiAvg: 'Rata-rata 30.2rb',
      keuntungan: 'Rp 420.000',
      margin: '29.0% Margin laba',
      topSelling: [
        {
          id: 1,
          name: 'Kopi Susu Gula Aren',
          category: 'Minuman Dingin',
          sold: 18,
          revenue: 'Rp 270.000',
          percentage: 88,
          color: 'bg-emerald-600',
          badge: '🥇 #1 Terlaris',
        },
        {
          id: 2,
          name: 'Indomie Goreng + Telur Kornet',
          category: 'Makanan Siap Saji',
          sold: 14,
          revenue: 'Rp 210.000',
          percentage: 64,
          color: 'bg-teal-600',
          badge: '🥈 #2 Populer',
        },
        {
          id: 3,
          name: 'Es Teh Manis Jumbo',
          category: 'Minuman Dingin',
          sold: 22,
          revenue: 'Rp 132.000',
          percentage: 48,
          color: 'bg-amber-500',
          badge: '🥉 #3 Favorit',
        },
      ],
    },
    minggu_ini: {
      omset: 'Rp 10.180.000',
      omsetTrend: '+18.2% vs minggu lalu',
      transaksi: '312 Struk',
      transaksiAvg: 'Rata-rata 32.6rb',
      keuntungan: 'Rp 2.850.000',
      margin: '28.0% Margin laba',
      topSelling: [
        {
          id: 1,
          name: 'Kopi Susu Gula Aren',
          category: 'Minuman Dingin',
          sold: 142,
          revenue: 'Rp 2.130.000',
          percentage: 88,
          color: 'bg-emerald-600',
          badge: '🥇 #1 Terlaris',
        },
        {
          id: 2,
          name: 'Indomie Goreng + Telur Kornet',
          category: 'Makanan Siap Saji',
          sold: 98,
          revenue: 'Rp 1.470.000',
          percentage: 64,
          color: 'bg-teal-600',
          badge: '🥈 #2 Populer',
        },
        {
          id: 3,
          name: 'Es Teh Manis Jumbo',
          category: 'Minuman Dingin',
          sold: 183,
          revenue: 'Rp 1.098.000',
          percentage: 52,
          color: 'bg-amber-500',
          badge: '🥉 #3 Favorit',
        },
      ],
    },
  };

  const currentData = periodData[selectedPeriod];
  const topSellingItems = currentData.topSelling;

  const criticalStockList = [
    { name: 'Minyak Goreng Sania 2L', remaining: '2 pouch', min: '10 pouch' },
    { name: 'Telur Ayam Negeri 1kg', remaining: '3.5 kg', min: '15 kg' },
    { name: 'Beras Ramos Super 5kg', remaining: '1 karung', min: '8 karung' },
    { name: 'Gula Pasir Gulaku 1kg', remaining: '4 pack', min: '12 pack' },
  ];

  const recentTransactions = [
    {
      id: 'TRX-9824',
      time: '10:42 WIB',
      items: 'Kopi Susu (2), Indomie Goreng (1)',
      total: 'Rp 45.000',
      payment: 'QRIS Gopay',
      status: 'Selesai',
    },
    {
      id: 'TRX-9823',
      time: '10:15 WIB',
      items: 'Rokok Surya 16 (1), Es Teh (2)',
      total: 'Rp 52.000',
      payment: 'Tunai',
      status: 'Selesai',
    },
    {
      id: 'TRX-9822',
      time: '09:50 WIB',
      items: 'Minyak Goreng 2L (1), Telur 1kg',
      total: 'Rp 68.500',
      payment: 'Transfer BCA',
      status: 'Selesai',
    },
  ];

  return (
    <AppLayout title="Dashboard Beranda" currentPath="/" onNavigate={handleNav}>
      {/* Header Section: Mobile curved header vs Desktop sleek banner */}
      <div className="bg-[#057A55] text-white pt-6 pb-6 px-5 rounded-b-[28px] md:rounded-2xl md:p-6 md:mb-6 shadow-lg shadow-emerald-950/15 relative overflow-hidden">
        {/* Subtle decorative background glows */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Store info + Greeting */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 md:w-13 md:h-13 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner shrink-0">
              <Store size={24} className="text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-xl font-bold tracking-tight text-white leading-tight">
                  Warung Berkah Jaya
                </h1>
                <button
                  type="button"
                  onClick={() => setStoreOpen(!storeOpen)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    storeOpen
                      ? 'bg-emerald-400/20 border-emerald-300/40 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-300/40 text-rose-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${storeOpen ? 'bg-emerald-300 animate-pulse' : 'bg-rose-400'}`} />
                  {storeOpen ? 'Status: Buka' : 'Status: Tutup'}
                </button>
              </div>
              <p className="text-xs md:text-sm text-emerald-100/90 font-normal mt-0.5">
                Halo, {currentUser.name} 👋 • {isOwner ? 'Pantau performa tokomu hari ini' : 'Siap melayani transaksi kasir hari ini'}
              </p>
            </div>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-72 flex items-center bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2 text-white placeholder-emerald-200 text-xs md:text-sm">
              <Search size={16} className="text-emerald-200 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Cari barang stok, transaksi..."
                className="bg-transparent border-none outline-none text-xs md:text-sm text-white placeholder-emerald-200/70 w-full"
              />
            </div>

            <button
              type="button"
              onClick={() => handleNav('/login')}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors relative shrink-0"
              title="Notifikasi"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#057A55]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Mobile stack vs Desktop 2-column Grid (md:grid-cols-3) */}
      <div className="px-4 md:px-0 -mt-3 md:mt-0 relative z-20 space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
        
        {/* LEFT COLUMN: Span 2 on desktop (Ringkasan Penjualan, Top 3 Terlaris, Transaksi Terakhir) */}
        <div className="md:col-span-2 space-y-4 md:space-y-6">
          
          {/* 1. Sales Summary Cards ("Ringkasan Penjualan") */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md shadow-slate-200/70 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Ringkasan Penjualan
                </h2>
                <p className="text-[11px] md:text-xs text-slate-500 hidden md:block">
                  Update otomatis setiap transaksi baru
                </p>
              </div>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl text-[11px] md:text-xs font-medium text-slate-600">
                <button
                  type="button"
                  onClick={() => setSelectedPeriod('hari_ini')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedPeriod === 'hari_ini'
                      ? 'bg-white font-bold text-[#057A55] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Hari Ini
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod('minggu_ini')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedPeriod === 'minggu_ini'
                      ? 'bg-white font-bold text-[#057A55] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Minggu Ini
                </button>
              </div>
            </div>

            {/* 3 Metrics Cards */}
            <div className="grid grid-cols-3 gap-2.5 md:gap-4">
              {/* Card 1: Omset */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-xl md:rounded-2xl p-3 md:p-4 border border-emerald-100 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] md:text-xs font-semibold text-slate-600">Total Omset</span>
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-[#057A55]">
                    <CreditCard size={15} />
                  </div>
                </div>
                <div>
                  <span className="text-sm md:text-2xl font-extrabold text-slate-900 leading-tight block truncate">
                    {currentData.omset}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-emerald-700 mt-1">
                    <TrendingUp size={13} />
                    <span>{currentData.omsetTrend}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Transaksi */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-xl md:rounded-2xl p-3 md:p-4 border border-blue-100 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] md:text-xs font-semibold text-slate-600">Total Transaksi</span>
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                    <Receipt size={15} />
                  </div>
                </div>
                <div>
                  <span className="text-sm md:text-2xl font-extrabold text-slate-900 leading-tight block truncate">
                    {currentData.transaksi}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-blue-700 mt-1">
                    <ArrowUpRight size={13} />
                    <span>{currentData.transaksiAvg}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Keuntungan */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-xl md:rounded-2xl p-3 md:p-4 border border-amber-100 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] md:text-xs font-semibold text-slate-600">Keuntungan Bersih</span>
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                    <Sparkles size={15} />
                  </div>
                </div>
                <div>
                  <span className="text-sm md:text-2xl font-extrabold text-slate-900 leading-tight block truncate">
                    {currentData.keuntungan}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-amber-700 mt-1">
                    <span>{currentData.margin}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Top 3 Selling Menu Items */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md shadow-slate-200/70 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  {selectedPeriod === 'hari_ini' ? 'Top 3 Menu Terlaris Hari Ini' : 'Top 3 Menu Terlaris Minggu Ini'}
                </h2>
                <p className="text-[11px] md:text-xs text-slate-500">Produk yang paling berkontribusi pada omset toko</p>
              </div>
              <button
                type="button"
                onClick={() => handleNav('/reports')}
                className="text-xs md:text-sm font-semibold text-[#057A55] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="space-y-3 md:space-y-4">
              {topSellingItems.map((item) => (
                <div key={item.id} className="p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-bold text-slate-800 truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-[11px] md:text-xs text-slate-500 mt-0.5 block">
                        {item.category} • {item.sold} Porsi Terjual
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs md:text-sm font-extrabold text-[#057A55]">
                        {item.revenue}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex items-center">
                    <div
                      className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] md:text-xs text-slate-500 mt-1.5 font-medium">
                    <span>Pencapaian Target Harian</span>
                    <span className="font-bold text-slate-700">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Live Recent Transactions Feed */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md shadow-slate-200/70 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  Transaksi Terakhir
                </h2>
                <p className="text-[11px] md:text-xs text-slate-500">Aktivitas struk kasir real-time</p>
              </div>
              <button
                type="button"
                onClick={() => handleNav('/reports')}
                className="text-xs md:text-sm font-semibold text-[#057A55] hover:underline cursor-pointer"
              >
                Riwayat Lengkap
              </button>
            </div>

            <div className="space-y-2.5">
              {recentTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#057A55] flex items-center justify-center shrink-0">
                      <Receipt size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-bold text-slate-800">{trx.id}</span>
                        <span className="text-[10px] md:text-xs text-slate-400 flex items-center gap-0.5">
                          <Clock size={11} />
                          {trx.time}
                        </span>
                      </div>
                      <p className="text-[11px] md:text-xs text-slate-500 truncate max-w-[200px] md:max-w-md">
                        {trx.items}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs md:text-sm font-bold text-slate-900 block">{trx.total}</span>
                    <span className="text-[10px] md:text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {trx.payment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Span 1 on desktop (Peringatan Stok Kritis & Aksi Cepat) */}
        <div className="md:col-span-1 space-y-4 md:space-y-6">
          
          {/* 1. Critical Stock Alert Banner */}
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-2xl p-4 md:p-5 text-white shadow-md shadow-amber-500/20 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white shrink-0 mt-0.5">
                <AlertTriangle size={22} className="animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-100">
                    Peringatan Stok Kritis
                  </span>
                  <span className="text-[10px] md:text-xs font-bold bg-white text-amber-800 px-2 py-0.5 rounded-full shadow-xs">
                    4 Item Menipis
                  </span>
                </div>
                <p className="text-xs md:text-sm text-white/95 mt-1.5 leading-snug">
                  Beberapa item telah berada di bawah batas minimum stok dan perlu segera dipesan ulang ke distributor.
                </p>

                {/* Stock Items Breakdown */}
                <div className="mt-3 space-y-1.5 bg-black/15 p-2.5 rounded-xl border border-white/10">
                  {criticalStockList.map((st, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] md:text-xs text-amber-50">
                      <span className="truncate pr-2">• {st.name}</span>
                      <span className="font-bold shrink-0 text-white bg-amber-700/60 px-1.5 py-0.2 rounded">
                        Sisa {st.remaining}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/20 flex items-center justify-between">
                  <span className="text-[11px] text-amber-100 hidden md:block">Buka modul inventaris</span>
                  <button
                    type="button"
                    onClick={() => handleNav('/inventory')}
                    className="w-full md:w-auto bg-white text-amber-800 hover:bg-amber-50 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Restok Barang Sekarang</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Action Buttons ("Aksi Cepat") */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-md shadow-slate-200/70 border border-slate-100">
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <h2 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Aksi Cepat
                </h2>
                <p className="text-[11px] text-slate-500 hidden md:block">Pintasan menu kasir & stok</p>
              </div>
            </div>

            {/* Mobile 4 cols / Desktop 2x2 grid */}
            <div className="grid grid-cols-4 md:grid-cols-2 gap-2 md:gap-3">
              {/* Action 1: POS / Kasir */}
              <button
                type="button"
                onClick={() => handleNav('/pos')}
                className="flex flex-col items-center justify-center p-2.5 md:p-4 bg-slate-50 md:bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 hover:bg-emerald-50/40 transition-all active:scale-95 group cursor-pointer"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-emerald-100 text-[#057A55] group-hover:bg-[#057A55] group-hover:text-white flex items-center justify-center mb-1.5 transition-colors shadow-xs">
                  <ShoppingBag size={22} />
                </div>
                <span className="text-[11px] md:text-xs font-bold text-slate-800 text-center leading-tight">
                  Kasir POS
                </span>
                <span className="text-[9px] md:text-[10px] text-slate-500 mt-0.5">Transaksi Baru</span>
              </button>

              {/* Action 2: Tambah Stok */}
              <button
                type="button"
                onClick={() => handleNav('/inventory')}
                className="flex flex-col items-center justify-center p-2.5 md:p-4 bg-slate-50 md:bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 hover:bg-teal-50/40 transition-all active:scale-95 group cursor-pointer"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center mb-1.5 transition-colors shadow-xs">
                  <PlusCircle size={22} />
                </div>
                <span className="text-[11px] md:text-xs font-bold text-slate-800 text-center leading-tight">
                  Tambah Stok
                </span>
                <span className="text-[9px] md:text-[10px] text-slate-500 mt-0.5">Input Barang</span>
              </button>

              {/* Action 3: Riwayat */}
              <button
                type="button"
                onClick={() => handleNav('/reports')}
                className="flex flex-col items-center justify-center p-2.5 md:p-4 bg-slate-50 md:bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 hover:bg-blue-50/40 transition-all active:scale-95 group cursor-pointer"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center mb-1.5 transition-colors shadow-xs">
                  <History size={22} />
                </div>
                <span className="text-[11px] md:text-xs font-bold text-slate-800 text-center leading-tight">
                  Riwayat
                </span>
                <span className="text-[9px] md:text-[10px] text-slate-500 mt-0.5">Struk Penjualan</span>
              </button>

              {/* Action 4: Laporan */}
              <button
                type="button"
                onClick={() => handleNav('/reports')}
                className="flex flex-col items-center justify-center p-2.5 md:p-4 bg-slate-50 md:bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 hover:bg-purple-50/40 transition-all active:scale-95 group cursor-pointer"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center mb-1.5 transition-colors shadow-xs">
                  <TrendingUp size={22} />
                </div>
                <span className="text-[11px] md:text-xs font-bold text-slate-800 text-center leading-tight">
                  Laporan
                </span>
                <span className="text-[9px] md:text-[10px] text-slate-500 mt-0.5">Analisis Omset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
