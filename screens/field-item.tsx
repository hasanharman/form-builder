import { useMotionValue, motion, Reorder } from 'framer-motion'

import { cn } from '@/lib/utils'
import { FormFieldType } from '@/types'
import { defaultFieldConfig, fieldTypes } from '@/constants'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import If from '@/components/ui/if'

import { LuGrip, LuColumns, LuPencil, LuTrash2 } from 'react-icons/lu'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

interface Props {
  index: number
  subIndex?: number
  field: FormFieldType
  formFields: FormFieldOrGroup[]
  setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>
  updateFormField: (path: number[], updates: Partial<FormFieldType>) => void
  openEditDialog: (field: FormFieldType) => void
}

export const FieldItem = ({
  index,
  subIndex,
  field,
  formFields,
  setFormFields,
  updateFormField,
  openEditDialog,
}: Props) => {
  const showColumnButton =
    subIndex === undefined ||
    subIndex === (formFields[index] as FormFieldType[]).length - 1

  const path = subIndex !== undefined ? [index, subIndex] : [index]

  const addNewColumn = (variant: string, index: number) => {
    const newFieldName = `name_${Math.random().toString().slice(-10)}`

    // Check for duplicates
    const existingFields = Array.isArray(formFields[index])
      ? (formFields[index] as FormFieldType[]).map((field) => field.name)
      : [formFields[index]?.name]

    // Check if the new field name already exists in the existing fields
    if (existingFields.includes(newFieldName)) {
      // If a field with the same name exists, do not add a new field
      return
    }

    const { label, description, placeholder } = defaultFieldConfig[variant] || {
      label: '',
      description: '',
      placeholder: '',
    }

    const newField: FormFieldType = {
      checked: true,
      description: description || '',
      disabled: false,
      label: label || newFieldName,
      name: newFieldName,
      onChange: () => {},
      onSelect: () => {},
      placeholder: placeholder || 'Placeholder',
      required: true,
      rowIndex: index,
      setValue: () => {},
      type: '',
      value: '',
      variant,
    }

    setFormFields((prevFields) => {
      const newFields = [...prevFields]
      if (Array.isArray(newFields[index])) {
        // If it's already an array, check for duplicates before adding
        const currentFieldNames = (newFields[index] as FormFieldType[]).map(
          (field) => field.name,
        )
        if (!currentFieldNames.includes(newFieldName)) {
          ;(newFields[index] as FormFieldType[]).push(newField)
        }
      } else if (newFields[index]) {
        // If it's a single field, convert it to an array with the existing field and the new one
        newFields[index] = [newFields[index] as FormFieldType, newField]
      } else {
        // If the index doesn't exist, just add the new field
        newFields[index] = newField
      }
      return newFields
    })
  }

  const removeColumn = () => {
    // Extracting the exact row and subIndex from path
    const rowIndex = path[0]
    const subIndex = path.length > 1 ? path[1] : null

    setFormFields((prevFields) => {
      const newFields = [...prevFields] // Create a shallow copy of formFields

      if (Array.isArray(newFields[rowIndex])) {
        // If it's an array (a row with multiple fields)
        const row = [...(newFields[rowIndex] as FormFieldType[])] // Shallow copy of the row

        if (subIndex !== null && subIndex >= 0 && subIndex < row.length) {
          // Only remove the specific field at subIndex
          row.splice(subIndex, 1)

          // Update the row after removal
          if (row.length > 0) {
            newFields[rowIndex] = row // Replace the row with the updated row
          } else {
            // If the row becomes empty, remove the entire row
            newFields.splice(rowIndex, 1)
          }
        }
      } else {
        // If it's a single field, simply remove it
        newFields.splice(rowIndex, 1)
      }

      return newFields // Update formFields state
    })
  }

  return (
    <Reorder.Item
      value={field}
      id={field.name}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.15 },
      }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
      whileDrag={{ backgroundColor: '#9ca3af', borderRadius: '12px' }}
      className={cn('w-full', {
        'col-span-12':
          Array.isArray(formFields[index]) && formFields[index].length === 1,
        'col-span-6':
          Array.isArray(formFields[index]) && formFields[index].length === 2,
        'col-span-4':
          Array.isArray(formFields[index]) && formFields[index].length === 3,
      })}
    >
      <motion.div layout="position" className="flex items-center gap-3">
        <div className="flex items-center gap-1 border rounded-xl px-3 py-1.5 w-full">
          <If
            condition={Array.isArray(formFields[index])}
            render={() => <LuColumns className="cursor-grab w-4 h-4" />}
          />
          <div className="flex items-center w-full">
            <div className="w-full text-sm">
              {field.variant}
              {/* <Input
                value={field.label}
                onChange={(e) =>
                  updateFormField(path, { label: e.target.value })
                }
                placeholder="Enter label"
              /> */}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openEditDialog(field)}
            >
              <LuPencil />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeColumn}
              // onClick={() => {
              //   setFormFields((prevFields) => {
              //     const newFields = [...prevFields]
              //     if (Array.isArray(newFields[index])) {
              //       // If it's an array, remove the specific subfield
              //       ;(newFields[index] as FormFieldType[]).splice(subIndex!, 1)
              //       // If the array becomes empty, remove it entirely
              //       if ((newFields[index] as FormFieldType[]).length === 0) {
              //         newFields.splice(index, 1)
              //       }
              //     } else {
              //       // If it's a single field, remove it
              //       newFields.splice(index, 1)
              //     }
              //     return newFields
              //   })
              // }}
            >
              <LuTrash2 />
            </Button>
          </div>
        </div>
        <If
          condition={showColumnButton}
          render={() => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="min-w-9 w-9 h-9 rounded-full"
                >
                  +
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Component</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {fieldTypes.map((fieldType) => (
                  <DropdownMenuItem
                    key={fieldType.name}
                    onClick={() => addNewColumn(fieldType.name, index)}
                  >
                    {fieldType.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>
    </Reorder.Item>
  )
}
