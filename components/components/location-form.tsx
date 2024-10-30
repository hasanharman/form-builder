'use client'

import { useState } from 'react'
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
import LocationSelector from '@/components/ui/location-input'

const FormSchema = z.object({
  location: z.tuple([
    z.string({
      required_error: 'Country is required',
    }),
    z.string().optional(), // State name, optional
  ]),
})

export function LocationForm() {
  const [countryName, setCountryName] = useState<string>('')
  const [stateName, setStateName] = useState<string>('')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div>
                <FormLabel>Country Selector</FormLabel>
              </div>
              <LocationSelector
                onCountryChange={(country) => {
                  setCountryName(country?.name || '')
                  form.setValue(field.name, [
                    country?.name || '',
                    stateName || '',
                  ])
                }}
                onStateChange={(state) => {
                  setStateName(state?.name || '')
                  form.setValue(field.name, [
                    countryName || '',
                    state?.name || '',
                  ])
                }}
              />
              <FormDescription>
                Please select state after selecting your country
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
