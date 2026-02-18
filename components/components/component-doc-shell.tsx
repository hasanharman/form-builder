'use client'

import * as React from 'react'
import { Link } from 'next-view-transitions'

import Code from '@/components/code'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ComponentDocShellProps = {
  title: string
  slug: string
  description: string
  preview: React.ReactNode
  previewCode: string
  usageCode: string
  features?: string[]
  dependencies?: string[]
  notes?: React.ReactNode
}

export function ComponentDocShell({
  title,
  slug,
  description,
  preview,
  previewCode,
  usageCode,
  features = [],
  dependencies = [],
  notes,
}: ComponentDocShellProps) {
  const installationCode = `npx shadcn@latest add https://www.shadcn-form.com/registry/${slug}.json`

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
        <Code code={installationCode} />
        <p className="text-sm text-muted-foreground">
          Registry JSON:{' '}
          <Link
            href={`https://www.shadcn-form.com/registry/${slug}.json`}
            target="_blank"
            className="underline"
          >
            /registry/{slug}.json
          </Link>
        </p>
        {dependencies.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground">Install dependencies:</p>
            <Code code={`npm install ${dependencies.join(' ')}`} />
          </>
        ) : null}
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Usage</h3>
        <Code code={usageCode} />
      </section>

      {notes ? <section className="text-sm text-muted-foreground">{notes}</section> : null}
    </div>
  )
}
