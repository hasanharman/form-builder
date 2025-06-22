'use client'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AppSidebar({
  items,
  onAddStep,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  items: {
    title: string | React.ReactNode
    items?: {
      title: string | React.ReactNode
      icon?: React.ReactNode
      onClick?: () => void
      className?: string
    }[]
  }[]
  onAddStep?: () => void
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        {onAddStep && (
          <SidebarGroup className="py-0">
            <SidebarGroupContent className="relative">
              <Button variant="outline" className="w-full" onClick={onAddStep}>
                <Plus className="size-4" />
                <span>Add Step</span>
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {items?.map((item, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items?.map((item, itemIndex) => (
                  <SidebarMenuItem
                    key={itemIndex}
                    className={cn(item.className, {
                      'cursor-pointer': !!item.onClick,
                    })}
                  >
                    <SidebarMenuButton asChild onClick={() => item.onClick?.()}>
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
