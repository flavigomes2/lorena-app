import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Se não houver sessão e a rota não for pública, redireciona para login
    if (!session && !req.nextUrl.pathname.startsWith('/login') && !req.nextUrl.pathname.startsWith('/criar-conta')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Se houver sessão e estiver tentando acessar páginas de login/criar conta, redireciona para home
    if (session && (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/criar-conta'))) {
      return NextResponse.redirect(new URL('/home', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // Em caso de erro, redireciona para login
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
