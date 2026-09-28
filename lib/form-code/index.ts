import { getFieldVariant } from '@/components/field-variants'
import { fieldShellSource } from '@/components/field-variants/field-shell'
import {
  formDefaultValuesSource,
  formSchemaSource,
  type FormFieldOrGroup,
} from '@/components/field-variants/form'
import { installCommand } from '@/lib/registry-catalog'
import { reactHookForm } from './react-hook-form'
import { tanstackForm } from './tanstack-form'
import type { FormLibraryAdapter } from './types'

export const FORM_LIBRARIES = {
  REACT_HOOK_FORM: 'react-hook-form',
  TANSTACK_FORM: 'tanstack-form',
} as const

export type FormLibrary = (typeof FORM_LIBRARIES)[keyof typeof FORM_LIBRARIES]

export const FORM_LIBRARY_LABELS: Record<FormLibrary, string> = {
  'react-hook-form': 'React Hook Form',
  'tanstack-form': 'TanStack Form',
}

const adapters: Record<FormLibrary, FormLibraryAdapter> = {
  'react-hook-form': reactHookForm,
  'tanstack-form': tanstackForm,
}

export function isFormLibrary(value: unknown): value is FormLibrary {
  return typeof value === 'string' && value in adapters
}

/** Every registry item the form's generated code imports, official and this site's. */
export function formRegistryItems(fields: FormFieldOrGroup[]): string[] {
  const items = new Set(['button', 'field', 'sonner'])
  for (const field of fields.flat()) {
    for (const item of getFieldVariant(field.variant).registryItems) items.add(item)
  }
  return [...items]
}

/** The one command that installs everything the generated form needs. */
export function formInstallCommand(fields: FormFieldOrGroup[]): string {
  return installCommand(formRegistryItems(fields))
}

const indent = (source: string, spaces: number) =>
  source
    .split('\n')
    .map((line) => (line ? ' '.repeat(spaces) + line : line))
    .join('\n')

const FIELD_PARTS = ['Field', 'FieldContent', 'FieldDescription', 'FieldError', 'FieldGroup', 'FieldLabel']
const COL_SPAN: Record<number, string> = { 2: 'col-span-6', 3: 'col-span-4' }

/**
 * A complete, self-contained form component for `library`: install command,
 * imports, zod schema, default values, and one bound control per field.
 * Unformatted; pass it through `formatCode` for display.
 */
export function generateFormCode(fields: FormFieldOrGroup[], library: FormLibrary): string {
  const adapter = adapters[library]

  const renderField = (field: (typeof fields)[number] & object) => {
    if (Array.isArray(field)) throw new Error('rows are rendered by renderRow')
    const variant = getFieldVariant(field.variant)
    return adapter.field(field.name, (binding) =>
      indent(fieldShellSource(field, binding, variant.control(field, binding)), 4),
    )
  }

  const body = fields
    .map((entry) =>
      Array.isArray(entry)
        ? `<div className="grid grid-cols-12 gap-4">\n${entry
            .map(
              (field) =>
                `  <div className="${COL_SPAN[entry.length] ?? 'col-span-12'}">\n${indent(renderField(field), 4)}\n  </div>`,
            )
            .join('\n')}\n</div>`
        : renderField(entry),
    )
    .map((source) => indent(source, 4))
    .join('\n')

  const markup = adapter.form(body)
  const usedFieldParts = FIELD_PARTS.filter((part) => new RegExp(`<${part}[\\s>]`).test(markup))

  const flat = fields.flat()
  const imports = [
    '"use client"',
    '',
    ...adapter.imports,
    'import { toast } from "sonner"',
    'import { z } from "zod"',
    ...new Set(flat.flatMap((field) => getFieldVariant(field.variant).imports(field))),
    'import { Button } from "@/components/ui/button"',
    `import { ${usedFieldParts.join(', ')} } from "@/components/ui/field"`,
  ]
  const declarations = [...new Set(flat.flatMap((field) => getFieldVariant(field.variant).declarations ?? []))]

  return [
    `// ${formInstallCommand(fields)}`,
    imports.join('\n'),
    ...declarations,
    formSchemaSource(fields),
    `export default function MyForm() {
${indent(adapter.setup(formDefaultValuesSource(fields)), 2)}

  return (
${indent(markup, 4)}
  )
}`,
  ].join('\n\n')
}
