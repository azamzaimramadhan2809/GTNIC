'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, ImagePlus, ShoppingBag, Store } from 'lucide-react'
import { useStore } from '../../Context/StoreContext'
import { createClient } from '@/lib/supabase/client'
import { isDemoAuthEnabled } from '@/lib/supabase/config'

const categories = ['Kuliner', 'Fashion', 'Jasa', 'Kecantikan', 'Kerajinan', 'Lainnya']

export default function OnboardingPage() {
  const router = useRouter()
  const { storeData, updateStoreInfo } = useStore()
  const [step, setStep] = useState(1)
  const [name, setName] = useState(storeData.storeName)
  const [username, setUsername] = useState(storeData.username)
  const [logo, setLogo] = useState(storeData.logoUrl)
  const [whatsapp, setWhatsapp] = useState(storeData.whatsappNumber)
  const [category, setCategory] = useState('Kuliner')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const next = async () => {
    if (step < 3) return setStep(step + 1)
    setSaving(true); setError('')
    const cleanUsername=username.replace(/[^a-z0-9-]/gi,'').toLowerCase()
    if (isDemoAuthEnabled()) {
      updateStoreInfo({storeName:name,username:cleanUsername,logoUrl:logo,whatsappNumber:whatsapp})
      router.push('/dashboard')
      return
    }
    try {
      const supabase=createClient()
      const {data:{user}}=await supabase.auth.getUser()
      if(!user) throw new Error('Sesi login tidak ditemukan. Silakan masuk lagi.')
      const {error:saveError}=await supabase.from('stores').upsert({owner_id:user.id,username:cleanUsername,store_name:name,category,logo_url:logo,whatsapp_number:whatsapp},{onConflict:'owner_id'})
      if(saveError) throw saveError
      updateStoreInfo({storeName:name,username:cleanUsername,logoUrl:logo,whatsappNumber:whatsapp})
      router.push('/dashboard')
    } catch (cause) { setError(cause instanceof Error?cause.message:'Gagal menyimpan toko.') }
    finally { setSaving(false) }
  }
  return <main className="min-h-screen bg-zinc-50 px-6 py-10"><header className="mx-auto flex max-w-[1050px] items-center justify-between"><div className="flex items-center gap-3 text-sm font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-950 text-white"><ShoppingBag size={17}/></span>LynkStore</div><span className="text-xs text-zinc-400">Langkah {step} dari 3</span></header><section className="mx-auto mt-12 max-w-[780px]"><div className="mb-10 flex gap-2">{[1,2,3].map(item=><span key={item} className={`h-1.5 flex-1 rounded-full ${item<=step?'bg-zinc-950':'bg-zinc-200'}`}/>)}</div><div className="rounded-[32px] border border-zinc-200 bg-white p-7 shadow-sm sm:p-12">{step===1&&<div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Store/></span><h1 className="mt-7 text-3xl font-extrabold tracking-tight text-zinc-950">Kenalkan tokomu</h1><p className="mt-2 text-sm leading-7 text-zinc-500">Nama ini akan tampil pada storefront dan link publik tokomu.</p><div className="mt-8 space-y-5"><label className="block text-sm font-semibold text-zinc-700">Nama toko<input value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3.5 outline-none focus:border-zinc-950"/></label><label className="block text-sm font-semibold text-zinc-700">Alamat toko<div className="mt-2 flex overflow-hidden rounded-xl border border-zinc-200 focus-within:border-zinc-950"><span className="border-r border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-400">lynkstore.id/</span><input value={username} onChange={e=>setUsername(e.target.value)} className="min-w-0 flex-1 px-3 text-sm outline-none"/></div></label></div></div>}{step===2&&<div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-700"><ImagePlus/></span><h1 className="mt-7 text-3xl font-extrabold tracking-tight text-zinc-950">Lengkapi identitas toko</h1><p className="mt-2 text-sm leading-7 text-zinc-500">Logo dan WhatsApp membantu pelanggan mengenali serta menghubungimu.</p><div className="mt-8 space-y-5"><label className="block text-sm font-semibold text-zinc-700">URL logo toko<input value={logo} onChange={e=>setLogo(e.target.value)} placeholder="https://..." className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3.5 text-sm outline-none focus:border-zinc-950"/></label><label className="block text-sm font-semibold text-zinc-700">Nomor WhatsApp<input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="628xxxxxxxxxx" className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3.5 text-sm outline-none focus:border-zinc-950"/></label></div></div>}{step===3&&<div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-700"><ShoppingBag/></span><h1 className="mt-7 text-3xl font-extrabold tracking-tight text-zinc-950">Apa jenis bisnismu?</h1><p className="mt-2 text-sm leading-7 text-zinc-500">Kami akan menyesuaikan rekomendasi fitur untuk tokomu.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{categories.map(item=><button key={item} onClick={()=>setCategory(item)} className={`flex items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold ${category===item?'border-zinc-950 bg-zinc-950 text-white':'border-zinc-200 hover:border-zinc-400'}`}>{item}{category===item&&<Check size={16} className="text-emerald-400"/>}</button>)}</div></div>}{error&&<p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}<div className="mt-10 flex items-center justify-between border-t border-zinc-100 pt-6"><button onClick={()=>step>1?setStep(step-1):router.push('/register')} className="flex items-center gap-2 text-sm font-semibold text-zinc-500"><ArrowLeft size={16}/>Kembali</button><button disabled={saving} onClick={next} className="flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white">{saving?'Menyimpan...':step===3?'Buka dashboard':'Lanjut'}<ArrowRight size={16}/></button></div></div></section></main>
}

