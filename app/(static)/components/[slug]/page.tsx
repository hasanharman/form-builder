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
  'availability-picker': dynamic(
    () => import('@/components/components/availability-picker'),
  ),
  'color-picker': dynamic(() => import('@/components/components/color-picker')),
  'cron-expression-builder': dynamic(
    () => import('@/components/components/cron-expression-builder'),
  ),
  'emoji-picker': dynamic(() => import('@/components/components/emoji-picker')),
  'image-upload-dropzone': dynamic(
    () => import('@/components/components/image-upload-dropzone'),
  ),
  'inline-editable-field': dynamic(
    () => import('@/components/components/inline-editable-field'),
  ),
  'location-input': dynamic(
    () => import('@/components/components/location-input'),
  ),
  'masked-input': dynamic(() => import('@/components/components/masked-input')),
  'signature-input': dynamic(
    () => import('@/components/components/signature-input'),
  ),
  'signature-pad': dynamic(() => import('@/components/components/signature-pad')),
  'sortable-list-input': dynamic(
    () => import('@/components/components/sortable-list-input'),
  ),
  'token-input': dynamic(() => import('@/components/components/token-input')),
  'transfer-list': dynamic(() => import('@/components/components/transfer-list')),
  'tree-select': dynamic(() => import('@/components/components/tree-select')),
  'credit-card': dynamic(() => import('@/components/components/credit-card')),
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const PreviewComponent = componentPages[slug as keyof typeof componentPages]
  const componentEntry = components
    .flatMap((group) => group.sub)
    .find((entry) => entry.path === `/components/${slug}`)
  const isKnownSlug = components.some((group) =>
    group.sub.some((entry) => entry.path === `/components/${slug}`),
  )

  if (!PreviewComponent || !isKnownSlug) {
    notFound()
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-gradient-to-b from-background to-muted/30 p-4 md:p-6 space-y-3">
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
        <h1 className="text-2xl font-semibold capitalize">
          {slug.replace(/-/g, ' ')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {componentEntry?.description ?? 'Reusable component with shadcn/ui and React.'}
        </p>
      </div>
      <div className="rounded-xl border bg-background p-3 md:p-5">
        <PreviewComponent />
      </div>
    </div>
  )
}
