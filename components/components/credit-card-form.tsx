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
import { CreditCard } from '@/components/ui/credit-card'

const FormSchema = z.object({
  creditCard: z.string().min(1, 'Credit card information is required').refine((value) => {
    try {
      const parsed = JSON.parse(value)
      const isValid = !!(
        parsed.cardholderName?.trim() && 
        parsed.cardNumber?.trim() && 
        parsed.expiryMonth?.trim() && 
        parsed.expiryYear?.trim() && 
        parsed.cvv?.trim()
      )
      return isValid
    } catch {
      return false
    }
  }, {
    message: 'Please fill in all credit card fields',
  })
})

type CreditCardFormData = z.infer<typeof FormSchema>

export function CreditCardForm() {
  const [creditCard, setCreditCard] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cvvLabel: 'CVC' as 'CVC' | 'CCV'
  })

  const form = useForm<CreditCardFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      creditCard: JSON.stringify(creditCard)
    }
  })

  const onSubmit = (data: CreditCardFormData) => {
    const parsedData = JSON.parse(data.creditCard)
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(parsedData, null, 2)}</code>
      </pre>,
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="creditCard"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div>
                <FormLabel>Payment Information</FormLabel>
              </div>
              <FormControl>
                <CreditCard
                  value={creditCard}
                  onChange={(value) => {
                    setCreditCard(value)
                    const jsonValue = JSON.stringify(value)
                    field.onChange(jsonValue)
                    form.trigger('creditCard')
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter your credit card information above
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Process Payment
        </Button>
      </form>
    </Form>
  )
}
