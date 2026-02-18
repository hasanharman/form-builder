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

import { templates } from '@/constants/templates'

export function AppSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const parts = pathname.split('/').filter(Boolean)
  const selectedCategory = parts[1]
  const selectedSlug = parts[2]
  const selectedFlow = searchParams.get('flow') ?? 'sign-in'

  const visibleTemplates =
    selectedSlug
      ? templates
        .filter((item) => item.path.endsWith(`/${selectedCategory}`))
      : templates

  const isShadcnAuthPage =
    selectedCategory === 'authentication' && selectedSlug === 'shadcn-auth'

  const shadcnAuthFlows = [
    { title: 'Login', path: '/templates/authentication/shadcn-auth?flow=sign-in', flow: 'sign-in' },
    { title: 'Sign Up', path: '/templates/authentication/shadcn-auth?flow=sign-up', flow: 'sign-up' },
    {
      title: 'Forgot Password',
      path: '/templates/authentication/shadcn-auth?flow=forgot-password',
      flow: 'forgot-password',
    },
    {
      title: 'Reset Password',
      path: '/templates/authentication/shadcn-auth?flow=reset-password',
      flow: 'reset-password',
    },
  ]

  return (
    <Sidebar className="sticky top-4 h-[calc(100svh-6.5rem)]">
      <SidebarContent className="h-full">
        <SidebarGroup className="h-full">
          <SidebarMenu>
            {(isShadcnAuthPage
              ? [
                  {
                    title: 'Shadcn Auth Pages',
                    path: '/templates/authentication/shadcn-auth',
                    sub: shadcnAuthFlows,
                  },
                ]
              : visibleTemplates
            ).map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.path} className="font-semibold">
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
                          isActive={
                            isShadcnAuthPage
                              ? 'flow' in subItem && subItem.flow === selectedFlow
                              : pathname === subItem.path
                          }
                        >
                          <Link href={subItem.path}>
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
