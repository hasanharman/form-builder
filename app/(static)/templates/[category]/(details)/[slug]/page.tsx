'use client'
import dynamic from 'next/dynamic'
import { Link } from 'next-view-transitions'

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
import { useSidebar } from '@/components/ui/sidebar' // Check this import

export default function Page({
  params,
}: {
  params: { slug: string; category: string }
}) {
  const pathname = params.slug
  const category = params.category

  const { toggleSidebar } = useSidebar()

  // Dynamically import the preview component
  const PreviewComponent = dynamic(
    () => import(`@/components/templates/${pathname}`),
    {
      loading: () => <p>Loading preview...</p>,
      // Handle import errors gracefully
      ssr: true,
    },
  )

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => toggleSidebar()}
                className="cursor-pointer"
              >
                Templates
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => toggleSidebar()}
                className="capitalize cursor-pointer"
              >
                {category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {pathname.replace(/-/g, ' ')} Form
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-xl font-semibold capitalize">
          {pathname.replace(/-/g, ' ')} Form
        </h1>
        <p className="text-sm text-muted-foreground">
          This form includes special component, add the component in your
          directory. {''}
        </p>
        <ul className="list-disc text-sm text-muted-foreground pl-3">
          <If
            condition={
              pathname === 'login' ||
              pathname === 'register' ||
              pathname === 'forgot-password' ||
              pathname === 'reset-password'
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
            condition={pathname === 'register' || pathname === 'contact'}
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
      <Tabs defaultValue="preview" className="">
        <TabsList className="flex justify-center w-fit mx-auto">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <PreviewComponent />
        </TabsContent>
        <TabsContent value="code">
          <CodeViewer filename={pathname} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
