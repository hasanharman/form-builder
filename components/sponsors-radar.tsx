"use client"
import Logo from '@/assets/logo.svg'
import ShadcnSpaceLogo from '@/assets/sponsors/shadcnspace.webp'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  getSponsorsByTier,
  pastSponsors,
  type Sponsor,
  getSponsorUrl,
} from '@/data/sponsors'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { useState } from 'react'

export default function IntegrationsSection() {
  // Active sponsors by tier
  const headerSponsors = getSponsorsByTier('header')
  const projectSponsors = getSponsorsByTier('project')
  const communitySponsors = getSponsorsByTier('community')

  // Choose up to 3 per ring to match layout
  const outerRing: Sponsor[] = headerSponsors.slice(0, 3)
  const middleRing: Sponsor[] = projectSponsors.slice(0, 3)
  const innerRing: Sponsor[] = communitySponsors.slice(0, 3)

  return (
    <section>
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="aspect-16/10 group relative mx-auto flex max-w-[22rem] items-center justify-between sm:max-w-sm">
            <div
              role="presentation"
              className="pointer-events-none bg-linear-to-b border-foreground/5 absolute inset-0 z-10 aspect-square animate-spin items-center justify-center rounded-full border-t from-orange-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100 dark:from-orange-400/10"
            ></div>
            <div
              role="presentation"
              className="pointer-events-none bg-linear-to-b border-foreground/5 absolute inset-16 z-10 aspect-square scale-90 animate-spin items-center justify-center rounded-full border-t from-orange-600/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100"
            ></div>
            <div
              role="presentation"
              className="pointer-events-none bg-linear-to-b border-foreground/5 absolute inset-28 z-10 aspect-square scale-75 animate-spin items-center justify-center rounded-full border-t from-orange-400/10 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100"
            ></div>
            <div className="bg-linear-to-b from-muted-foreground/15 absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t to-transparent to-25%">
              {outerRing[0] && (
                <IntegrationCard
                  className="-translate-x-1/6 absolute left-0 top-1/4 -translate-y-1/4"
                  sponsor={outerRing[0]}
                />
              )}
              {outerRing[1] && (
                <IntegrationCard
                  className="absolute top-0 -translate-y-1/2"
                  sponsor={outerRing[1]}
                />
              )}
              {outerRing[2] && (
                <IntegrationCard
                  className="translate-x-1/6 absolute right-0 top-1/4 -translate-y-1/4"
                  sponsor={outerRing[2]}
                />
              )}
            </div>
            <div className="bg-linear-to-b from-muted-foreground/15 absolute inset-16 flex aspect-square scale-90 items-center justify-center rounded-full border-t to-transparent to-25%">
              {middleRing[0] && (
                <IntegrationCard
                  className="absolute top-0 -translate-y-1/2"
                  sponsor={middleRing[0]}
                />
              )}
              {middleRing[1] && (
                <IntegrationCard
                  className="absolute left-0 top-1/4 -translate-x-1/4 -translate-y-1/4"
                  sponsor={middleRing[1]}
                />
              )}
              {middleRing[2] && (
                <IntegrationCard
                  className="absolute right-0 top-1/4 -translate-y-1/4 translate-x-1/4"
                  sponsor={middleRing[2]}
                />
              )}
            </div>
            <div className="bg-linear-to-b from-muted-foreground/15 absolute inset-28 flex aspect-square scale-75 items-center justify-center rounded-full border-t to-transparent to-25%">
              {innerRing[0] && (
                <IntegrationCard
                  className="absolute top-0 -translate-y-1/2"
                  sponsor={innerRing[0]}
                />
              )}
              {innerRing[1] && (
                <IntegrationCard
                  className="absolute left-0 top-1/4 -translate-x-1/4 -translate-y-1/4"
                  sponsor={innerRing[1]}
                />
              )}
              {innerRing[2] && (
                <IntegrationCard
                  className="absolute right-0 top-1/4 -translate-y-1/4 translate-x-1/4"
                  sponsor={innerRing[2]}
                />
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 mx-auto my-2 flex w-fit justify-center gap-2">
              <IntegrationCard
                className="shadow-black/20 size-16 shadow-xl"
                isCenter={true}
              >
                {/* Center: shadcn-form logo on white disk for contrast */}
                <Logo className="size-8" />
              </IntegrationCard>
            </div>
          </div>
          <div className="bg-linear-to-t from-background relative z-20 mx-auto mt-12 max-w-lg space-y-6 from-55% text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Sponsor shadcn-form
            </h2>
            <p className="text-muted-foreground">
              Your sponsorship helps keep the form builder maintained, improve
              templates, and ship new blocks. Thanks for supporting open source.
            </p>

            <Link href="/sponsors" className="inline-block">
              <Button size="sm" className="rounded-full">
                Become a Sponsor
              </Button>
            </Link>

            {/* Past sponsors in a single line, avatars with hover names */}
            {pastSponsors.length > 0 && (
              <div className="mt-4  max-w-full items-center gap-2 overflow-x-auto whitespace-nowrap px-1">
                {pastSponsors.map((s) => (
                  <SponsorAvatarPopover
                    key={s.id}
                    sponsor={s}
                    sizeClass="size-6"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const IntegrationCard = ({
  children,
  className,
  isCenter = false,
  sponsor,
}: {
  children?: React.ReactNode
  className?: string
  position?:
    | 'left-top'
    | 'left-middle'
    | 'left-bottom'
    | 'right-top'
    | 'right-middle'
    | 'right-bottom'
  isCenter?: boolean
  sponsor?: Sponsor
}) => {
  return isCenter ? (
    <div
      className={cn(
        'relative z-30 flex items-center justify-center rounded-full bg-white text-black',
        className,
      )}
    >
      {children}
    </div>
  ) : (
    <div className={cn('relative z-30', className)}>
      {sponsor ? (
        <SponsorAvatarPopover sponsor={sponsor} sizeClass="size-12" />
      ) : (
        children
      )}
    </div>
  )
}

function SponsorAvatarPopover({
  sponsor,
  sizeClass = 'size-5',
}: {
  sponsor: Sponsor
  sizeClass?: string
}) {
  const [open, setOpen] = useState<boolean>(false)

  const initials = sponsor.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  const avatarContent = (
    <Avatar className={sizeClass}>
      <AvatarImage
        src={
          sponsor.name === 'shadcnspace.com'
            ? (ShadcnSpaceLogo as any).src
            : sponsor.image
        }
        alt={sponsor.name}
      />
      <AvatarFallback className="text-[10px] font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="inline-flex"
        >
          {sponsor.url ? (
            <Link href={getSponsorUrl(sponsor, 'landing')} target="_blank" rel="noopener noreferrer">
              {avatarContent}
            </Link>
          ) : (
            avatarContent
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent side="top" className="px-2 py-1 text-xs">
        {sponsor.name}
      </PopoverContent>
    </Popover>
  )
}
