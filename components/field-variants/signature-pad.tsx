'use client'

import SignaturePad from '@/components/ui/signature-pad'
import { stringSchema } from './helpers'
import type { FieldVariant } from './types'

export const signaturePadVariant: FieldVariant = {
  name: 'Signature Pad',
  isNew: true,
  defaults: { label: 'Your Signature', description: 'Click the pen button to sign' },
  registryItems: ['signature-pad'],
  imports: () => ['import SignaturePad from "@/components/ui/signature-pad"'],
  schema: (field) => stringSchema(field, 'Signature is required'),
  defaultValue: () => '',
  Control: ({ value, onChange }) => (
    <SignaturePad value={value || null} onChange={(signature) => onChange(signature ?? '')} />
  ),
  control: (_field, b) => `<SignaturePad
  value={${b.value} || null}
  onChange={(signature) => ${b.onChange('signature ?? ""')}}
/>`,
}
