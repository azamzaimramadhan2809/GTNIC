import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured, isDemoAuthEnabled, getSupabaseConfig } from './config'

export async function updateSession(request: NextRequest) {
  if (isDemoAuthEnabled() || !isSupabaseConfigured()) return NextResponse.next({ request })
  const { url, key } = getSupabaseConfig()
  let response = NextResponse.next({ request })
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })
  const { data } = await supabase.auth.getClaims()
  const pathname = request.nextUrl.pathname
  const protectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')
  const authRoute = pathname === '/login' || pathname === '/register'
  if (!data?.claims && protectedRoute) {
    const target = request.nextUrl.clone()
    target.pathname = '/login'
    target.searchParams.set('next', pathname)
    return NextResponse.redirect(target)
  }
  if (data?.claims && authRoute) {
    const target = request.nextUrl.clone()
    target.pathname = '/dashboard'
    target.search = ''
    return NextResponse.redirect(target)
  }
  return response
}
