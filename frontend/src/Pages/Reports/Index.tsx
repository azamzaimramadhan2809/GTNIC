import { useSession, useData, dateRange, type Report } from '../../api';
import React, { useState, useRef, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import {
  CreditCard,
  Receipt,
  BarChart2,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronRight,
  Clock,
  Banknote,
  QrCode,
  Building2,
  Eye,
  Sparkles,
  ShoppingBag,
  X,
  Calendar,
  Star,
  Package,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Period = 'hari_ini' | '7_hari' | 'bulan_ini' | 'kustom';

interface MetricData {
  omset: number;
  profit: number;
  profitMargin: number;
  transaksi: number;
  avgOrder: number;
}

interface DailyPoint {
  label: string;
  revenue: number;
  profit: number;
  transactions: number;
}

interface TopProduct {
  rank: number;
  name: string;
  category: string;
  sold: number;
  revenue: number;
  percentage: number;
  icon: string;
}

interface CategoryShare {
  name: string;
  percentage: number;
  revenue: number;
  color: string;
}

interface Transaction {
  id: string;
  time: string;
  date: string;
  items: string;
  itemCount: number;
  payment: 'Tunai' | 'QRIS' | 'Transfer';
  total: number;
  status: 'selesai' | 'refund';
}

// ─────────────────────────────────────────────
// Formatting and chart helpers
// ─────────────────────────────────────────────
const formatRp = (n: number, compact = false): string => {
  if (compact) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.0', '')}jt`;
    if (n >= 1_000)     return `Rp ${(n / 1_000).toFixed(0)}rb`;
  }
  return `Rp ${n.toLocaleString('id-ID')}`;
};

const paymentIcon = (p: Transaction['payment']) => {
  if (p === 'QRIS')     return <QrCode size={13} className="shrink-0" />;
  if (p === 'Transfer') return <Building2 size={13} className="shrink-0" />;
  return <Banknote size={13} className="shrink-0" />;
};

const paymentColor = (p: Transaction['payment']) => {
  if (p === 'QRIS')     return 'bg-purple-100 text-purple-700';
  if (p === 'Transfer') return 'bg-blue-100 text-blue-700';
  return 'bg-emerald-100 text-emerald-700';
};

const rankColor = (r: number) => {
  if (r === 1) return 'bg-amber-400 text-white';
  if (r === 2) return 'bg-slate-400 text-white';
  if (r === 3) return 'bg-amber-600 text-white';
  return 'bg-slate-200 text-slate-600';
};

// ─────────────────────────────────────────────
// SVG Bar Chart
// ─────────────────────────────────────────────
// Trend Bar Chart (dynamic per period & metric)
// ─────────────────────────────────────────────
const TrendBarChart: React.FC<{
  data: DailyPoint[];
  activeMetric: 'revenue' | 'profit' | 'transactions';
}> = ({ data, activeMetric }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const values = data.map(d =>
    activeMetric === 'revenue' ? d.revenue : activeMetric === 'profit' ? d.profit : d.transactions
  );
  const maxVal = Math.max(...values, 1);

  const W = 600, H = 180, PAD_LEFT = 8, PAD_RIGHT = 8, PAD_BOTTOM = 28;
  const BAR_GAP = data.length > 6 ? 8 : 14;
  const barWidth = (W - PAD_LEFT - PAD_RIGHT - BAR_GAP * (data.length - 1)) / data.length;

  const barColor      = activeMetric === 'revenue' ? '#057A55' : activeMetric === 'profit' ? '#0891b2' : '#d97706';
  const barColorLight = activeMetric === 'revenue' ? '#bbf7d0' : activeMetric === 'profit' ? '#bae6fd' : '#fde68a';

  const formatTooltip = (val: number) =>
    activeMetric === 'transactions' ? `${val} Struk` : formatRp(val, true);

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H + PAD_BOTTOM}`}
        className="w-full"
        style={{ minWidth: 280 }}
        role="img"
        aria-label="Sales trend bar chart"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(frac => {
          const y = H - frac * H;
          return (
            <line key={frac} x1={PAD_LEFT} y1={y} x2={W - PAD_RIGHT} y2={y}
              stroke="#f1f5f9" strokeWidth="1" />
          );
        })}

        {data.map((d, i) => {
          const val  = values[i];
          const barH = (val / maxVal) * (H - 8);
          const x    = PAD_LEFT + i * (barWidth + BAR_GAP);
          const y    = H - barH;
          const hov  = hoveredIdx === i;
          const ttLabel = formatTooltip(val);
          const ttWidth = activeMetric === 'transactions' ? 72 : 86;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Bar background track */}
              <rect x={x} y={8} width={barWidth} height={H - 8}
                rx={6} fill={barColorLight} opacity={0.35} />

              {/* Active bar with smooth height transition via CSS */}
              <rect
                x={x} y={y} width={barWidth} height={barH}
                rx={6}
                fill={barColor}
                opacity={hov ? 1 : 0.82}
                style={{ transition: 'height 0.4s ease, y 0.4s ease, opacity 0.2s ease' }}
              />

              {/* Hover tooltip */}
              {hov && (
                <g>
                  <rect
                    x={Math.min(x + barWidth / 2 - ttWidth / 2, W - ttWidth - 4)}
                    y={Math.max(y - 38, 2)}
                    width={ttWidth} height={26}
                    rx={7} fill="#0f172a" opacity={0.92}
                  />
                  <text
                    x={Math.min(x + barWidth / 2, W - ttWidth / 2 - 4)}
                    y={Math.max(y - 22, 17)}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="white"
                  >
                    {ttLabel}
                  </text>
                </g>
              )}

              {/* X-axis label */}
              <text
                x={x + barWidth / 2} y={H + PAD_BOTTOM - 6}
                textAnchor="middle"
                fontSize="10"
                fontWeight={hov ? '700' : '600'}
                fill={hov ? barColor : '#94a3b8'}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────
// Receipt Modal
// ─────────────────────────────────────────────
const ReceiptModal: React.FC<{ trx: Transaction | null; onClose: () => void }> = ({ trx, onClose }) => {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (trx) document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [trx, onClose]);

  if (!trx) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:max-w-sm bg-white rounded-t-3xl md:rounded-2xl shadow-2xl z-10 animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#057A55] text-white px-5 pt-6 pb-8 text-center relative">
          <button onClick={onClose} className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors cursor-pointer">
            <X size={16} />
          </button>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Receipt size={24} className="text-white" />
          </div>
          <div className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-1">Struk Digital</div>
          <div className="font-mono text-sm font-bold">{trx.id}</div>
        </div>
        {/* Zigzag edge */}
        <div className="h-3 w-full bg-white"
          style={{ backgroundImage: 'radial-gradient(circle at 6px -2px, white 6px, #057A55 6px)', backgroundSize: '12px 6px', backgroundPosition: 'top' }} />

        <div className="px-5 pb-5 space-y-3 bg-white">
          <div className="flex justify-between text-xs text-slate-500 pt-2">
            <span>Tanggal</span><span className="font-semibold text-slate-800">{trx.date}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Waktu</span><span className="font-semibold text-slate-800">{trx.time} WIB</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Metode</span>
            <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${paymentColor(trx.payment)}`}>{trx.payment}</span>
          </div>
          <div className="border-t border-dashed border-slate-200 pt-3">
            <div className="text-xs text-slate-500 mb-1">Item yang dibeli:</div>
            <div className="text-xs font-semibold text-slate-800">{trx.items}</div>
          </div>
          <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-800">TOTAL BAYAR</span>
            <span className="text-xl font-extrabold text-[#057A55]">{formatRp(trx.total)}</span>
          </div>
          {trx.status === 'refund' && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs font-bold text-rose-700 text-center">
              ⚠ Transaksi ini telah di-REFUND
            </div>
          )}
          <button onClick={onClose} className="w-full mt-2 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors cursor-pointer">
            Tutup Struk
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Export Modal
// ─────────────────────────────────────────────
const ExportModal: React.FC<{ open: boolean; onClose: () => void; onExport: (type: string) => void }> = ({ open, onClose, onExport }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:max-w-sm bg-white rounded-t-3xl md:rounded-2xl shadow-2xl z-10 p-5 animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Unduh Laporan</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
        </div>
        <p className="text-xs text-slate-500 mb-4">Pilih format laporan yang ingin diunduh:</p>
        <div className="space-y-2.5">
          {[
            { icon: <FileSpreadsheet size={20} className="text-emerald-600" />, label: 'CSV (.csv)', sub: 'Daftar transaksi, dapat dibuka di Excel', type: 'excel', bg: 'bg-emerald-50 border-emerald-200' },
            { icon: <FileText size={20} className="text-rose-500" />,           label: 'Cetak / Simpan PDF',   sub: 'Laporan ringkasan siap cetak & bagikan',        type: 'pdf',   bg: 'bg-rose-50 border-rose-200'     },
          ].map(opt => (
            <button
              key={opt.type}
              onClick={() => { onExport(opt.type); onClose(); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border ${opt.bg} hover:opacity-90 transition-opacity cursor-pointer text-left`}
            >
              <div className="p-2.5 bg-white rounded-xl shadow-xs shrink-0">{opt.icon}</div>
              <div>
                <div className="text-sm font-bold text-slate-800">{opt.label}</div>
                <div className="text-[11px] text-slate-500">{opt.sub}</div>
              </div>
              <ChevronRight size={16} className="ml-auto text-slate-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export interface ReportsProps { onNavigate?: (path: string) => void; }

export const Reports: React.FC<ReportsProps> = ({ onNavigate }) => {
  const [period, setPeriod]           = useState<Period>('7_hari');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'profit' | 'transactions'>('revenue');
  const [receiptTrx, setReceiptTrx]   = useState<Transaction | null>(null);
  const [exportOpen, setExportOpen]   = useState(false);
  const [toast, setToast]             = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const {warung} = useSession();
  const [customFrom,setCustomFrom]=useState(()=>dateRange('bulan_ini').from);
  const [customTo,setCustomTo]=useState(()=>dateRange('hari_ini').to);
  const range=period==='kustom'?{from:customFrom,to:customTo}:dateRange(period);
  const {data,error}=useData<Report>('/warungs/'+warung.id+'/reports?date_from='+range.from+'&date_to='+range.to);
  const metrics: MetricData = {omset:data?.summary.revenue??0,profit:data?.summary.estimated_profit??0,profitMargin:data?.summary.profit_margin??0,transaksi:data?.summary.sales_count??0,avgOrder:data?.summary.average_order??0};
  const chartData=data?.chart??[];
  const topProds: TopProduct[]=data?.top_products??[];
  const cats: CategoryShare[]=(data?.categories??[]).map((c,i)=>({...c,color:['#057A55','#0891b2','#d97706','#7c3aed'][i%4]}));
  const visibleTrx: Transaction[]=data?.transactions??[];
  const periodLabel: Record<Period,string>={hari_ini:'Hari Ini','7_hari':'7 Hari Terakhir',bulan_ini:'Bulan Ini',kustom:'Kustom'};
  const handleExport=(type:string)=>{
    if(!data){showToast('Tunggu sampai laporan selesai dimuat.');return;}
    if(type==='pdf'){window.print();return;}
    const cell=(value:string|number)=>{const raw=String(value);return '"'+(/^[=+@-]/.test(raw)?"'"+raw:raw).replaceAll('"','""')+'"';};
    const rows=[['ID','Tanggal','Jam','Item','Metode','Total','Status'],...visibleTrx.map(t=>[t.id,t.date,t.time,t.items,t.payment,t.total,t.status])];
    const blob=new Blob(['\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='laporan-'+range.from+'-'+range.to+'.csv';link.click();URL.revokeObjectURL(url);
  };

  return (
    <AppLayout title="Laporan Keuangan" currentPath="/reports" onNavigate={onNavigate}>
      {error && <p role="alert" className="p-4 text-red-600">{error}</p>}
      {!data && !error && <p className="p-4">Memuat laporan...</p>}
      {period==='kustom' && <div className="flex gap-3 p-3"><label>Dari <input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)} /></label><label>Sampai <input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)} /></label></div>}
      <p className="p-3 text-xs text-slate-500">{data?.profit_basis} Perbandingan periode belum tersedia.</p>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-4 right-4 z-[200] pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-[#057A55] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold max-w-xs">
            {toast}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <ReceiptModal trx={receiptTrx} onClose={() => setReceiptTrx(null)} />
      <ExportModal  open={exportOpen} onClose={() => setExportOpen(false)} onExport={handleExport} />

      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <div className="bg-[#057A55] text-white pt-6 pb-5 px-5 rounded-b-[24px] md:rounded-2xl md:p-6 shadow-md shadow-emerald-950/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <BarChart2 size={20} className="text-emerald-200" />
              <h1 className="text-lg md:text-2xl font-bold text-white leading-tight">Laporan & Analitik</h1>
            </div>
            <p className="text-xs md:text-sm text-emerald-100/90 mt-0.5">
              Pantau omset, keuntungan, dan tren penjualan warung secara real-time
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Period Tabs */}
            <div className="flex items-center bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-1 gap-1">
              {(['hari_ini', '7_hari', 'bulan_ini', 'kustom'] as Period[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] md:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    period === p
                      ? 'bg-white text-[#057A55] shadow-sm'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  {periodLabel[p]}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button
              type="button"
              onClick={() => setExportOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#057A55] hover:bg-emerald-50 rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Unduh Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          4 KPI METRIC CARDS
      ════════════════════════════════════════ */}
      <div className="px-4 md:px-0 -mt-3 md:mt-4 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

          {/* Omset */}
          <div className="bg-white rounded-2xl p-3.5 md:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Omset</span>
              <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700"><CreditCard size={14} /></div>
            </div>
            <div className="text-lg md:text-2xl font-extrabold text-slate-900 leading-tight">
              {formatRp(metrics.omset, true)}
            </div>
            <div className="mt-1.5 text-[11px] font-semibold text-slate-500">Penjualan tanpa pajak</div>
          </div>

          {/* Keuntungan */}
          <div className="bg-white rounded-2xl p-3.5 md:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Keuntungan</span>
              <div className="p-1.5 rounded-xl bg-blue-100 text-blue-700"><Sparkles size={14} /></div>
            </div>
            <div className="text-lg md:text-2xl font-extrabold text-slate-900 leading-tight">
              {formatRp(metrics.profit, true)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {metrics.profitMargin}% margin
              </span>
              <span className="text-[11px] font-semibold text-slate-500">estimasi</span>
            </div>
          </div>

          {/* Transaksi */}
          <div className="bg-white rounded-2xl p-3.5 md:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Transaksi</span>
              <div className="p-1.5 rounded-xl bg-amber-100 text-amber-700"><Receipt size={14} /></div>
            </div>
            <div className="text-lg md:text-2xl font-extrabold text-slate-900 leading-tight">
              {metrics.transaksi.toLocaleString('id-ID')} struk
            </div>
            <div className="mt-1.5 text-[11px] font-semibold text-slate-500">Transaksi selesai</div>
          </div>

          {/* Rata-rata */}
          <div className="bg-white rounded-2xl p-3.5 md:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Rata-rata Transaksi</span>
              <div className="p-1.5 rounded-xl bg-purple-100 text-purple-700"><ShoppingBag size={14} /></div>
            </div>
            <div className="text-lg md:text-2xl font-extrabold text-slate-900 leading-tight">
              {formatRp(metrics.avgOrder, true)}
            </div>
            <div className="mt-1.5 text-[11px] font-semibold text-slate-500">Per transaksi selesai</div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MAIN 2-COLUMN LAYOUT (desktop)
      ════════════════════════════════════════ */}
      <div className="px-4 md:px-0 mt-4 space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-5">

        {/* ── LEFT COL (span 2): Chart + Transactions ── */}
        <div className="md:col-span-2 space-y-4">

          {/* SALES TREND CHART */}
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm md:text-base font-bold text-slate-900">Tren Penjualan</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {period === 'hari_ini' ? 'Per jam' : period === '7_hari' ? 'Per hari' : period === 'bulan_ini' ? 'Per minggu' : 'Per rentang'} — hover bar untuk detail nilai
                </p>
              </div>
              {/* Metric toggle tabs */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 self-start sm:self-auto">
                {([
                  ['revenue',      'Omset',     '#057A55'],
                  ['profit',       'Laba',      '#0891b2'],
                  ['transactions', 'Transaksi', '#d97706'],
                ] as const).map(([key, label, color]) => (
                  <button
                    key={key}
                    id={`chart-tab-${key}`}
                    onClick={() => setChartMetric(key)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                      chartMetric === key ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                    style={chartMetric === key ? { color } : {}}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic bar chart — heights recalculate per tab & period */}
            <TrendBarChart data={chartData} activeMetric={chartMetric} />

            {/* Dynamic bottom metrics — show breakdown for active tab and period */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
              {([
                {
                  key:   'revenue' as const,
                  label: 'Total Omset',
                  value: formatRp(metrics.omset, true),
                  color: '#057A55',
                },
                {
                  key:   'profit' as const,
                  label: 'Total Laba',
                  value: formatRp(metrics.profit, true),
                  color: '#0891b2',
                },
                {
                  key:   'transactions' as const,
                  label: 'Transaksi',
                  value: `${metrics.transaksi.toLocaleString('id-ID')} Struk`,
                  color: '#d97706',
                },
              ].map(item => {
                const isActive = chartMetric === item.key;
                return (
                  <button
                    key={item.key}
                    id={`chart-metric-summary-${item.key}`}
                    onClick={() => setChartMetric(item.key)}
                    className={`text-center rounded-xl px-2 py-2 transition-all duration-200 cursor-pointer border-2 ${
                      isActive
                        ? 'border-current bg-slate-50 shadow-sm scale-[1.03]'
                        : 'border-transparent hover:bg-slate-50/70'
                    }`}
                    style={isActive ? { borderColor: item.color + '55' } : {}}
                  >
                    <div className={`text-[10px] font-semibold transition-colors duration-200 ${
                      isActive ? 'font-bold' : 'text-slate-400'
                    }`} style={isActive ? { color: item.color } : {}}>
                      {item.label}
                    </div>
                    <div
                      className="text-sm font-extrabold mt-0.5 transition-all duration-200"
                      style={{ color: isActive ? item.color : '#94a3b8' }}
                    >
                      {item.value}
                    </div>
                    {/* Period breakdown mini-labels */}
                    <div className="flex justify-between mt-1.5 gap-0.5 overflow-x-hidden">
                      {chartData.slice(0, 5).map((pt, idx) => {
                        const val = item.key === 'revenue' ? pt.revenue : item.key === 'profit' ? pt.profit : pt.transactions;
                        return (
                          <div key={idx} className="flex-1 text-center min-w-0">
                            <div
                              className="text-[8px] font-semibold leading-tight truncate"
                              style={{ color: isActive ? item.color + 'cc' : '#cbd5e1' }}
                            >
                              {item.key === 'transactions' ? val : formatRp(val, true)}
                            </div>
                            <div className="text-[7px] text-slate-400 leading-tight truncate">{pt.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </button>
                );
              }))}
            </div>
          </div>

          {/* RECENT TRANSACTIONS TABLE */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm md:text-base font-bold text-slate-900">Riwayat Transaksi</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Struk kasir — {periodLabel[period]}</p>
              </div>
              <span className="text-xs text-slate-500 font-medium">{visibleTrx.length} struk</span>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Kode Struk', 'Waktu', 'Item', 'Metode', 'Total Bayar', 'Aksi'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {visibleTrx.map(trx => (
                    <tr key={trx.id} className={`hover:bg-slate-50/60 transition-colors ${trx.status === 'refund' ? 'opacity-60' : ''}`}>
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">{trx.id.slice(-9)}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          <Clock size={11} className="text-slate-400" /> {trx.time} WIB
                        </div>
                        <div className="text-[10px] text-slate-400">{trx.date}</div>
                      </td>
                      <td className="px-5 py-3 max-w-[180px]">
                        <div className="text-xs text-slate-700 truncate">{trx.items}</div>
                        <div className="text-[10px] text-slate-400">{trx.itemCount} jenis produk</div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${paymentColor(trx.payment)}`}>
                          {paymentIcon(trx.payment)}{trx.payment}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-sm font-extrabold text-slate-900">{formatRp(trx.total)}</div>
                        {trx.status === 'refund' && (
                          <span className="text-[10px] font-bold text-rose-600">REFUND</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setReceiptTrx(trx)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-[#057A55] text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Eye size={12} /> Lihat Struk
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-50">
              {visibleTrx.map(trx => (
                <div key={trx.id} className={`p-4 flex items-center gap-3 ${trx.status === 'refund' ? 'opacity-60' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#057A55] flex items-center justify-center shrink-0">
                    <Receipt size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-bold text-slate-600">{trx.id.slice(-9)}</span>
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${paymentColor(trx.payment)}`}>
                        {paymentIcon(trx.payment)}{trx.payment}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{trx.items}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {trx.time} • {trx.date}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold text-slate-900">{formatRp(trx.total, true)}</div>
                    <button
                      onClick={() => setReceiptTrx(trx)}
                      className="text-[11px] text-[#057A55] font-semibold mt-1 hover:underline cursor-pointer flex items-center gap-0.5 ml-auto"
                    >
                      <Eye size={11} /> Struk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COL (span 1): Top Products + Category ── */}
        <div className="space-y-4">

          {/* TOP SELLING PRODUCTS */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Produk Terlaris</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{periodLabel[period]}</p>
              </div>
              <Star size={15} className="text-amber-400 fill-amber-400" />
            </div>

            <div className="space-y-3">
              {topProds.map(prod => (
                <div key={prod.rank} className="flex items-center gap-3">
                  {/* Rank badge */}
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${rankColor(prod.rank)}`}>
                    {prod.rank}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base leading-none">{prod.icon}</span>
                      <span className="text-xs font-bold text-slate-800 truncate">{prod.name}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${prod.percentage}%`,
                            background: prod.rank <= 3 ? '#057A55' : '#94a3b8',
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 shrink-0">{prod.percentage}%</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-extrabold text-[#057A55]">{formatRp(prod.revenue, true)}</div>
                    <div className="text-[10px] text-slate-400">{prod.sold} terjual</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORY BREAKDOWN */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Kontribusi Kategori</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Share penjualan per kategori</p>
              </div>
              <Package size={15} className="text-slate-400" />
            </div>

            {/* Stacked bar */}
            <div className="flex h-3 rounded-full overflow-hidden mb-4 gap-0.5">
              {cats.map(cat => (
                <div
                  key={cat.name}
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  title={`${cat.name}: ${cat.percentage}%`}
                />
              ))}
            </div>

            <div className="space-y-3">
              {cats.map(cat => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-semibold text-slate-700">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">{cat.percentage}%</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">{formatRp(cat.revenue, true)}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color + 'cc' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK PERIOD SUMMARY */}
          <div className="bg-gradient-to-br from-[#057A55] to-emerald-600 rounded-2xl p-4 md:p-5 text-white shadow-md shadow-emerald-800/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={15} className="text-emerald-200" />
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">Ringkasan {periodLabel[period]}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Omset',      value: formatRp(metrics.omset, true)     },
                  { label: 'Laba Bersih',value: formatRp(metrics.profit, true)    },
                  { label: 'Transaksi',  value: `${metrics.transaksi} struk`      },
                  { label: 'Avg/Struk',  value: formatRp(metrics.avgOrder, true)  },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-[10px] text-emerald-200">{s.label}</div>
                    <div className="text-sm font-extrabold text-white">{s.value}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setExportOpen(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <Download size={13} /> Unduh Laporan Periode Ini
              </button>
            </div>
          </div>
        </div>
      </div>

    </AppLayout>
  );
};

export default Reports;
