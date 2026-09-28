'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { TagsInput } from '@/components/ui/tags-input'

const previewCode = `<TagsInput value={tags} onValueChange={setTags} placeholder="Add a tag" />`

const usageCode = `import { TagsInput } from '@/components/ui/tags-input'

const [tags, setTags] = React.useState<string[]>([])

${previewCode}`

export default function TagsInputPreview() {
  const [tags, setTags] = React.useState<string[]>(['react', 'shadcn'])

  return (
    <ComponentDocShell
      name="tags-input"
      preview={<TagsInput value={tags} onValueChange={setTags} placeholder="Add a tag" />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Enter or comma adds a tag; Backspace removes the last one.',
        'Arrow keys move between tags.',
        'Optional minItems and maxItems.',
      ]}
    />
  )
}
