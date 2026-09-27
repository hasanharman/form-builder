'use client'

import * as Locales from 'date-fns/locale'

import { SmartDatetimeInput } from '@/components/ui/smart-datetime-input'
import { lit, optionalUnlessRequired } from './helpers'
import { zx } from './schema-expr'
import type { FieldVariant } from './types'

export const smartDatetimeInputVariant: FieldVariant = {
  name: 'Smart Datetime Input',
  defaults: {
    label: "What's the best time for you?",
    description: 'Please select the full time',
    placeholder: 'e.g. Tomorrow morning 9am',
  },
  settings: ['locale'],
  registryItems: ['smart-datetime-input'],
  imports: (field) => [
    'import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input"',
    ...(field.locale ? [`import { ${field.locale} } from "date-fns/locale"`] : []),
  ],
  schema: (field) => optionalUnlessRequired(field, zx.date({ message: 'A date is required' })),
  defaultValue: () => new Date(),
  Control: ({ field, value, onChange }) => (
    <SmartDatetimeInput
      value={value}
      onValueChange={onChange}
      placeholder={field.placeholder}
      locale={field.locale ? Locales[field.locale] : undefined}
      hour12={field.hour12}
    />
  ),
  control: (field, b) => `<SmartDatetimeInput
  value={${b.value}}
  onValueChange={(date) => ${b.onChange('date')}}
  placeholder=${lit(field.placeholder)}${field.locale ? `\n  locale={${field.locale}}` : ''}${field.hour12 ? '\n  hour12' : ''}
/>`,
}
