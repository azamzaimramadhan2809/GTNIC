import { useState, useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-[100] isolate backdrop-blur-md bg-zinc-50/80 border-b border-zinc-200 h-16 transition-shadow duration-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* LEFT — Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center">
            <ShoppingBag size={16} className="stroke-zinc-50" strokeWidth={2} />
          </div>
          <span className="text-[15px] font-bold text-zinc-950">LynkStore</span>
          <span className="text-[9px] font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md px-1.5 py-0.5">
            UMKM
          </span>
        </div>

        {/* CENTER — Nav links */}
        <nav className="hidden md:flex gap-8">
          <a
            href="#fitur"
            className="text-[13px] font-medium text-zinc-500 nav-link hover:text-zinc-950 transition-colors duration-150"
          >
            Fitur Utama
          </a>
          <a
            href="#cara-kerja"
            className="text-[13px] font-medium text-zinc-500 nav-link hover:text-zinc-950 transition-colors duration-150"
          >
            Cara Kerja
          </a>
          <a
            href="#demo"
            className="text-[13px] font-medium text-zinc-500 nav-link hover:text-zinc-950 transition-colors duration-150"
          >
            Demo
          </a>
          <a
            href="#testimoni"
            className="text-[13px] font-medium text-zinc-500 nav-link hover:text-zinc-950 transition-colors duration-150"
          >
            Testimoni
          </a>
          <a
            href="#faq"
            className="text-[13px] font-medium text-zinc-500 nav-link hover:text-zinc-950 transition-colors duration-150"
          >
            FAQ
          </a>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-[13px] font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            Masuk
          </a>
          <button className="flex items-center gap-2 bg-zinc-950 text-zinc-50 rounded-xl px-4 py-2 text-[13px] font-semibold btn-primary">
            Buat Toko Gratis
          </button>
        </div>
      </div>
    </header>
  )
}
