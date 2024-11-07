'use client'

import { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Autocomplete from '@/components/ui/autocomplete'

const FormSchema = z.object({
  framework: z.string().min(1, 'Please select a framework'),
})

type AutocompleteFormData = z.infer<typeof FormSchema>

export function AutocompleteForm() {
  const form = useForm<AutocompleteFormData>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = (data: AutocompleteFormData) => {
    console.log('HEY', data)
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="framework"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div>
                <FormLabel>What is your favorite framework?</FormLabel>
              </div>
              <Autocomplete value={field.value} onChange={field.onChange} />
              <FormDescription>
                Please type and select your favorite framework?
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
