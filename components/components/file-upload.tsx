'use client'

import * as React from 'react'
import { Paperclip, Upload } from 'lucide-react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload'

const dropzoneOptions = {
  maxFiles: 5,
  maxSize: 1024 * 1024 * 4,
  multiple: true,
}

const previewCode = `<FileUploader value={files} onValueChange={setFiles} dropzoneOptions={dropzoneOptions}>
  <FileInput className="outline-dashed outline-1">
    <p className="p-6 text-sm">Drop files or click to upload</p>
  </FileInput>
  <FileUploaderContent>
    {files?.map((file, i) => (
      <FileUploaderItem key={i} index={i}>
        {file.name}
      </FileUploaderItem>
    ))}
  </FileUploaderContent>
</FileUploader>`

const usageCode = `import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload'

const [files, setFiles] = React.useState<File[] | null>(null)
const dropzoneOptions = { maxFiles: 5, maxSize: 1024 * 1024 * 4, multiple: true }

${previewCode}`

export default function FileUploadPreview() {
  const [files, setFiles] = React.useState<File[] | null>(null)

  return (
    <ComponentDocShell
      name="file-upload"
      preview={
        <FileUploader
          value={files}
          onValueChange={setFiles}
          dropzoneOptions={dropzoneOptions}
          className="relative rounded-lg bg-background p-2"
        >
          <FileInput className="outline-dashed outline-1 outline-muted-foreground">
            <div className="flex flex-col items-center gap-2 p-6 text-sm text-muted-foreground">
              <Upload className="size-5" />
              Drop files or click to upload (max 5, 4MB each)
            </div>
          </FileInput>
          <FileUploaderContent>
            {files?.map((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className="size-4" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
          </FileUploaderContent>
        </FileUploader>
      }
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Drag and drop or click, powered by react-dropzone.',
        'File count and size limits with toast feedback (sonner).',
        'Arrow keys move between files; Delete removes one.',
      ]}
    />
  )
}
