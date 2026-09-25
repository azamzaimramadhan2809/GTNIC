import type { Product, StoreData, ThemeId } from '@/types/store'
import { THEME_PRESETS } from '@/types/store'

type StoreRow = Record<string, unknown>
type ProductRow = Record<string, unknown>

export function mapStore(row: StoreRow, products: ProductRow[] = []): StoreData {
  const themeId = String(row.theme_id ?? 'emerald') as ThemeId
  return {
    username: String(row.username),
    storeName: String(row.store_name),
    bio: String(row.bio ?? ''),
    logoUrl: String(row.logo_url ?? ''),
    whatsappNumber: String(row.whatsapp_number ?? ''),
    instagramUrl: String(row.instagram_url ?? ''),
    mapsUrl: String(row.maps_url ?? ''),
    theme: THEME_PRESETS[themeId] ?? THEME_PRESETS.emerald,
    themeMode: row.theme_mode === 'dark' ? 'dark' : 'light',
    qrisImageUrl: row.qris_image_url ? String(row.qris_image_url) : undefined,
    qrisAccountName: row.qris_account_name ? String(row.qris_account_name) : undefined,
    openingHours: row.opening_hours ? String(row.opening_hours) : undefined,
    address: row.address ? String(row.address) : undefined,
    whatsappMessage: row.whatsapp_message ? String(row.whatsapp_message) : undefined,
    bankName: row.bank_name ? String(row.bank_name) : undefined,
    bankAccountNumber: row.bank_account_number ? String(row.bank_account_number) : undefined,
    bankAccountName: row.bank_account_name ? String(row.bank_account_name) : undefined,
    products: products.map(mapProduct),
  }
}

export function mapProduct(row: ProductRow): Product {
  return { id:String(row.id), name:String(row.name), price:Number(row.price), description:String(row.description??''), imageUrl:String(row.image_url??''), isAvailable:Boolean(row.is_available), category:row.category?String(row.category):undefined }
}

export function storePayload(store: StoreData) {
  return { username:store.username,store_name:store.storeName,bio:store.bio,logo_url:store.logoUrl,whatsapp_number:store.whatsappNumber,instagram_url:store.instagramUrl,maps_url:store.mapsUrl,theme_id:store.theme.id,theme_mode:store.themeMode,qris_image_url:store.qrisImageUrl||null,qris_account_name:store.qrisAccountName||null,opening_hours:store.openingHours||null,address:store.address||null,whatsapp_message:store.whatsappMessage||null,bank_name:store.bankName||null,bank_account_number:store.bankAccountNumber||null,bank_account_name:store.bankAccountName||null }
}
