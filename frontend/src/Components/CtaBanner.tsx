'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import MotionReveal from './MotionReveal'

export default function CtaBanner() {
  return (
    <section className="px-6 py-24">
      <MotionReveal distance={36}>
      <div className="max-w-[700px] mx-auto bg-zinc-950 rounded-3xl px-12 py-16 text-center">
        {/* Label */}
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-emerald-400 mb-5">
          Mulai Sekarang — Gratis
        </div>

        {/* H2 */}
        <h2 className="text-[clamp(28px,4vw,42px)] font-bold text-zinc-50 tracking-[-0.5px] leading-[1.18] mb-5">
          Toko online impianmu
          <br />
          <span
            style={{
              fontFamily: 'DM Serif Display,serif',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#52525B',
            }}
          >
            menunggu untuk dibuat.
          </span>
        </h2>

        {/* Sub-copy */}
        <p className="text-[15px] text-zinc-400 leading-relaxed mb-10 max-w-[440px] mx-auto">
          Bergabung bersama 50.000+ UMKM Indonesia yang sudah lebih mudah jualan.
        </p>

        {/* CTA Button */}
        <div>
          <Link href="/register" className="inline-flex items-center gap-2.5 bg-white text-zinc-950 rounded-2xl px-7 py-4 text-[15px] font-semibold btn-primary hover:bg-zinc-100">
            <ShoppingBag size={17} strokeWidth={2} />
            <span>Buat Toko Gratis Sekarang</span>
          </Link>
        </div>

        {/* Fine print */}
        <div className="text-[12px] text-zinc-600 mt-5">
          Tidak perlu kartu kredit · Komisi 0% · Selamanya gratis
        </div>
      </div>
      </MotionReveal>
    </section>
  )
}
