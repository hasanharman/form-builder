import { Reorder } from 'framer-motion'

import If from '@/components/ui/if'

import { FormFieldType } from '@/types'
import { FieldItem } from '@/components/field-item'

type FormFieldListProps = {
  formFields: FormFieldType[]
  setFormFields: React.Dispatch<React.SetStateAction<FormFieldType[]>>
  updateFormField: (index: number, updates: Partial<FormFieldType>) => void
  openEditDialog: (field: FormFieldType) => void
}

export const FormFieldList: React.FC<FormFieldListProps> = ({
  formFields,
  setFormFields,
  updateFormField,
  openEditDialog,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <If
        condition={formFields.length > 0}
        render={() => (
          <div className="flex w-full font-medium text-sm">
            <div className="w-12" />
            <div className="grid grid-cols-6 w-full">
              <div className="col-span-2">Label</div>
              <div className="col-span-2">Description</div>
              <div className="col-span-1">Required</div>
              <div className="col-span-1">Disabled</div>
            </div>
            <div className="w-28" />
          </div>
        )}
      />
      <Reorder.Group
        axis="y"
        onReorder={(newOrder) => setFormFields(newOrder)} // Update to use newOrder directly
        values={formFields}
        dragListener={true} // Ensure drag listener is enabled
        className="flex flex-col gap-1" // Add a class for better layout
      >
        {formFields.map((item, index) => (
          <FieldItem
            key={item.name}
            index={index}
            field={item}
            formFields={formFields}
            setFormFields={setFormFields}
            updateFormField={updateFormField}
            openEditDialog={openEditDialog}
          />
        ))}
      </Reorder.Group>
    </div>
  )
}
