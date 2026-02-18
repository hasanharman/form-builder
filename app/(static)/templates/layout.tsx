import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Templates - Shadcn Form Builder',
  description: 'You can find all the necessary templates',
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

export default function TemplatesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="w-full min-h-[calc(100vh-250.5px)]">{children}</div>
}
