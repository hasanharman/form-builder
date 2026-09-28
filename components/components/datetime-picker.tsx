'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { DatetimePicker } from '@/components/ui/datetime-picker'

const format = `[
  ['months', 'days', 'years'],
  ['hours', 'minutes', 'am/pm'],
]`

const previewCode = `<DatetimePicker value={date} onChange={setDate} format={${format}} />`

const usageCode = `import { DatetimePicker } from '@/components/ui/datetime-picker'

const [date, setDate] = React.useState<Date | undefined>(new Date())

<DatetimePicker
  value={date}
  onChange={setDate}
  format={${format}}
/>`

export default function DatetimePickerPreview() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <ComponentDocShell
      name="datetime-picker"
      preview={
        <DatetimePicker
          value={date}
          onChange={setDate}
          format={[
            ['months', 'days', 'years'],
            ['hours', 'minutes', 'am/pm'],
          ]}
        />
      }
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Arrow keys step each segment; typing jumps to the next one.',
        'Configurable segment order and 12/24-hour clocks.',
      ]}
    />
  )
}
