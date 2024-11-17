'use client'

import { ReactNode } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { OpenPanelComponent } from '@openpanel/nextjs'
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
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      <OpenPanelComponent
        clientId={process.env.NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID || ''}
        trackScreenViews={true}
        trackAttributes={true}
        trackOutgoingLinks={true}
      />
    </PostHogProvider>
  )
}

export default AllProviders
