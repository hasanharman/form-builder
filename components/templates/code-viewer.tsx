'use client'

import { useEffect, useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { toast } from 'sonner'
import { Files } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface CodeViewerProps {
  filename: string
}

export function CodeViewer({ filename }: CodeViewerProps) {
  const [code, setCode] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCode() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/file/${filename}`)
        const data = await response.json()

        if (response.ok) {
          setCode(data.content)
        } else {
          setError(data.error || 'Failed to load code')
        }
      } catch (err) {
        setError('Failed to fetch code')
      } finally {
        setIsLoading(false)
      }
    }

    if (filename) {
      fetchCode()
    }
  }, [filename])

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        <h3 className="font-semibold">Error Loading Code</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4 text-gray-500">Loading code for {filename}...</div>
    )
  }

  return (
    <div className="relative max-w-xs md:max-w-none">
      <Button
        className="absolute right-2 top-2"
        variant="secondary"
        size="icon"
        onClick={() => {
          navigator.clipboard.writeText(code)
          toast.success('Code copied to clipboard!')
        }}
      >
        <Files />
      </Button>
      <Highlight code={code} language="tsx" theme={themes.oneDark}>
        {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
          <pre
            className={`${className} w-full p-4 text-sm bg-gray-100 rounded-lg 
          overflow-auto`}
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
