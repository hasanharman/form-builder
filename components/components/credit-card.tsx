import React, { useState } from 'react'
import { Link } from 'next-view-transitions'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import Code from '@/components/code'

import { CreditCard, CreditCardValue } from '@/registry/ui/credit-card'
import { CreditCardForm } from '@/components/components/credit-card-form'

import installationManual from '@/components/ui/credit-card?raw'
import formCode from '@/components/components/credit-card-form?raw'

const code = `<CreditCard
  value={creditCard}
  onChange={setCreditCard}
/>`

const installationCode = `npx shadcn@latest add https://www.shadcn-form.com/registry/credit-card.json`

const usageCode1 = `'use client'

import { CreditCard } from '@/components/ui/credit-card'`

const usageCode2 = `const [creditCard, setCreditCard] = useState({
  cardholderName: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  cvvLabel: 'CVC' as const
})

<CreditCard
  value={creditCard}
  onChange={setCreditCard}
/>`

export default function Component() {
  const [creditCard, setCreditCard] = useState<CreditCardValue>({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cvvLabel: 'CVC'
  })

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Credit Card</h1>
        <p className="text-md text-muted-foreground">
          A beautiful, interactive credit card component with flip animation and real-time validation.
          Features visual credit card design with chip and icons, card flip animation for CVC/CVV entry,
          real-time card number formatting, selectable CVC/CCV labels, mobile responsive design,
          and international format support.
        </p>
      </div>

      <Tabs defaultValue="preview">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="Code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <Card className="flex justify-center items-center h-[600px] p-6">
            <CreditCard
              value={creditCard}
              onChange={setCreditCard}
            />
          </Card>
        </TabsContent>
        <TabsContent value="Code">
          <Card>
            <Code code={code} />
          </Card>
        </TabsContent>
      </Tabs>

      <div className="space-y-3">
        <h5 className="font-semibold">Features</h5>
        <ul className="list-disc pl-3 text-muted-foreground">
          <li>
            Visual Credit Card Design: Beautiful card design that resembles a real credit card
            with chip, card number display, and proper layout.
          </li>
          <li>
            Flip Animation: Smooth 3D card flip animation using Framer Motion when focusing
            on CVC field to simulate flipping a physical card.
          </li>
          <li>
            Real-time Updates: Card visual updates instantly as user types with automatic
            card number formatting (spaces added automatically).
          </li>
          <li>
            International Support: Supports various card formats and validation rules,
            adjustable to accommodate different requirements.
          </li>
          <li>
            Mobile Responsive: Component adapts well to different screen sizes ensuring
            a good user experience on smaller screens.
          </li>
        </ul>
        <h5 className="font-semibold">Props</h5>
        <ul className="list-disc pl-3 text-muted-foreground">
          <li>value (optional): CreditCardValue object containing all card field values.</li>
          <li>
            onChange (optional): Callback function that receives the updated card data
            when any field changes.
          </li>
          <li>className (optional): Additional CSS classes for styling customization.</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Installation</h1>
        <Tabs defaultValue="cli">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="cli">CLI</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="cli">
            <Code code={installationCode} />
          </TabsContent>
          <TabsContent value="manual">
            <div className="p-6 sm:p-10">
              <div className="after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 relative pl-5  after:left-0 grid gap-10 dark:after:bg-gray-400/20">
                <div className="grid gap-1 text-sm relative">
                  <div className="flex justify-center items-center aspect-square w-6 h-6 bg-gray-200 rounded-full absolute left-0 translate-x-[-31.5px] z-10 top-0 dark:bg-gray-50">
                    1
                  </div>
                  <div className="text-lg font-bold">
                    Copy and paste the following code into your project.
                  </div>

                  <Code code={installationManual} customStyle="h-[300px]" />
                </div>
                <div className="grid gap-1 text-sm relative">
                  <div className="flex justify-center items-center aspect-square w-6 h-6 bg-gray-200 rounded-full absolute left-0 translate-x-[-31.5px] z-10 top-1 dark:bg-gray-50">
                    2
                  </div>
                  <div className="text-lg font-bold">
                    Update the import paths to match your project setup.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <p className="text-muted-foreground">
          This component requires Framer Motion for animations. Make sure to install it:
        </p>
        <Code code="npm install framer-motion" />
      </div>

      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Usage</h1>
        <Code code={usageCode1} />
        <Code code={usageCode2} />
      </div>

      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Form</h1>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="Code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <Card className="flex justify-center items-center h-[700px] p-6">
              <CreditCardForm />
            </Card>
          </TabsContent>
          <TabsContent value="Code">
            <Card>
              <Code code={formCode} customStyle="h-[500px]" />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
