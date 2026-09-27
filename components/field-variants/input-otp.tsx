'use client'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { zx } from './schema-expr'
import type { FieldVariant } from './types'

export const inputOtpVariant: FieldVariant = {
  name: 'Input OTP',
  defaults: {
    label: 'One-Time Password',
    description: 'Please enter the one-time password sent to your phone.',
  },
  registryItems: ['input-otp'],
  imports: () => [
    'import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"',
  ],
  schema: (field) =>
    field.required
      ? zx.string().length(6, { message: 'Enter all 6 digits' })
      : zx.string().length(6, { message: 'Enter all 6 digits' }).or(zx.literal('')),
  defaultValue: () => '',
  Control: ({ field, id, value, onChange, onBlur }) => (
    <InputOTP id={id} maxLength={6} value={value ?? ''} onChange={onChange} onBlur={onBlur} disabled={field.disabled}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
  control: (field, b) => `<InputOTP
  id={${b.id}}
  maxLength={6}${field.disabled ? '\n  disabled' : ''}
  value={${b.value}}
  onChange={(value) => ${b.onChange('value')}}
  onBlur={${b.onBlur}}
>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
}
