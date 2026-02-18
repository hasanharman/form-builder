'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  ChevronRight,
  Clipboard,
  File,
  Folder,
  Loader2,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
  Terminal,
} from 'lucide-react'
import { Highlight, themes } from 'prism-react-renderer'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ViewerTab = 'preview' | 'code'
type Device = 'desktop' | 'tablet' | 'mobile'

type TemplateCodeFile = {
  filename: string
  label: string
  path: string
}

type FolderNode = {
  type: 'folder'
  name: string
  path: string
  children: FileNode[]
}

type FileLeafNode = {
  type: 'file'
  name: string
  path: string
  file: TemplateCodeFile
}

type FileNode = FolderNode | FileLeafNode

interface TemplateBlockViewerProps {
  slug: string
  description?: string
  codeFiles?: TemplateCodeFile[]
  pnpmBlockName?: string
  children: React.ReactNode
}

const defaultCodeFile = (slug: string): TemplateCodeFile => ({
  filename: slug,
  label: `${slug}.tsx`,
  path: `components/templates/${slug}.tsx`,
})

function buildFileTree(files: TemplateCodeFile[]) {
  const root: FolderNode = {
    type: 'folder',
    name: 'root',
    path: '',
    children: [],
  }

  for (const file of files) {
    const parts = file.path.split('/')
    let current: FolderNode = root

    parts.forEach((part, index) => {
      const currentPath = parts.slice(0, index + 1).join('/')
      const isLast = index === parts.length - 1

      if (isLast) {
        const existingLeaf = current.children.find(
          (child) => child.type === 'file' && child.path === currentPath
        )

        if (!existingLeaf) {
          current.children.push({
            type: 'file',
            name: part,
            path: currentPath,
            file,
          })
        }

        return
      }

      let folder = current.children.find(
        (child) => child.type === 'folder' && child.path === currentPath
      ) as FolderNode | undefined

      if (!folder) {
        folder = {
          type: 'folder',
          name: part,
          path: currentPath,
          children: [],
        }
        current.children.push(folder)
      }

      current = folder
    })
  }

  return root.type === 'folder' ? root.children : []
}

