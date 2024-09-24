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
import { FormFieldType } from "@/types";

type EditFieldDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  field: FormFieldType | null;
  onSave: (updatedField: FormFieldType) => void;
};

export const EditFieldDialog: React.FC<EditFieldDialogProps> = ({
  isOpen,
  onClose,
  field,
  onSave,
}) => {
  const [editedField, setEditedField] = useState<FormFieldType | null>(null);

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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit {editedField.type} Field</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={editedField.label}
              onChange={(e) =>
                setEditedField({ ...editedField, label: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="label">Description</Label>
            <Input
              id="description"
              value={editedField.description}
              onChange={(e) =>
                setEditedField({ ...editedField, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={editedField.placeholder}
              onChange={(e) =>
                setEditedField({ ...editedField, placeholder: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="label">Name</Label>
            <Input
              id="name"
              value={editedField.name}
              onChange={(e) =>
                setEditedField({ ...editedField, name: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Required</Label>
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
          <div className="flex flex-col gap-1">
            <Label>Disabled</Label>
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
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
