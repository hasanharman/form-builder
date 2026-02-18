'use client'

import * as React from 'react'

import { Input } from '@/components/ui/input'

const MASK_TOKENS = {
  '9': /\d/,
  a: /[A-Za-z]/,
  '*': /[A-Za-z0-9]/,
} as const

export function applyMask(raw: string, mask: string) {
  const clean = raw.replace(/[^A-Za-z0-9]/g, '')
  let cleanIndex = 0
  let maskedValue = ''

  for (let i = 0; i < mask.length; i += 1) {
    const maskChar = mask[i] as keyof typeof MASK_TOKENS
    const token = MASK_TOKENS[maskChar]

    if (!token) {
      maskedValue += mask[i]
      continue
    }

    while (cleanIndex < clean.length && !token.test(clean[cleanIndex])) {
      cleanIndex += 1
    }

    if (cleanIndex < clean.length) {
      maskedValue += clean[cleanIndex]
      cleanIndex += 1
    } else {
      break
    }
  }

  return maskedValue
}

type MaskedInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange'
> & {
  mask: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export function MaskedInput({
  mask,
  value,
  defaultValue,
  onValueChange,
  ...props
}: MaskedInputProps) {
  const [internalValue, setInternalValue] = React.useState(
    applyMask(defaultValue ?? '', mask),
  )

  const isControlled = value !== undefined
  const displayValue = isControlled ? applyMask(value, mask) : internalValue

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = applyMask(event.target.value, mask)

    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  return <Input {...props} value={displayValue} onChange={handleChange} />
}
