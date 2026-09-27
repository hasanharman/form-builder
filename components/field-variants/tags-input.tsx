'use client'

import { TagsInput } from '@/components/ui/tags-input'
import { lit } from './helpers'
import { zx } from './schema-expr'
import type { FieldVariant } from './types'

export const tagsInputVariant: FieldVariant = {
  name: 'Tags Input',
  defaults: { label: 'Enter your tech stack.', description: 'Add tags.', placeholder: 'Enter your tags' },
  registryItems: ['tags-input'],
  imports: () => ['import { TagsInput } from "@/components/ui/tags-input"'],
  schema: (field) => {
    const tags = zx.array(zx.string())
    return field.required ? tags.min(1, { message: 'Please enter at least one item' }) : tags
  },
  defaultValue: () => [],
  Control: ({ field, value, onChange }) => (
    <TagsInput value={value ?? []} onValueChange={onChange} placeholder={field.placeholder} />
  ),
  control: (field, b) => `<TagsInput
  value={${b.value}}
  onValueChange={(tags) => ${b.onChange('tags')}}
  placeholder=${lit(field.placeholder)}
/>`,
}
