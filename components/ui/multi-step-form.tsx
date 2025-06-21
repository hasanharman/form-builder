'use client'

import * as React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { StepNavigation } from '@/components/ui/step-navigation'
import { ProgressIndicator } from '@/components/ui/progress-indicator'
import { generateZodSchema, generateDefaultValues } from '@/screens/generate-code-parts'
import { renderFormField } from '@/screens/render-form-field'
import { FormStep, MultiStepFormConfig, FormFieldOrGroup } from '@/types'
import { toast } from 'sonner'

interface MultiStepFormProps {
  config: MultiStepFormConfig
  className?: string
}

const renderFormFields = (fields: FormFieldOrGroup[], form: any) => {
  return fields.map((fieldOrGroup, index) => {
    if (Array.isArray(fieldOrGroup)) {
      const getColSpan = (totalFields: number) => {
        switch (totalFields) {
          case 2:
            return 6
          case 3:
            return 4
          default:
            return 12
        }
      }

      return (
        <div key={index} className="grid grid-cols-12 gap-4">
          {fieldOrGroup.map((field, subIndex) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem
                  className={`col-span-${getColSpan(fieldOrGroup.length)}`}
                >
                  <FormControl>
                    {React.cloneElement(
                      renderFormField(field, form) as React.ReactElement,
                      {
                        ...formField,
                      },
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
      )
    } else {
      return (
        <FormField
          key={index}
          control={form.control}
          name={fieldOrGroup.name}
          render={({ field: formField }) => (
            <FormItem className="col-span-12">
              <FormControl>
                {React.cloneElement(
                  renderFormField(fieldOrGroup, form) as React.ReactElement,
                  {
                    ...formField,
                  },
                )}
              </FormControl>
            </FormItem>
          )}
        />
      )
    }
  })
}

export const MultiStepForm = React.forwardRef<
  HTMLDivElement,
  MultiStepFormProps
>(({ config, className }, ref) => {
  const [currentStep, setCurrentStep] = useState(config.currentStep || 0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [formData, setFormData] = useState<Record<string, any>>({})

  const allFields = config.steps.flatMap(step => step.fields)
  const currentStepFields = config.steps[currentStep]?.fields || []
  
  const allFieldsSchema = generateZodSchema(allFields)
  const currentStepSchema = generateZodSchema(currentStepFields)
  
  const form = useForm<z.infer<typeof allFieldsSchema>>({
    resolver: zodResolver(config.steps[currentStep]?.validation === 'disabled' ? z.object({}) : currentStepSchema),
    defaultValues: { ...generateDefaultValues(allFields), ...formData },
    mode: 'onChange'
  })

  const saveProgress = useCallback(() => {
    if (config.saveProgress) {
      const data = form.getValues()
      setFormData(data)
      localStorage.setItem('multistep-form-progress', JSON.stringify({
        currentStep,
        data,
        timestamp: Date.now()
      }))
    }
  }, [form, currentStep, config.saveProgress])

  const loadProgress = useCallback(() => {
    if (config.saveProgress) {
      try {
        const saved = localStorage.getItem('multistep-form-progress')
        if (saved) {
          const { currentStep: savedStep, data, timestamp } = JSON.parse(saved)
          const oneDay = 24 * 60 * 60 * 1000
          if (Date.now() - timestamp < oneDay) {
            setCurrentStep(savedStep)
            setFormData(data)
            form.reset(data)
          }
        }
      } catch (error) {
        console.error('Failed to load progress:', error)
      }
    }
  }, [config.saveProgress, form])

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  const validateCurrentStep = async () => {
    const currentStepValidation = config.steps[currentStep]?.validation
    if (currentStepValidation === 'disabled') return true
    
    try {
      const currentValues = form.getValues()
      
      const stepFieldNames: string[] = []
      currentStepFields.forEach(fieldOrGroup => {
        if (Array.isArray(fieldOrGroup)) {
          fieldOrGroup.forEach(field => stepFieldNames.push(field.name))
        } else {
          stepFieldNames.push(fieldOrGroup.name)
        }
      })
      
      const stepValues = Object.fromEntries(
        Object.entries(currentValues).filter(([key]) => stepFieldNames.includes(key))
      )
      
      await currentStepSchema.parseAsync(stepValues)
      return true
    } catch (error) {
      return false
    }
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    
    if (!isValid && config.steps[currentStep]?.validation !== 'disabled') {
      toast.error('Please fill in all required fields before continuing.')
      return
    }

    saveProgress()
    
    if (currentStep < config.steps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      config.onStepChange?.(nextStep, 'next')
    } else {
      const allData = form.getValues()
      config.onComplete?.(allData)
      toast.success('Form completed successfully!')
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      config.onStepChange?.(prevStep, 'prev')
    }
  }

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep && stepIndex >= 0) {
      setCurrentStep(stepIndex)
      config.onStepChange?.(stepIndex, stepIndex < currentStep ? 'prev' : 'next')
    }
  }

  const canGoNext = currentStep < config.steps.length
  const canGoPrev = currentStep > 0

  const currentStepConfig = config.steps[currentStep]

  if (!currentStepConfig) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No steps configured</p>
      </div>
    )
  }

  return (
    <div ref={ref} className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{currentStepConfig.title}</h2>
        {currentStepConfig.description && (
          <p className="text-muted-foreground">{currentStepConfig.description}</p>
        )}
      </div>

      {config.progressConfig?.position === 'top' && (
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={config.steps.length}
          onStepClick={handleStepClick}
          showProgress={config.showProgress}
          progressConfig={config.progressConfig}
        />
      )}

      <Form {...form}>
        <form className="space-y-6">
          <div className="space-y-4">
            {renderFormFields(currentStepFields, form)}
          </div>
        </form>
      </Form>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={config.steps.length}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        onNext={handleNext}
        onPrev={handlePrev}
        onStepClick={handleStepClick}
        showProgress={config.showProgress}
        progressConfig={config.progressConfig}
      />
    </div>
  )
})

MultiStepForm.displayName = "MultiStepForm"
