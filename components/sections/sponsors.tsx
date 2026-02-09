'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { IoIosArrowRoundForward } from 'react-icons/io'
import {
  getSponsorsByTier,
  getSponsorUrl,
  pastSponsors,
  sponsorTiers,
  type Sponsor,
} from '@/data/sponsors'
import ShadcnSpaceLogo from '@/assets/sponsors/shadcnspace.webp'

function SponsorCard({
  sponsor,
  showButton = false,
  showBorder = false,
}: {
  sponsor: Sponsor
  showButton?: boolean
  showBorder?: boolean
}) {
  const sponsorUrl = getSponsorUrl(sponsor, 'sponsor_page')

  return (
    <Card className="p-6 rounded-3xl">
      <Link href={sponsorUrl} target="_blank" className="block">
        <div className="*:size-16 mb-4">
          <img
            src={
              sponsor.name === 'shadcnspace.com'
                ? (ShadcnSpaceLogo as any).src
                : sponsor.image
            }
            alt={sponsor.name}
            className="rounded-full bg-white dark:bg-white object-cover border"
          />
        </div>
        <div
          className={`space-y-2 ${showBorder ? 'pb-3 border-b border-dashed' : ''}`}
        >
          <h3 className="font-semibold hover:underline">{sponsor.name}</h3>
          {sponsor.description && (
            <p className="text-sm text-muted-foreground">{sponsor.description}</p>
          )}
        </div>
      </Link>
      {showButton && (
        <div className="flex justify-end mt-3">
          <Button
            asChild
            variant="outline"
            className="gap-1 rounded-full group"
          >
            <Link href={sponsorUrl} target="_blank">
              Visit Website
              <IoIosArrowRoundForward className="text-xl transition-transform duration-300 group-hover:-rotate-45" />
            </Link>
          </Button>
        </div>
      )}
    </Card>
  )
}

function TierSection({
  sponsors,
  tierName,
  showButton = false,
  showBorder = false,
}: {
  sponsors: Sponsor[]
  tierName: string
  showButton?: boolean
  showBorder?: boolean
}) {
  if (!sponsors || sponsors.length === 0) return null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold uppercase">{tierName}</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((sponsor) => (
          <SponsorCard
            key={sponsor.id}
            sponsor={sponsor}
            showButton={showButton}
            showBorder={showBorder}
          />
        ))}
      </div>
    </div>
  )
}

function PastSponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  if (!sponsors || sponsors.length === 0) return null

  return (
    <div className="space-y-6 pt-8 border-t">
      <div>
        <h3 className="text-xl font-bold uppercase">Past Sponsors</h3>
        <p className="text-sm text-muted-foreground">
          Thank you for your previous support!
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((sponsor) => (
          <SponsorCard
            key={sponsor.id}
            sponsor={sponsor}
          />
        ))}
      </div>
    </div>
  )
}

export default function SponsorsSection() {
  const active = {
    header: getSponsorsByTier('header'),
    project: getSponsorsByTier('project'),
    community: getSponsorsByTier('community'),
  }
  const past = pastSponsors

  const hasAnySponsors =
    active.header.length +
      active.project.length +
      active.community.length +
      past.length >
    0
  if (!hasAnySponsors) return null

  return (
    <section id="sponsors" className="max-w-5xl mx-auto space-y-8 my-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">SPONSORS</h1>
        <p className="text-muted-foreground">
          A heartfelt thank you to everyone who supports this project! Your
          sponsorship helps keep development active and the project sustainable.
          Whether you&apos;re contributing as a header sponsor, project
          supporter, or community member, your support makes a real difference.
        </p>
        <p className="text-muted-foreground">
          If you&apos;d like to support Shadcn Form Builder, visit our{' '}
          <Link
            href="https://github.com/sponsors/hasanharman"
            target="_blank"
            className="underline hover:text-foreground"
          >
            GitHub Sponsors page
          </Link>
          .
        </p>
      </div>

      <div className="space-y-12">
        <TierSection
          sponsors={active.header}
          tierName={sponsorTiers.header.name}
          showButton={true}
          showBorder={true}
        />
        <TierSection
          sponsors={active.project}
          tierName={sponsorTiers.project.name}
          showButton={true}
          showBorder={true}
        />
        <TierSection
          sponsors={active.community}
          tierName={sponsorTiers.community.name}
        />

        <PastSponsorsSection sponsors={past} />
      </div>
    </section>
  )
}
