'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { CronExpressionBuilder } from '@/components/ui/cron-expression-builder'

const previewCode = `<CronExpressionBuilder onChange={(v) => setCron(v.expression)} />`
const usageCode = `import { CronExpressionBuilder } from '@/components/ui/cron-expression-builder'

<CronExpressionBuilder onChange={(v) => setCron(v.expression)} />`

export default function CronExpressionBuilderPreview() {
  const [summary, setSummary] = React.useState('')

  return (
    <ComponentDocShell
      title="Cron Expression Builder"
      slug="cron-expression-builder"
      description="Visual cron schedule builder with human-readable summary."
      preview={<CronExpressionBuilder onChange={(v) => setSummary(v.human)} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={['Minute/hour/day controls.', 'Generated cron expression output.', 'Human-readable schedule string.']}
      notes={<p>Live summary: <strong>{summary || 'Not set yet'}</strong></p>}
    />
  )
}
