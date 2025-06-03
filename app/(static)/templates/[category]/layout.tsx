import { ReactNode } from 'react'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/templates/templates-sidebar'

interface LayoutProps {
  children: ReactNode
  params: Promise<{
    category: string
  }>
}

export default async function TemplateLayout({ children, params }: LayoutProps) {
  const { category } = await params;
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full lg:pl-3">{children}</main>
    </SidebarProvider>
  )
}
