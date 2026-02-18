'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { EmojiPicker } from '@/components/ui/emoji-picker'

const previewCode = `<EmojiPicker value={emoji} onChange={setEmoji} />`
const usageCode = `import { EmojiPicker } from '@/components/ui/emoji-picker'

<EmojiPicker value={emoji} onChange={setEmoji} />`

export default function EmojiPickerPreview() {
  const [emoji, setEmoji] = React.useState('')

  return (
    <ComponentDocShell
      title="Emoji Picker"
      slug="emoji-picker"
      description="Categorized emoji selector input built with popover + scroll area."
      preview={<EmojiPicker value={emoji} onChange={setEmoji} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={['Category groups.', 'Simple search/filter.', 'Keyboard-friendly popover trigger.']}
    />
  )
}
