import MotionReveal from './MotionReveal'
import type { Step } from '../types'

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Daftar & Buat Akun',
    desc: 'Masukkan nama toko dan nomor WhatsApp. Selesai dalam 30 detik.',
  },
  {
    number: '02',
    title: 'Tambah Produk',
    desc: 'Upload foto produk, tulis nama, harga, deskripsi. Sesimpel itu.',
  },
  {
    number: '03',
    title: 'Bagikan Link Toko',
    desc: 'Salin link lynkstore.id/nama-toko dan sebarkan ke semua platform.',
  },
  {
    number: '04',
    title: 'Terima Order via WA',
    desc: 'Pembeli klik → format order otomatis terkirim ke WhatsApp kamu.',
  },
]

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="bg-zinc-950 text-zinc-50 py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <MotionReveal className="text-center mb-16">
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-emerald-400 mb-4">
            Cara Kerja
          </div>
          <h2 className="text-[clamp(32px,4vw,44px)] font-bold text-zinc-50 tracking-[-0.5px] leading-[1.15]">
            Mulai jualan dalam
            <br />
            <span
              style={{
                fontFamily: 'DM Serif Display,serif',
                fontStyle: 'italic',
                fontWeight: 400,
                color: '#71717A',
              }}
            >
              4 langkah mudah.
            </span>
          </h2>
        </MotionReveal>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => (
            <MotionReveal key={step.number} delay={index * 0.09} className="h-full">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 card-hover h-full">
              <div className="text-[32px] font-extrabold text-zinc-700 tracking-[-1px] leading-none mb-4 font-mono">
                {step.number}
              </div>
              <h3 className="text-[15px] font-semibold text-zinc-100 mb-2">
                {step.title}
              </h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed">{step.desc}</p>
            </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
