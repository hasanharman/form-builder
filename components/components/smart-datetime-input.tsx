'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { SmartDatetimeInput } from '@/components/ui/smart-datetime-input'

const previewCode = `<SmartDatetimeInput
  value={date}
  onValueChange={setDate}
  placeholder="e.g. tomorrow at 3pm"
/>`

const usageCode = `import { SmartDatetimeInput } from '@/components/ui/smart-datetime-input'

const [date, setDate] = React.useState<Date | null>(null)

${previewCode}`

export default function SmartDatetimeInputPreview() {
  const [date, setDate] = React.useState<Date | null>(null)

  return (
    <ComponentDocShell
      name="smart-datetime-input"
      preview={
        <div className="space-y-2">
          <SmartDatetimeInput
            value={date}
            onValueChange={setDate}
            placeholder="e.g. tomorrow at 3pm"
          />
          <p className="text-xs text-muted-foreground">
            Value: {date ? date.toString() : '—'}
          </p>
        </div>
      }
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Parses natural language with chrono-node.',
        'Calendar and time list for pointer users.',
        'Locale and 12/24-hour aware.',
      ]}
    />
  )
}
