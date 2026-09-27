'use client'

import { CloudUpload, Paperclip } from 'lucide-react'

import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload'
import { code, zx } from './schema-expr'
import type { FieldVariant } from './types'

const dropzoneOptions = { maxFiles: 5, maxSize: 1024 * 1024 * 4, multiple: true }

export const fileInputVariant: FieldVariant = {
  name: 'File Input',
  defaults: { label: 'Select File', description: 'Select a file to upload.' },
  registryItems: ['file-upload'],
  imports: () => [
    'import { CloudUpload, Paperclip } from "lucide-react"',
    'import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload"',
  ],
  declarations: ['const dropzoneOptions = { maxFiles: 5, maxSize: 1024 * 1024 * 4, multiple: true }'],
  schema: (field) => {
    const files = zx.array(zx.instanceof(code(File, 'File')))
    return field.required ? files.min(1, { message: 'Select at least one file' }) : files
  },
  defaultValue: () => [],
  Control: ({ value, onChange }) => (
    <FileUploader
      value={value}
      onValueChange={(files) => onChange(files ?? [])}
      dropzoneOptions={dropzoneOptions}
      className="relative rounded-lg bg-background p-2"
    >
      <FileInput className="outline-dashed outline-1 outline-muted-foreground">
        <div className="flex w-full flex-col items-center justify-center p-8">
          <CloudUpload className="size-10 text-muted-foreground" />
          <p className="mb-1 text-sm text-muted-foreground">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
        </div>
      </FileInput>
      <FileUploaderContent>
        {(value as File[] | undefined)?.map((file, index) => (
          <FileUploaderItem key={index} index={index}>
            <Paperclip className="size-4 stroke-current" />
            <span>{file.name}</span>
          </FileUploaderItem>
        ))}
      </FileUploaderContent>
    </FileUploader>
  ),
  control: (_field, b) => `<FileUploader
  value={${b.value}}
  onValueChange={(files) => ${b.onChange('files ?? []')}}
  dropzoneOptions={dropzoneOptions}
  className="relative rounded-lg bg-background p-2"
>
  <FileInput className="outline-dashed outline-1 outline-muted-foreground">
    <div className="flex w-full flex-col items-center justify-center p-8">
      <CloudUpload className="size-10 text-muted-foreground" />
      <p className="mb-1 text-sm text-muted-foreground">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
    </div>
  </FileInput>
  <FileUploaderContent>
    {${b.value}?.map((file, index) => (
      <FileUploaderItem key={index} index={index}>
        <Paperclip className="size-4 stroke-current" />
        <span>{file.name}</span>
      </FileUploaderItem>
    ))}
  </FileUploaderContent>
</FileUploader>`,
}
