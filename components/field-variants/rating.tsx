'use client'

import { Rating } from '@/components/ui/rating'
import { zx } from './schema-expr'
import type { FieldVariant } from './types'

export const ratingVariant: FieldVariant = {
  name: 'Rating',
  defaults: { label: 'Rating', description: 'Please provide your rating.' },
  registryItems: ['rating'],
  imports: () => ['import { Rating } from "@/components/ui/rating"'],
  schema: (field) =>
    field.required ? zx.number().min(1, { message: 'Please provide a rating' }) : zx.number(),
  defaultValue: () => 0,
  Control: ({ field, value, onChange }) => (
    <Rating value={value ?? 0} onChange={onChange} readOnly={field.disabled} />
  ),
  control: (field, b) => `<Rating
  value={${b.value}}
  onChange={(value) => ${b.onChange('value')}}${field.disabled ? '\n  readOnly' : ''}
/>`,
}
