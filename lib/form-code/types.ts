import type { Binding } from '@/components/field-variants'

/**
 * What differs between form libraries. The generator owns everything else:
 * imports, schema, layout, and each variant's control.
 */
export type FormLibraryAdapter = {
  imports: string[]
  /** Statements at the top of the component: the form hook and submit handler. */
  setup: (defaultValues: string) => string
  /** The `<form>` element around the rendered fields. */
  form: (fields: string) => string
  /** One field, given its name and the shell rendered through `binding`. */
  field: (name: string, shell: (binding: Binding & { error: string }) => string) => string
}
