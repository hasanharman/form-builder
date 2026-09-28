'use client'

import { isValidPhoneNumber } from 'react-phone-number-input'

import { PhoneInput } from '@/components/ui/phone-input'
import { lit, optionalUnlessRequired } from './helpers'
import { code, zx } from './schema-expr'
import type { FieldVariant } from './types'

export const phoneVariant: FieldVariant = {
  name: 'Phone',
  defaults: { label: 'Phone number', description: 'Enter your phone number.', placeholder: 'Enter a phone number' },
  registryItems: ['phone-input'],
  imports: () => [
    'import { isValidPhoneNumber } from "react-phone-number-input"',
    'import { PhoneInput } from "@/components/ui/phone-input"',
  ],
  schema: (field) =>
    field.required
      ? zx.string().refine(code(isValidPhoneNumber, 'isValidPhoneNumber'), {
          message: 'Invalid phone number',
        })
      : optionalUnlessRequired(field, zx.string()),
  defaultValue: () => '',
  Control: ({ field, id, value, onChange, onBlur }) => (
    <PhoneInput
      id={id}
      placeholder={field.placeholder}
      disabled={field.disabled}
      defaultCountry="TR"
      value={value}
      onChange={(phone) => onChange(phone ?? '')}
      onBlur={onBlur}
    />
  ),
  control: (field, b) => `<PhoneInput
  id={${b.id}}
  placeholder=${lit(field.placeholder)}${field.disabled ? '\n  disabled' : ''}
  defaultCountry="TR"
  value={${b.value}}
  onChange={(phone) => ${b.onChange('phone ?? ""')}}
  onBlur={${b.onBlur}}
/>`,
}
