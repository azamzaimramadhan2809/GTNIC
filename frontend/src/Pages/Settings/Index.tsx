import React, { useState, useRef, useEffect, useMemo } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { useAuth } from '../../Context/AuthContext';
import {
  Store,
  Receipt,
  CreditCard,
  Users,
  Save,
  Camera,
  QrCode,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Trash2,
  Lock,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Building2,
  ChevronRight,
  Sliders,
  X,
  Printer,
  Wifi,
  Banknote,
  Search,
  History,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

export interface SettingsProps {
  onNavigate?: (path: string) => void;
}

type TabType = 'profil' | 'struk' | 'pembayaran' | 'staf' | 'audit';

interface Staff {
  id: number;
  name: string;
  role: 'Owner' | 'Kasir' | 'Supervisor' | 'Gudang';
  phone: string;
  pin: string;
  active: boolean;
  avatar: string;
  color: string;
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const { accessLogs, clearAccessLogs, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profil');
  const [toast, setToast] = useState<{ msg: string; icon: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto fallback to 'profil' if a cashier accesses Settings and audit tab was active
  useEffect(() => {
    if (userRole !== 'owner' && activeTab === 'audit') {
      setActiveTab('profil');
    }
  }, [userRole, activeTab]);

  // Audit Logs Filter State
  const [auditSearch, setAuditSearch] = useState('');
  const [auditStatusFilter, setAuditStatusFilter] = useState<'all' | 'Granted' | 'Denied'>('all');

  const filteredAuditLogs = useMemo(() => {
    return accessLogs.filter(log => {
      const matchesStatus = auditStatusFilter === 'all' || log.status === auditStatusFilter;
      const matchesSearch = !auditSearch.trim() || 
        log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.pageAccessed.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.timestamp.toLowerCase().includes(auditSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [accessLogs, auditSearch, auditStatusFilter]);

  const auditStats = useMemo(() => {
    const total = accessLogs.length;
    const granted = accessLogs.filter(l => l.status === 'Granted').length;
    const denied = accessLogs.filter(l => l.status === 'Denied').length;
    return { total, granted, denied };
  }, [accessLogs]);

  const showToast = (msg: string, icon = '✅') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, icon });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  // ─────────────────────────────────────────────
  // 1. Profil Toko State
  // ─────────────────────────────────────────────
  const [storeProfile, setStoreProfile] = useState({
    name: 'Warung Berkah Jaya',
    category: 'Kelontong & Sembako',
    phone: '0812-3456-7890',
    address: 'Jl. Melati No. 42, RT 03/RW 05, Kebayoran Baru, Jakarta Selatan',
    openHours: '07:00 - 22:00 WIB',
    slogan: 'Belanja hemat, dekat, dan bersahabat untuk warga sekitar',
    npwp: '31.452.890.1-012.000',
    currency: 'IDR (Rp)',
  });

  // ─────────────────────────────────────────────
  // 2. Pengaturan Struk State
  // ─────────────────────────────────────────────
  const [receiptSettings, setReceiptSettings] = useState({
    headerGreeting: 'Selamat Datang di Warung Berkah Jaya!',
    footerNote: 'Terima kasih telah berbelanja! Barang yang sudah dibeli tidak dapat ditukar kecuali ada perjanjian sebelumnya.',
    showLogo: true,
    showQrisOnReceipt: true,
    showWifi: true,
    wifiInfo: 'WiFi: WarungBerkah_Free / Pass: berkah123',
    paperWidth: '58mm',
    autoCut: true,
    includeCashierName: true,
  });

  // ─────────────────────────────────────────────
  // 3. Metode Pembayaran State
  // ─────────────────────────────────────────────
  const [paymentMethods, setPaymentMethods] = useState({
    cash: { enabled: true, label: 'Uang Tunai (Cash)', mdr: '0% Free' },
    qris: { enabled: true, label: 'QRIS Universal (GoPay, OVO, Dana, LinkAja)', mdr: '0.7% MDR Standar' },
    gopay: { enabled: true, label: 'GoPay / OVO Direct Push', mdr: '0.7% Instan' },
    shopeepay: { enabled: true, label: 'ShopeePay & DANA QR', mdr: '0.7% Instan' },
    transfer: { enabled: true, label: 'Transfer Antar Bank Langsung', mdr: '0% Free' },
  });

  const [qrisConfig, setQrisConfig] = useState({
    merchantId: 'NMID-ID102030405060',
    merchantName: 'WARUNG BERKAH JAYA',
    bankName: 'BCA (Bank Central Asia)',
    accountNumber: '8420-1928-33',
    accountHolder: 'Budi Santoso',
  });

  // ─────────────────────────────────────────────
  // 4. Manajemen Staf State
  // ─────────────────────────────────────────────
  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: 1,
      name: 'Juragan Budi',
      role: 'Owner',
      phone: '0812-3456-7890',
      pin: '2809',
      active: true,
      avatar: 'JB',
      color: 'bg-emerald-600',
    },
    {
      id: 2,
      name: 'Siti Rahmawati',
      role: 'Kasir',
      phone: '0813-9876-5432',
      pin: '1234',
      active: true,
      avatar: 'SR',
      color: 'bg-teal-600',
    },
    {
      id: 3,
      name: 'Ahmad Fauzi',
      role: 'Kasir',
      phone: '0857-1122-3344',
      pin: '5678',
      active: true,
      avatar: 'AF',
      color: 'bg-blue-600',
    },
    {
      id: 4,
      name: 'Doni Saputra',
      role: 'Gudang',
      phone: '0878-3344-5566',
      pin: '9012',
      active: false,
      avatar: 'DS',
      color: 'bg-slate-500',
    },
  ]);

  const [addStaffModal, setAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'Kasir' as Staff['role'],
    phone: '',
    pin: '',
  });

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tabLabels: Record<TabType, string> = {
      profil: 'Profil Toko',
      struk: 'Format Struk Kasir',
      pembayaran: 'Metode Pembayaran',
      staf: 'Manajemen Staf',
      audit: 'Riwayat Akses & Keamanan',
    };
    showToast(`Pengaturan ${tabLabels[activeTab]} berhasil disimpan & disinkronkan!`);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.phone.trim()) {
      alert('Nama dan nomor telepon staf wajib diisi!');
      return;
    }
    const initials = newStaff.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const created: Staff = {
      id: Date.now(),
      name: newStaff.name.trim(),
      role: newStaff.role,
      phone: newStaff.phone.trim(),
      pin: newStaff.pin || '1234',
      active: true,
      avatar: initials || 'ST',
      color: newStaff.role === 'Owner' ? 'bg-emerald-600' : newStaff.role === 'Supervisor' ? 'bg-purple-600' : 'bg-teal-600',
    };

    setStaffList(prev => [...prev, created]);
    setNewStaff({ name: '', role: 'Kasir', phone: '', pin: '' });
    setAddStaffModal(false);
    showToast(`Staf "${created.name}" (${created.role}) berhasil ditambahkan!`);
  };

  const handleDeleteStaff = (id: number) => {
    const staff = staffList.find(s => s.id === id);
    if (staff?.role === 'Owner') {
      alert('Akun Pemilik (Owner) tidak dapat dihapus!');
      return;
    }
    if (window.confirm(`Hapus staf ${staff?.name}?`)) {
      setStaffList(prev => prev.filter(s => s.id !== id));
      showToast(`Staf "${staff?.name}" telah dihapus.`, '🗑️');
    }
  };

  const handleToggleStaffActive = (id: number) => {
    setStaffList(prev =>
      prev.map(s => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const navTabs = [
    { id: 'profil' as TabType, label: 'Profil Toko', icon: Store, desc: 'Identitas & Alamat' },
    { id: 'struk' as TabType, label: 'Pengaturan Struk', icon: Receipt, desc: 'Format & Live Preview' },
    { id: 'pembayaran' as TabType, label: 'Metode Pembayaran', icon: CreditCard, desc: 'QRIS, Bank & Dompet' },
    { id: 'staf' as TabType, label: 'Manajemen Staf', icon: Users, desc: 'Akun Kasir & Hak Akses' },
    ...(userRole === 'owner'
      ? [{ id: 'audit' as TabType, label: 'Riwayat Akses', icon: ShieldCheck, desc: 'Audit Log & Keamanan PIN' }]
      : []),
  ];

  return (
    <AppLayout title="Pengaturan Toko" currentPath="/settings" onNavigate={onNavigate}>
      
      {/* ── Toast Notification ── */}
      {toast && (
        <div className="fixed top-4 right-4 z-[200] pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-[#057A55] text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center gap-2.5 text-xs md:text-sm font-semibold max-w-sm">
            <span className="text-base">{toast.icon}</span>
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          HEADER SECTION
      ════════════════════════════════════════ */}
      <div className="bg-[#057A55] text-white pt-6 pb-5 px-5 rounded-b-[24px] md:rounded-2xl md:p-6 shadow-md shadow-emerald-950/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <Sliders size={20} className="text-emerald-200" />
              <h1 className="text-lg md:text-2xl font-bold text-white leading-tight">Pengaturan & Profil Toko</h1>
            </div>
            <p className="text-xs md:text-sm text-emerald-100/90 mt-0.5">
              Sesuaikan informasi operasional warung, kustomisasi struk thermal, rekening QRIS, dan akses kasir
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#057A55] hover:bg-emerald-50 rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <Save size={16} />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MAIN TABBED CONTENT
      ════════════════════════════════════════ */}
      <div className="px-4 md:px-0 mt-4 pb-20 md:pb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* ── LEFT NAVIGATION TABS (Desktop Vertical / Mobile Horizontal Pills) ── */}
          <div className="md:col-span-4 lg:col-span-3 space-y-1.5">
            {/* Mobile Horizontal Scrollable Pills */}
            <div className="flex md:hidden gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {navTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#057A55] text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop Vertical Menu Card */}
            <div className="hidden md:block bg-white rounded-2xl p-3 border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
                Menu Pengaturan
              </span>
              {navTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left cursor-pointer group ${
                      isActive
                        ? 'bg-[#057A55] text-white shadow-md shadow-emerald-800/15'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl transition-colors ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-[#057A55]'
                      }`}>
                        <Icon size={17} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate leading-tight">{tab.label}</div>
                        <div className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {tab.desc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={15} className={isActive ? 'text-emerald-200' : 'text-slate-300 group-hover:text-slate-500'} />
                  </button>
                );
              })}
            </div>

            {/* Quick Helper Box */}
            <div className="hidden md:block bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl p-4 border border-emerald-100/80 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={16} className="text-[#057A55]" />
                <span className="text-xs font-bold text-slate-900">Warung Berkah Jaya</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pengaturan ini langsung tersinkronisasi dengan seluruh printer thermal dan tablet kasir POS.
              </p>
            </div>
          </div>

          {/* ── RIGHT CONTENT PANEL (md:col-span-8 lg:col-span-9) ── */}
          <div className="md:col-span-8 lg:col-span-9 space-y-5">

            {/* ════════════════════════════════════════
                TAB 1: PROFIL TOKO
            ════════════════════════════════════════ */}
            {activeTab === 'profil' && (
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm md:text-base font-bold text-slate-900">Profil & Identitas Usaha</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Informasi dasar yang tampil pada struk dan akun digital warung</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-[#057A55] text-xs font-bold rounded-full">
                    Terverifikasi
                  </span>
                </div>

                {/* Logo & Banner Photo Placeholder */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#057A55] to-emerald-800 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shadow-emerald-950/20">
                      🏪
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera size={20} />
                    </div>
                  </div>
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <div className="text-xs font-bold text-slate-800">Logo / Foto Warung</div>
                    <p className="text-[11px] text-slate-500">
                      Format PNG, JPG maks 2MB. Logo akan dicetak di bagian atas struk thermal.
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => alert('Fitur upload gambar akan aktif setelah memilih file gambar logo.')}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                      >
                        Ganti Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast('Logo di-reset ke default.')}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Nama Toko / Warung <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={storeProfile.name}
                      onChange={e => setStoreProfile({ ...storeProfile, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Kategori Usaha <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={storeProfile.category}
                      onChange={e => setStoreProfile({ ...storeProfile, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all"
                    >
                      <option value="Kelontong & Sembako">Kelontong & Sembako</option>
                      <option value="Warung Makan & Minuman">Warung Makan & Minuman (F&B)</option>
                      <option value="Kedai Kopi & Warkop">Kedai Kopi & Warkop</option>
                      <option value="Toko Pulsa & Grosir">Toko Pulsa & Grosir</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Nomor WhatsApp Toko <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={storeProfile.phone}
                        onChange={e => setStoreProfile({ ...storeProfile, phone: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Jam Operasional
                    </label>
                    <div className="relative">
                      <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={storeProfile.openHours}
                        onChange={e => setStoreProfile({ ...storeProfile, openHours: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Alamat Lengkap Toko <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3.5 top-3 text-slate-400" />
                      <textarea
                        rows={2}
                        value={storeProfile.address}
                        onChange={e => setStoreProfile({ ...storeProfile, address: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Slogan / Catatan Sambutan Toko
                    </label>
                    <input
                      type="text"
                      value={storeProfile.slogan}
                      onChange={e => setStoreProfile({ ...storeProfile, slogan: e.target.value })}
                      placeholder="Contoh: Belanja hemat, dekat, dan bersahabat"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════
                TAB 2: PENGATURAN STRUK & LIVE PREVIEW
            ════════════════════════════════════════ */}
            {activeTab === 'struk' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Receipt Form Controls */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <h2 className="text-sm md:text-base font-bold text-slate-900">Kustomisasi Struk Thermal</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Atur tata letak dan pesan yang tercetak pada kertas struk kasir</p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                        Header / Pesan Pembuka
                      </label>
                      <input
                        type="text"
                        value={receiptSettings.headerGreeting}
                        onChange={e => setReceiptSettings({ ...receiptSettings, headerGreeting: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                        Footer / Pesan Penutup & Kebijakan
                      </label>
                      <textarea
                        rows={3}
                        value={receiptSettings.footerNote}
                        onChange={e => setReceiptSettings({ ...receiptSettings, footerNote: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                        Informasi WiFi Toko (Opsional)
                      </label>
                      <input
                        type="text"
                        value={receiptSettings.wifiInfo}
                        onChange={e => setReceiptSettings({ ...receiptSettings, wifiInfo: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                          Ukuran Kertas Printer
                        </label>
                        <select
                          value={receiptSettings.paperWidth}
                          onChange={e => setReceiptSettings({ ...receiptSettings, paperWidth: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55] transition-all"
                        >
                          <option value="58mm">58mm (Standar Portabel)</option>
                          <option value="80mm">80mm (Desktop Thermal)</option>
                        </select>
                      </div>

                      <div className="flex flex-col justify-end">
                        <button
                          type="button"
                          onClick={() => alert('Mengirim perintah test print ke printer thermal terhubung...')}
                          className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#057A55] font-bold text-xs rounded-xl border border-emerald-200/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Printer size={15} />
                          <span>Test Cetak Struk</span>
                        </button>
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      {[
                        { key: 'showLogo', label: 'Cetak Ikon / Logo Toko di Header' },
                        { key: 'showQrisOnReceipt', label: 'Cetak Kode QRIS Statis di Bagian Bawah' },
                        { key: 'showWifi', label: 'Tampilkan Info Password WiFi Pelanggan' },
                        { key: 'includeCashierName', label: 'Cetak Nama Kasir yang Bertugas' },
                      ].map(item => {
                        const isChecked = receiptSettings[item.key as keyof typeof receiptSettings] as boolean;
                        return (
                          <label key={item.key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer select-none">
                            <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => setReceiptSettings({ ...receiptSettings, [item.key]: e.target.checked })}
                              className="w-4 h-4 text-[#057A55] focus:ring-[#057A55] rounded cursor-pointer"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Live Thermal Receipt Preview */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <Receipt size={14} className="text-[#057A55]" />
                      Live Thermal Preview
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Kertas {receiptSettings.paperWidth}
                    </span>
                  </div>

                  {/* Physical Paper Simulation Card */}
                  <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 font-mono text-[11px] space-y-3 relative overflow-hidden select-none">
                    {/* Top Jagged Edge */}
                    <div
                      className="h-2.5 w-full bg-slate-100 -mt-5 -mx-5 mb-3"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 6px 0px, transparent 5px, white 6px)',
                        backgroundSize: '12px 6px',
                        backgroundPosition: 'bottom',
                      }}
                    />

                    {/* Receipt Content Header */}
                    <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-300">
                      {receiptSettings.showLogo && (
                        <div className="text-2xl mb-1">🏪</div>
                      )}
                      <div className="font-bold text-sm text-slate-900 uppercase">{storeProfile.name}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{storeProfile.address}</div>
                      <div className="text-[10px] text-slate-500">WA: {storeProfile.phone}</div>
                      {receiptSettings.headerGreeting && (
                        <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 py-0.5 px-2 rounded mt-1">
                          "{receiptSettings.headerGreeting}"
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex justify-between text-[10px] text-slate-500 border-b border-dashed border-slate-300 pb-2">
                      <div>
                        <div>TRX-20260912-9842</div>
                        {receiptSettings.includeCashierName && <div>Kasir: Siti Rahmawati</div>}
                      </div>
                      <div className="text-right">
                        <div>12 Sep 2026</div>
                        <div>14:20 WIB</div>
                      </div>
                    </div>

                    {/* Line Items Sample */}
                    <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-2.5">
                      <div className="flex justify-between">
                        <div>
                          <div>Kopi Susu Gula Aren</div>
                          <div className="text-[10px] text-slate-400">2 x Rp 15.000</div>
                        </div>
                        <div className="font-bold text-slate-800">Rp 30.000</div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div>Indomie Goreng + Telur</div>
                          <div className="text-[10px] text-slate-400">1 x Rp 15.000</div>
                        </div>
                        <div className="font-bold text-slate-800">Rp 15.000</div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div>Es Teh Manis Jumbo</div>
                          <div className="text-[10px] text-slate-400">1 x Rp 6.000</div>
                        </div>
                        <div className="font-bold text-slate-800">Rp 6.000</div>
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="space-y-1 pt-1 border-b border-dashed border-slate-300 pb-2">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span>Rp 51.000</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Diskon:</span>
                        <span>-Rp 0</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-300">
                        <span>TOTAL:</span>
                        <span className="text-[#057A55]">Rp 51.000</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                        <span>Pembayaran:</span>
                        <span>QRIS GoPay</span>
                      </div>
                    </div>

                    {/* QRIS Stamp if Enabled */}
                    {receiptSettings.showQrisOnReceipt && (
                      <div className="text-center pt-1 pb-1 border-b border-dashed border-slate-300 space-y-1">
                        <div className="inline-block p-1 bg-white border border-slate-300 rounded-lg">
                          <QrCode size={48} className="text-slate-800 mx-auto" />
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                          Scan QRIS untuk Bayar / Tips
                        </div>
                      </div>
                    )}

                    {/* WiFi Box if Enabled */}
                    {receiptSettings.showWifi && receiptSettings.wifiInfo && (
                      <div className="text-center bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-[9.5px] text-slate-600 flex items-center justify-center gap-1.5">
                        <Wifi size={11} className="text-[#057A55] shrink-0" />
                        <span>{receiptSettings.wifiInfo}</span>
                      </div>
                    )}

                    {/* Footer Text */}
                    <div className="text-center text-[9.5px] text-slate-500 pt-1 leading-relaxed">
                      {receiptSettings.footerNote}
                    </div>

                    {/* Bottom Jagged Edge */}
                    <div
                      className="h-2.5 w-full bg-slate-100 -mb-5 -mx-5 mt-4"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 6px 6px, transparent 5px, white 6px)',
                        backgroundSize: '12px 6px',
                        backgroundPosition: 'top',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════
                TAB 3: METODE PEMBAYARAN
            ════════════════════════════════════════ */}
            {activeTab === 'pembayaran' && (
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm md:text-base font-bold text-slate-900">Kanal & Metode Pembayaran Kasir</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Aktifkan channel pembayaran yang dapat dipilih oleh kasir saat transaksi</p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
                    <ShieldCheck size={14} />
                    <span>Multi-Payment Ready</span>
                  </div>
                </div>

                {/* Channel Toggles List */}
                <div className="space-y-3">
                  {([
                    {
                      key: 'cash',
                      icon: Banknote,
                      title: 'Uang Tunai (Cash)',
                      desc: 'Mendukung kalkulasi uang pas & hitung kembalian otomatis di POS.',
                      tag: 'Tanpa Biaya',
                      tagColor: 'bg-emerald-100 text-emerald-800',
                    },
                    {
                      key: 'qris',
                      icon: QrCode,
                      title: 'QRIS Statis & Dinamis Universal',
                      desc: 'Menerima pembayaran dari BCA, Mandiri, BRI, GoPay, OVO, Dana, ShopeePay & semua bank.',
                      tag: '0.7% MDR',
                      tagColor: 'bg-purple-100 text-purple-800',
                    },
                    {
                      key: 'gopay',
                      icon: Smartphone,
                      title: 'GoPay / OVO Direct Merchant',
                      desc: 'Integrasi direct push notifikasi pembayaran instan.',
                      tag: 'E-Wallet',
                      tagColor: 'bg-blue-100 text-blue-800',
                    },
                    {
                      key: 'transfer',
                      icon: Building2,
                      title: 'Transfer Bank Manual / Virtual Account',
                      desc: 'Konfirmasi bukti transfer m-banking langsung di layar kasir.',
                      tag: 'BCA / Mandiri',
                      tagColor: 'bg-teal-100 text-teal-800',
                    },
                  ] as const).map(item => {
                    const isEnabled = paymentMethods[item.key].enabled;
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.key}
                        className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                          isEnabled
                            ? 'bg-slate-50/60 border-slate-200 shadow-xs'
                            : 'bg-slate-50/30 border-slate-100 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                            isEnabled ? 'bg-emerald-100 text-[#057A55]' : 'bg-slate-200 text-slate-500'
                          }`}>
                            <Icon size={20} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs md:text-sm font-bold text-slate-800">{item.title}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${item.tagColor}`}>
                                {item.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                          </div>
                        </div>

                        {/* Toggle Switch */}
                        <button
                          type="button"
                          onClick={() =>
                            setPaymentMethods({
                              ...paymentMethods,
                              [item.key]: {
                                ...paymentMethods[item.key],
                                enabled: !isEnabled,
                              },
                            })
                          }
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer shrink-0 ${
                            isEnabled ? 'bg-[#057A55]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              isEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* QRIS & Rekening Configuration Box */}
                <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-100 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <QrCode size={18} className="text-[#057A55]" />
                    <h3 className="text-xs md:text-sm font-bold text-slate-900">Rekening Tujuan Penarikan & QRIS Merchant</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        NMID / Merchant ID QRIS
                      </label>
                      <input
                        type="text"
                        value={qrisConfig.merchantId}
                        onChange={e => setQrisConfig({ ...qrisConfig, merchantId: e.target.value })}
                        className="w-full px-3 py-2 text-xs md:text-sm font-mono bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#057A55]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Bank Penampung Dana
                      </label>
                      <select
                        value={qrisConfig.bankName}
                        onChange={e => setQrisConfig({ ...qrisConfig, bankName: e.target.value })}
                        className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#057A55]"
                      >
                        <option value="BCA (Bank Central Asia)">BCA (Bank Central Asia)</option>
                        <option value="Bank Mandiri">Bank Mandiri</option>
                        <option value="BRI (Bank Rakyat Indonesia)">BRI (Bank Rakyat Indonesia)</option>
                        <option value="BNI (Bank Negara Indonesia)">BNI (Bank Negara Indonesia)</option>
                        <option value="Bank Jago / Seabank">Bank Jago / Seabank</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Nomor Rekening Bank
                      </label>
                      <input
                        type="text"
                        value={qrisConfig.accountNumber}
                        onChange={e => setQrisConfig({ ...qrisConfig, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs md:text-sm font-mono bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#057A55]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Nama Pemilik Rekening
                      </label>
                      <input
                        type="text"
                        value={qrisConfig.accountHolder}
                        onChange={e => setQrisConfig({ ...qrisConfig, accountHolder: e.target.value })}
                        className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#057A55]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════
                TAB 4: MANAJEMEN STAF & KASIR
            ════════════════════════════════════════ */}
            {activeTab === 'staf' && (
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm md:text-base font-bold text-slate-900">Manajemen Pengguna & Kasir</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Kelola akun staf yang berhak mengakses terminal kasir dan stok</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddStaffModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#057A55] hover:bg-[#046c4e] text-white font-bold text-xs rounded-xl shadow-sm transition-all duration-200 active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <Plus size={15} />
                    <span>+ Tambah Kasir / Staf</span>
                  </button>
                </div>

                {/* Staff List Cards */}
                <div className="space-y-3">
                  {staffList.map(staf => (
                    <div
                      key={staf.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                        staf.active
                          ? 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
                          : 'bg-slate-50/30 border-slate-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-11 h-11 rounded-2xl ${staf.color} text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0`}>
                          {staf.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs md:text-sm font-bold text-slate-800">{staf.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                              staf.role === 'Owner'
                                ? 'bg-emerald-100 text-emerald-800'
                                : staf.role === 'Supervisor'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}>
                              {staf.role}
                            </span>
                            {!staf.active && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-600">
                                Nonaktif
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Phone size={11} /> {staf.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Lock size={11} /> PIN: {staf.pin}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Staff Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleStaffActive(staf.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            staf.active
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {staf.active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>

                        {staf.role !== 'Owner' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(staf.id)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors cursor-pointer"
                            title="Hapus staf"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════
                TAB 5: RIWAYAT AKSES & AUDIT LOG KEAMANAN (Owner Only)
            ════════════════════════════════════════ */}
            {userRole === 'owner' && activeTab === 'audit' && (
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm space-y-6">
                
                {/* Header & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#057A55] flex items-center justify-center shrink-0 shadow-xs">
                      <History size={22} strokeWidth={2.3} />
                    </div>
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                        Riwayat Akses & Audit Log Keamanan
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Rekam jejak otomatis verifikasi PIN Owner oleh kasir untuk modul sensitif
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {accessLogs.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAccessLogs}
                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        title="Hapus seluruh riwayat audit log"
                      >
                        <Trash2 size={14} />
                        <span>Bersihkan Log</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 1. Summary Metric Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 md:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Percobaan</span>
                      <ShieldCheck size={16} className="text-slate-400" />
                    </div>
                    <div className="text-xl md:text-2xl font-extrabold text-slate-900">{auditStats.total}</div>
                    <span className="text-[10px] text-slate-400">Verifikasi PIN tercatat</span>
                  </div>

                  <div className="p-3.5 md:p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Akses Diberikan</span>
                      <CheckCircle2 size={16} className="text-emerald-600" />
                    </div>
                    <div className="text-xl md:text-2xl font-extrabold text-emerald-800">{auditStats.granted}</div>
                    <span className="text-[10px] text-emerald-600 font-medium">PIN Sesuai (Granted)</span>
                  </div>

                  <div className="p-3.5 md:p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Akses Ditolak</span>
                      <ShieldAlert size={16} className="text-rose-600" />
                    </div>
                    <div className="text-xl md:text-2xl font-extrabold text-rose-800">{auditStats.denied}</div>
                    <span className="text-[10px] text-rose-600 font-medium">PIN Salah (Denied)</span>
                  </div>
                </div>

                {/* 2. Filter & Search Controls */}
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between pt-1">
                  {/* Status Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setAuditStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        auditStatusFilter === 'all'
                          ? 'bg-[#057A55] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Semua ({auditStats.total})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditStatusFilter('Granted')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        auditStatusFilter === 'Granted'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      <CheckCircle2 size={12} />
                      <span>Granted ({auditStats.granted})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditStatusFilter('Denied')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        auditStatusFilter === 'Denied'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      <ShieldAlert size={12} />
                      <span>Denied ({auditStats.denied})</span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      placeholder="Cari kasir, halaman, waktu..."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55]"
                    />
                  </div>
                </div>

                {/* 3. Log Records List / Table */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                  {filteredAuditLogs.length === 0 ? (
                    <div className="py-12 px-4 text-center bg-slate-50/50">
                      <History size={36} className="mx-auto text-slate-300 mb-2.5" />
                      <p className="text-sm font-bold text-slate-600">Tidak ada riwayat akses ditemukan</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {auditSearch ? 'Coba ubah kata kunci pencarian atau filter status' : 'Belum ada percobaan verifikasi PIN yang tercatat'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {/* Desktop Table Header */}
                      <div className="hidden sm:grid sm:grid-cols-[1.5fr_1.8fr_1.4fr_1.2fr] gap-3 px-4 py-2.5 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Pengguna / Kasir</span>
                        <span>Modul Terlindungi</span>
                        <span>Waktu Akses</span>
                        <span className="text-right">Status Otorisasi</span>
                      </div>

                      {/* Log Items */}
                      {filteredAuditLogs.map((log) => {
                        const isGranted = log.status === 'Granted';
                        return (
                          <div
                            key={log.id}
                            className="p-3.5 sm:px-4 sm:py-3.5 hover:bg-slate-50/80 transition-colors flex flex-col sm:grid sm:grid-cols-[1.5fr_1.8fr_1.4fr_1.2fr] sm:items-center gap-2 sm:gap-3 text-xs"
                          >
                            {/* User details */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-200 shrink-0">
                                {log.userName.includes('Siti') ? 'KS' : 'JB'}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-800 truncate">{log.userName}</div>
                                <div className="text-[10px] text-slate-400">Staf Kasir Toko</div>
                              </div>
                            </div>

                            {/* Page Accessed */}
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <span className="p-1 rounded-md bg-slate-100 text-slate-600 shrink-0">
                                <Lock size={12} />
                              </span>
                              <span className="font-semibold">{log.pageAccessed}</span>
                            </div>

                            {/* Timestamp */}
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                              <Clock size={13} className="text-slate-400 shrink-0" />
                              <span>{log.timestamp}</span>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center sm:justify-end">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                  isGranted
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}
                              >
                                {isGranted ? (
                                  <>
                                    <CheckCircle2 size={12} className="stroke-[2.5]" />
                                    <span>Granted</span>
                                  </>
                                ) : (
                                  <>
                                    <ShieldAlert size={12} className="stroke-[2.5]" />
                                    <span>Denied</span>
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Information Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-600">
                  <UserCheck size={18} className="text-[#057A55] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">
                      Standar Keamanan WarungPintar
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Setiap percobaan akses ke modul Laporan Keuangan dan Pengaturan Toko menggunakan PIN Owner otomatis tercatat dalam sistem audit log ini untuk mencegah akses tidak sah dan menjaga transparansi operasional toko.
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MODAL: TAMBAH STAF BARU
      ════════════════════════════════════════ */}
      {addStaffModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setAddStaffModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-[#057A55]">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Tambah Staf / Kasir Baru</h3>
                  <p className="text-[11px] text-slate-500">Berikan akses login kasir POS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddStaffModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Nama Lengkap Staf <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Contoh: Rian Hidayat"
                  className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Jabatan / Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={e => setNewStaff({ ...newStaff, role: e.target.value as Staff['role'] })}
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55]"
                  >
                    <option value="Kasir">Kasir POS</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Gudang">Staf Gudang</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    PIN Masuk Kasir (4 Digit)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={newStaff.pin}
                    onChange={e => setNewStaff({ ...newStaff, pin: e.target.value })}
                    placeholder="1234"
                    className="w-full px-3.5 py-2.5 text-xs md:text-sm font-mono tracking-widest text-center bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={newStaff.phone}
                    onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#057A55]/30 focus:border-[#057A55]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddStaffModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#057A55] hover:bg-[#046c4e] text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 cursor-pointer active:scale-95"
                >
                  Simpan Staf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AppLayout>
  );
};

export default Settings;
