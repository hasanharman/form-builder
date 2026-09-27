'use client'

import { FieldLabel } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { stringSchema } from './helpers'
import type { FieldVariant } from './types'

const OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

export const radioGroupVariant: FieldVariant = {
  name: 'RadioGroup',
  defaults: { label: 'Gender', description: 'Select your gender' },
  registryItems: ['radio-group'],
  imports: () => ['import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"'],
  schema: (field) => stringSchema(field, 'Please select an option'),
  defaultValue: () => '',
  Control: ({ field, id, value, onChange, invalid }) => (
    <RadioGroup
      value={value ?? ''}
      onValueChange={(next) => onChange(String(next ?? ''))}
      disabled={field.disabled}
      aria-invalid={invalid}
    >
      {OPTIONS.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
          <FieldLabel htmlFor={`${id}-${option.value}`} className="font-normal">
            {option.label}
          </FieldLabel>
        </div>
      ))}
    </RadioGroup>
  ),
  control: (field, b) => `<RadioGroup
  value={${b.value}}
  onValueChange={(value) => ${b.onChange('String(value ?? "")')}}${field.disabled ? '\n  disabled' : ''}
  aria-invalid={${b.invalid}}
>
${OPTIONS.map(
  (option) => `  <div className="flex items-center gap-3">
    <RadioGroupItem value="${option.value}" id={\`\${${b.id}}-${option.value}\`} />
    <FieldLabel htmlFor={\`\${${b.id}}-${option.value}\`} className="font-normal">
      ${option.label}
    </FieldLabel>
  </div>`,
).join('\n')}
</RadioGroup>`,
}
