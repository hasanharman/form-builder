'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { AvailabilityPicker } from '@/components/ui/availability-picker'

const previewCode = `<AvailabilityPicker value={slots} onChange={setSlots} />`
const usageCode = `import { AvailabilityPicker } from '@/components/ui/availability-picker'

<AvailabilityPicker value={slots} onChange={setSlots} />`

export default function AvailabilityPickerPreview() {
  const [slots, setSlots] = React.useState<{ day: number; hour: number }[]>([])

  return (
    <ComponentDocShell
      name="availability-picker"
      preview={<AvailabilityPicker value={slots} onChange={setSlots} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={['Weekly hour grid.', 'Toggle slots on click.', 'Controlled output array for forms.']}
    />
  )
}
