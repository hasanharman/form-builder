import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getTemplatePreview } from '@/components/templates/previews'
import { TemplateBlockViewer } from '@/components/templates/template-block-viewer'
import { findTemplate, resolveFlow } from '@/constants/templates'

interface TemplateDetailsPageProps {
  params: Promise<{ slug: string; category: string }>
  searchParams: Promise<{ flow?: string }>
}

export async function generateMetadata({
  params,
}: Pick<TemplateDetailsPageProps, 'params'>): Promise<Metadata> {
  const { category, slug } = await params
  const template = findTemplate(category, slug)
  if (!template) return {}
  return { title: `${template.title} - Shadcn Form Builder`, description: template.description }
}

export default async function Page({ params, searchParams }: TemplateDetailsPageProps) {
  const { slug, category } = await params
  const { flow: flowId } = await searchParams
  const template = findTemplate(category, slug)
  const flow = template && resolveFlow(template, flowId)
  const Preview = template && getTemplatePreview(template.name, flow?.id)

  if (!template || !Preview) {
    notFound()
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-gradient-to-b from-background to-muted/30 p-4 md:p-6 space-y-4">
        <h1 className="text-2xl font-semibold">{template.title}</h1>
        <p className="text-sm text-muted-foreground">{template.description}</p>

        <div className="rounded-lg border bg-background/80 p-3">
          <p className="text-sm font-medium">How to use</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Use the left sidebar to pick a flow or switch templates.</li>
            <li>Use Preview and Code in the block toolbar to test and copy quickly.</li>
            <li>
              Run the install command to add every file, dependency and
              component this template needs to your app.
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-4 md:p-5 space-y-6">
        <section>
          <TemplateBlockViewer name={template.name} flows={template.flows}>
            <Preview />
          </TemplateBlockViewer>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Features</h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {template.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
