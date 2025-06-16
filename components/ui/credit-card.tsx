'use client'

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { CreditCard as CreditCardIcon, Lock } from 'lucide-react'

// Enhanced Card vendor SVG icons with better styling
const CardIcons = {
  visa: (
    <svg viewBox="0 0 40 24" className="w-10 h-6">
      <rect width="40" height="24" rx="4" fill="#1A1F71" />
      <text
        x="20"
        y="15"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        VISA
      </text>
    </svg>
  ),
  mastercard: (
    <svg viewBox="0 0 40 24" className="w-10 h-6">
      <rect width="40" height="24" rx="4" fill="#000" />
      <circle cx="15" cy="12" r="7" fill="#EB001B" />
      <circle cx="25" cy="12" r="7" fill="#FF5F00" />
    </svg>
  ),
  amex: (
    <svg viewBox="0 0 40 24" className="w-10 h-6">
      <rect width="40" height="24" rx="4" fill="#006FCF" />
      <text
        x="20"
        y="15"
        textAnchor="middle"
        fill="white"
        fontSize="6"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        AMEX
      </text>
    </svg>
  ),
  discover: (
    <svg viewBox="0 0 40 24" className="w-10 h-6">
      <rect width="40" height="24" rx="4" fill="#FF6000" />
      <text
        x="20"
        y="15"
        textAnchor="middle"
        fill="white"
        fontSize="5"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        DISCOVER
      </text>
    </svg>
  ),
  generic: <CreditCardIcon className="w-10 h-6 opacity-60" />,
}

// Card style variants with improved base style
export type CardStyle =
  | 'base'
  | 'shiny-silver'
  | 'amex-green'
  | 'amex-black'
  | 'metal'

const cardStyles: Record<CardStyle, string> = {
  // Base style matching shadcn card (white/clean)
  base: 'bg-card border text-card-foreground shadow-sm',
  'shiny-silver':
    'bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 border-gray-400 text-gray-800 shadow-2xl',
  'amex-green':
    'bg-gradient-to-br from-green-700 via-green-600 to-green-800 border-green-500 text-white shadow-xl',
  'amex-black':
    'bg-gradient-to-br from-gray-900 via-black to-gray-800 border-gray-600 text-white shadow-2xl',
  metal:
    'bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700 border-slate-400 text-white shadow-2xl backdrop-blur-sm',
}

const cardBackStyles: Record<CardStyle, string> = {
  base: 'bg-muted border text-muted-foreground shadow-sm',
  'shiny-silver':
    'bg-gradient-to-br from-gray-400 via-gray-200 to-gray-400 border-gray-500 text-gray-800',
  'amex-green':
    'bg-gradient-to-br from-green-800 via-green-700 to-green-900 border-green-600 text-white',
  'amex-black':
    'bg-gradient-to-br from-black via-gray-900 to-black border-gray-700 text-white',
  metal:
    'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 border-slate-500 text-white',
}

export interface CreditCardValue {
  cardholderName: string
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
}

export interface CreditCardProps {
  value?: CreditCardValue
  onChange?: (value: CreditCardValue) => void
  onValidationChange?: (isValid: boolean, errors: ValidationErrors) => void
  className?: string
  ref?: React.RefObject<CreditCardRef>
  cvvLabel?: 'CCV' | 'CVC'
  cardStyle?: CardStyle
  showVendor?: boolean
}

export interface CreditCardRef {
  validate: () => boolean
  isValid: () => boolean
  focus: () => void
  reset: () => void
  getErrors: () => ValidationErrors
}

interface ValidationErrors {
  cardholderName?: string
  cardNumber?: string
  expiryMonth?: string
  expiryYear?: string
  cvv?: string
  general?: string
}

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts: string[] = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  if (parts.length) {
    return parts.join(' ')
  } else {
    return v
  }
}

