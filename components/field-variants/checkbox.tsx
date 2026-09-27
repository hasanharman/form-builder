'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { code, zx } from './schema-expr'
import type { FieldVariant } from './types'

export const checkboxVariant: FieldVariant = {
  name: 'Checkbox',
  defaults: {
    label: 'Use different settings for my mobile devices',
    description: 'You can manage your mobile notifications in the mobile settings page.',
  },
  registryItems: ['checkbox'],
  imports: () => ['import { Checkbox } from "@/components/ui/checkbox"'],
  schema: (field) =>
    field.required
      ? zx.boolean().refine(code((value: boolean) => value, '(value) => value'), {
          message: 'Required',
        })
      : zx.boolean(),
  defaultValue: () => false,
  layout: 'control-first',
  Control: ({ field, id, value, onChange, invalid }) => (
    <Checkbox
      id={id}
      disabled={field.disabled}
      checked={value === true}
      onCheckedChange={(checked) => onChange(checked === true)}
      aria-invalid={invalid}
    />
  ),
  control: (field, b) => `<Checkbox
  id={${b.id}}${field.disabled ? '\n  disabled' : ''}
  checked={${b.value}}
  onCheckedChange={(checked) => ${b.onChange('checked === true')}}
  aria-invalid={${b.invalid}}
/>`,
}
