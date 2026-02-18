'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { TransferList } from '@/components/ui/transfer-list'

const START_AVAILABLE = [
  { id: '1', label: 'Read' },
  { id: '2', label: 'Write' },
  { id: '3', label: 'Delete' },
  { id: '4', label: 'Deploy' },
]

const previewCode = `<TransferList available={available} selected={selected} onChange={setState} />`
const usageCode = `import { TransferList } from '@/components/ui/transfer-list'

<TransferList available={available} selected={selected} onChange={setState} />`

export default function TransferListPreview() {
  const [state, setState] = React.useState({
    available: START_AVAILABLE,
    selected: [] as { id: string; label: string }[],
  })

  return (
    <ComponentDocShell
      title="Transfer List"
      slug="transfer-list"
      description="Dual-list picker to move items between available and selected panels."
      preview={<TransferList available={state.available} selected={state.selected} onChange={setState} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={['Bulk move selected items.', 'Bidirectional transfer controls.', 'Simple controlled state API.']}
    />
  )
}
