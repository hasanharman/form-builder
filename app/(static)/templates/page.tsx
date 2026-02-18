import {
  ArrowRight,
  Database,
  Flame,
  KeyRound,
  Mail,
  MessageSquare,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Link } from 'next-view-transitions'

import { templates } from '@/constants/templates'

const iconMap = {
  shield: Shield,
  key: KeyRound,
  database: Database,
  flame: Flame,
  sparkles: Sparkles,
  mail: Mail,
  message: MessageSquare,
} as const

function BetterAuthLogo() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="500" height="500" fill="black" />
      <rect x="69" y="121" width="86.9879" height="259" fill="white" />
      <rect x="337.575" y="121" width="92.4247" height="259" fill="white" />
      <rect
        x="427.282"
        y="121"
        width="83.4555"
        height="174.52"
        transform="rotate(90 427.282 121)"
        fill="white"
      />
      <rect
        x="430"
        y="296.544"
        width="83.4555"
        height="177.238"
        transform="rotate(90 430 296.544)"
        fill="white"
      />
      <rect
        x="252.762"
        y="204.455"
        width="92.0888"
        height="96.7741"
        transform="rotate(90 252.762 204.455)"
        fill="white"
      />
    </svg>
  )
}

const brandLogoMap: Record<
  string,
  | { lightSrc: string; darkSrc: string; alt: string }
  | { component: React.ComponentType<{ className?: string }> }
> = {
  'shadcn/ui': {
    lightSrc: 'https://cdn.simpleicons.org/shadcnui/111827',
    darkSrc: 'https://cdn.simpleicons.org/shadcnui/FFFFFF',
    alt: 'shadcn/ui logo',
  },
  Clerk: {
    lightSrc: 'https://cdn.simpleicons.org/clerk/111827',
    darkSrc: 'https://cdn.simpleicons.org/clerk/FFFFFF',
    alt: 'Clerk logo',
  },
  Supabase: {
    lightSrc: 'https://cdn.simpleicons.org/supabase/16A34A',
    darkSrc: 'https://cdn.simpleicons.org/supabase/3ECF8E',
    alt: 'Supabase logo',
  },
  Firebase: {
    lightSrc: 'https://cdn.simpleicons.org/firebase/D97706',
    darkSrc: 'https://cdn.simpleicons.org/firebase/FFCA28',
    alt: 'Firebase logo',
  },
  'Better Auth': {
    component: BetterAuthLogo,
  },
}

function BrandBadge({
  logoLabel,
  Icon,
}: {
  logoLabel: string
  Icon: React.ComponentType<{ className?: string }>
}) {
  const brand = brandLogoMap[logoLabel]

  if (!brand) {
    return (
      <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/95 px-2.5 py-1 text-xs text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200">
        <Icon className="h-3.5 w-3.5" />
        {logoLabel}
      </div>
    )
  }

  if ('component' in brand) {
    const Logo = brand.component

    return (
      <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/95 px-2.5 py-1 text-xs text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200">
        <Logo className="h-3.5 w-3.5" />
        {logoLabel}
      </div>
    )
  }

  return (
    <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/95 px-2.5 py-1 text-xs text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200">
      <img
        src={brand.lightSrc}
        alt={brand.alt}
        className="h-3.5 w-3.5 shrink-0 dark:hidden"
      />
      <img
        src={brand.darkSrc}
        alt={brand.alt}
        className="hidden h-3.5 w-3.5 shrink-0 dark:block"
      />
      {logoLabel}
    </div>
  )
}

function LoginMock() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="space-y-2">
        <div className="h-2 w-1/3 rounded bg-slate-300 dark:bg-slate-600" />
        <div className="h-8 rounded border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800" />
        <div className="h-2 w-1/4 rounded bg-slate-300 dark:bg-slate-600" />
        <div className="h-8 rounded border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800" />
        <div className="flex justify-between">
          <div className="h-2 w-1/4 rounded bg-slate-300 dark:bg-slate-600" />
          <div className="h-2 w-1/5 rounded bg-slate-300/70 dark:bg-slate-600/70" />
        </div>
        <div className="h-8 rounded bg-slate-900 dark:bg-slate-100" />
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {templates.map((section) => (
        <section
          key={section.title}
          className="rounded-xl border bg-background/60 backdrop-blur-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b bg-muted/30">
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="text-sm text-muted-foreground">
              {section.description}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-border/60">
            {section.sub.map((template) => {
              const Icon = iconMap[template.icon]

              return (
                <Link
                  key={template.path}
                  href={template.path}
                  className="group block border-r border-b p-4 md:p-5 hover:bg-muted/40 transition-colors"
                >
                  <div className="relative mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-10 rounded-t-lg bg-white/35 backdrop-blur-sm dark:bg-slate-900/35" />
                    <BrandBadge logoLabel={template.logoLabel} Icon={Icon} />
                    <div className="px-8">
                      <LoginMock />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-medium leading-tight">
                      {template.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-sm text-foreground/90">
                      Open template
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
