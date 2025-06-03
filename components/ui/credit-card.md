# Credit Card Component

A beautiful, interactive credit card component with flip animation and real-time validation.

## Usage

```tsx
import { CreditCard } from '@/components/ui/credit-card'

function PaymentForm() {
  const [creditCard, setCreditCard] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cvvLabel: 'CVC' as const
  })

  return (
    <CreditCard
      value={creditCard}
      onChange={setCreditCard}
    />
  )
}
```

## Features

- Visual credit card design with chip and icons
- Card flip animation for CVC/CVV entry
- Real-time card number formatting
- Selectable CVC/CCV labels
- Mobile responsive design
- International format support
- TypeScript support

## Installation

```bash
npx shadcn-ui@latest add credit-card
```

## Dependencies

- framer-motion
- lucide-react
- @/components/ui/card
- @/components/ui/input
- @/components/ui/select

## Props

### CreditCardValue

```tsx
interface CreditCardValue {
  cardholderName: string
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cvvLabel: 'CCV' | 'CVC'
}
```

### CreditCardProps

```tsx
interface CreditCardProps {
  value?: CreditCardValue
  onChange?: (value: CreditCardValue) => void
  className?: string
}
```

## Examples

### Basic Usage

```tsx
import { useState } from 'react'
import { CreditCard } from '@/components/ui/credit-card'

export default function PaymentPage() {
  const [cardData, setCardData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cvvLabel: 'CVC' as const
  })

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
      <CreditCard
        value={cardData}
        onChange={setCardData}
      />
    </div>
  )
}
```

### With Form Validation

```tsx
import { useState } from 'react'
import { CreditCard } from '@/components/ui/credit-card'
import { Button } from '@/components/ui/button'

export default function CheckoutForm() {
  const [cardData, setCardData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cvvLabel: 'CVC' as const
  })

  const isValid = cardData.cardholderName.trim() && 
                  cardData.cardNumber.trim() && 
                  cardData.expiryMonth.trim() && 
                  cardData.expiryYear.trim() && 
                  cardData.cvv.trim()

  const handleSubmit = () => {
    if (isValid) {
      console.log('Processing payment...', cardData)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <CreditCard
        value={cardData}
        onChange={setCardData}
      />
      <Button 
        onClick={handleSubmit} 
        disabled={!isValid}
        className="w-full"
      >
        Process Payment
      </Button>
    </div>
  )
}
```
