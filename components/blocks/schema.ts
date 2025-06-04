// components/editor/schema.ts
import { z } from 'zod/v4'

export const editorFormSchema = z.object({
  title: z.string().min(2, {
    error: 'Title must be at least 2 characters.',
  }),
  content: z.array(z.any()).min(1, {
    error: 'Content cannot be empty.',
  }),
  description: z.string().optional(),
})

export type EditorFormValues = z.infer<typeof editorFormSchema>
