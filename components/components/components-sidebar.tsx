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
import { components } from '@/constants/components'

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar className="sticky">
      <SidebarContent>
        <SidebarGroup className="py-4">
          <SidebarMenu className="gap-2">
            {components.map((item) => (
              <SidebarMenuItem key={item.title} className="mb-2">
                <SidebarMenuButton asChild className="py-2">
                  <Link href={item.path} className="font-semibold">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge className="border">
                  {item.sub.length}
                </SidebarMenuBadge>
                {item.sub?.length ? (
                  <SidebarMenuSub className="gap-1 py-2">
                    {item.sub.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.path}
                          className="py-2"
                        >
                          <Link href={subItem.path} className="capitalize">
                            {subItem.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
