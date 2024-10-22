import dynamic from 'next/dynamic'
import { Link } from 'next-view-transitions'

import { CodeViewer } from '@/components/templates/code-viewer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import If from '@/components/ui/if'

export default function Page({ params }: { params: { slug: string } }) {
  const pathname = params.slug

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
