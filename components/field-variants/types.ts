import type { ComponentType } from 'react'

import type { FormFieldType } from '@/types'
import type { SchemaExpr } from './schema-expr'

/** Builder settings a variant exposes in the edit dialog beyond label, name, etc. */
export type FieldSetting = 'inputType' | 'range' | 'step' | 'locale'

/** What the live preview hands a variant's control. */
export type ControlProps = {
  field: FormFieldType
  id: string
  value: any
  onChange: (value: any) => void
  onBlur: () => void
  invalid: boolean
}

/**
 * Source-code expressions a form library adapter provides, so one control
 * template serves every library. `onChange` wraps a value expression in the
 * library's change call.
 */
export type Binding = {
  id: string
  name: string
  value: string
  onChange: (value: string) => string
  onBlur: string
  invalid: string
}

/**
 * Everything the builder, preview and code generator know about one kind of
 * form field. Adding a field type means adding one of these.
 */
export type FieldVariant = {
  /** Shown in the picker and stored as `FormFieldType.variant`. */
  name: string
  isNew?: boolean
  /** Label, description and placeholder of a newly added field. */
  defaults: { label: string; description: string; placeholder?: string }
  settings?: FieldSetting[]
  /**
   * Items the generated code needs installed: official shadcn names
   * (`input`) or items from this site's registry (`phone-input`).
   */
  registryItems: string[]
  /** Import lines the generated control needs. */
  imports: (field: FormFieldType) => string[]
  /** Module-scope declarations (option lists) the generated control uses. */
  declarations?: string[]
  /** Validation, including whether an empty value is allowed when not required. */
  schema: (field: FormFieldType) => SchemaExpr
  /** Initial value, shared by the preview and the generated `defaultValues`. */
  defaultValue: (field: FormFieldType) => unknown
  /**
   * `stacked` (default): label, control, description. `control-first` and
   * `control-last` put the control beside its label, like a checkbox or switch.
   */
  layout?: 'stacked' | 'control-first' | 'control-last'
  /** The control rendered in the live preview. */
  Control: ComponentType<ControlProps>
  /** The control as generated source, bound through `b`. */
  control: (field: FormFieldType, b: Binding) => string
}
