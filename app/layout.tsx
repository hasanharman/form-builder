import type { Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import { Toaster } from 'sonner'
import localFont from 'next/font/local'
import NextTopLoader from 'nextjs-toploader'

import './globals.css'

import AllProviders from '@/providers'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Shadcn Form Builder',
  description: 'Shadcn Form Builder',
  openGraph: {
    images: [
      {
        url: 'https://www.shadcn-form.com/meta.png',
        width: 600,
        height: 315,
      },
    ],
    type: 'website',
    siteName: 'Shadcn Form Builder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shadcn Form Builder',
    description: 'Shadcn Form Builder',
    images: ['https://www.shadcn-form.com/meta.png'],
    creator: '@strad3r',
  },
  keywords: ['form', 'builder', 'shadcn', 'react'],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="17f8a974-0a7f-426d-857a-daa8d80cc12e"
          ></script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div>
            <NextTopLoader color="#FF9432" showSpinner={false} />
            <Toaster />
            <AllProviders>
              <main className="min-h-[70vh]">{children}</main>
            </AllProviders>
          </div>
        </body>
      </html>
    </ViewTransitions>
  )
}
