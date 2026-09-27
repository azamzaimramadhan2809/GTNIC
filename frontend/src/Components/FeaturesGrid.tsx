import MotionReveal from './MotionReveal'
import type { Feature } from '../types'

const FEATURES: Feature[] = [
  {
    icon: '⚡',
    title: 'Setup 2 Menit',
    desc: 'Buat toko lengkap hanya dalam 2 menit. Tidak perlu keahlian teknis.',
  },
  {
    icon: '💬',
    title: 'Checkout via WhatsApp',
    desc: 'Pembeli terhubung ke WhatsApp kamu dengan format order otomatis.',
  },
  {
    icon: '📦',
    title: 'Katalog Produk Rapi',
    desc: 'Tampilkan produk dengan foto, harga, dan deskripsi profesional.',
  },
  {
    icon: '🔗',
    title: 'Link-in-Bio Terpadu',
    desc: 'Satu link untuk toko, katalog, kontak, dan semua media sosial.',
  },
  {
    icon: '📱',
    title: 'Mobile-First',
    desc: 'Tampil sempurna di semua perangkat. Pelanggan belanja kapan saja.',
  },
  {
    icon: '💸',
    title: 'Gratis & 0% Komisi',
    desc: 'Tanpa biaya langganan. 100% keuntungan masuk kantong kamu.',
  },
]

export default function FeaturesGrid() {
  return (
    <section id="fitur" className="max-w-[1200px] mx-auto px-6 py-24">
      {/* Header */}
      <MotionReveal className="mb-16">
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-emerald-600 mb-4">
          Fitur Utama
        </div>
        <h2 className="text-[clamp(32px,4vw,44px)] font-bold text-zinc-950 tracking-[-0.5px] leading-[1.15]">
          Semua yang kamu butuhkan,
          <br />
          <span className="serif-italic">sudah tersedia.</span>
        </h2>
      </MotionReveal>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 rounded-2xl overflow-hidden border border-zinc-200">
        {FEATURES.map((item, index) => (
          <MotionReveal key={item.title} delay={(index % 3) * 0.09} className="h-full">
            <div className="bg-white p-[32px_28px] card-hover h-full">
              <div className="text-[24px] mb-5">{item.icon}</div>
              <h3 className="text-[15px] font-semibold text-zinc-950 mb-2.5">{item.title}</h3>
              <p className="text-[14px] text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  )
}
