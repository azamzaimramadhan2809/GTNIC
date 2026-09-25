import React, { createContext, useContext, useState, useEffect } from 'react';
import type { StoreData, Product, ThemeId, ThemeMode } from '../types/store';
import { THEME_PRESETS } from '../types/store';

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
  const [storeData, setStoreData] = useState<StoreData>(() => {
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
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved StoreData from localStorage, using defaults:', e);
    }
    return DEFAULT_STORE_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storeData));
    } catch (e) {
      console.error('Failed to save StoreData to localStorage:', e);
    }
  }, [storeData]);

  const updateStoreInfo = (data: Partial<StoreData>) => {
    setStoreData((prev) => ({
      ...prev,
      ...data
    }));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    };

    setStoreData((prev) => ({
      ...prev,
      products: [newProduct, ...prev.products]
    }));
  };

  const updateProduct = (id: string, productUpdates: Partial<Product>) => {
    setStoreData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...productUpdates } : p))
    }));
  };

  const deleteProduct = (id: string) => {
    setStoreData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id)
    }));
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
  };

  const setThemeMode = (mode: ThemeMode) => {
    setStoreData((prev) => ({
      ...prev,
      themeMode: mode
    }));
  };

  const toggleProductAvailability = (id: string) => {
    setStoreData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
      )
    }));
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
