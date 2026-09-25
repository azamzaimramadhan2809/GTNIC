import PublicStoreClient from './public-store-client'
import { shouldUseSupabase } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import { mapStore } from '@/lib/stores'

interface PublicStorePageProps {
  params: Promise<{ username: string }>
}

export default async function PublicStorePage({ params }: PublicStorePageProps) {
  const { username } = await params
  let initialStore = null
  if (shouldUseSupabase()) {
    const supabase = await createClient()
    const { data: store } = await supabase.from('stores').select('*').eq('username', username.toLowerCase()).eq('is_published', true).maybeSingle()
    if (store) {
      const { data: products } = await supabase.from('products').select('*').eq('store_id', store.id).order('position')
      initialStore = mapStore(store, products ?? [])
    }
  }
  return <PublicStoreClient username={username} initialStore={initialStore} />
}
