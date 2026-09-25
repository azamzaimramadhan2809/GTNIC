import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ configured: false, connected: false }, { status: 503 })
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('stores').select('id').limit(1)
    if (error) throw error
    return NextResponse.json({ configured: true, connected: true })
  } catch (error) {
    return NextResponse.json({ configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 503 })
  }
}
