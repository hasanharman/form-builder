'use client'

import * as React from 'react'

import { CreditCard, CreditCardValue } from '@/components/ui/credit-card'
import { ComponentDocShell } from '@/components/components/component-doc-shell'

const previewCode = `<CreditCard value={creditCard} onChange={setCreditCard} />`

const usageCode = `import * as React from 'react'
import { CreditCard } from '@/components/ui/credit-card'

const [creditCard, setCreditCard] = React.useState({
  cardholderName: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
})

<CreditCard value={creditCard} onChange={setCreditCard} />`

export default function CreditCardPreview() {
  const [creditCard, setCreditCard] = React.useState<CreditCardValue>({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  })

  return (
    <ComponentDocShell
      title="Credit Card"
      slug="credit-card"
      description="Interactive credit-card form with visual card preview and validations."
      preview={<CreditCard value={creditCard} onChange={setCreditCard} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Card number formatting and type detection.',
        'Animated card preview with front/back transitions.',
        'Validation hooks for expiry and CVV.',
      ]}
      dependencies={['framer-motion']}
    />
  )
}
