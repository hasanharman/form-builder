import { notFound } from 'next/navigation'
import { Link } from 'next-view-transitions'

import { templates } from '@/constants/templates'
import Contact from '@/components/templates/contact'
import ForgotPassword from '@/components/templates/forgot-password'
import Login from '@/components/templates/login'
import Newsletter from '@/components/templates/newsletter'
import Register from '@/components/templates/register'
import ResetPassword from '@/components/templates/reset-password'
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
  login: Login,
  register: Register,
  'forgot-password': ForgotPassword,
  'reset-password': ResetPassword,
  contact: Contact,
  newsletter: Newsletter,
}

interface TemplateDetailsPageProps {
  params: Promise<{ slug: string; category: string }>
}

export default async function Page({ params }: TemplateDetailsPageProps) {
  const { slug, category } = await params
  const PreviewComponent = templatePages[slug as keyof typeof templatePages]

  const categoryConfig = templates.find((template) =>
    template.path.endsWith(`/${category}`),
  )
  const isValidTemplateForCategory = categoryConfig?.sub.some(
    (entry) => entry.path === `/templates/${category}/${slug}`,
  )

  if (!PreviewComponent || !isValidTemplateForCategory) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/templates">Templates</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={categoryConfig?.path ?? `/templates/${category}`}
                className="capitalize"
              >
                {category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {slug.replace(/-/g, ' ')} Form
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-xl font-semibold capitalize">
          {slug.replace(/-/g, ' ')} Form
        </h1>
        <p className="text-sm text-muted-foreground">
          This form includes special component, add the component in your
          directory.
        </p>
        <ul className="list-disc text-sm text-muted-foreground pl-3">
          <If
            condition={
              slug === 'login' ||
              slug === 'register' ||
              slug === 'forgot-password' ||
              slug === 'reset-password'
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
          <If
            condition={slug === 'register' || slug === 'contact'}
            render={() => (
              <li>
                <Link
                  href="https://shadcn-phone-input.vercel.app/"
                  target="_blank"
                  className="hover:underline"
                >
                  Phone Input
                </Link>
              </li>
            )}
          />
        </ul>
      </div>
      <Tabs defaultValue="preview">
        <TabsList className="flex justify-center w-fit mx-auto">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <PreviewComponent />
        </TabsContent>
        <TabsContent value="code">
          <CodeViewer filename={slug} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