const getCardType = (number: string): keyof typeof CardIcons => {
  const cleanNumber = number.replace(/\s/g, '')

  // Visa: starts with 4
  if (cleanNumber.startsWith('4')) return 'visa'

  // Mastercard: starts with 5 or 2221-2720
  if (
    cleanNumber.startsWith('5') ||
    (cleanNumber.startsWith('2') &&
      parseInt(cleanNumber.substring(0, 4)) >= 2221 &&
      parseInt(cleanNumber.substring(0, 4)) <= 2720)
  ) {
    return 'mastercard'
  }

  // American Express: starts with 34 or 37
  if (cleanNumber.startsWith('34') || cleanNumber.startsWith('37'))
    return 'amex'

  // Discover: starts with 6011, 622126-622925, 644-649, 65
  if (
    cleanNumber.startsWith('6011') ||
    cleanNumber.startsWith('65') ||
    cleanNumber.startsWith('644') ||
    cleanNumber.startsWith('645') ||
    cleanNumber.startsWith('646') ||
    cleanNumber.startsWith('647') ||
    cleanNumber.startsWith('648') ||
    cleanNumber.startsWith('649')
  ) {
    return 'discover'
  }

  return 'generic'
}

const validateCreditCard = (
  value: CreditCardValue,
  cvvLabel: string,
): ValidationErrors => {
  const errors: ValidationErrors = {}

  // Validate cardholder name
  if (!value.cardholderName?.trim()) {
    errors.cardholderName = 'Cardholder name is required'
  } else if (value.cardholderName.trim().length < 2) {
    errors.cardholderName = 'Name must be at least 2 characters'
  }

  // Validate card number
  const cleanCardNumber = value.cardNumber?.replace(/\s/g, '') || ''
  if (!cleanCardNumber) {
    errors.cardNumber = 'Card number is required'
  } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    errors.cardNumber = 'Invalid card number length'
  } else if (!/^\d+$/.test(cleanCardNumber)) {
    errors.cardNumber = 'Card number must contain only digits'
  }

  // Validate expiry month
  if (!value.expiryMonth?.trim()) {
    errors.expiryMonth = 'Expiry month is required'
  }

  // Validate expiry year
  if (!value.expiryYear?.trim()) {
    errors.expiryYear = 'Expiry year is required'
  } else if (value.expiryMonth && value.expiryYear) {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    const expiryYear = parseInt(value.expiryYear)
    const expiryMonth = parseInt(value.expiryMonth)

    if (
      expiryYear < currentYear ||
      (expiryYear === currentYear && expiryMonth < currentMonth)
    ) {
      errors.expiryYear = 'Card has expired'
    }
  }

  // Validate CVV
  const cardType = getCardType(value.cardNumber || '')
  const expectedCvvLength = cardType === 'amex' ? 4 : 3
  if (!value.cvv?.trim()) {
    errors.cvv = `${cvvLabel} is required`
  } else if (value.cvv.length !== expectedCvvLength) {
    errors.cvv = `${cvvLabel} must be ${expectedCvvLength} digits`
  } else if (!/^\d+$/.test(value.cvv)) {
    errors.cvv = `${cvvLabel} must contain only digits`
  }

  return errors
}

