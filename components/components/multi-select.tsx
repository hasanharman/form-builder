'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select'

const options = ['React', 'Vue', 'Svelte', 'Solid', 'Angular']

const previewCode = `<MultiSelector values={values} onValuesChange={setValues}>
  <MultiSelectorTrigger>
    <MultiSelectorInput placeholder="Select frameworks" />
  </MultiSelectorTrigger>
  <MultiSelectorContent>
    <MultiSelectorList>
      <MultiSelectorItem value="React">React</MultiSelectorItem>
      <MultiSelectorItem value="Vue">Vue</MultiSelectorItem>
    </MultiSelectorList>
  </MultiSelectorContent>
</MultiSelector>`

const usageCode = `import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select'

const [values, setValues] = React.useState<string[]>([])

${previewCode}`

export default function MultiSelectPreview() {
  const [values, setValues] = React.useState<string[]>(['React'])

  return (
    <ComponentDocShell
      name="multi-select"
      preview={
        <MultiSelector values={values} onValuesChange={setValues}>
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Select frameworks" />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              {options.map((option) => (
                <MultiSelectorItem key={option} value={option}>
                  {option}
                </MultiSelectorItem>
              ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>
      }
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Type to filter; Enter toggles the highlighted option.',
        'Selected values render as removable badges.',
        'Backspace removes the last value.',
      ]}
    />
  )
}
