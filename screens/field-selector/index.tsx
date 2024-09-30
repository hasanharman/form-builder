import React from 'react'
import { Button } from '@/components/ui/button'
import If from '@/components/ui/if'

type FieldSelectorProps = {
  addFormField: (type: string) => void
}
type fieldTypes = { name: string; isNew: boolean }

const fieldTypes: fieldTypes[] = [
  { name: 'Checkbox', isNew: false },
  { name: 'Combobox', isNew: false },
  { name: 'DatePicker', isNew: false },
  { name: 'FileInput', isNew: false },
  { name: 'Input', isNew: false },
  { name: 'InputOTP', isNew: false },
  { name: 'Select', isNew: false },
  { name: 'Slider', isNew: true },
  { name: 'Switch', isNew: false },
  { name: 'Textarea', isNew: false },
  { name: 'Password', isNew: false },
  { name: 'Phone', isNew: false },
  // { name: "Tags", isNew: false },
  // { name: "Multi Select", isNew: false },
]

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  addFormField,
}) => {
  return (
    <div className="flex md:flex-col items-start flex-wrap gap-3">
      {fieldTypes.map((type) => (
        <div className="flex items-center gap-1">
          <Button
            key={type.name}
            variant="outline"
            onClick={() => addFormField(type.name)}
            className="rounded-full"
            size="sm"
          >
            {type.name}
            <If
              condition={type.isNew}
              render={() => (
                <div className="md:hidden ml-1 text-[10px] p-1 bg-yellow-200 rounded">
                  New
                </div>
              )}
            />
          </Button>
          <If
            condition={type.isNew}
            render={() => (
              <div className="hidden md:block ml-1 text-[10px] p-1 bg-yellow-200 rounded">
                New
              </div>
            )}
          />
        </div>
      ))}
      <Button className="rounded-full" disabled size="sm">
        Request
      </Button>
    </div>
  )
}
