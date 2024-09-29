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

type Tabs = {
  name: string
  href: string
  className?: string
}

const tabs: Tabs[] = [
  { name: 'Readme', href: '/readme' },
  { name: 'Roadmap', href: '/roadmap' },
  { name: 'Open Playground', href: '/playground', className: 'bg-primary text-white rounded-full shadow' },
]

export default function Header() {
  return (
    <header className="max-w-5xl mx-auto flex justify-between items-center my-5">
      <Link href="/" className="cursor-pointer">
        <Logo />
      </Link>

      <nav className="hidden md:flex items-center gap-3">
        {tabs.map((tab, i) => (
          <Link href={tab.href} key={i}>
            <Button variant="link" className={(cn('w-full', tab?.className))}>{tab.name}</Button>
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
                      <Button variant="secondary" className={(cn('w-full', tab?.className))}>
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
