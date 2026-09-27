import CountUp from './CountUp'
import MotionReveal from './MotionReveal'

const STATS = [
  { end: 50000, suffix: '+', label: 'UMKM Terdaftar' },
  { end: 12, prefix: 'Rp ', suffix: 'M+', label: 'Total Transaksi' },
  { end: 4.9, suffix: ' / 5', decimals: 1, label: 'Rating Pengguna' },
  { end: 0, suffix: '%', label: 'Komisi Platform' },
]

export default function StatsBar() {
  return (
    <section className="border-y border-zinc-200 bg-white">
      <div className="max-w-[960px] mx-auto px-6 py-14 flex flex-wrap justify-around gap-x-16 gap-y-8">
        {STATS.map((stat, i) => (
          <MotionReveal key={stat.label} delay={i * 0.1} className="text-center min-w-[130px]">
            <div className="text-[34px] font-extrabold text-zinc-950 tracking-[-1px] leading-none mb-1.5 tabular-nums">
              <CountUp end={stat.end} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
            </div>
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.1em]">{stat.label}</div>
          </MotionReveal>
        ))}
      </div>
    </section>
  )
}
