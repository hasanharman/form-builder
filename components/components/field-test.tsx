import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import Code from '@/components/code'
import { FieldTestServerActions } from '@/components/components/field-test-server-actions'
import { FieldTestReactHookForm } from '@/components/components/field-test-react-hook-form'
import { FieldTestTanStackForm } from '@/components/components/field-test-tanstack-form'
import { FieldTestBringYourOwn } from '@/components/components/field-test-bring-your-own'

import serverActionsCode from '@/components/components/field-test-server-actions?raw'
import reactHookFormCode from '@/components/components/field-test-react-hook-form?raw'
import tanstackFormCode from '@/components/components/field-test-tanstack-form?raw'
import bringYourOwnCode from '@/components/components/field-test-bring-your-own?raw'

const installationCode = `npx shadcn@latest add field`

const basicUsageCode = `import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"

<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" />
  <FieldDescription>We'll never share your email.</FieldDescription>
  <FieldError>Please enter a valid email.</FieldError>
</Field>`

const inputExampleCode = `<Field>
  <FieldLabel htmlFor="username">Username</FieldLabel>
  <Input id="username" type="text" placeholder="Max Leiter" />
  <FieldDescription>Choose a unique username for your account.</FieldDescription>
</Field>

<Field>
  <FieldLabel htmlFor="password">Password</FieldLabel>
  <FieldDescription>Must be at least 8 characters long.</FieldDescription>
  <Input id="password" type="password" placeholder="********" />
</Field>`

const textareaExampleCode = `<Field>
  <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
  <Textarea id="feedback" placeholder="Your feedback helps us improve..." />
  <FieldDescription>Share your thoughts about our service.</FieldDescription>
</Field>`

export default function Component() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Field Component Test</h1>
        <p className="text-md text-muted-foreground">
          Comprehensive testing page for the Field component showing basic usage and integration 
          with all supported form libraries: Server Actions, React Hook Form, TanStack Form, and Bring Your Own Form.
        </p>
      </div>

      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Installation</h1>
        <Code code={installationCode} />
      </div>

      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Basic Usage</h1>
        <p className="text-muted-foreground">
          The Field component provides a flexible, library-agnostic foundation for building forms.
          It works without any form library and can be easily integrated with your preferred solution.
        </p>
        <Code code={basicUsageCode} />
      </div>

      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Basic Field Examples</h1>
        <p className="text-muted-foreground">
          Examples from shadcn Field documentation showing various input types without form libraries.
        </p>
        
        <h3 className="text-lg font-semibold">Input</h3>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <Card className="p-6">
              <fieldset className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">Username</label>
                  <input 
                    id="username" 
                    type="text" 
                    placeholder="Max Leiter"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-sm text-muted-foreground">Choose a unique username for your account.</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <p className="text-sm text-muted-foreground">Must be at least 8 characters long.</p>
                  <input 
                    id="password" 
                    type="password" 
                    placeholder="********"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </fieldset>
            </Card>
          </TabsContent>
          <TabsContent value="code">
            <Card>
              <Code code={inputExampleCode} />
            </Card>
          </TabsContent>
        </Tabs>

        <h3 className="text-lg font-semibold">Textarea</h3>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <Card className="p-6">
              <div className="space-y-2">
                <label htmlFor="feedback" className="text-sm font-medium">Feedback</label>
                <textarea 
                  id="feedback" 
                  placeholder="Your feedback helps us improve..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-sm text-muted-foreground">Share your thoughts about our service.</p>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="code">
            <Card>
              <Code code={textareaExampleCode} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Form Library Integration Examples</h1>
        <p className="text-muted-foreground">
          Complete form examples showing Field component integration with different form libraries.
        </p>

        <h3 className="text-lg font-semibold">Server Actions</h3>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <Card className="flex justify-center items-center min-h-[600px] p-6">
              <FieldTestServerActions />
            </Card>
          </TabsContent>
          <TabsContent value="code">
            <Card>
              <Code code={serverActionsCode} customStyle="h-[500px]" />
            </Card>
          </TabsContent>
        </Tabs>

        <h3 className="text-lg font-semibold">React Hook Form</h3>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <Card className="flex justify-center items-center min-h-[600px] p-6">
              <FieldTestReactHookForm />
            </Card>
          </TabsContent>
          <TabsContent value="code">
            <Card>
              <Code code={reactHookFormCode} customStyle="h-[500px]" />
            </Card>
          </TabsContent>
        </Tabs>

        <h3 className="text-lg font-semibold">TanStack Form</h3>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <Card className="flex justify-center items-center min-h-[600px] p-6">
              <FieldTestTanStackForm />
            </Card>
          </TabsContent>
          <TabsContent value="code">
            <Card>
              <Code code={tanstackFormCode} customStyle="h-[500px]" />
            </Card>
          </TabsContent>
        </Tabs>

        <h3 className="text-lg font-semibold">Bring Your Own Form</h3>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <Card className="flex justify-center items-center min-h-[600px] p-6">
              <FieldTestBringYourOwn />
            </Card>
          </TabsContent>
          <TabsContent value="code">
            <Card>
              <Code code={bringYourOwnCode} customStyle="h-[500px]" />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
