'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Mail, MessageCircle } from 'lucide-react'
import AuthShell from '../../Components/auth/AuthShell'
import { createClient } from '@/lib/supabase/client'
import { isDemoAuthEnabled } from '@/lib/supabase/config'

const normalizePhone = (value: string) => {
  const digits=value.replace(/\D/g,'')
  return digits.startsWith('62')?`+${digits}`:digits.startsWith('0')?`+62${digits.slice(1)}`:`+${digits}`
}

export default function LoginPage() {
  const router=useRouter()
  const demo=isDemoAuthEnabled()
  const next=typeof window!=='undefined'&&new URLSearchParams(window.location.search).get('next')?.startsWith('/')?new URLSearchParams(window.location.search).get('next')!:'/dashboard'
  const [identifier,setIdentifier]=useState(''), [password,setPassword]=useState(''), [otp,setOtp]=useState(''), [phone,setPhone]=useState('')
  const [otpSent,setOtpSent]=useState(false), [showPassword,setShowPassword]=useState(false), [loading,setLoading]=useState(false), [message,setMessage]=useState('')

  async function submit(event:React.FormEvent){event.preventDefault();setLoading(true);setMessage('');try{
    if(demo){localStorage.setItem('lynkstore_demo_session','true');router.replace(next);return}
    if(!identifier.includes('@'))throw new Error('Untuk nomor WhatsApp, gunakan tombol OTP WhatsApp.')
    const {error}=await createClient().auth.signInWithPassword({email:identifier,password});if(error)throw error
    router.replace(next);router.refresh()
  }catch(error){setMessage(error instanceof Error?error.message:'Login gagal.')}finally{setLoading(false)}}
  async function googleLogin(){setMessage('');if(demo){localStorage.setItem('lynkstore_demo_session','true');router.replace(next);return}try{const {error}=await createClient().auth.signInWithOAuth({provider:'google',options:{redirectTo:`${location.origin}/auth/callback?next=${encodeURIComponent(next)}`}});if(error)throw error}catch(error){setMessage(error instanceof Error?error.message:'Google login gagal.')}}
  async function whatsappLogin(){setLoading(true);setMessage('');if(demo){localStorage.setItem('lynkstore_demo_session','true');router.replace(next);setLoading(false);return}try{const normalized=normalizePhone(phone||identifier);if(!otpSent){const {error}=await createClient().auth.signInWithOtp({phone:normalized,options:{channel:'whatsapp'}});if(error)throw error;setPhone(normalized);setOtpSent(true);setMessage('Kode OTP sudah dikirim ke WhatsApp.')}else{const {error}=await createClient().auth.verifyOtp({phone,token:otp,type:'sms'});if(error)throw error;router.replace(next);router.refresh()}}catch(error){setMessage(error instanceof Error?error.message:'OTP gagal diproses.')}finally{setLoading(false)}}

  return <AuthShell eyebrow="Selamat datang kembali" title="Masuk ke toko kamu" description="Kelola katalog, pantau performa, dan lanjutkan pertumbuhan bisnismu.">
    {demo&&<p className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-semibold text-sky-700">Mode demo aktif — isi data apa saja untuk masuk.</p>}
    <button type="button" onClick={googleLogin} className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"><span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400 text-[10px] font-bold text-white">G</span>Masuk dengan Google</button>
    <div className="my-6 flex items-center gap-4 text-[11px] uppercase tracking-wider text-zinc-400"><span className="h-px flex-1 bg-zinc-200"/>atau dengan email<span className="h-px flex-1 bg-zinc-200"/></div>
    {message&&<p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{message}</p>}
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm font-semibold text-zinc-700">Email atau nomor WhatsApp<div className="mt-2 flex items-center rounded-xl border border-zinc-200 bg-white px-4 focus-within:border-zinc-950"><Mail size={17} className="text-zinc-400"/><input required value={identifier} onChange={e=>setIdentifier(e.target.value)} autoComplete="username" type="text" placeholder="nama@email.com" className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"/></div></label>
      <label className="block text-sm font-semibold text-zinc-700"><span className="flex justify-between">Kata sandi <Link href="#" className="text-emerald-700">Lupa kata sandi?</Link></span><div className="mt-2 flex items-center rounded-xl border border-zinc-200 bg-white px-4"><input required value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" type={showPassword?'text':'password'} placeholder="Masukkan kata sandi" className="w-full bg-transparent py-3.5 text-sm outline-none"/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
      <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-4 text-sm font-semibold text-white disabled:opacity-60">{loading?'Memproses...':'Masuk ke Dashboard'}<ArrowRight size={16}/></button>
    </form>
    {otpSent&&<input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" placeholder="Masukkan 6 digit OTP" className="mt-4 w-full rounded-xl border border-emerald-200 px-4 py-3.5 text-center tracking-[.35em] outline-none"/>}
    <button type="button" disabled={loading} onClick={whatsappLogin} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-semibold text-emerald-800"><MessageCircle size={17}/>{otpSent?'Verifikasi OTP':'Masuk dengan OTP WhatsApp'}</button>
    <p className="mt-8 text-center text-sm text-zinc-500">Belum punya akun? <Link href="/register" className="font-semibold text-zinc-950">Buat toko gratis</Link></p>
  </AuthShell>
}
