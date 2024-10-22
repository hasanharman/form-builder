import type { Metadata } from 'next'
import { Link } from 'next-view-transitions'

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
  return (
    <div className="max-w-5xl mx-auto min-h-[calc(100vh-250.5px)]">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Templates</h1>
        <p className="text-sm text-muted-foreground">
          Minimalist templates for building your next product. Built with React,
          NextJS, TailwindCSS, Framer Motion and Typescript.
        </p>
        <div>{children}</div>
      </div>
    </div>
  )
}
