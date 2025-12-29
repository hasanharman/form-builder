'use client'

import { ReactNode } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from './theme-provider'
const AllProviders = ({ children }: { children: ReactNode }) => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })
  }

  return (
    <PostHogProvider client={posthog}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <Analytics />
    </PostHogProvider>
  )
}

export default AllProviders
