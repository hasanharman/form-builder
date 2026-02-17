'use client'

import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { use } from 'react'

import { components } from '@/constants/components'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const componentPages = {
  autocomplete: dynamic(() => import('@/components/components/autocomplete')),
  'location-input': dynamic(
    () => import('@/components/components/location-input'),
  ),
  'signature-input': dynamic(
    () => import('@/components/components/signature-input'),
  ),
  'signature-pad': dynamic(() => import('@/components/components/signature-pad')),
  'credit-card': dynamic(() => import('@/components/components/credit-card')),
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const PreviewComponent = componentPages[slug as keyof typeof componentPages]
  const isKnownSlug = components.some((group) =>
    group.sub.some((entry) => entry.path === `/components/${slug}`),
  )

  if (!PreviewComponent || !isKnownSlug) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {slug.replace(/-/g, ' ')} Component
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <PreviewComponent />
      </div>
    </div>
  )
}
