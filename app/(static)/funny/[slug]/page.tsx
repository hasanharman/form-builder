import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { funnyComponents, listFunnyComponents } from '@/components/funny'
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
  return listFunnyComponents().map((item) => ({ slug: item.name }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return registryItemMetadata((await params).slug)
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const item = getRegistryItem(slug)
  const Doc = funnyComponents[slug]?.doc

  if (!item || !Doc) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 pb-16 pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/funny">Funny</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{item.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="rounded-xl border bg-background p-3 md:p-5">
        <Doc />
      </div>
    </div>
  )
}
