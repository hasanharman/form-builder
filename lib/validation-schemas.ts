import { z } from 'zod/v4'

export const emailSchema = z.string().email({ error: 'Invalid email address' })

export const passwordSchema = z
  .string()
  .min(6, { error: 'Password must be at least 6 characters long' })
  .regex(/[a-zA-Z0-9]/, { error: 'Password must be alphanumeric' })

export const nameSchema = z
  .string()
  .min(2, { error: 'Name must be at least 2 characters long' })

export const phoneSchema = z
  .string()
  .min(10, { error: 'Phone number must be valid' })

export const messageSchema = z
  .string()
  .min(10, { error: 'Message must be at least 10 characters long' })

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: messageSchema,
})

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const registerFormSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match',
  })

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match',
  })
