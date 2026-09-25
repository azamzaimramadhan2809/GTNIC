'use client'

import { ProductEditor } from '../../../Components/dashboard/ProductEditor'

export default function ProductsPage() {
  return <div className="mx-auto max-w-[1100px]"><div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">Katalog</p><h1 className="mt-2 text-3xl font-bold text-white">Produk tokomu</h1><p className="mt-2 text-sm text-slate-400">Tambah, ubah, atur stok, dan susun produk yang tampil di storefront.</p></div><ProductEditor /></div>
}
