'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProgressIndicator } from '@/components/ui/progress-indicator'
import { ProgressBarConfig } from '@/types'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  canGoNext: boolean
  canGoPrev: boolean
  onNext: () => void
  onPrev: () => void
  onStepClick?: (stepIndex: number) => void
  showProgress?: boolean
  progressConfig?: ProgressBarConfig
  className?: string
}

export const StepNavigation = React.forwardRef<
  HTMLDivElement,
  StepNavigationProps
>(({ 
  currentStep, 
  totalSteps, 
  canGoNext, 
  canGoPrev, 
  onNext, 
  onPrev, 
  onStepClick,
  showProgress = true, 
  progressConfig,
  className 
}, ref) => {
  const config = progressConfig || { position: 'bottom' }

  return (
    <div ref={ref} className={cn("space-y-4", className)}>
      {config.position === 'bottom' && (
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepClick={onStepClick}
          showProgress={showProgress}
          progressConfig={progressConfig}
        />
      )}
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-2"
        >
          {currentStep === totalSteps - 1 ? 'Complete' : 'Next'}
          {currentStep !== totalSteps - 1 && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
})

StepNavigation.displayName = "StepNavigation"
