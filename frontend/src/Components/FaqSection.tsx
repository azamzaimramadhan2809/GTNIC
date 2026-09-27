'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import MotionReveal from './MotionReveal'

const faqs = [
  ['Apakah LynkStore benar-benar gratis?', 'Ya. Paket Gratis dapat digunakan selamanya dengan komisi transaksi 0%. Kamu bisa upgrade kapan pun saat membutuhkan fitur lanjutan.'],
  ['Apakah pelanggan harus mengunduh aplikasi?', 'Tidak. Pelanggan cukup membuka link toko dari browser, memilih produk, lalu checkout langsung ke WhatsApp.'],
  ['Apakah bisa menggunakan domain sendiri?', 'Bisa melalui paket Pro. Paket Gratis tetap memperoleh alamat toko lynkstore.id/nama-toko.'],
  ['Apakah LynkStore menerima pembayaran?', 'Kamu dapat menampilkan QRIS dan rekening bank. Konfirmasi pesanan dan pembayaran tetap berada dalam kendali merchant.'],
]

export default function FaqSection() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="mx-auto max-w-[900px] px-6 py-24">
      <MotionReveal className="mb-12 text-center">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">FAQ</p>
        <h2 className="text-[clamp(32px,4vw,44px)] font-bold text-zinc-950">Pertanyaan yang <span className="serif-italic">sering ditanyakan.</span></h2>
      </MotionReveal>
      <div className="divide-y divide-zinc-200 border-y border-zinc-200">
        {faqs.map(([question, answer], index) => (
          <MotionReveal key={question} delay={index * 0.07} distance={18}>
          <button key={question} onClick={() => setOpen(open === index ? -1 : index)} className="w-full py-5 text-left">
            <span className="flex items-center justify-between gap-6 text-sm font-semibold text-zinc-950">{question}<ChevronDown size={18} className={`shrink-0 transition-transform ${open === index ? 'rotate-180' : ''}`} /></span>
            {open === index && <span className="mt-3 block max-w-2xl text-sm leading-7 text-zinc-500">{answer}</span>}
          </button>
          </MotionReveal>
        ))}
      </div>
    </section>
  )
}
