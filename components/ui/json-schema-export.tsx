'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Download } from 'lucide-react'
import { toast } from 'sonner'
import { generateFormJsonSchema, downloadJsonSchema } from '@/lib/json-schema-generator'

interface JsonSchemaExportProps {
  formFields: any[]
  title?: string
  description?: string
}

export function JsonSchemaExport({ formFields, title = 'Form Schema', description = 'Generated JSON Schema' }: JsonSchemaExportProps) {
  const [jsonSchema, setJsonSchema] = useState<string>('')
  const [isGenerated, setIsGenerated] = useState(false)

  const generateSchema = () => {
    try {
      const schema = generateFormJsonSchema(formFields, { title, description })
      const schemaString = JSON.stringify(schema, null, 2)
      setJsonSchema(schemaString)
      setIsGenerated(true)
      toast.success('JSON Schema generated successfully!')
    } catch (error) {
      toast.error('Failed to generate JSON Schema')
      console.error('Schema generation error:', error)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonSchema)
      toast.success('JSON Schema copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const downloadSchema = () => {
    try {
      const schema = JSON.parse(jsonSchema)
      downloadJsonSchema(schema, `${title.toLowerCase().replace(/\s+/g, '-')}-schema.json`)
      toast.success('JSON Schema downloaded!')
    } catch (error) {
      toast.error('Failed to download schema')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>JSON Schema Export</CardTitle>
        <CardDescription>
          Generate and export a JSON Schema representation of your form
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={generateSchema} disabled={formFields.length === 0}>
            Generate JSON Schema
          </Button>
          {isGenerated && (
            <>
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" onClick={downloadSchema}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </div>
        
        {isGenerated && (
          <Textarea
            value={jsonSchema}
            readOnly
            className="min-h-[300px] font-mono text-sm"
            placeholder="Generated JSON Schema will appear here..."
          />
        )}
        
        {formFields.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add form fields to generate a JSON Schema
          </p>
        )}
      </CardContent>
    </Card>
  )
}
