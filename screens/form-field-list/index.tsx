import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LuGrip, LuPencil, LuTrash2 } from "react-icons/lu";
import { FormFieldType } from "@/types";
import If from "@/components/ui/if";

type FormFieldListProps = {
  formFields: FormFieldType[];
  setFormFields: React.Dispatch<React.SetStateAction<FormFieldType[]>>;
  updateFormField: (index: number, updates: Partial<FormFieldType>) => void;
  openEditDialog: (field: FormFieldType) => void;
};

export const FormFieldList: React.FC<FormFieldListProps> = ({
  formFields,
  setFormFields,
  updateFormField,
  openEditDialog,
}) => {
  const controls = useDragControls();

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
      <Reorder.Group values={formFields} onReorder={setFormFields}>
        {formFields.map((field, index) => (
          <Reorder.Item
            value={field}
            key={index}
            dragListener={true}
            dragControls={controls}
            className="flex justify-between items-center flex-nowrap gap-1"
          >
            <div className="flex justify-start items-center gap-1 border rounded-xl px-3 py-1.5 mt-1.5 w-full">
              <LuGrip
                className="cursor-grab mr-2"
                onPointerDown={(e) => controls.start(e)}
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
                  const updatedFields = formFields.filter(
                    (_, i) => i !== index
                  );
                  setFormFields(updatedFields);
                }}
              >
                <LuTrash2 />
              </Button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};
