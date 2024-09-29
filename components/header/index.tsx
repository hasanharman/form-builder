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

export default function Header() {
  return (
    <header className="max-w-5xl mx-auto flex justify-between items-center my-5">
      <Link href="/" className="cursor-pointer">
        <Logo />
      </Link>
      <nav className="hidden md:flex items-center gap-3">
        <Link href="/readme">
          <Button variant="link">Readme</Button>
        </Link>
        <Link href="/roadmap">
          <Button variant="link">Roadmap</Button>
        </Link>
        <Link href="/playground">
          <Button className="rounded-full">Open Playground</Button>
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
                    <Button variant="outline" className="rounded-full p-2 ">
                      <LuGithub className="text-lg" />
                    </Button>
                  </Link>
                  <Link href="https://x.com/strad3r" target="_blank">
                    <Button variant="outline" className="rounded-full p-2">
                      <FaXTwitter className="text-lg" />
                    </Button>
                  </Link>
                </div>
                <Link href="/readme">
                  <Button variant="secondary" className="w-full">
                    Readme
                  </Button>
                </Link>
                <Link href="/roadmap">
                  <Button variant="secondary" className="w-full">
                    Roadmap
                  </Button>
                </Link>

                <Link href="/playground">
                  <Button className="rounded-full w-full">
                    Open Playground
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
