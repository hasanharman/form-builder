'use client'

import * as React from 'react'

import SignaturePad from '@/components/ui/signature-pad'
import { ComponentDocShell } from '@/components/components/component-doc-shell'

const previewCode = `<SignaturePad value={signature} onChange={setSignature} />`

const usageCode = `import * as React from 'react'
import SignaturePad from '@/components/ui/signature-pad'

const [signature, setSignature] = React.useState<string | null>(null)

<SignaturePad value={signature} onChange={setSignature} />`

export default function SignaturePadPreview() {
  const [signature, setSignature] = React.useState<string | null>(null)

  return (
    <ComponentDocShell
      title="Signature Pad"
      slug="signature-pad"
      description="Dialog-based signature capture with hold-to-confirm interaction."
      preview={<SignaturePad value={signature} onChange={setSignature} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Inline preview after signing.',
        'Touch and mouse drawing with smoothing.',
        'Hold-to-confirm flow to reduce accidental submissions.',
      ]}
    />
  )
}
