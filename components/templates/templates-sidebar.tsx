'use client'

import { usePathname, useSearchParams } from 'next/navigation'
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
import { findTemplate, resolveFlow, templateCategories } from '@/constants/templates'

type SidebarEntry = {
  title: string
  path: string
  sub: { key: string; title: string; path: string; isActive: boolean }[]
}

export function AppSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, categoryId, name] = pathname.split('/').filter(Boolean)
  const template = categoryId && name ? findTemplate(categoryId, name) : undefined
  const activeFlow = template && resolveFlow(template, searchParams.get('flow') ?? undefined)

  // A multi-page template lists its flows; otherwise list templates by category.
  const entries: SidebarEntry[] = template?.flows
    ? [
        {
          title: `${template.title} Pages`,
          path: template.path,
          sub: template.flows.map((flow) => ({
            key: flow.id,
            title: flow.title,
            path: `${template.path}?flow=${flow.id}`,
            isActive: flow.id === activeFlow?.id,
          })),
        },
      ]
    : templateCategories
        .filter((category) => !template || category.id === categoryId)
        .map((category) => ({
          title: category.title,
          path: category.path,
          sub: category.templates.map((entry) => ({
            key: entry.name,
            title: entry.title,
            path: entry.path,
            isActive: pathname === entry.path,
          })),
        }))

  return (
    <Sidebar className="sticky top-4 h-[calc(100svh-6.5rem)]">
      <SidebarContent className="h-full">
        <SidebarGroup className="h-full">
          <SidebarMenu>
            {entries.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton className="font-semibold" render={<Link href={item.path} />}>
                  {item.title}
                </SidebarMenuButton>
                <SidebarMenuBadge className="border">{item.sub.length}</SidebarMenuBadge>
                <SidebarMenuSub>
                  {item.sub.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.key}>
                      <SidebarMenuSubButton
                        isActive={subItem.isActive}
                        render={<Link href={subItem.path} />}
                      >
                        {subItem.title}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
