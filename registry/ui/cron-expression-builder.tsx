'use client'

import * as React from 'react'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type CronValue = {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

type CronExpressionBuilderProps = {
  value?: CronValue
  onChange?: (value: CronValue & { expression: string; human: string }) => void
}

const DOW = [
  { value: '*', label: 'Any day' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' },
]

const defaultValue: CronValue = {
  minute: '0',
  hour: '9',
  dayOfMonth: '*',
  month: '*',
  dayOfWeek: '1',
}

const range = (max: number, pad = false) =>
  Array.from({ length: max }, (_, i) => ({
    value: String(i),
    label: pad ? String(i).padStart(2, '0') : String(i),
  }))

function toHuman(value: CronValue) {
  const day = DOW.find((item) => item.value === value.dayOfWeek)?.label ?? 'Custom day'
  return `Runs at ${value.hour.padStart(2, '0')}:${value.minute.padStart(2, '0')} on ${day}`
}

export function CronExpressionBuilder({
  value = defaultValue,
  onChange,
}: CronExpressionBuilderProps) {
  const [state, setState] = React.useState<CronValue>(value)

  const setField = (key: keyof CronValue, next: string) => {
    setState((prev) => {
      const updated = { ...prev, [key]: next }
      const expression = `${updated.minute} ${updated.hour} ${updated.dayOfMonth} ${updated.month} ${updated.dayOfWeek}`
      onChange?.({ ...updated, expression, human: toHuman(updated) })
      return updated
    })
  }

  const expression = `${state.minute} ${state.hour} ${state.dayOfMonth} ${state.month} ${state.dayOfWeek}`

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1">
          <Label>Minute</Label>
          <Select value={state.minute} onValueChange={(v) => setField('minute', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {range(60, true).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Hour</Label>
          <Select value={state.hour} onValueChange={(v) => setField('hour', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {range(24, true).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Day of Week</Label>
          <Select value={state.dayOfWeek} onValueChange={(v) => setField('dayOfWeek', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOW.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded border p-3 text-sm">
        <div className="font-medium">Cron: {expression}</div>
        <div className="text-muted-foreground">{toHuman(state)}</div>
      </div>
    </div>
  )
}
