"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { FieldSelector } from "../field-selector";
import { FormFieldList } from "../form-field-list";
import { FormPreview } from "../form-preview";
import { EditFieldDialog } from "../edit-field-dialog";

type FormField = {
  type: string;
  label: string;
  value?: string;
  name: string;
  placeholder?: string;
  required: boolean;
  disabled: boolean;
};

export default function FormBuilder() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addFormField = (type: string) => {
    const newField: FormField = {
      type,
      label: `New ${type}`,
      value: "",
      name: "",
      placeholder: "",
      required: false,
      disabled: false,
    };
    setFormFields([...formFields, newField]);
  };

  const updateFormField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = [...formFields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFormFields(updatedFields);
  };

  const openEditDialog = (field: FormField) => {
    setSelectedField(field);
    setIsDialogOpen(true);
  };

  const handleSaveField = (updatedField: FormField) => {
    const index = formFields.findIndex(
      (field) => field.label === selectedField?.label
    );
    if (index !== -1) {
      updateFormField(index, updatedField);
    }
    setIsDialogOpen(false);
  };

  return (
    <section className="min-h-screen p-8 space-y-8">
      <h1 className="text-3xl font-semibold text-center">
        Shadcn Form Builder
      </h1>
      <div className="grid grid-cols-2 items-center justify-items-center gap-8">
        <div className="w-full h-full col-span-1 space-y-3 max-h-[80vh] overflow-auto">
          <FieldSelector addFormField={addFormField} />
          <Separator />
          <FormFieldList
            formFields={formFields}
            setFormFields={setFormFields}
            updateFormField={updateFormField}
            openEditDialog={openEditDialog}
          />
        </div>
        <FormPreview formFields={formFields} />
      </div>
      <EditFieldDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        field={selectedField}
        onSave={handleSaveField}
      />
    </section>
  );
}
