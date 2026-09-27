'use client'

import { PasswordInput } from '@/components/ui/password-input'
import { lit, stringSchema } from './helpers'
import type { FieldVariant } from './types'

export const passwordVariant: FieldVariant = {
  name: 'Password',
  defaults: { label: 'Password', description: 'Enter your password.', placeholder: '********' },
  settings: ['range'],
  registryItems: ['password-input'],
  imports: () => ['import { PasswordInput } from "@/components/ui/password-input"'],
  schema: (field) => stringSchema(field),
  defaultValue: () => '',
  Control: ({ field, id, value, onChange, onBlur, invalid }) => (
    <PasswordInput
      id={id}
      placeholder={field.placeholder}
      disabled={field.disabled}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      aria-invalid={invalid}
    />
  ),
  control: (field, b) => `<PasswordInput
  id={${b.id}}
  placeholder=${lit(field.placeholder)}${field.disabled ? '\n  disabled' : ''}
  value={${b.value}}
  onChange={(event) => ${b.onChange('event.target.value')}}
  onBlur={${b.onBlur}}
  aria-invalid={${b.invalid}}
/>`,
}
