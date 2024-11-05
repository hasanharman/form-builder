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
import SignatureInput from '@/components/ui/signature-input'

const FormSchema = z.object({
  signature: z.string().min(1, 'Please sign the form'),
})

type SignatureFormData = z.infer<typeof FormSchema>

export function SignatureForm() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const form = useForm<SignatureFormData>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = (data: SignatureFormData) => {
    // console.log('Signature Data URL:', data.signature)
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
          name="signature"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div>
                <FormLabel>Sign here</FormLabel>
              </div>
              <SignatureInput
                canvasRef={canvasRef}
                onSignatureChange={field.onChange}
              />
              <FormDescription>
                Please provide your signature above
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
