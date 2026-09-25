'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Boxes, ExternalLink, LayoutDashboard, LogOut, Settings, ShoppingBag, Store } from 'lucide-react'
import type { ReactNode } from 'react'
import { useStore } from '../../Context/StoreContext'
import { createClient } from '@/lib/supabase/client'
import { isDemoAuthEnabled } from '@/lib/supabase/config'

const nav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Produk', icon: Boxes },
  { href: '/dashboard/settings', label: 'Pengaturan', icon: Settings },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function MerchantShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { storeData } = useStore()
  const logout = async () => { if(isDemoAuthEnabled()) localStorage.removeItem('lynkstore_demo_session'); else await createClient().auth.signOut(); router.replace('/login'); router.refresh() }
  return <div className="min-h-screen bg-slate-950 text-slate-100"><aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-slate-800 bg-slate-950 px-4 py-5 lg:flex lg:flex-col"><Link href="/" className="flex items-center gap-3 px-2 text-sm font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-slate-950"><ShoppingBag size={17}/></span>LynkStore</Link><div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-slate-800 text-emerald-400"><Store size={17}/></span><div className="min-w-0"><p className="truncate text-xs font-bold text-white">{storeData.storeName}</p><p className="truncate text-[10px] text-slate-500">lynkstore.id/{storeData.username}</p></div></div></div><nav className="mt-6 space-y-1">{nav.map(({href,label,icon:Icon})=>{const active=pathname===href; return <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active?'bg-emerald-500 text-slate-950':'text-slate-400 hover:bg-slate-900 hover:text-white'}`}><Icon size={17}/>{label}</Link>})}</nav><div className="mt-auto space-y-1"><Link href={`/${storeData.username}`} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-white"><ExternalLink size={17}/>Lihat toko</Link><button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 hover:text-rose-400"><LogOut size={17}/>Keluar</button></div></aside><div className="lg:pl-64"><header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-5 backdrop-blur-xl lg:px-8"><div className="flex items-center gap-2 lg:hidden"><ShoppingBag size={18} className="text-emerald-400"/><span className="text-sm font-bold">LynkStore</span></div><p className="hidden text-xs text-slate-500 lg:block">Panel Merchant / <span className="text-slate-300">{nav.find(item=>item.href===pathname)?.label ?? 'Dashboard'}</span></p><Link href={`/${storeData.username}`} className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-500"><ExternalLink size={14}/>Preview toko</Link></header><nav className="flex gap-1 overflow-x-auto border-b border-slate-800 bg-slate-950 px-4 py-2 lg:hidden">{nav.map(({href,label})=><Link key={href} href={href} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${pathname===href?'bg-emerald-500 text-slate-950':'text-slate-400'}`}>{label}</Link>)}</nav><main className="p-5 lg:p-8">{children}</main></div></div>
}

