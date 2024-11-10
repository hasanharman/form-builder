'use client'

import React from 'react'
import * as chrono from 'chrono-node'
import { enUS as localeEnUS, type Locale } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { ActiveModifiers } from 'react-day-picker'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar, CalendarProps } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*                               Inspired By:                                 */
/*                               @steventey                                   */
/* ------------------https://dub.co/blog/smart-datetime-picker--------------- */
/* -------------------------------------------------------------------------- */

const localesUsings12HourTime = [
  'en-US',
  'en-CA',
  'en-AU',
  'en-NZ',
  'en-PH',
  'en-IN',
  'en-IE',
  'en-GB',
  'en-ZA',
  'en-NG',
  'en-MY',
  'en-BD',
  'en-PK',
  'es-US',
  'es-MX',
  'es-CO',
  'es-PH',
  'ar-SA',
  'ar-EG',
]

const chronoLocales = [
  'en',
  'de',
  'fr',
  'ja',
  'pt',
  'nl',
  'zh',
  'ru',
  'es',
  'uk',
] as const
type ChronoLocale = (typeof chronoLocales)[number]

/**
 * Utility function that parses dates.
 * Parses a given date string using the `chrono-node` library.
 *
 * @param str - A string representation of a date and time.
 * @param locale - The locale to use for parsing the date and time.
 * @returns A `Date` object representing the parsed date and time, or `null` if the string could not be parsed.
 */
export const parseDateTime = (str: Date | string, locale: Locale) => {
  if (str instanceof Date) return str

  const localeCode = chronoLocales.includes(locale.code as ChronoLocale)
    ? (locale.code as ChronoLocale)
    : chronoLocales.includes(locale.code.split('-')[0] as ChronoLocale)
      ? (locale.code.split('-')[0] as ChronoLocale)
      : 'en'

  return chrono[localeCode].parseDate(str)
}

/**
 * Converts a given timestamp or the current date and time to a string representation in the local time zone.
 * format: `HH:mm`, adjusted for the local time zone.
 *
 * @param timestamp {Date | string}
 * @returns A string representation of the timestamp
 */
export const getDateTimeLocal = (timestamp?: Date): string => {
  const d = timestamp ? new Date(timestamp) : new Date()
  if (d.toString() === 'Invalid Date') return ''

  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split(':')
    .slice(0, 2)
    .join(':')
}

/**
 * Formats a given date and time object or string into a human-readable string representation.
 * "MMM D, YYYY h:mm A" (e.g. "Jan 1, 2023 12:00 PM").
 *
 * @param datetime - {Date | string}
 * @param hour12 - Whether to use 12-hour time (true) or 24-hour time (false).
 * @param locale - The locale to use for formatting the date and time.
 * @returns A string representation of the date and time
 */
export const formatDateTime = (
  datetime: Date | string,
  locale: Locale,
  hour12: boolean,
) =>
  new Date(datetime).toLocaleTimeString(locale.code, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12,
  })

const inputBase =
  'bg-transparent focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50'

// @source: https://www.perplexity.ai/search/in-javascript-how-RfI7fMtITxKr5c.V9Lv5KA#1
// use this pattern to validate the transformed date string for the natural language input
const naturalInputValidationPattern =
  '^[A-Z][a-z]{2}sd{1,2},sd{4},sd{1,2}:d{2}s[AP]M$'

const DEFAULT_SIZE = 96

/**
 * Smart time input Docs: {@link: https://shadcn-extension.vercel.app/docs/smart-time-input}
 */
type SmartDatetimeInputProps = Omit<
  CalendarProps,
  'id' | 'mode' | 'selected' | 'onSelect' | 'initialFocus'
> & {
  value?: Date | null
  onValueChange: (date: Date | null) => void
  hour12?: boolean
}

type SmartDatetimeInputContextProps = SmartDatetimeInputProps & {
  Time: string
  onTimeChange: (time: string) => void
}

const SmartDatetimeInputContext =
  React.createContext<SmartDatetimeInputContextProps | null>(null)

const useSmartDateInput = () => {
  const context = React.useContext(SmartDatetimeInputContext)
  if (!context) {
    throw new Error(
      'useSmartDateInput must be used within SmartDateInputProvider',
    )
  }
  return context
}

export const SmartDatetimeInput = React.forwardRef<
  HTMLInputElement,
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'ref' | 'value' | 'defaultValue' | 'onBlur' | 'disabled'
  > &
    SmartDatetimeInputProps
