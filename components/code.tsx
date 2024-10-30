import { Highlight, themes } from 'prism-react-renderer'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { Clipboard } from 'lucide-react'

interface CodeProps {
  code: string
  customStyle?: string
}

export default function Code({ code, customStyle }: CodeProps) {
  return (
    <div className="relative max-w-xs md:max-w-none">
      <Button
        className="absolute w-fit right-2 p-2 top-2 text-gray-100 hover:bg-gray-700 hover:text-gray-200"
        variant="ghost"
        onClick={() => {
          navigator.clipboard.writeText(code)
          toast.success('Code copied to clipboard!')
        }}
      >
        <Clipboard className="w-5" />
      </Button>
      <Highlight code={code} language="tsx" theme={themes.oneDark}>
        {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
          <pre
            className={`${customStyle} w-full p-4 text-sm bg-gray-100 rounded-lg overflow-auto ${className}`}
            style={style}
          >
            {tokens.map((line: any, i: number) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token: any, key: any) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
