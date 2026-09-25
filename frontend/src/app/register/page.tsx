'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Check, Eye, EyeOff, Mail } from 'lucide-react'
import AuthShell from '../../Components/auth/AuthShell'
import { createClient } from '@/lib/supabase/client'
import { isDemoAuthEnabled } from '@/lib/supabase/config'

export default function RegisterPage(){
  const router=useRouter();const demo=isDemoAuthEnabled();const [showPassword,setShowPassword]=useState(false),[agreed,setAgreed]=useState(true),[loading,setLoading]=useState(false),[message,setMessage]=useState('')
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();if(!agreed)return;setLoading(true);setMessage('');if(demo){localStorage.setItem('lynkstore_demo_session','true');router.replace('/onboarding');return}const form=new FormData(event.currentTarget);try{const {data,error}=await createClient().auth.signUp({email:String(form.get('email')),password:String(form.get('password')),options:{emailRedirectTo:`${location.origin}/auth/callback?next=/onboarding`,data:{full_name:form.get('name'),phone:form.get('phone')}}});if(error)throw error;if(data.session)router.replace('/onboarding');else setMessage('Akun dibuat. Buka email kamu lalu klik tautan verifikasi.')}catch(error){setMessage(error instanceof Error?error.message:'Pendaftaran gagal.')}finally{setLoading(false)}}
  async function googleRegister(){setMessage('');if(demo){localStorage.setItem('lynkstore_demo_session','true');router.replace('/onboarding');return}try{const {error}=await createClient().auth.signInWithOAuth({provider:'google',options:{redirectTo:`${location.origin}/auth/callback?next=/onboarding`}});if(error)throw error}catch(error){setMessage(error instanceof Error?error.message:'Google login gagal.')}}
  return <AuthShell eyebrow="Mulai gratis" title="Buat toko pertamamu" description="Tidak perlu kartu kredit. Komisi 0% dan dapat dibatalkan kapan saja.">
    {demo&&<p className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-semibold text-sky-700">Mode demo aktif — data belum dikirim ke Supabase.</p>}
    <button type="button" onClick={googleRegister} className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"><span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400 text-[10px] font-bold text-white">G</span>Daftar dengan Google</button>
    <div className="my-6 flex items-center gap-4 text-[11px] uppercase tracking-wider text-zinc-400"><span className="h-px flex-1 bg-zinc-200"/>atau dengan email<span className="h-px flex-1 bg-zinc-200"/></div>
    {message&&<p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{message}</p>}
    <form onSubmit={submit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-zinc-700">Nama lengkap<input name="name" required autoComplete="name" placeholder="Nama kamu" className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-zinc-950"/></label><label className="text-sm font-semibold text-zinc-700">Nomor WhatsApp<input name="phone" required autoComplete="tel" placeholder="08xxxxxxxxxx" className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-zinc-950"/></label></div>
      <label className="block text-sm font-semibold text-zinc-700">Email<div className="mt-2 flex items-center rounded-xl border border-zinc-200 bg-white px-4"><Mail size={17} className="text-zinc-400"/><input name="email" required autoComplete="email" type={demo?'text':'email'} placeholder="nama@email.com" className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"/></div></label>
      <label className="block text-sm font-semibold text-zinc-700">Kata sandi<div className="mt-2 flex items-center rounded-xl border border-zinc-200 bg-white px-4"><input name="password" required autoComplete="new-password" minLength={demo?1:8} type={showPassword?'text':'password'} placeholder={demo?'Bebas untuk mode demo':'Minimal 8 karakter'} className="w-full bg-transparent py-3.5 text-sm outline-none"/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
      <button type="button" onClick={()=>setAgreed(!agreed)} className="flex items-start gap-3 text-left text-xs leading-5 text-zinc-500"><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded ${agreed?'bg-zinc-950 text-white':'border border-zinc-300 bg-white'}`}>{agreed&&<Check size={13}/>}</span>Saya menyetujui Syarat Penggunaan dan Kebijakan Privasi LynkStore.</button>
      <button disabled={!agreed||loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-4 text-sm font-semibold text-white disabled:opacity-40">{loading?'Mendaftarkan...':'Daftar & lanjutkan'}<ArrowRight size={16}/></button>
    </form><p className="mt-7 text-center text-sm text-zinc-500">Sudah punya akun? <Link href="/login" className="font-semibold text-zinc-950">Masuk</Link></p>
  </AuthShell>
}

