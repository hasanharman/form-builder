'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { ColorPicker } from '@/components/ui/color-picker'

const previewCode = `<ColorPicker value={color} onChange={setColor} />`
const usageCode = `import { ColorPicker } from '@/components/ui/color-picker'

const [color, setColor] = React.useState('#7c3aed')

<ColorPicker value={color} onChange={setColor} />`

export default function ColorPickerPreview() {
  const [color, setColor] = React.useState('#7c3aed')

  return (
    <ComponentDocShell
      title="Color Picker"
      slug="color-picker"
      description="Figma-like color picker with saturation/value canvas, hue + alpha sliders, format switching, eyedropper, and swatches."
      preview={<ColorPicker value={color} onChange={setColor} />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        '2D saturation/value color plane with draggable thumb.',
        'Hue slider and alpha slider with live gradient tracks.',
        'Format input modes: Hex, RGB, and HSL.',
        'EyeDropper API support when available in the browser.',
        'Returns a CSS-safe hex/hexa color string via onChange.',
      ]}
      notes={<p>Current value: <code>{color.toUpperCase()}</code></p>}
    />
  )
}
