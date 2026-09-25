export type ThemeMode = 'light' | 'dark';
export type ThemeId = 'emerald' | 'indigo' | 'amber' | 'rose' | 'dark';

export interface ThemePreset {
  id: ThemeId | string;
  name: string;
  bgClass: string;
  buttonClass: string;
  textClass: string;
  accentClass: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  category?: string;
}

export interface StoreData {
  username: string;
  storeName: string;
  bio: string;
  logoUrl: string;
  whatsappNumber: string;
  instagramUrl: string;
  mapsUrl: string;
  theme: ThemePreset;
  themeMode: ThemeMode;
  qrisImageUrl?: string;
  qrisAccountName?: string;
  openingHours?: string;
  address?: string;
  whatsappMessage?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  products: Product[];
}

export const THEME_PRESETS: Record<ThemeId, ThemePreset> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Green',
    bgClass: 'bg-emerald-500',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    textClass: 'text-emerald-600',
    accentClass: 'emerald'
  },
  indigo: {
    id: 'indigo',
    name: 'Indigo Modern',
    bgClass: 'bg-indigo-600',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    textClass: 'text-indigo-600',
    accentClass: 'indigo'
  },
  amber: {
    id: 'amber',
    name: 'Amber Warm',
    bgClass: 'bg-amber-600',
    buttonClass: 'bg-amber-600 hover:bg-amber-500 text-white',
    textClass: 'text-amber-600',
    accentClass: 'amber'
  },
  rose: {
    id: 'rose',
    name: 'Rose Blossom',
    bgClass: 'bg-rose-600',
    buttonClass: 'bg-rose-600 hover:bg-rose-500 text-white',
    textClass: 'text-rose-600',
    accentClass: 'rose'
  },
  dark: {
    id: 'dark',
    name: 'Midnight Slate',
    bgClass: 'bg-slate-900',
    buttonClass: 'bg-slate-900 hover:bg-slate-800 text-white',
    textClass: 'text-slate-900',
    accentClass: 'slate'
  }
};
