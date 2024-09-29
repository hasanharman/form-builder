import { Link } from 'next-view-transitions'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@radix-ui/react-separator'

interface UserLinkProps {
  href: string
  avatarSrc: string
  name: string
  xLink: string
}

const UserLink = ({ href, avatarSrc, name, xLink }: UserLinkProps) => {
  return (
    <div className="flex items-center gap-1 border rounded-lg px-2 py-1">
      <Link href={href} target="_blank" className="hover:underline">
        {name}
      </Link>
      <Separator />
      <Link href={xLink} target="_blank">
        <Avatar className="w-7 h-7">
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>
    </div>
  )
}

const resourcesList = [
  {
    href: 'https://ui.shadcn.com/',
    avatarSrc: 'https://github.com/shadcn.png',
    name: 'shadcn',
    xLink: 'https://x.com/shadcn',
  },
  {
    href: 'https://shadcn-extension.vercel.app/',
    avatarSrc:
      'https://pbs.twimg.com/profile_images/1574177524254384129/nMQ3eP2n_400x400.jpg',
    name: 'Bylka',
    xLink: 'https://x.com/BylkaYf',
  },
  {
    href: 'https://shadcn-phone-input.vercel.app/',
    avatarSrc: 'https://github.com/omeralpi.png',
    name: 'omeralpi',
    xLink: 'https://github.com/omeralpi/shadcn-phone-input',
  },
]

export default function ReadmePage() {
  return (
    <section className="max-w-5xl mx-auto  space-y-8 my-8">
      <div className="space-y-4 ">
        <h1 className="text-3xl font-bold">Introduction</h1>
        <p className="text-muted-foreground">
          As a developer, I’ve grown tired of repeatedly creating forms
          throughout my career. Thanks to Shadcn, the process is now much easier
          and the results look far better. After dedicating significant time to
          working on forms, I decided to invest even more and create this
          open-source project (coming soon) to share my work with the community.
        </p>
        <p className="text-muted-foreground">
          The goal of this project is to build the ultimate form builder using
          Shadcn, React Hook Form, and Zod—so you can spend less time wrestling
          with forms and more time enjoying life (or debugging something else).
          Sure, you might say, “Hey, there’s already a v0 for that,” or “AI can
          handle this!” And yes, you’d be right… but as an engineer, I have a
          soft spot for overengineering. Why take the easy route when you can
          make it extra?
        </p>
        <p className="text-muted-foreground">
          I plan to open source this project as soon as I complete my roadmap,
          so stay tuned! In the meantime, feel free to DM me on{' '}
          <Link href="https://x.com/strad3r" target="_blank">
            Twitter
          </Link>{' '}
          (yes, it’s still Twitter for me).
        </p>
      </div>
      <div className="space-y-4 ">
        <h2 className="text-3xl font-bold">Resources</h2>
        <p className="text-muted-foreground">
          A huge thanks to the following developers! I truly appreciate their
          contributions to the community. I want to clarify that I haven’t
          reached out to ask for permission to use their work, but if they
          contact me with any concerns about removal, I will address it
          immediately.
        </p>
        <div className="flex gap-2">
          {resourcesList.map((item: UserLinkProps, index: number) => (
            <UserLink
              key={index}
              href={item.href}
              avatarSrc={item.avatarSrc}
              name={item.name}
              xLink={item.xLink}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
