import { notFound } from 'next/navigation'
import { Link } from 'next-view-transitions'

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
import { CodeViewer } from '@/components/templates/code-viewer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import If from '@/components/ui/if'

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

const authProviderSlugs = new Set([
  'shadcn-auth',
  'clerk-auth',
  'supabase-auth',
  'firebase-auth',
  'better-auth',
])

const signInByProvider = {
  'shadcn-auth': SignIn,
  'clerk-auth': ClerkAuth,
  'supabase-auth': SupabaseAuth,
  'firebase-auth': FirebaseAuth,
  'better-auth': BetterAuth,
} as const

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

  const isAuthProviderPage = category === 'authentication' && authProviderSlugs.has(slug)
  const SignInPreview = isAuthProviderPage
    ? signInByProvider[slug as keyof typeof signInByProvider]
    : null
  const activeFlow =
    flow === 'sign-up' ||
    flow === 'forgot-password' ||
    flow === 'reset-password' ||
    flow === 'sign-in'
      ? flow
      : 'sign-in'

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-gradient-to-b from-background to-muted/30 p-4 md:p-6 space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/templates">Templates</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={categoryConfig?.path ?? `/templates/${category}`}>
                {categoryConfig?.title ?? category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{templateConfig.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-semibold">{templateConfig.title}</h1>
        <p className="text-sm text-muted-foreground">{templateConfig.description}</p>
        <ul className="list-disc text-sm text-muted-foreground pl-5">
          <If
            condition={
              slug === 'shadcn-auth' ||
              slug === 'clerk-auth' ||
              slug === 'supabase-auth' ||
              slug === 'firebase-auth' ||
              slug === 'better-auth'
            }
            render={() => (
              <li>
                <Link
                  href="https://gist.github.com/mjbalcueva/b21f39a8787e558d4c536bf68e267398"
                  target="_blank"
                  className="hover:underline"
                >
                  Password Input
                </Link>
              </li>
            )}
          />
        </ul>
      </div>

      <div className="rounded-xl border bg-background p-4 md:p-5 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{templateConfig.title}</h2>
          <p className="text-sm text-muted-foreground">{templateConfig.description}</p>
        </div>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Preview</h3>
          <Tabs defaultValue="preview">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-3">
              <div className="rounded-xl border bg-background p-4 md:p-6">
                {isAuthProviderPage && SignInPreview ? (
                  <Tabs defaultValue={activeFlow} className="space-y-4">
                    <TabsList className="grid w-fit grid-cols-4">
                      <TabsTrigger value="sign-in">Sign in</TabsTrigger>
                      <TabsTrigger value="sign-up">Sign up</TabsTrigger>
                      <TabsTrigger value="forgot-password">Forgot password</TabsTrigger>
                      <TabsTrigger value="reset-password">Reset password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sign-in">
                      <SignInPreview />
                    </TabsContent>
                    <TabsContent value="sign-up">
                      <SignUp />
                    </TabsContent>
                    <TabsContent value="forgot-password">
                      <ForgotPassword />
                    </TabsContent>
                    <TabsContent value="reset-password">
                      <ResetPassword />
                    </TabsContent>
                  </Tabs>
                ) : (
                  <PreviewComponent />
                )}
              </div>
            </TabsContent>
            <TabsContent value="code" className="mt-3">
              <div className="rounded-xl border bg-background p-4 md:p-6">
                <CodeViewer filename={slug} />
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Features</h3>
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
