import React from 'react'
import { Button } from '@/components/ui/button'

type FieldSelectorProps = {
  addFormField: (type: string) => void
}

const fieldTypes = [
  'Checkbox',
  'Combobox',
  'DatePicker',
  'FileInput',
  'Input',
  'InputOTP',
  'Select',
  // "Slider",
  'Switch',
  'Textarea',
  'Password',
  'Phone',
  // "Tags",
  // "Multi Select",
]

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  addFormField,
}) => {
  return (
    <div className="flex items-center flex-wrap gap-3">
      {fieldTypes.map((type) => (
        <Button
          key={type}
          variant="outline"
          onClick={() => addFormField(type)}
          className="rounded-full"
        >
          {type}
        </Button>
      ))}
      <Button className="rounded-full" disabled>
        Request Component
      </Button>
    </div>
  )
}
