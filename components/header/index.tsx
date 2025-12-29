'use client'

import { Link } from 'next-view-transitions'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import If from '@/components/ui/if'

import { LuGithub, LuMenu } from 'react-icons/lu'
import { FaXTwitter } from 'react-icons/fa6'
import { SiBuymeacoffee } from 'react-icons/si'

import Logo from '@/assets/logo.svg'
import { usePathname } from 'next/navigation'
import { ThemeSwitch } from '../ui/theme-switch'
import { Play } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { getSponsorsByTier } from '@/data/sponsors'
import { ShinyButton } from '../shiny-button'

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
    | 'smile'
    | 'linkHover2'
    | null
    | undefined
  className?: string
  isUpdated?: boolean
}

const tabs: Tabs[] = [
  { name: 'Hi', href: '/readme', variant: 'smile' },
  // {
  //   name: 'Roadmap',
  //   href: 'https://shadcnform.featurebase.app/',
  //   variant: 'arrow',
  //   isNewTab: true,
  // },
  { name: 'Components', href: '/components', variant: 'linkHover2' },
  { name: 'Templates', href: '/templates', variant: 'linkHover2' },
  { name: 'Sponsors', href: '/sponsors', variant: 'linkHover2' },
]

export default function Header() {
  const pathname = usePathname()
  const currentBasePath = '/' + pathname.split('/')[1]
  const headerSponsors = getSponsorsByTier('header')

  return (
    <header className="max-w-5xl mx-auto flex justify-between items-center my-5 px-5 lg:px-0">
      <Link
        href="/"
        className="cursor-pointer md:hidden dark:bg-white dark:rounded-lg p-2"
      >
        <Logo className="w-9 h-9" />
      </Link>
      <nav className="hidden md:flex items-center gap-3">
        <Link
          href="/"
          className="cursor-pointer dark:bg-white dark:rounded-lg p-1"
        >
          <Logo className="w-9 h-9" />
        </Link>
        {tabs.map((tab, i) => (
          <Link
            href={tab.href}
            key={i}
            target={tab.isNewTab ? '_blank' : '_self'}
            className="relative"
          >
            <Button
              variant={tab.variant}
              className={cn(
                'w-full px-1',
                tab?.className,
                currentBasePath !== tab.href && 'text-muted-foreground',
                currentBasePath === tab.href && 'text-primary',
              )}
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
      </nav>

      <div className="hidden md:flex items-center gap-3">
        {headerSponsors.map((sponsor) => (
          <>
            {/*
            <Link
              key={sponsor.id}
              href={sponsor.url || `https://github.com/${sponsor.name}`}
              className="flex items-center gap-2 rounded-full pl-1 pr-3 border h-9 hover:bg-accent transition-colors"
              target="_blank"
            >
              <Image
                src={sponsor.image}
                alt={sponsor.name}
                width={28}
                height={28}
                className="rounded-full bg-white dark:bg-white object-cover"
              />
              <div className="flex flex-col">
                <span className="text-xs font-medium leading-none">
                  {sponsor.name}
                </span>
                {sponsor.description && (
                  <span className="text-[10px] font-light text-muted-foreground leading-none mt-0.5">
                    {sponsor.description}
                  </span>
                )}
              </div>
            </Link>
            */}
            <ShinyButton
              key={sponsor.id}
              size="sm"
              // className="shrink-0 min-w-0 px-3"
              onClick={() =>
                window.open(
                  sponsor.url || `https://github.com/${sponsor.name}`,
                  '_blank',
                )
              }
            >
              {/* Inline avatar + title inside shiny button; no description */}
              <Avatar className="size-6">
                <AvatarImage src={sponsor.image} alt={sponsor.name} />
                <AvatarFallback className="text-[10px] font-medium">
                  {sponsor.name?.[0] ?? ''}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium leading-none truncate">
                {sponsor.name}
              </span>
            </ShinyButton>
          </>
        ))}
        <Link href="/playground">
          <Button size="icon" className="rounded-full p-2">
            <Play />
          </Button>
        </Link>
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
        {/* <Link href="https://buymeacoffee.com/hasanharman" target="_blank">
          <Button className="bg-yellow-400 text-black hover:text-white hover:dark:text-black  rounded-full p-2">
            <SiBuymeacoffee className="text-lg" />
          </Button>
        </Link> */}
        <ThemeSwitch />
      </div>

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
                  <Link
                    href="https://buymeacoffee.com/hasanharman"
                    target="_blank"
                  >
                    <Button className="bg-yellow-400 text-black hover:text-white  rounded-full p-2">
                      <SiBuymeacoffee className="text-lg" />
                    </Button>
                  </Link>
                  <ThemeSwitch />
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
                <Link href="/playground">
                  <Button className="w-full bg-primary  px-2">
                    Playground
                  </Button>
                </Link>
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
