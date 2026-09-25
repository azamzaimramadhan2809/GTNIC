import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 px-6 py-8">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-4">
        {/* Left */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-zinc-950 flex items-center justify-center">
            <ShoppingBag size={14} className="stroke-zinc-50" strokeWidth={2} />
          </div>
          <span className="text-[14px] font-bold text-zinc-950">LynkStore</span>
        </div>

        {/* Center */}
        <div className="text-[12px] text-zinc-400">
          © 2026 LynkStore. Platform UMKM Indonesia.
        </div>

        {/* Right */}
        <div className="flex gap-6">
          <Link
            href="/about"
            className="text-[12px] text-zinc-400 hover:text-zinc-950 transition-colors"
          >
            Tentang
          </Link>
          <Link
            href="/pricing"
            className="text-[12px] text-zinc-400 hover:text-zinc-950 transition-colors"
          >
            Harga
          </Link>
          <Link
            href="/blog"
            className="text-[12px] text-zinc-400 hover:text-zinc-950 transition-colors"
          >
            Blog
          </Link>
        </div>
      </div>
    </footer>
  )
}
