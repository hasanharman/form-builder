import BlurFade from '@/components/magicui/blur-fade'
import Section from '@/components/section'
import { Card, CardContent } from '@/components/ui/card'
import { Repeat2, ShieldClose, Workflow } from 'lucide-react'

const problems = [
  {
    title: 'Tedious Repetition',
    description:
      'Manual form-building processes lead to inefficiencies, wasting time on repetitive tasks that could be automated for faster delivery.',
    icon: Repeat2,
  },
  {
    title: 'Inefficient Workflow',
    description:
      'Outdated tools slow down form creation, causing delays in project timelines and missed opportunities for optimization.',
    icon: Workflow,
  },
  {
    title: 'Complex Validation Setup',
    description:
      'Implementing robust form validation is often cumbersome and prone to errors, increasing the risk of invalid data submission.',
    icon: ShieldClose,
  },
]

export default function Component() {
  return (
    <Section
      title="FORM HEADACHE"
      subtitle="Crafting forms manually is like assembling IKEA furniture: confusing and often leads to extra pieces!"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {problems.map((problem, index) => (
          <BlurFade key={index} delay={0.2 + index * 0.2} inView>
            <Card className="bg-background border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <problem.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </Section>
  )
}
