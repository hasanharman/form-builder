'use client'
import React, { forwardRef, useCallback, useState } from 'react'
import { useTimescape, type Options } from 'timescape/react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
// @source: https://github.com/dan-lee/timescape?tab=readme-ov-file

const timePickerInputBase =
  'p-1 inline tabular-nums h-fit border-none outline-none select-none content-box caret-transparent rounded-sm min-w-8 text-center focus:bg-foreground/20 focus-visible:ring-0 focus-visible:outline-none'
const timePickerSeparatorBase = 'text-xs text-gray-400'

type DateFormat = 'days' | 'months' | 'years'
type TimeFormat = 'hours' | 'minutes' | 'seconds' | 'am/pm'

type DateTimeArray<T extends DateFormat | TimeFormat> = T[]
type DateTimeFormatDefaults = [
  DateTimeArray<DateFormat>,
  DateTimeArray<TimeFormat>,
]

const DEFAULTS = [
  ['months', 'days', 'years'],
  ['hours', 'minutes', 'am/pm'],
] as DateTimeFormatDefaults

type TimescapeReturn = ReturnType<typeof useTimescape>
type InputPlaceholders = Record<DateFormat | TimeFormat, string>
const INPUT_PLACEHOLDERS: InputPlaceholders = {
  months: 'MM',
  days: 'DD',
  years: 'YYYY',
  hours: 'HH',
  minutes: 'MM',
  seconds: 'SS',
  'am/pm': 'AM/PM',
}

/**
 * Date time picker Docs: {@link: https://shadcn-extension.vercel.app/docs/otp-input}
 */

const DatetimeGrid = forwardRef<
  HTMLDivElement,
  {
    format: DateTimeFormatDefaults
    className?: string
    timescape: Pick<TimescapeReturn, 'getRootProps' | 'getInputProps'>
    placeholders: InputPlaceholders
  }
>(
  (
    {
      format,
      className,
      timescape,
      placeholders,
    }: {
      format: DateTimeFormatDefaults
      className?: string
      timescape: Pick<TimescapeReturn, 'getRootProps' | 'getInputProps'>
      placeholders: InputPlaceholders
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'flex items-center w-fit p-1 border',
          className,
          'border-input rounded-md gap-1 selection:bg-transparent selection:text-foreground',
        )}
        {...timescape.getRootProps()}
        ref={ref}
      >
        {!!format?.length
          ? format.map((group, i) => (
              <React.Fragment key={i === 0 ? 'dates' : 'times'}>
                {!!group?.length
                  ? group.map((unit, j) => (
                      <React.Fragment key={unit}>
                        <Input
                          className={cn(timePickerInputBase, 'min-w-8', {
                            'min-w-10': unit === 'years',
                            'bg-foreground/15': unit === 'am/pm',
                          })}
                          {...timescape.getInputProps(unit)}
                          placeholder={placeholders[unit]}
                        />
                        {i === 0 && j < group.length - 1 ? (
                          // date separator
                          <span className={timePickerSeparatorBase}>/</span>
                        ) : (
                          j < group.length - 2 && (
                            // time separator
                            <span className={timePickerSeparatorBase}>:</span>
                          )
                        )}
                      </React.Fragment>
                    ))
                  : null}
                {format[1]?.length && !i ? (
                  // date-time separator - only if both date and time are present
                  <span
                    className={cn(
                      timePickerSeparatorBase,
                      'opacity-30 text-xl',
                    )}
                  >
                    |
                  </span>
                ) : null}
              </React.Fragment>
            ))
          : null}
      </div>
    )
  },
)

DatetimeGrid.displayName = 'DatetimeGrid'

interface DateTimeInput {
  value?: Date
  format: DateTimeFormatDefaults
  placeholders?: InputPlaceholders
  onChange?: Options['onChangeDate']
  dtOptions?: Options
  className?: string
}

const DEFAULT_TS_OPTIONS = {
  date: new Date(),
  hour12: true,
}
export const DatetimePicker = forwardRef<HTMLDivElement, DateTimeInput>(
  (
    {
      value = new Date(),
      format = DEFAULTS,
      placeholders,
      dtOptions = DEFAULT_TS_OPTIONS,
      onChange,
      className,
    },
    ref,
  ) => {
    const handleDateChange = useCallback(
      (nextDate: Date | undefined) => {
        onChange ? onChange(nextDate) : console.log(nextDate)
      },
      [onChange],
    )
    const timescape = useTimescape({
      date: value,
      onChangeDate: handleDateChange,
      ...dtOptions,
    })
    return (
      <DatetimeGrid
        format={format}
        className={className}
        timescape={timescape}
        placeholders={placeholders ?? INPUT_PLACEHOLDERS}
        ref={ref}
      />
    )
  },
)

DatetimePicker.displayName = 'DatetimePicker'
