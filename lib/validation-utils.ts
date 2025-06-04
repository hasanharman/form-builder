import { z } from 'zod'

export const createFormSchema = (fields: Record<string, z.ZodTypeAny>) => {
  return z.object(fields)
}

export const addOptionalField = (schema: z.ZodTypeAny) => {
  return schema.optional()
}

export const addDefaultValue = (schema: z.ZodTypeAny, defaultValue: any) => {
  return schema.default(defaultValue)
}

export const createArraySchema = (elementSchema: z.ZodTypeAny, minItems: number = 1) => {
  return z.array(elementSchema).min(minItems, { message: `Please select at least ${minItems} item${minItems > 1 ? 's' : ''}` })
}

export const createUnionSchema = (schemas: z.ZodTypeAny[]) => {
  return z.union(schemas as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]])
}

export const createRefineSchema = (
  schema: z.ZodTypeAny,
  refineFn: (data: any) => boolean,
  errorMessage: string
) => {
  return schema.refine(refineFn, { message: errorMessage })
}
