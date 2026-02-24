import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Create an initial response
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 2. Initialize Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. ALLOW PUBLIC ROUTES
  // We don't want to run auth checks for the landing page or the QR redirector
  if (pathname === '/' || pathname.startsWith('/q/')) {
    return response 
  }

  // 4. PROTECT PRIVATE ROUTES
  // getUser() is the secure way to check auth in middleware
  const { data: { user } } = await supabase.auth.getUser()

  // If no user and trying to access dashboard/analytics, boot them to landing
  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/analytics'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // 5. REDIRECT AUTH USERS AWAY FROM LANDING
  // If they are logged in and hit the landing page, send them to dashboard
  if (user && pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (internal APIs)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}