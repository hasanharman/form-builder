import type { FormFieldType } from '@/types'
import { zx, type SchemaExpr } from './schema-expr'

/** A JSX attribute value for a string: `"text"`, or `{"..."}` when it needs escaping. */
export const lit = (value: string | undefined) => {
  const text = value ?? ''
  return /["\\{}\n]/.test(text) ? `{${JSON.stringify(text)}}` : `"${text}"`
}

/** `required` string: at least `min` (default 1) characters; optional strings may be empty. */
export function stringSchema(field: FormFieldType, message = 'Required'): SchemaExpr {
  let schema = zx.string()
  if (field.required) {
    schema = field.min
      ? schema.min(field.min, { message: `Must be at least ${field.min} characters` })
      : schema.min(1, { message })
  }
  if (field.max) schema = schema.max(field.max, { message: `Must be at most ${field.max} characters` })
  return schema
}

/** Marks a non-string schema optional unless the field is required. */
export function optionalUnlessRequired(field: FormFieldType, schema: SchemaExpr): SchemaExpr {
  return field.required ? schema : (schema as ReturnType<typeof zx.any>).optional()
}
