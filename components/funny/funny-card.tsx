'use client'

import * as React from 'react'
import { Link } from 'next-view-transitions'
import { ArrowUpRight } from 'lucide-react'

import { funnyComponents } from '@/components/funny'
import { useMediaQuery } from '@/hooks/use-media-query'

type FunnyCardProps = {
  /** Registry item name. */
  name: string
  title: string
}

export function FunnyCard({ name, title }: FunnyCardProps) {
  const [hovered, setHovered] = React.useState(false)
  // Devices that cannot hover get the demo on a loop instead.
  const autoplay = useMediaQuery('(hover: none)')

  const { teaser: Teaser, isNew } = funnyComponents[name]

  return (
    <Link
      href={`/funny/${name}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group flex flex-col rounded-[32px] border border-black/[0.04] bg-[#F5F5F7] p-2 transition-colors duration-200 ease-out hover:bg-[#EDEDF0] dark:border-white/[0.06] dark:bg-[#121212] dark:hover:bg-muted"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-black/[0.06] bg-white dark:border-neutral-500/15 dark:bg-neutral-950">
        <Teaser playing={hovered || autoplay} />
      </div>
      <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-2">
        <h3 className="flex min-w-0 items-center gap-2 text-base font-semibold tracking-tight">
          <span className="truncate">{title}</span>
          {isNew ? (
            <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-orange-600 dark:text-orange-400">
              New
            </span>
          ) : null}
        </h3>
        <ArrowUpRight
          className="size-5 shrink-0 text-orange-600 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-orange-400"
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}
