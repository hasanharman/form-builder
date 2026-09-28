'use client'

import { Textarea } from '@/components/ui/textarea'
import { lit, stringSchema } from './helpers'
import type { FieldVariant } from './types'

export const textareaVariant: FieldVariant = {
  name: 'Textarea',
  defaults: {
    label: 'Bio',
    description: 'You can @mention other users and organizations.',
    placeholder: 'Tell us a little bit about yourself',
  },
  settings: ['range'],
  registryItems: ['textarea'],
  imports: () => ['import { Textarea } from "@/components/ui/textarea"'],
  schema: (field) => stringSchema(field),
  defaultValue: () => '',
  Control: ({ field, id, value, onChange, onBlur, invalid }) => (
    <Textarea
      id={id}
      placeholder={field.placeholder}
      disabled={field.disabled}
      className={field.className ?? 'resize-none'}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      aria-invalid={invalid}
    />
  ),
  control: (field, b) => `<Textarea
  id={${b.id}}
  placeholder=${lit(field.placeholder)}
  className="resize-none"${field.disabled ? '\n  disabled' : ''}
  value={${b.value}}
  onChange={(event) => ${b.onChange('event.target.value')}}
  onBlur={${b.onBlur}}
  aria-invalid={${b.invalid}}
/>`,
}
