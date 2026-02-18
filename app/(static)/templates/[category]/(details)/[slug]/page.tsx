import { notFound } from 'next/navigation'

import { templates } from '@/constants/templates'
import BetterAuth from '@/components/templates/better-auth'
import ClerkAuth from '@/components/templates/clerk-auth'
import Contact from '@/components/templates/contact'
import FirebaseAuth from '@/components/templates/firebase-auth'
import ForgotPassword from '@/components/templates/forgot-password'
import Newsletter from '@/components/templates/newsletter'
import ResetPassword from '@/components/templates/reset-password'
import ShadcnAuth from '@/components/templates/shadcn-auth'
import SignIn from '@/components/templates/sign-in'
import SignUp from '@/components/templates/sign-up'
import SupabaseAuth from '@/components/templates/supabase-auth'
import { TemplateBlockViewer } from '@/components/templates/template-block-viewer'

const templatePages = {
  'shadcn-auth': ShadcnAuth,
  'clerk-auth': ClerkAuth,
  'supabase-auth': SupabaseAuth,
  'firebase-auth': FirebaseAuth,
  'better-auth': BetterAuth,
  contact: Contact,
  newsletter: Newsletter,
}

const templateFeatures: Record<string, string[]> = {
  'shadcn-auth': [
    'Authentication starter for shadcn/ui only.',
    'Includes sign in, sign up, forgot password, and reset password flows in one provider page.',
    'No third-party auth provider dependencies.',
  ],
  'clerk-auth': [
    'Clerk Elements style auth provider template.',
    'Includes all core auth flows in one details page.',
    'Prepared for Clerk client/server handlers.',
  ],
  'supabase-auth': [
    'Supabase-ready auth provider template.',
    'Includes all core auth flows in one details page.',
    'Ready for Supabase auth action wiring.',
  ],
  'firebase-auth': [
    'Firebase auth provider template.',
    'Includes all core auth flows in one details page.',
    'Clear primary and secondary auth actions.',
  ],
  'better-auth': [
    'Composable Better Auth provider template.',
    'Includes all core auth flows in one details page.',
    'Prepared for server-action based auth.',
  ],
  contact: [
    'Contact flow with name, email, and message.',
    'Validation-ready for support or sales inboxes.',
    'Accessible labels and feedback states.',
  ],
  newsletter: [
    'Single-field email capture experience.',
    'High-conversion compact layout.',
    'Ready for newsletter provider integration.',
  ],
}

const templateCodeFiles: Record<
  string,
  Array<{ filename: string; label: string; path: string }>
> = {
  'shadcn-auth': [
    {
      filename: 'sign-in',
      label: 'sign-in.tsx',
      path: 'components/templates/sign-in.tsx',
    },
    {
      filename: 'sign-up',
      label: 'sign-up.tsx',
      path: 'components/templates/sign-up.tsx',
    },
    {
      filename: 'forgot-password',
      label: 'forgot-password.tsx',
      path: 'components/templates/forgot-password.tsx',
    },
    {
      filename: 'reset-password',
      label: 'reset-password.tsx',
      path: 'components/templates/reset-password.tsx',
    },
    {
      filename: 'base-auth-shell',
      label: 'base-auth-shell.tsx',
      path: 'components/templates/base-auth-shell.tsx',
    },
  ],
}

const templateInstallBlocks: Record<string, string> = {
  'shadcn-auth': 'login-05',
}

const shadcnFlowPages = {
  'sign-in': SignIn,
  'sign-up': SignUp,
  'forgot-password': ForgotPassword,
  'reset-password': ResetPassword,
} as const

type ShadcnFlow = keyof typeof shadcnFlowPages

function getShadcnFlow(flow?: string): ShadcnFlow {
  if (
    flow === 'sign-in' ||
    flow === 'sign-up' ||
    flow === 'forgot-password' ||
    flow === 'reset-password'
  ) {
    return flow
  }

  return 'sign-in'
}

interface TemplateDetailsPageProps {
  params: Promise<{ slug: string; category: string }>
  searchParams: Promise<{ flow?: string }>
}

export default async function Page({ params, searchParams }: TemplateDetailsPageProps) {
  const { slug, category } = await params
  const { flow } = await searchParams
  const PreviewComponent = templatePages[slug as keyof typeof templatePages]

  const categoryConfig = templates.find((template) =>
    template.path.endsWith(`/${category}`),
  )
  const isValidTemplateForCategory = categoryConfig?.sub.some(
    (entry) => entry.path === `/templates/${category}/${slug}`,
  )
  const templateConfig = categoryConfig?.sub.find(
    (entry) => entry.path === `/templates/${category}/${slug}`,
  )

  if (!PreviewComponent || !isValidTemplateForCategory || !templateConfig) {
    notFound()
  }

  const isShadcnAuthPage = slug === 'shadcn-auth'
  const activeFlow = getShadcnFlow(flow)
  const ActiveShadcnFlow = shadcnFlowPages[activeFlow]
  const ActivePreview = isShadcnAuthPage ? ActiveShadcnFlow : PreviewComponent

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-gradient-to-b from-background to-muted/30 p-4 md:p-6 space-y-4">
        <h1 className="text-2xl font-semibold">{templateConfig.title}</h1>
        <p className="text-sm text-muted-foreground">{templateConfig.description}</p>

        <div className="rounded-lg border bg-background/80 p-3">
          <p className="text-sm font-medium">How to use</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Use the left sidebar to pick the auth flow or switch templates.</li>
            <li>Use Preview and Code in the block toolbar to test and copy quickly.</li>
            <li>Use the install command to scaffold this block in your own app.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-4 md:p-5 space-y-6">
        <section>
          <TemplateBlockViewer
            slug={slug}
            description={templateConfig.description}
            codeFiles={templateCodeFiles[slug]}
            pnpmBlockName={templateInstallBlocks[slug]}
          >
            <ActivePreview />
          </TemplateBlockViewer>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Features</h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {(templateFeatures[slug] ?? []).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
