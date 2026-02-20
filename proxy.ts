import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log(pathname);

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value))
        },
      },
    }
  )

  if (pathname === '/' || pathname.startsWith('/q/')) {
    return NextResponse.next()
  }

  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // return NextResponse.redirect(new URL('/', request.url));
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * 1. / (The root login page)
     * 2. _next/static, _next/image, favicon.ico (Static files)
     * 3. api (Internal Next.js APIs)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|$).*)',
  ],
}