import { Reorder } from 'framer-motion'

import { FormFieldType } from '@/types'
import { useMediaQuery } from '@/hooks/use-media-query'

import { FieldItem } from '@/components/field-item'
import If from '@/components/ui/if'

import { LucideShieldAlert, LucideShieldBan } from 'lucide-react'
import { GridItem } from '@/components/grid-item'

type FormFieldListProps = {
  formFields: FormFieldType[]
  setFormFields: React.Dispatch<React.SetStateAction<FormFieldType[]>>
  updateFormField: (index: number, updates: Partial<FormFieldType>) => void
  openEditDialog: (field: FormFieldType) => void
}

export const GridFieldList: React.FC<FormFieldListProps> = ({
  formFields,
  setFormFields,
  updateFormField,
  openEditDialog,
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <div className="flex flex-col gap-1 w-full">
      <Reorder.Group
        axis="y"
        onReorder={(newOrder) => setFormFields(newOrder)} // Update to use newOrder directly
        values={formFields}
        dragListener={true} // Ensure drag listener is enabled
        className="flex flex-col gap-1" // Add a class for better layout
      >
        {formFields.map((item, index) => (
          <GridItem
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
