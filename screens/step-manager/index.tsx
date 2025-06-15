import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, Settings, Trash2, GripVertical } from 'lucide-react'
import { FormStep } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface StepManagerProps {
  steps: FormStep[]
  currentStep: number
  onStepSelect: (index: number) => void
  onStepAdd: () => void
  onStepDelete: (index: number) => void
  onStepUpdate: (index: number, updates: Partial<FormStep>) => void
}

export const StepManager: React.FC<StepManagerProps> = ({
  steps,
  currentStep,
  onStepSelect,
  onStepAdd,
  onStepDelete,
  onStepUpdate
}) => {
  const [editingStep, setEditingStep] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<FormStep>>({})

  const handleEditStep = (index: number) => {
    setEditingStep(index)
    setEditForm(steps[index])
  }

  const handleSaveStep = () => {
    if (editingStep !== null) {
      onStepUpdate(editingStep, editForm)
      setEditingStep(null)
      setEditForm({})
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Form Steps</h3>
        <Button size="sm" variant="outline" onClick={onStepAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Add Step
        </Button>
      </div>
      
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
              currentStep === index 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:bg-muted/50'
            }`}
            onClick={() => onStepSelect(index)}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">{step.title}</span>
                <Badge variant="secondary" className="text-xs">
                  {step.fields.length} fields
                </Badge>
              </div>
              {step.description && (
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {step.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditStep(index)
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Step</DialogTitle>
                    <DialogDescription>
                      Configure the step title, description, and validation settings.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="step-title">Title</Label>
                      <Input
                        id="step-title"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Step title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="step-description">Description</Label>
                      <Textarea
                        id="step-description"
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Optional step description"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="step-validation">Validation</Label>
                      <Select
                        value={editForm.validation || 'onNext'}
                        onValueChange={(value: 'onSubmit' | 'onNext' | 'disabled') => 
                          setEditForm({ ...editForm, validation: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="onNext">Validate on Next</SelectItem>
                          <SelectItem value="onSubmit">Validate on Submit</SelectItem>
                          <SelectItem value="disabled">No Validation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingStep(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveStep}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {steps.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStepDelete(index)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
