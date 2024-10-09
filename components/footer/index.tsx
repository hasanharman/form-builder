import { Link } from 'next-view-transitions'

import { LuGithub, LuMail } from 'react-icons/lu'
import { FaXTwitter } from 'react-icons/fa6'

import Logo from '@/assets/logo.svg'

interface Icon {
  icon: JSX.Element
  url: string
}

const icons: Icon[] = [
  { icon: <LuGithub />, url: 'https://github.com/hasanharman/form-builder' },
  { icon: <FaXTwitter />, url: 'https://x.com/strad3r' },
  { icon: <LuMail />, url: 'mailto:hasanharman33@gmail.com' },
]

type Link = {
  text: string
  url: string
}

const links: Link[] = [
  { text: 'Readme', url: '/readme' },
  { text: 'Features', url: 'https://shadcnform.featurebase.app/' },
  { text: 'Playground', url: '/playground' },
]

export function Footer() {
  return (
    <footer className="max-w-5xl mx-auto flex flex-col gap-y-3 pt-10 pb-5 px-5 lg:px-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Link href="/" className="cursor-pointer">
            <Logo />
          </Link>
          <h2 className="font-semibold text-neutral-900 dark:text-white">
            Shadcn Form Builder
          </h2>
        </div>

        <div className="flex gap-x-2">
          {icons.map((icon, index) => (
            <a
              key={index}
              href={icon.url}
              className="flex h-5 w-5 items-center justify-center text-neutral-400 transition-all duration-100 ease-linear hover:text-neutral-900 hover:underline hover:underline-offset-4 dark:font-medium dark:text-neutral-500 hover:dark:text-neutral-100"
            >
              {icon.icon}
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between gap-y-5 md:flex-row md:items-center">
        <ul className="flex flex-col gap-x-5 gap-y-2 text-neutral-500 md:flex-row md:items-center ">
          {links.map((link, index) => (
            <li
              key={index}
              className="text-[15px]/normal font-medium text-neutral-400 transition-all duration-100 ease-linear hover:text-neutral-900 hover:underline hover:underline-offset-4 dark:font-medium dark:text-neutral-400 hover:dark:text-neutral-100"
            >
              <a href={link.url}>{link.text}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between text-sm font-medium tracking-tight text-neutral-500 dark:text-neutral-400">
          <p>All right reserverd.</p>
        </div>
      </div>
    </footer>
  )
}
