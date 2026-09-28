import * as Locales from 'date-fns/locale'

/**
 * One field in the playground. `variant` names a Field variant
 * (components/field-variants), which decides how the field renders,
 * validates and is generated; the rest is what the user edits.
 */
export type FormFieldType = {
  variant: string
  name: string
  label: string
  description?: string
  placeholder?: string
  /** Native input type, for the Input variant. */
  type?: string
  required?: boolean
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  locale?: keyof typeof Locales
  hour12?: boolean
  className?: string
}
