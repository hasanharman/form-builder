'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { lit, stringSchema } from './helpers'
import type { FieldVariant } from './types'

const OPTIONS = ['m@example.com', 'm@google.com', 'm@support.com']

export const selectVariant: FieldVariant = {
  name: 'Select',
  defaults: {
    label: 'Email',
    description: 'You can manage email addresses in your email settings.',
    placeholder: 'Select a verified email to display',
  },
  registryItems: ['select'],
  imports: () => [
    'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"',
  ],
  schema: (field) => stringSchema(field, 'Please select an option'),
  defaultValue: () => '',
  Control: ({ field, id, value, onChange, invalid }) => (
    <Select value={value ?? ''} onValueChange={(next) => onChange(next ?? '')} disabled={field.disabled}>
      <SelectTrigger id={id} aria-invalid={invalid}>
        <SelectValue placeholder={field.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
  control: (field, b) => `<Select
  value={${b.value}}
  onValueChange={(value) => ${b.onChange('value ?? ""')}}${field.disabled ? '\n  disabled' : ''}
>
  <SelectTrigger id={${b.id}} aria-invalid={${b.invalid}}>
    <SelectValue placeholder=${lit(field.placeholder)} />
  </SelectTrigger>
  <SelectContent>
${OPTIONS.map((option) => `    <SelectItem value="${option}">${option}</SelectItem>`).join('\n')}
  </SelectContent>
</Select>`,
}
