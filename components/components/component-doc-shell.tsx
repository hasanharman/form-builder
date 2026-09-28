'use client'

import * as React from 'react'
import { Link } from 'next-view-transitions'

import Code from '@/components/code'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getRegistryItem,
  installCommand,
  registryItemUrl,
} from '@/lib/registry-catalog'

type ComponentDocShellProps = {
  /** Registry item name; title, description and install command come from the catalog. */
  name: string
  preview: React.ReactNode
  previewCode: string
  usageCode: string
  features?: string[]
  notes?: React.ReactNode
}

export function ComponentDocShell({
  name,
  preview,
  previewCode,
  usageCode,
  features = [],
  notes,
}: ComponentDocShellProps) {
  const item = getRegistryItem(name)
  if (!item) throw new Error(`Unknown registry item: ${name}`)
  const { title, description } = item

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Preview</h3>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <Card className="p-4 md:p-6">{preview}</Card>
          </TabsContent>
          <TabsContent value="code">
            <Card>
              <Code code={previewCode} />
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {features.length > 0 ? (
        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Features</h3>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Installation</h3>
        <Code code={installCommand(name)} />
        <p className="text-sm text-muted-foreground">
          The CLI installs every dependency listed in the{' '}
          <Link href={registryItemUrl(name)} target="_blank" className="underline">
            registry item
          </Link>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Usage</h3>
        <Code code={usageCode} />
      </section>

      {notes ? <section className="text-sm text-muted-foreground">{notes}</section> : null}
    </div>
  )
}
