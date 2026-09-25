import { useReveal } from '../hooks/useReveal'

const STATS = [
  { value: '50.000+', label: 'UMKM Terdaftar' },
  { value: 'Rp 12M+', label: 'Total Transaksi' },
  { value: '4.9 / 5', label: 'Rating Pengguna' },
  { value: '0%', label: 'Komisi Platform' },
]

export default function StatsBar() {
  const ref = useReveal()

  return (
    <section className="border-y border-zinc-200 bg-white">
      <div
        ref={ref}
        className="reveal max-w-[960px] mx-auto px-6 py-14 flex flex-wrap justify-around gap-x-16 gap-y-8"
      >
        {STATS.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-[34px] font-extrabold text-zinc-950 tracking-[-1px] leading-none mb-1.5">
              {stat.value}
            </div>
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.1em]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
