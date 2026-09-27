import { z } from 'zod'

export interface JsonSchemaOptions {
  title?: string
  description?: string
  definitions?: Record<string, any>
}

export const generateJsonSchema = (
  zodSchema: z.ZodType,
  options: JsonSchemaOptions = {}
) => {
  const schema = z.toJSONSchema(zodSchema, {
    target: 'draft-7',
    unrepresentable: 'any',
    io: 'input',
    override: (ctx) => {
      if (ctx.zodSchema._zod.def.type === 'date') {
        ctx.jsonSchema.type = 'string'
        ctx.jsonSchema.format = 'date-time'
      }
    },
  }) as Record<string, any>
  const { $schema, ...body } = schema

  const jsonSchema: Record<string, any> = options.title
    ? {
        $ref: `#/definitions/${options.title}`,
        definitions: { ...options.definitions, [options.title]: body },
        $schema,
      }
    : { ...body, ...(options.definitions && { definitions: options.definitions }), $schema }

  if (options.description) {
    jsonSchema.description = options.description
  }

  return jsonSchema
}

export const generateFormJsonSchema = (
  formFields: any[],
  options: JsonSchemaOptions = {}
) => {
  const schemaObject: Record<string, z.ZodType> = {}
  
  formFields.forEach((field) => {
    if (field.variant === 'Label') return
    
    let fieldSchema: z.ZodType = z.string()
    
    switch (field.variant) {
      case 'Checkbox':
        fieldSchema = z.boolean()
        break
      case 'Date Picker':
        fieldSchema = z.union([z.string(), z.date()])
        break
      case 'Input':
        if (field.type === 'email') {
          fieldSchema = z.string().email()
        } else if (field.type === 'number') {
          fieldSchema = z.coerce.number()
        } else {
          fieldSchema = z.string()
        }
        break
      case 'Number':
        fieldSchema = z.coerce.number()
        break
      case 'Switch':
        fieldSchema = z.boolean()
        break
      case 'Tags Input':
      case 'Multi Select':
        fieldSchema = z.array(z.string()).min(1)
        break
      default:
        fieldSchema = z.string()
    }
    
    if (field.required !== true) {
      fieldSchema = fieldSchema.optional()
    }
    
    schemaObject[field.name] = fieldSchema
  })
  
  const zodSchema = z.object(schemaObject)
  return generateJsonSchema(zodSchema, options)
}

export const downloadJsonSchema = (jsonSchema: any, filename: string = 'form-schema.json') => {
  const blob = new Blob([JSON.stringify(jsonSchema, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
