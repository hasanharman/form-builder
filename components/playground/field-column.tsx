import React, { useState, useEffect } from 'react'
import { motion, Reorder } from 'framer-motion'
import { FormFieldType } from '@/types'
import { fieldTypes } from '@/constants'
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
import { LuGrip, LuPencil, LuTrash2 } from 'react-icons/lu'

interface Props {
  index: number
  field: FormFieldType
  formFields: FormFieldType[]
  setFormFields: React.Dispatch<React.SetStateAction<FormFieldType[]>>
  updateFormField: (index: number, updates: Partial<FormFieldType>) => void
  openEditDialog: (field: FormFieldType) => void
}

export default function FieldColumn({
  index,
  field,
  formFields,
  setFormFields,
  updateFormField,
  openEditDialog,
}: Props) {
  //   useEffect(() => {
  //     const rowComponents = formFields.filter(
  //       (f) => f.rowIndex === field.rowIndex,
  //     )
  //     setComponents(rowComponents)
  //   }, [formFields, field.rowIndex])

  //   const colSpan = Math.floor(12 / components.length)

  const addComponent = (newFieldType: string) => {
    const newFieldObject: FormFieldType = {
      type: newFieldType,
      label: `New ${newFieldType}`,
      value: '',
      checked: true,
      name: `name_${Math.random().toString().slice(-10)}`,
      placeholder: 'Enter Placeholder',
      description: '',
      required: true,
      disabled: false,
      rowIndex: field.rowIndex,
      onChange: () => {},
      setValue: () => {},
      onSelect: () => {},
    }

    const updatedFields = [...formFields]
    const insertIndex =
      updatedFields.findIndex((f) => f.name === field.name) + 1
    updatedFields.splice(insertIndex, 0, newFieldObject)
    setFormFields(updatedFields)
  }

  const removeComponent = (componentIndex: number) => {
    const updatedFields = formFields.filter(
      (_, i) => i !== index + componentIndex,
    )
    setFormFields(updatedFields)
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
      whileDrag={{ backgroundColor: '#e3e3e3' }}
      className="grid grid-cols-12 gap-2 items-center"
    >
      {formFields.map((component, componentIndex) => (
        <div
          key={component.name}
          className={`col-span-${12} flex items-center gap-3`}
        >
          <div className="flex items-center gap-1 border rounded-xl px-3 py-1.5 w-full">
            <LuGrip className="cursor-grab mr-2" />
            <div className="flex items-center w-full">
              <div className="w-full">
                <Input
                  value={component.name}
                  onChange={(e) =>
                    updateFormField(index + componentIndex, {
                      label: e.target.value,
                    })
                  }
                  placeholder="Enter label"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEditDialog(component)}
              >
                <LuPencil />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeComponent(componentIndex)}
              >
                <LuTrash2 />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              +
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Component</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {fieldTypes.map((fieldType) => (
              <DropdownMenuItem
                key={fieldType.name}
                onClick={() => addComponent(fieldType.name)}
              >
                {fieldType.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Reorder.Item>
  )
}
