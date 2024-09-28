import * as React from "react";
import { useMotionValue, Reorder } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRaisedShadow } from "@/components/use-raised-shadow";
import { FormFieldType } from "@/types";

import { LuGrip, LuPencil, LuTrash2 } from "react-icons/lu";

interface Props {
  index: number;
  field: FormFieldType;
  formFields: FormFieldType[];
  setFormFields: React.Dispatch<React.SetStateAction<FormFieldType[]>>;
  updateFormField: (index: number, updates: Partial<FormFieldType>) => void;
  openEditDialog: (field: FormFieldType) => void;
}

export const FieldItem = ({
  index,
  field,
  formFields,
  setFormFields,
  updateFormField,
  openEditDialog,
}: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item
      value={field}
      id={field.name}
      style={{ boxShadow, y }}
      className="flex items-center"
    >
      <div className="flex justify-start items-center gap-1 border rounded-xl px-3 py-1.5 mt-1.5 w-full">
        <LuGrip
          className="cursor-grab mr-2"
          //   onPointerDown={(e) => controls.start(e)}
        />
        <div className="grid grid-cols-6 gap-2 items-center w-full">
          <div className="col-span-2">
            <Input
              value={field.label}
              onChange={(e) =>
                updateFormField(index, { label: e.target.value })
              }
              placeholder="Enter label"
            />
          </div>
          <div className="col-span-2">
            <Input
              value={field.description}
              onChange={(e) =>
                updateFormField(index, {
                  description: e.target.value,
                })
              }
              placeholder="Enter description"
            />
          </div>
          <div className="col-span-1 pl-6">
            <Checkbox
              checked={field.required}
              onCheckedChange={(checked) =>
                updateFormField(index, { required: !!checked })
              }
            />
          </div>
          <div className="col-span-1 pl-6">
            <Checkbox
              checked={field.disabled}
              onCheckedChange={(checked) =>
                updateFormField(index, { disabled: !!checked })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex flex-nowrap space-x-2">
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
          onClick={() => {
            const updatedFields = formFields.filter((_, i) => i !== index);
            setFormFields(updatedFields);
          }}
        >
          <LuTrash2 />
        </Button>
      </div>
    </Reorder.Item>
  );
};
