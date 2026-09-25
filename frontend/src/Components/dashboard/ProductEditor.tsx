import React, { useState } from 'react';
import { useStore } from '../../Context/StoreContext';
import type { Product } from '../../types/store';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';

export const ProductEditor: React.FC = () => {
  const { storeData, addProduct, updateProduct, deleteProduct, toggleProductAvailability } = useStore();
  const { products = [] } = storeData;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    isAvailable: true
  });

  const handleOpenAdd = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;

    const numericPrice = parseInt(formData.price.replace(/[^0-9]/g, ''), 10) || 0;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formData.name.trim(),
        price: numericPrice,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
        isAvailable: formData.isAvailable
      });
    } else {
      addProduct({
        name: formData.name.trim(),
        price: numericPrice,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
        isAvailable: formData.isAvailable
      });
    }

    setIsModalOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Katalog & Daftar Menu Produk
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola produk yang akan ditampilkan di etalase digital tokomu.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg transition active:scale-95 flex-shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 p-6">
            <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">Belum ada produk di katalog</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tambahkan produk pertama tokomu sekarang agar pelanggan bisa langsung memesan lewat WhatsApp.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Produk
            </button>
          </div>
        ) : (
          products.map((prod: Product) => (
            <div
              key={prod.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-sm"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <img
                  src={prod.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'}
                  alt={prod.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-950 flex-shrink-0 border border-slate-800"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150';
                  }}
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-white truncate">{prod.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{prod.description}</p>
                  <p className="text-xs font-extrabold text-emerald-400 mt-1">
                    {formatPrice(prod.price)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                {toggleProductAvailability && (
                  <button
                    onClick={() => toggleProductAvailability(prod.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      prod.isAvailable
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 hover:bg-emerald-900/50'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {prod.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{prod.isAvailable ? 'Tersedia' : 'Habis'}</span>
                  </button>
                )}

                <button
                  onClick={() => handleOpenEdit(prod)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer border border-slate-700"
                  title="Edit Produk"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Hapus produk "${prod.name}"?`)) {
                      deleteProduct(prod.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-rose-400 hover:text-rose-300 transition cursor-pointer border border-slate-700 hover:border-rose-800"
                  title="Hapus Produk"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              {editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Produk / Menu <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nasi Liwet Komplit"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Harga (Rp) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="25000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan porsi, bahan, atau rasa..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  URL Foto Produk
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="productIsAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-800 cursor-pointer"
                />
                <label htmlFor="productIsAvailable" className="text-xs text-slate-300 cursor-pointer">
                  Produk Tersedia (Stok Ready)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-md cursor-pointer"
                >
                  {editingProductId ? 'Simpan Perubahan' : 'Tambah Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEditor;
