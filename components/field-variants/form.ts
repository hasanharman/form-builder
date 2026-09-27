import type { z } from 'zod'

import type { FormFieldType } from '@/types'
import { getFieldVariant } from './index'
import { printValue, toSource, toZod, zx } from './schema-expr'

/** A playground form: fields, or rows of up to three fields shown side by side. */
export type FormFieldOrGroup = FormFieldType | FormFieldType[]

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/
const key = (name: string) => (IDENTIFIER.test(name) ? name : JSON.stringify(name))

/** A new field of `variant` with that variant's default label, description and placeholder. */
export function createField(variant: string): FormFieldType {
  const { defaults } = getFieldVariant(variant)
  return {
    variant,
    name: `name_${Math.random().toString().slice(-10)}`,
    label: defaults.label,
    description: defaults.description,
    placeholder: defaults.placeholder ?? '',
    required: true,
    disabled: false,
  }
}

/** The runtime zod schema the playground preview validates with. */
export function buildFormSchema(fields: FormFieldOrGroup[]): z.ZodObject {
  return toZod(
    zx.object(
      Object.fromEntries(fields.flat().map((field) => [field.name, getFieldVariant(field.variant).schema(field)])),
    ),
  ) as z.ZodObject
}

/** `const formSchema = z.object({...})`, the same schema as source code. */
export function formSchemaSource(fields: FormFieldOrGroup[]): string {
  const entries = fields
    .flat()
    .map((field) => `  ${key(field.name)}: ${toSource(getFieldVariant(field.variant).schema(field))},`)
  return `const formSchema = z.object({\n${entries.join('\n')}\n})`
}

export function formDefaultValues(fields: FormFieldOrGroup[]): Record<string, unknown> {
  return Object.fromEntries(
    fields.flat().map((field) => [field.name, getFieldVariant(field.variant).defaultValue(field)]),
  )
}

/** The default values object as source code, e.g. `{ name: "", birthday: new Date() }`. */
export function formDefaultValuesSource(fields: FormFieldOrGroup[]): string {
  const entries = fields
    .flat()
    .map((field) => `${key(field.name)}: ${printValue(getFieldVariant(field.variant).defaultValue(field))},`)
  return `{\n${entries.map((entry) => `  ${entry}`).join('\n')}\n}`
}
