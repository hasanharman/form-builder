'use client'

import LocationSelector from '@/components/ui/location-input'
import { code, zx } from './schema-expr'
import type { FieldVariant } from './types'

export const locationInputVariant: FieldVariant = {
  name: 'Location Input',
  defaults: {
    label: 'Select Country',
    description: 'If your country has states, it will be appear after selecting country',
  },
  registryItems: ['location-input'],
  imports: () => ['import LocationSelector from "@/components/ui/location-input"'],
  schema: (field) => {
    const location = zx.tuple([zx.string(), zx.string().optional()])
    // Reported on the field itself rather than on the tuple's first element.
    return field.required
      ? location.refine(code(([country]: [string, string?]) => country.length > 0, '([country]) => country.length > 0'), {
          message: 'Country is required',
        })
      : location
  },
  defaultValue: () => ['', ''],
  Control: ({ field, value, onChange }) => (
    <LocationSelector
      disabled={field.disabled}
      onCountryChange={(country) => onChange([country?.name ?? '', ''])}
      onStateChange={(state) => onChange([value?.[0] ?? '', state?.name ?? ''])}
    />
  ),
  control: (field, b) => `<LocationSelector${field.disabled ? '\n  disabled' : ''}
  onCountryChange={(country) => ${b.onChange('[country?.name ?? "", ""]')}}
  onStateChange={(state) => ${b.onChange(`[${b.value}[0], state?.name ?? ""]`)}}
/>`,
}
