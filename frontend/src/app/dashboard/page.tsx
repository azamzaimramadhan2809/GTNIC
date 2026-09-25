'use client'

import Link from 'next/link'
import { ArrowUpRight, Boxes, Eye, MessageCircle, MousePointerClick, Plus, TrendingUp } from 'lucide-react'
import { useStore } from '../../Context/StoreContext'

const bestSellers = [
  { name: 'Nasi Liwet Komplit', clicks: 184, width: '88%' },
  { name: 'Nasi Bakar Cumi', clicks: 142, width: '68%' },
  { name: 'Es Cendol Durian', clicks: 96, width: '46%' },
]

export default function DashboardOverviewPage() {
  const { storeData } = useStore()
  const stats = [
    { label: 'Pengunjung toko', value: '1.284', change: '+18,2%', icon: Eye, color: 'text-sky-400 bg-sky-400/10' },
    { label: 'Klik checkout WA', value: '326', change: '+12,8%', icon: MessageCircle, color: 'text-emerald-400 bg-emerald-400/10' },
    { label: 'Rasio checkout', value: '25,4%', change: '+3,1%', icon: MousePointerClick, color: 'text-violet-400 bg-violet-400/10' },
    { label: 'Produk aktif', value: String(storeData.products.filter(p=>p.isAvailable).length), change: `${storeData.products.length} total`, icon: Boxes, color: 'text-amber-400 bg-amber-400/10' },
  ]
  return <div className="mx-auto max-w-[1300px]"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">Overview hari ini</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Halo, {storeData.storeName} 👋</h1><p className="mt-2 text-sm text-slate-400">Pantau performa tokomu dari satu tempat.</p></div><Link href="/dashboard/products" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950"><Plus size={16}/>Tambah produk</Link></div><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({label,value,change,icon:Icon,color})=><article key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={18}/></span><span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400"><TrendingUp size={12}/>{change}</span></div><p className="mt-6 text-2xl font-bold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></article>)}</div><div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_.75fr]"><article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><div className="flex items-center justify-between"><div><h2 className="font-bold text-white">Aktivitas toko</h2><p className="mt-1 text-xs text-slate-500">Pengunjung dan checkout 7 hari terakhir</p></div><Link href="/dashboard/analytics" className="flex items-center gap-1 text-xs font-semibold text-emerald-400">Detail <ArrowUpRight size={14}/></Link></div><div className="mt-9 flex h-52 items-end gap-3">{[38,58,46,72,64,92,78].map((height,index)=><div key={index} className="flex flex-1 flex-col items-center gap-3"><div className="relative flex h-44 w-full items-end overflow-hidden rounded-lg bg-slate-800"><div className="w-full rounded-lg bg-gradient-to-t from-emerald-600 to-emerald-400" style={{height:`${height}%`}}/></div><span className="text-[10px] text-slate-600">{['Sen','Sel','Rab','Kam','Jum','Sab','Min'][index]}</span></div>)}</div></article><article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><h2 className="font-bold text-white">Produk terpopuler</h2><p className="mt-1 text-xs text-slate-500">Berdasarkan klik pelanggan</p><div className="mt-7 space-y-6">{bestSellers.map((item,index)=><div key={item.name}><div className="mb-2 flex justify-between text-xs"><span className="font-semibold text-slate-300">{index+1}. {item.name}</span><span className="text-slate-500">{item.clicks}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-emerald-500" style={{width:item.width}}/></div></div>)}</div></article></div></div>
}
