'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { PasswordInput } from '@/components/ui/password-input'

const previewCode = `<PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />`

const usageCode = `import { PasswordInput } from '@/components/ui/password-input'

const [password, setPassword] = React.useState('')

${previewCode}`

export default function PasswordInputPreview() {
  const [password, setPassword] = React.useState('')

  return (
    <ComponentDocShell
      name="password-input"
      preview={
        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      }
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Show/hide toggle, disabled while the field is empty.',
        'Hides the browser’s built-in reveal button.',
        'Accepts every native input prop.',
      ]}
    />
  )
}
