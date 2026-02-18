'use client'

import * as React from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8)

type Slot = {
  day: number
  hour: number
}

type AvailabilityPickerProps = {
  value: Slot[]
  onChange: (slots: Slot[]) => void
}

function slotKey(slot: Slot) {
  return `${slot.day}-${slot.hour}`
}

export function AvailabilityPicker({ value, onChange }: AvailabilityPickerProps) {
  const active = new Set(value.map(slotKey))

  const toggle = (slot: Slot) => {
    const key = slotKey(slot)
    if (active.has(key)) {
      onChange(value.filter((entry) => slotKey(entry) !== key))
      return
    }

    onChange([...value, slot])
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-xs">
          <thead>
            <tr>
              <th className="w-16 border p-2 text-left">Time</th>
              {DAYS.map((day) => (
                <th key={day} className="border p-2 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour}>
                <td className="border p-2 font-medium">{`${hour}:00`}</td>
                {DAYS.map((_, dayIndex) => {
                  const slot = { day: dayIndex, hour }
                  const selected = active.has(slotKey(slot))

                  return (
                    <td key={`${dayIndex}-${hour}`} className="border p-1">
                      <button
                        type="button"
                        className={`h-7 w-full rounded ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                        onClick={() => toggle(slot)}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-sm text-muted-foreground">
        Selected slots: {value.length}
      </div>
    </div>
  )
}
