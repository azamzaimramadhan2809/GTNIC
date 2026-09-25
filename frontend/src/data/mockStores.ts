import type { StoreData } from '../types/store';
import { THEME_PRESETS } from '../types/store';

export const MOCK_STORES: Record<string, StoreData> = {
  'warungbusiti': {
    username: 'warungbusiti',
    storeName: 'Warung Bu Siti',
    bio: '🍲 Masakan Nusantara otentik & aneka jajanan pasar khas Bu Siti. Resep turun temurun sejak 1998, higienis & 100% Halal!',
    logoUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&auto=format&fit=crop&q=80',
    whatsappNumber: '6281234567890',
    instagramUrl: 'https://instagram.com/warungbusiti',
    mapsUrl: 'https://maps.google.com/?q=Jakarta',
    theme: THEME_PRESETS.emerald,
    themeMode: 'light',
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
        description: 'Nasi gurih dibungkus daun pisang bakar dengan isian cumi asin oseng cabe ijo kemangi.',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
        isAvailable: true
      }
    ]
  },
  'kopisenja': {
    username: 'kopisenja',
    storeName: 'Kopi Senja & Roastery',
    bio: '☕ Kopi artisan lokal & camilan manis khas Bandung. Freshly roasted every day! Order via WhatsApp & pick up atau kirim instan.',
    logoUrl: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=300&auto=format&fit=crop&q=80',
    whatsappNumber: '6281234567890',
    instagramUrl: 'https://instagram.com/kopisenja.bdg',
    mapsUrl: 'https://maps.google.com/?q=Bandung',
    theme: THEME_PRESETS.indigo,
    themeMode: 'dark',
    products: [
      {
        id: 'prod-101',
        name: 'Es Kopi Susu Senja (Gula Aren)',
        price: 18000,
        description: 'Espresso blend Arabica-Robusta dengan susu segar creamy dan sirup gula aren murni.',
        imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80',
        isAvailable: true
      }
    ]
  }
};
