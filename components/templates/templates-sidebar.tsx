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

import { templates } from '@/constants/templates'

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar className="sticky">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {templates.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.path}
                    className="font-semibold pointer-events-none"
                  >
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge className="border">
                  {item.sub.length}
                </SidebarMenuBadge>
                {item.sub?.length ? (
                  <SidebarMenuSub>
                    {item.sub.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.path}
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
