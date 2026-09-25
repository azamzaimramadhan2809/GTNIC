import Navbar from '../../Components/Navbar'
import PricingSection from '../../Components/PricingSection'
import FaqSection from '../../Components/FaqSection'
import CtaBanner from '../../Components/CtaBanner'
import Footer from '../../Components/Footer'

export default function PricingPage() {
  return <div className="min-h-screen bg-zinc-50"><Navbar /><main><section className="px-6 pb-10 pt-24 text-center"><p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-600">Paket LynkStore</p><h1 className="text-[clamp(42px,7vw,72px)] font-extrabold leading-[1.02] tracking-[-2px] text-zinc-950">Harga sederhana.<br/><span className="serif-italic">Komisi tetap 0%.</span></h1><p className="mx-auto mt-7 max-w-xl text-base leading-8 text-zinc-500">Pilih paket sesuai tahap pertumbuhan bisnismu. Mulai gratis, upgrade ketika tokomu membutuhkan lebih banyak ruang.</p></section><PricingSection /><FaqSection /><CtaBanner /></main><Footer /></div>
}
