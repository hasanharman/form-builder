export type SponsorTier = 'header' | 'project' | 'community'

export interface Sponsor {
  id: number
  name: string
  designation: string
  image: string
  tier: SponsorTier
  url?: string
  isActive: boolean
  description?: string
}

// Featured sponsors - Current active sponsors organized by tier
// Two dummy active sponsors for each tier
export const featuredSponsors: Sponsor[] = [
  // Header (100$) — 2 dummy
  //   {
  //     id: 101,
  //     name: 'Header Sponsor A',
  //     designation: 'Header Sponsor',
  //     image: 'https://avatars.githubusercontent.com/u/1?v=4',
  //     tier: 'header',
  //     url: 'https://github.com/mojombo',
  //     isActive: true,
  //     description: 'Premium Sponsor',
  //   },
  {
    id: 101,
    name: 'shadcnstudio.com',
    designation: 'Header Sponsor',
    image: 'https://ts-assets.b-cdn.net/ss-assets/logo/logo.svg',
    tier: 'header',
    url: 'https://shadcnstudio.com/?utm_source=shadcn-form&utm_medium=banner&utm_campaign=sponsor',
    isActive: true,
    description: 'shadcn blocks & templates',
  },

  // Project (50$) — 2 dummy
  //   {
  //     id: 201,
  //     name: 'Project Supporter A',
  //     designation: 'Project Supporter',
  //     image: 'https://avatars.githubusercontent.com/u/3?v=4',
  //     tier: 'project',
  //     url: 'https://github.com/pjhyett',
  //     isActive: true,
  //   },
  //   {
  //     id: 202,
  //     name: 'Project Supporter B',
  //     designation: 'Project Supporter',
  //     image: 'https://avatars.githubusercontent.com/u/4?v=4',
  //     tier: 'project',
  //     url: 'https://github.com/wycats',
  //     isActive: true,
  //   },

  // Community (10$) — 2 dummy
  //   {
  //     id: 301,
  //     name: 'Community Supporter A',
  //     designation: 'Community Supporter',
  //     image: 'https://avatars.githubusercontent.com/u/5?v=4',
  //     tier: 'community',
  //     url: 'https://github.com/ezmobius',
  //     isActive: true,
  //   },
  //   {
  //     id: 302,
  //     name: 'Community Supporter B',
  //     designation: 'Community Supporter',
  //     image: 'https://avatars.githubusercontent.com/u/6?v=4',
  //     tier: 'community',
  //     url: 'https://github.com/ivey',
  //     isActive: true,
  //   },
]

// Past sponsors - People who previously supported the project
export const pastSponsors: Sponsor[] = [
  // Order matters as requested
  {
    id: 1,
    name: 'tino-technology',
    designation: 'Former Project Supporter',
    image: 'https://avatars.githubusercontent.com/u/150597157?s=200&v=4',
    tier: 'project',
    url: 'https://github.com/tino-technology',
    isActive: false,
  },
  {
    id: 2,
    name: 'feliperails',
    designation: 'Former Community Supporter',
    image: 'https://avatars.githubusercontent.com/u/1680000?v=4',
    tier: 'community',
    url: 'https://github.com/feliperails',
    isActive: false,
  },
  {
    id: 3,
    name: 'Radu Ciocan',
    designation: 'Former Project Supporter',
    image: 'https://avatars.githubusercontent.com/u/4984377?v=4',
    tier: 'project',
    url: 'https://github.com/raduciocan',
    isActive: false,
  },
  {
    id: 4,
    name: 'rutsatz',
    designation: 'Former Community Supporter',
    image: 'https://avatars.githubusercontent.com/u/14064725?v=4',
    tier: 'community',
    url: 'https://github.com/rutsatz',
    isActive: false,
  },
  {
    id: 5,
    name: 'Maxim Ciebiera',
    designation: 'Former Header Sponsor',
    image: 'https://avatars.githubusercontent.com/u/47557243?v=4',
    tier: 'header',
    url: 'https://github.com/maxciebiera',
    isActive: false,
  },
]

// Get all active sponsors
export const getActiveSponsors = (): Sponsor[] => {
  return featuredSponsors.filter((sponsor) => sponsor.isActive)
}

// Get sponsors by tier
export const getSponsorsByTier = (tier: SponsorTier): Sponsor[] => {
  return featuredSponsors.filter(
    (sponsor) => sponsor.tier === tier && sponsor.isActive,
  )
}

// Get all sponsors (active + past)
export const getAllSponsors = (): Sponsor[] => {
  return [...featuredSponsors, ...pastSponsors]
}

// Get sponsor URL with appropriate utm_medium based on context
export const getSponsorUrl = (
  sponsor: Sponsor,
  medium: 'landing' | 'header' | 'sponsor_page' | 'github'
): string => {
  if (!sponsor.url) return '#'
  
  const url = new URL(sponsor.url)
  url.searchParams.set('utm_medium', medium)
  
  return url.toString()
}

// Sponsor tier information
export const sponsorTiers = {
  header: {
    name: 'Header Sponsor',
    price: 100,
    benefits: [
      'Logo button in the website header linking to your site',
      'Logo in the main sponsors section of the site (with link)',
      'Highlighted mention in the README "Sponsors" (e.g. in a separate "Header Sponsors" subsection)',
      'All Project Supporter perks',
    ],
  },
  project: {
    name: 'Project Supporter',
    price: 50,
    benefits: [
      'All Community Supporter perks',
      'Linked text mention (name + URL) on the shadcn-form website sponsors section',
      'Your issues and feedback are given priority consideration when planning the roadmap',
      'Early access to some previews/RFCs when available',
    ],
  },
  community: {
    name: 'Community Supporter',
    price: 10,
    benefits: [
      'Your name listed in the README under the "Sponsors" section',
      'Your name listed on the shadcn-form website sponsors section (text only)',
      'Occasional thank you shoutouts in release notes/changelogs',
    ],
  },
}
