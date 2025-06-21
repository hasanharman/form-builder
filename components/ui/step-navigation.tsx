'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Circle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProgressBarConfig } from '@/types'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  canGoNext: boolean
  canGoPrev: boolean
  onNext: () => void
  onPrev: () => void
  showProgress?: boolean
  progressConfig?: ProgressBarConfig
  className?: string
}

const CircularProgress: React.FC<{ progress: number; size?: number }> = ({ 
  progress, 
  size = 60 
}) => {
  const radius = (size - 8) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-300 ease-in-out"
        />
      </svg>
      <span className="absolute text-sm font-medium">
        {Math.round(progress)}%
      </span>
    </div>
  )
}

const NumberedSteps: React.FC<{ 
  currentStep: number
  totalSteps: number
  variant: 'rounded' | 'square'
}> = ({ currentStep, totalSteps, variant }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {Array.from({ length: totalSteps }, (_, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        
        return (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center w-8 h-8 text-sm font-medium transition-all",
              variant === 'rounded' ? 'rounded-full' : 'rounded-md',
              isActive && "bg-primary text-primary-foreground",
              isCompleted && "bg-primary/20 text-primary",
              !isActive && !isCompleted && "bg-muted text-muted-foreground"
            )}
          >
            {isCompleted ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
        )
      })}
    </div>
  )
}

const SimpleIndicator: React.FC<{ 
  currentStep: number
  totalSteps: number
  variant: 'rounded' | 'square'
}> = ({ currentStep, totalSteps, variant }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {Array.from({ length: totalSteps }, (_, index) => {
        const isActive = index <= currentStep
        
        return (
          <div
            key={index}
            className={cn(
              "w-2 h-2 transition-all",
              variant === 'rounded' ? 'rounded-full' : 'rounded-sm',
              isActive ? "bg-primary" : "bg-muted"
            )}
          />
        )
      })}
    </div>
  )
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
  showProgress = true, 
  progressConfig,
  className 
}, ref) => {
  const progress = ((currentStep + 1) / totalSteps) * 100
  
  const defaultConfig: ProgressBarConfig = {
    style: 'linear',
    position: 'bottom',
    variant: 'rounded',
    showPercentage: true
  }
  
  const config = progressConfig || defaultConfig

  const renderProgressIndicator = () => {
    if (!showProgress) return null

    const progressElement = (() => {
      switch (config.style) {
        case 'circular':
          return <CircularProgress progress={progress} />
        case 'numbered':
          return <NumberedSteps currentStep={currentStep} totalSteps={totalSteps} variant={config.variant} />
        case 'simple':
          return <SimpleIndicator currentStep={currentStep} totalSteps={totalSteps} variant={config.variant} />
        case 'linear':
        default:
          return (
            <div className="space-y-2">
              {config.showPercentage && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Step {currentStep + 1} of {totalSteps}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
              )}
              <Progress 
                value={progress} 
                className={cn(
                  "h-2",
                  config.variant === 'square' && "rounded-none"
                )} 
              />
            </div>
          )
      }
    })()

    return (
      <div className={cn(
        config.position === 'top' ? 'order-first' : 'order-last'
      )}>
        {progressElement}
      </div>
    )
  }

  const navigationButtons = (
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
  )
  
  return (
    <div ref={ref} className={cn("flex flex-col space-y-4", className)}>
      {config.position === 'top' && renderProgressIndicator()}
      {navigationButtons}
      {config.position === 'bottom' && renderProgressIndicator()}
    </div>
  )
})

StepNavigation.displayName = "StepNavigation"
