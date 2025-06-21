'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'

import { FormFieldType, FormStep, FormFieldOrGroup, ProgressBarConfig } from '@/types'
import { defaultFieldConfig } from '@/constants'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import If from '@/components/ui/if'
import SpecialComponentsNotice from '@/components/playground/special-component-notice'
import { FieldSelector } from '@/screens/field-selector'
import { FormFieldList } from '@/screens/form-field-list'
import { FormPreview } from '@/screens/form-preview'
import { EditFieldDialog } from '@/screens/edit-field-dialog'
import { StepManager } from '@/screens/step-manager'
import { MultiStepSettingsDialog } from '@/screens/multistep-settings-dialog'
import EmptyListSvg from '@/assets/oc-thinking.svg'
import Editor from '@/components/editor/editor'

export default function FormBuilder() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([])
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMultiStep, setIsMultiStep] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [progressConfig, setProgressConfig] = useState<ProgressBarConfig>({
    style: 'linear',
    position: 'bottom',
    variant: 'rounded',
    showPercentage: true
  })
  const [allowStepSkipping, setAllowStepSkipping] = useState(false)
  const [showProgress, setShowProgress] = useState(true)
  const [saveProgress, setSaveProgress] = useState(true)
  const [steps, setSteps] = useState<FormStep[]>([
    {
      id: 'step-1',
      title: 'Step 1',
      description: '',
      fields: [],
      validation: 'onNext'
    }
  ])
  const [currentEditingStep, setCurrentEditingStep] = useState(0)

  const addFormField = (variant: string, index: number = 0) => {
    const newFieldName = `name_${Math.random().toString().slice(-10)}`

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
    if (isMultiStep) {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps]
        newSteps[currentEditingStep] = {
          ...newSteps[currentEditingStep],
          fields: [...newSteps[currentEditingStep].fields, newField]
        }
        return newSteps
      })
    } else {
      setFormFields([...formFields, newField])
    }
  }

  const findFieldPath = (
    fields: FormFieldOrGroup[],
    name: string,
  ): number[] | null => {
    const search = (
      currentFields: FormFieldOrGroup[],
      currentPath: number[],
    ): number[] | null => {
      for (let i = 0; i < currentFields.length; i++) {
        const field = currentFields[i]
        if (Array.isArray(field)) {
          const result = search(field, [...currentPath, i])
          if (result) return result
        } else if (field.name === name) {
          return [...currentPath, i]
        }
      }
      return null
    }
    return search(fields, [])
  }

  const updateFormField = (path: number[], updates: Partial<FormFieldType>) => {
    if (isMultiStep) {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps]
        const stepFields = JSON.parse(JSON.stringify(newSteps[currentEditingStep].fields))
        let current: any = stepFields
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]]
        }
        current[path[path.length - 1]] = {
          ...current[path[path.length - 1]],
          ...updates,
        }
        newSteps[currentEditingStep] = {
          ...newSteps[currentEditingStep],
          fields: stepFields
        }
        return newSteps
      })
    } else {
      const updatedFields = JSON.parse(JSON.stringify(formFields))
      let current: any = updatedFields
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = {
        ...current[path[path.length - 1]],
        ...updates,
      }
      setFormFields(updatedFields)
    }
  }

  const openEditDialog = (field: FormFieldType) => {
    setSelectedField(field)
    setIsDialogOpen(true)
  }

  const handleSaveField = (updatedField: FormFieldType) => {
    if (selectedField) {
      const currentFields = isMultiStep ? steps[currentEditingStep].fields : formFields
      const path = findFieldPath(currentFields, selectedField.name)
      if (path) {
        updateFormField(path, updatedField)
      }
    }
    setIsDialogOpen(false)
  }

  const handleStepAdd = () => {
    const newStep: FormStep = {
      id: `step-${steps.length + 1}`,
      title: `Step ${steps.length + 1}`,
      description: '',
      fields: [],
      validation: 'onNext'
    }
    setSteps(prevSteps => [...prevSteps, newStep])
  }

  const handleStepDelete = (index: number) => {
    if (steps.length > 1) {
      setSteps(prevSteps => prevSteps.filter((_, i) => i !== index))
      if (currentEditingStep >= steps.length - 1) {
        setCurrentEditingStep(Math.max(0, steps.length - 2))
      }
    }
  }

  const handleStepUpdate = (index: number, updates: Partial<FormStep>) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps]
      newSteps[index] = { ...newSteps[index], ...updates }
      return newSteps
    })
  }

  const handleStepSelect = (index: number) => {
    setCurrentEditingStep(index)
  }

  const handleMultiStepToggle = (enabled: boolean) => {
    setIsMultiStep(enabled)
    if (enabled && formFields.length > 0) {
      setSteps([{
        id: 'step-1',
        title: 'Step 1',
        description: '',
        fields: formFields,
        validation: 'onNext'
      }])
      setFormFields([])
    } else if (!enabled && steps.length > 0) {
      const allFields = steps.flatMap(step => step.fields)
      setFormFields(allFields)
      setSteps([{
        id: 'step-1',
        title: 'Step 1',
        description: '',
        fields: [],
        validation: 'onNext'
      }])
    }
  }

  const handleSettingsSave = (settings: {
    isMultiStep: boolean
    progressConfig: ProgressBarConfig
    allowStepSkipping: boolean
    showProgress: boolean
    saveProgress: boolean
  }) => {
    const wasMultiStep = isMultiStep
    setIsMultiStep(settings.isMultiStep)
    setProgressConfig(settings.progressConfig)
    setAllowStepSkipping(settings.allowStepSkipping)
    setShowProgress(settings.showProgress)
    setSaveProgress(settings.saveProgress)
    
    if (settings.isMultiStep !== wasMultiStep) {
      handleMultiStepToggle(settings.isMultiStep)
    }
  }

  const FieldSelectorWithSeparator = ({
    addFormField,
  }: {
    addFormField: (variant: string, index?: number) => void
  }) => (
    <div className="flex flex-col md:flex-row gap-3">
      <FieldSelector addFormField={addFormField} />
      <Separator orientation={isDesktop ? 'vertical' : 'horizontal'} />
    </div>
  )

  return (
    <section className="md:max-h-screen space-y-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Playground</h1>
        <p className="text-sm text-muted-foreground">
          After successfully installing Shadcn, you can simply copy and paste
          the generated form components to get started. Some components may have
          additional dependencies, so make sure to review their documentation in
          the{' '}
          <Link href="/readme" className="underline text-slate-800  dark:text-white dark:font-semibold">
            README
          </Link>{' '}
          for further instructions.
        </p>
        {/* <Editor /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 h-full">
        <div className="col-span-1 lg:col-span-2 space-y-3">
          <SpecialComponentsNotice formFields={isMultiStep ? steps[currentEditingStep]?.fields || [] : formFields} />
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {isMultiStep ? 'Multi-step Form' : 'Single Form'}
              </span>
              <span className="text-xs text-muted-foreground">
                {isMultiStep ? `${steps.length} steps configured` : 'Standard form layout'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>

          {isMultiStep && (
            <StepManager
              steps={steps}
              currentStep={currentEditingStep}
              onStepSelect={handleStepSelect}
              onStepAdd={handleStepAdd}
              onStepDelete={handleStepDelete}
              onStepUpdate={handleStepUpdate}
            />
          )}
          
          <FieldSelector addFormField={addFormField} />
        </div>

        <div className="col-span-1 lg:col-span-3 space-y-3">
          <If
            condition={isMultiStep ? steps[currentEditingStep]?.fields.length > 0 : formFields.length > 0}
            render={() => (
              <div className="space-y-3">
                {isMultiStep && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm">
                      Editing: {steps[currentEditingStep]?.title}
                    </h4>
                    {steps[currentEditingStep]?.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {steps[currentEditingStep].description}
                      </p>
                    )}
                  </div>
                )}
                <FormFieldList
                  formFields={isMultiStep ? steps[currentEditingStep]?.fields || [] : formFields}
                  setFormFields={isMultiStep ? 
                    (newFields) => {
                      setSteps(prevSteps => {
                        const newSteps = [...prevSteps]
                        newSteps[currentEditingStep] = {
                          ...newSteps[currentEditingStep],
                          fields: typeof newFields === 'function' ? newFields(newSteps[currentEditingStep].fields) : newFields
                        }
                        return newSteps
                      })
                    } : 
                    setFormFields
                  }
                  updateFormField={updateFormField}
                  openEditDialog={openEditDialog}
                />
              </div>
            )}
            otherwise={() => (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <Image
                  src={EmptyListSvg}
                  alt="No fields"
                  width={200}
                  height={200}
                  className="mb-4 opacity-50"
                />
                <p className="text-muted-foreground">
                  {isMultiStep 
                    ? `No fields in ${steps[currentEditingStep]?.title || 'this step'} yet. Select a field type to get started.`
                    : 'No form fields added yet. Select a field type to get started.'
                  }
                </p>
              </div>
            )}
          />
        </div>

        <div className="col-span-1 lg:col-span-4">
          <FormPreview 
            formFields={isMultiStep ? steps[currentEditingStep]?.fields || [] : formFields} 
            isMultiStep={isMultiStep}
            steps={isMultiStep ? steps : undefined}
            progressConfig={progressConfig}
            allowStepSkipping={allowStepSkipping}
            showProgress={showProgress}
            saveProgress={saveProgress}
          />
        </div>
      </div>

      <EditFieldDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        field={selectedField}
        onSave={handleSaveField}
      />

      <MultiStepSettingsDialog
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
        isMultiStep={isMultiStep}
        progressConfig={progressConfig}
        allowStepSkipping={allowStepSkipping}
        showProgress={showProgress}
        saveProgress={saveProgress}
        onSave={handleSettingsSave}
      />
    </section>
  )
}