>(
  (
    {
      className,
      value,
      locale = localeEnUS,
      hour12 = localesUsings12HourTime.includes(locale.code),
      onValueChange,
      placeholder,
      disabled,
      ...dateTimeInputProps
    },
    ref,
  ) => {
    // ? refactor to be only used with controlled input
    /*  const [dateTime, setDateTime] = React.useState<Date | undefined>(
    value ?? undefined
  ); */

    const [Time, setTime] = React.useState<string>('')

    const onTimeChange = React.useCallback((time: string) => {
      setTime(time)
    }, [])

    return (
      <SmartDatetimeInputContext.Provider
        value={{ value, onValueChange, Time, onTimeChange }}
      >
        <div className="flex items-center justify-center">
          <div
            className={cn(
              'flex gap-1 w-full p-1 items-center justify-between rounded-md border transition-all',
              'focus-within:outline-0 focus:outline-0 focus:ring-0',
              'placeholder:text-muted-foreground focus-visible:outline-0 ',
              className,
            )}
          >
            <DateTimeLocalInput
              locale={locale}
              hour12={hour12}
              disabled={disabled}
              {...dateTimeInputProps}
            />
            <NaturalLanguageInput
              ref={ref}
              locale={locale}
              hour12={hour12}
              placeholder={placeholder}
              disabled={typeof disabled === 'boolean' ? disabled : undefined}
            />
          </div>
        </div>
      </SmartDatetimeInputContext.Provider>
    )
  },
)

SmartDatetimeInput.displayName = 'DatetimeInput'

// Make it a standalone component
type TimePickerProps = {
  locale: Locale
  hour12: boolean
}

