'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { PhoneInput } from '@/components/ui/phone-input'

const previewCode = `<PhoneInput defaultCountry="US" value={phone} onChange={setPhone} />`

const usageCode = `import { PhoneInput } from '@/components/ui/phone-input'

const [phone, setPhone] = React.useState('')

<PhoneInput defaultCountry="US" value={phone} onChange={setPhone} />`

export default function PhoneInputPreview() {
  const [phone, setPhone] = React.useState<string>('')

  return (
    <ComponentDocShell
      name="phone-input"
      preview={
        <div className="space-y-2">
          <PhoneInput defaultCountry="US" value={phone} onChange={(v) => setPhone(v ?? '')} />
          <p className="text-xs text-muted-foreground">Value: {phone || '—'}</p>
        </div>
      }
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Returns E.164 formatted numbers (e.g. +14155552671).',
        'Searchable country list with flags.',
        'Formats as you type for the selected country.',
      ]}
    />
  )
}
