'use client'

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
import SignaturePad from '@/components/ui/signature-pad'

const FormSchema = z.object({
  signature: z
    .string()
    .min(1, { message: 'Please sign the form' })
    .nullable()
    .refine((val) => val !== null && val.length > 0, {
      message: 'Please sign the form',
    }),
})

type SignaturePadFormData = z.infer<typeof FormSchema>

export function SignaturePadForm() {
  const form = useForm<SignaturePadFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      signature: null,
    },
  })

  const onSubmit = (data: SignaturePadFormData) => {
    // The signature is a base64 data URL that can be:
    // 1. Stored directly in a database as a string
    // 2. Converted to a Blob/File for upload to cloud storage
    // 3. Sent to an API endpoint
    
    // Example: Convert to Blob for file upload
    // const blob = await fetch(data.signature!).then(r => r.blob())
    // const file = new File([blob], 'signature.png', { type: 'image/png' })
    
    toast(
      <div className="space-y-2">
        <p className="font-medium">Signature captured!</p>
        <p className="text-sm text-muted-foreground">
          Data URL length: {data.signature?.length} characters
        </p>
        {data.signature && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.signature}
            alt="Captured signature"
            className="w-40 h-20 border rounded bg-white object-contain"
          />
        )}
      </div>,
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="signature"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Your Signature</FormLabel>
              <SignaturePad
                value={field.value}
                onChange={field.onChange}
                disabled={form.formState.isSubmitting}
              />
              <FormDescription>
                Click the pen button to open the signature pad. Draw your
                signature, then hold the confirm button to save.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  )
}
