import { Star } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import type { Testimonial } from '../types'

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Siti Rahayu',
    role: 'Kopi Senja Utama',
    location: 'Jakarta',
    metric: '+300% order',
    rating: 5,
    text: 'Sejak pakai LynkStore, order harian naik 3x. Toko saya terlihat jauh lebih profesional!',
  },
  {
    name: 'Budi Santoso',
    role: 'Reseller Fashion',
    location: 'Bandung',
    metric: 'Hemat 4 jam/hari',
    rating: 5,
    text: 'Dulu harus chat satu-satu jelaskan produk. Sekarang tinggal kirim link. Hemat waktu banget!',
  },
  {
    name: 'Dewi Lestari',
    role: 'Homemade Snack',
    location: 'Surabaya',
    metric: 'Komisi 0%',
    rating: 5,
    text: 'Setup 5 menit udah jadi. Komisi 0% yang paling saya suka — semua untung masuk kantong sendiri.',
  },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export default function Testimonials() {
  const ref = useReveal()

  return (
    <section id="testimoni" ref={ref} className="reveal max-w-[1200px] mx-auto px-6 py-24">
      {/* Header */}
      <div className="mb-16">
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-emerald-600 mb-4">
          Testimoni
        </div>
        <h2 className="text-[clamp(32px,4vw,44px)] font-bold text-zinc-950 tracking-[-0.5px] leading-[1.15]">
          Dipakai ribuan UMKM
          <br />
          <span className="serif-italic">seluruh Indonesia.</span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-200 rounded-2xl p-7 card-hover flex flex-col gap-4"
          >
            {/* Top Row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1">
                {[...Array(item.rating)].map((_, s) => (
                  <Star
                    key={s}
                    size={13}
                    className="fill-amber-400 stroke-amber-400"
                  />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-0.5">
                {item.metric}
              </span>
            </div>

            {/* Quote */}
            <p className="text-[14px] text-zinc-600 leading-[1.75] flex-1">
              "{item.text}"
            </p>

            {/* Author Row */}
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
              <div className="w-9 h-9 rounded-full bg-zinc-100 flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-zinc-500">
                {getInitials(item.name)}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-zinc-950 leading-snug">
                  {item.name}
                </span>
                <span className="text-[12px] text-zinc-400 leading-snug">
                  {item.role} · {item.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
