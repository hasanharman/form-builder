// Define the FormField type
export type FormFieldType = {
  type: string
  name: string
  label: string
  value: string | boolean | Date | number | string[]
  checked: boolean
  setValue: (value: string | boolean) => void
  placeholder?: string
  required: boolean
  disabled: boolean
  description?: string
  onChange: (value: string | string[] | boolean | Date) => void
  onSelect: (value: string | string[] | boolean | Date) => void
  rowIndex: number
}

export type FieldType = { name: string; isNew: boolean; index?: number }
