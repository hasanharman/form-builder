import { NextResponse } from 'next/server'

export function proxy(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  if (pathname === '/templates' || /^\/templates\/[^/]+$/.test(pathname)) {
    return NextResponse.redirect(new URL('/templates/authentication/login', url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/templates', '/templates/:category'],
}
