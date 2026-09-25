import Link from 'next/link'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'

const posts = [
  { category: 'Strategi WhatsApp', title: 'Cara Jualan Kopi via WhatsApp Biar Makin Ramai', excerpt: 'Susun katalog, pesan otomatis, dan alur checkout yang membuat pelanggan tidak bingung.', time: '6 menit', color: 'bg-amber-100' },
  { category: 'Branding UMKM', title: 'Foto Produk Bagus Cukup Pakai Kamera HP', excerpt: 'Panduan cahaya, latar, dan komposisi sederhana untuk foto katalog yang lebih meyakinkan.', time: '5 menit', color: 'bg-sky-100' },
  { category: 'Operasional', title: 'Template Pesan WhatsApp untuk Konfirmasi Pesanan', excerpt: 'Hemat waktu membalas pelanggan dengan template yang tetap terasa personal.', time: '4 menit', color: 'bg-emerald-100' },
  { category: 'Insight', title: 'Kenapa UMKM Membutuhkan Link Toko Sendiri?', excerpt: 'Satu link membuat katalog lebih mudah ditemukan, dibagikan, dan diukur performanya.', time: '7 menit', color: 'bg-violet-100' },
  { category: 'Pembayaran', title: 'Menerima QRIS dengan Aman untuk Bisnis Kecil', excerpt: 'Langkah sederhana menampilkan QRIS dan melakukan verifikasi pembayaran pelanggan.', time: '5 menit', color: 'bg-rose-100' },
  { category: 'Pertumbuhan', title: 'Membaca Produk Terlaris dari Data Klik', excerpt: 'Gunakan analytics sederhana untuk menentukan stok dan promosi berikutnya.', time: '6 menit', color: 'bg-lime-100' },
]

export default function BlogPage() {
  return <div className="min-h-screen bg-zinc-50"><Navbar /><main className="mx-auto max-w-[1200px] px-6 py-20"><section className="mb-16 max-w-3xl"><p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-600">Resource center</p><h1 className="text-[clamp(44px,7vw,72px)] font-extrabold leading-[1.02] tracking-[-2px] text-zinc-950">Belajar jualan digital,<br/><span className="serif-italic">satu artikel sekali.</span></h1><p className="mt-6 text-base leading-8 text-zinc-500">Panduan praktis tentang WhatsApp commerce, branding, katalog, dan pertumbuhan bisnis lokal.</p></section><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post,index)=><article key={post.title} className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white"><div className={`flex h-44 items-end p-6 ${post.color}`}><span className="font-mono text-5xl font-black text-zinc-950/10">0{index+1}</span></div><div className="p-6"><div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-emerald-700"><span>{post.category}</span><span className="flex items-center gap-1 text-zinc-400"><Clock3 size={12}/>{post.time}</span></div><h2 className="mt-4 text-xl font-bold leading-snug text-zinc-950">{post.title}</h2><p className="mt-3 text-sm leading-7 text-zinc-500">{post.excerpt}</p><Link href="#" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-zinc-950">Baca artikel <ArrowUpRight size={15}/></Link></div></article>)}</div></main><Footer /></div>
}