const TimePicker = ({ hour12, locale }: TimePickerProps) => {
  const { value, onValueChange, Time, onTimeChange } = useSmartDateInput()
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const timestamp = 15

  const formateSelectedTime = React.useCallback(
    (time: string, hour: number, partStamp: number) => {
      onTimeChange(time)

      const newVal = parseDateTime(value ?? new Date(), locale)
      if (!newVal) return

      newVal.setHours(
        hour,
        partStamp === 0 ? parseInt('00') : timestamp * partStamp,
      )

      // ? refactor needed check if we want to use the new date

      onValueChange(newVal)
    },
    [locale, value, onValueChange, onTimeChange],
  )

  const handleKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (!document) return

      const moveNext = () => {
        const nextIndex =
          activeIndex + 1 > DEFAULT_SIZE - 1 ? 0 : activeIndex + 1

        const currentElm = document.getElementById(`time-${nextIndex}`)

        currentElm?.focus()

        setActiveIndex(nextIndex)
      }

      const movePrev = () => {
        const prevIndex =
          activeIndex - 1 < 0 ? DEFAULT_SIZE - 1 : activeIndex - 1

        const currentElm = document.getElementById(`time-${prevIndex}`)

        currentElm?.focus()

        setActiveIndex(prevIndex)
      }

      const setElement = () => {
        const currentElm = document.getElementById(`time-${activeIndex}`)

        if (!currentElm) return

        currentElm.focus()

        const timeValue = currentElm.textContent ?? ''

        let hour = parseInt(timeValue.split(':')[0])
        const minutes = parseInt(timeValue.split(':')[1].split(' ')[0])

        if (hour12) {
          const PM_AM = timeValue.split(' ')[1]
          hour =
            PM_AM === 'AM'
              ? hour === 12
                ? 0
                : hour
              : hour === 12
                ? 12
                : hour + 12
        }

        const part = Math.floor(minutes / 15)

        formateSelectedTime(timeValue, hour, part)
      }

      const reset = () => {
        const currentElm = document.getElementById(`time-${activeIndex}`)
        currentElm?.blur()
        setActiveIndex(-1)
      }

      switch (e.key) {
        case 'ArrowUp':
          movePrev()
          break

        case 'ArrowDown':
          moveNext()
          break

        case 'Escape':
          reset()
          break

        case 'Enter':
          setElement()
          break
      }
    },
    [activeIndex, formateSelectedTime, hour12],
  )

  const handleClick = React.useCallback(
    (hour: number, part: number, PM_AM: string, currentIndex: number) => {
      let displayHour = hour
      if (hour12 && hour > 12) {
        displayHour = hour % 12
      }
      const formattedHour = displayHour === 0 ? 12 : displayHour
      const formattedTime = hour12
        ? `${formattedHour}:${part === 0 ? '00' : timestamp * part} ${PM_AM}`
        : `${hour}:${part === 0 ? '00' : timestamp * part}`
      formateSelectedTime(formattedTime, hour, part)
      setActiveIndex(currentIndex)
    },
    [formateSelectedTime, hour12],
  )

  const currentTime = React.useMemo(() => {
    const timeVal = Time.split(' ')[0]
    return {
      hours: parseInt(timeVal.split(':')[0]),
      minutes: parseInt(timeVal.split(':')[1]),
    }
  }, [Time])

  React.useEffect(() => {
    const getCurrentElementTime = () => {
      const timeVal = Time.split(' ')[0]
      const hours = parseInt(timeVal.split(':')[0])
      const minutes = parseInt(timeVal.split(':')[1])
      const PM_AM = hour12 ? Time.split(' ')[1] : ''

      const formatIndex = !hour12
        ? hours
        : PM_AM === 'AM'
          ? hours
          : hours === 12
            ? hours
            : hours + 12
      const formattedHours = formatIndex

      for (let j = 0; j <= 3; j++) {
        const diff = Math.abs(j * timestamp - minutes)
        const selected =
          !hour12 ||
          (PM_AM === (formattedHours >= 12 ? 'PM' : 'AM') &&
            (minutes <= 53
              ? diff < Math.ceil(timestamp / 2)
              : diff < timestamp))

        if (selected) {
          const trueIndex =
            activeIndex === -1 ? formattedHours * 4 + j : activeIndex

          setActiveIndex(trueIndex)

          const currentElm = document.getElementById(`time-${trueIndex}`)
          currentElm?.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          })
        }
      }
    }

    getCurrentElementTime()
  }, [Time, activeIndex, hour12])

  const height = React.useMemo(() => {
    if (!document) return
    const calendarElm = document.getElementById('calendar')
    if (!calendarElm) return
    return calendarElm.style.height
  }, [])

  return (
    <div className="space-y-2 pr-3 py-3 relative ">
      <ScrollArea
        onKeyDown={handleKeydown}
        className="h-full w-full focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 py-0.5"
        style={{
          height,
        }}
      >
        <ul
          className={cn(
            'flex items-center flex-col gap-1 h-full max-h-56 w-28 px-1 py-0.5',
          )}
        >
          {Array.from({ length: 24 }).map((_, i) => {
            const PM_AM = i >= 12 ? 'PM' : 'AM'
            const formatIndex = i > 12 ? i % 12 : i === 0 || i === 12 ? 12 : i

            return Array.from({ length: 4 }).map((_, part) => {
              const diff = Math.abs(part * timestamp - currentTime.minutes)

              const trueIndex = i * 4 + part

              const isSelected =
                (currentTime.hours === i ||
                  currentTime.hours === formatIndex) &&
                (!hour12 || Time.split(' ')[1] === PM_AM) &&
                (currentTime.minutes <= 53
                  ? diff < Math.ceil(timestamp / 2)
                  : diff < timestamp)

              const isSuggested = !value && isSelected

              const currentValue = !hour12
                ? `${i}:${part === 0 ? '00' : timestamp * part}`
                : `${formatIndex}:${
                    part === 0 ? '00' : timestamp * part
                  } ${PM_AM}`

              return (
                <li
                  tabIndex={isSelected ? 0 : -1}
                  id={`time-${trueIndex}`}
                  key={`time-${trueIndex}`}
                  aria-label="currentTime"
                  className={cn(
                    buttonVariants({
                      variant: isSuggested
                        ? 'secondary'
                        : isSelected
                          ? 'default'
                          : 'outline',
                    }),
                    'h-8 px-3 w-full text-sm focus-visible:outline-0 outline-0 focus-visible:border-0 cursor-default ring-0',
                  )}
                  onClick={() => handleClick(i, part, PM_AM, trueIndex)}
                  onFocus={() => isSuggested && setActiveIndex(trueIndex)}
                >
                  {currentValue}
                </li>
              )
            })
          })}
        </ul>
      </ScrollArea>
    </div>
  )
}

const NaturalLanguageInput = React.forwardRef<
  HTMLInputElement,
  {
    locale: Locale
    hour12: boolean
    placeholder?: string
    disabled?: boolean
  }
