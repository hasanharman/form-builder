import { ReactNode } from 'react'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/components/components-sidebar'

interface LayoutProps {
  children: ReactNode
}

export default async function TemplateLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '20rem',
          '--sidebar-width-mobile': '20rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
