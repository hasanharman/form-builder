'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { optionalUnlessRequired } from './helpers'
import { zx } from './schema-expr'
import type { FieldVariant } from './types'

export const datePickerVariant: FieldVariant = {
  name: 'Date Picker',
  defaults: {
    label: 'Date of birth',
    description: 'Your date of birth is used to calculate your age.',
  },
  registryItems: ['button', 'calendar', 'popover'],
  imports: () => [
    'import { format } from "date-fns"',
    'import { CalendarIcon } from "lucide-react"',
    'import { cn } from "@/lib/utils"',
    'import { buttonVariants } from "@/components/ui/button"',
    'import { Calendar } from "@/components/ui/calendar"',
    'import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"',
  ],
  schema: (field) => optionalUnlessRequired(field, zx.date({ message: 'A date is required' })),
  defaultValue: () => new Date(),
  Control: ({ field, id, value, onChange, invalid }) => (
    <Popover>
      <PopoverTrigger
        id={id}
        type="button"
        disabled={field.disabled}
        aria-invalid={invalid}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'w-full justify-start text-left font-normal',
          !value && 'text-muted-foreground',
        )}
      >
        <CalendarIcon className="mr-2 size-4" />
        {value ? format(value, 'PPP') : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  ),
  control: (field, b) => `<Popover>
  <PopoverTrigger
    id={${b.id}}
    type="button"${field.disabled ? '\n    disabled' : ''}
    aria-invalid={${b.invalid}}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "w-full justify-start text-left font-normal",
      !${b.value} && "text-muted-foreground"
    )}
  >
    <CalendarIcon className="mr-2 size-4" />
    {${b.value} ? format(${b.value}, "PPP") : <span>Pick a date</span>}
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="single"
      selected={${b.value}}
      onSelect={(date) => date && ${b.onChange('date')}}
    />
  </PopoverContent>
</Popover>`,
}
