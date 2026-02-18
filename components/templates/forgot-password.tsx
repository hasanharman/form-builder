'use client'

import { Link } from 'next-view-transitions'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { BaseAuthShell } from '@/components/templates/base-auth-shell'

export default function ForgotPasswordPreview() {
  return (
    <BaseAuthShell
      title="Forgot password"
      description="Enter your email and we will send you a reset link."
      footer={
        <>
          Remembered your password? <Link href="/templates/authentication/sign-in">Back to sign in</Link>
        </>
      }
    >
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="forgot-password-email">Email</FieldLabel>
            <Input id="forgot-password-email" type="email" placeholder="m@example.com" required />
          </Field>
          <Field>
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </Field>
          <FieldDescription className="text-center">
            Need a new account? <Link href="/templates/authentication/sign-up">Create account</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </BaseAuthShell>
  )
}
