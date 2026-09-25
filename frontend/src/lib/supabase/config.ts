const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export function isSupabaseConfigured() {
  return Boolean(url && key && !url.includes('YOUR_PROJECT') && !key.includes('YOUR_KEY'))
}

export function isDemoAuthEnabled() {
  return process.env.NEXT_PUBLIC_DEMO_AUTH === 'true'
}

export function shouldUseSupabase() {
  return isSupabaseConfigured() && !isDemoAuthEnabled()
}

export function getSupabaseConfig() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase belum dikonfigurasi. Salin .env.example ke .env.local lalu isi URL dan publishable key.')
  }
  return { url: url!, key: key! }
}
