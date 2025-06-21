'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { ProgressBarConfig, ProgressBarStyle, ProgressBarPosition, ProgressBarVariant } from '@/types'

interface MultiStepSettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  isMultiStep: boolean
  progressConfig: ProgressBarConfig
  allowStepSkipping: boolean
  showProgress: boolean
  saveProgress: boolean
  onSave: (settings: {
    isMultiStep: boolean
    progressConfig: ProgressBarConfig
    allowStepSkipping: boolean
    showProgress: boolean
    saveProgress: boolean
  }) => void
}

const defaultProgressConfig: ProgressBarConfig = {
  style: 'linear',
  position: 'bottom',
  variant: 'rounded',
  showPercentage: true
}

export const MultiStepSettingsDialog: React.FC<MultiStepSettingsDialogProps> = ({
  isOpen,
  onClose,
  isMultiStep,
  progressConfig,
  allowStepSkipping,
  showProgress,
  saveProgress,
  onSave,
}) => {
  const [settings, setSettings] = useState({
    isMultiStep,
    progressConfig: progressConfig || defaultProgressConfig,
    allowStepSkipping,
    showProgress,
    saveProgress,
  })

  useEffect(() => {
    setSettings({
      isMultiStep,
      progressConfig: progressConfig || defaultProgressConfig,
      allowStepSkipping,
      showProgress,
      saveProgress,
    })
  }, [isMultiStep, progressConfig, allowStepSkipping, showProgress, saveProgress])

  const handleSave = () => {
    onSave(settings)
    onClose()
  }

  const updateProgressConfig = (updates: Partial<ProgressBarConfig>) => {
    setSettings(prev => ({
      ...prev,
      progressConfig: { ...prev.progressConfig, ...updates }
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Multistep Form Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {/* Enable Multistep */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border p-3 rounded">
              <Checkbox
                checked={settings.isMultiStep}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, isMultiStep: checked as boolean }))
                }
              />
              <Label>Enable Multistep Form</Label>
            </div>
          </div>

          {/* Multistep Options */}
          {settings.isMultiStep && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Form Behavior</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 border p-3 rounded">
                    <Checkbox
                      checked={settings.allowStepSkipping}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, allowStepSkipping: checked as boolean }))
                      }
                    />
                    <Label>Allow Step Skipping</Label>
                  </div>
                  <div className="flex items-center gap-2 border p-3 rounded">
                    <Checkbox
                      checked={settings.saveProgress}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, saveProgress: checked as boolean }))
                      }
                    />
                    <Label>Save Progress</Label>
                  </div>
                </div>
              </div>

              {/* Progress Bar Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={settings.showProgress}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, showProgress: checked as boolean }))
                    }
                  />
                  <Label className="text-lg font-medium">Show Progress Bar</Label>
                </div>

                {settings.showProgress && (
                  <div className="ml-6 space-y-4 border-l-2 border-muted pl-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="progress-style">Progress Style</Label>
                        <Select
                          value={settings.progressConfig.style}
                          onValueChange={(value: ProgressBarStyle) =>
                            updateProgressConfig({ style: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">Linear Progress Bar</SelectItem>
                            <SelectItem value="circular">Circular Progress</SelectItem>
                            <SelectItem value="numbered">Numbered Steps</SelectItem>
                            <SelectItem value="simple">Simple Indicator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="progress-position">Position</Label>
                        <Select
                          value={settings.progressConfig.position}
                          onValueChange={(value: ProgressBarPosition) =>
                            updateProgressConfig({ position: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="progress-variant">Variant</Label>
                        <Select
                          value={settings.progressConfig.variant}
                          onValueChange={(value: ProgressBarVariant) =>
                            updateProgressConfig({ variant: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select variant" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rounded">Rounded</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-end">
                        <div className="flex items-center gap-2 border p-3 rounded">
                          <Checkbox
                            checked={settings.progressConfig.showPercentage}
                            onCheckedChange={(checked) =>
                              updateProgressConfig({ showPercentage: checked as boolean })
                            }
                          />
                          <Label>Show Percentage</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
