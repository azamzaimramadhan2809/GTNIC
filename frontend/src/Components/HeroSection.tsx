import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { useScroll, useTransform } from 'framer-motion'
import PhoneFrame from './PhoneFrame'

export default function HeroSection() {
  const [slug, setSlug] = useState('')
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)

  // Track page scroll progress of hero container
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Scroll rotation mapped to Radians for 3D WebGL Canvas
  // Keep the first view readable while retaining enough angle to show the 3D chassis.
  // As user scrolls down, smooth transition toward 0 rad
  const rotateYRad = useTransform(scrollYProgress, [0, 0.45], [-0.34, 0])
  const rotateXRad = useTransform(scrollYProgress, [0, 0.45], [0.08, 0])

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="relative z-0 isolate max-w-[1200px] mx-auto px-6 pt-16 md:pt-20 pb-24 md:pb-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center overflow-x-hidden min-h-[90vh]"
    >
      {/* LEFT COLUMN */}
      <div>
        {/* 1. Eyebrow badge */}
        <div className="inline-flex items-center gap-2 mb-8 bg-zinc-100 rounded-full px-4 py-1.5 border border-zinc-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[12px] font-medium text-zinc-600">
            Platform Catalog & Link-in-Bio untuk UMKM Indonesia
          </span>
        </div>

        {/* 2. Headline H1 */}
        <h1 className="text-[clamp(40px,5vw,64px)] font-extrabold text-zinc-950 leading-[1.08] tracking-[-1.5px] mb-6">
          Ubah WhatsApp
          <br />
          Jadi Toko Online
          <br />
          <span className="serif-italic">Impian dalam 2 Menit.</span>
        </h1>

        {/* 3. Sub-paragraph */}
        <p className="text-[17px] text-zinc-500 leading-relaxed mb-10 max-w-[420px]">
          Tampilkan menu & produkmu secara profesional. Pembeli tinggal pilih, klik, dan terhubung ke WhatsApp toko kamu — tanpa aplikasi tambahan.
        </p>

        {/* 4. URL input group */}
        <div className="flex items-center rounded-2xl border border-zinc-200 bg-white overflow-hidden max-w-[460px] mb-6 shadow-sm focus-within:ring-2 focus-within:ring-zinc-950 focus-within:ring-offset-2 transition-all">
          <span className="flex items-center px-4 py-3.5 text-[13px] text-zinc-400 font-mono border-r border-zinc-100 select-none whitespace-nowrap">
            lynkstore.id/
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="nama-toko-kamu"
            className="flex-1 px-3 py-3.5 bg-transparent outline-none text-[14px] text-zinc-950 placeholder:text-zinc-300"
          />
          <button
            onClick={() => router.push(`/register?username=${encodeURIComponent(slug.trim().toLowerCase())}`)}
            className="m-1.5 px-5 py-2.5 bg-zinc-950 text-zinc-50 text-[13px] font-semibold rounded-xl whitespace-nowrap btn-primary"
          >
            Mulai →
          </button>
        </div>

        {/* 5. Trust signals row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-1.5 text-[13px] text-zinc-500">
            <Check size={14} className="stroke-emerald-500" strokeWidth={2.5} />
            <span>Gratis Selamanya</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-zinc-500">
            <Check size={14} className="stroke-emerald-500" strokeWidth={2.5} />
            <span>Komisi 0%</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-zinc-500">
            <Check size={14} className="stroke-emerald-500" strokeWidth={2.5} />
            <span>Setup 2 Menit</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN — 3D R3F WEBGL IPHONE MOCKUP */}
      <div className="flex items-center justify-center">
        <PhoneFrame
          rotateYRad={rotateYRad}
          rotateXRad={rotateXRad}
        />
      </div>
    </section>
  )
}
