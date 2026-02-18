'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { TokenInput } from '@/components/ui/token-input'

const previewCode = `<TokenInput value={tokens} onChange={setTokens} />`
const usageCode = `import { TokenInput } from '@/components/ui/token-input'

<TokenInput value={tokens} onChange={setTokens} />`

export default function TokenInputPreview() {
  const [tokens, setTokens] = React.useState<string[]>(['react', 'shadcn'])

  return (
    <ComponentDocShell
      title="Tag / Token Input"
      slug="token-input"
      description="Input that turns text into removable tags/chips."
      preview={<TokenInput value={tokens} onChange={setTokens} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={['Enter/comma to create tags.', 'Backspace to remove last token.', 'Duplicate prevention.']}
    />
  )
}
