import { NextResponse } from 'next/server'

// Minimal shape we return to the client
interface APISponsor {
  id: string
  name: string
  image: string
  url?: string
  tierName?: string
  monthly?: number
  isActive: boolean
}

interface APIResponseShape {
  active: {
    header: APISponsor[]
    project: APISponsor[]
    community: APISponsor[]
  }
  past: APISponsor[]
}

const headers = {
  'Content-Type': 'application/json',
}

// GraphQL query to fetch sponsors for the maintainer (account)
const SPONSORS_QUERY = `
  query($login: String!) {
    user(login: $login) {
      sponsorshipsAsMaintainer(first: 100, includePrivate: true) {
        nodes {
          isActive
          tier { name monthlyPriceInDollars }
          sponsorEntity {
            __typename
            ... on User { id login name avatarUrl url }
            ... on Organization { id login name avatarUrl url }
          }
        }
      }
    }
  }
`

export async function GET() {
  const ghLogin = process.env.NEXT_PUBLIC_GH_LOGIN || 'hasanharman'
  const token = process.env.GITHUB_TOKEN || process.env.GH_SPONSORS_TOKEN

  // Fallback to local data when token not provided
  if (!token) {
    // Lazy import to avoid bundling on edge
    const { featuredSponsors, pastSponsors } = await import('@/data/sponsors')

    const resp: APIResponseShape = {
      active: {
        header: featuredSponsors
          .filter((s) => s.tier === 'header' && s.isActive)
          .map((s) => ({
            id: String(s.id),
            name: s.name,
            image: s.image,
            url: s.url,
            tierName: 'Header Sponsor',
            monthly: 100,
            isActive: true,
          })),
        project: featuredSponsors
          .filter((s) => s.tier === 'project' && s.isActive)
          .map((s) => ({
            id: String(s.id),
            name: s.name,
            image: s.image,
            url: s.url,
            tierName: 'Project Supporter',
            monthly: 50,
            isActive: true,
          })),
        community: featuredSponsors
          .filter((s) => s.tier === 'community' && s.isActive)
          .map((s) => ({
            id: String(s.id),
            name: s.name,
            image: s.image,
            url: s.url,
            tierName: 'Community Supporter',
            monthly: 10,
            isActive: true,
          })),
      },
      past: pastSponsors.map((s) => ({
        id: String(s.id),
        name: s.name,
        image: s.image,
        url: s.url,
        tierName: s.tier,
        monthly: s.tier === 'header' ? 100 : s.tier === 'project' ? 50 : 10,
        isActive: false,
      })),
    }

    return NextResponse.json(resp, { headers })
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SPONSORS_QUERY, variables: { login: ghLogin } }),
      // Avoid Next caching to keep it fresh in production; cache at edge if needed
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`GitHub GraphQL error: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    const nodes = data?.data?.user?.sponsorshipsAsMaintainer?.nodes || []

    const toAPISponsor = (n: any): APISponsor => ({
      id: n?.sponsorEntity?.id ?? Math.random().toString(36).slice(2),
      name: n?.sponsorEntity?.name || n?.sponsorEntity?.login || 'Anonymous',
      image: n?.sponsorEntity?.avatarUrl,
      url: n?.sponsorEntity?.url,
      tierName: n?.tier?.name,
      monthly: n?.tier?.monthlyPriceInDollars,
      isActive: !!n?.isActive,
    })

    const result: APIResponseShape = {
      active: { header: [], project: [], community: [] },
      past: [],
    }

    for (const n of nodes) {
      const s = toAPISponsor(n)
      const tierName = (s.tierName || '').toLowerCase()
      const bucket = s.isActive ? 'active' : 'past'

      if (bucket === 'past') {
        result.past.push(s)
      } else {
        if (tierName.includes('header')) result.active.header.push(s)
        else if (tierName.includes('project')) result.active.project.push(s)
        else result.active.community.push(s)
      }
    }

    return NextResponse.json(result, { headers })
  } catch (e: any) {
    console.error('Sponsors API error', e)
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500, headers })
  }
}
