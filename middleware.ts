import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /templates/authentication)
  const pathname = request.nextUrl.pathname

  // Define redirects for specific paths
  if (pathname === '/templates' || pathname.match(/^\/templates\/[^/]+$/)) {
    return NextResponse.redirect(
      new URL('/templates/authentication/login', request.url),
    )
  }

  // Continue with the request if no redirect is needed
  return NextResponse.next()
}

// Add matcher for the middleware to only run on specific paths
export const config = {
  matcher: ['/templates', '/templates/:category'],
}
