'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { ImageUploadDropzone } from '@/components/ui/image-upload-dropzone'

const previewCode = `<ImageUploadDropzone value={image} onChange={setImage} />`
const usageCode = `import { ImageUploadDropzone } from '@/components/ui/image-upload-dropzone'

<ImageUploadDropzone value={image} onChange={setImage} />`

export default function ImageUploadDropzonePreview() {
  const [image, setImage] = React.useState<string | null>(null)

  return (
    <ComponentDocShell
      title="Image Upload / Dropzone"
      slug="image-upload-dropzone"
      description="Drag-and-drop image upload with preview, center crop, and progress feedback."
      preview={<ImageUploadDropzone value={image} onChange={setImage} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={['Drag-and-drop upload.', 'Preview and remove actions.', 'Center-square crop helper.']}
    />
  )
}
