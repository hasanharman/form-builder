import Features from '@/components/features-vertical'
import Section from '@/components/section'
import { MousePointerClick, Code, ArrowUpDown } from 'lucide-react'

const data = [
  {
    id: 1,
    title: '1. Choose Your Components',
    content:
      'Select from a rich library of pre-built form components. Customize and combine them effortlessly to create forms tailored to your needs.',
    image: '/customization.webp',
    icon: <MousePointerClick className="w-6 h-6 text-primary" />,
  },
  {
    id: 2,
    title: '2. Add or Reorder Fields',
    content:
      'Easily add new form fields or rearrange existing ones. Our intuitive interface lets you structure your form exactly the way you want.',
    image: '/validation.webp',
    icon: <ArrowUpDown className="w-6 h-6 text-primary" />,
  },
  {
    id: 3,
    title: '3. Set Up Form Generation Options',
    content:
      'Define how your form should behave. Configure validation rules, set SSR options, and choose your validation library for maximum flexibility.',
    image: '/code.webp',
    icon: <Code className="w-6 h-6 text-primary" />,
  },
]

export default function Component() {
  return (
    <Section title="How it works" subtitle="Just 3 steps to make a form">
      <Features data={data} />
    </Section>
  )
}
