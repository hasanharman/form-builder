import { ReactNode } from 'react'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/components/components-sidebar'

interface LayoutProps {
  children: ReactNode
  params: {
    slug: string
  }
}

export default function TemplateLayout({ children, params }: LayoutProps) {
  return (
    <SidebarProvider
      style={{
        '--sidebar-width': '14rem',
        '--sidebar-width-mobile': '20rem',
      } as React.CSSProperties}
    >
      <AppSidebar />
      <main className="w-full lg:pl-3">{children}</main>
    </SidebarProvider>
  )
}
