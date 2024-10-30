import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Components - Shadcn Form Builder',
  description: 'New components for the shadcn',
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

export default function ComponentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="max-w-5xl mx-auto min-h-[calc(100vh-250.5px)]">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Components</h1>
        <p className="text-sm text-muted-foreground">
          Unofficial shadcn components that you asked for and we could not find
          better so far.
        </p>
        <div>{children}</div>
      </div>
    </div>
  )
}
