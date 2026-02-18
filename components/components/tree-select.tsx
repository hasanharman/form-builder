'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { TreeOption, TreeSelect } from '@/components/ui/tree-select'

const options: TreeOption[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    children: [
      { id: 'react', label: 'React' },
      { id: 'nextjs', label: 'Next.js' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    children: [
      { id: 'node', label: 'Node.js' },
      { id: 'go', label: 'Go' },
    ],
  },
]

const previewCode = `<TreeSelect options={options} value={value} onChange={setValue} />`
const usageCode = `import { TreeSelect } from '@/components/ui/tree-select'

<TreeSelect options={options} value={value} onChange={setValue} />`

export default function TreeSelectPreview() {
  const [value, setValue] = React.useState<string[]>([])

  return (
    <ComponentDocShell
      title="Tree Select"
      slug="tree-select"
      description="Hierarchical dropdown with expandable nodes and checkbox selection."
      preview={<TreeSelect options={options} value={value} onChange={setValue} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={['Nested option groups.', 'Expandable/collapsible tree.', 'Multiple selection support.']}
    />
  )
}
