import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { componentDocs, documentedComponents } from '@/components/components'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getRegistryItem, registryItemMetadata } from '@/lib/registry-catalog'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return documentedComponents().map((item) => ({ slug: item.name }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return registryItemMetadata((await params).slug)
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const item = getRegistryItem(slug)
  const Doc = componentDocs[slug]

  if (!item || !Doc) {
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
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
      <div className="rounded-xl border bg-background p-3 md:p-5">
        <Doc />
      </div>
    </div>
  )
}
