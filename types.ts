// Define the FormField type
export type FormFieldType = {
  type: string
  name: string
  label: string
  value: string | boolean | Date
  checked: boolean
  setValue: (value: string | boolean) => void
  placeholder?: string
  required: boolean
  disabled: boolean
  description?: string
  onChange: (value: string | boolean | Date) => void
  onSelect: (value: string | boolean | Date) => void
}
