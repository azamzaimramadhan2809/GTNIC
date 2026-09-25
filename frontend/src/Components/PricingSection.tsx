import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  { name: 'Gratis', price: 'Rp 0', note: 'Untuk mulai jualan', features: ['Maks. 10 produk', 'Checkout WhatsApp', 'Tema dasar', 'Komisi 0%'] },
  { name: 'Pro', price: 'Rp 49rb', note: 'Untuk bisnis bertumbuh', featured: true, features: ['Produk tanpa batas', 'Analytics lengkap', 'Tema premium', 'Domain kustom', 'Komisi 0%'] },
  { name: 'Bisnis', price: 'Hubungi kami', note: 'Untuk tim dan brand', features: ['Multi-admin', 'Prioritas dukungan', 'Integrasi lanjutan', 'Laporan khusus'] },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="border-y border-zinc-200 bg-white px-6 py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14 text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Harga transparan</p>
          <h2 className="text-[clamp(32px,4vw,44px)] font-bold tracking-[-0.5px] text-zinc-950">Mulai gratis, <span className="serif-italic">tumbuh tanpa batas.</span></h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500">Tidak ada biaya tersembunyi. Semua paket tetap menikmati komisi transaksi 0%.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className={`relative rounded-3xl border p-7 ${plan.featured ? 'border-zinc-950 bg-zinc-950 text-white shadow-xl' : 'border-zinc-200 bg-zinc-50 text-zinc-950'}`}>
              {plan.featured && <span className="absolute right-5 top-5 rounded-full bg-emerald-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-950">Paling populer</span>}
              <p className={`text-sm font-semibold ${plan.featured ? 'text-zinc-300' : 'text-zinc-600'}`}>{plan.name}</p>
              <p className="mt-5 text-3xl font-extrabold">{plan.price}</p>
              <p className={`mt-2 text-xs ${plan.featured ? 'text-zinc-500' : 'text-zinc-400'}`}>{plan.note}</p>
              <div className={`my-6 h-px ${plan.featured ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
              <ul className="space-y-3">
                {plan.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm"><Check size={15} className="text-emerald-500" />{feature}</li>)}
              </ul>
              <Link href="/register" className={`mt-8 block rounded-xl px-4 py-3 text-center text-sm font-semibold ${plan.featured ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-white'}`}>Pilih {plan.name}</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
