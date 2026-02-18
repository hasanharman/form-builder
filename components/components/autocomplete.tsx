'use client'

import Autocomplete from '@/components/ui/autocomplete'
import { ComponentDocShell } from '@/components/components/component-doc-shell'

const previewCode = `<Autocomplete value={value} onChange={setValue} />`

const usageCode = `import Autocomplete from '@/components/ui/autocomplete'

<Autocomplete value={value} onChange={setValue} />`

export default function AutocompletePreview() {
  return (
    <ComponentDocShell
      title="Autocomplete"
      slug="autocomplete"
      description="Search input with debounced suggestions and keyboard navigation."
      preview={<Autocomplete />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Debounced filtering with use-debounce.',
        'Keyboard navigation (ArrowUp, ArrowDown, Enter, Escape).',
        'Accessible listbox semantics for suggestions.',
      ]}
      dependencies={['use-debounce']}
    />
  )
}
