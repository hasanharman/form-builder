import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type FormField = {
  type: string;
  label: string;
  value?: string;
  name: string;
  placeholder?: string;
  required: boolean;
  disabled: boolean;
};

type EditFieldDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  field: FormField | null;
  onSave: (updatedField: FormField) => void;
};

export const EditFieldDialog: React.FC<EditFieldDialogProps> = ({
  isOpen,
  onClose,
  field,
  onSave,
}) => {
  const [editedField, setEditedField] = useState<FormField | null>(null);

  useEffect(() => {
    setEditedField(field);
  }, [field]);

  const handleSave = () => {
    if (editedField) {
      onSave(editedField);
      onClose();
    }
  };

  if (!editedField) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {editedField.type} Field</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              value={editedField.label}
              onChange={(e) =>
                setEditedField({ ...editedField, label: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="placeholder" className="text-right">
              Placeholder
            </Label>
            <Input
              id="placeholder"
              value={editedField.placeholder}
              onChange={(e) =>
                setEditedField({ ...editedField, placeholder: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Required</Label>
            <div className="col-span-3">
              <Checkbox
                checked={editedField.required}
                onCheckedChange={(checked) =>
                  setEditedField({
                    ...editedField,
                    required: checked as boolean,
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Disabled</Label>
            <div className="col-span-3">
              <Checkbox
                checked={editedField.disabled}
                onCheckedChange={(checked) =>
                  setEditedField({
                    ...editedField,
                    disabled: checked as boolean,
                  })
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
