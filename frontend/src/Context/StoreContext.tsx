'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { StoreData, Product, ThemeId, ThemeMode } from '../types/store';
import { THEME_PRESETS } from '../types/store';
import { createClient } from '@/lib/supabase/client';
import { shouldUseSupabase } from '@/lib/supabase/config';
import { mapStore, storePayload } from '@/lib/stores';

export interface StoreContextType {
  storeData: StoreData;
  updateStoreInfo: (data: Partial<StoreData>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setTheme: (themeId: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleProductAvailability?: (id: string) => void;
  resetToDefault?: () => void;
}

export const DEFAULT_STORE_DATA: StoreData = {
  username: 'warungbusiti',
  storeName: 'Warung Bu Siti',
  bio: '🍲 Masakan Nusantara otentik & aneka jajanan pasar khas Bu Siti. Resep turun temurun sejak 1998, higienis & 100% Halal!',
  logoUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&auto=format&fit=crop&q=80',
  whatsappNumber: '6281234567890',
  instagramUrl: 'https://instagram.com/warungbusiti',
  mapsUrl: 'https://maps.google.com/?q=Warung+Bu+Siti+Jakarta',
  theme: THEME_PRESETS.emerald,
  themeMode: 'light',
  qrisImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126580014ID.LINKAJA.WWW0118936009143000000000021008123456785204581253033605802ID5914WARUNG+BU+SITI6007JAKARTA61051234062070703A016304',
  qrisAccountName: 'WARUNG BU SITI (NMID: ID1020038921)',
  openingHours: 'Setiap Hari: 08:00 - 21:00 WIB',
  address: 'Jl. Raya Tebet Barat No. 45, Jakarta Selatan',
  whatsappMessage: 'Halo, saya ingin memesan produk dari LynkStore.',
  bankName: 'Bank BCA',
  bankAccountNumber: '1234567890',
  bankAccountName: 'SITI RAHAYU',
  products: [
    {
      id: 'prod-1',
      name: 'Nasi Liwet Komplit Ayam Goreng',
      price: 32000,
      description: 'Nasi liwet gurih wangi daun salam, ayam goreng serundeng lengkuas, tahu-tempe bacem, lalapan & sambal terasi.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'prod-2',
      name: 'Nasi Bakar Cumi Cabe Ijo',
      price: 26000,
      description: 'Nasi gurih dibungkus daun pisang bakar dengan isian cumi asin oseng cabe ijo kemangi yang wangi semerbak.',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'prod-3',
      name: 'Es Cendol Durian Gula Aren',
      price: 20000,
      description: 'Cendol pandan suji kenyal berpadu santan gurih, daging durian monthong asli, dan kucuran gula aren murni.',
      imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'prod-4',
      name: 'Sambal Bawang Juara (Jar 150g)',
      price: 35000,
      description: 'Sambal bawang Brebes goreng wangi kemasan toples kaca higienis. Tahan hingga 1 bulan di suhu ruang.',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'prod-5',
      name: 'Bakwan Sayur Udang Crispy (Isi 5)',
      price: 15000,
      description: 'Gorengan bakwan renyah dengan potongan udang basah segar dan sayuran renyah. Disajikan dengan cabe rawit.',
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80',
      isAvailable: false
    }
  ]
};

const STORAGE_KEY = 'umkm_digital_storefront_state_v3';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeData, setStoreData] = useState<StoreData>(DEFAULT_STORE_DATA);

  useEffect(() => {
    if (!shouldUseSupabase()) return;
    const timer = window.setTimeout(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: store } = await supabase.from('stores').select('*').eq('owner_id', user.id).maybeSingle();
      if (!store) return;
      const { data: products } = await supabase.from('products').select('*').eq('store_id', store.id).order('position');
      setStoreData(mapStore(store, products ?? []));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const persistStore = async (next: StoreData) => {
    if (!shouldUseSupabase()) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('stores').update(storePayload(next)).eq('owner_id', user.id);
  };

  const getStoreId = async () => {
    if (!shouldUseSupabase()) return null;
    const supabase = createClient();
    const { data } = await supabase.from('stores').select('id').maybeSingle();
    return data?.id as string | undefined;
  };

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!parsed.theme || !parsed.theme.id) {
            parsed.theme = THEME_PRESETS.emerald;
          }
          if (!parsed.themeMode) {
            parsed.themeMode = 'light';
          }
          if (!parsed.qrisImageUrl) {
            parsed.qrisImageUrl = DEFAULT_STORE_DATA.qrisImageUrl;
            parsed.qrisAccountName = DEFAULT_STORE_DATA.qrisAccountName;
          }
          setStoreData(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse saved StoreData from localStorage, using defaults:', e);
      }
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storeData));
    } catch (e) {
      console.error('Failed to save StoreData to localStorage:', e);
    }
  }, [storeData]);

  const updateStoreInfo = (data: Partial<StoreData>) => {
    void persistStore({ ...storeData, ...data });
    setStoreData((prev) => ({
      ...prev,
      ...data
    }));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID()
    };

    setStoreData((prev) => ({
      ...prev,
      products: [newProduct, ...prev.products]
    }));
    void (async () => {
      const storeId = await getStoreId();
      if (!storeId) return;
      await createClient().from('products').insert({ id:newProduct.id,store_id:storeId,name:newProduct.name,price:newProduct.price,description:newProduct.description,image_url:newProduct.imageUrl,is_available:newProduct.isAvailable,category:newProduct.category||null });
    })();
  };

  const updateProduct = (id: string, productUpdates: Partial<Product>) => {
    setStoreData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...productUpdates } : p))
    }));
    if (shouldUseSupabase()) void createClient().from('products').update({
      ...(productUpdates.name!==undefined&&{name:productUpdates.name}),
      ...(productUpdates.price!==undefined&&{price:productUpdates.price}),
      ...(productUpdates.description!==undefined&&{description:productUpdates.description}),
      ...(productUpdates.imageUrl!==undefined&&{image_url:productUpdates.imageUrl}),
      ...(productUpdates.isAvailable!==undefined&&{is_available:productUpdates.isAvailable}),
      ...(productUpdates.category!==undefined&&{category:productUpdates.category}),
    }).eq('id',id);
  };

  const deleteProduct = (id: string) => {
    setStoreData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id)
    }));
    if (shouldUseSupabase()) void createClient().from('products').delete().eq('id',id);
  };

  const setTheme = (themeId: string) => {
    const selectedTheme = THEME_PRESETS[themeId as ThemeId] || {
      id: themeId,
      name: 'Custom',
      bgClass: 'bg-emerald-600',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      textClass: 'text-emerald-600',
      accentClass: 'emerald'
    };

    setStoreData((prev) => ({
      ...prev,
      theme: selectedTheme
    }));
    void persistStore({ ...storeData, theme: selectedTheme });
  };

  const setThemeMode = (mode: ThemeMode) => {
    setStoreData((prev) => ({
      ...prev,
      themeMode: mode
    }));
    void persistStore({ ...storeData, themeMode: mode });
  };

  const toggleProductAvailability = (id: string) => {
    const current = storeData.products.find((product) => product.id === id);
    setStoreData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
      )
    }));
    if (current && shouldUseSupabase()) void createClient().from('products').update({is_available:!current.isAvailable}).eq('id',id);
  };

  const resetToDefault = () => {
    setStoreData(DEFAULT_STORE_DATA);
  };

  return (
    <StoreContext.Provider
      value={{
        storeData,
        updateStoreInfo,
        addProduct,
        updateProduct,
        deleteProduct,
        setTheme,
        setThemeMode,
        toggleProductAvailability,
        resetToDefault
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export default StoreContext;
