'use client'

import { Input } from '@/components/ui/input'
import { lit, stringSchema } from './helpers'
import { zx } from './schema-expr'
import type { FieldVariant } from './types'

export const inputVariant: FieldVariant = {
  name: 'Input',
  defaults: {
    label: 'Username',
    description: 'This is your public display name.',
    placeholder: 'shadcn',
  },
  settings: ['inputType', 'range'],
  registryItems: ['input'],
  imports: () => ['import { Input } from "@/components/ui/input"'],
  schema: (field) => {
    if (field.type === 'email') {
      const email = zx.email({ message: 'Invalid email address' })
      return field.required ? email : email.or(zx.literal(''))
    }
    if (field.type === 'number') {
      // The input holds a string; the schema outputs a number.
      let number = (zx.coerce as any)['number<string>']({ message: 'Must be a number' })
      if (field.min !== undefined) number = number.min(field.min, { message: `Must be at least ${field.min}` })
      if (field.max !== undefined) number = number.max(field.max, { message: `Must be at most ${field.max}` })
      return number
    }
    return stringSchema(field)
  },
  defaultValue: () => '',
  Control: ({ field, id, value, onChange, onBlur, invalid }) => (
    <Input
      id={id}
      type={field.type || 'text'}
      placeholder={field.placeholder}
      disabled={field.disabled}
      className={field.className}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      aria-invalid={invalid}
    />
  ),
  control: (field, b) => `<Input
  id={${b.id}}
  type=${lit(field.type || 'text')}
  placeholder=${lit(field.placeholder)}${field.disabled ? '\n  disabled' : ''}
  value={${b.value}}
  onChange={(event) => ${b.onChange('event.target.value')}}
  onBlur={${b.onBlur}}
  aria-invalid={${b.invalid}}
/>`,
}
