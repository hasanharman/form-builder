'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  canGoNext: boolean
  canGoPrev: boolean
  onNext: () => void
  onPrev: () => void
  showProgress?: boolean
  className?: string
}

export const StepNavigation = React.forwardRef<
  HTMLDivElement,
  StepNavigationProps
>(({ currentStep, totalSteps, canGoNext, canGoPrev, onNext, onPrev, showProgress = true, className }, ref) => {
  const progress = ((currentStep + 1) / totalSteps) * 100
  
  return (
    <div ref={ref} className={cn("space-y-4", className)}>
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
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