function FileTreeItem({
  node,
  depth,
  activeFile,
  onSelect,
}: {
  node: FileNode
  depth: number
  activeFile: string
  onSelect: (file: TemplateCodeFile) => void
}) {
  const basePadding = 12

  if (node.type === 'file') {
    return (
      <li>
        <button
          type="button"
          onClick={() => onSelect(node.file)}
          className={cn(
            'flex w-full items-center gap-2 rounded-none py-1.5 text-left text-sm transition-colors',
            node.file.filename === activeFile
              ? 'bg-muted/70 font-medium text-foreground'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
          style={{ paddingLeft: `${basePadding + depth * 14}px` }}
        >
          <span className="inline-flex size-4 items-center justify-center">
            <File className="size-3.5" />
          </span>
          <span className="truncate">{node.name}</span>
        </button>
      </li>
    )
  }

  return (
    <li>
      <details open className="group">
        <summary
          className="flex cursor-pointer list-none items-center gap-2 py-1.5 text-sm text-foreground [&::-webkit-details-marker]:hidden"
          style={{ paddingLeft: `${basePadding + depth * 14}px` }}
        >
          <ChevronRight className="size-3.5 transition-transform group-open:rotate-90" />
          <Folder className="size-3.5" />
          <span className="truncate">{node.name}</span>
        </summary>
        <ul>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              activeFile={activeFile}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </details>
    </li>
  )
}

export function TemplateBlockViewer({
  slug,
  description,
  codeFiles,
  pnpmBlockName,
  children,
}: TemplateBlockViewerProps) {
  const files = useMemo(() => codeFiles ?? [defaultCodeFile(slug)], [codeFiles, slug])
  const fileTree = useMemo(() => buildFileTree(files), [files])

  const [view, setView] = useState<ViewerTab>('preview')
  const [device, setDevice] = useState<Device>('desktop')
  const [previewKey, setPreviewKey] = useState(0)
  const [activeFile, setActiveFile] = useState<TemplateCodeFile>(files[0])
  const [codeByFile, setCodeByFile] = useState<Record<string, string>>({})
  const [isLoadingCode, setIsLoadingCode] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [isCommandCopied, setIsCommandCopied] = useState(false)

  const cliCommand = `pnpm dlx shadcn@latest add ${pnpmBlockName ?? slug}`
  const previewWidth = device === 'desktop' ? 100 : device === 'tablet' ? 60 : 30
  const v0Url = useMemo(
    () =>
      `https://v0.dev/chat?q=${encodeURIComponent(
        `Create a ${slug} authentication template with shadcn/ui and clean TypeScript.`
      )}`,
    [slug]
  )

  useEffect(() => {
    setActiveFile(files[0])
  }, [files])

  useEffect(() => {
    let ignore = false

    async function fetchCode() {
      if (codeByFile[activeFile.filename]) {
        setCodeError('')
        return
      }

      setIsLoadingCode(true)
      setCodeError('')

      try {
        const response = await fetch(`/api/file/${activeFile.filename}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load code.')
        }

        if (!ignore) {
          setCodeByFile((prev) => ({ ...prev, [activeFile.filename]: data.content }))
        }
      } catch (error) {
        if (!ignore) {
          setCodeError(error instanceof Error ? error.message : 'Failed to load code.')
        }
      } finally {
        if (!ignore) {
          setIsLoadingCode(false)
        }
      }
    }

    void fetchCode()

    return () => {
      ignore = true
    }
  }, [activeFile, codeByFile])

  const activeCode = codeByFile[activeFile.filename]

  return (
    <div className="group/block-view-wrapper flex min-w-0 flex-col gap-4">
      <div className="flex w-full flex-wrap items-center gap-2 md:pr-2">
        <Tabs value={view} onValueChange={(value) => setView(value as ViewerTab)}>
          <TabsList className="grid h-8 grid-cols-2 items-center rounded-lg p-1">
            <TabsTrigger value="preview" className="h-6 rounded-sm px-2 text-xs">
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="h-6 rounded-sm px-2 text-xs">
              Code
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Separator orientation="vertical" className="mx-2 hidden h-4 md:block" />
        <p className="text-sm font-medium text-muted-foreground">{description?.replace(/\.$/, '')}</p>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex h-8 items-center gap-1.5 rounded-md border p-[3px]">
            <Button
              size="icon"
              variant={device === 'desktop' ? 'secondary' : 'ghost'}
              className="size-6 rounded-sm p-0"
              title="Desktop"
              onClick={() => {
                setView('preview')
                setDevice('desktop')
              }}
            >
              <Monitor className="size-4" />
              <span className="sr-only">Desktop</span>
            </Button>
            <Button
              size="icon"
              variant={device === 'tablet' ? 'secondary' : 'ghost'}
              className="size-6 rounded-sm p-0"
              title="Tablet"
              onClick={() => {
                setView('preview')
                setDevice('tablet')
              }}
            >
              <Tablet className="size-4" />
              <span className="sr-only">Tablet</span>
            </Button>
            <Button
              size="icon"
              variant={device === 'mobile' ? 'secondary' : 'ghost'}
              className="size-6 rounded-sm p-0"
              title="Mobile"
              onClick={() => {
                setView('preview')
                setDevice('mobile')
              }}
            >
              <Smartphone className="size-4" />
              <span className="sr-only">Mobile</span>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button
              size="icon"
              variant="ghost"
              className="size-6 rounded-sm p-0"
              title="Refresh Preview"
              onClick={() => {
                setView('preview')
                setPreviewKey((value) => value + 1)
              }}
            >
              <RotateCw className="size-4" />
              <span className="sr-only">Refresh Preview</span>
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-fit gap-1 px-2 text-xs shadow-none"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(cliCommand)
              setIsCommandCopied(true)
              toast.success('Install command copied.')
              setTimeout(() => setIsCommandCopied(false), 1600)
            }}
          >
            {isCommandCopied ? <Check className="size-3.5" /> : <Terminal className="size-3.5" />}
            <span>{cliCommand}</span>
          </Button>

          <Button size="sm" className="h-8 px-3 text-xs" asChild>
            <a href={v0Url} target="_blank" rel="noreferrer">
              Open in v0
            </a>
          </Button>
        </div>
      </div>

      {view === 'preview' ? (
        <div className="relative grid w-full gap-4">
          <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]" />
          <div className="relative z-10">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border bg-background">
              <div
                key={previewKey}
                className="relative h-full overflow-y-auto border-r transition-[width] duration-200 ease-linear"
                style={{ width: `${previewWidth}%` }}
              >
                <div className="flex min-h-full items-center justify-center px-6 py-10 md:px-8 md:py-14">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mr-[14px] flex aspect-[4/3] overflow-hidden rounded-xl border bg-background">
          <aside className="w-72 shrink-0 border-r bg-muted/20">
            <div className="flex h-12 items-center border-b px-4 text-sm font-medium">Files</div>
            <div className="h-[calc(100%-3rem)] overflow-y-auto py-2">
              <ul>
                {fileTree.map((node) => (
                  <FileTreeItem
                    key={node.path}
                    node={node}
                    depth={0}
                    activeFile={activeFile.filename}
                    onSelect={setActiveFile}
                  />
                ))}
              </ul>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-12 items-center gap-2 border-b px-4 py-2 text-sm text-muted-foreground">
              <File className="size-4" />
              <span className="truncate">{activeFile.path}</span>
              {!!activeCode && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="ml-auto size-7"
                  onClick={async () => {
                    await navigator.clipboard.writeText(activeCode)
                    toast.success('Code copied.')
                  }}
                >
                  <Clipboard className="size-4" />
                  <span className="sr-only">Copy code</span>
                </Button>
              )}
            </div>

            <div className="h-[calc(100%-3rem)] overflow-auto">
              {isLoadingCode ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Loading code...
                </div>
              ) : codeError ? (
                <div className="m-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {codeError}
                </div>
              ) : (
                <Highlight code={activeCode ?? ''} language="tsx" theme={themes.oneDark}>
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={cn(className, 'min-h-full overflow-x-auto p-4 text-sm')} style={style}>
                      {tokens.map((line, lineIndex) => (
                        <div key={lineIndex} {...getLineProps({ line, key: lineIndex })}>
                          {line.map((token, tokenIndex) => (
                            <span key={tokenIndex} {...getTokenProps({ token, key: tokenIndex })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
