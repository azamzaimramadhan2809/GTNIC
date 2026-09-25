'use client'

import { useState } from 'react'
import { Link2, Store } from 'lucide-react'
import { ProfileEditor } from '../../../Components/dashboard/ProfileEditor'
import { LinksEditor } from '../../../Components/dashboard/LinksEditor'

export default function SettingsPage() {
  const [tab,setTab]=useState<'store'|'links'>('store')
  return <div className="mx-auto max-w-[1000px]"><div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">Personalisasi</p><h1 className="mt-2 text-3xl font-bold text-white">Pengaturan toko</h1><p className="mt-2 text-sm text-slate-400">Atur profil, tampilan, metode pembayaran, dan tautan bisnismu.</p></div><div className="mb-6 flex w-fit rounded-xl border border-slate-800 bg-slate-900 p-1"><button onClick={()=>setTab('store')} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold ${tab==='store'?'bg-emerald-500 text-slate-950':'text-slate-400'}`}><Store size={15}/>Profil & tampilan</button><button onClick={()=>setTab('links')} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold ${tab==='links'?'bg-emerald-500 text-slate-950':'text-slate-400'}`}><Link2 size={15}/>Tautan bisnis</button></div>{tab==='store'?<ProfileEditor/>:<LinksEditor/>}</div>
}
