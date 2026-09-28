'use client'

import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'

import { loginFormSchema } from '@/lib/validation-schemas'

const formSchema = loginFormSchema

export default function BetterAuthPreview() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)
      toast.success(
        'Better Auth-ready form submitted successfully. (Simulated)',
      )
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }

  return (
    <div className="flex min-h-[50vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="inline-flex w-fit rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
            Better Auth ready
          </div>
          <CardTitle className="text-2xl mt-2">Sign in</CardTitle>
          <CardDescription>
            Composable auth layout prepared for Better Auth server actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">
              <Field
                className="grid gap-2"
                data-invalid={!!form.formState.errors.email}
              >
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  placeholder="hello@company.com"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register('email')}
                />
                <FieldError errors={[form.formState.errors.email]} />
              </Field>
              <Field
                className="grid gap-2"
                data-invalid={!!form.formState.errors.password}
              >
                <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link href="#" className="text-sm underline">
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="******"
                  autoComplete="current-password"
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register('password')}
                />
                <FieldError errors={[form.formState.errors.password]} />
              </Field>
              <Button type="submit" className="w-full">
                Continue
              </Button>
              <Button variant="outline" className="w-full">
                Continue with GitHub
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
