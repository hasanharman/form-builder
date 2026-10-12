import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funny - Shadcn Form Builder',
  description: 'Form components nobody asked for, built on shadcn/ui.',
}

export default function FunnyLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="w-full min-h-[calc(100vh-250.5px)]">{children}</div>
}
