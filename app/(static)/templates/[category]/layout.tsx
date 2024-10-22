import { ReactNode } from 'react'

import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/templates/templates-sidebar'

interface LayoutProps {
  children: ReactNode
  params: {
    category: string
  }
}

export default function TemplateLayout({ children, params }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full pl-3">{children}</main>
    </SidebarProvider>
  )
}
