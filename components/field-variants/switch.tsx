'use client'

import { Switch } from '@/components/ui/switch'
import { zx } from './schema-expr'
import type { FieldVariant } from './types'

export const switchVariant: FieldVariant = {
  name: 'Switch',
  defaults: {
    label: 'Marketing emails',
    description: 'Receive emails about new products, features, and more.',
  },
  registryItems: ['switch'],
  imports: () => ['import { Switch } from "@/components/ui/switch"'],
  schema: () => zx.boolean(),
  defaultValue: () => false,
  layout: 'control-last',
  Control: ({ field, id, value, onChange, invalid }) => (
    <Switch
      id={id}
      disabled={field.disabled}
      checked={value === true}
      onCheckedChange={(checked) => onChange(checked === true)}
      aria-invalid={invalid}
    />
  ),
  control: (field, b) => `<Switch
  id={${b.id}}${field.disabled ? '\n  disabled' : ''}
  checked={${b.value}}
  onCheckedChange={(checked) => ${b.onChange('checked === true')}}
  aria-invalid={${b.invalid}}
/>`,
}
