import { NextResponse } from 'next/server'

export function proxy(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  if (/^\/templates\/[^/]+$/.test(pathname)) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/templates/:category'],
}
