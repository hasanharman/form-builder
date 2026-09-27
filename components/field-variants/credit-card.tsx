'use client'

import { CreditCard } from '@/components/ui/credit-card'
import { code, zx } from './schema-expr'
import type { FieldVariant } from './types'

const PARTS = ['cardholderName', 'cardNumber', 'expiryMonth', 'expiryYear', 'cvv'] as const

export const creditCardVariant: FieldVariant = {
  name: 'Credit Card',
  defaults: {
    label: 'Credit Card Information',
    description: 'Enter your credit card details for payment.',
  },
  registryItems: ['credit-card'],
  imports: () => ['import { CreditCard } from "@/components/ui/credit-card"'],
  schema: (field) => {
    const card = zx.object(Object.fromEntries(PARTS.map((part) => [part, zx.string()])))
    // One message on the field itself, not one per card part.
    return field.required
      ? card.refine(
          code(
            (value: Record<string, string>) => Object.values(value).every(Boolean),
            '(card) => Object.values(card).every(Boolean)',
          ),
          { message: 'Please fill in all credit card fields' },
        )
      : card
  },
  defaultValue: () => Object.fromEntries(PARTS.map((part) => [part, ''])),
  Control: ({ value, onChange }) => <CreditCard value={value} onChange={onChange} />,
  control: (_field, b) => `<CreditCard
  value={${b.value}}
  onChange={(card) => ${b.onChange('card')}}
/>`,
}
