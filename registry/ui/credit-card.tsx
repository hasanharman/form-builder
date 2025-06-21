'use client'

import * as React from 'react'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { CreditCard as CreditCardIcon, Lock } from 'lucide-react'

export interface CreditCardValue {
  cardholderName: string
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cvvLabel: 'CCV' | 'CVC'
}

export interface CreditCardProps {
  value?: CreditCardValue
  onChange?: (value: CreditCardValue) => void
  className?: string
}

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = matches && matches[0] || ''
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

const getCardType = (number: string) => {
  const cleanNumber = number.replace(/\s/g, '')
  if (cleanNumber.startsWith('4')) return 'visa'
  if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard'
  if (cleanNumber.startsWith('3')) return 'amex'
  return 'generic'
}

const CreditCard = React.forwardRef<HTMLDivElement, CreditCardProps>(
  ({ value, onChange, className }, ref) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const cvvInputRef = useRef<HTMLInputElement>(null)

    const currentValue = value || {
      cardholderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cvvLabel: 'CVC' as const
    }

    const handleInputChange = (field: keyof CreditCardValue, newValue: string) => {
      const updatedValue = { ...currentValue, [field]: newValue }
      onChange?.(updatedValue)
    }

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCardNumber(e.target.value)
      if (formatted.replace(/\s/g, '').length <= 16) {
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

    const cardType = getCardType(currentValue.cardNumber)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 20 }, (_, i) => currentYear + i)
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      return { value: month.toString().padStart(2, '0'), label: month.toString().padStart(2, '0') }
    })

    return (
      <div ref={ref} className={cn('w-full max-w-sm mx-auto', className)}>
        <div className="relative h-56 mb-6 perspective-1000">
          <motion.div
            className="relative w-full h-full"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Card className="absolute inset-0 w-full h-full bg-slate-800 border-slate-700 text-white p-6 flex flex-col justify-between backface-hidden">
              <div className="flex justify-between items-start">
                <div className="w-12 h-8 bg-yellow-400 rounded"></div>
                <CreditCardIcon className="w-8 h-8 opacity-80" />
              </div>
              
              <div className="space-y-4">
                <div className="text-xl font-mono tracking-wider">
                  {currentValue.cardNumber || '•••• •••• •••• ••••'}
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-70 uppercase">Card Holder</div>
                    <div className="font-medium">
                      {currentValue.cardholderName || 'YOUR NAME'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-70 uppercase">Expires</div>
                    <div className="font-medium">
                      {currentValue.expiryMonth && currentValue.expiryYear 
                        ? `${currentValue.expiryMonth}/${currentValue.expiryYear.slice(-2)}`
                        : 'MM/YY'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="absolute inset-0 w-full h-full bg-slate-700 border-slate-600 text-white p-6 flex flex-col justify-between backface-hidden rotate-y-180">
              <div className="w-full h-12 bg-black mt-4"></div>
              
              <div className="flex justify-end items-center space-x-4">
                <div className="text-right">
                  <div className="text-xs opacity-70 uppercase">{currentValue.cvvLabel}</div>
                  <div className="bg-white text-black px-2 py-1 rounded text-center font-mono">
                    {currentValue.cvv || '•••'}
                  </div>
                </div>
                <Lock className="w-6 h-6 opacity-60" />
              </div>
              
              <div className="text-xs opacity-60 text-center">
                This card is protected by advanced security features
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cardholder Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              value={currentValue.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value.toUpperCase())}
              onFocus={() => setFocusedField('cardholderName')}
              onBlur={() => setFocusedField(null)}
              className={cn(
                'transition-all duration-200',
                focusedField === 'cardholderName' && 'ring-2 ring-blue-500'
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Card Number</label>
            <Input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={currentValue.cardNumber}
              onChange={handleCardNumberChange}
              onFocus={() => setFocusedField('cardNumber')}
              onBlur={() => setFocusedField(null)}
              className={cn(
                'font-mono transition-all duration-200',
                focusedField === 'cardNumber' && 'ring-2 ring-blue-500'
              )}
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Month</label>
              <Select
                value={currentValue.expiryMonth}
                onValueChange={(value) => handleInputChange('expiryMonth', value)}
              >
                <SelectTrigger className={cn(
                  'transition-all duration-200',
                  focusedField === 'expiryMonth' && 'ring-2 ring-blue-500'
                )}>
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <Select
                value={currentValue.expiryYear}
                onValueChange={(value) => handleInputChange('expiryYear', value)}
              >
                <SelectTrigger className={cn(
                  'transition-all duration-200',
                  focusedField === 'expiryYear' && 'ring-2 ring-blue-500'
                )}>
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
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Select
                  value={currentValue.cvvLabel}
                  onValueChange={(value) => handleInputChange('cvvLabel', value as 'CCV' | 'CVC')}
                >
                  <SelectTrigger className="w-20 h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CVC">CVC</SelectItem>
                    <SelectItem value="CCV">CCV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  focusedField === 'cvv' && 'ring-2 ring-blue-500'
                )}
                maxLength={cardType === 'amex' ? 4 : 3}
              />
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            .perspective-1000 {
              perspective: 1000px;
            }
            .backface-hidden {
              backface-visibility: hidden;
            }
            .rotate-y-180 {
              transform: rotateY(180deg);
            }
          `
        }} />
      </div>
    )
  }
)

CreditCard.displayName = 'CreditCard'

export { CreditCard }
