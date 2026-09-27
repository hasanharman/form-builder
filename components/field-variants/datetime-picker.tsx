'use client'

import { DatetimePicker } from '@/components/ui/datetime-picker'
import { optionalUnlessRequired } from './helpers'
import { zx } from './schema-expr'
import type { FieldVariant } from './types'

export const datetimePickerVariant: FieldVariant = {
  name: 'Datetime Picker',
  defaults: {
    label: 'Submission Date',
    description: 'Add the date of submission with detailly.',
  },
  registryItems: ['datetime-picker'],
  imports: () => ['import { DatetimePicker } from "@/components/ui/datetime-picker"'],
  schema: (field) => optionalUnlessRequired(field, zx.date({ message: 'A date is required' })),
  defaultValue: () => new Date(),
  Control: ({ value, onChange }) => (
    <DatetimePicker
      value={value}
      onChange={onChange}
      format={[
        ['months', 'days', 'years'],
        ['hours', 'minutes', 'am/pm'],
      ]}
    />
  ),
  control: (_field, b) => `<DatetimePicker
  value={${b.value}}
  onChange={(date) => date && ${b.onChange('date')}}
  format={[
    ["months", "days", "years"],
    ["hours", "minutes", "am/pm"],
  ]}
/>`,
}
