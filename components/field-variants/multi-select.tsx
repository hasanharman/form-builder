'use client'

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select'
import { zx } from './schema-expr'
import type { FieldVariant } from './types'

const OPTIONS = ['React', 'Vue', 'Svelte']

export const multiSelectVariant: FieldVariant = {
  name: 'Multi Select',
  defaults: { label: 'Select your framework', description: 'Select multiple options.' },
  registryItems: ['multi-select'],
  imports: () => [
    'import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "@/components/ui/multi-select"',
  ],
  schema: (field) => {
    const values = zx.array(zx.string())
    return field.required ? values.min(1, { message: 'Please select at least one item' }) : values
  },
  defaultValue: () => [],
  Control: ({ value, onChange }) => (
    <MultiSelector values={value ?? []} onValuesChange={onChange} loop className="max-w-xs">
      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder="Select languages" />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          {OPTIONS.map((option) => (
            <MultiSelectorItem key={option} value={option}>
              {option}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  ),
  control: (_field, b) => `<MultiSelector
  values={${b.value}}
  onValuesChange={(values) => ${b.onChange('values')}}
  loop
  className="max-w-xs"
>
  <MultiSelectorTrigger>
    <MultiSelectorInput placeholder="Select languages" />
  </MultiSelectorTrigger>
  <MultiSelectorContent>
    <MultiSelectorList>
${OPTIONS.map((option) => `      <MultiSelectorItem value="${option}">${option}</MultiSelectorItem>`).join('\n')}
    </MultiSelectorList>
  </MultiSelectorContent>
</MultiSelector>`,
}
