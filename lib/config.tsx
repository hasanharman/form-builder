import { Icons } from '@/components/icons'
import { FaTwitter } from 'react-icons/fa'
import { FaYoutube } from 'react-icons/fa6'
import { RiInstagramFill } from 'react-icons/ri'

export const BLUR_FADE_DELAY = 0.15

export const siteConfig = {
  name: 'acme.ai',
  description: 'Automate your workflow with AI',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  keywords: ['SaaS', 'Template', 'Next.js', 'React', 'Tailwind CSS'],
  links: {
    email: 'support@acme.ai',
    twitter: 'https://twitter.com/magicuidesign',
    discord: 'https://discord.gg/87p2vpsat5',
    github: 'https://github.com/magicuidesign/magicui',
    instagram: 'https://instagram.com/magicuidesign/',
  },
  // header: [
  //   {
  //     trigger: "Features",
  //     content: {
  //       main: {
  //         icon: <Icons.logo className="h-6 w-6" />,
  //         title: "AI-Powered Automation",
  //         description: "Streamline your workflow with intelligent automation.",
  //         href: "#",
  //       },
  //       items: [
  //         {
  //           href: "#",
  //           title: "Task Automation",
  //           description: "Automate repetitive tasks and save time.",
  //         },
  //         {
  //           href: "#",
  //           title: "Workflow Optimization",
  //           description: "Optimize your processes with AI-driven insights.",
  //         },
  //         {
  //           href: "#",
  //           title: "Intelligent Scheduling",
  //           description: "AI-powered scheduling for maximum efficiency.",
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     trigger: "Solutions",
  //     content: {
  //       items: [
  //         {
  //           title: "For Small Businesses",
  //           href: "#",
  //           description: "Tailored automation solutions for growing companies.",
  //         },
  //         {
  //           title: "Enterprise",
  //           href: "#",
  //           description: "Scalable AI automation for large organizations.",
  //         },
  //         {
  //           title: "Developers",
  //           href: "#",
  //           description: "API access and integration tools for developers.",
  //         },
  //         {
  //           title: "Healthcare",
  //           href: "#",
  //           description: "Specialized automation for healthcare workflows.",
  //         },
  //         {
  //           title: "Finance",
  //           href: "#",
  //           description: "AI-driven process automation for financial services.",
  //         },
  //         {
  //           title: "Education",
  //           href: "#",
  //           description:
  //             "Streamline administrative tasks in educational institutions.",
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     href: "/blog",
  //     label: "Blog",
  //   },
  // ],
  // pricing: [
  //   {
  //     name: "BASIC",
  //     href: "#",
  //     price: "$19",
  //     period: "month",
  //     yearlyPrice: "$16",
  //     features: [
  //       "1 User",
  //       "5GB Storage",
  //       "Basic Support",
  //       "Limited API Access",
  //       "Standard Analytics",
  //     ],
  //     description: "Perfect for individuals and small projects",
  //     buttonText: "Subscribe",
  //     isPopular: false,
  //   },
  //   {
  //     name: "PRO",
  //     href: "#",
  //     price: "$49",
  //     period: "month",
  //     yearlyPrice: "$40",
  //     features: [
  //       "5 Users",
  //       "50GB Storage",
  //       "Priority Support",
  //       "Full API Access",
  //       "Advanced Analytics",
  //     ],
  //     description: "Ideal for growing businesses and teams",
  //     buttonText: "Subscribe",
  //     isPopular: true,
  //   },
  //   {
  //     name: "ENTERPRISE",
  //     href: "#",
  //     price: "$99",
  //     period: "month",
  //     yearlyPrice: "$82",
  //     features: [
  //       "Unlimited Users",
  //       "500GB Storage",
  //       "24/7 Premium Support",
  //       "Custom Integrations",
  //       "AI-Powered Insights",
  //     ],
  //     description: "For large-scale operations and high-volume users",
  //     buttonText: "Subscribe",
  //     isPopular: false,
  //   },
  // ],
  faqs: [
    {
      question: 'What is this tool for?',
      answer: (
        <span>
          This tool simplifies the form-building process for developers,
          particularly those using Next.js and related technologies.
        </span>
      ),
    },
    {
      question: 'Is this tool free?',
      answer: <span>Yes, this tool is completely free and open-source.</span>,
    },
    {
      question: 'How often is it updated?',
      answer: (
        <span>
          I strive to update it weekly based on user feedback, but I guarantee
          at least a monthly update.
        </span>
      ),
    },
    {
      question: 'I encountered a bug; what should I do?',
      answer: (
        <span>
          Shh! Bugs are our little secret. Please DM me or open an issue on
          GitHub, and I’ll address it as soon as possible. Your assistance in
          fixing it would be greatly appreciated.
        </span>
      ),
    },
    {
      question: 'How can I contribute?',
      answer: (
        <span>
          Please refer to the contribution guide on GitHub. You can also DM me
          on Twitter to discuss how you can help.
        </span>
      ),
    },
  ],

  // footer: [
  //   {
  //     title: 'Product',
  //     links: [
  //       { href: '#', text: 'Features', icon: null },
  //       { href: '#', text: 'Pricing', icon: null },
  //       { href: '#', text: 'Documentation', icon: null },
  //       { href: '#', text: 'API', icon: null },
  //     ],
  //   },
  //   {
  //     title: 'Company',
  //     links: [
  //       { href: '#', text: 'About Us', icon: null },
  //       { href: '#', text: 'Careers', icon: null },
  //       { href: '#', text: 'Blog', icon: null },
  //       { href: '#', text: 'Press', icon: null },
  //       { href: '#', text: 'Partners', icon: null },
  //     ],
  //   },
  //   {
  //     title: 'Resources',
  //     links: [
  //       { href: '#', text: 'Community', icon: null },
  //       { href: '#', text: 'Contact', icon: null },
  //       { href: '#', text: 'Support', icon: null },
  //       { href: '#', text: 'Status', icon: null },
  //     ],
  //   },
  //   {
  //     title: 'Social',
  //     links: [
  //       {
  //         href: '#',
  //         text: 'Twitter',
  //         icon: <FaTwitter />,
  //       },
  //       {
  //         href: '#',
  //         text: 'Instagram',
  //         icon: <RiInstagramFill />,
  //       },
  //       {
  //         href: '#',
  //         text: 'Youtube',
  //         icon: <FaYoutube />,
  //       },
  //     ],
  //   },
  // ],
}

export type SiteConfig = typeof siteConfig
