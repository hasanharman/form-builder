'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { SortableListInput } from '@/components/ui/sortable-list-input'

const previewCode = `<SortableListInput value={items} onChange={setItems} />`
const usageCode = `import { SortableListInput } from '@/components/ui/sortable-list-input'

<SortableListInput value={items} onChange={setItems} />`

export default function SortableListInputPreview() {
  const [items, setItems] = React.useState<string[]>(['Backlog', 'In Progress', 'Done'])

  return (
    <ComponentDocShell
      title="Sortable List Input"
      slug="sortable-list-input"
      description="Drag-and-drop reorderable list stored as a form value."
      preview={<SortableListInput value={items} onChange={setItems} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={['Add/remove rows.', 'Native drag-and-drop reorder.', 'Controlled array API.']}
    />
  )
}
