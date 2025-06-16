// components/editor/schema.ts
import { z } from 'zod'

export const editorFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  content: z.array(z.any()).min(1, {
    message: 'Content cannot be empty.',
  }),
  description: z.string().optional(),
})

export type EditorFormValues = z.infer<typeof editorFormSchema>
