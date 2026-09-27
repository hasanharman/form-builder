import type { ComponentType } from 'react'

import BetterAuth from '@/components/templates/better-auth'
import ClerkForgotPassword from '@/components/templates/clerk-forgot-password'
import ClerkResetPassword from '@/components/templates/clerk-reset-password'
import ClerkSignIn from '@/components/templates/clerk-sign-in'
import ClerkSignUp from '@/components/templates/clerk-sign-up'
import Contact from '@/components/templates/contact'
import FirebaseAuth from '@/components/templates/firebase-auth'
import ForgotPassword from '@/components/templates/forgot-password'
import Newsletter from '@/components/templates/newsletter'
import ResetPassword from '@/components/templates/reset-password'
import SignIn from '@/components/templates/sign-in'
import SignUp from '@/components/templates/sign-up'
import SupabaseAuth from '@/components/templates/supabase-auth'

type Preview = { page: ComponentType } | { flows: Record<string, ComponentType> }

/** What the site renders for each template block, per flow for multi-page ones. */
export const templatePreviews: Record<string, Preview> = {
  'shadcn-auth': {
    flows: {
      'sign-in': SignIn,
      'sign-up': SignUp,
      'forgot-password': ForgotPassword,
      'reset-password': ResetPassword,
    },
  },
  'clerk-auth': {
    flows: {
      'sign-in': ClerkSignIn,
      'sign-up': ClerkSignUp,
      'forgot-password': ClerkForgotPassword,
      'reset-password': ClerkResetPassword,
    },
  },
  'supabase-auth': { page: SupabaseAuth },
  'firebase-auth': { page: FirebaseAuth },
  'better-auth': { page: BetterAuth },
  contact: { page: Contact },
  newsletter: { page: Newsletter },
}

export function getTemplatePreview(name: string, flowId?: string): ComponentType | undefined {
  const preview = templatePreviews[name]
  if (!preview) return undefined
  if ('page' in preview) return preview.page
  return flowId ? preview.flows[flowId] : undefined
}
