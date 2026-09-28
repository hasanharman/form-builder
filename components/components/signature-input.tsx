'use client'

import * as React from 'react'

import SignatureInput from '@/components/ui/signature-input'
import { ComponentDocShell } from '@/components/components/component-doc-shell'

const previewCode = `<SignatureInput
  canvasRef={canvasRef}
  onSignatureChange={(dataUrl) => setValue(dataUrl)}
/>`

const usageCode = `import * as React from 'react'
import SignatureInput from '@/components/ui/signature-input'

const canvasRef = React.useRef<HTMLCanvasElement>(null)

<SignatureInput
  canvasRef={canvasRef}
  onSignatureChange={(dataUrl) => setValue(dataUrl)}
/>`

export default function SignatureInputPreview() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  return (
    <ComponentDocShell
      name="signature-input"
      preview={
        <SignatureInput
          canvasRef={canvasRef}
          onSignatureChange={() => undefined}
        />
      }
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Mouse and touch support.',
        'Clear action built in.',
        'Works with react-hook-form via onSignatureChange.',
      ]}
    />
  )
}