>(({ locale, hour12, placeholder, ...props }, ref) => {
  const { value, onValueChange, Time, onTimeChange } = useSmartDateInput()

  const _placeholder =
    placeholder ??
    (locale.code.split('-')[0] === 'fr'
      ? 'e.g. "demain à 17h" ou "dans 2 heures"'
      : 'e.g. "tomorrow at 5pm" or "in 2 hours"')

  const [inputValue, setInputValue] = React.useState<string>('')

  React.useEffect(() => {
    const hour = new Date().getHours()
    const timeVal = hour12
      ? `${hour >= 12 ? hour % 12 : hour}:${new Date().getMinutes()} ${
          hour >= 12 ? 'PM' : 'AM'
        }`
      : `${hour}:${new Date().getMinutes()}`

    setInputValue(value ? formatDateTime(value, locale, hour12) : '')
    onTimeChange(value ? Time : timeVal)
  }, [hour12, locale, value, Time, onTimeChange])

  const handleParse = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.value === '') {
        onTimeChange('')
        onValueChange(null)
        return
      }

      // parse the date string when the input field loses focus
      const parsedDateTime = parseDateTime(e.currentTarget.value, locale)
      if (parsedDateTime) {
        if (hour12) {
          const PM_AM = parsedDateTime.getHours() >= 12 ? 'PM' : 'AM'
          //fix the time format for this value

          const PM_AM_hour = parsedDateTime.getHours()

          const hour =
            PM_AM_hour > 12
              ? PM_AM_hour % 12
              : PM_AM_hour === 0 || PM_AM_hour === 12
                ? 12
                : PM_AM_hour

          onValueChange(parsedDateTime)
          setInputValue(formatDateTime(parsedDateTime, locale, hour12))
          onTimeChange(`${hour}:${parsedDateTime.getMinutes()} ${PM_AM}`)
        } else {
          onValueChange(parsedDateTime)
          setInputValue(formatDateTime(parsedDateTime, locale, hour12))
          onTimeChange(
            `${parsedDateTime.getHours()}:${parsedDateTime.getMinutes()}`,
          )
        }
      }
    },
    [locale, hour12, onValueChange, onTimeChange],
  )

  const handleKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Enter':
          const parsedDateTime = parseDateTime(e.currentTarget.value, locale)
          if (parsedDateTime) {
            const PM_AM = parsedDateTime.getHours() >= 12 ? 'PM' : 'AM'
            //fix the time format for this value

            const PM_AM_hour = parsedDateTime.getHours()

            const hour =
              PM_AM_hour > 12
                ? PM_AM_hour % 12
                : PM_AM_hour === 0 || PM_AM_hour === 12
                  ? 12
                  : PM_AM_hour

            onValueChange(parsedDateTime)
            setInputValue(formatDateTime(parsedDateTime, locale, hour12))
            onTimeChange(`${hour}:${parsedDateTime.getMinutes()} ${PM_AM}`)
          }
          break
      }
    },
    [locale, hour12, onValueChange, onTimeChange],
  )

  return (
    <Input
      ref={ref}
      type="text"
      placeholder={_placeholder}
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value)
      }}
      onKeyDown={handleKeydown}
      onBlur={handleParse}
      className={cn('px-2 mr-0.5 flex-1 border-none h-8 rounded', inputBase)}
      {...props}
    />
  )
})

NaturalLanguageInput.displayName = 'NaturalLanguageInput'

type DateTimeLocalInputProps = {
  locale: Locale
  hour12: boolean
} & Omit<CalendarProps, 'locale'>

const DateTimeLocalInput = ({
  locale,
  hour12,
  className,
  ...props
}: DateTimeLocalInputProps) => {
  const { value, onValueChange, Time } = useSmartDateInput()

  const formateSelectedDate = React.useCallback(
    (
      date: Date | undefined,
      selectedDate: Date,
      m: ActiveModifiers,
      e: React.MouseEvent,
    ) => {
      const parsedDateTime = parseDateTime(selectedDate, locale)

      if (parsedDateTime) {
        parsedDateTime.setHours(
          parseInt(Time.split(':')[0]),
          parseInt(Time.split(':')[1]),
        )
        onValueChange(parsedDateTime)
      }
    },
    [locale, Time, onValueChange],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          size={'icon'}
          className={cn(
            'size-9 flex items-center justify-center font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="size-4" />
          <span className="sr-only">calender</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" sideOffset={8}>
        <div className="flex gap-1">
          <Calendar
            {...props}
            locale={locale}
            id={'calendar'}
            className={cn('peer flex justify-end', inputBase, className)}
            mode="single"
            selected={value ?? undefined}
            onSelect={formateSelectedDate}
            initialFocus
          />
          <TimePicker locale={locale} hour12={hour12} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

DateTimeLocalInput.displayName = 'DateTimeLocalInput'
