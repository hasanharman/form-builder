'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { MaskedInput } from '@/components/ui/masked-input'

const previewCode = `<MaskedInput mask="999-99-9999" value={value} onValueChange={setValue} />`
const usageCode = `import { MaskedInput } from '@/components/ui/masked-input'

<MaskedInput mask="999-99-9999" value={value} onValueChange={setValue} />`

export default function MaskedInputPreview() {
  const [value, setValue] = React.useState('')

  return (
    <ComponentDocShell
      title="Masked Input"
      slug="masked-input"
      description="Generic masked input for SSN, tax ID, IBAN, or custom patterns."
      preview={<MaskedInput mask="999-99-9999" value={value} onValueChange={setValue} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={['Mask tokens: 9 (digit), a (letter), * (alphanumeric).']}
    />
  )
}
