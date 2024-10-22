import { Link } from 'next-view-transitions'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import { LuGithub, LuMenu } from 'react-icons/lu'
import { FaXTwitter } from 'react-icons/fa6'

import Logo from '@/assets/logo.svg'
import { cn } from '@/lib/utils'
import If from '../ui/if'

type Tabs = {
  name: string
  href: string
  isNewTab?: boolean
  variant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'arrow'
    | null
    | undefined
  className?: string
  isUpdated?: boolean
}

const tabs: Tabs[] = [
  { name: 'Readme', href: '/readme', variant: 'link' },
  {
    name: 'Roadmap',
    href: 'https://shadcnform.featurebase.app/',
    variant: 'arrow',
    isNewTab: true,
  },
  { name: 'Templates', href: '/templates', variant: 'link' },
  {
    name: 'Playground',
    href: '/playground',
    variant: 'default',
    className: 'bg-primary text-white rounded-full px-2',
    isUpdated: false,
  },
]

export default function Header() {
  return (
    <header className="max-w-5xl mx-auto flex justify-between items-center my-5 px-5 lg:px-0">
      <Link href="/" className="cursor-pointer">
        <Logo />
      </Link>

      <nav className="hidden md:flex items-center gap-3">
        {tabs.map((tab, i) => (
          <Link
            href={tab.href}
            key={i}
            target={tab.isNewTab ? '_blank' : '_self'}
            className="relative"
          >
            <Button
              variant={tab.variant}
              className={cn('w-full px-1', tab?.className)}
            >
              {tab.name}
              <If
                condition={tab.isUpdated}
                render={() => (
                  <span className="w-2 h-2 bg-green-400 rounded-full absolute right-1.5 top-1.5 animate-pulse" />
                )}
              />
            </Button>
          </Link>
        ))}

        <Link
          href="https://github.com/hasanharman/form-builder"
          target="_blank"
        >
          <Button variant="outline" className="rounded-full p-2">
            <LuGithub className="text-lg" />
          </Button>
        </Link>
        <Link href="https://x.com/strad3r" target="_blank">
          <Button variant="outline" className="rounded-full p-2">
            <FaXTwitter className="text-lg" />
          </Button>
        </Link>
      </nav>

      <nav className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="rounded-full" size="icon">
              <LuMenu />
            </Button>
          </DrawerTrigger>

          <DrawerContent>
            <div className="mx-auto w-full max-w-sm flex flex-col gap-3">
              <DrawerFooter>
                <div className="flex justify-end space-x-2">
                  <Link
                    href="https://github.com/hasanharman/form-builder"
                    target="_blank"
                  >
                    <Button variant="outline" className="rounded-full p-2">
                      <LuGithub className="text-lg" />
                    </Button>
                  </Link>

                  <Link href="https://x.com/strad3r" target="_blank">
                    <Button variant="outline" className="rounded-full p-2">
                      <FaXTwitter className="text-lg" />
                    </Button>
                  </Link>
                </div>

                {tabs.map((tab) => (
                  <DrawerClose asChild key={tab.href}>
                    <Link href={tab.href}>
                      <Button
                        variant="secondary"
                        className={cn('w-full', tab?.className)}
                      >
                        {tab.name}
                      </Button>
                    </Link>
                  </DrawerClose>
                ))}

                <DrawerClose asChild>
                  <Button variant="outline" className="rounded-full">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </nav>
    </header>
  )
}
