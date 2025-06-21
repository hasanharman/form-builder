'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CreditCard, type CreditCardValue } from '@/components/ui/credit-card'

// Enhanced validation schema
const FormSchema = z
  .object({
    cardholderName: z
      .string()
      .min(2, 'Cardholder name must be at least 2 characters')
      .max(50, 'Cardholder name must be less than 50 characters'),

    cardNumber: z
      .string()
      .min(1, 'Card number is required')
      .refine((value) => {
        const cleanNumber = value.replace(/\s/g, '')
        return /^\d{13,19}$/.test(cleanNumber)
      }, 'Invalid card number format'),

    expiryMonth: z
      .string()
      .min(1, 'Expiry month is required')
      .refine((value) => {
        const month = parseInt(value)
        return month >= 1 && month <= 12
      }, 'Invalid month'),

    expiryYear: z
      .string()
      .min(1, 'Expiry year is required')
      .refine((value) => {
        const year = parseInt(value)
        const currentYear = new Date().getFullYear()
        return year >= currentYear && year <= currentYear + 20
      }, 'Invalid year'),

    cvv: z
      .string()
      .min(3, 'CVV must be at least 3 digits')
      .max(4, 'CVV must be at most 4 digits')
      .refine((value) => /^\d+$/.test(value), 'CVV must contain only digits'),
  })

  // Add expiry date validation
  .refine(
    (data) => {
      if (!data.expiryMonth || !data.expiryYear) return true // Let individual field validation handle this

      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1
      const expiryYear = parseInt(data.expiryYear)
      const expiryMonth = parseInt(data.expiryMonth)

      return (
        expiryYear > currentYear ||
        (expiryYear === currentYear && expiryMonth >= currentMonth)
      )
    },
    {
      message: 'Card has expired',
      path: ['expiryYear'], // Show error on year field
    },
  )

type CreditCardFormData = z.infer<typeof FormSchema>

export function CreditCardForm() {
  const [creditCard, setCreditCard] = useState<CreditCardValue>({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  })

  const [isCardValid, setIsCardValid] = useState(false)

  const form = useForm<CreditCardFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    },
    mode: 'onChange', // Enable real-time validation
  })

  const handleCreditCardChange = (value: CreditCardValue) => {
    setCreditCard(value)

    // Update form values
    form.setValue('cardholderName', value.cardholderName, {
      shouldValidate: true,
    })
    form.setValue('cardNumber', value.cardNumber, { shouldValidate: true })
    form.setValue('expiryMonth', value.expiryMonth, { shouldValidate: true })
    form.setValue('expiryYear', value.expiryYear, { shouldValidate: true })
    form.setValue('cvv', value.cvv, { shouldValidate: true })
  }

  const handleValidationChange = (isValid: boolean, errors: any) => {
    setIsCardValid(isValid)
  }

  const onSubmit = (data: CreditCardFormData) => {
    console.log('Form submitted:', data)
    toast.success(
      <div className="space-y-2">
        <p className="font-semibold">Payment Information Submitted</p>
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-xs">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>,
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Payment Information</h2>
        <p className="text-muted-foreground">Enter your credit card details</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="cardholderName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Credit Card Information</FormLabel>
                <FormControl>
                  <CreditCard
                    value={creditCard}
                    onChange={handleCreditCardChange}
                    onValidationChange={handleValidationChange}
                    cvvLabel="CVC"
                    cardStyle="shiny-silver"
                    showVendor={true}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  All fields are required. Your information is secure and
                  encrypted.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hidden fields to capture validation errors */}
          <div className="hidden">
            <FormField
              control={form.control}
              name="cardNumber"
              render={() => <FormMessage />}
            />
            <FormField
              control={form.control}
              name="expiryMonth"
              render={() => <FormMessage />}
            />
            <FormField
              control={form.control}
              name="expiryYear"
              render={() => <FormMessage />}
            />
            <FormField
              control={form.control}
              name="cvv"
              render={() => <FormMessage />}
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || !isCardValid}
            >
              {form.formState.isSubmitting
                ? 'Processing...'
                : 'Process Payment'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
