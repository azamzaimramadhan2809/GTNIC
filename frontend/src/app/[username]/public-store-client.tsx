'use client'

import { useRouter } from 'next/navigation'
import { PublicStore } from '../../views/PublicStore'
import type { StoreData } from '@/types/store'

export default function PublicStoreClient({ username, initialStore }: { username: string; initialStore: StoreData | null }) {
  const router = useRouter()

  return <PublicStore username={username} initialStore={initialStore} onNavigate={(path) => router.push(path)} />
}