function CreditCard({
  value,
  onChange,
  onValidationChange,
  className,
  ref,
  cvvLabel = 'CVC',
  cardStyle = 'base',
  showVendor = true,
}: CreditCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errors, setErrors] = useState<ValidationErrors>({})

  // 3D hover effect using framer-motion
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]))
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]))

  // Internal refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null)
  const cardholderInputRef = useRef<HTMLInputElement>(null)
  const cardNumberInputRef = useRef<HTMLInputElement>(null)
  const cvvInputRef = useRef<HTMLInputElement>(null)

  const currentValue = value || {
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  }

  const validateAndUpdate = (newValue: CreditCardValue) => {
    const validationErrors = validateCreditCard(newValue, cvvLabel)
    setErrors(validationErrors)

    const isValid = Object.keys(validationErrors).length === 0
    onValidationChange?.(isValid, validationErrors)

    return isValid
  }

  const handleInputChange = (
    field: keyof CreditCardValue,
    newValue: string,
  ) => {
    const updatedValue = { ...currentValue, [field]: newValue }
    onChange?.(updatedValue)
    validateAndUpdate(updatedValue)
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 19) {
      handleInputChange('cardNumber', formatted)
    }
  }

  const handleCvvFocus = () => {
    setIsFlipped(true)
    setFocusedField('cvv')
  }

  const handleCvvBlur = () => {
    setIsFlipped(false)
    setFocusedField(null)
  }

  const handleFieldFocus = (fieldName: string) => {
    setFocusedField(fieldName)
  }

  const handleFieldBlur = () => {
    setFocusedField(null)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleValidate = () => {
    const isValid = validateAndUpdate(currentValue)

    if (!isValid) {
      if (errors.cardholderName) {
        cardholderInputRef.current?.focus()
      } else if (errors.cardNumber) {
        cardNumberInputRef.current?.focus()
      } else if (errors.cvv) {
        cvvInputRef.current?.focus()
      }
    }

    return isValid
  }

  const handleReset = () => {
    setErrors({})
    setFocusedField(null)
    setIsFlipped(false)
    onChange?.({
      cardholderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    })
  }

  const handleFocus = () => {
    cardholderInputRef.current?.focus()
  }

  const getErrors = () => errors

  // React 19: Expose imperative methods via ref callback
  useEffect(() => {
    if (ref && 'current' in ref) {
      ref.current = {
        validate: handleValidate,
        isValid: () =>
          Object.keys(validateCreditCard(currentValue, cvvLabel)).length === 0,
        focus: handleFocus,
        reset: handleReset,
        getErrors,
      }
    }
  }, [ref, currentValue, errors, handleValidate, handleReset, getErrors])

  const cardType = getCardType(currentValue.cardNumber)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i)
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return {
      value: month.toString().padStart(2, '0'),
      label: month.toString().padStart(2, '0'),
    }
  })

  // Get chip color based on card style
  const getChipColor = () => {
    switch (cardStyle) {
      case 'base':
        return 'bg-yellow-500'
      case 'shiny-silver':
        return 'bg-yellow-600'
      case 'amex-green':
      case 'amex-black':
        return 'bg-yellow-400'
      case 'metal':
        return 'bg-yellow-300'
      default:
        return 'bg-yellow-400'
    }
  }

  return (
    <div ref={containerRef} className={cn('w-full max-w-sm py-2', className)}>
      {/* Card Container with 3D effects using Tailwind CSS utilities */}
      <div className="relative h-56 mb-6 [perspective:1000px]">
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          style={{
            rotateX: rotateX,
            rotateY: isFlipped ? 180 : rotateY,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Front of Card */}
          <Card
            className={cn(
              'absolute inset-0 w-full h-full p-6 flex flex-col justify-between [backface-visibility:hidden] shadow-xl',
              cardStyles[cardStyle],
            )}
          >
            <div className="flex justify-between items-start">
              <div
                className={cn('w-12 h-8 rounded shadow-md', getChipColor())}
              ></div>
              {/* Vendor logo moved to top right for now, will be repositioned */}
            </div>

            <div className="space-y-4">
              <div className="text-xl font-mono tracking-wider font-bold">
                {currentValue.cardNumber || '•••• •••• •••• ••••'}
              </div>

              {/* Bottom row: cardholder - expires - vendor logo */}
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <div className="text-xs opacity-70 uppercase font-medium">
                    Card Holder
                  </div>
                  <div className="font-bold text-sm">
                    {currentValue.cardholderName || 'YOUR NAME'}
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs opacity-70 uppercase font-medium">
                    Expires
                  </div>
                  <div className="font-bold text-sm">
                    {currentValue.expiryMonth && currentValue.expiryYear
                      ? `${currentValue.expiryMonth}/${currentValue.expiryYear.slice(-2)}`
                      : 'MM/YY'}
                  </div>
                </div>
                <div className="flex-1 flex justify-end">
                  {showVendor && CardIcons[cardType]}
                </div>
              </div>
            </div>
          </Card>

          {/* Back of Card */}
          <Card
            className={cn(
              'absolute inset-0 w-full h-full p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl',
              cardBackStyles[cardStyle],
            )}
          >
            <div className="w-full h-12 bg-black mt-4 shadow-inner"></div>

            <div className="flex justify-end items-center space-x-4">
              <div className="text-right">
                <div className="text-xs opacity-70 uppercase font-medium">
                  {cvvLabel}
                </div>
                <div className="bg-white text-black px-3 py-1 rounded text-center font-mono font-bold">
                  {currentValue.cvv || '•••'}
                </div>
              </div>
              <Lock className="w-6 h-6 opacity-60" />
            </div>

            <div className="text-xs opacity-60 text-center font-medium">
              This card is protected by advanced security features
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Cardholder Name
          </label>
          <Input
            ref={cardholderInputRef}
            type="text"
            placeholder="John Doe"
            value={currentValue.cardholderName}
            onChange={(e) =>
              handleInputChange('cardholderName', e.target.value.toUpperCase())
            }
            onFocus={() => handleFieldFocus('cardholderName')}
            onBlur={handleFieldBlur}
            className={cn(
              'transition-all duration-200',
              focusedField === 'cardholderName' && 'ring-2 ring-primary',
              errors.cardholderName && 'border-destructive',
            )}
          />
          {errors.cardholderName && (
            <p className="text-destructive text-xs mt-1">
              {errors.cardholderName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Card Number</label>
          <Input
            ref={cardNumberInputRef}
            type="text"
            placeholder="1234 5678 9012 3456"
            value={currentValue.cardNumber}
            onChange={handleCardNumberChange}
            onFocus={() => handleFieldFocus('cardNumber')}
            onBlur={handleFieldBlur}
            className={cn(
              'font-mono transition-all duration-200',
              focusedField === 'cardNumber' && 'ring-2 ring-primary',
              errors.cardNumber && 'border-destructive',
            )}
            maxLength={19}
          />
          {errors.cardNumber && (
            <p className="text-destructive text-xs mt-1">{errors.cardNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <Select
              value={currentValue.expiryMonth}
              onValueChange={(value) => handleInputChange('expiryMonth', value)}
            >
              <SelectTrigger
                className={cn(
                  'transition-all duration-200',
                  focusedField === 'expiryMonth' && 'ring-2 ring-primary',
                  errors.expiryMonth && 'border-destructive',
                )}
              >
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.expiryMonth && (
              <p className="text-destructive text-xs mt-1">
                {errors.expiryMonth}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <Select
              value={currentValue.expiryYear}
              onValueChange={(value) => handleInputChange('expiryYear', value)}
            >
              <SelectTrigger
                className={cn(
                  'transition-all duration-200',
                  focusedField === 'expiryYear' && 'ring-2 ring-primary',
                  errors.expiryYear && 'border-destructive',
                )}
              >
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.expiryYear && (
              <p className="text-destructive text-xs mt-1">
                {errors.expiryYear}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{cvvLabel}</label>
            <Input
              ref={cvvInputRef}
              type="text"
              placeholder="123"
              value={currentValue.cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '')
                if (value.length <= (cardType === 'amex' ? 4 : 3)) {
                  handleInputChange('cvv', value)
                }
              }}
              onFocus={handleCvvFocus}
              onBlur={handleCvvBlur}
              className={cn(
                'font-mono text-center transition-all duration-200',
                focusedField === 'cvv' && 'ring-2 ring-primary',
                errors.cvv && 'border-destructive',
              )}
              maxLength={cardType === 'amex' ? 4 : 3}
            />
            {errors.cvv && (
              <p className="text-destructive text-xs mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

CreditCard.displayName = 'CreditCard'

export { CreditCard }
