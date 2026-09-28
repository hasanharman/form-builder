'use client'

import { Slider } from '@/components/ui/slider'
import type { FormFieldType } from '@/types'
import { zx } from './schema-expr'
import type { FieldVariant } from './types'

const range = (field: FormFieldType) => ({
  min: field.min ?? 0,
  max: field.max ?? 100,
  step: field.step ?? 1,
})

export const sliderVariant: FieldVariant = {
  name: 'Slider',
  defaults: { label: 'Set Price Range', description: 'Adjust the price by sliding.' },
  settings: ['range', 'step'],
  registryItems: ['slider'],
  imports: () => ['import { Slider } from "@/components/ui/slider"'],
  schema: (field) => {
    const { min, max } = range(field)
    return zx
      .number()
      .min(min, { message: `Must be at least ${min}` })
      .max(max, { message: `Must be at most ${max}` })
  },
  defaultValue: (field) => range(field).min,
  Control: ({ field, id, value, onChange }) => {
    const { min, max, step } = range(field)
    return (
      <div className="space-y-2">
        <Slider
          id={id}
          min={min}
          max={max}
          step={step}
          disabled={field.disabled}
          value={[value ?? min]}
          onValueChange={(next: number | readonly number[]) =>
            onChange(Array.isArray(next) ? next[0] : next)
          }
        />
        <p className="text-xs text-muted-foreground">Selected value: {value ?? min}</p>
      </div>
    )
  },
  control: (field, b) => {
    const { min, max, step } = range(field)
    return `<Slider
  id={${b.id}}
  min={${min}}
  max={${max}}
  step={${step}}${field.disabled ? '\n  disabled' : ''}
  value={[${b.value}]}
  onValueChange={(value: number | readonly number[]) =>
    ${b.onChange('Array.isArray(value) ? value[0] : value')}
  }
/>`
  },
}
