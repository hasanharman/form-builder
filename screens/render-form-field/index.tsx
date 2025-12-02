'use client'

import { ChangeEvent, useRef, useState } from 'react'

import { FormFieldType } from '@/types'
import { cn } from '@/lib/utils'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { PasswordInput } from '@/components/ui/password-input'
import { PhoneInput } from '@/components/ui/phone-input'
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from '@/components/ui/file-upload'
import { Slider } from '@/components/ui/slider'
import { CalendarIcon, Check, ChevronsUpDown, Paperclip } from 'lucide-react'
import { TagsInput } from '@/components/ui/tags-input'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select'
import { DatetimePicker } from '@/components/ui/datetime-picker'
import { SmartDatetimeInput } from '@/components/ui/smart-datetime-input'
import LocationSelector from '@/components/ui/location-input'
import SignatureInput from '@/components/ui/signature-input'
import SignaturePad from '@/components/ui/signature-pad'
import { Rating } from '@/components/ui/rating'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, CreditCardValue } from '@/components/ui/credit-card'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </>
  )
}

export const renderFormField = (field: FormFieldType, form: any) => {
  const [checked, setChecked] = useState<boolean>(field.checked)
  const [value, setValue] = useState<any>(field.value)
  const [selectedValues, setSelectedValues] = useState<string[]>(['React'])
  const [tagsValue, setTagsValue] = useState<string[]>([])
  const [files, setFiles] = useState<File[] | null>(null) // Initialize to null or use [] for an empty array
  const [sliderValue, setSliderValue] = useState<number[]>([5])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [datetime, setDatetime] = useState<Date | undefined>(new Date())
  const [smartDatetime, setSmartDatetime] = useState<Date | null>()
  const [countryName, setCountryName] = useState<string>('')
  const [stateName, setStateName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [creditCard, setCreditCard] = useState<CreditCardValue>({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  }

  switch (field.variant) {
    case 'Checkbox':
      return (
        <FormItem className="flex flex-col">
          <div
            className={cn(
              'flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4',
              field.className,
            )}
          >
            <FormControl>
              <Checkbox
                checked={checked} // Ensure this is handled as boolean
                onCheckedChange={() => {
                  setChecked(!checked)
                }}
                disabled={field.disabled}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
              <FormDescription>{field.description}</FormDescription>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )
    case 'Combobox':
      return (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          </div>{' '}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-full justify-between',
                    !value && 'text-muted-foreground',
                  )}
                >
                  {value
                    ? languages.find((language) => language.value === value)
                      ?.label
                    : 'Select language'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search language..." />
                <CommandList>
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {languages.map((language) => (
                      <CommandItem
                        value={language.label}
                        key={language.value}
                        onSelect={() => {
                          setValue(language.value)
                          form.setValue(field.name, language.value)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            language.value === value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {language.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Date Picker':
      return (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  form.setValue(field.name, newDate, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Datetime Picker':
      return (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          </div>
          <DatetimePicker
            {...field}
            value={datetime}
            // onChange={setDatetime}
            onChange={(newDate) => {
              setDatetime(newDate)
              form.setValue(field.name, newDate, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
            format={[
              ['months', 'days', 'years'],
              ['hours', 'minutes', 'am/pm'],
            ]}
          />
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'File Input':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <FileUploader
              value={files}
              onValueChange={setFiles}
              dropzoneOptions={dropZoneConfig}
              className="relative bg-background rounded-lg p-2"
            >
              <FileInput
                id="fileInput"
                className="outline-dashed outline-1 outline-slate-500"
              >
                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                  <FileSvgDraw />
                </div>
              </FileInput>
              <FileUploaderContent>
                {files &&
                  files.length > 0 &&
                  files.map((file, i) => (
                    <FileUploaderItem key={i} index={i}>
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
              </FileUploaderContent>
            </FileUploader>
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Input':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <Input
              placeholder={field.placeholder}
              disabled={field.disabled}
              type={field?.type}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Input OTP':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Location Input':
      return (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          </div>
          <LocationSelector
            onCountryChange={(country) => {
              setCountryName(country?.name || '')
              form.setValue(field.name, [country?.name || '', stateName || ''])
            }}
            onStateChange={(state) => {
              setStateName(state?.name || '')
              form.setValue(field.name, [
                form.getValues(field.name)[0] || '',
                state?.name || '',
              ])
            }}
          />
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Multi Select':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <MultiSelector
              values={selectedValues}
              onValuesChange={(newValues) => {
                setSelectedValues(newValues)
                form.setValue(field.name, newValues, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
              className="max-w-xs"
            >
              <MultiSelectorTrigger>
                <MultiSelectorInput placeholder="Select languages" />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  <MultiSelectorItem value={'React'}>React</MultiSelectorItem>
                  <MultiSelectorItem value={'Vue'}>Vue</MultiSelectorItem>
                  <MultiSelectorItem value={'Svelte'}>Svelte</MultiSelectorItem>
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Select':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <Select onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="m@example.com">m@example.com</SelectItem>
              <SelectItem value="m@google.com">m@google.com</SelectItem>
              <SelectItem value="m@support.com">m@support.com</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Slider':
      const min = field.min || 0
      const max = field.max || 100
      const step = field.step || 1
      const defaultValue = 5

      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <Slider
              min={min}
              max={max}
              step={step}
              value={sliderValue}
              onValueChange={(value) => {
                setSliderValue(value)
              }} // Update to set the first value as a number
            />
          </FormControl>
          <FormDescription className="py-3">
            {field.description} Selected value is {value || defaultValue},
            minimun valus is {min}, maximim values is {max}, step size is {step}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Signature Input':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <SignatureInput
              canvasRef={canvasRef}
              onSignatureChange={(signature) => {
                form.setValue(field.name, signature || undefined)
              }}
            />
          </FormControl>
          <FormDescription className="py-3">
            {field.description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Signature Pad':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <SignaturePad
              value={value as string | null}
              onChange={(signature) => {
                setValue(signature)
                form.setValue(field.name, signature || undefined)
              }}
            />
          </FormControl>
          <FormDescription className="py-3">
            {field.description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Smart Datetime Input':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <SmartDatetimeInput
              locale={field.locale as any}
              hour12={field.hour12}
              value={smartDatetime}
              onValueChange={(newDate) => {
                setSmartDatetime(newDate)
                form.setValue(field.name, newDate, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
              placeholder="e.g. tomorrow at 3pm"
            />
          </FormControl>
          <FormDescription className="py-3">
            {field.description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Switch':
      return (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
            <FormDescription>{field.description}</FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={checked}
              onCheckedChange={() => {
                setChecked(!checked)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )
    case 'Tags Input':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <TagsInput
              value={tagsValue}
              onValueChange={(newTags) => {
                setTagsValue(newTags)
                form.setValue(field.name, newTags, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
              placeholder="Enter your tags"
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Textarea':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={field.placeholder}
              className="resize-none"
            // {...field}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Password':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <PasswordInput
              value={password}
              placeholder={field.placeholder}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value)
                form.setValue(field.name, e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Phone':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <PhoneInput
              defaultCountry="TR"
              onChange={(phoneNumber) => {
                form.setValue(field.name, phoneNumber, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Rating':
      return (
        <FormItem>
          <FormLabel className="flex items-center gap-1 flex-nowrap">{field.label} {field.required && '*'}</FormLabel>
          <FormControl>
            <Rating
              value={rating}
              onChange={(value) => {
                setRating(value)
                form.setValue(field.name, value.toString(), {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
            />
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'RadioGroup':
      return (
        <FormItem className="space-y-3">
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              className="flex flex-col space-y-1"
            >
              {[
                ['Male', 'male'],
                ['Female', 'female'],
                ['Other', 'other'],
              ].map((option, index) => {
                return (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={option[1]} />
                    </FormControl>
                    <FormLabel className="font-normal">{option[0]}</FormLabel>
                  </FormItem>
                )
              })}
            </RadioGroup>
          </FormControl>
          <FormDescription>{field.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case 'Credit Card':
      return (
        <FormField
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <CreditCard
                  value={creditCard}
                  onChange={(value) => {
                    setCreditCard(value)
                    // Update form with the credit card object directly
                    formField.onChange(value)
                    form.setValue(field.name, value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }}
                />
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    default:
      return null
  }
}
