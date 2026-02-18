'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { InlineEditableField } from '@/components/ui/inline-editable-field'

const previewCode = `<InlineEditableField value={value} onChange={setValue} />`
const usageCode = `import { InlineEditableField } from '@/components/ui/inline-editable-field'

<InlineEditableField value={value} onChange={setValue} />`

export default function InlineEditableFieldPreview() {
  const [value, setValue] = React.useState('Click to edit me')

  return (
    <ComponentDocShell
      title="Inline Editable Field"
      slug="inline-editable-field"
      description="Click-to-edit text that toggles between view and input modes."
      preview={<InlineEditableField value={value} onChange={setValue} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={['Inline edit state.', 'Save on blur/Enter.', 'Escape to cancel changes.']}
    />
  )
}
