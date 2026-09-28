'use client'

import SignatureInput from '@/components/ui/signature-input'
import { stringSchema } from './helpers'
import type { FieldVariant } from './types'

export const signatureInputVariant: FieldVariant = {
  name: 'Signature Input',
  defaults: { label: 'Sign here', description: 'Please provide your signature above' },
  registryItems: ['signature-input'],
  imports: () => ['import SignatureInput from "@/components/ui/signature-input"'],
  schema: (field) => stringSchema(field, 'Signature is required'),
  defaultValue: () => '',
  Control: ({ onChange }) => (
    <SignatureInput onSignatureChange={(signature) => onChange(signature ?? '')} />
  ),
  control: (_field, b) => `<SignatureInput
  onSignatureChange={(signature) => ${b.onChange('signature ?? ""')}}
/>`,
}
