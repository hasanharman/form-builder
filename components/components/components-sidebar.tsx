'use client'

import { usePathname } from 'next/navigation'
import { Link } from 'next-view-transitions'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { documentedComponents } from '@/components/components'

export function AppSidebar() {
  const pathname = usePathname()
  const items = documentedComponents()
  return (
    <Sidebar collapsible="none" className="border-r bg-background">
      <SidebarContent>
        <SidebarGroup className="py-4">
          <SidebarMenu className="gap-2">
            <SidebarMenuItem className="mb-2">
              <SidebarMenuButton asChild className="py-2">
                <Link href="/components" className="font-semibold text-base">
                  Components
                </Link>
              </SidebarMenuButton>
              <SidebarMenuBadge className="border">{items.length}</SidebarMenuBadge>
              <SidebarMenuSub className="gap-1 py-2">
                {items.map((item) => {
                  const path = `/components/${item.name}`
                  return (
                    <SidebarMenuSubItem key={item.name}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === path}
                        className="py-2 h-auto"
                      >
                        <Link href={path} className="leading-snug">
                          {item.title}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
