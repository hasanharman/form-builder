import { ReactNode } from 'react'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/templates/templates-sidebar'

interface LayoutProps {
  children: ReactNode
}

export default async function TemplateLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '26rem',
          '--sidebar-width-mobile': '22rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 min-w-0 p-3 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
